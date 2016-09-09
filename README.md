# Spring + AngularJS demo app
Spring multi-tier web application with AngularJS frontend template that is runnable in any IDE via embedded jetty, runnable in any OS using embedded tomcat
runner and deployable to any server as a single .war file!
## Prerequisites
This package is Windows compatible. Integration on Unix systems is possible, but not guaranteed.
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

