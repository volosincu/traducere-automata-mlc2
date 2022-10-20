


export function getAccuracy(textNormalizedro, textNormalizedro2) {
    console.log("VARIANTA ORIGINALĂ: ", textNormalizedro.join(''));
    console.log("VARIANTA TRADUSĂ: ", textNormalizedro2.join(''));

    const prop1 = textNormalizedro.join('').split(' ');
    const prop2 = textNormalizedro2.join('').split(' ');

    /** https://machinelearningmastery.com/precision-recall-and-f-measure-for-imbalanced-classification/ */
    const precision = getPrecision(prop1, prop2);
    const recall = getRecall(prop1, prop2);
    const fMeasure = (2 * precision * recall) / (precision + recall);
    console.log("F-Measure: ", fMeasure);

    return {precision, recall, fMeasure};
}

function getPrecision(prop1, prop2) {
    const TP = prop1.reduce((acc, cuvPrimaTrad)=>{
        if (prop2.includes(cuvPrimaTrad)){
            acc = acc+1;
        }
        return acc;
    }, 0);
    console.log(`\nDEBUG: ${TP}/${prop1.length}`);
    const precision = TP/prop1.length;
    console.log("Precizie: ", precision);
    return precision;
}

// Recall = TruePositives / (TruePositives + FalseNegatives)
function getRecall(prop1, prop2) {
    const TP = prop1.reduce((acc, cuvPrimaTrad)=>{
        if (prop2.includes(cuvPrimaTrad)){
            acc = acc+1;
        }
        return acc;
    }, 0);

    console.log(`\nDEBUG: ${TP}/${(TP+((prop1.length-TP)/2))}`);
    // cu asumpția ca din toate cuvintele traduse gresit, 50% nu se potrivesc deloc contextului si le consider false negatives  
    const recall = TP/(TP+((prop1.length-TP)/2));
    console.log("Recall: ", recall);
    return recall;
}


export function getPrecisionNGrams(ngramsOrig, ngramsTrad, ngramType) {
    const TP = ngramsTrad.reduce((acc, trad)=>{
        const found = ngramsOrig.reduce((f, ngramO)=>{
            if(ngramO.pair === trad.pair){
                f = true;
            }
            return f;
        }, false);

        if (found){
            acc = acc+1;
        }
        return acc;
    }, 0);


    console.log(`\nDEBUG: ${TP}/${ngramsTrad.length}`);
    const precision = TP/ngramsTrad.length;
    console.log(`Precizie ${ngramType}: `, precision);
    return precision;
}