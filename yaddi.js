var _ = require('underscore');
var loki = require('lokijs');
var yaddi = new loki('yaddi.json');
var featureLoki = 1;
var scenarioLoki = 0;

var Yaddi = function(reportsOutputLocation){
    
    this.featuresDb = yaddi.addCollection('features');
    this.scenariosDb = yaddi.addCollection('scenarios');
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
    
        console.log('found');
        sc.name = scenario.title;
        sc.feature = featureLoki;
        sc.tags = Object.keys(scenario.annotations);    
        this.scenariosDb.update(sc);
    } else {
        console.log('notFound');
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
        console.log('scenario loki: ' + scenarioLoki);
            var scenario = this.scenariosDb.get(scenarioLoki);
            scenario.steps.push({
                name: currentTest.title,
                status : currentTest.state
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
    yaddi.save();
};


module.exports = Yaddi;


