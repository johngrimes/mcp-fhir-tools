# Australian FHIR Tools

Tools for generating valid (but fictional) Australian healthcare identifiers for
use in FHIR resources.

## Features

### Healthcare Identifier Generators

- **HPI-I**: Healthcare Provider Identifier - Individual
- **HPI-O**: Healthcare Provider Identifier - Organisation
- **IHI**: Individual Healthcare Identifier
- **Medicare**: Medicare numbers
- **DVA**: Department of Veterans' Affairs numbers

All generated identifiers follow the correct format and pass checksum validation
where applicable.

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
    "au-fhir-tools": {
      "command": "npx",
      "args": ["-y", "mcp-au-fhir-tools"]
    }
  }
}
```

4. If you already have other MCP servers configured, just add the
   "au-fhir-tools" entry to the existing "mcpServers" object
5. Save the file and restart Claude Desktop
6. You should now see the Australian FHIR Tools available in the tools menu
   (hammer icon)

### Adding to Goose

To add this tool as a Command-Line Extension in
[Goose](https://block.github.io/goose/):

1.  Run `goose configure` in your terminal.
2.  Select `Add Extension` from the menu.
3.  Choose `Command-line Extension`.
4.  When prompted for "What would you like to call this extension?", you can
    enter a descriptive name, for example, "Australian FHIR Tools".
5.  For "What command should be run?", enter:
    ```bash
    npx -y mcp-au-fhir-tools
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

This starts a server on port 3002 that can be accessed via Server-Sent Events
(SSE).

### Tool Documentation

#### generate-hpi-i

Generates a fictional but valid HPI-I (Healthcare Provider Identifier -
Individual).

Parameters: None

#### generate-hpi-o

Generates a fictional but valid HPI-O (Healthcare Provider Identifier -
Organisation).

Parameters: None

#### generate-ihi

Generates a fictional but valid Individual Healthcare Identifier (IHI).

Parameters: None

#### generate-medicare

Generates a fictional but valid Medicare number.

Parameters: None

#### generate-dva

Generates a fictional but valid DVA (Department of Veterans' Affairs) number.

Parameters: None

Copyright © 2025, Commonwealth Scientific and Industrial Research Organisation
(CSIRO) ABN 41 687 119 230. Licensed under the
[Apache License, version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
