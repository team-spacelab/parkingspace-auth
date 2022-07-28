FROM public.ecr.aws/docker/library/node:lts-alpine3.16

COPY . /app
WORKDIR /app

RUN npm install 

RUN npm run build

CMD [ "npm", "run", "start" ]
