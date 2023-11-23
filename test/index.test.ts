import * as action from '../lib/action';

jest.mock('../lib/action');

describe('execute main', () => {
    it('Should delegate execution to the action', () => {
        require('../lib/index.js');
        expect(action.execute).toHaveBeenCalled();
    });
});
