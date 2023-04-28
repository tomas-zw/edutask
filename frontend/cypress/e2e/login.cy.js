describe("TODO tests", () => {
  let uid;
  let name;

  beforeEach(function () {
    cy.fixture("user.json").then((user) => {
      cy.request({
        method: "POST",
        url: "http://localhost:5000/users/create",
        form: true,
        body: user,
      }).then((response) => {
        uid = response.body._id.$oid;
        name = user.firstName + " " + user.lastName;
      });
    });

    cy.visit("http://localhost:3000");
    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type("test@email.com");
    cy.get("form").submit();

    cy.contains("div", "Title").find("input[type=text]").type("Task");
    cy.contains("div", "YouTube URL").find("input[type=text]").type("url.com");
    cy.get("form").submit();
    cy.contains("div", "Task").click();
  });

  it("R8UC1 add button disabled", () => {
    cy.get("form").find("input[type=submit]").should("be.disabled");
  });

  it("R8UC1 adds todo item", () => {
    cy.get("form").find("input[type=text]").type("Todo");
  });

  afterEach(function () {
    cy.request({
      method: "DELETE",
      url: `http://localhost:5000/users/${uid}`,
    }).then((response) => {
      cy.log(response.body);
    });
  });
});
