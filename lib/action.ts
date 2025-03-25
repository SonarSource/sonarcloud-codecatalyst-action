// @ts-ignore
import * as core from '@aws/codecatalyst-adk-core';
// @ts-ignore
import * as project from '@aws/codecatalyst-project';
// @ts-ignore
import * as space from '@aws/codecatalyst-space';
import path from 'path';
import { RunSummaries, RunSummaryLevel } from '@aws/codecatalyst-run-summaries/lib';

export function execute(platformArgs = ''): void {
    try {
        // By default, the action runs in the "dist" folder. In order to have to whole source code of the action to build the image, we need to map the parent folder ".."
        const parentPath = path.resolve(__dirname, '..');
        console.log('Parent directory:', parentPath);
        console.log(`Current CodeCatalyst space: ${space.getSpace().name}`);
        console.log(`Current CodeCatalyst project: ${project.getProject().name}`);

        // Get inputs from the action
        const projectKey = core.getInput('SonarProjectKey');
        const organization = core.getInput('SonarOrganization');
        const projectBaseDir = core.getInput('SonarProjectBaseDir') || '.';
        const additionalArgs = core.getInput('SonarAdditionalArgs');
        const token = core.getInput('SonarToken');
        const branchName = core.getInput('SonarBranchName');

        console.log(
            `Project: ${projectKey} Organization:${organization} ProjectBaseDir:${projectBaseDir} BranchName:${branchName} Args:${additionalArgs}`
        );

        executeCommandAndValidate(`docker build -t sonar-scanner ${platformArgs} ${parentPath}`);
        executeCommandAndValidate(
            `docker run -v /sources/WorkflowSource:/opt/src -e SONAR_PROJECT_BASE_DIR='${projectBaseDir}' -e SONAR_TOKEN=${token} -e SONAR_PROJECT_KEY=${projectKey} -e SONAR_ORGANIZATION=${organization} -e SONAR_BRANCH_NAME=${branchName} -e ARGS=${additionalArgs} sonar-scanner`
        );
    } catch (error) {
        // the recommended error handling approach
        console.log(`SonarCloud Scan action failed, reason: ${error}`);
        RunSummaries.addRunSummary(`${error}`, RunSummaryLevel.ERROR);
        core.setFailed(`SonarCloud Scan action failed, reason: ${error}`);
    }
}

function executeCommandAndValidate(command: string): void {
    const { code, stderr } = core.command(command);
    if (code !== 0) {
        throw new Error(stderr);
    }
}
