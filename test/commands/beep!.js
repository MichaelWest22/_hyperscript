describe("the beep! command", function () {
	beforeEach(function () {
		clearWorkArea();
	});
	afterEach(function () {
		clearWorkArea();
	});

	it("can beep single item", function () {
		var runtime = _hyperscript.internals.runtime;
		var originalBeep = runtime.beepValueToConsole;
		var beepCalls = [];

		runtime.beepValueToConsole = function(element, expression, value) {
			beepCalls.push({element, expression, value});
		};

		try {
			var div = make("<div _='on click beep! 42'></div>");
			div.click();
			
			beepCalls.length.should.equal(1);
			beepCalls[0].value.should.equal(42);
		} finally {
			runtime.beepValueToConsole = originalBeep;
		}
	});

	it("can beep multiple items", function () {
		var runtime = _hyperscript.internals.runtime;
		var originalBeep = runtime.beepValueToConsole;
		var beepCalls = [];

		runtime.beepValueToConsole = function(element, expression, value) {
			beepCalls.push({element, expression, value});
		};

		try {
			var div = make("<div _='on click beep! 42, \"hello\", true'></div>");
			div.click();
			
			beepCalls.length.should.equal(3);
			beepCalls[0].value.should.equal(42);
			beepCalls[1].value.should.equal('hello');
			beepCalls[2].value.should.equal(true);
		} finally {
			runtime.beepValueToConsole = originalBeep;
		}
	});
});