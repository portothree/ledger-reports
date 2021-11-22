const readline = require('readline');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
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
		command:
			'ledger -f $LEDGER_FILE_PATH balance ^Assets ^Equity ^Liabilities',
		output: '',
	},
	{
		description: 'Current balance',
		type: CMD_TYPES.BUDGET,
		command: 'ledger -R -f $LEDGER_FILE_PATH balance ^Assets',
		output: '',
	},
	{
		description: 'Current month expenses',
		type: CMD_TYPES.BUDGET,
		command: `ledger -f $LEDGER_FILE_PATH balance -b ${dayjs()
			.startOf('month')
			.format('YYYY-MM-DD')} -e ${dayjs()
			.endOf('month')
			.format('YYYY-MM-DD')} ^Expenses`,
		output: '',
	},
	{
		description: 'Current budget balance',
		type: CMD_TYPES.BUDGET,
		command: 'ledger -f $LEDGER_FILE_PATH balance ^Budget',
		output: '',
	},
	{
		description: 'Income over time',
		type: CMD_TYPES.GRAPH,
		command:
			'ledger -f $LEDGER_FILE_PATH balance ^Income --invert --balance-format "%T"',
		output: '',
	},
];

async function evaluateCommand(
	type = 'balance',
	description,
	command,
	options = ''
) {
	const { stdout, stderr } = await exec(`${command} ${options}`);

	if (stderr) {
		throw new Error(stderr);
	}

	return [
		'#### ',
		description,
		'\n\n',
		'`$ ',
		command,
		'`\n\n',
		'```\n',
		stdout,
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

	// Write head markdown to README
	await fs.promises.appendFile(
		props.outputPath,
		[`# ${props.title}\n`, headMarkdown].join('')
	);

	const allowedCommands = commands.reduce((acc, curr) => {
		if (props[curr.type]) {
			acc.push(curr);
		}

		return acc;
	}, []);

	const options = props.strict ? '--strict' : '';

	// Write each evaluated command output
	for (const { description, type, command } of allowedCommands) {
		const evaluatedCommand = await evaluateCommand(
			type,
			description,
			command.replace('$LEDGER_FILE_PATH', props.inputPath),
			options
		);

		await fs.promises.appendFile(props.outputPath, evaluatedCommand);
	}

	// Write FAQ markdown to README
	await fs.promises.appendFile(props.outputPath, faqMarkdown);
}

module.exports = {
	exec: main,
};
