'use strict';

var firstSteps = function(yadda){

    this.yadda = yadda.yadda;

    this.yadda.given("I am rich", function (done){
            console.log("i am rich");
            done();
        })

        .when("I buy a Porsche", function(done){
            console.log('i buy a porsche');
            done();
        })

        .when('I cause a failure', function(done){
            throw new Error('failure!!!');
        })

        .then("I am happier", function(done){
            console.log('i am happy');
            done();
        });
};


module.exports = firstSteps;
