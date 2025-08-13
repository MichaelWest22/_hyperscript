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
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
		div.innerHTML.should.equal(expected);
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
		// Should be ISO format starting with the correct date
		div.innerHTML.should.match(/^2024-01-15T00:00:00/);
	});

	it("can convert with explicit UTC timezone", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" to \"us-datetime\" timezone \"UTC\" then put it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
		div.innerHTML.should.equal(expected);
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
		div.innerHTML.should.match(/^2023-12-31T00:00:00/);
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
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
		div.innerHTML.should.equal(expected);
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

	// Note: local-datetime format is only supported as output, not input
	// Parsing all possible locale datetime formats is not practical without a date library

	it("can output local-date format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"local-date\" then put it into me'></div>");
		div.click();
		// hyperscript now uses browser's actual locale for local-date format
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
		div.innerHTML.should.equal(expected);
	});

	it("can output local-time format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"local-time\" then put it into me'></div>");
		div.click();
		// hyperscript now uses browser's actual locale for local-time format
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
		div.innerHTML.should.equal(expected);
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
		div.innerHTML.should.match(/^2024-01-15T00:00:00/);
	});

	it("timezone doesn't affect other conversions", function () {
		var div1 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-date\" timezone \"UTC\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-date\" then put it into me'></div>");
		div1.click();
		div2.click();
		// Both should produce the same date format (timezone doesn't affect date-only formats)
		var expected = new Date("2024-01-15T10:30:00Z");
		var expectedStr = String(expected.getMonth() + 1).padStart(2, '0') + "/" + String(expected.getDate()).padStart(2, '0') + "/" + expected.getFullYear();
		div1.innerHTML.should.equal(expectedStr);
		div2.innerHTML.should.equal(expectedStr);
	});
	
	it("can output local-datetime format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"local-datetime\" then put it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
		div.innerHTML.should.equal(expected);
	});

	it("can output eu-datetime format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"eu-datetime\" then put it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
		div.innerHTML.should.equal(expected);
	});

	it("can convert with different timezone", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-datetime\" timezone \"America/New_York\" then put it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' });
		div.innerHTML.should.equal(expected);
	});

	it("handles iso-date format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"iso-date\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.equal("2024-01-15");
	});

	it("can output iso-full format with timezone offset", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"iso-full\" timezone \"America/New_York\" then put it into me'></div>");
		div.click();
		// Should be ISO format with fixed timezone offset (EST is UTC-5)
		div.innerHTML.should.equal("2024-01-15T05:30:00.000-05:00");
	});

	it("can output display-datetime format with timezone in parentheses", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"display-datetime\" timezone \"America/New_York\" then put it into me'></div>");
		div.click();
		// Should be readable format with fixed timezone in parentheses (EST is UTC-5)
		div.innerHTML.should.equal("2024-01-15 05:30:00 (UTC-05:00)");
	});

	// Timezone behavior tests
	it("applies default local timezone to us-datetime when no timezone specified", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-datetime\" then put it into me'></div>");
		div.click();
		// Should use local timezone, not UTC
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-US', { 
			year: 'numeric', month: '2-digit', day: '2-digit', 
			hour: '2-digit', minute: '2-digit', 
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
		});
		div.innerHTML.should.equal(expected);
	});

	it("applies default local timezone to eu-datetime when no timezone specified", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"eu-datetime\" then put it into me'></div>");
		div.click();
		// Should use local timezone, not UTC
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-GB', { 
			year: 'numeric', month: '2-digit', day: '2-digit', 
			hour: '2-digit', minute: '2-digit', 
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
		});
		div.innerHTML.should.equal(expected);
	});

	it("applies default local timezone to local-datetime when no timezone specified", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"local-datetime\" then put it into me'></div>");
		div.click();
		// Should use local timezone, not UTC
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString(undefined, { 
			year: 'numeric', month: '2-digit', day: '2-digit', 
			hour: '2-digit', minute: '2-digit', 
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
		});
		div.innerHTML.should.equal(expected);
	});

	it("does not apply timezone to date-only formats", function () {
		var div1 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-date\" timezone \"America/New_York\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-date\" then put it into me'></div>");
		div1.click();
		div2.click();
		// Date-only formats should be the same regardless of timezone
		div1.innerHTML.should.equal(div2.innerHTML);
	});

	it("iso-date format stays UTC regardless of timezone parameter", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"iso-date\" timezone \"America/New_York\" then put it into me'></div>");
		div.click();
		// iso-date should always be UTC date
		div.innerHTML.should.equal("2024-01-15");
	});

	it("iso-full format defaults to local timezone when no timezone specified", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"iso-full\" then put it into me'></div>");
		div.click();
		// Should use local timezone and include offset
		var localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		var expected = new Date("2024-01-15T10:30:00Z");
		var formatter = new Intl.DateTimeFormat('sv-SE', { 
			year: 'numeric', month: '2-digit', day: '2-digit', 
			hour: '2-digit', minute: '2-digit', second: '2-digit',
			timeZone: localTz 
		});
		var formattedDate = formatter.format(expected);
		// Should contain the formatted date with timezone offset
		div.innerHTML.should.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);
	});

	it("display-datetime format defaults to local timezone when no timezone specified", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"display-datetime\" then put it into me'></div>");
		div.click();
		// Should use local timezone and include offset in parentheses
		var localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		var expected = new Date("2024-01-15T10:30:00Z");
		var formatter = new Intl.DateTimeFormat('sv-SE', { 
			year: 'numeric', month: '2-digit', day: '2-digit', 
			hour: '2-digit', minute: '2-digit', second: '2-digit',
			timeZone: localTz 
		});
		// Should contain the formatted date with timezone in parentheses
		div.innerHTML.should.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \(UTC[+-]\d{2}:\d{2}\)$/);
	});

	// Edge case: verify formats that don't support timezone ignore it gracefully
	it("iso format ignores timezone parameter", function () {
		var div1 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"iso\" timezone \"America/New_York\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"iso\" then put it into me'></div>");
		div1.click();
		div2.click();
		// ISO format should be the same regardless of timezone parameter
		div1.innerHTML.should.equal(div2.innerHTML);
		div1.innerHTML.should.equal("2024-01-15T10:30:00.000Z");
	});

	it("local format ignores timezone parameter", function () {
		var div1 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"local\" timezone \"America/New_York\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"local\" then put it into me'></div>");
		div1.click();
		div2.click();
		// Local format should be the same regardless of timezone parameter
		div1.innerHTML.should.equal(div2.innerHTML);
	});

	// Date boundary tests - verify no +/- 1 day issues
	it("date-only formats don't shift dates across timezone boundaries", function () {
		// Test near midnight UTC - could shift to different day in other timezones
		var div1 = make("<div _='on click convert \"2024-01-15T01:00:00Z\" to \"us-date\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T01:00:00Z\" to \"us-date\" timezone \"America/Los_Angeles\" then put it into me'></div>");
		var div3 = make("<div _='on click convert \"2024-01-15T01:00:00Z\" to \"us-date\" timezone \"Asia/Tokyo\" then put it into me'></div>");
		div1.click();
		div2.click();
		div3.click();
		// All should show the same date (01/15/2024) regardless of timezone
		var expected = "01/15/2024";
		div1.innerHTML.should.equal(expected);
		div2.innerHTML.should.equal(expected);
		div3.innerHTML.should.equal(expected);
	});

	it("iso-date format stays consistent across timezones", function () {
		// Test with time that would be different day in various timezones
		var div1 = make("<div _='on click convert \"2024-01-15T23:00:00Z\" to \"iso-date\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T23:00:00Z\" to \"iso-date\" timezone \"Pacific/Auckland\" then put it into me'></div>");
		var div3 = make("<div _='on click convert \"2024-01-15T23:00:00Z\" to \"iso-date\" timezone \"America/Los_Angeles\" then put it into me'></div>");
		div1.click();
		div2.click();
		div3.click();
		// All should show the same UTC date
		var expected = "2024-01-15";
		div1.innerHTML.should.equal(expected);
		div2.innerHTML.should.equal(expected);
		div3.innerHTML.should.equal(expected);
	});

	it("eu-date format ignores timezone parameter", function () {
		// Test edge case: 2am UTC on Jan 15 = 6pm Jan 14 in LA, 1pm Jan 16 in Auckland
		var div1 = make("<div _='on click convert \"2024-01-15T02:00:00Z\" to \"eu-date\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T02:00:00Z\" to \"eu-date\" timezone \"America/Los_Angeles\" then put it into me'></div>");
		var div3 = make("<div _='on click convert \"2024-01-15T02:00:00Z\" to \"eu-date\" timezone \"Pacific/Auckland\" then put it into me'></div>");
		div1.click();
		div2.click();
		div3.click();
		// All should show the same date regardless of what the local time would be
		var expected = "15/01/2024";
		div1.innerHTML.should.equal(expected);
		div2.innerHTML.should.equal(expected);
		div3.innerHTML.should.equal(expected);
	});

	// Verify datetime formats DO respect timezone (contrast with date-only formats)
	it("datetime formats DO shift with timezone parameter", function () {
		// Same input time should show different local times in different timezones
		var div1 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-datetime\" timezone \"UTC\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-datetime\" timezone \"America/New_York\" then put it into me'></div>");
		div1.click();
		div2.click();
		// Should show different times (UTC vs EST)
		div1.innerHTML.should.not.equal(div2.innerHTML);
		// UTC should show 10:30, EST should show 05:30 (UTC-5)
		var utcExpected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-US', { 
			year: 'numeric', month: '2-digit', day: '2-digit', 
			hour: '2-digit', minute: '2-digit', timeZone: 'UTC' 
		});
		var estExpected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-US', { 
			year: 'numeric', month: '2-digit', day: '2-digit', 
			hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' 
		});
		div1.innerHTML.should.equal(utcExpected);
		div2.innerHTML.should.equal(estExpected);
	});

	// Test us-datetime and eu-datetime as input formats
	it("can parse us-datetime input format", function () {
		var div = make("<div _='on click convert \"01/15/2024, 10:30 AM\" from \"us-datetime\" to \"iso\" then put it into me'></div>");
		div.click();
		// Should parse US format correctly as local time
		var expected = new Date("2024-01-15T10:30:00").toISOString();
		div.innerHTML.should.equal(expected);
	});

	it("can parse eu-datetime input format", function () {
		var div = make("<div _='on click convert \"15/01/2024, 22:30\" from \"eu-datetime\" to \"iso\" then put it into me'></div>");
		div.click();
		// Should parse EU format correctly as local time
		var expected = new Date("2024-01-15T22:30:00").toISOString();
		div.innerHTML.should.equal(expected);
	});

	it("us-datetime vs eu-datetime parse dates differently", function () {
		// Same string should parse differently as US vs EU
		var usDiv = make("<div _='on click convert \"02/03/2024, 10:30\" from \"us-datetime\" to \"iso-date\" then put it into me'></div>");
		var euDiv = make("<div _='on click convert \"02/03/2024, 10:30\" from \"eu-datetime\" to \"iso-date\" then put it into me'></div>");
		usDiv.click();
		euDiv.click();
		// US: 02/03 = Feb 3rd, EU: 02/03 = March 2nd  
		var usExpected = new Date("2024-02-03T10:30:00").toISOString().substring(0, 10);
		var euExpected = new Date("2024-03-02T10:30:00").toISOString().substring(0, 10);
		usDiv.innerHTML.should.equal(usExpected);
		euDiv.innerHTML.should.equal(euExpected);
	});
});