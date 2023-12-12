FROM node:21-alpine3.18
COPY . /app/
WORKDIR /app/
RUN yarn
RUN yarn build
CMD ["yarn", "start"]