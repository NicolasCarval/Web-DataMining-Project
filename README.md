# Web-DataMining-Project
The repository for the final project of the 2nd semester of A4 at ESILV

## What to expect
We produced a web page that shows POIs such as Train stations and museums on a map (you can do an advanced research on criterias such as : city,frequentation,wifi access...). It also tells you about weather in different cities, and you are able to compute train trips between 2 trainstation of your choice. 

In the end you have the option to download RDF triples in turtle formats or JSON-LD representing the trips computed.  

![image](https://user-images.githubusercontent.com/84092005/159745011-cec29b34-9066-4786-8a8c-68982f5d4386.png)


## How to install
### Setup the triple store :
- To install our file, you first need to download fuzeki form this link: https://jena.apache.org/download/index.cgi/  
- You then need to unzip the downloaded file and launch fuzeki-server.bat
- Launch a browser and enter http://localhost:3030/ 
- Create a database and call it triple2 
- Click on add data and choose the file triple.ttl from our Data folder. 
- Then click on upload now.

## How to use
### Launch website
- launch fuzeki-server.bat
- In our project folder go the website folder 
- Double click on the index.html 
(if the map is not well displayed, please dezoom until you have the filters on the left and the map on the right of the page.)

