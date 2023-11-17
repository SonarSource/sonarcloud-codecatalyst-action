#!/bin/bash

set -e

if [[ -z "${SONAR_TOKEN}" ]]; then
  echo "Set the SONAR_TOKEN env variable."
  exit 1
fi

if [[ -f "${SONAR_PROJECT_BASE_DIR%/}/pom.xml" ]]; then
  echo "Maven project detected. You should run the goal 'org.sonarsource.scanner.maven:sonar' during build rather than using this CodeCatalyst Action."
  exit 1
fi

if [[ -f "${SONAR_PROJECT_BASE_DIR%/}/build.gradle" ]]; then
  echo "Gradle project detected. You should use the SonarQube plugin for Gradle during build rather than using this CodeCatalyst Action."
  exit 1
fi

if [[ -z "${SONARCLOUD_URL}" ]]; then
  SONARCLOUD_URL="https://sonarcloud.io"
fi
unset JAVA_HOME
sonar-scanner -Dsonar.projectBaseDir="${SONAR_PROJECT_BASE_DIR}" -Dsonar.host.url=${SONARCLOUD_URL} -Dsonar.projectKey=${SONAR_PROJECT_KEY} -Dsonar.organization=${SONAR_ORGANIZATION} -Dsonar.branchName=${SONAR_BRANCH_NAME} ${ARGS}
