#!/bin/sh

# Decrypt the service account file
# --batch to prevent interactive command --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" --output /opt/gateway/bewell-app-testing.json bewell-app-testing.json.gpg
