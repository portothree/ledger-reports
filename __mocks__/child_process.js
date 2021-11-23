'use strict';

const childProcess = jest.createMockFromModule('child_process');

childProcess.exec = jest.fn();

module.exports = childProcess;
