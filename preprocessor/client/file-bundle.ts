var fs = require('fs');
var path = require('path');

var FILE_BUNDLE_CONFIG_FILENAME = 'file-bundle-config';
/*
 * relative to the specified rootDir
 */
var TS_OUTPUT_FILE = 'file-bundle.ts';
var TYPESCRIPT_SOURCE_TEMPLATE = `
const FILE_DATA: { [filename: string]: Uint8Array } = %%file_data%%;

const textDecoder = new TextDecoder();

export class FileBundle {

	static asString(filename: string): string {
		return textDecoder.decode(FILE_DATA[filename]);
	}
	
	static asBytes(filename: string): Uint8Array {
		return FILE_DATA[filename];
	}
}
`;

/*
 * Process an individual config file
 *
 * @param filename - the path to the file bundle config file
 * @return - the paths to all the files to be included in the bundle specified by this config file
 *
 * @TODO add support for wildcards in included filenames
 */
function processConfigFile(filename: string): string[] {
    var dir = path.dirname(filename);
    return fs.readFileSync(filename, 'utf8').split("\n")
        .filter(function (f) { return !f.startsWith("#") && (f != ''); }) // filter out comments
        .map(function (f) { return path.resolve(dir, f); });
}


function getIncludedFilesFromConfigs(dir: string): string[] {
    var includedFiles = [];
    fs.readdirSync(dir).forEach(function (file) {
        if (!file.startsWith(".")) {
            var fullPath = path.resolve(dir, file);
            var stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                includedFiles = includedFiles.concat(getIncludedFilesFromConfigs(fullPath));
            }
            else if (stats.isFile()) {
                if (file == FILE_BUNDLE_CONFIG_FILENAME) {
                    includedFiles = includedFiles.concat(processConfigFile(fullPath));
                }
            }
        }
    });
    return includedFiles;
}


function fileDataToString(fileData: { [fname: string] : any}): string {
    var s = "{";
    var keyValuePairStrings = [];
    Object.keys(fileData).forEach(function (filename) {
        var keyValuePairString = "";
        keyValuePairString += JSON.stringify(filename);
        keyValuePairString += ": ";
        keyValuePairString += "new Uint8Array(" + JSON.stringify(fileData[filename].toJSON().data) + ")";
        keyValuePairStrings.push(keyValuePairString);
    });
    s += keyValuePairStrings.join(", ");
    s += "}";
    return s;
}


function generateFileBundleTypeScriptSource(rootDir: string, includedFiles: string[]): string {
    var fileData = {};
    includedFiles.forEach(function (f) {
        fileData[f.substring(rootDir.length + 1)] = fs.readFileSync(f);
    });
    var fileDataString = fileDataToString(fileData);
    return TYPESCRIPT_SOURCE_TEMPLATE.replace('%%file_data%%', fileDataString);
}


export function pre(rootDir: string): void {
    var includedFiles = getIncludedFilesFromConfigs(rootDir);
    var tsSource = generateFileBundleTypeScriptSource(rootDir, includedFiles);
    fs.writeFileSync(path.resolve(rootDir, TS_OUTPUT_FILE), tsSource, 'utf8');
}

export function post(rootDir: string): void {
    fs.unlinkSync(path.resolve(rootDir, TS_OUTPUT_FILE)); //delete created file	
}
