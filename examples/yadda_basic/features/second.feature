@Second_feature
Feature: Feature 2
  A very important feature

  Background: 

      Given I am rich


  @Rich
  @Not_poor
  Scenario: Rich scenario 2.1
     When I buy a Porsche
     When I cause a failure
     Then I am happier


       @Rich
  @Not_poor
  Scenario: Rich scenario 2.2
     When I buy a Porsche
     Then I am happier