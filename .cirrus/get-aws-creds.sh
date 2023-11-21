#!/bin/bash
PREVIOUS_BASH_OPTIONS="$(set +o)" # Store the environment behavior bash options
trap "$PREVIOUS_BASH_OPTIONS" EXIT # Restore the environment behavior bash options on exit if script not sourced
set -e # Make the script exit if any command has a non-zero exit status
set -o pipefail # Make the script exit code to the same code as the command that exited with a non-zero exit status

echo "Setting secretly the aws identity using OIDC"

# If your deployment takes more than 1h, you can set in the environment a variable AWS_SESSION_DURATION_S to set a new
# value in seconds.
# You must have an adapted role definition to allow more than 3600s.

if [ -z $AWS_SESSION_DURATION_S ]
then
  export AWS_SESSION_DURATION_S=3600
fi

set -u # Fail at any missing environment variable

export AWS_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${AWS_DEPLOYMENT_ROLE_NAME}"
export AWS_ROLE_SESSION_NAME="cirrus-task-${CIRRUS_TASK_ID}"

set +v # Stop verbosity mode to protect the CIRRUS_OIDC_TOKEN

exec {fd}<<<"${CIRRUS_OIDC_TOKEN}"
export AWS_WEB_IDENTITY_TOKEN_FILE="/dev/fd/${fd}"

set -v # Enable back verbosity to stay consistent with default Cirrus behavior and understand correctly the context of executed actions.

aws configure export-credentials --format env-no-export >> "${CIRRUS_ENV}"

echo "AWS_REGION=${AWS_REGION}" >> $CIRRUS_ENV
echo "AWS_DEFAULT_REGION=${AWS_REGION}" >> $CIRRUS_ENV

eval "$PREVIOUS_BASH_OPTIONS" # Restore the environment behavior bash options in case the script was sourced