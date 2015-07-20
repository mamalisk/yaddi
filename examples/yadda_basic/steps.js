'use strict';

var yadda = require('yadda').localisation.English.library();

var Yadda1 = require('./yadda1');
var Yadda2 = require('./yadda2');
var all = new Yadda2(new Yadda1({
    yadda : yadda
}));


module.exports = (function(){

    return all.yadda;
   
})();