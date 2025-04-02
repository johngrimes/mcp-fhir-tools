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

const server = new McpServer({
  name: "AU FHIR Tools",
  version: "0.1.0",
});

function luhnChecksum(number: string): number {
  const digits = number.split("").map(Number);
  let checksum = 0;
  const reverseDigits = digits.reverse();

  for (let i = 0; i < reverseDigits.length; i++) {
    if (i % 2 === 0) {
      checksum += reverseDigits[i];
    } else {
      const doubled = reverseDigits[i] * 2;
      checksum += doubled < 10 ? doubled : doubled - 9;
    }
  }

  return checksum % 10;
}

function generateRandomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

// Register HPI-I generator tool
server.tool(
  "generate-hpi-i",
  "Generate a fictional but valid HPI-I.",
  {},
  async () => {
    function generateHpiI(): string {
      const prefix = "800361";
      const randomDigits = generateRandomDigits(9);
      const partialNumber = prefix + randomDigits;

      const checksum = luhnChecksum(partialNumber + "0");
      const checkDigit = (10 - checksum) % 10;

      return partialNumber + checkDigit.toString();
    }

    // Generate and print a fictional HPI-I
    const hpiI = generateHpiI();

    return {
      content: [{ type: "text", text: hpiI }],
    };
  },
);

// Register IHI generator tool
server.tool(
  "generate-ihi",
  "Generate a fictional but valid Individual Healthcare Identifier (IHI).",
  {},
  async () => {
    function generateIHI(): string {
      const prefix = "800360"; // IHI prefix
      const randomDigits = generateRandomDigits(9);
      const partialNumber = prefix + randomDigits;

      const checksum = luhnChecksum(partialNumber + "0");
      const checkDigit = (10 - checksum) % 10;

      return partialNumber + checkDigit.toString();
    }

    const ihi = generateIHI();

    return {
      content: [{ type: "text", text: ihi }],
    };
  },
);

// Register Medicare number generator tool
server.tool(
  "generate-medicare",
  "Generate a fictional but valid Medicare number.",
  {},
  async () => {
    function generateMedicareNumber(): string {
      // Medicare numbers start with a random digit from 2-6
      const firstDigit = Math.floor(Math.random() * 5) + 2;
      // Then 7 or 8 random digits
      const useEightDigits = Math.random() > 0.5;
      const middleDigitsLength = useEightDigits ? 8 : 7;
      const middleDigits = generateRandomDigits(middleDigitsLength);

      // Combine first digit and middle digits
      const baseNumber = firstDigit.toString() + middleDigits;

      // Calculate check digit using the Medicare algorithm
      // Medicare uses a weighted sum where each digit is multiplied by its position weight
      const weights = [1, 3, 7, 9, 1, 3, 7, 9];
      let sum = 0;

      for (let i = 0; i < baseNumber.length; i++) {
        sum += parseInt(baseNumber[i]) * weights[i];
      }

      const checkDigit = sum % 10;

      return baseNumber + checkDigit.toString();
    }

    const medicareNumber = generateMedicareNumber();

    return {
      content: [{ type: "text", text: medicareNumber }],
    };
  },
);

// Register DVA number generator tool
server.tool(
  "generate-dva",
  "Generate a fictional but valid DVA (Department of Veterans' Affairs) number.",
  {},
  async () => {
    function generateDVANumber(): string {
      // DVA numbers start with a letter prefix indicating the type of card
      // N: Gold Card for veterans with qualifying service
      // H: Gold Card for veterans with qualifying service (older format)
      // W: White Card for specific conditions
      // Q: Gold Card for war widow/widower
      const prefixes = ["N", "H", "W", "Q"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

      // DVA numbers typically have 7-9 digits after the prefix
      const digitLength = Math.floor(Math.random() * 3) + 7; // 7, 8, or 9 digits
      const digits = generateRandomDigits(digitLength);

      // Format the DVA number with the prefix and digits
      return prefix + digits;
    }

    const dvaNumber = generateDVANumber();

    return {
      content: [{ type: "text", text: dvaNumber }],
    };
  },
);

// Register HPI-O generator tool
server.tool(
  "generate-hpi-o",
  "Generate a fictional but valid HPI-O (Healthcare Provider Identifier - Organisation).",
  {},
  async () => {
    function generateHpiO(): string {
      const prefix = "800362"; // HPI-O prefix
      const randomDigits = generateRandomDigits(9);
      const partialNumber = prefix + randomDigits;

      const checksum = luhnChecksum(partialNumber + "0");
      const checkDigit = (10 - checksum) % 10;

      return partialNumber + checkDigit.toString();
    }

    const hpiO = generateHpiO();

    return {
      content: [{ type: "text", text: hpiO }],
    };
  },
);

export default server;
