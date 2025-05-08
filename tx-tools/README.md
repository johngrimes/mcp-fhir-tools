# Terminology Tools

Tools for working with FHIR terminology services, including code lookup and
validation.

## Features

### Code Lookup

Looks up clinical codes based on text descriptions using a FHIR terminology
server, ensuring that codes are valid and compliant with value set bindings.

## Installation

### Adding to Claude Desktop

To add this tool to your Claude Desktop configuration:

1. Open Claude Desktop and go to Settings > Developer Settings
2. Find your Claude desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
3. Add the following to your configuration file:

```json
{
  "mcpServers": {
    "tx-tools": {
      "command": "npx",
      "args": ["-y", "mcp-tx-tools"]
    }
  }
}
```

4. If you already have other MCP servers configured, just add the "tx-tools"
   entry to the existing "mcpServers" object
5. Save the file and restart Claude Desktop
6. You should now see the Terminology Tools available in the tools menu (hammer
   icon)

### Adding to Goose

To add this tool as a Command-Line Extension in
[Goose](https://block.github.io/goose/):

1.  Run `goose configure` in your terminal.
2.  Select `Add Extension` from the menu.
3.  Choose `Command-line Extension`.
4.  When prompted for "What would you like to call this extension?", you can
    enter a descriptive name, for example, "Terminology Tools".
5.  For "What command should be run?", enter:
    ```bash
    npx -y mcp-tx-tools
    ```
6.  You can set a timeout (e.g., `300` seconds) or accept the default.
7.  Choose whether to add environment variables (not required for this tool).

Goose will then confirm that the extension has been added. You can enable or
disable it via `goose configure` > `Toggle Extensions`.

## Usage

### Starting the Server

#### CLI Mode (stdio)

```bash
bun run start-stdio
```

#### Web Server Mode (SSE)

```bash
bun run start-sse
```

This starts a server on port 3001 that can be accessed via Server-Sent Events
(SSE).

### Tool Documentation

#### lookup-code

Looks up a clinical code based on text description using a FHIR terminology
server.

Parameters:

- `filter`: Text to search for (e.g. "hypertension", "tracheotomy")
- `url`: ValueSet URL to search within (e.g. "http://snomed.info/sct?fhir_vs")

Common ValueSet URLs:

- `http://snomed.info/sct?fhir_vs`: All of SNOMED CT
- `http://loinc.org/vs`: All of LOINC
- `http://snomed.info/sct?fhir_vs=isa/71388002`: SNOMED CT procedures

Copyright © 2025, Commonwealth Scientific and Industrial Research Organisation
(CSIRO) ABN 41 687 119 230. Licensed under the
[Apache License, version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
