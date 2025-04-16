# Mojolicious Template Support

This Visual Studio Code extension provides enhanced support for Mojolicious templates (`.html.ep`, `.xml.ep`, `.txt.ep`), including syntax highlighting, formatting, and basic syntax checking.

## Features

### Syntax Highlighting

The extension provides syntax highlighting for Mojolicious template syntax:

- `<% Perl code %>` - Perl code blocks
- `<%= Perl expression %>` - Perl expressions replaced with results
- `<%== Perl expression %>` - Perl expressions replaced with XML escaped results
- `<%# Comment %>` - Comments for debugging
- `% Perl code line` - Line-based Perl code
- `%= Perl expression line` - Line-based Perl expressions

### Formatting

The extension provides automatic formatting for Mojolicious templates with:

- Proper indentation based on code structure
- Configurable indentation size
- Line length control with smart wrapping
- Preservation of blank lines (optional)
- Support for block formatting

### Syntax Checking

Basic syntax checking is provided to catch common errors:

- Unmatched template tags (`<%` without matching `%>`)
- Mismatched parentheses and braces in Perl code
- Basic syntax validation within code blocks
- Validation for line-based Perl directives

## Extension Settings

This extension contributes the following settings:

- `mojolicious-template.format.indentSize`: Number of spaces to use for indentation (default: 2)
- `mojolicious-template.format.maxLineLength`: Maximum line length before wrapping (default: 100)
- `mojolicious-template.format.preserveNewlines`: Preserve existing blank lines when formatting (default: true)

## Commands

- `Mojolicious Template: Format Document` - Format the current Mojolicious template

## Known Issues

- Advanced Perl syntax checking is limited
- The formatter may not handle complex nested structures perfectly

## Release Notes

### 0.0.1

Initial release of Mojolicious Template Support:

- Basic syntax highlighting
- Template formatting with indentation
- Basic syntax error detection
- Configuration options for formatting preferences

## Requirements

No special requirements or dependencies.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Created by Woody2143 <woody@2143.net> with assistance from GitHub Copilot Agent in VS Code.

## License

This extension is licensed under the [MIT License](LICENSE).
