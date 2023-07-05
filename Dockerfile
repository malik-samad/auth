FROM public.ecr.aws/lambda/nodejs:16

WORKDIR ${LAMBDA_TASK_ROOT}
COPY ./build/ ./
RUN npm install --omit=dev

ENV NODE_ENV="production" 

CMD ["index.handler"]