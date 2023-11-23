// @ts-ignore
import * as core from '@aws/codecatalyst-adk-core';
// @ts-ignore
import * as codecatalystSpace from '@aws/codecatalyst-space';
// @ts-ignore
import * as codecatalystProject from '@aws/codecatalyst-project';
import { RunSummaries, RunSummaryLevel } from '@aws/codecatalyst-run-summaries/lib';
import path from 'path';
import { Space } from '@aws/codecatalyst-space/lib/types/types';
import { execute } from '../lib/action';
import { Project } from '@aws/codecatalyst-project/lib/types/types';

jest.mock('@aws/codecatalyst-adk-core');
jest.mock('@aws/codecatalyst-run-summaries');
jest.mock('@aws/codecatalyst-run-summaries/lib');
jest.mock('@aws/codecatalyst-project');
jest.mock('@aws/codecatalyst-space');
jest.mock('path');

const parentPath = 'someParentPath';
const projectBaseDir = 'projectBaseDir';
const token = 'token';
const projectKey = 'projectKey';
const organization = 'organization';
const branchName = 'branchName';
const additionalArgs = 'additionalArgs';

const platformArgs = '--platform linux/arm64/v8';

const dockerBuildCommand = `docker build -t sonar-scanner ${platformArgs} .`;
const dockerRunCommand = `docker run -v ${parentPath}:/opt/src -e SONAR_PROJECT_BASE_DIR='${projectBaseDir}' -e SONAR_TOKEN=${token} -e SONAR_PROJECT_KEY=${projectKey} -e SONAR_ORGANIZATION=${organization} -e SONAR_BRANCH_NAME=${branchName} -e ARGS=${additionalArgs} sonar-scanner`;

describe('execute function', () => {
    it('Should execute the SonarCloud scan successfully', () => {
        configureCodecatalystMocks();
        configureCoreGetInputMocks();

        jest.spyOn(core, 'command').mockReturnValue({ code: 0, stderr: '' });

        executeWrapper();

        expect(core.getInput).toHaveBeenCalledWith('SonarProjectKey');
        expect(core.getInput).toHaveBeenCalledWith('SonarOrganization');
        expect(core.getInput).toHaveBeenCalledWith('SonarProjectBaseDir');
        expect(core.getInput).toHaveBeenCalledWith('SonarAdditionalArgs');
        expect(core.getInput).toHaveBeenCalledWith('SonarToken');
        expect(core.getInput).toHaveBeenCalledWith('SonarBranchName');

        expect(core.command).toHaveBeenCalledWith(dockerBuildCommand);
        expect(core.command).toHaveBeenCalledWith(dockerRunCommand);

        expect(RunSummaries.addRunSummary).not.toHaveBeenCalled();
        expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('Should handle errors and set failed status when input is not correct', () => {
        configureCodecatalystMocks();

        jest.spyOn(core, 'getInput').mockImplementation(() => {
            throw new Error('Simulated error');
        });

        executeWrapper();

        expect(RunSummaries.addRunSummary).toHaveBeenCalledWith('Error: Simulated error', RunSummaryLevel.ERROR);
        expect(core.setFailed).toHaveBeenCalledWith('SonarCloud Scan action failed, reason: Error: Simulated error');
    });

    it('Should handle errors and set failed status when build command execution fails', () => {
        configureCodecatalystMocks();
        configureCoreGetInputMocks();

        jest.spyOn(core, 'command').mockReturnValue({ code: 428, stderr: 'Simulated build command error' });

        executeWrapper();

        expect(core.command).toHaveBeenCalledWith(dockerBuildCommand);

        expect(RunSummaries.addRunSummary).toHaveBeenCalledWith('Error: Simulated build command error', RunSummaryLevel.ERROR);
        expect(core.setFailed).toHaveBeenCalledWith('SonarCloud Scan action failed, reason: Error: Simulated build command error');
    });

    it('Should handle errors and set failed status when run command execution fails', () => {
        configureCodecatalystMocks();
        configureCoreGetInputMocks();

        jest.spyOn(core, 'command').mockReturnValueOnce({ code: 0, stderr: '' });
        jest.spyOn(core, 'command').mockReturnValueOnce({ code: 428, stderr: 'Simulated run command error' });

        executeWrapper();

        expect(core.command).toHaveBeenCalledWith(dockerBuildCommand);
        expect(core.command).toHaveBeenCalledWith(dockerRunCommand);

        expect(RunSummaries.addRunSummary).toHaveBeenCalledWith('Error: Simulated run command error', RunSummaryLevel.ERROR);
        expect(core.setFailed).toHaveBeenCalledWith('SonarCloud Scan action failed, reason: Error: Simulated run command error');
    });
});

export function configureCodecatalystMocks(): void {
    jest.spyOn(path, 'resolve').mockReturnValueOnce(parentPath);
    jest.spyOn(codecatalystSpace, 'getSpace').mockReturnValue(<Space>{ name: 'someSpaceName' });
    jest.spyOn(codecatalystProject, 'getProject').mockReturnValue(<Project>{ name: 'someProjectName' });
}

export function configureCoreGetInputMocks(): void {
    jest.spyOn(core, 'getInput').mockReturnValueOnce(projectKey);
    jest.spyOn(core, 'getInput').mockReturnValueOnce(organization);
    jest.spyOn(core, 'getInput').mockReturnValueOnce(projectBaseDir);
    jest.spyOn(core, 'getInput').mockReturnValueOnce(additionalArgs);
    jest.spyOn(core, 'getInput').mockReturnValueOnce(token);
    jest.spyOn(core, 'getInput').mockReturnValueOnce(branchName);
}

export function executeWrapper(): void {
    execute(platformArgs);
}
