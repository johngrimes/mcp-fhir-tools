# FHIR Tools

Tools for working with FHIR resources, including validation and identifier
generation.

## Features

### FHIR Resource Validation

Validates FHIR resources against the official FHIR validator, supporting
multiple FHIR versions and SNOMED CT editions.

### UUID Generation

Generates random UUID v4 strings for use as unique identifiers in FHIR
resources.

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
    "fhir-tools": {
      "command": "npx",
      "args": ["-y", "mcp-fhir-tools"]
    }
  }
}
```

4. If you already have other MCP servers configured, just add the "fhir-tools"
   entry to the existing "mcpServers" object
5. Save the file and restart Claude Desktop
6. You should now see the FHIR Tools available in the tools menu (hammer icon)

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

This starts a server on port 3003 that can be accessed via Server-Sent Events
(SSE).

### Tool Documentation

#### validate

Validates a FHIR resource using the official FHIR validator.

Parameters:

- `resource`: FHIR resource in JSON format
- `fhirVersion`: The version of FHIR to validate against (4.0.1, 1.0.2, etc.)
- `snomedVersion`: SNOMED CT version to use for validation (intl, us, uk, au,
  etc.)

#### generate-uuid

Generates a random UUID v4 string.

Parameters: None

Copyright © 2025, Commonwealth Scientific and Industrial Research Organisation
(CSIRO) ABN 41 687 119 230. Licensed under the
[Apache License, version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
