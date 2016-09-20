# Spring + AngularJS demo app
Spring multi-tier web application with AngularJS frontend template that is runnable in any IDE via embedded jetty, runnable in any OS using embedded tomcat
runner and deployable to any server as a single .war file!
## Prerequisites
This package is Windows compatible. Integration on Unix systems is possible, but not guaranteed. The project relies on Java 8.
In order to run application you need couple of things.
### Maven
Get the latest version from https://maven.apache.org/download.cgi
Installation guide is at https://maven.apache.org/install.html
After that you should be able to run
```
mvn -version
```
In command console.
### NPM
Get the latest version and install from https://nodejs.org/
After successful installation you should be able to run
```
npm --version
```
### Bower & Gulp
Download and install via npm:
```
npm install -g bower
npm install -g gulp
```
Check if their paths are set successfully with
```
bower -version
gulp -version
```
If you have problems with with bower or gulp, refer to: https://github.com/bower/bower and https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
Please note that bower requires git. Refer to Usage -> Windows users part of bower tutorial.
### Git
In order to download bower components, git command should be accessible.
Download and install git bash for windows from https://git-for-windows.github.io/
After installation check if git command is accessible
```
git --version
```
## Running
### Via embedded tomcat runner
Package is prepared to be automatically launched from command line. It simply compiles the application, and deploys it to tomcat webapp runner,
along with building and serving frontend project.
When all above commands are accessible, you should be able to simply run the web server with
```
launch
```
Executed on main directory of a package. After a successful deployment (might last several minutes) you should have main project page opened
(http://localhost:9000/). If not, try http://localhost:9713/ . If the port 9713 seems to be in use, please change it in file tomcat-run.bat and in
client/config.json to any accessible.
### Via IDE
First build the project by running
```
mvn clean install
```
On project basedir and import the project and all its dependencies in your Java IDE of choice.
You can simply deploy the app to embedded jetty, by runing class pl.templates.spring.runner.EmbeddedJetty main method.
After the launch the site is available at http://localhost:9713/
Port can be changed in aforementioned class. Set DEFAULT_PORT to any accessible.
### Deploy on Tomcat
If you have a tomcat instance running, run
```
mvn clean install
```
and copy/deploy compiled war from spring-template-webapp/target.

##Functionalities
### Tree structure
Find some functionality in "Tree structure" part of an application. You can play with a simple tree structure, which stores numeric values.
Aside from that, it displays a sum of all nodes value on the way to root node. You can expand, add, remove, edit and drag nodes to modify the tree.
Autosave is enabled by default, that is, any modifications to the tree are instantly reflected in the database. If you don't want such behaviour, please
uncheck "Enable autosave" checkbox. Now modified nodes will become red, and will be pending to be persisted in database. Press "Save all" in order to do so.

##Application architecture
The application is designed to be scalable, through separation of concerns into modules. GUI part of an aplication can be developed separately thanks to
bower and gulp.
###client
First subproject is GUI - kept in separate folder. It is designed to be launched separately with gulp serve, and configure to call rest service on another port.
###rest-ws
Web services part of an application. Here is a backend interface, designed to be used by frontend application's REST calls.
###logic
Logic layer serving as a translator between database and web services layer.
###data-access
Database access error. Contains repositories, through which we can access database.
###model
Model layer, containing structure of Business Entities as well as Data Objects used later to carry the data tu GUI.


##Testing
Tests are split into three categories
###Frontend tests
Jasmine powered JavaScript tests. Can be found in client/test
###Backend unit tests
Correspond to certain parts of application that can be tested in separation, eg. NodeServiceTest
###Backend integration tests
Use whole ApplicationContext to test backend app from REST call till database query.
###Further tests
e2e Frontend tests are possible to integrate with the project. Also selenium tests are an option.
