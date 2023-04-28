describe("TODO tests", () => {
  let uid;
  let name;
  let email;

  before(function () {
    cy.fixture("user.json").then((user) => {
      cy.request({
        method: "POST",
        url: "http://localhost:5000/users/create",
        form: true,
        body: user,
      }).then((response) => {
        uid = response.body._id.$oid;
        name = user.firstName + " " + user.lastName;
        email = user.email;
      });
    });
    cy.visit("http://localhost:3000");
    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type("test3@email.com");
    cy.get("form").submit();
    cy.contains("div", "Title").find("input[type=text]").type("Task");
    cy.contains("div", "YouTube URL").find("input[type=text]").type("url.com");
    cy.get("form").submit();
  });

  beforeEach(function () {
    cy.visit("http://localhost:3000");
    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type("test3@email.com");
    cy.get("form").submit();

    cy.contains("div", "Task").click();
  });

  it("R8UC1 add button disabled", () => {
    cy.get(".popup-inner").find("input[type=submit]").should("be.disabled");
  });

  it("R8UC1 adds todo item", () => {
    cy.get(".popup-inner").find("input[type=text]").type("My todo");
    cy.get(".popup-inner").find("input[type=submit]").click();
    cy.get(".todo-list").should("contain.text", "My todo");
  });

  it("R8UC2 sets item to done", () => {
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".checker")
      .click();
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".editable")
      .invoke("css", "text-decoration")
      .should("include", "line-through");
  });

  it("R8UC2 sets item to active", () => {
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".checker")
      .click();
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".editable")
      .invoke("css", "text-decoration")
      .should("not.include", "line-through");
  });

  it("R8UC3 deletes item", () => {
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".remover")
      .click({ force: true });
    cy.contains(".popup-inner .todo-item", "Watch video").should("not.exist");
  });

  after(function () {
    cy.request({
      method: "DELETE",
      url: `http://localhost:5000/users/${uid}`,
    }).then((response) => {
      cy.log(response.body);
    });
  });
});
