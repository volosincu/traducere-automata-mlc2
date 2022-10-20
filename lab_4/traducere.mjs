import fs from 'fs';
import * as deepl from 'deepl-node';
import * as Tokenizer from './tokenizer/tokenizer.mjs';
import ngram from './n-grams/index.mjs'; 
import { getAccuracy, getPrecisionNGrams } from './trad-accuracy.mjs'; 


const authKey = "<key here>";
console.log(authKey == "<key here>" ? "The API key is missig!": "API Key found.")
const translator = new deepl.Translator(authKey);

// const text = "Este incontestabil, cea mai importanta resursă informațională academică a zilelor noastre și cuprinde revistele publicate de grupul editorial Elsevier."
const text = `Nu m-am mirat deci că, la vârsta de cincizeci de ani, când omul cu pielea bătucită de sare și 
furtuni se trage spre casă, mia fost dat și mie să pun piciorul pe plaja cu nisip fierbinte a insulei din poveste.`

const langs = ['ro', 'en-US', 'ro']

function translationChain(inputText, processResults) {
    let serie_traduceri = [{ from: 'ro', to: 'ro', source: inputText, target: inputText }];
    let translation = fs.readFileSync('./translation.txt', 'utf8');
    if (translation && translation.length > 0){
        translation = JSON.parse(translation);
        if (Array.isArray(translation)){
            console.log("******* Folosește traducerea salvată în fișier **********")
            processResults(translation);
            return;
        }
    } 
    console.log("******* Cheamă deepln api pentru traducere **********")

    let i = 0;
    const clear = setInterval(() => {
        console.log("DEBUG i=" + i + ": ", `from: ${langs[i]}, to: ${langs[i + 1]}`)
        translator
            .translateText(serie_traduceri[i].target, null, langs[i + 1])
            .then((result) => {

                const trad = { from: langs[i], to: langs[i + 1], source: serie_traduceri[i].target, target: result.text }
                serie_traduceri = [...serie_traduceri, trad];
                i = i + 1;

                if (i == langs.length - 1) {
                    writeResultToFile(serie_traduceri);
                    processResults(serie_traduceri)
                    clearInterval(clear);
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }, 2800);
}

function writeResultToFile(results) {
    fs.writeFile('./translation.txt', JSON.stringify(results, null, 2), function (err) {
        if (err) return console.log(err);
        console.log('Traducerile au fost salvate in ./translation.txt');
    });
}

const tokens = Tokenizer.toTokens(text);
const textNormalized = Tokenizer.normalize(tokens, ['\n', '\r', '\n', '?', '!', ',', ':', ';', '„', '”', '(', ')', '”']).join('');

translationChain(textNormalized, (translations)=>{
    console.log("\n\nDEBUG: Start procesare traduceri. \n"); 
    const originalProp = translations[1].source; // fraza inițiala din română
    const translatedProp = translations[2].target; // fraza (re)tradusă din engleză

    const tokensOriginal = Tokenizer.toTokens(originalProp);
    const textNormalizedOriginal = Tokenizer.normalize(tokensOriginal, ['\n', '?', '!', ',', ':', ';']);

    const translatedTokensProp = Tokenizer.toTokens(translatedProp);
    const textNormalizedTranslated = Tokenizer.normalize(translatedTokensProp, ['\n', '?', '!', ',', ':', ';']);
    
    // Unigram accuracy
    const accuracy = getAccuracy(textNormalizedOriginal, textNormalizedTranslated);
    console.log("\nAccuracy unigrams : ", accuracy);

    // probabilities n grams
    const bigrams = ngram.computeNgramMLE(['<s>' + textNormalizedOriginal.join('').trim() +'<e>'], textNormalizedOriginal.join('').trim(), 2);
    const trigrams = ngram.computeNgramMLE(['<s>' + textNormalizedOriginal.join('').trim() +'<e>'], textNormalizedOriginal.join('').trim(), 3);
    const quadgrams = ngram.computeNgramMLE(['<s>' + textNormalizedOriginal.join('').trim() +'<e>'], textNormalizedOriginal.join('').trim(), 4);

    const bigramsPredicted = ngram.computeNgramMLE(['<s>' + textNormalizedTranslated.join('').trim() +'<e>'], textNormalizedTranslated.join('').trim(), 2);
    const trigramsPredicted = ngram.computeNgramMLE(['<s>' + textNormalizedTranslated.join('').trim() +'<e>'], textNormalizedTranslated.join('').trim(), 3);
    const quadgramsPredicted = ngram.computeNgramMLE(['<s>' + textNormalizedTranslated.join('').trim() +'<e>'], textNormalizedTranslated.join('').trim(), 4);

    console.log("\Precizie unigrams : ", accuracy.precision);
    const bigramPrecision = getPrecisionNGrams(bigrams.mle, bigramsPredicted.mle, "bigrams");
    const trigramPrecision = getPrecisionNGrams(trigrams.mle, trigramsPredicted.mle, "trigrams");
    const quadgramPrecision = getPrecisionNGrams(quadgrams.mle, quadgramsPredicted.mle, "quadgrams");

    // blue score @TODO 

});
