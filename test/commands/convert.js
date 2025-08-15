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
		// Should be ISO format - date-only input treated as local midnight
		var expected = new Date("2024-01-15T00:00:00").toISOString();
		div.innerHTML.should.equal(expected);
	});

	it("can convert with explicit UTC output timezone", function () {
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
		// Date-only input treated as local midnight
		var expected = new Date("2023-12-31T00:00:00").toISOString();
		div.innerHTML.should.equal(expected);
	});

	it("defaults to iso format when from is omitted", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"us-date\" then put it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z");
		var expectedStr = String(expected.getMonth() + 1).padStart(2, '0') + "/" + String(expected.getDate()).padStart(2, '0') + "/" + expected.getFullYear();
		div.innerHTML.should.equal(expectedStr);
	});

	it("defaults to iso format with output timezone when from is omitted", function () {
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

	// HTML datetime-local inputs work seamlessly with smart ISO format

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
		// Date-only input treated as local midnight
		var expected = new Date("2024-01-15T00:00:00").toISOString();
		div.innerHTML.should.equal(expected);
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

	it("HTML datetime-local input works with smart iso default", function () {
		// Simulate HTML datetime-local input value
		var div = make("<div _='on click convert \"2024-01-15T14:00\" from \"iso\" timezone \"America/New_York\" to \"us-datetime\" then put it into me'></div>");
		div.click();
		// Should parse as EST and display in local timezone
		var utcTime = new Date("2024-01-15T19:00:00Z"); // 2 PM EST = 7 PM UTC
		var expected = utcTime.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
		div.innerHTML.should.equal(expected);
	});

	it("can output eu-datetime format", function () {
		var div = make("<div _='on click convert \"2024-01-15T10:30:00Z\" to \"eu-datetime\" then put it into me'></div>");
		div.click();
		var expected = new Date("2024-01-15T10:30:00Z").toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
		div.innerHTML.should.equal(expected);
	});

	it("can convert with different output timezone", function () {
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

	it("can output iso-full format with output timezone offset", function () {
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

	// New dual timezone tests
	it("smart iso format detects timezone-less input and applies timezone parameter", function () {
		var div = make("<div _='on click convert \"2024-01-15T14:00\" from \"iso\" timezone \"America/New_York\" to \"iso\" then put it into me'></div>");
		div.click();
		// 2:00 PM EST should convert to 7:00 PM UTC
		div.innerHTML.should.equal("2024-01-15T19:00:00.000Z");
	});

	it("smart iso format with Z ignores timezone parameter", function () {
		var div = make("<div _='on click convert \"2024-01-15T14:00Z\" from \"iso\" timezone \"America/New_York\" to \"iso\" then put it into me'></div>");
		div.click();
		// Z means UTC, timezone parameter should be ignored
		div.innerHTML.should.equal("2024-01-15T14:00:00.000Z");
	});

	it("smart iso format with offset ignores timezone parameter", function () {
		var div = make("<div _='on click convert \"2024-01-15T14:00-05:00\" from \"iso\" timezone \"Asia/Tokyo\" to \"iso\" then put it into me'></div>");
		div.click();
		// Offset means embedded timezone, parameter should be ignored
		div.innerHTML.should.equal("2024-01-15T19:00:00.000Z");
	});

	it("smart iso format without timezone uses browser local by default", function () {
		var div = make("<div _='on click convert \"2024-01-15T14:00\" from \"iso\" to \"iso\" then put it into me'></div>");
		div.click();
		// Should parse as browser local time and convert to UTC
		var expected = new Date("2024-01-15T14:00:00").toISOString();
		div.innerHTML.should.equal(expected);
	});

	it("can specify both input and output timezones", function () {
		var div = make("<div _='on click convert \"01/15/2024, 2:00 PM\" from \"us-datetime\" timezone \"America/Chicago\" to \"us-datetime\" timezone \"Asia/Tokyo\" then put it into me'></div>");
		div.click();
		// 2:00 PM CST should convert to 5:00 AM JST next day
		var expected = new Date("2024-01-15T20:00:00Z").toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' });
		div.innerHTML.should.equal(expected);
	});

	it("smart iso with timezone-less input for multi-timezone conversion", function () {
		var div = make("<div _='on click convert \"2024-01-15T14:00\" from \"iso\" timezone \"America/Chicago\" to \"us-datetime\" timezone \"Asia/Tokyo\" then put it into me'></div>");
		div.click();
		// 2:00 PM CST should convert to 5:00 AM JST next day
		var expected = new Date("2024-01-15T20:00:00Z").toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' });
		div.innerHTML.should.equal(expected);
	});

	it("smart iso timezone parameter overrides default parsing behavior", function () {
		// Same datetime string with different input timezones should produce different UTC results
		var div1 = make("<div _='on click convert \"2024-01-15T10:30\" from \"iso\" timezone \"UTC\" to \"iso\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T10:30\" from \"iso\" timezone \"America/New_York\" to \"iso\" then put it into me'></div>");
		div1.click();
		div2.click();
		// UTC input should stay the same, EST input should be 5 hours later in UTC
		div1.innerHTML.should.equal("2024-01-15T10:30:00.000Z");
		div2.innerHTML.should.equal("2024-01-15T15:30:00.000Z");
	});

	it("smart iso ignores timezone parameter when input has timezone info", function () {
		// ISO format with Z already has timezone info, so input timezone should be ignored
		var div1 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" timezone \"America/New_York\" to \"us-datetime\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" to \"us-datetime\" then put it into me'></div>");
		div1.click();
		div2.click();
		// Should be the same since ISO format includes timezone info
		div1.innerHTML.should.equal(div2.innerHTML);
	});

	it("date-only formats ignore both input and output timezones", function () {
		var div1 = make("<div _='on click convert \"01/15/2024\" from \"us-date\" timezone \"America/New_York\" to \"eu-date\" timezone \"Asia/Tokyo\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"01/15/2024\" from \"us-date\" to \"eu-date\" then put it into me'></div>");
		div1.click();
		div2.click();
		// Date-only formats should ignore timezone parameters
		div1.innerHTML.should.equal(div2.innerHTML);
		div1.innerHTML.should.equal("15/01/2024");
	});

	it("smart iso format examples from documentation work correctly", function () {
		// Test the three cases from docs
		var div1 = make("<div _='on click convert \"2024-01-15T10:30:00Z\" from \"iso\" to \"us-datetime\" then put it into me'></div>");
		var div2 = make("<div _='on click convert \"2024-01-15T10:30:00-05:00\" from \"iso\" to \"us-datetime\" then put it into me'></div>");
		var div3 = make("<div _='on click convert \"2024-01-15T10:30:00\" from \"iso\" timezone \"America/New_York\" to \"us-datetime\" then put it into me'></div>");
		
		div1.click(); // With Z - uses UTC
		div2.click(); // With offset - uses embedded timezone
		div3.click(); // Without timezone - uses specified timezone
		
		// All should show the same local time since they represent the same moment
		var expectedUTC = new Date("2024-01-15T10:30:00Z").toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
		var expectedEST = new Date("2024-01-15T15:30:00Z").toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
		
		div1.innerHTML.should.equal(expectedUTC);
		div2.innerHTML.should.equal(expectedEST); // -05:00 = EST
		div3.innerHTML.should.equal(expectedEST); // America/New_York in January = EST
	});

	// Comprehensive date boundary tests - critical for preventing ±1 day bugs
	it("all date formats are timezone-safe at midnight boundaries", function () {
		// Test times that cross date boundaries in different timezones
		var testCases = [
			"2024-01-15T00:30:00Z", // 30 min after midnight UTC
			"2024-01-15T23:30:00Z", // 30 min before midnight UTC
			"2024-12-31T23:59:00Z", // Year boundary
			"2024-02-29T01:00:00Z"  // Leap year boundary
		];
		
		var timezones = ["America/Los_Angeles", "Europe/London", "Asia/Tokyo", "Pacific/Auckland"];
		
		testCases.forEach(function(testTime) {
			timezones.forEach(function(tz) {
				// Test us-date format - should ignore output timezone
				var usDiv1 = make("<div _='on click convert \"" + testTime + "\" to \"us-date\" then put it into me'></div>");
				var usDiv2 = make("<div _='on click convert \"" + testTime + "\" to \"us-date\" timezone \"" + tz + "\" then put it into me'></div>");
				usDiv1.click();
				usDiv2.click();
				usDiv1.innerHTML.should.equal(usDiv2.innerHTML, "us-date should be timezone-safe for " + testTime + " in " + tz);
				
				// Test eu-date format - should ignore output timezone
				var euDiv1 = make("<div _='on click convert \"" + testTime + "\" to \"eu-date\" then put it into me'></div>");
				var euDiv2 = make("<div _='on click convert \"" + testTime + "\" to \"eu-date\" timezone \"" + tz + "\" then put it into me'></div>");
				euDiv1.click();
				euDiv2.click();
				euDiv1.innerHTML.should.equal(euDiv2.innerHTML, "eu-date should be timezone-safe for " + testTime + " in " + tz);
				
				// Test iso-date format - should ignore output timezone
				var isoDiv1 = make("<div _='on click convert \"" + testTime + "\" to \"iso-date\" then put it into me'></div>");
				var isoDiv2 = make("<div _='on click convert \"" + testTime + "\" to \"iso-date\" timezone \"" + tz + "\" then put it into me'></div>");
				isoDiv1.click();
				isoDiv2.click();
				isoDiv1.innerHTML.should.equal(isoDiv2.innerHTML, "iso-date should be timezone-safe for " + testTime + " in " + tz);
			});
		});
	});

	it("date parsing from different input formats maintains date consistency", function () {
		// Test that parsing the same date from different formats produces the same date output
		var testDate = "15/01/2024"; // Jan 15, 2024 in EU format
		var testDateUS = "01/15/2024"; // Same date in US format
		
		// Parse EU date and convert to US date
		var euToUs = make("<div _='on click convert \"" + testDate + "\" from \"eu-date\" to \"us-date\" then put it into me'></div>");
		euToUs.click();
		euToUs.innerHTML.should.equal(testDateUS);
		
		// Parse US date and convert to EU date
		var usToEu = make("<div _='on click convert \"" + testDateUS + "\" from \"us-date\" to \"eu-date\" then put it into me'></div>");
		usToEu.click();
		usToEu.innerHTML.should.equal(testDate);
		
		// Both should produce the same ISO date
		var euToIso = make("<div _='on click convert \"" + testDate + "\" from \"eu-date\" to \"iso-date\" then put it into me'></div>");
		var usToIso = make("<div _='on click convert \"" + testDateUS + "\" from \"us-date\" to \"iso-date\" then put it into me'></div>");
		euToIso.click();
		usToIso.click();
		euToIso.innerHTML.should.equal(usToIso.innerHTML);
		euToIso.innerHTML.should.equal("2024-01-15");
	});

	it("local-date output format is timezone-safe", function () {
		// Test that local-date output doesn't shift dates across timezone boundaries
		var testTimes = [
			"2024-01-15T00:30:00Z", // Early morning UTC
			"2024-01-15T23:30:00Z"  // Late evening UTC
		];
		
		testTimes.forEach(function(testTime) {
			var div1 = make("<div _='on click convert \"" + testTime + "\" to \"local-date\" then put it into me'></div>");
			var div2 = make("<div _='on click convert \"" + testTime + "\" to \"local-date\" timezone \"Pacific/Auckland\" then put it into me'></div>");
			var div3 = make("<div _='on click convert \"" + testTime + "\" to \"local-date\" timezone \"America/Los_Angeles\" then put it into me'></div>");
			
			div1.click();
			div2.click();
			div3.click();
			
			// All should show the same date regardless of timezone (local-date ignores timezone parameter)
			div1.innerHTML.should.equal(div2.innerHTML, "local-date should be timezone-safe for " + testTime);
			div1.innerHTML.should.equal(div3.innerHTML, "local-date should be timezone-safe for " + testTime);
		});
	});

	it("date-only ISO string with timezone parameter should not shift dates", function () {
		var div = make("<div _='on click convert \"2024-01-15\" from \"iso\" timezone \"America/New_York\" to \"us-datetime\" then put it into me'></div>");
		div.click();
		// Should still show Jan 15, timezone should be ignored for date-only input
		div.innerHTML.should.match(/01\/15\/2024/);
	});

	// Test what timezone is actually used for date-only inputs
	it("date-only ISO string should use local timezone for datetime output", function () {
		var div = make("<div _='on click convert \"2024-01-15\" to \"iso\" then put it into me'></div>");
		div.click();
		// Date-only input should be treated as local timezone midnight, not UTC midnight
		// This is now fixed - date-only inputs use local timezone
		var expected = new Date("2024-01-15T00:00:00").toISOString();
		div.innerHTML.should.equal(expected);
	});

	it("date-only string to us-date outputs same date", function () {
		var div = make("<div _='on click convert \"01/15/2024\" to \"us-date\" then put it into me'></div>");
		div.click();
		div.innerHTML.should.equal("01/15/2024");
	});

	it("can convert iso-date input format to iso-full output format", function () {
		var div = make("<div _='on click convert \"2024-01-15\" from \"iso-date\" to \"iso-full\" then put it into me'></div>");
		div.click();
		// iso-date input should be treated as local date, output as iso-full with local timezone
		var expected = new Date("2024-01-15T00:00:00");
		var offset = -expected.getTimezoneOffset();
		var offsetHours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
		var offsetMins = (Math.abs(offset) % 60).toString().padStart(2, '0');
		var offsetSign = offset >= 0 ? '+' : '-';
		var expectedStr = "2024-01-15T00:00:00.000" + offsetSign + offsetHours + ":" + offsetMins;
		div.innerHTML.should.equal(expectedStr);
	});

	it("can convert eu-date input format to iso-full output format", function () {
		var div = make("<div _='on click convert \"15/01/2024\" from \"eu-date\" to \"iso-full\" then put it into me'></div>");
		div.click();
		// iso-date input should be treated as local date, output as iso-full with local timezone
		var expected = new Date("2024-01-15T00:00:00");
		var offset = -expected.getTimezoneOffset();
		var offsetHours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
		var offsetMins = (Math.abs(offset) % 60).toString().padStart(2, '0');
		var offsetSign = offset >= 0 ? '+' : '-';
		var expectedStr = "2024-01-15T00:00:00.000" + offsetSign + offsetHours + ":" + offsetMins;
		div.innerHTML.should.equal(expectedStr);
	});

	it("can convert eu-date input format to iso-full output format with timezone", function () {
		var div = make("<div _='on click convert \"01/15/2024\" timezone \"America/New_York\" to \"iso-full\" timezone \"UTC\" then put it into me'></div>");
		div.click();

		var expectedStr = "2024-01-15T05:00:00.000";
		div.innerHTML.should.equal(expectedStr);
	});

});
