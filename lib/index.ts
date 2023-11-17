// @ts-ignore
import * as core from '@aws/codecatalyst-adk-core';
// @ts-ignore
import * as project from '@aws/codecatalyst-project';
// @ts-ignore
import * as runSummaries from '@aws/codecatalyst-run-summaries';
// @ts-ignore
import * as space from '@aws/codecatalyst-space';
import path from 'path';
import { RunSummaries, RunSummaryLevel } from '@aws/codecatalyst-run-summaries/lib';

try {
    // By default, we are running in the "dist" folder. In order to have to whole source code, we need to map the parent folder ".."
    const parentPath = path.resolve(__dirname, '..');
    console.log('Parent directory:', parentPath);
    console.log(`Current CodeCatalyst space ${space.getSpace().name}`);
    console.log(`Current CodeCatalyst project ${project.getProject().name}`);

    // Get inputs from the action
    const projectKey = core.getInput('SonarProjectKey');
    const organization = core.getInput('SonarOrganization');
    const projectBaseDir = core.getInput('SonarProjectBaseDir');
    const additionalArgs = core.getInput('SonarAdditionalArgs');
    const token = core.getInput('SonarToken'); // How to greet the person
    const branchName = core.getInput('SonarBranchName');

    console.log(`Project: ${projectKey} Organization:${organization} ProjectBaseDir:${projectBaseDir} BranchName:${branchName} Args:${additionalArgs}`);

    var { code, stderr } = core.command('docker build -t sonar-scanner .');
    if (code !== 0) {
        throw new Error(stderr);
    }

    var { code, stderr } = core.command(
        `docker run -v ${parentPath}:/opt/src -e SONAR_PROJECT_BASE_DIR='${projectBaseDir}' -e SONAR_TOKEN=${token} -e SONAR_PROJECT_KEY=${projectKey} -e SONAR_ORGANIZATION=${organization} -e SONAR_BRANCH_NAME=${branchName} -e ARGS=${additionalArgs} sonar-scanner`
    );
    if (code !== 0) {
        throw new Error(stderr);
    }

    // Set outputs of the action
} catch (error) {
    // the recommended error handling approach
    console.log(`SonarCloud Scan action failed, reason: ${error}`);
    RunSummaries.addRunSummary(`${error}`, RunSummaryLevel.ERROR);
    core.setFailed(`SonarCloud Scan action failed, reason: ${error}`);
}
