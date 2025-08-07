describe("the cookies identifier", function () {
	beforeEach(function () {
		evalHyperScript("cookies.clearAll()");
	});
	afterEach(function () {
		evalHyperScript("cookies.clearAll()");
	});


	it("basic set cookie values work", function () {
		var result = evalHyperScript("cookies.foo");
		should.equal(result, undefined);
		evalHyperScript("set cookies.foo to 'bar'");
		result = evalHyperScript("cookies.foo");
		result.should.equal('bar');
	});

	it("update cookie values work", function () {
		evalHyperScript("set cookies.foo to 'bar'");
		var result = evalHyperScript("cookies.foo");
		result.should.equal('bar');
		evalHyperScript("set cookies.foo to 'doh'");
		var result = evalHyperScript("cookies.foo");
		result.should.equal('doh');
	});

	it("basic clear cookie values work", function () {
		evalHyperScript("set cookies.foo to 'bar'");
		evalHyperScript("cookies.clear('foo')");
		var result = evalHyperScript("cookies.foo");
		should.equal(result, undefined);
	});

	it("iterate cookies values work", function () {
		evalHyperScript("set cookies.foo to 'bar'");
		let context = {me:[], you:[]}; // horrifying, but use arrays for me and you to capture values...
		evalHyperScript("for x in cookies me.push(x.name) then you.push(x.value) end", context);
		context.me.includes('foo').should.equal(true);
		context.you.includes('bar').should.equal(true);
	});

	it("can set cookie with expires option", function () {
		evalHyperScript("set cookies.testExpires to {value: 'test', expires: 'Thu, 01 Jan 2025 00:00:00 GMT'}");
		var result = evalHyperScript("cookies.testExpires");
		if (result) result.should.equal('test');
	});

	it("can set cookie with maxAge option", function () {
		evalHyperScript("set cookies.testMaxAge to {value: 'test', maxAge: 3600}");
		var result = evalHyperScript("cookies.testMaxAge");
		if (result) result.should.equal('test');
	});

	it("can set cookie with partitioned option", function () {
		evalHyperScript("set cookies.testPartitioned to {value: 'test', partitioned: true}");
		var result = evalHyperScript("cookies.testPartitioned");
		if (result) result.should.equal('test');
	});

	it("can set cookie with path option", function () {
		evalHyperScript("set cookies.testPath to {value: 'test', path: '/'}");
		var result = evalHyperScript("cookies.testPath");
		if (result) result.should.equal('test');
	});

	it("can set cookie with samesite option", function () {
		evalHyperScript("set cookies.testSamesite to {value: 'test', samesite: 'strict'}");
		var result = evalHyperScript("cookies.testSamesite");
		if (result) result.should.equal('test');
	});

	it("can set cookie with secure option", function () {
		evalHyperScript("set cookies.testSecure to {value: 'test', secure: true}");
		var result = evalHyperScript("cookies.testSecure");
		if (result) result.should.equal('test');
	});

});
