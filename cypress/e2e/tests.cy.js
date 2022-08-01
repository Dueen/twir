/// <reference types="cypress" />

import path from "path";

const metadataPath = path.join("content", "meta.json");

context("Window", () => {
  it(`can visit all pages`, () => {
    cy.readFile(metadataPath).then((metadata) => {
      metadata.map(async ({ id, title }) => {
        it(`can visit ${id}`, () => {
          cy.visit(`localhost:3000/${id}`);
          console.log(cy.title());
          cy.title().should("equal", title);
        });
      });
    });
  });
});
