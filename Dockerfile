# For dev
# FROM node:16 
# WORKDIR ./home/app

# For Prod
FROM public.ecr.aws/lambda/nodejs:16
WORKDIR ${LAMBDA_TASK_ROOT}

COPY ./build/ ./
COPY ./src/apis ./src/apis
RUN npm install --omit=dev

ENV NODE_ENV="production" 

# For dev
# CMD [ "node", "index.js" ]
# For Prod
CMD ["index.handler"]