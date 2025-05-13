#!/bin/bash

CONFIG_FILE="secrets.env"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Missing $CONFIG_FILE"
  exit 1
fi

echo "Uploading secrets from $CONFIG_FILE..."

# Read each line and parse keys
while IFS='=' read -r key value; do
  if [[ -z "$value" || "$key" =~ ^# ]]; then
    continue
  fi

  echo "Uploading $key..."
  aws ssm put-parameter \
    --name "/slauth-kit/$key" \
    --type "SecureString" \
    --value "$value" \
    --overwrite >/dev/null
done < "$CONFIG_FILE"

echo "✅ Done."
