import {nGram} from 'n-gram';


const wordpAppearences = {};


function getWordApparitionsMap(){
    return {...wordpAppearences};
}

/**
 * 
 * @param {*} word 
 * @param {*} searchPair 
 * @returns the count of word appearences in the text
 */
 function getWordApparitions(corpus, word, searchPair) {

    if (searchPair) {
        return corpus.reduce((count, prop) => {
            let c = 0;
            try {
                c = (prop.match(new RegExp(`${word}`, 'gi')) || []).length
            } catch (e) {
                console.error("ERROR for : " + word)
            }
            return count + c;
        }, 1);
    }


    return corpus.reduce((count, prop) => {
        let words = prop.toLowerCase().split(" ");

        words.forEach((w) => {
            if (w.includes(word.toLowerCase())) {
                count += 1;
            }
        });
        return count;
    }, 1)
}


/**
 * @description compute the Maximum Likelihood Estimate for propositions bigrams
 * @param {*} CORPUS normalized text indexed in propositions
 * @returns {Array} a list with objects that have the bigram, probability and ratio
 */
 function collectBiGramsAndComputeMLEOnTrainingData(CORPUS) {
    let mleprobs = [];
    CORPUS.forEach(prop => {
        const mleProbalitiesBigram = computePropositionMLE(CORPUS, prop);
        mleprobs = [...mleprobs, ...mleProbalitiesBigram.mle];
    });
    return mleprobs;
}

/**
 * 
 * @param {*} corpus 
 * @param {*} prop 
 * @returns 
 */
function computePropositionMLE(corpus, prop) {
    const mleProbalitiesBigramTable = prop.split(" ").reduce((acc, w_n, i) => {
        if (!acc.nmin1) {
            acc.nmin1 = w_n;
            return acc;
        }
        // Word in n and n-1 index
        const w_pair = `${acc.nmin1} ${w_n}`
        let counts_w_nmin1 = wordpAppearences[acc.nmin1];
        let counts_w_pair = wordpAppearences[w_pair];

        if (!counts_w_nmin1) {
            counts_w_nmin1 = getWordApparitions(corpus, acc.nmin1);
            wordpAppearences[acc.nmin1] = counts_w_nmin1;
        }
        if (!counts_w_pair) {
            counts_w_pair = getWordApparitions(corpus, w_pair, true);
            wordpAppearences[w_pair] = counts_w_pair;
        }
        const w_nmin1_count__w_n_count = wordpAppearences[w_pair];
        const w_nmin1_c = wordpAppearences[acc.nmin1];
        // Maximum Likelihood Estimate
        let MLE = w_nmin1_count__w_n_count / w_nmin1_c;
        if (Number.isNaN(MLE)) {
            MLE = 0.;
        }

        acc.mle.push({ pair: `${acc.nmin1} ${w_n}`, prob: MLE, ratio: w_nmin1_count__w_n_count + '/' + w_nmin1_c });
        acc.nmin1 = w_n;
        return acc;

    }, { mle: [] });

    return mleProbalitiesBigramTable;
}


function computeNgramMLE(corpus, prop, n) {

    const ngr = nGram(n)(prop.split(' '));

    console.log(ngr);

}

export default {
    computeNgramMLE,
    getWordApparitionsMap,
    computePropositionMLE,
    collectBiGramsAndComputeMLEOnTrainingData
}