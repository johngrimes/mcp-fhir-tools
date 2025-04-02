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
    const tool = (server as any)._registeredTools["lookup-code"];
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
    const tool = (server as any)._registeredTools["lookup-code"];
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
    const tool = (server as any)._registeredTools["lookup-code"];
    const response = await tool.callback({
      filter: "hypertension",
      url: "http://snomed.info/sct?fhir_vs",
    });
    expect(response.isError).toBe(true);
    expect(response.content[0].text).toMatch(/Terminology server error/);
  });
});
