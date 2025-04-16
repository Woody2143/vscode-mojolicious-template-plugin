# Change Log

All notable changes to the "Mojolicious Template Support" extension will be documented in this file.

## [0.0.1] - 2025-04-16

### Added

- Initial release of Mojolicious Template Support
- Syntax highlighting for Mojolicious template syntax:
  - `<% Perl code %>` blocks
  - `<%= Perl expression %>` expressions
  - `<%== Perl expression %>` XML-escaped expressions
  - `<%# Comment %>` comments
  - Line-based Perl code and expressions
- Template formatting with:
  - Configurable indentation
  - Block-based structure awareness
  - Support for Perl code constructs
  - Line length control with smart wrapping
  - Preservation of blank lines
- Basic syntax checking:
  - Unmatched template tags detection
  - Mismatched parentheses and braces in Perl code
  - Basic syntax validation within code blocks
  - Validation for line-based Perl directives
- Configuration options:
  - Customizable indentation size
  - Maximum line length setting
  - Preserve newlines option