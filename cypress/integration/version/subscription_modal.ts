// / <reference types="Cypress" />

import { openSubscriptionModal } from "../../utils/subscriptionModal";

const regexSelectorRow = "regex-selector-row";

describe("Version Subscription Modal", () => {
  const dataCyToggleModalButton = "notify-patch";
  const route = "/version/5e4ff3abe3c3317e352062e4/tasks";

  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  describe("Regex selector inputs", () => {
    it("Clicking on 'Add Additional Criteria' adds a regex selector row", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.dataCy(regexSelectorRow).should("have.length", 0);
      cy.contains("Add Additional Criteria").click();
      cy.dataCy(regexSelectorRow).should("have.length", 1);
    });

    it("Clicking on the trash glyph removes the regex selector", () => {
      cy.dataCy(regexSelectorRow).should("have.length", 1);
      cy.dataCy("delete-item-button").first().click();
      cy.dataCy(regexSelectorRow).should("have.length", 0);
    });

    it.skip("'Regex' input should be disabled when the 'Field name' is empty and enabled otherwise", () => {
      cy.contains("Add Additional Criteria").click();
      cy.dataCy(regexSelectorRow).should("be.disabled");
      cy.dataCy("regex-selector-dropdown").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy(regexSelectorRow).should("not.be.disabled");
    });

    it("Selecting a regex selector type will disable that option in other regex selector type dropdowns", () => {
      cy.contains("Add Additional Criteria").click();
      cy.contains("Add Additional Criteria").click();
      cy.dataCy("regex-select").last().click();
      cy.contains("Build Variant Name").should("be.visible");
      cy.contains("Build Variant ID").should("have.css", "user-select", "none");
    });

    it("Regex selectors are optional for triggers that offer them", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").should("not.be.disabled");
      cy.dataCy("save-subscription-button").click();
      cy.validateToast("success", "Your subscription has been added");
    });

    it.skip("Switching between Event types should either hide or reset regex selector inputs", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.contains("Add Additional Criteria").click();
      cy.dataCy("regex-select").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy("regex-input").type("stuff").should("have.value", "stuff");
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version fails").click();
      cy.dataCy("regex-input").should("have.value", "");
    });

    it.skip("Changing the regex selector dropdown should reset the regex selector input", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.contains("Add Additional Criteria").click();
      cy.dataCy("regex-select").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy("regex-input").type("stuff").should("have.value", "stuff");
      cy.dataCy("regex-select").click();
      cy.contains("Build Variant ID").click();
      cy.dataCy("regex-input").should("have.value", "");
    });

    it("Display success toast after submitting a valid form with regex selectors inputs and request succeeds", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.contains("Add Additional Criteria").click();
      cy.dataCy("regex-select").click();
      cy.contains("Build Variant Name").click();
      cy.dataCy("regex-input").type("stuff");
      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.dataCy("save-subscription-button").click();
      cy.validateToast("success", "Your subscription has been added");
    });

    it("'Add Additional Criteria' button should not appear when there are enough 'Field name' dropdowns to represent all possible regex selector types for a trigger", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.getInputByLabel("Event").click({ force: true });
      cy.contains("A build-variant in this version finishes").click();
      cy.contains("Add Additional Criteria").should("not.be.disabled");
      cy.contains("Add Additional Criteria").click();
      cy.contains("Add Additional Criteria").should("not.be.disabled");
      cy.contains("Add Additional Criteria").click();

      cy.contains("Add Additional Criteria").should("not.exist");
    });
  });
});
