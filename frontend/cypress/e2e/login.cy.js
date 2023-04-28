describe("Logging into the system", () => {
  it("starting out on the landing screen", () => {
    //enter the main page
    cy.visit("http://localhost:3000");
    cy.get("h1").should("contain.text", "Login");
  });
});
