'use strict';

const fs = xenon.fs;
const tslint = require('tslint');
const Linter = tslint.Linter;
const Configuration = tslint.Configuration;

// const fileName = "Specify input file name";
// const configurationFilename = "Specify configuration file name";
let options = {
    linterOptions: {
        formatter: "json",
        typeCheck: true
    },
    configFileName: "tsconfig.json"
};
const filesPromise = fs.listFilesOfKnownFileTypes();

// const programs = {};



async function findConfig(configFile, lintFile) {
    const files = await filesPromise;
    const configs = files.filter(file => file.indexOf(configFile) !== -1);
    if (!configs.length) {
        throw new Error(`xenon-tslint could not find config file: ${configFile}`);
    }
    
    const fileParts = lintFile.split('/');
    while (fileParts.length) {
        fileParts.splice(fileParts.length - 1, 1);
        const dir = fileParts.join('/');
        
        for (const config of configs) {
            if (config === `${dir}/${configFile}`) {
                return config;
            }
        }
    }
    
    throw new Error(`xenon-tslint could not find config file: ${configFile}`);
}

let configResults = null;

// TODO: consider checking types
// module.exports = async function(info) {
//     options = Object.assign({}, options, info.options);
    
//     const projectPath = await fs.getProjectPath();
//     let configFile = await findConfig(options.configFileName, info.path);
//     configFile = `${projectPath}/${configFile}`;
//     const fileName = `${projectPath}/${info.path}`;
//     const fileContents = info.inputs.text;
    
//     if (!configResults) {
//         const configLoad = Configuration.findConfiguration(null, fileName);
//         configResults = configLoad.results;
//     }
    
//     let program;
//     if (!programs[configFile]) {
//         console.log('created program');
//         program = Linter.createProgram(configFile);
//         programs[configFile] = program;
//     } else {
//         program = programs[configFile];
//     }
    
    
//     const linter = new Linter(options.linterOptions, program);
//     linter.lint(fileName, fileContents, configResults);
//     console.log(linter.getResult());
//     const results = JSON.parse(linter.getResult().output);
//     const errors = [];
//     if (results) {
//         results.forEach(err => {
//             errors.push({
//                 row: err.startPosition.line,
//                 column: err.startPosition.character,
//                 endColumn: err.endPosition.character,
//                 text: err.failure,
//                 type: 'warning'
//             });
//         });
//     }
    
//     return errors;
// };


module.exports = async function(info) {
    options = Object.assign({}, options, info.options);
    
    const fileContents = info.inputs.text;
    const projectPath = await fs.getProjectPath();
    const fileName = `${projectPath}/${info.path}`;
    const linter = new Linter(options.linterOptions);
    
    if (!configResults) {
        const configLoad = Configuration.findConfiguration(null, fileName);
        configResults = configLoad.results;
    }
    linter.lint(fileName, fileContents, configResults);
    const results = JSON.parse(linter.getResult().output);
    
    const errors = [];
    
    if (results) {
        results.forEach(err => {
            errors.push({
                row: err.startPosition.line,
                column: err.startPosition.character,
                endColumn: err.endPosition.character,
                text: err.failure,
                type: 'warning'
            });
        });
    }
    
    return errors;
};