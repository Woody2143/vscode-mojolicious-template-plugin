# Installation Guide

There are several ways to install the Mojolicious Template Support extension for VS Code.

## Install from VS Code Marketplace (Recommended)

Once the extension is published to the VS Code Marketplace, you can install it directly from within VS Code:

1. Open VS Code
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar or pressing `Ctrl+Shift+X`
3. Search for "Mojolicious Template Support"
4. Click the "Install" button

## Install from VSIX File

If you've downloaded the .vsix file directly (from GitHub Releases, for example):

1. Open VS Code
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar
3. Click the "..." (More Actions) button at the top of the Extensions view
4. Select "Install from VSIX..."
5. Navigate to and select the downloaded .vsix file
6. Restart VS Code if prompted

## Install from Source

If you want to build and install from source:

1. Clone the repository:

   ```shell
   git clone https://github.com/Woody2143/vscode-mojolicious-template-plugin.git
   ```

2. Navigate to the project directory:

   ```shell
   cd vscode-mojolicious-template-plugin
   ```

3. Install dependencies:

   ```shell
   npm install
   ```

4. Package the extension:

   ```shell
   npx @vscode/vsce package
   ```

5. Install the generated .vsix file as described in the "Install from VSIX File" section

## After Installation

After installing the extension, Mojolicious template files (with extensions `.html.ep`, `.xml.ep`, `.txt.ep`) will automatically be recognized and the extension's features will be available for these files.
