const readline = require('readline');
const fs = require('fs');
const util = require('util');
const childProcess = require('child_process');
const dayjs = require('dayjs');

const CMD_TYPES = {
	BALANCE: 'balance',
	BUDGET: 'budget',
	GRAPH: 'graph',
};

const headMarkdown = [
	'\n',
	'This README file is being updated periodically to include the current balance and other ledger outputs.\n',
	'\n',
].join('');

const faqMarkdown = [
	'### FAQ\n',
	'\n',
	'How a single transactions should look like?\n',
	'\n',
	'```\n',
	'2021-11-10	*	Uber\n',
	'	Expenses:Transportation		EUR 3.96\n',
	'	[Budget:Transportation]		EUR -3.96\n',
	'	Assets:N26		EUR -3.96\n',
	'	[Budget]		EUR -3.96\n',
	'```\n',
	'\n',
	'Each line explained:\n',
	'\n',
	"-   The transaction happened at `2021-11-10`, it's cleared (`*`) and the payee was `Uber`.\n",
	'-   Add `3.96` EUR to transportation expenses\n',
	'-   Remove `3.96` EUR from transportation budget\n',
	'-   Remove `3.96` EUR from `N26` bank account\n',
	'-   Remove `3.96` EUR from `Budget` account\n',
	'\n',
	'** Transactions with `[]` or `()` are [virtual postings](https://www.ledger-cli.org/3.0/doc/ledger3.html#Virtual-postings)\n\n',
].join('');

const commands = [
	{
		description: 'Current net worth',
		type: CMD_TYPES.BUDGET,
		exec: 'ledger -f $LEDGER_FILE_PATH balance ^Assets ^Equity ^Liabilities',
	},
	{
		description: 'Current balance',
		type: CMD_TYPES.BUDGET,
		exec: 'ledger -R -f $LEDGER_FILE_PATH balance ^Assets',
	},
	{
		description: 'Current month expenses',
		type: CMD_TYPES.BUDGET,
		exec: `ledger -f $LEDGER_FILE_PATH balance -b ${dayjs()
			.startOf('month')
			.format('YYYY-MM-DD')} -e ${dayjs()
			.endOf('month')
			.format('YYYY-MM-DD')} ^Expenses`,
	},
	{
		description: 'Current budget balance',
		type: CMD_TYPES.BUDGET,
		exec: 'ledger -f $LEDGER_FILE_PATH balance ^Budget',
	},
	{
		description: 'Income over time',
		type: CMD_TYPES.GRAPH,
		exec: 'ledger -f $LEDGER_FILE_PATH balance ^Income --invert --balance-format "%T"',
	},
];

async function evaluateCommand(
	type = CMD_TYPES.BALANCE,
	description,
	command,
	options = ''
) {
	const exec = util.promisify(childProcess.exec);
	const { stdout, stderr } = await exec(`${command} ${options}`);
	if (stderr) {
		throw new Error(stderr);
	}
	const graphOutput =
		type === CMD_TYPES.GRAPH ? stdout.replace(/[^0-9.-]+/g, ' ') : null;
	return [
		'#### ',
		description,
		'\n\n',
		'`$ ',
		command,
		'`\n\n',
		'```\n',
		graphOutput ?? stdout,
		'```\n\n',
	].join('');
}

async function main(
	props = {
		title: 'Live ledger README',
		inputPath: './drewr3.dat',
		outputPath: './README.md',
		balance: true,
		budget: true,
		graph: true,
		strict: false,
	}
) {
	if (!props.inputPath) {
		throw new Error('Path to Ledger file not provided');
	}

	if (!props.outputPath) {
		throw new Error('Path output Markdown not provided');
	}

	// Truncate README content
	await fs.promises.truncate(props.outputPath);

	const options = props.strict ? '--strict' : '';

	const header = [`# ${props.title}\n`, headMarkdown].join('');

	const evaluatedCommands = await Promise.all(
		commands
			.filter((command) => !!props[command.type])
			.map(({ type, description, exec }) =>
				evaluateCommand(
					type,
					description,
					exec.replace('$LEDGER_FILE_PATH', props.inputPath),
					options
				)
			)
	).then((commands) => commands.join(''));

	const markdown = [header, evaluatedCommands, faqMarkdown].join('');

	await fs.promises.appendFile(props.outputPath, markdown);
}

module.exports = {
	exec: main,
	evaluateCommand,
};
