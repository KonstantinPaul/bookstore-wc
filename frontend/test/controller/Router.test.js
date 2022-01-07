const assert = chai.assert; // using chaijs as an "comparison" library
import sinon from "../../node_modules/sinon/pkg/sinon-esm.js";
import TestHelpers from "../TestHelpers.js";

// load dependencies
import Router from "../../src/controller/Router.js";

// load classes to mock
import BookController from "../../src/controller/BookController.js";
import PageNotFoundView from "../../src/view/PageNotFoundView.js";

describe("Test Router", function() {
  const validTestRoutes = [{
      "description": "List route for Books is tested",
      "route": "#/book/list",
      "controllerMethodName": "renderListView",
      "params": new URLSearchParams() // empty search params object
    },
    {
      "description": "Add route for a new book",
      "route": "#/book/add",
      "controllerMethodName": "renderAddView",
      "params": undefined
    },
    {
      "description": "Details route for a new book",
      "route": "#/book/details?isbn=123456789",
      "controllerMethodName": "renderDetailsView",
      "params": new URLSearchParams([["isbn", "123456789"]])
    },
    {
      "description": "Search books route for title='Foobar'",
      "route": "#/book/list?title=Foobar",
      "controllerMethodName": "renderListView",
      "params": new URLSearchParams([["title", "Foobar"]])
    }
  ];

  const invalidTestRoutes = [{
      "description": "Unknown route",
      "route": "#/foo/bar"
    },
    {
      "description": "Unknown method for book model",
      "route": "#/book/foobar"
    },
    {
      "description": "Book model without method",
      "route": "#/book/"
    }
    // TODO: Add more invalid route objects? Maybe some with invalid parameters?
  ];

  afterEach(function() {
    sinon.restore();
  });

  // generate tests for valid routes
  describe("Valid Routes:", function() {
    beforeEach(function() {
      const pageNotFoundStub = sinon.createStubInstance(PageNotFoundView);
      const bookControllerStub = sinon.createStubInstance(BookController);
      this.router = new Router(new BookController(), new PageNotFoundView());
    });

    afterEach(function() {
      sinon.resetHistory();
    });

    for (const validRoute of validTestRoutes) {
      it(validRoute.description, async function() {
        // stub PageNotFoundView
        const pageNotFoundStub = sinon.createStubInstance(PageNotFoundView);
        const renderViewStub = sinon.stub(PageNotFoundView.prototype, "renderView");

        // stub BookController method
        const bookControllerStub = sinon.createStubInstance(BookController);
        const bookControllerMethodStub = sinon.stub(
          BookController.prototype, 
          validRoute.controllerMethodName
        );

        // activate routing
        this.router.route(validRoute.route);

        // assert controller call
        assert.equal(bookControllerMethodStub.callCount, 1, "Expect controller call count the right times");
        assert.deepEqual(bookControllerMethodStub.firstCall.args[0], validRoute.params);

        // assert that PageNotFound was not called at all
        assert.isFalse(renderViewStub.called, "Expect PageNotFoundView's renderView() method not to be called");
      });
    }
  });

  // generate tests for invalid routes
  describe("Invalid Routes:", function() {
    beforeEach(function() {
      const pageNotFoundStub = sinon.createStubInstance(PageNotFoundView);
      const bookControllerStub = sinon.createStubInstance(BookController);
      this.router = new Router(new BookController(), new PageNotFoundView());
    });

    afterEach(function() {
      sinon.resetHistory();
    });

    for (const invalidRoute of invalidTestRoutes) {
      it(invalidRoute.description, async function() {
        // Stub renderView() from PageNotFoundView
        const renderViewStub = sinon.stub(PageNotFoundView.prototype, "renderView");

        // activate routing
        this.router.route(invalidRoute.route);

        assert.isTrue(renderViewStub.calledOnce, "Expect PageNotFoundView's renderView() method to be called once");
      });
    }
  });


});
