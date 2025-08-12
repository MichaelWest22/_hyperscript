describe("the convert command", function () {
	beforeEach(function () {
		clearWorkArea();
	});
	afterEach(function () {
		clearWorkArea();
	});

	it("can convert ISO to US date format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" to \"us-date\" then put it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z");
		var expectedStr = String(expected.getMonth() + 1).padStart(2, '0') + "/" + String(expected.getDate()).padStart(2, '0') + "/" + expected.getFullYear();
		div.innerHTML.should.equal(expectedStr);
	});

	it("can convert ISO to US datetime format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" to \"us-datetime\" then put it into me'></div>");
		div.click();
		// Note: actual time will vary by timezone, just check format
		div.innerHTML.should.match(/^\d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2} (AM|PM)$/);
	});

	it("can convert to local browser format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" to \"local\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.not.equal("2024-01-15T10:30:00Z");
		div.innerHTML.length.should.be.greaterThan(0);
	});

	it("can convert from innerHTML", function () {
		var div = make("<div _='on click convert my innerHTML from \"iso\" to \"us-date\" then put it into me'>2024-01-15T10:30:00Z</div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z");
		var expectedStr = String(expected.getMonth() + 1).padStart(2, '0') + "/" + String(expected.getDate()).padStart(2, '0') + "/" + expected.getFullYear();
		div.innerHTML.should.equal(expectedStr);
	});

	it("can convert US format to ISO", function () {
		var div = make("<div _='on click convert \"01/15/2024\" from \"us-date\" to \"iso\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.match(/^2024-01-15T/);
	});

	it("can convert with explicit UTC timezone", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" to \"us-datetime\" timezone \"UTC\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.match(/01\/15\/2024, 10:30 AM/);
	});

	it("defaults to local timezone when not specified", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" to \"iso-date\" then put it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z");
		var expectedStr = expected.getFullYear() + "-" + String(expected.getMonth() + 1).padStart(2, '0') + "-" + String(expected.getDate()).padStart(2, '0');
		div.innerHTML.should.equal(expectedStr);
	});

	it("puts result into it variable", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" to \"us-date\" then put \"Result: \" + it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z");
		var expectedStr = String(expected.getMonth() + 1).padStart(2, '0') + "/" + String(expected.getDate()).padStart(2, '0') + "/" + expected.getFullYear();
		div.innerHTML.should.equal("Result: " + expectedStr);
	});

	it("handles US date to ISO conversion", function () {
		var div = make("<div _='on click convert \"12/31/2023\" from \"us-date\" to \"iso\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.match(/^2023-12-31T/);
	});

	it("defaults to iso format when from is omitted", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-date\" then put it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z");
		var expectedStr = String(expected.getMonth() + 1).padStart(2, '0') + "/" + String(expected.getDate()).padStart(2, '0') + "/" + expected.getFullYear();
		div.innerHTML.should.equal(expectedStr);
	});

	it("defaults to iso format with timezone when from is omitted", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-datetime\" timezone \"UTC\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.match(/01\/15\/2024, 10:30 AM/);
	});

	it("uses all defaults (iso to local) when both from and to are omitted", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.not.equal("2024-01-15T10:30:00Z");
		div.innerHTML.length.should.be.greaterThan(0);
	});

	it("supports filler words", function () {
		var div = make("<div _='on click convert date of my innerHTML to \"us-date\" then put it into me'>2024-01-15T10:30:00Z</div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z");
		var expectedStr = String(expected.getMonth() + 1).padStart(2, '0') + "/" + String(expected.getDate()).padStart(2, '0') + "/" + expected.getFullYear();
		div.innerHTML.should.equal(expectedStr);
	});

	it("can parse local-datetime format", function () {
		var testDate = new Date();
		var localStr = testDate.toLocaleString();
		var div = make("<div _='on click convert \"" + localStr + "\" from \"local-datetime\" to \"iso\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.match(/^\d{4}-\d{2}-\d{2}T/);
	});

	it("can output local-date format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"local-date\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
	});

	it("can output local-time format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"local-time\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.match(/^\d{1,2}:\d{2}( (AM|PM))?$/);
	});

	it("outputs different formats for US vs EU dates", function () {
		var usDiv = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-date\" then put it into me'></div>");
		var euDiv = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"eu-date\" then put it into me'></div>");
		usDiv.click();
		euDiv.click();
		usDiv.innerHTML.should.not.equal(euDiv.innerHTML);
	});

	it("can parse EU date format", function () {
		var div = make("<div _='on click convert \"15/01/2024\" from \"eu-date\" to \"iso\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.match(/^2024-01-15T/);
	});

	it("timezone doesn't affect other conversions", function () {
		var div1 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-date\" timezone \"UTC\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-date\" then put it into me'></div>");
		div1.click();
		div2.click();
		// Both should work without timezone affecting the other
		div1.innerHTML.should.match(/^\d{2}\/\d{2}\/\d{4}$/);
		div2.innerHTML.should.match(/^\d{2}\/\d{2}\/\d{4}$/);
	});
});