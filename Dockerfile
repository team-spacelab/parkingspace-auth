FROM public.ecr.aws/docker/library/node:lts-alpine3.16

COPY . /app
WORKDIR /app

RUN npx pnpm install 

RUN npx pnpm build

CMD [ "npx", "pnpm", "start" ]
