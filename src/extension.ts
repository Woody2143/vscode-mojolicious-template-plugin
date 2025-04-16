// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';

/**
 * Mojolicious Template Support Extension for VS Code
 * 
 * Provides syntax highlighting, formatting and basic syntax checking for Mojolicious templates
 * 
 * @author Woody2143 <woody@2143.net>
 * @created with assistance from GitHub Copilot Agent in VS Code
 * @copyright 2025 Woody2143
 * @license MIT
 */

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log('Mojolicious Template Support extension is now active');

  // Register the formatter provider
  const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider('mojolicious-template', {
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
      return FormatDocument(document);
    }
  });

  // Register the diagnostic collection for syntax checking
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('mojolicious-template');
  context.subscriptions.push(diagnosticCollection);

  // Register the command for manual formatting
  const formatCommand = vscode.commands.registerCommand('mojolicious-template.format', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'mojolicious-template') {
      vscode.commands.executeCommand('editor.action.formatDocument');
    }
  });

  // Add document listener for syntax checking
  const documentChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
    if (event.document.languageId === 'mojolicious-template') {
      CheckSyntax(event.document, diagnosticCollection);
    }
  });

  // Initial syntax check for active document
  if (vscode.window.activeTextEditor) {
    const activeDocument = vscode.window.activeTextEditor.document;
    if (activeDocument.languageId === 'mojolicious-template') {
      CheckSyntax(activeDocument, diagnosticCollection);
    }
  }

  // Register the document open listener for syntax checking
  const documentOpenListener = vscode.workspace.onDidOpenTextDocument(document => {
    if (document.languageId === 'mojolicious-template') {
      CheckSyntax(document, diagnosticCollection);
    }
  });

  // Add all subscriptions to the context
  context.subscriptions.push(
    formattingProvider, 
    formatCommand, 
    documentChangeListener, 
    documentOpenListener
  );
}

/**
 * Format a Mojolicious template document
 * @param document The document to format
 * @returns Array of TextEdits to apply
 */
function FormatDocument(document: vscode.TextDocument): vscode.TextEdit[] {
  const edits: vscode.TextEdit[] = [];
  const settings = vscode.workspace.getConfiguration('mojolicious-template.format');
  const indentSize = settings.get<number>('indentSize') || 2;
  const maxLineLength = settings.get<number>('maxLineLength') || 100;
  const preserveNewlines = settings.get<boolean>('preserveNewlines') || true;
  
  const text = document.getText();
  const lines = text.split(/\r?\n/);
  let formattedLines: string[] = [];
  let indentLevel = 0;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Extract formatting information before processing
    const formattingInfo = ExtractFormattingInfo(line, indentLevel);
    indentLevel = formattingInfo.newIndentLevel;
    
    // Create proper indentation
    const indent = ' '.repeat(indentLevel * indentSize);
    
    // Trim and re-indent the line
    let formattedLine = indent + formattingInfo.trimmedLine;
    
    // Handle line length limits if needed
    if (formattedLine.length > maxLineLength) {
      formattedLine = WrapLongLine(formattedLine, indent, maxLineLength);
    }
    
    formattedLines.push(formattedLine);
  }
  
  const formattedText = formattedLines.join('\n');
  
  // Create a text edit that replaces the entire document
  const entireDocument = new vscode.Range(
    document.lineAt(0).range.start,
    document.lineAt(document.lineCount - 1).range.end
  );
  
  edits.push(vscode.TextEdit.replace(entireDocument, formattedText));
  
  return edits;
}

/**
 * Extract formatting information from a line
 * @param line The line to analyze
 * @param currentIndentLevel The current indentation level
 * @returns Formatting information
 */
function ExtractFormattingInfo(line: string, currentIndentLevel: number): { 
  trimmedLine: string, 
  newIndentLevel: number 
} {
  const trimmedLine = line.trim();
  let newIndentLevel = currentIndentLevel;
  
  // Check for lines that should decrease indent before processing
  if (trimmedLine.match(/^\s*(?:end|})(?:\s*%>)?|^\s*%>|^\s*<%\s*}\s*%>/)) {
    newIndentLevel = Math.max(0, currentIndentLevel - 1);
  }
  
  // Check for lines that should increase indent after processing
  if (trimmedLine.match(/<%\s*(?:if|else|elsif|for|foreach|while|unless|sub|do|begin)\b|{\s*$/)) {
    newIndentLevel++;
  }
  
  // Special case for lines with both opening and closing structures
  if (trimmedLine.match(/<%.*{.*}.*%>/) && !trimmedLine.match(/<%.*{.*}.*}.*%>/)) {
    // No change in indentation for balanced braces in a single line
    newIndentLevel = currentIndentLevel;
  }
  
  // Handle % line prefix directives that change indentation
  if (trimmedLine.match(/^%\s*(?:if|else|elsif|for|foreach|while|unless|sub|do|begin)\b/)) {
    newIndentLevel++;
  } else if (trimmedLine.match(/^%\s*(?:end)\b/)) {
    newIndentLevel = Math.max(0, currentIndentLevel - 1);
  }
  
  return {
    trimmedLine,
    newIndentLevel
  };
}

/**
 * Wrap a long line according to max length setting
 * @param line The line to wrap
 * @param indent The indentation string
 * @param maxLength Maximum line length
 * @returns Wrapped line
 */
function WrapLongLine(line: string, indent: string, maxLength: number): string {
  // Simple wrapping strategy for long lines
  // This could be enhanced for more sophisticated wrapping based on context
  if (line.length <= maxLength) {
    return line;
  }
  
  // Find a good breaking point
  const breakPoints = [' ', ',', ';', '{', '}', '=>', '->'];
  
  for (let i = maxLength; i > maxLength / 2; i--) {
    if (breakPoints.includes(line.charAt(i))) {
      return line.substring(0, i + 1) + '\n' + indent + line.substring(i + 1).trim();
    }
  }
  
  // If no good break point, just break at maxLength
  return line.substring(0, maxLength) + '\n' + indent + line.substring(maxLength).trim();
}

/**
 * Check Mojolicious template syntax
 * @param document The document to check
 * @param diagnosticCollection The diagnostic collection to update
 */
function CheckSyntax(document: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection): void {
  const diagnostics: vscode.Diagnostic[] = [];
  const text = document.getText();
  const lines = text.split(/\r?\n/);
  
  // Track template tag states for advanced syntax checking
  const tagStates = TrackTagStates(lines);
  
  // Add all tag mismatch errors
  for (const error of tagStates.errors) {
    diagnostics.push(error);
  }
  
  // Check each line separately for syntax issues
  lines.forEach((line, lineIndex) => {
    const lineDiagnostics = CheckLineForErrors(line, lineIndex);
    diagnostics.push(...lineDiagnostics);
  });
  
  // Update diagnostics
  diagnosticCollection.set(document.uri, diagnostics);
}

/**
 * Track the state of template tags to find mismatches
 * @param lines Lines of text to analyze
 * @returns Tag states and errors
 */
function TrackTagStates(lines: string[]): { 
  openTags: number, 
  lineWithOpenTag: number[], 
  errors: vscode.Diagnostic[] 
} {
  let openTags = 0;
  const lineWithOpenTag: number[] = [];
  const errors: vscode.Diagnostic[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for opening tags
    const openMatches = line.match(/<%(?!#)/g);
    if (openMatches) {
      openTags += openMatches.length;
      for (let j = 0; j < openMatches.length; j++) {
        lineWithOpenTag.push(i);
      }
    }
    
    // Check for closing tags
    const closeMatches = line.match(/%>/g);
    if (closeMatches) {
      openTags -= closeMatches.length;
      for (let j = 0; j < closeMatches.length; j++) {
        if (lineWithOpenTag.length > 0) {
          lineWithOpenTag.pop();
        }
      }
    }
  }
  
  // Report unmatched template tags
  if (openTags > 0) {
    for (const line of lineWithOpenTag) {
      const lineText = lines[line];
      const tagPosition = lineText.indexOf('<%');
      
      if (tagPosition >= 0) {
        const range = new vscode.Range(
          new vscode.Position(line, tagPosition),
          new vscode.Position(line, tagPosition + 2)
        );
        
        errors.push(new vscode.Diagnostic(
          range,
          'Unmatched template opening tag',
          vscode.DiagnosticSeverity.Error
        ));
      }
    }
  } else if (openTags < 0) {
    // Find excess closing tags
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const matches = line.match(/%>/g) || [];
      
      for (let j = 0; j < matches.length; j++) {
        const tagPos = line.indexOf('%>', j === 0 ? 0 : line.indexOf('%>', j - 1) + 2);
        
        if (tagPos >= 0) {
          const range = new vscode.Range(
            new vscode.Position(i, tagPos),
            new vscode.Position(i, tagPos + 2)
          );
          
          errors.push(new vscode.Diagnostic(
            range,
            'Unmatched template closing tag',
            vscode.DiagnosticSeverity.Error
          ));
          
          if (Math.abs(openTags) === errors.length) {
            break;
          }
        }
      }
      
      if (Math.abs(openTags) === errors.length) {
        break;
      }
    }
  }
  
  return { openTags, lineWithOpenTag, errors };
}

/**
 * Check a line for syntax errors
 * @param line Line to check
 * @param lineIndex Index of the line
 * @returns Array of diagnostics
 */
function CheckLineForErrors(line: string, lineIndex: number): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  
  // Check for invalid Perl in line-based syntax
  if (line.match(/^\s*%(?!=|==|#)\s*(.+)$/)) {
    const perlCode = line.replace(/^\s*%\s*/, '');
    
    // Simple checks for obvious errors in Perl code
    const parenthesesCount = (perlCode.match(/\(/g) || []).length - (perlCode.match(/\)/g) || []).length;
    if (parenthesesCount !== 0) {
      const range = new vscode.Range(
        new vscode.Position(lineIndex, line.indexOf('%') + 1),
        new vscode.Position(lineIndex, line.length)
      );
      
      diagnostics.push(new vscode.Diagnostic(
        range,
        'Mismatched parentheses in Perl code',
        vscode.DiagnosticSeverity.Error
      ));
    }
    
    const bracesCount = (perlCode.match(/\{/g) || []).length - (perlCode.match(/\}/g) || []).length;
    if (bracesCount !== 0) {
      const range = new vscode.Range(
        new vscode.Position(lineIndex, line.indexOf('%') + 1),
        new vscode.Position(lineIndex, line.length)
      );
      
      diagnostics.push(new vscode.Diagnostic(
        range,
        'Mismatched braces in Perl code',
        vscode.DiagnosticSeverity.Error
      ));
    }
  }
  
  // Check for issues inside template blocks
  if (line.includes('<%') && line.includes('%>')) {
    const blockStart = line.indexOf('<%');
    const blockEnd = line.indexOf('%>');
    
    if (blockStart < blockEnd) {
      const blockContent = line.substring(blockStart + 2, blockEnd);
      
      // Check balanced parentheses and braces within block
      const blockParenthesesCount = (blockContent.match(/\(/g) || []).length - (blockContent.match(/\)/g) || []).length;
      const blockBracesCount = (blockContent.match(/\{/g) || []).length - (blockContent.match(/\}/g) || []).length;
      
      if (blockParenthesesCount !== 0 || blockBracesCount !== 0) {
        const range = new vscode.Range(
          new vscode.Position(lineIndex, blockStart + 2),
          new vscode.Position(lineIndex, blockEnd)
        );
        
        diagnostics.push(new vscode.Diagnostic(
          range,
          'Mismatched parentheses or braces in Perl code block',
          vscode.DiagnosticSeverity.Error
        ));
      }
    }
  }
  
  return diagnostics;
}

// This method is called when your extension is deactivated
export function deactivate() {}
