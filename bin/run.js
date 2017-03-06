#!/usr/bin/env node

var prettySwag = require('../pretty-swag');
var fs = require('fs');

var lastkey = "";
var argv = {};
for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith("-")) {
        lastkey = process.argv[i];
        argv[lastkey] = "";
    } else {
        if (lastkey) {
            argv[lastkey] = process.argv[i];
            lastkey = "";
        }
    }
}

if (process.argv.indexOf("-h") > -1 || process.argv.indexOf("--help") > -1) {
    printHelp();
    process.exit(0);
}

function printHelp() {
    console.log();
    console.log("USAGE: pretty-swag -i <inputFile> [Options]");
    console.log("Options:");
    console.log("-i <input> Location of the input file.");
    console.log("-o <output> Location of the output file. Default to doc.html");
    console.log('-f (singleFile|lite|offline|noIcon) Mode of the output result');
    console.log("-th <theme> Theme. Default to `blue` for multi-color theme use `-th default`");
    console.log("-c <config file> Location of the configuration file");
    console.log("-m Use this flag to enable MarkDown");
    console.log("-nav Use this flag to fixed the top navigation bar");
    console.log("-autotags Use this flag to automatically generate tags by path and method");
    console.log("-noFooter Use this flag to remove footer");
    console.log();
}

var inputFile = argv["-i"];
var outputFile = argv["-o"];
var format = argv["-f"];
var markdown = "-m" in argv;
var theme = argv["-th"];
var configFile = argv["-c"];
var fixedNav = "-nav" in argv;
var autoTags = "-autotags" in argv;
var noDate = "-noDate" in argv;
var noCredit = "-noCredit" in argv;

var config = {};
if (configFile) {
    var json = fs.readFileSync(configFile, 'utf8');
    json = JSON.parse(json);
    var keys = Object.keys(json);
    config.theme = {};
    for (var i = 0; i < keys.length; i++) {
        config[keys[i]] = json[keys[i]];
    }
}

config.input = inputFile || config.input;

if (!config.input) {
    console.log("missing input file");
    printHelp();
    process.exit(1);
}

config.format = format || config.format || "singleFile";
config.markdown = markdown || config.markdown || false;
config.theme = theme || config.theme || "blue";
config.fixedNav = fixedNav || config.fixedNav || false;
config.output = outputFile || config["output"] || "doc.html";
config.autoTags = autoTags || config["autoTags"] || false;
config.noDate = noDate || config["noDate"] || false;
config.noCredit = noCredit || config["noCredit"] || false;

console.log("Source: " + config.input);
console.log("Dest: " + config.output);
console.log("Format: ", config.format);
console.log("MarkDown: ", config.markdown ? "Enable" : "Disable");
console.log("Nav Bar: ", config.fixedNav ? "Fixed" : "Normal");
if (typeof config.theme === "object") {
    console.log("Theme: " + JSON.stringify(config.theme, null, 2));
}
else {
    console.log("Theme: " + config.theme);
}
prettySwag.run(config.input, config.output, config, function (err, msg) {

    if (err) {
        console.log("Error: " + err);
        process.exit(1);
    }

    console.log("DONE");
    process.exit(0);
});
