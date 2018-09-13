# SF Tools README

This is the README for the "SF Tools" Extension.

## Features

This VS Code extension provides a number of tools, including:<br />
P4 Log In<br />
P4 Check Out<br />
P4 Revert<br />
P4 Add<br />
Open File In P4V (only partially implemented, see Known Issues)<br />
Open File In Eclipse<br />
Open File In IntelliJ<br />
Open File In Swarm<br />
Open File In OpenGrok<br />
Run Current Component Test (work in progress, see Known Issues)<br />
Run All Component Tests<br />
Run EswCheck<br />

## Requirements

Visual Studio Code

## Extension Settings

This extension contributes the following settings:

* `sftools.p4UserName`: Your Perforce user name
* `sftools.p4Password`: Your Perforce password
* `sftools.filePathToP4V`: The file path to use for your local instance of Eclipse
* `sftools.filePathToEclipse`: The file path to use for your local instance of Eclipse
* `sftools.filePathToIntelliJ`: The file path to use for your local instance of IntelliJ
* `sftools.filePathToBrowser`: The file path to use for your web browser
* `sftools.localOrgDomain`: The file path to use for your local Org

## Known Issues

* Works on OSX.  Probably Linux.  Windows will need some work (at the very least, the file path separators need to be changed from "/" to "\\")

* Open File In P4V<br />
Ideally, I'd like to click this command, launch P4V with the path to the file, and then have P4V navigate to the file in its Workspace tree.  At this time, P4V doesn't support AppleScript and doesn't support a parameter passed to it through the command line.  In the mean time, this command does two things:<br />
	- First it copies the path of the current file to the clipboard.<br />
	- Second, it launches P4V.<br />
<br />
	Once opened (if not already), simply CMD-V in the input field at the top.  Not ideal, but it's something.<br />
<br />

* Run Current Component Test<br />
Ideally, I'd like to have the text caret anywhere within a test, and then be able to launch this command.  At this time, one needs to select the name of the test and then invoke Run Current Component Test.

## Release Notes

### 1.0.0

Initial release of SF Tools
