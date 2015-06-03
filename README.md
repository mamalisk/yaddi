Yadda HTML Reporter
===================

Fancy HTML reports looking like ... this:

![YADDA_HTML_REPORTS](https://raw.githubusercontent.com/mamalisk/yadda-html-reporter/master/README/yadda.png)



**INSTALLATION**

      npm install yadda-mocha-html-reporter


**USAGE**

In order to use the yadda html report you need to do the following:

a. instantiate YaddaReport:

		var YaddaHtml = require('yadda-mocha-html-reporter');
		var reportsOutputLocation = './my_local_output_directory/yadda.json';
		var YaddaHtmlRep = new YaddaHtml(reportsOutputLocation);

b. your Yadda.FeatureFileSearch section should look like this:

		new Yadda.FeatureFileSearch(featuresLocation).each(function (file) {


        featureFile(file, function (feature) {
            YaddaHtmlRep.onFeature(feature);  // First statement

            before(function (done) {
                YaddaHtmlRep.onBefore(); // Second
                
                context = {
                    // something usually goes here
                };
                done();
            });

            beforeEach(function () {
                YaddaHtmlRep.onBeforeEach();
            });


            var yadda = new Yadda.Yadda(library, context);
            scenarios(feature.scenarios, function (scenario) {
                steps(scenario.steps, function (step, done) {
                    YaddaHtmlRep.onStep(scenario);
                    yadda.run(step, context, done);
                });
            });

            afterEach(function () {
                YaddaHtmlRep.onAfterEach(this.currentTest);
            });

            after(function (done) {
                YaddaHtmlRep.onAfter(feature);
                    done();
            });

        });
    });

This will produce a yadda.json within my_local_output_directory

c. Render the HTML

copy the example in the html of this git repository and there you have it. the yadda.json will get updated by your execution. hope it works!

For any comments/suggestions feel free to raise issues in this project or mail me at mamalis.kostas@gmail.com 





