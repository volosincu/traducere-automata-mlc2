const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

const delimitatori = [",",  ";", '\r', "!", "?", ".","\n", '\t', ':'];

/**
 * 
 * @param {*} sign 
 * @param {*} tokens 
 * @returns 
 */
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

/**
 * 
 * @param {*} data 
 * @returns 
 */
 export function toTokens(data) {
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

/**
 * 
 * @param {*} words 
 * @param {*} toRemove 
 * @returns 
 */
 export function normalize(words, toRemove) {
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
