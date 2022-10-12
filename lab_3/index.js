const fs = require('fs')
const argsParser = require('./getArgs');

const Tokenizer = require('./tokenizer/tokenizer');

function main() {
    const cmdInput = argsParser.getArgs();
    console.log(cmdInput.args);

    try {

        fs.writeFile('./results.json', "", err => {
            if (err) {
                console.error(err)
                return
            }
            console.log("remove previous results")
        })


        const FILE = cmdInput.args.file;
        console.log(" >>>  Citire fisier " + FILE + '\n');
        const data = fs.readFileSync(FILE, 'utf8');

        const textTokenized = Tokenizer.toTokens(data);
        
        const textNormalized = Tokenizer.normalize(textTokenized, ['\n', '\r', '\n'])
        console.log(textNormalized.join(''));

        fs.writeFile('./results.json', JSON.stringify(textTokenized), err => {
            if (err) {
                console.error(err)
                return
            }
            console.log(" >>>  Scriere rezultate in ./results.json")
        })

    } catch (err) {
        console.error(err)
    }

}


main();
