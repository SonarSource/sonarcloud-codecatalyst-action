FROM sonarsource/sonar-scanner-cli:11.3

LABEL version="0.0.1" \
      repository="https://github.com/sonarsource/sonarcloud-github-action" \
      homepage="https://github.com/sonarsource/sonarcloud-github-action" \
      maintainer="SonarSource" \
      com.github.actions.name="SonarCloud Scan" \
      com.github.actions.description="Scan your code with SonarCloud to detect bugs, vulnerabilities and code smells in more than 25 programming languages." \
      com.github.actions.icon="check" \
      com.github.actions.color="green"

ARG SONAR_SCANNER_HOME=/opt/sonar-scanner
ARG NODEJS_HOME=/opt/nodejs

ENV PATH=${PATH}:${SONAR_SCANNER_HOME}/bin:${NODEJS_HOME}/bin

# set up local envs in order to allow for special chars (non-asci) in filenames
ENV LC_ALL="C.UTF-8"

WORKDIR /opt/src

# https://help.github.com/en/actions/creating-actions/dockerfile-support-for-github-actions#user
USER root

# Prepare entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
