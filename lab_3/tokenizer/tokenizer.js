const utils = require("./utilis")
const { NODE_TYPES, MAIN_TYPE, Token, NodeToken } = require("./types")

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

const delimitatori = [",",  ";", '\r', "!", "?", ".","\n", '\t'];


function tokenize(sign, tokens) {
  const raspuns = tokens.reduce((acc, w, k) => {
    const splited = w.split(sign);

    const splitedWithSign = splited.map(v => {
      if (v == '') {
        return sign;
      }
        return v;
    });
    acc = [...acc, ...splitedWithSign];

    return acc;
  }, []);
  return raspuns;
}

function toTokens(data) {
  const initData = data.split(' ');
  const words = initData.reduce((acc, v, i) => {
    return [...acc, v, ' ',];
  }, []);
  
  let input = words;
  const textTokenized = delimitatori.reduce((acc, sign) => {
    input = tokenize(sign, input);
    acc = [...input];
    return acc;
  }, []);
  return textTokenized;
}

function normalize(words, toRemove) {
  return words.reduce((acc, v)=>{
    if (toRemove.includes(v)){
      // ignore \r is carriage return (legacy printers)
      if (v === '\n'){
        return [...acc, ' '];
      }
      return acc;
    } 

    return [...acc, v];
  }); 
}


module.exports = {
  toTokens,
  normalize
}