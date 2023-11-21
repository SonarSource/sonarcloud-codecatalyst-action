# Analyze your Code with SonarCloud

This CodeCatalyst Action scans your code with SonarCloud to detect bugs, vulnerabilities, and code smells in 26+ programming languages.


## Quickstart

1. Create your account on SonarCloud. Sign up for free now if it's not already the case! [SonarCloud Sign up](https://www.sonarsource.com/products/sonarcloud/signup/).
2. Create a new manual organization and manual project on SonarCloud.
3. Follow the in-product tutorial to set up the analysis with this Action.
4. When your workflow runs, the **SonarCloud Scan** will execute and send analysis results to [SonarCloud](https://sonarcloud.io/).


## Secrets

The analysis requires the token `SONAR_TOKEN` to be available. You can set it up as a new secret directly within CodeCatalyst and generate it in your SonarCloud security settings [here](https://sonarcloud.io/account/security/).

## Do not use this CodeCatalyst action if you are in the following situations

* Your code is built with Maven: run 'sonar:sonar' during the build
* Your code is built with Gradle: use the Sonar plugin for Gradle during the build
* You want to analyze a .NET solution: Follow our interactive tutorial for other CI's
* You want to analyze C and C++ code: rely on our [SonarCloud Scan for C and C++](https://github.com/marketplace/actions/sonarcloud-scan-for-c-and-c) and look at [our sample C and C++ project](https://github.com/sonarsource-cfamily-examples?q=gh-actions-sc&type=all&language=&sort=)

## Have questions or feedback?

To provide feedback (requesting a feature or reporting a bug) please post on the [SonarSource Community Forum](https://community.sonarsource.com/) with the tag `sonarcloud`.

## License

The Dockerfile and associated scripts and documentation in this project are released under the LGPLv3 License.

Container images built with this project include third-party materials.
