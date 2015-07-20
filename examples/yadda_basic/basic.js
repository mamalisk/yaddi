/* jslint node: true */
/* global before, afterEach, after, featureFile, scenarios, steps */

module.exports = function YaddaExecutor(featuresPath, stepDefsPath, reports) {
	'use strict';
	var Yadda = require('yadda');
	Yadda.plugins.mocha.StepLevelPlugin.init();
	var library = require(stepDefsPath);

	var context = {
		hello : 'hello'
	};

	var YaddaHtml = require('../../yaddi');
	var YaddaHtmlRep = new YaddaHtml(reports);

	new Yadda.FeatureFileSearch(featuresPath).each(function(file){
         featureFile(file, function(feature){
         	YaddaHtmlRep.onFeature(feature);

         	before(function(done){
         		YaddaHtmlRep.onBefore();
         		context = {
         			hello : 'updated hello'
         		};
         		done();
         	});

            beforeEach(function(){
            	YaddaHtmlRep.onBeforeEach();
            })

            var yadda = new Yadda.Yadda(library, context);
            scenarios(feature.scenarios, function(scenario){
            	steps(scenario.steps, function(step, done){
            		YaddaHtmlRep.onStep(scenario);
            		yadda.run(step, context, done);
            	});
            })

            afterEach(function(){
            	YaddaHtmlRep.onAfterEach(this.currentTest);
            });

            after(function(done){
            	YaddaHtmlRep.onAfter(feature);
            	done();
            })


         })
	});
}