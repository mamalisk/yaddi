var _ = require('underscore');
var jsonfile = require('jsonfile');
var loki = require('lokijs');
var featureLoki = 1;
var scenarioLoki = 0;

var Yaddi = function(reportsOutputLocation){
    this.yaddi = new loki(reportsOutputLocation);
    this.featuresDb = this.yaddi.addCollection('features');
    this.scenariosDb = this.yaddi.addCollection('scenarios');
    this.reportsOutputLocation = reportsOutputLocation;
};

Yaddi.prototype.onFeature = function(feature){

    this.currentFeature = this.featuresDb.insert({
        name: feature.title,
        descriptionLines : feature.description,
        status : 'passed',
        tags : Object.keys(feature.annotations)
    });
};

Yaddi.prototype.onBefore = function(){

    
    this.currentStatus = 'not_executed';
    
    scenarioLoki = scenario.$loki;
};

Yaddi.prototype.onBeforeEach = function(){
    if (this.currentStatus == 'failed') {
        var feature = this.featuresDb.get(featureLoki);
        feature.status = 'failed';
        this.featuresDb.update(feature);
    } 
};

Yaddi.prototype.onStep = function(scenario){
      
    var sc = this.scenariosDb.findOne({name : scenario.title});
    
    if(sc)
     {
        sc.name = scenario.title;
        sc.feature = featureLoki;
        sc.tags = Object.keys(scenario.annotations);    
        this.scenariosDb.update(sc);
    } else {
        var newSc = this.scenariosDb.insert({
            feature : featureLoki,
            name : scenario.title,
            tags : Object.keys(scenario.annotations),
            screenshot : '',
            error : '',
            steps : []
        });
        scenarioLoki = newSc.$loki;
    }
     
};


Yaddi.prototype.onAfterEach = function(currentTest){
    this.currentStatus = currentTest.state;
            var scenario = this.scenariosDb.get(scenarioLoki);
            scenario.steps.push({
                name: currentTest.title,
                status : currentTest.state,
                duration : currentTest.duration + ' ms'
            });

            if(currentTest.state == 'failed'){
                scenario.error = currentTest.err.message;
            }

            this.scenariosDb.update(scenario);

        if(currentTest.state == 'failed') {
            var feature = this.featuresDb.get(featureLoki);
            feature.status = 'failed';
            this.featuresDb.update(feature);
            this.currentStatus = 'failed';
        }

    
      
};



Yaddi.prototype.onAfter = function(feature){
    var feat = this.featuresDb.get(featureLoki);
    if(feat.status !== 'failed') { 
        feat.status = this.currentStatus; 
    }
    this.featuresDb.update(feat);
    featureLoki++;
    this.yaddi.saveDatabase(function(){
        console.log('saved database...');
    });
    this.yaddi.save();
    jsonfile.writeFileSync(this.reportsOutputLocation);
};


module.exports = Yaddi;


