#!/bin/bash

set -e

if [[ -z "${SONAR_TOKEN}" ]]; then
  echo "Set the SONAR_TOKEN env variable."
  exit 1
fi

if [[ -f "${SONAR_PROJECT_BASE_DIR%/}/pom.xml" ]]; then
  echo "Maven project detected. You should run the goal 'sonar:sonar' during build rather than using this CodeCatalyst Action. You can find more information in our documentation (https://docs.sonarsource.com/sonarcloud/advanced-setup/ci-based-analysis/sonarscanner-for-maven/)."
  exit 1
fi

if [[ -f "${SONAR_PROJECT_BASE_DIR%/}/build.gradle" ]]; then
  echo "Gradle project detected. You should use the Sonar plugin for Gradle during build rather than using this CodeCatalyst Action. You can find more information in our documentation (https://docs.sonarsource.com/sonarcloud/advanced-setup/ci-based-analysis/sonarscanner-for-gradle/)."
  exit 1
fi

# Convert SONAR_REGION to lowercase for case-insensitive comparison
region=$(echo "${SONAR_REGION}" | tr '[:upper:]' '[:lower:]')
if [[ "${region}" == "us" ]]; then
  SONARCLOUD_URL="https://sonarqube.us"
  API_BASE_URL="https://api.sonarqube.us"
elif [[ -z "${region}" ]]; then
  SONARCLOUD_URL="https://sonarcloud.io"
  API_BASE_URL="https://api.sonarcloud.io"
else
  echo "Unsupported region '${region}'. List of supported regions: 'us'. Please check the 'sonar.region' property or the 'SONAR_REGION' environment variable."
  exit 1
fi

if [[ -n "${SONAR_PROJECT_KEY}" ]]; then
  PROJECT_OPTION="-Dsonar.projectKey=${SONAR_PROJECT_KEY}"
fi

if [[ -n "${SONAR_ORGANIZATION}" ]]; then
  ORGANIZATION_OPTION="-Dsonar.organization=${SONAR_ORGANIZATION}"
fi

if [[ -n "${SONAR_BRANCH_NAME}" ]]; then
  BRANCH_OPTION="-Dsonar.branch.name=${SONAR_BRANCH_NAME}"
fi

unset JAVA_HOME

sonar-scanner -Dsonar.projectBaseDir="${SONAR_PROJECT_BASE_DIR}" -Dsonar.scanner.sonarcloudUrl=${SONARCLOUD_URL} -Dsonar.scanner.apiBaseUrl=${API_BASE_URL} ${PROJECT_OPTION} ${ORGANIZATION_OPTION} $BRANCH_OPTION ${ARGS}
