# Mojolicious Template Support Extension

## What's in the folder

* This folder contains all of the files necessary for your extension.
* `package.json` - this is the manifest file in which you declare your extension and command.
* `src/extension.ts` - this is the main file where the extension functionality is implemented.
* `syntaxes/mojolicious.tmLanguage.json` - this is the TextMate grammar file that implements syntax highlighting.
* `language-configuration.json` - this is the language configuration, defining the tokens that are used for comments and brackets.
* `samples/` - contains sample Mojolicious template files for testing.

## Features

This extension provides:

* Syntax highlighting for Mojolicious templates (`.html.ep`, `.xml.ep`, `.txt.ep` files)
* Automatic formatting with customizable indentation
* Basic syntax error detection
* Support for code folding and bracket matching

## Setup

* Install the recommended extensions (amodio.tsl-problem-matcher, ms-vscode.extension-test-runner, and dbaeumer.vscode-eslint)

## Get up and running straight away

* Press `F5` to open a new window with your extension loaded.
* Create a new file with a `.html.ep` extension or open the sample files in the `samples` directory.
* Verify that syntax highlighting works for Mojolicious template syntax.
* Format a document using the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and typing "Format Document".

## Make changes

* You can relaunch the extension from the debug toolbar after changing code in `src/extension.ts`.
* You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

## Explore the API

* You can open the full set of our API when you open the file `node_modules/@types/vscode/index.d.ts`.

## Run tests

* Install the [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner)
* Run the "watch" task via the **Tasks: Run Task** command. Make sure this is running, or tests might not be discovered.
* Open the Testing view from the activity bar and click the "Run Test" button, or use the hotkey `Ctrl/Cmd + ; A`
* See the output of the test result in the Test Results view.

## Author

Created by Woody2143 <woody@2143.net> with assistance from GitHub Copilot Agent in VS Code.

## License

This extension is licensed under the [MIT License](LICENSE)
