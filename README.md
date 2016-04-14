# Web Widgets for Google Sheets: Builder

###WARNING! work in progress, build works, but sample widget not yet. Docs to be updated. Coming soon !..

This builder suite compiles 

self-containing HTML Web Widgets able to dynamically 

fetch and present data from Google Sheets

##Parts of the system

- __Client side__ - Javascript, HTML, Sass, 
lots of configuration and template compilation -
all to bring you a self-contained, 
Ajax-driven HTML Widget
 
- __Server-side__ - Google Apps Script code files preprocessed with configuration macros
and to be loaded into Apps Script Project.
This project should be published as Web Content Service 
(Web App returning json data)
This service is responsible for:
    - Retrieving data from data sheets 
    and its basic preparation
    - Hide implementation details from a stranger
    See it like a web app. Sample widget have Sheets ids in the configuration,
    but you may do it hidden inside the service
    These Google Sheets MAY be private, only to be accessible for the user under which the script is run
    - Manage user authentication - you may deploy Web Service to watch out Google Accounts of the visitors.
    Then you may restrict access to the data only to people who run widget under their Google Accounts, and to specific people with Google Account (e.g. your organization members)
##Setup

- have node.js 5.6.0+ installed
- create a standalone script project on 
https://script.google.com
- run setup.sh
- acquire your Google credentials for the project

    - alternatively run ```gas init```
and follow its guides.

to be continued...

##Build
E.g. for sample "price" widget
```sh
gulp build -w pricing -b pricing_1
```
##Serve with watch
WIP

##Upload Apps Script Service code 

Server and common code

__WIP - not working yet__

E.g.
```sh
gulp up -w pricing -b pricing_1
```
