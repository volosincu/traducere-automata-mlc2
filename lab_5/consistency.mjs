import fs from 'fs'

var sursa = ["my cat love eat cake."];
var dest  = ["mon chat aimes mange de gâteau"];

export function matrix(sursa, dest){
    const probsEF = JSON.parse(fs.readFileSync("./probabilitati_en-fr_v2.json", 'utf8'));
    const probsFE = JSON.parse(fs.readFileSync("./probabilitati_fr-en_v2.json", 'utf8'));

    const m = sursa.reduce((acc, cs)=>{
        dest.forEach((cd)=>{
            if (!acc[cs]){
                acc[cs] = {};
            }
            const pw = probsEF[cs][cd]
            acc[cs][cd] = {p: pw?pw:0};
        });

        return acc;
    }, {});

    console.log(m)
    return m;
}


export function fillProbs(sursa, dest){
    const m = sursa.reduce((acc, cs)=>{
        
        dest.forEach((cd, i)=>{
            if (i==0){
                max = {p: acc[cs][cd], cd: cd};
            }

            if (acc[cs][cd]> max){
                max = {p: acc[cs][cd], cd: cd};
            }
        });

        return acc;
    }, {});

    console.log(m)
    return m;
}


matrix(sursa[0].split(' '), dest[0].split(' '));




//console.log(probsEF)
