
function tokenizePunctuation(prop) {
    return prop.split("").map(function(ch){
        if(ch === "."){
            return '<DOT>';
        }
        return ch;
    });
}

function findWord(w, lexicon){
    const f = lexicon.reduce((acc, v)=>{
        if (v[w] || v[w.toLowerCase()]){
            acc.push(v);
        }
        return acc;
    }, []);
    if (f.length == 0){f.push("_")};
    return f;
}


function translate(props, lexicon){
    console.log("");
    props.map((prop)=>{
        const tProp = tokenizePunctuation(prop).join("");
        const pStruct = tProp.split(" ").map((w)=>{
            return findWord(w, lexicon)[0];
        });

        const ppos = pStruct.reduce((acc, v)=>{
            return acc = [...acc, v.pos];
        }, []);

        const p = pStruct.reduce((acc, v)=>{
            return acc = [...acc, v[v.source]];
        }, []);

        console.log(prop);
        console.log(p.join(" "));
        console.log("POS:", ppos.join(" "));
        console.log("");
        return p.join(" ");
    });
}

module.exports = {translate: translate}