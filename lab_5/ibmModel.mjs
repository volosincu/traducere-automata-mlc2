
function getUnice(text){
 const unice = text.join(" ").split(" ").reduce((acc, v)=>{
    	if (!acc.includes(v)){
    		acc.push(v);
    	}
    	return acc;
    },[]);
    
    return unice
}

function calcTc(propozitieSursaWords, propozitieDestWords, allignmentDistributionTable, sentanceWordProbabilities, debug) {
	console.log("--- calc Tc ----", propozitieSursaWords, propozitieDestWords);
	
	const tradProb = propozitieDestWords.reduce((acc, cpd)=>{
	if (cpd){
		// tc(le | NULL) += P(le | NULL)/1  += .333/1.16 = 0.28 
		// tc(le | the) += P(le | the)/1
		// tc(le | cat) += P(le | cat)/1 
		debug ? console.log(" # ", cpd): null;
		const total = propozitieSursaWords.reduce((acc, cps) => {
				debug ? console.log("    # ", cps): null;
				debug ? console.log("    # ", `${allignmentDistributionTable[cps].prob}/${sentanceWordProbabilities[cpd]}`): null;
				const tc = allignmentDistributionTable[cps].prob/sentanceWordProbabilities[cpd];
				debug ? console.log("    # ", acc) : null;
				acc[`${cpd}|${cps}`] = tc;
				return acc;
			}, {});
			acc = [...acc, total];
		}
    	return acc;
    },[]);
    return tradProb;
}

// NULL the dog :: le chien
function iterTrad(propozitieSursaWords, propozitieDestWords, conexInSursa) {
	const tradProb = propozitieDestWords.reduce((acc, c)=>{
	console.log(" - ", c)
	if (c){
		// total = P(le | NULL) + P(le | the) + P(le | dog) = 1/3+1/3+1/2 = 1.16
		const total = propozitieSursaWords.reduce((acc, w) => {
			console.log("     - ", w, conexInSursa[w].prob)
			return acc + conexInSursa[w].prob;
		}, 0);

		acc[c] = total;
	}
    	return acc;
    },{});
    return tradProb;
}


function iterRecomputeTrad(unice, tc, tradModel) {
	const tradProb = unice.reduce((accTM, c)=>{
		console.log(" -r ", c);
		if (c){
			// Calc total 
			let total = 0;
			// Lista de chei pt P(f|e) tradModel pentru recalculare prob 
			const PWordsKeys = [];
			for(k in tc) {
				// console.log("     -rk   ",k);
				if (k.split('|')[1] && k.split('|')[1] === c) {
					console.log("     -rk   ", k);
					total += tc[k];
					PWordsKeys.push(k);
				}
			}

			// P(le | cat) = tc(le | cat)/total(cat);
			// 	= 0.43 / 0.86 = 0.5;
			// P(chat | cat) = tc(chat | cat)/total(cat);
			// 	= 0.43 / 0.86 = 0.5;
			const tmTemp = PWordsKeys.reduce((acc, k)=> {
				console.log(" P(f|e) ", k);
				const fw = k.split('|')[0];
				acc[c][fw] = tc[k]/total;
				return acc;
			}, accTM);

			return {...accTM, ...tmTemp};
		}
		return accTM;
    },Object.assign({}, tradModel));
    return tradProb;
}




function calcAllignmentDistribution(sursa,dest) {

    const unice = getUnice(sursa);
    const conexiuni = unice.reduce((acc, u)=>{
    	const includCuvantul = sursa.map((p, i)=>{
    		if(p.includes(u)){
    			return dest[i];
    		}
    	});
    	
    	const uni = getUnice(includCuvantul).filter(v=>v!='');
    	acc[u] = {prob: 1/uni.length, propozitii: includCuvantul, unice: uni};
    	
    	return acc;
    },{});
    
    return conexiuni;
   
}

function convertProbabilitiesforIterations(allignmentDistributionTable){
	let tradModel = {};
	for (Pword in allignmentDistributionTable){
		// console.log(Pword)
		
		const nstruct = allignmentDistributionTable[Pword].unice.reduce((acc, unic)=>{
			acc[unic] = allignmentDistributionTable[Pword].prob;
			return acc;
		},{});
		tradModel[Pword] = nstruct;
	}

	return tradModel;
}

function computeTc(sursa, dest, translationModel){
	let tcIter = {};
	sursa.map(p=>"NULL "+p).map((p, i) => {
		const propozitieSursaWords = p.split(' ');
		const propozitieDestWords = dest[i].split(' ');

		const sentanceWordProbabilities = iterTrad(propozitieSursaWords, propozitieDestWords, allignmentDistributionTable);
		const tc = calcTc(propozitieSursaWords,propozitieDestWords, translationModel, sentanceWordProbabilities, false);

		tcIter = tc.reduce((acc, trad)=>{
			Object.keys(trad).forEach((k) => {
				if (acc[k]){
					acc[k] = acc[k]+trad[k];
				} else {
					acc[k] = trad[k];
				}
			});
			return acc;
		},tcIter);
	});
	return tcIter;
}






var sursa = ["the dog", "the cat"];
var dest = ["le chian", "le chat"];

//console.log(sursa.map(p=>"NULL "+p));

const allP = sursa.map(p=>"NULL "+p);
const unice = getUnice(allP);
var allignmentDistributionTable = calcAllignmentDistribution(sursa.map(p=>"NULL "+p), dest)
// console.log("conexiuni", allignmentDistributionTable)

let translationModel = convertProbabilitiesforIterations(allignmentDistributionTable);
let tcPairs = null;

[1,2].forEach((i)=>{
	if (i==1){
		tcPairs = computeTc(sursa, dest, allignmentDistributionTable);
		translationModel = iterRecomputeTrad(unice, tcPairs, translationModel);
	} else {
		// tcPairs = computeTc(sursa, dest, translationModel);
		// translationModel = iterRecomputeTrad(unice, tcPairs, translationModel);
	}
	
});

console.log(translationModel);
	console.log("-----");
	console.log(tcPairs)







// tradModel = iterRecomputeTrad(unice, tcIter, tradModel);
// console.log(tcIter);
// console.log("-----");
// console.log(tradModel)








