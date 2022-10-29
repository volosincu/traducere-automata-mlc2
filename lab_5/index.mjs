import fs from 'fs'
import * as argsParser from './getArgs.mjs';
import * as translation from './translation.mjs';


function writeResultToFile(results) {
    fs.writeFile('./probabilitati.json', JSON.stringify(results, null, 2), function (err) {
        if (err) return console.log(err);
        console.log('Traducerile au fost salvate in ./probabilitati.txt');
    });
}

function main() {
    const cmdInput = argsParser.getArgs();
    console.log(cmdInput.args);
    let iter = 5;

    if (cmdInput.args.iter){
        iter = cmdInput.args.iter;
    }

    const translationModel = translation.ibmModel(iter);
    writeResultToFile(translationModel);
}

main();