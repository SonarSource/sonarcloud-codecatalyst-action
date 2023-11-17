# SonarCloud Scan action details

The **SonarCloud Scan** action scans your code with SonarCloud to detect bugs, vulnerabilities, and code smells in 26+ programming languages


## Quickstart
 
1. Login to [SonarCloud](https://sonarcloud.io/) and generate a token to authenticate access to SonarCloud. You can generate a token on your [Security page in SonarCloud](https://sonarcloud.io/account/security/)
2. Goto Amazon CodeCatalyst and generate a new secret named SONAR_TOKEN. Put the value of the generated token in the value field of the secret
3. Create or modify an existing workflow to add the **SonarCloud Scan** action
4. In the Configuration tab of the action, set the Sonar Token value to $(Secrets.SONAR_TOKEN)
5. Sonar Project Key and Organization can either be defined in the configuration of the action, or inside a file named **sonar-project.properties**. More information about possible analysis parameters is found in the documentation at:
   https://docs.sonarcloud.io/advanced-setup/analysis-parameters
6. You can pass additional arguments in the **SonarAdditionalArgs** field
6. Commit the changes to the CodeCatalyst workflow
7. When the workflow runs, **SonarCloud Scan** will execute and send analysis results to  [SonarCloud](https://sonarcloud.io/)


## Do not use this CodeCatalyst action if you are in the following situations

* Your code is built with Maven: run 'org.sonarsource.scanner.maven:sonar' during the build
* Your code is built with Gradle: use the SonarQube plugin for Gradle during the build
* You want to analyze a .NET solution: Follow our interactive tutorial for GitHub Actions after importing your project directly into SonarCloud
* You want to analyze C and C++ code: rely on our [SonarCloud Scan for C and C++](https://github.com/marketplace/actions/sonarcloud-scan-for-c-and-c) and look at [our sample C and C++ project](https://github.com/sonarsource-cfamily-examples?q=gh-actions-sc&type=all&language=&sort=)

## Have questions or feedback?

To provide feedback (requesting a feature or reporting a bug) please post on the [SonarSource Community Forum](https://community.sonarsource.com/) with the tag `sonarcloud`.

## License

The Dockerfile and associated scripts and documentation in this project are released under the LGPLv3 License.

Container images built with this project include third-party materials.
