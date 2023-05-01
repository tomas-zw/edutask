describe("TODO tests", () => {
  let uid;
  let name;
  let email;
  let todoId;

  before(function () {
    /* cy.fixture("user.json").then((user) => {
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
    }); */
    /* cy.fixture("task.json").then((task) => {
      task.userid = uid;
      cy.request({
        method: "POST",
        url: "http://localhost:5000/tasks/create",
        form: true,
        body: task,
      }).then((response) => {
        //tid = response.body._id.$oid;
      });
    }); */
    /* cy.visit("http://localhost:3000");
    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type("test3@email.com");
    cy.get("form").submit();
    cy.contains("div", "Title").find("input[type=text]").type("Task");
    cy.contains("div", "YouTube URL").find("input[type=text]").type("url.com");
    cy.get("form").submit(); */
  });

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
        email = user.email;
      });
    });
    cy.fixture("task.json").then((task) => {
      task.userid = uid;
      cy.request({
        method: "POST",
        url: "http://localhost:5000/tasks/create",
        form: true,
        body: task,
      }).then((response) => {
        cy.log(response.body[0].todos[0]._id.$oid);
        todoId = response.body[0].todos[0]._id.$oid;
      });
    });
    cy.visit("http://localhost:3000");
    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type("test3@email.com");
    cy.get("form").submit();
    /*  cy.contains("div", "Task").click(); */
  });

  it("R8UC1 add button disabled", () => {
    cy.contains("div", "Task").click();
    cy.get(".popup-inner").find("input[type=submit]").should("be.disabled");
  });

  it("R8UC1 adds todo item", () => {
    cy.contains("div", "Task").click();
    cy.get(".popup-inner").find("input[type=text]").type("My todo");
    cy.get(".popup-inner").find("input[type=submit]").click();
    cy.get(".todo-list").should("contain.text", "My todo");
  });

  it("R8UC2 sets item to done", () => {
    cy.contains("div", "Task").click();
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".checker")
      .click();
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".editable")
      .invoke("css", "text-decoration")
      .should("include", "line-through");
  });

  it("R8UC2 sets item to active", () => {
    cy.fixture("todo.json").then((todo) => {
      cy.request({
        method: "PUT",
        url: `http://localhost:5000/todos/byid/${todoId}`,
        form: true,
        body: todo,
      }).then((response) => {
        cy.log(response.body);
      });
    });
    cy.contains("div", "Task").click();
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

  afterEach(function () {
    cy.request({
      method: "DELETE",
      url: `http://localhost:5000/users/${uid}`,
    }).then((response) => {
      cy.log(response.body);
    });
  });

  /* after(function () {
    cy.request({
      method: "DELETE",
      url: `http://localhost:5000/users/${uid}`,
    }).then((response) => {
      cy.log(response.body);
    });
  }); */
});
