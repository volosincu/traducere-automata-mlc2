
function getUnice(text){
 const unice = text.join(" ").split(" ").reduce((acc, v)=>{
    	if (!acc.includes(v)){
    		acc.push(v);
    	}
    	return acc;
    },[]);
    
    return unice
}

// NULL the dog :: le chien
function iterTrad(sursa, dest, conexInDest, conexInSursa) {
	const propozitieDestWords = dest.split(' ');
	const propozitieSursaWords = sursa.split(' ');
	const tradProb = propozitieDestWords.reduce((acc, c)=>{

	if (c){
		// total = P(le | NULL) + P(le | the) + P(le | dog) = 1/3+1/3+1/2 = 1.16
		const cuvPosibileTraduceri = conexInDest[c].unice;
		const total = cuvPosibileTraduceri.reduce((acc, w) => {
			if (propozitieSursaWords.includes(w)){
				return acc*conexInSursa[w].prob;
			}
			return acc;
		}, 1);
		const o = {};
		o[c] = total;
		acc = [...acc, o];
	}
    	return acc;
    },[]);
    return tradProb;
}



function translationChain(sursa,dest) {

    const unice = getUnice(sursa);
    const apariti = unice.reduce((acc, u)=>{
    	const includCuvantul = sursa.map((p, i)=>{
    		if(p.includes(u)){
    			return dest[i];
    		}
    	});
    	
    	const uni = getUnice(includCuvantul).filter(v=>v!='');
    	acc[u] = {prob: 1/uni.length, propozitii: includCuvantul, unice: uni};
    	
    	return acc;
    },{});
    
    return apariti;
   
}

let sursa = ["the dog", "the cat"];
let dest = ["le chian", "le chat"];
    
//console.log(sursa.map(p=>"NULL "+p));

const fromEn = translationChain(sursa.map(p=>"NULL "+p), dest)
const fromFr = translationChain(dest.map(p=>"NULL "+p), sursa)


    
sursa.map(p=>"NULL "+p).map((p, i)=>{
	const probs = iterTrad(p, dest[i], fromFr, fromEn);
	console.log(probs);
});
    








