# Extension Control: declarative extension management for VS Code

[![Build Status](https://travis-ci.org/fkrull/vscode-extension-control.svg?branch=master)](https://travis-ci.org/fkrull/vscode-extension-control)

Extension Control is an extension for Visual Studio Code that manages your
extensions in a declarative way. It allows you to configure your extensions in
an plain-text file next to your settings and then let Extension Control install
them for you.

By default, extension installations are not recorded anywhere, making the
directory with the unpacked extensions the source of truth on installed
extensions. This makes it difficult to synchronise installed extensions across
systems without synchronising the entire contents of the extension directory,
which is unnecessary and a waste of space.

Extension Control lets you specify your desired extensions in a JSON
configuration file. This file can then be synchronised in whatever fashion you
desire -- using a VCS, a shared directory, or anything else you can come up
with. Extension Control then installs extensions based on your synchronised
configuration file.

## Documentation

### Configuration File Location

Extensions are configured in the `extensions.json` file located in the editor's
User directory, i.e. next to `settings.json`:

* *Windows*: `%APPDATA%\Code\User\extensions.json`
* *macOS*: `$HOME/Library/Application Support/Code/User/extensions.json`
* *Linux*: `$HOME/.config/Code/User/extensions.json`

([source](https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations))

**Important**: The Insider version of VS Code uses a different path to its User
directory, which means you'll have to manually set the directory path to use.
See below for information on how to do this.

### Configuration File Format

This is a sample `extensions.json` file that shows off the important features:

```json
[
    "ms-vscode.wordcount",
    {
        "id": "myext.helloWorld",
        "type": "local",
        "path": "Extensions/myext-helloWorld"
    }
]
```

The extensions file must contain a JSON array, with each entry specifying an
extension to install. Each entry can be one of the following:

* A string. This causes Extension Control to download the extension with that
  ID from the VS Code Marketplace and install it.
* A JSON object with `"type": "local"` and the following parameters
  - `id`, specifying the identifier of the extension
  - `path`, a path to a directory containing an extension. The path must be
    relative to the User directory. The extension from that directory will be
    installed

### Settings

Extension Control uses the following settings:

* `extensionControl.userDirectory`: sets the path to the User directory, i.e.
  the directory that contains `extensions.json`. For normal VS Code builds, this
  is determined automatically, but Insider builds use a different path that's
  not exposed by the API. Accordingly, if you want to use this extension with
  the Insider version, you need to set this setting correctly. The same applies
  to any hypothetical other builds with non-standard branding.
* `extensionControl.extensionDirectory`: sets the path to the extension
  directory. Extension Control will install any extensions to this directory.
  Similar to the `userDirectory` setting, the default is correct for the stable
  VS Code builds, but not for the Insider builds and other rebranded versions.
  In this case, this setting needs to be changed to point the extension to the
  right directory.

## License
See the accompanying `LICENSE` file.
