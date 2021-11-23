const fsMock = require('fs');
const readlineMock = require('readline');
const utilMock = require('util');
const childProcessMock = require('child_process');
const dayjsMock = require('dayjs');
const { exec, evaluateCommand } = require('./index.js');

jest.mock('fs');
jest.mock('readline');
jest.mock('util');
jest.mock('child_process');
jest.mock('dayjs');

describe('Evaluate commands to create README', () => {
	const MOCK_FILE_INFO = {
		'./drewr3.dat': '; -*- ledger -*-',
		'./README.md': '##',
	};

	beforeEach(() => {
		jest.resetAllMocks();
		fsMock.__setMockFiles(MOCK_FILE_INFO);
	});

	test('Default values when no props argument is provided', async () => {
		childProcessMock.exec.mockImplementation((command, callback) => {
			callback(null, { stdout: '###', stderr: undefined });
		});
		await exec();
		expect(fsMock.promises.truncate).toBeCalledWith('./README.md');
		expect(fsMock.promises.appendFile).toBeCalledWith(
			'./README.md',
			expect.any(String)
		);
	});
});
