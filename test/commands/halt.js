describe("the halt command", function () {
	beforeEach(function () {
		clearWorkArea();
	});
	afterEach(function () {
		clearWorkArea();
	});

	it("can halt event propagation and default behavior", function () {
		var div = make("<div _='on click halt'></div>");
		var event = new Event("click", { bubbles: true, cancelable: true });
		div.dispatchEvent(event);
		event.defaultPrevented.should.equal(true);
	});

	it("can halt only bubbling", function () {
		window.parentClicked = false;
		var parent = make("<div _='on click set window.parentClicked to true'><div _='on click halt bubbling'></div></div>");
		var child = parent.firstElementChild;
		var event = new Event("click", { bubbles: true, cancelable: true });
		child.dispatchEvent(event);
		event.defaultPrevented.should.equal(false);
		window.parentClicked.should.equal(false);
		delete window.parentClicked;
	});

	it("can halt only default behavior", function () {
		window.parentClicked = false;
		var parent = make("<div _='on click set window.parentClicked to true'><div _='on click halt default'></div></div>");
		var child = parent.firstElementChild;
		var event = new Event("click", { bubbles: true, cancelable: true });
		child.dispatchEvent(event);
		event.defaultPrevented.should.equal(true);
		window.parentClicked.should.equal(true);
		delete window.parentClicked;
	});

	it("can halt the event", function () {
		var div = make(`<div _="on click halt the event's"></div>`);
		var event = new Event("click", { bubbles: true, cancelable: true });
		div.dispatchEvent(event);
		event.defaultPrevented.should.equal(true);
	});

});