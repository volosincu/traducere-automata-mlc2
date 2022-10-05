

const deepl = require('deepl-node');
const fs = require('fs');

const authKey = "<key here>";
console.log(authKey == "<key here>" ? "The API key is missig!": "API Key found.")
const translator = new deepl.Translator(authKey);


const textCreangaIon = "Amu cică era odată într-o țară un crai, care avea trei feciori.\
    Și craiul acela mai avea un frate mai mare, care era împărat într-o altă țară, mai depărtată.\
    Și împăratul, fratele craiului, se numea Verde-împărat; și împăratul Verde nu avea feciori, ci numai fete. \
    Mulți ani trecură la mijloc de când acești frați mai avură prilej a se întâlni amândoi. \
    Iară verii, adică feciorii craiului și fetele împăratului, nu se văzuse niciodată de când erau ei. \
    Și așa veni împrejurarea de nici împăratul Verde nu cunoștea nepoții săi, nici craiul nepoatele sale: \
    pentru că țara în care împărățea fratele cel mai mare era tocmai la o margine a pământului, \
    și crăia istuilalt la o altă margine. Și apoi, pe vremile acelea, mai toate țările erau bântuite de războaie grozave, \
    drumurile pe ape și pe uscat erau puțin cunoscute și foarte încurcate și de aceea nu se putea călători \
    așa de ușor și fără primejdii ca în ziua de astăzi. Și cine apuca a se duce pe atunci într-o parte a lumii \
    adeseori dus rămânea până la moarte."


const text3 = "Multumesc frumos"

const langs = ['ro', 'en-US', 'it', 'de', 'fr', 'en-US', 'pl', 'ro']

function translationChain(inputText) {
    let serie_traduceri = [{ from: 'ro', to: 'ro', source: inputText, target: inputText }]

    let i = 0;
    const clear = setInterval(() => {
        console.log("DEBUG i=" + i + ": ", `from: ${langs[i]}, to: ${langs[i + 1]}`)
        translator
            .translateText(serie_traduceri[i].target, null, langs[i + 1])
            .then((result) => {

                const trad = { from: langs[i], to: langs[i + 1], source: serie_traduceri[i].target, target: result.text }
                serie_traduceri = [...serie_traduceri, trad];
                i = i + 1;

                if (i == langs.length - 1) {
                    writeResultToFile(serie_traduceri)
                    clearInterval(clear);
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }, 2800);
}

function writeResultToFile(results) {
    fs.writeFile('results.json', JSON.stringify(results, null, 2), function (err) {
        if (err) return console.log(err);
        console.log('Datele au fost salvate in ./results.json');
    });
}


translationChain(text3);

