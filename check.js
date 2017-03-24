'use strict';

const fs = xenon.fs;
const tslint = require('tslint');
const Linter = tslint.Linter;
// const Configuration = tslint.Configuration;

// const fileName = "Specify input file name";
// const configurationFilename = "Specify configuration file name";
const options = {
    formatter: "json"
};

// const fileContents = fs.readFileSync(fileName, "utf8");
// const linter = new Linter(options);
// const configLoad = Configuration.findConfiguration(configurationFilename, filename);
// const result = linter.lint(fileName, fileContents, configLoad.results);


// const program = Linter.createProgram("tsconfig.json", "projectDir/");
// const files = Linter.getFileNames(program);
// const results = files.map(file => {
//     const fileContents = program.getSourceFile(file).getFullText();
//     const linter = new Linter(file, fileContents, options, program);
//     return linter.lint();
// });

module.exports = async function(info) {
    const files = await fs.listFilesOfKnownFileTypes();
    const tsconfigs = files.filter(file => file.indexOf('tsconfig.json') !== -1);
    
    
    console.log(tsconfigs);
};