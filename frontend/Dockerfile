FROM node:14

WORKDIR '/client'

COPY ./package.json ./
RUN npm install
RUN npm install react-scripts@4.0.3 -g
COPY . .

CMD [ "npm", "run", "dev" ]
