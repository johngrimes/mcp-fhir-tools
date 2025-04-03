import path from "path";
import fs from "fs";
import https from "https";
import { fileURLToPath } from "url";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to save the validator
const OUTPUT_PATH = path.join(__dirname, "validator_cli.jar");
const API_URL =
  "https://api.github.com/repos/hapifhir/org.hl7.fhir.core/releases/latest";

// Ensure bin directory exists
if (!fs.existsSync(__dirname)) {
  fs.mkdirSync(__dirname, { recursive: true });
}

console.log("Fetching latest FHIR validator release info...");

function downloadValidator() {
  // Step 1: Get the latest release info from GitHub API
  const req = https.get(
    API_URL,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "aehrc/mcp-fhir-tools",
      },
    },
    (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        console.log(`Following redirect to: ${redirectUrl}`);
        https.get(redirectUrl, handleApiResponse);
        return;
      }

      handleApiResponse(res);
    },
  );

  req.on("error", (err) => {
    console.error(`Error fetching release info: ${err.message}`);
    process.exit(1);
  });
}

function handleApiResponse(res) {
  if (res.statusCode !== 200) {
    console.error(
      `GitHub API responded with ${res.statusCode}: ${res.statusMessage}`,
    );
    process.exit(1);
  }

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const releaseInfo = JSON.parse(data);
      const validatorAsset = releaseInfo.assets.find(
        (asset) => asset.name === "validator_cli.jar",
      );

      if (!validatorAsset) {
        console.error("validator_cli.jar not found in latest release");
        process.exit(1);
      }

      console.log(
        `Found validator version ${releaseInfo.tag_name} released on ${new Date(releaseInfo.published_at).toLocaleDateString()}`,
      );
      console.log(`Downloading from: ${validatorAsset.browser_download_url}`);
      console.log(`Target: ${OUTPUT_PATH}`);

      downloadJar(validatorAsset.browser_download_url);
    } catch (error) {
      console.error(`Error processing API response: ${error.message}`);
      process.exit(1);
    }
  });
}

function downloadJar(url) {
  // Create a file stream
  const file = fs.createWriteStream(OUTPUT_PATH);

  // Download the file
  const request = https.get(url, (response) => {
    // Handle redirects
    if (response.statusCode === 301 || response.statusCode === 302) {
      const redirectUrl = response.headers.location;
      console.log(`Following redirect to: ${redirectUrl}`);
      file.close();
      downloadJar(redirectUrl);
      return;
    }

    if (response.statusCode !== 200) {
      console.error(
        `Failed to download validator: ${response.statusCode} ${response.statusMessage}`,
      );
      file.close();
      if (fs.existsSync(OUTPUT_PATH)) {
        fs.unlinkSync(OUTPUT_PATH);
      }
      process.exit(1);
    }

    response.pipe(file);

    file.on("finish", () => {
      file.close();
      console.log("Download completed successfully.");
    });
  });

  request.on("error", (err) => {
    console.error(`Download failed: ${err.message}`);
    if (fs.existsSync(OUTPUT_PATH)) {
      fs.unlinkSync(OUTPUT_PATH);
    }
    process.exit(1);
  });
}

downloadValidator();
