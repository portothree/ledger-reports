const readline = require('readline');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const staticDocs =
	'# Ledger live README\n' +
	'\n' +
	'This README file is being updated periodically to include the current balance and other ledger outputs.\n' +
	'\n' +
	'### Git messages standard\n' +
	'\n' +
	'-   `fin:` for finance related updates (outflow/inflow entries)\n' +
	'-   `docs:` README updates\n' +
	'\n' +
	'### Transactions\n' +
	'\n' +
	"Here's what a single transactions might look like:\n" +
	'\n' +
	'```\n' +
	'2021-11-10	*	Uber\n' +
	'	Expenses:Transportation		EUR 3.96\n' +
	'	[Budget:Transportation]		EUR -3.96\n' +
	'	Assets:N26		EUR -3.96\n' +
	'	[Budget]		EUR -3.96\n' +
	'```\n' +
	'\n' +
	'Each line explained:\n' +
	'\n' +
	"-   The transaction happened at `2021-11-10`, it's cleared (`*`) and the payee was `Uber`.\n" +
	'-   Add `3.96` EUR to transportation expenses\n' +
	'-   Remove `3.96` EUR from transportation budget\n' +
	'-   Remove `3.96` EUR from `N26` bank account\n' +
	'-   Remove `3.96` EUR from `Budget` account\n' +
	'\n' +
	'** Transactions with `[]` or `()` are [virtual postings](https://www.ledger-cli.org/3.0/doc/ledger3.html#Virtual-postings)\n\n';

const commands = [
	{
		description: 'Current net worth',
		command: 'ledger -f $LEDGER_FILE_PATH balance ^assets ^liabilities',
		output: '',
	},
	{
		description: 'Current balance (including virtual/budget entries',
		command: 'ledger -f $LEDGER_FILE_PATH balance',
		output: '',
	},
	{
		description: 'Current real balance',
		command: 'ledger -R -f $LEDGER_FILE_PATH balance',
		output: '',
	},
	{
		description: 'Current month budget',
		command:
			'ledger -f $LEDGER_FILE_PATH -b 2021-11-01 -e 2021-11-02 reg ^Budget$ --invert --subtotal',
		output: '',
	},
];

async function evaluateCommand(description, command) {
	const { stdout, stderr } = await exec(command);

	if (stderr) {
		throw new Error(stderr);
	}

	return (
		'#### ' +
		description +
		'\n\n' +
		'`$ ' +
		command +
		'`\n\n' +
		'```\n' +
		stdout +
		'```\n'
	);
}

async function main(props = { ledgerFilePath: '', outputMarkdownPath: '' }) {
	if (!props.ledgerFilePath) {
		throw new Error('Path to ledger file not provided');
	}

	if (!props.outputMarkdownPath) {
		throw new Error('Path output Markdown not provided');
	}

	// Truncate README content
	await fs.promises.truncate(props.outputMarkdownPath);

	// Write static docs to README
	await fs.promises.appendFile(props.outputMarkdownPath, staticDocs);

	// Write each evaluated command output
	for (const { description, command } of commands) {
		const evaluatedCommand = await evaluateCommand(
			description,
			command.replace('$LEDGER_FILE_PATH', ledgerFilePath)
		);

		await fs.promises.appendFile(
			props.outputMarkdownPath,
			evaluatedCommand
		);
	}
}

module.exports = {
	updateDoc: main,
};
