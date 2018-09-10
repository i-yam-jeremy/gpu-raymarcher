const path = require('path');

declare var process: any;
declare var require: any;

const PPC_MODULES = [
	"./client/file-bundle"
];

function main(): void {
	if (process.argv.length == 4) {
		const rootDir = path.resolve(process.cwd(), process.argv[3]);
		PPC_MODULES.map(s => require(s))
			.forEach(s => {
				if (process.argv[2] == "-pre") {
					s.pre(rootDir);
				}
				else if (process.argv[2] == "-post") {
					s.post(rootDir);
				}
			});
	}
	else {
		console.error("usage: node ppc.js -pre|-post dir")
	}
}

main();
