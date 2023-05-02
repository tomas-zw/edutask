describe("TODO tests", () => {
  let uid;
  let name;
  let email;
  let todoId;

  beforeEach(function () {
    // Add user
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
    // Add task for user
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
    // Log in
    cy.visit("http://localhost:3000");
    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type("test3@email.com");
    cy.get("form").submit();
    /*  cy.contains("div", "Task").click(); */
  });

  it("R8UC1 add button disabled", () => {
    // Click on task
    cy.contains("div", "Task").click();
    // Check add button is disabled
    cy.get(".popup-inner").find("input[type=submit]").should("be.disabled");
  });

  it("R8UC1 adds todo item", () => {
    // Click on task
    cy.contains("div", "Task").click();
    // Add todo
    cy.get(".popup-inner").find("input[type=text]").type("My todo");
    cy.get(".popup-inner").find("input[type=submit]").click();
    // Check that todo was added
    cy.get(".todo-list").should("contain.text", "My todo");
  });

  it("R8UC2 sets item to done", () => {
    // Click on task
    cy.contains("div", "Task").click();
    // Find the checkbox and click it
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".checker")
      .click();
    // Check that text is struck through
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".editable")
      .invoke("css", "text-decoration")
      .should("include", "line-through");
  });

  it("R8UC2 sets item to active", () => {
    // Set the todo to done in the backend
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
    // Click the task
    cy.contains("div", "Task").click();
    // Find and click the checker
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".checker")
      .click();
    // Check that text is not struck through
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".editable")
      .invoke("css", "text-decoration")
      .should("not.include", "line-through");
  });

  it("R8UC3 deletes item", () => {
    // Find and click the remover
    // Click the task
    cy.contains("div", "Task").click();
    cy.contains(".popup-inner .todo-item", "Watch video")
      .find(".remover")
      .click({ force: true });
    // Check that todo is removed
    cy.contains(".popup-inner .todo-item", "Watch video").should("not.exist");
  });

  // Remove the user and tasks
  afterEach(function () {
    cy.request({
      method: "DELETE",
      url: `http://localhost:5000/users/${uid}`,
    }).then((response) => {
      cy.log(response.body);
    });
  });
});
