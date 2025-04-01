import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ValueSet } from "fhir/r4.js";
import fetch from "node-fetch";
import { z } from "zod";

const server = new McpServer({
  name: "Terminology Tools",
  version: "0.1.0",
});

// Register code lookup tool
server.tool(
  "lookup-code",
  `
  Look up a clinical code based on text description using a FHIR terminology server. Use this when 
  populating coded fields within FHIR resources to ensure that the code is valid and compliant with 
  the value set binding of the element. Returns the most relevant coding from the value set.
  `,
  {
    filter: z.string()
      .describe(`Text to search for (e.g. "hypertension", "tracheotomy", "left quad 
    laceration")`),
    url: z.string().describe(`ValueSet URL to search within.
    Common values:
    - "http://snomed.info/sct?fhir_vs" (all of SNOMED CT, use this if not specified)
    - "http://loinc.org/vs" (all of LOINC)
    - "http://snomed.info/sct?fhir_vs=isa/71388002" (SNOMED CT procedures, i.e. all codes that are a 
      subtype of Procedure (71388002))`),
  },
  async ({ filter, url }) => {
    const serverBase = "https://tx.ontoserver.csiro.au/fhir";

    const expandUrl = new URL(`${serverBase}/ValueSet/$expand`);
    expandUrl.searchParams.set("url", url);
    expandUrl.searchParams.set("filter", filter);

    try {
      const response = await fetch(expandUrl.toString(), {
        method: "GET",
        headers: {
          Accept: "application/fhir+json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [
            {
              type: "text",
              text: `Terminology server error (${response.status}): ${errorText}`,
            },
          ],
          isError: true,
        };
      }

      const result = (await response.json()) as ValueSet;

      // Check if we have any results
      if (!result.expansion?.contains?.length) {
        return {
          content: [{ type: "text", text: "No matching codes found" }],
        };
      }

      // Get just the first result
      const firstMatch = result.expansion.contains[0];

      return {
        content: [{ type: "text", text: JSON.stringify(firstMatch, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error looking up codes: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

export default server;
