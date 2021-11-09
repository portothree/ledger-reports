const readline = require("readline");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function main() {
	const [ledgerFilePath] = process.argv.slice(2);

	if (!ledgerFilePath) {
		throw new Error("Path to ledger file not provided");
	}

	const fileStream = fs.createReadStream("./README.md");
	const raws = [];

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const ledgerCommandExp = /\$.ledger/;

	for await (const line of rl) {
		const commandLine = line.match(ledgerCommandExp);

		if (commandLine) {
			const cmd = commandLine.input
				.slice(3)
				.slice(0, -1)
				.replace("$LEDGER_FILE_PATH", ledgerFilePath);

			const { stdout, stderr } = await exec(cmd);

			if (stderr) {
				throw new Error(stderr);
			}

			console.log(stdout);
		}
	}
}

main().catch(console.log);
