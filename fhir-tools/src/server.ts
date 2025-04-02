/*
 * Copyright 2025 Commonwealth Scientific and Industrial Research Organisation (CSIRO) ABN 41 687 119 230
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { exec } from "child_process";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { z } from "zod";

const server = new McpServer({
  name: "FHIR Tools",
  version: "0.1.0",
});

// Register FHIR validation tool
server.tool(
  "validate",
  `Validate a FHIR resource using the official FHIR validator. If the resource contains coded 
  fields, use the lookup-code tool to make sure that valid codes are populated before attempting 
  validation.`,
  {
    resource: z.string().describe(`FHIR resource in JSON format`),
    fhirVersion: z.enum([
      "4.0.1",
      "1.0.2",
      "1.4.0",
      "3.0.2",
      "4.1.0",
      "4.3.0",
      "6.0.0",
    ]).describe(`The version of FHIR to validate against. Supported values are:
        - "4.0.1" R4 (use this if version not specified)
        - "1.0.2": DSTU2
        - "1.4.0": STU3 Ballot 3 (Montreal), sometimes known as DSTU 2.1
        - "3.0.2": STU3, also known as R3
        - "4.1.0": R4B Ballot 1
        - "4.3.0": R4B
        - "6.0.0": R6 (current development build)`),
    snomedVersion: z
      .enum(["intl", "us", "uk", "au", "nl", "ca", "se", "dk", "es"])
      .describe(
        `SNOMED CT version to use for validation. Defaults to international version if not 
        specified. National implementation guides will generally need the SNOMED edition for their 
        country. Supported values are:
        - "intl": International
        - "us": United States
        - "uk": United Kingdom
        - "au": Australia
        - "nl": Netherlands
        - "ca": Canada
        - "se": Sweden
        - "dk": Denmark
        - "es": Spain`,
      ),
  },
  async ({ resource, fhirVersion, snomedVersion }) => {
    try {
      // Create a temporary file to store the resource
      const tempFile = `/tmp/resource-${crypto.randomUUID()}.json`;
      await fs.promises.writeFile(tempFile, resource);

      const __dirname = path.resolve(path.dirname(""));

      // Construct the validation command
      const command = [
        "java",
        "-jar",
        path.join(__dirname, "../bin/validator_cli.jar"),
        "-tx",
        "https://tx.ontoserver.csiro.au/fhir",
        "-sct",
        snomedVersion,
        "-version",
        fhirVersion,
        tempFile,
      ];

      // Execute the command
      const { stdout, stderr } = await new Promise<{
        stdout: string;
        stderr: string;
      }>((resolve, reject) => {
        exec(command.join(" "), (error, stdout, stderr) => {
          if (error && error.code !== 1) {
            // Note: validator may return 1 for validation errors
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        });
      });

      // Clean up temp file
      await fs.promises.unlink(tempFile);

      // Process the output
      const output = stdout || stderr;
      if (!output) {
        return {
          content: [
            {
              type: "text",
              text: "Validation failed: No output from validator",
            },
          ],
          isError: true,
        };
      }

      // Filter output to only include Information, Warning, and Error lines
      const filteredLines = output
        .split("\n")
        .map((line) => line.trimStart())
        .filter(
          (line) => line.startsWith("Warning") || line.startsWith("Error"),
        )
        .join("\n");

      if (!filteredLines) {
        return {
          content: [
            {
              type: "text",
              text: "Validation completed with no warnings or errors",
            },
          ],
          isError: false,
        };
      }

      return {
        content: [{ type: "text", text: filteredLines }],
        isError: false,
      };
    } catch (error) {
      const result = `Error during validation: ${error instanceof Error ? error.message : String(error)}`;
      return {
        content: [{ type: "text", text: result }],
        isError: true,
      };
    }
  },
);

// Register UUID v4 generator tool
server.tool(
  "generate-uuid",
  "Generate a random UUID v4 string. Use this when you need to create unique identifiers.",
  {},
  async () => {
    // Generate UUID v4
    const uuid = crypto.randomUUID();
    return {
      content: [{ type: "text", text: uuid }],
    };
  },
);

export default server;
