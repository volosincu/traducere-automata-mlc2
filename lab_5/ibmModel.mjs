
function getUnice(text){
 const unice = text.join(" ").split(" ").reduce((acc, v)=>{
    	if (!acc.includes(v)){
    		acc.push(v);
    	}
    	return acc;
    },[]);
    
    return unice
}

function calcTc(propozitieSursaWords, propozitieDestWords, allignmentDistributionTable, sentanceWordProbabilities) {
	console.log(propozitieSursaWords, propozitieDestWords);
	
	const tradProb = propozitieDestWords.reduce((acc, cpd)=>{
	if (cpd){
		// tc(le | NULL) += P(le | NULL)/1  += .333/1.16 = 0.28 
		// tc(le | the) += P(le | the)/1
		// tc(le | cat) += P(le | cat)/1 
		console.log(" # ", cpd)
		const total = propozitieSursaWords.reduce((acc, cps) => {
				console.log("    # ", cps)
				console.log("    # ", `${allignmentDistributionTable[cps].prob}/${sentanceWordProbabilities[cpd]}`)
				const tc = allignmentDistributionTable[cps].prob/sentanceWordProbabilities[cpd];
				console.log("    # ", acc);
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



var sursa = ["the dog", "the cat"];
var dest = ["le chian", "le chat"];

//console.log(sursa.map(p=>"NULL "+p));

var allignmentDistributionTable = calcAllignmentDistribution(sursa.map(p=>"NULL "+p), dest)
// console.log(allignmentDistributionTable)


let tcIter = {};
sursa.map(p=>"NULL "+p).map((p, i) => {
	const propozitieSursaWords = p.split(' ');
	const propozitieDestWords = dest[i].split(' ');

    const sentanceWordProbabilities = iterTrad(propozitieSursaWords, propozitieDestWords, allignmentDistributionTable);
	const tc = calcTc(propozitieSursaWords,propozitieDestWords, allignmentDistributionTable, sentanceWordProbabilities);

	// console.log(sentanceWordProbabilities);
	tcIter = tc.reduce((acc, trad)=>{
		Object.keys(trad).forEach((k)=>{
			if (acc[k]){
				acc[k] = acc[k]+trad[k];
			} else {
				acc[k] = trad[k];
			}
		});
		return acc;
	},tcIter);


});


console.log(tcIter);








