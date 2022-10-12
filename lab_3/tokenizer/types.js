


const WORD_TYPES = {
    NAME: "NAME",
    NAME_COMPOSED: "NAME_COMPOSED",
    ABREV: "ABREV",
  }
  
  const MAIN_TYPE = {
    EMAIL: "EMAIL",
    URL: "URL",
    IP: "IP",
    WORD: "WORD",
    SIGN: "SIGN",
    NEWLINE: "NEWLINE",
    PHONE: "PHONE",
    PROPER_NOUN: "PROPER_NOUN",
  }
  
  const AMBIGUITY_LEVELS = {
    LOW: 100,
    MODERATE: 1000,
    HIGH: 10000,
  }
  
  const NODE_TYPES = {
    NOUN: "noun",
  }
  
  function NodeToken (){
     this.nodeTypes = [];
     this.ambiguityLevel = AMBIGUITY_LEVELS.MODERATE;
  }
  
  function Token () {
    this.mainType = null;
    this.node = null;
    this.value = null;
  }
  
  module.exports = {Token, NodeToken, NODE_TYPES, AMBIGUITY_LEVELS, MAIN_TYPE, WORD_TYPES}