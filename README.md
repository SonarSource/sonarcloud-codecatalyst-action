# Analyze your Code with SonarQube Cloud

This SonarSource project, available as a CodeCatalyst Action, scans your projects with SonarQube Cloud, and helps developers produce
[Clean Code](https://www.sonarsource.com/solutions/clean-code/?utm_medium=referral&utm_source=github&utm_campaign=clean-code&utm_content=sonarqube-scan-action).

[SonarQube Cloud](https://www.sonarsource.com/products/sonarcloud/) is a widely used static analysis solution for continuous code quality and security inspection.
It helps developers identify and fix issues in their code that could lead to bugs, vulnerabilities, or decreased development velocity.
SonarQube Cloud supports the most popular programming languages, including Java, JavaScript, TypeScript, C#, Python, C, C++, and [many more](https://www.sonarsource.com/knowledge/languages/).

## Requirements

* Create your account on SonarQube Cloud. Sign up for free now if it's not already the case! [SonarQube Cloud Sign up](https://www.sonarsource.com/products/sonarcloud/signup/?utm_medium=referral&utm_source=github&utm_campaign=sc-signup&utm_content=signup-sonarcloud-listing-x-x&utm_term=ww-psp-x)
* The repository to analyze is set up on SonarQube Cloud. [Set it up](https://sonarcloud.io/projects/create) in just one click.

## Usage

Project metadata, including the location of the sources to be analyzed, must be declared in the file `sonar-project.properties` in the base directory:

```properties
sonar.organization=<replace with your SonarQube Cloud organization key>
sonar.projectKey=<replace with the key generated when setting up the project on SonarQube Cloud>

# This is the name and version displayed in the SonarQube Cloud UI.
#sonar.projectName=windows-msbuild-gh-actions-sq
#sonar.projectVersion=1.0
sonar.exclusions=venv/**

# relative paths to source directories. More details and properties are described
# in https://sonarcloud.io/documentation/project-administration/narrowing-the-focus/
sonar.sources=.

# Encoding of the source code. Default is default system encoding
#sonar.sourceEncoding=UTF-8
```
The workflow, usually declared in `.codecatalyst/workflows/build.yaml`, looks like:

```yaml
Name: SonarCloudAnalysis
SchemaVersion: "1.0"

# Optional - Set automatic triggers.
Triggers:
  - Type: Push
# Required - Define action configurations.
Actions:
  SonarCloudScanAction:
    # Identifies the action. Do not modify this value.
    Identifier: sonar/sonarcloud-scan@v1.0.0
    # Specifies the source and/or artifacts to pass to the action as input.
    Inputs:
      # Required
      Sources:
        - WorkflowSource # This specifies that the action requires this Workflow as a source
    Compute:
      Type: EC2
    # Defines the action's properties.
    Configuration:
      SonarToken: ${Secrets.SONAR_TOKEN}
```

When your workflow runs, the **SonarQube Cloud Scan** will execute and send analysis results to [SonarQube Cloud](https://sonarcloud.io/).


## Configuration parameters

- `SonarToken` – **Required** This is the token used to authenticate access to SonarQube Cloud. You can generate a token on your [Security page in SonarQube Cloud](https://sonarcloud.io/account/security/). You can set the `SONAR_TOKEN` environment variable in the "Secrets" settings page of your repository.
- `SonarOrganization` – **Optional** The key of the SonarQube Cloud organization to which the project belongs. If not provided, the organization key will be read from the `sonar-project.properties` file.
- `SonarProjectKey` – **Optional** The key of the project on SonarQube Cloud. If not provided, the project key will be read from the `sonar-project.properties` file.
- `SonarBranchName` – **Optional** The name of the branch being analyzed.
- `SonarProjectBaseDir` – **Optional** The base directory of the project to analyze. If not provided, the base directory will be the root of the repository.`
- `SonarAdditionalArgs` – **Optional** Additional arguments to pass to the SonarScanner CLI. For example, `-Dsonar.verbose=true` to enable verbose logging.

## Do not use this CodeCatalyst action if you are in the following situations

* Your code is built with Maven: run 'org.sonarsource.scanner.maven:sonar-maven-plugin:3.11.0.3922:sonar' during the build (more info in the [SonarScanner for Maven](https://docs.sonarsource.com/sonarcloud/advanced-setup/ci-based-analysis/sonarscanner-for-maven/) documentation)
* Your code is built with Gradle: use the [SonarScanner for Gradle](https://docs.sonarsource.com/sonarcloud/advanced-setup/ci-based-analysis/sonarscanner-for-gradle/) during the build
* You want to analyze a .NET solution: follow our interactive tutorial for other CI's
* You want to analyze C and C++ code: rely on our [SonarQube Cloud Scan for C and C++](https://github.com/marketplace/actions/sonarcloud-scan-for-c-and-c) and look at [our sample C and C++ project](https://github.com/sonarsource-cfamily-examples?q=gh-actions-sc&type=all&language=&sort=)

## Have questions or feedback?

To provide feedback (requesting a feature or reporting a bug) please post on the [SonarSource Community Forum](https://community.sonarsource.com/) with the tag `sonarcloud`.

## License

The Dockerfile and associated scripts and documentation in this project are released under the LGPLv3 License.

Container images built with this project include third-party materials.
