FROM node:12

WORKDIR /opt/gateway

COPY package*.json ./
COPY secrets/ ./
COPY . .

RUN npm ci --only=production

ARG SECRET_PASSPHRASE
ENV SECRET_PASSPHRASE=$SECRET_PASSPHRASE

RUN bash /opt/gateway/secrets/decrypt_service_account_prod.sh
RUN bash /opt/gateway/secrets/decrypt_service_account_test.sh
RUN bash /opt/gateway/secrets/decrypt_service_account_ci.sh

ARG LOGIN_SERVICE_URL
ENV LOGIN_SERVICE_URL=$LOGIN_SERVICE_URL

ARG SCHEMA_REGISTRY_URL
ENV SCHEMA_REGISTRY_URL=$SCHEMA_REGISTRY_URL

ARG LOGIN_SERVICE_FLAVOUR
ENV LOGIN_SERVICE_FLAVOUR=$LOGIN_SERVICE_FLAVOUR

ARG GOOGLE_APPLICATION_CREDENTIALS
ENV GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS

ARG JAEGER_URL
ENV JAEGER_URL=$JAEGER_URL

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 CMD [ "node", "container_health.js" ]
EXPOSE 8000

CMD [ "node", "index.js" ]
