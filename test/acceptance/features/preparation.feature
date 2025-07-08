@Preparation
Feature: Prearation
  Allow colaborators to manage the process of preparing the meals.

  Scenario: 
    Given a preparation was requested
    When a colaborator advances its status
    Then the preparation gets started

  Scenario: 
    Given a preparation was requested
    When a colaborator advances its status twice
    Then the preparation gets completed