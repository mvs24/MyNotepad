# MyNotepad

This project uses Docker & Docker compose. <br />
To run this project you need to have Docker installed on your computer. <br />
If you do not have docker installed on your computer you can also run this project by installing dependencies on the frontend and on the backend and adding a proxy on the frontend package.json "proxy":"http://localhost:5000" to point to our API.

ENV_VARIABLES: if you have a DB_CONNECTION_URI (you can get that from mongodb atlas by creating a new project & cluster) put that on line 11 docker-compose.yml file (if not the default localhost will be used)

To run this project you need to follow these steps: <br />

1- Open your terminal and run: git clone https://github.com/mvs24/MyNotepad.git (you will get a folder with the name MyNotepad with the entire project inside) <br />
2- Run on terminal: cd MyNotepad<br />
3- Run on terminal: npm i (to install all the backend dependencies) <br />
4- Run: cd frontend <br />
5- Run: npm i (to install all the frontend dependencies) <br />
6- Run: cd .. <br />
7- Run: docker-compose up --build, and wait until everything is finished running. <br />
That's it, so easy just 1 command (docker-compose up --build) on the root directory (MyNotepad) <br />
Now open the browser on: localhost:3050 (3050 on our host points to port 80 inside the NGINX container) <br />
That's all. <br />

#DESIGN OF THE PROJECT <br />
In this project I have used Node.JS & MongoDB for the backend together with TypeScript & React.JS for the frontend with TypeScript.<br />

#Backend<br />

- The documentation of API is on api-swagger.yaml file. </br>
- Data Modelling: There is a models folder where I have designed the NoteSchema & UserSchema. </br>
- Authentication: I have used JSONWEBTOKEN approach instead of cookies/sessions. (No sessions: REST APIs should be stateless) </br>
- Error Handling: I have used global error handling with express.<br />
  For this I have created a HTTPError class which extends Error class for operational errors && asyncWrapper HOF to not repeat try & catch blocks every time.<br />
  I have seperated development errors from production errors. (controllers/error.ts) file.<br />
- Logging: On uncaughtExceptions, unhandledRejections and operational errors or server errors. We can use morgan or winston for logging.
- Continuos Integration & Testing: I have configured travis-ci for continuos integration. In here I have created a docker container to run all tests on the frontend (we can do the same thing for the backend also, using supertest, mocha or chai) and get all statistics about tests on travis platform.</br>
- I want to mention how to do Continuos deployment to AWS. We need to configure travis-ci for this and create a Dockerrun.aws.json file for configuration (aws & docker) for deployment to elastic beanstalk.<br />
- Production: We can use PM2 for monitoring & scaling our Node.JS server through clustering.</br>

#Docker Configuration:

- We have dockerfiles on root directory (backend) & frontend for building the backend and frontend containers.<br />
- On nginx/default.conf is the configuration for forwarding the traffic to server/client. There is also a Dockerfile to create the nginx container.<br />
- Docker-compose.yaml contains the configuration for all the containers: frontend, backend and nginx.<br />

#Frontend<br/>
For authentication I have used Context API.<br/>
There is a components folder inside src where are placed all components and I have used MaterialUI for some of them together with css modules for styling.</br>
Hooks everywhere not class based components.</br>
React.memo & useCallback for improving the performance.</br>
