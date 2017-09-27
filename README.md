# ISU MIS Club Check-In System

## Table of Contents

- [Workspace Setup](#workspace-setup)
- [Technology Stack](#technology-stack)
- [Tools](#tools)
- [Help](#help)

## Workspace Setup

1. ### Install Node.js
    
    This project was developed using Node.js major version 8 and therefore it is recommended that you use a version 
    greater than `8.x.x` for development. To install the most recent Node.js version, click [here](https://nodejs.org/en/download/current/).
    This will also download the most recent version of npm, the official Node.js package manager.

2. ### Getting Started with Git

    **[Download Git](https://git.linux.iastate.edu/help/gitlab-basics/start-using-git.md)**
    
    **[Basic Commands from the Command Line](https://git.linux.iastate.edu/help/gitlab-basics/command-line-commands.md)**
    
    **[Using Git with WebStorm](https://www.jetbrains.com/help/webstorm/version-control-with-webstorm.html)**

3. ### npm & installing dependencies
    
    [Npm](https://www.npmjs.com/) is currently the largest software registry in the world and offers a simple way to add
    open-source libraries into a project. It is also used to define scripts that can be used with a project to start, 
    test, debug, etc.
    
    Npm utilizes the package.json file in a project to determine which dependencies are needed. Once you have cloned this project 
    from git, you will need to execute `npm install` from the root directory, or `npm i` for short.
    
    To install new packages, execute `npm i <package-name>`. This will automatically update the package.json file with 
    the appropriate package name and version so that when the changes are committed, other developers will simply have to
    run `npm i`. This also holds true when working with other developers simultaneously. 
        
4. ### Running Electron locally
    
    To run the application locally, execute `npm start` from the root directory. This will execute a series of scripts
    as seen in the package.json file which are needed to start Electron and React simultaneously.

5. ### IDE Setup

    *This step assumes you have downloaded WebStorm for development. See [here](#ide) for more information.*
    
    **Run/Debug Configurations**
     
    Follow [this tutorial](https://www.jetbrains.com/help/webstorm/creating-and-editing-run-debug-configurations.html) to 
    create a run/debug configuration for the application. In step 1, select npm as the configuration. Then, choose a name
    such as 'start electron.' Finally, specify the package.json field if not populated automatically and choose 'start' 
    from the list of commands. 
    
    Now you can start the application simply by clicking the green play button when 'start electron'
    or whatever name you gave it is selected from the dropdown in the top right of the IDE.
            
    **ESLint Configuration**
    
    To help with local development and establish development standards, this project is configured to use 
    [ESLint](https://eslint.org/). Since this project was bootstrapped using Create-React-App, a basic set of rules 
    has been pre-defined to display in the console when errors are found. However, further rules have been created in
    the .eslintrc file in this project which will provide syntax highlighting in project files.
    
    To activate syntax highlighting, go to *Preferences -> Languages & Frameworks -> JavaScript -> Code Quality Tools 
    -> ESLint* and select *Enable*. *Automatic Search* should also be selected under the Configuration file header.

    **JavaScript Configuration**
    
    To ensure WebStorm is interpreting the code properly, go to *Preferences -> Languages & Frameworks -> JavaScript* and select *React JSX* from the dropdown. 

## Technology Stack

### Electron

- [Website](https://electron.atom.io/)
- [README](https://github.com/electron/electron/blob/master/docs/README.md)

### React

- [Website](https://facebook.github.io/react/)
- [Create-React-App README](Create-React-App-README.md)
- [DevTools](https://github.com/facebook/react-devtools#faq) 

### Redux

- [Website & README](http://redux.js.org/)
- [DevTools](http://extension.remotedev.io/)

### MySQL Database

- [SQL Reference](http://www.w3schools.com/sql/)
- [MIS Club Web Admin](http://www.mis.stuorg.iastate.edu/webadmin)
- [MySQL Reference Manual](https://dev.mysql.com/doc/)

## Tools

### IDE

The recommended IDE to use for this project is either [WebStorm](https://www.jetbrains.com/webstorm/) or 
[IntelliJ](https://www.jetbrains.com/idea/) from JetBrains. As a student, you can receive a free license to all 
JetBrains products for a term of one year, after which you will be required to re-validate your status as a student. 
To register as a student, click [here](https://www.jetbrains.com/student/).
    
WebStorm is lightweight and dedicated to web development whereas IntelliJ is primarily for Java development but 
supports all the same functionality that WebStorm does.

### DevTools

When developing locally, you may find it useful to utilize the React and Redux DevTools. To open, start the application 
and click the *View* heading on the menu bar. Then click *Toggle Developer Tools*.

For official documentation on how to use the Redux Developer Tools, click [here](http://extension.remotedev.io/).

For official documentation on how to use the React Developer Tools, click [here](https://github.com/facebook/react-devtools#faq).

## Help

This is a list of possible issues that may arise and how to resolve them. 

1. Error: Cannot find module <module-name>
    
    Either you have imported a package that you have not yet installed or another developer added a new package and you 
    need to run `npm i`.
    
2. Error: listen EADDRINUSE
    
    The local port is already in use. Either another application is using that port or Electron failed to stop successfully
    the last time it was run. The simplest way to resolve this is to kill the running node process.
