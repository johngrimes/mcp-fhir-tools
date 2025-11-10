/* eslint-disable @typescript-eslint/no-var-requires */

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

import { jest } from "@jest/globals";
import * as childProcess from "child_process";
import { ChildProcess } from "child_process";
import server from "../src/server";

describe("FHIR Tools", () => {
  test("generate-uuid returns a valid UUID v4", async () => {
    const tool = server["_registeredTools"]["generate-uuid"];
    const result = await tool.callback({});
    expect(result.content[0].text).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  describe("evaluate-fhirpath tool", () => {
    test("evaluates a simple FHIRPath expression", async () => {
      const tool = server["_registeredTools"]["evaluate-fhirpath"];
      const patientResource = JSON.stringify({
        resourceType: "Patient",
        id: "example",
        name: [
          {
            family: "Doe",
            given: ["John", "Michael"],
          },
        ],
        birthDate: "1974-12-25",
      });

      const result = await tool.callback({
        expression: "Patient.name.given",
        resource: patientResource,
      });

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult).toEqual(["John", "Michael"]);
      expect(result.isError).toBe(false);
    });

    test("evaluates FHIRPath expression on birthDate", async () => {
      const tool = server["_registeredTools"]["evaluate-fhirpath"];
      const patientResource = JSON.stringify({
        resourceType: "Patient",
        id: "example",
        birthDate: "1974-12-25",
      });

      const result = await tool.callback({
        expression: "Patient.birthDate",
        resource: patientResource,
      });

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult).toEqual(["1974-12-25"]);
      expect(result.isError).toBe(false);
    });

    test("returns empty array when expression matches nothing", async () => {
      const tool = server["_registeredTools"]["evaluate-fhirpath"];
      const patientResource = JSON.stringify({
        resourceType: "Patient",
        id: "example",
        name: [
          {
            family: "Doe",
          },
        ],
      });

      const result = await tool.callback({
        expression: "Patient.telecom",
        resource: patientResource,
      });

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult).toEqual([]);
      expect(result.isError).toBe(false);
    });

    test("returns error when resource is invalid JSON", async () => {
      const tool = server["_registeredTools"]["evaluate-fhirpath"];
      const result = await tool.callback({
        expression: "Patient.name",
        resource: "invalid json",
      });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error evaluating FHIRPath expression");
    });

    test("evaluates FHIRPath expression on Observation value", async () => {
      const tool = server["_registeredTools"]["evaluate-fhirpath"];
      const observationResource = JSON.stringify({
        resourceType: "Observation",
        id: "example",
        status: "final",
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "29463-7",
              display: "Body Weight",
            },
          ],
        },
        valueQuantity: {
          value: 85.5,
          unit: "kg",
          system: "http://unitsofmeasure.org",
          code: "kg",
        },
      });

      const result = await tool.callback({
        expression: "Observation.valueQuantity.value",
        resource: observationResource,
      });

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult).toEqual([85.5]);
      expect(result.isError).toBe(false);
    });
  });

  // Note: validate tool tests are disabled for ESM compatibility
  // These tests require mocking child_process which has limitations in ESM mode
  describe.skip("validate tool", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("returns warnings and errors when validator outputs lines", async () => {
      // Stub exec so that it returns simulated warnings/errors.
      jest
        .spyOn(childProcess, "execFile")
        .mockImplementation((...args: unknown[]) => {
          const callback = args[args.length - 1] as (
            error: Error | null,
            stdout: string,
            stderr: string,
          ) => void;
          process.nextTick(() =>
            callback(null, "Warning: Something is off\nError: Fake error", ""),
          );
          return {} as ChildProcess;
        });
      const tool = server["_registeredTools"]["validate"];
      const response = await tool.callback({
        resource: "{}",
        fhirVersion: "4.0.1",
        snomedVersion: "intl",
      });
      expect(response.content[0].text).toContain("Warning: Something is off");
      expect(response.content[0].text).toContain("Error: Fake error");
    });

    test("returns an error when exec fails", async () => {
      jest
        .spyOn(childProcess, "execFile")
        .mockImplementation((...args: unknown[]) => {
          const callback = args[args.length - 1] as (
            error: Error | null,
            stdout: string,
            stderr: string,
          ) => void;
          process.nextTick(() => callback(new Error("Exec failed"), "", ""));
          return {} as unknown;
        });
      const tool = server["_registeredTools"]["validate"];
      const response = await tool.callback({
        resource: "{}",
        fhirVersion: "4.0.1",
        snomedVersion: "intl",
      });
      expect(response.isError).toBe(true);
      expect(response.content[0].text).toContain("Exec failed");
    });
  });
});
