const code = require('./code');

var fs = require('fs');
var path = process.cwd();

var buffer = fs.readFileSync(path + "\\lexicon.txt");


const lexicon = []
let currentlyParsingPos = null;
buffer.toString().split('\n').map((line)=>{
    if (line && line.trim().length > 0) {
        if (line.includes(':')) {
            const posTitle = line.split(':')[0];
            const pos = posTitle.split('(')[0].trim();
            // console.log("currentlyParsingPos: ", pos);
            currentlyParsingPos = pos;
        } else {
            const entry = line.split('->');
            if (entry.length == 2) {
                const en = entry[0].trim().toLowerCase();
                const fr = entry[1].trim().toLowerCase();
                //console.log(en)
                //console.log(fr)
                const translation = {source: en, pos: currentlyParsingPos };
                translation[en] = fr;
                lexicon.push(translation);
            }  
        }
    } 
})

console.log(lexicon)

const p1 = "Mary reads a book."
const p2 = "A book is under the table."
const p3 = "Mary cut the sugar cane with a saw."
const p4 = "Mary cut the sugar cane and is happy."
const p5 = "The woman with a red cane saw a cat under the table and walks to the cat."


code.translate([p1,p2,p3,p4,p5], lexicon)
