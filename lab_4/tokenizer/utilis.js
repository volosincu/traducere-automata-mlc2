const { NODE_TYPES, MAIN_TYPE, } = require("./types")

function mapTokens(text) {
    const tokens = text.map((v) => {
        const node = new NodeToken();
        const tok = new Token();
        tok.value = v;
        tok.mainType = getTokenType(v);

        if (utils.isWordType(tok.mainType) && utils.isNoun(v)) {
            node.nodeTypes.push(NODE_TYPES.NOUN);
        }
        tok.node = node;
        return tok;
    });

    return tokens;
}

function getTokenType(word) {
    const special = utils.isIP(word) || utils.isEmail(word) || utils.isUrl(word);
    const sign = utils.isSign(word);

    if (special) {
        return getSpecialType(word);
    }

    if (sign) {
        return MAIN_TYPE.SIGN;
    }

    return MAIN_TYPE.WORD;
}

function getSpecialType(word) {
    if (utils.isEmail(word)) {
        return MAIN_TYPE.EMAIL;
    }

    if (utils.isIP(word)) {
        return MAIN_TYPE.IP;
    }

    if (utils.isUrl(word)) {
        return MAIN_TYPE.URL;
    }
}


module.exports = {
    mapTokens: mapTokens,
    isEmail: function (word) {
        var re = /\S+@\S+\.\S+/;
        return re.test(word);
    },

    isIP: function (word) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(word)) {
            return (true)
        }
        return false;
    },

    isUrl: function (word) {
        try {
            return Boolean(new URL(word));
        }
        catch (e) {
            return false;
        }
    },

    isSign: function (word) {
        if (word && word.length > 1) {
            return;
        }
        return [",", ".", ";", "!", "?", "(", ")", "[", "]"].includes(word);
    },

    isNoun: function (word) {
        return "abcdefghijklmnopqrstyxz".toUpperCase().split("").includes(word.charAt(0));
    },

    isProperNoun: function (tokenIndex) {
        // acceseaza|cauta token anterior si verifica dupa dl. dna. domnul doamna domnisoara 
        return;
    },

    isWordType: function (type) {
        return type === MAIN_TYPE.WORD;
    }
}
