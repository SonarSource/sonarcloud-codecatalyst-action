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

if [[ -z "${SONARCLOUD_URL}" ]]; then
  SONARCLOUD_URL="https://sonarcloud.io"
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
sonar-scanner -Dsonar.projectBaseDir="${SONAR_PROJECT_BASE_DIR}" -Dsonar.host.url=${SONARCLOUD_URL} ${PROJECT_OPTION} ${ORGANIZATION_OPTION} $BRANCH_OPTION ${ARGS}
