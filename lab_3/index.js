const fs = require('fs')
const argsParser = require('./getArgs');
const ngram = require('./n-grams/index')
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
        const CORPUS_RAW = fs.readFileSync(FILE, 'utf8');

        const CORPUS_TOKENIZED = Tokenizer.toTokens(CORPUS_RAW);
        
        const corpusNormalized = Tokenizer.normalize(CORPUS_TOKENIZED, ['\n', '\r', '\n', '?', '!', ',', ':', ';']);
        //console.log(textNormalized.join(''));
        const CORPUS_NORMALIZED = corpusNormalized.join('').split('.').map(p=>{
            if (p.trim().length > 0) {
                return "<s> " + p.trim() + " <e>";
            }
            return '';
        });

        console.log(CORPUS_NORMALIZED.slice(4,));
        const x = ngram.collectBiGramsAndComputeMLEOnTrainingData(CORPUS_NORMALIZED)

        console.log(x);
        console.log(CORPUS_NORMALIZED.length)

        const VocabularySize = Object.keys(ngram.getWordApparitionsMap()).length / 2;


        console.log(" >>>  Count 0 occurences for smoothing ...")
        const zeroOccurences = x.reduce((occ, bigram) => {
            if (bigram.prob == 0) {
                occ += 1;
            }
            return occ;
        }, 0);
        console.log(" >>>>  Unique occurences: ", zeroOccurences);




        /////////// 
        // const proposition = "Vorbeau la ceasul de seară cu oameni de ai locului după o bătălie pierdută";
        const proposition = "Pline de minuni nemaivăzute";
        
        const sentenceProbabilityTable = ngram.computePropositionMLE(CORPUS_NORMALIZED, `<s> ${proposition} </e>`);
        console.log(sentenceProbabilityTable);

        const zeroOccProp = sentenceProbabilityTable.mle.reduce((occ, bigram) => {
            if (bigram.prob == 0) {
                occ += 1;
            }
            return occ;
        }, 0);


        console.log("În propoziție UNK: ", zeroOccProp)
        console.log("Smoothing (adjunst probabilities)");
        const adjustedProbTable = sentenceProbabilityTable.mle.reduce((acc, bigram) => {
            if (bigram.prob == 0) {
                bigram.prob = 1/VocabularySize;
                acc = [...acc, bigram];
                return acc;
            }
            acc = [...acc, bigram];
            return acc;
        }, []);
        console.log(adjustedProbTable);

        const totalProb = adjustedProbTable.reduce((acc, bigram) => {
            acc = acc * bigram.prob
            return acc;
        }, 1);

        console.log("Sentence probability = ", totalProb);

        fs.writeFile('./results.json', JSON.stringify(CORPUS_TOKENIZED), err => {
            if (err) {
                console.error(err)
                return
            }
            console.log("\n >>>  Scriere rezultate in ./results.json")
        })

    } catch (err) {
        console.error(err)
    }

}


main();
