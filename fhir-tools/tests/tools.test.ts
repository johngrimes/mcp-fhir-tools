import server from "../src/server";

describe("FHIR Tools", () => {
  test("generate-uuid returns a valid UUID v4", async () => {
    const tool = (server as any)._registeredTools["generate-uuid"];
    const result = await tool.callback({});
    expect(result.content[0].text).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  describe("validate tool", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("returns warnings and errors when validator outputs lines", async () => {
      // Stub exec so that it returns simulated warnings/errors.
      jest
        .spyOn(require("child_process"), "exec")
        .mockImplementation((...args: any[]) => {
          const callback = args[args.length - 1] as (
            error: Error | null,
            stdout: string,
            stderr: string,
          ) => void;
          process.nextTick(() =>
            callback(null, "Warning: Something is off\nError: Fake error", ""),
          );
          return {} as any;
        });
      const tool = (server as any)._registeredTools["validate"];
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
        .spyOn(require("child_process"), "exec")
        .mockImplementation((...args: any[]) => {
          const callback = args[args.length - 1] as (
            error: Error | null,
            stdout: string,
            stderr: string,
          ) => void;
          process.nextTick(() => callback(new Error("Exec failed"), "", ""));
          return {} as any;
        });
      const tool = (server as any)._registeredTools["validate"];
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
