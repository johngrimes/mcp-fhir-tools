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

import server from "../src/server";
import fetch from "node-fetch";

jest.mock("node-fetch", () => jest.fn());

describe("Terminology Tools", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("lookup-code returns 'No matching codes found' if the expansion is empty", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ expansion: { contains: [] } }),
    });
    const tool = (server as Record<string, unknown>)._registeredTools["lookup-code"];
    const response = await tool.callback({
      filter: "hypertension",
      url: "http://snomed.info/sct?fhir_vs",
    });
    expect(response.content[0].text).toBe("No matching codes found");
  });

  test("lookup-code returns the first matching coding when available", async () => {
    const firstMatch = { code: "12345", display: "Test Code" };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ expansion: { contains: [firstMatch] } }),
    });
    const tool = (server as Record<string, unknown>)._registeredTools["lookup-code"];
    const response = await tool.callback({
      filter: "hypertension",
      url: "http://snomed.info/sct?fhir_vs",
    });
    expect(response.content[0].text).toContain(
      JSON.stringify(firstMatch, null, 2),
    );
  });

  test("lookup-code returns an error if the fetch response is not OK", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Server Error",
    });
    const tool = (server as Record<string, unknown>)._registeredTools["lookup-code"];
    const response = await tool.callback({
      filter: "hypertension",
      url: "http://snomed.info/sct?fhir_vs",
    });
    expect(response.isError).toBe(true);
    expect(response.content[0].text).toMatch(/Terminology server error/);
  });
});
