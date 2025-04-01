# Australian FHIR Tools

Tools for generating valid (but fictional) Australian healthcare identifiers for use in FHIR resources.

## Features

### Healthcare Identifier Generators

- **HPI-I**: Healthcare Provider Identifier - Individual
- **HPI-O**: Healthcare Provider Identifier - Organisation
- **IHI**: Individual Healthcare Identifier
- **Medicare**: Medicare numbers
- **DVA**: Department of Veterans' Affairs numbers

All generated identifiers follow the correct format and pass checksum validation where applicable.

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
      "args": [
        "-y",
        "mcp-au-fhir-tools"
      ]
    }
  }
}
```

4. If you already have other MCP servers configured, just add the "au-fhir-tools" entry to the existing "mcpServers" object
5. Save the file and restart Claude Desktop
6. You should now see the Australian FHIR Tools available in the tools menu (hammer icon)

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

This starts a server on port 3002 that can be accessed via Server-Sent Events (SSE).

### Tool Documentation

#### generate-hpi-i

Generates a fictional but valid HPI-I (Healthcare Provider Identifier - Individual).

Parameters: None

#### generate-hpi-o

Generates a fictional but valid HPI-O (Healthcare Provider Identifier - Organisation).

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
