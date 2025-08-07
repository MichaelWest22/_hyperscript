describe("the socket feature", function () {
	it("can handle different url schemes", function () {
		try {
			_hyperscript("socket MySocket ws:/ws/test/ on message as json log message end");
		} catch (e) {
			if (e instanceof DOMException) {
				assert.fail("Scheme ws: Should not have thrown");
			}
		}
		assert.property(window, "MySocket");
		delete window.MySocket;

		try {
			_hyperscript("socket MySocket wss:/ws/test/ on message as json log message end");
		} catch (e) {
			if (e instanceof DOMException) {
				assert.fail("Scheme wss: Should not have thrown");
			}
		}
		assert.property(window, "MySocket");
		delete window.MySocket;

		try {
			_hyperscript("socket MySocket /ws/test/ on message as json log message end");
		} catch (e) {
			if (e instanceof DOMException) {
				assert.fail("No scheme: Should not have thrown");
			}
		}
		assert.property(window, "MySocket");
		var url = window.MySocket["raw"].url;
		// Should have a proper WebSocket URL with scheme
		assert.isTrue(url.startsWith("ws://") || url.startsWith("wss://"));
		// Should include the path
		assert.include(url, "/ws/test/");
		delete window.MySocket;

		try {
			_hyperscript("socket MySocket abc:/ws/test/ on message as json log message end");
		} catch (e) {
			if (!(e instanceof DOMException)) {
				assert.fail("Scheme abc: Should have thrown");
			}
		}
		assert.notProperty(window, "MySocket");
	});

	it("creates socket object with correct structure", function () {
		_hyperscript("socket TestSocket ws://test/");
		assert.property(window, "TestSocket");
		assert.property(window.TestSocket, "raw");
		assert.property(window.TestSocket, "rpc");
		assert.property(window.TestSocket, "dispatchEvent");
		assert.instanceOf(window.TestSocket.raw, WebSocket);
		delete window.TestSocket;
	});

	it("supports custom timeout configuration", function () {
		_hyperscript("socket TimeoutSocket ws://test/ with timeout 5000");
		assert.property(window, "TimeoutSocket");
		delete window.TimeoutSocket;
	});

	it("supports nested namespace assignment", function () {
		_hyperscript("socket app.sockets.MySocket ws://test/");
		assert.property(window, "app");
		assert.property(window.app, "sockets");
		assert.property(window.app.sockets, "MySocket");
		delete window.app;
	});

	it("handles RPC proxy blacklisted properties", function () {
		_hyperscript("socket RPCSocket ws://test/");
		assert.isNull(window.RPCSocket.rpc.then);
		assert.isNull(window.RPCSocket.rpc.catch);
		assert.isNull(window.RPCSocket.rpc.length);
		assert.isNull(window.RPCSocket.rpc.asyncWrapper);
		assert.isNull(window.RPCSocket.rpc.toJSON);
		delete window.RPCSocket;
	});

	it("provides noTimeout and timeout methods on RPC proxy", function () {
		_hyperscript("socket ProxySocket ws://test/");
		assert.isObject(window.ProxySocket.rpc.noTimeout);
		assert.isFunction(window.ProxySocket.rpc.timeout);
		assert.isObject(window.ProxySocket.rpc.timeout(1000));
		delete window.ProxySocket;
	});

	it("creates RPC functions that return promises", function () {
		_hyperscript("socket FuncSocket ws://test/");
		var mockSend = sinon.stub(window.FuncSocket.raw, 'send');
		var result = window.FuncSocket.rpc.testMethod("arg1", "arg2");
		assert.instanceOf(result, Promise);
		mockSend.restore();
		delete window.FuncSocket;
	});

	it("handles dispatchEvent with event details", function () {
		_hyperscript("socket EventSocket ws://test/");
		var mockSend = sinon.stub(window.EventSocket.raw, 'send');
		
		var event = new CustomEvent('testEvent', {
			detail: { data: 'test', sender: 'should be removed', _namedArgList_: 'should be removed' }
		});
		
		window.EventSocket.dispatchEvent(event);
		
		assert.isTrue(mockSend.calledOnce);
		var sentData = JSON.parse(mockSend.firstCall.args[0]);
		assert.equal(sentData.type, 'testEvent');
		assert.equal(sentData.data, 'test');
		assert.isUndefined(sentData.sender);
		assert.isUndefined(sentData._namedArgList_);
		
		mockSend.restore();
		delete window.EventSocket;
	});

	it("handles message handler for non-JSON messages", function () {
		var messageReceived = false;
		window.testMessageHandler = function(msg) { messageReceived = msg; };
		
		_hyperscript("socket MsgSocket ws://test/ on message call testMessageHandler(message) end");
		
		// Simulate receiving a message
		var mockEvent = { data: "test message" };
		window.MsgSocket.raw.onmessage(mockEvent);
		
		assert.equal(messageReceived, "test message");
		
		delete window.testMessageHandler;
		delete window.MsgSocket;
	});

	it("handles message handler for JSON messages", function () {
		var messageReceived = false;
		window.testJSONHandler = function(msg) { messageReceived = msg; };
		
		_hyperscript("socket JSONSocket ws://test/ on message as json call testJSONHandler(message) end");
		
		// Simulate receiving a JSON message
		var mockEvent = { data: '{"test": "data"}' };
		window.JSONSocket.raw.onmessage(mockEvent);
		
		assert.deepEqual(messageReceived, {test: "data"});
		
		delete window.testJSONHandler;
		delete window.JSONSocket;
	});

	it("throws error for non-JSON message when expecting JSON", function () {
		_hyperscript("socket ErrorSocket ws://test/ on message as json log message end");
		
		assert.throws(function() {
			var mockEvent = { data: "not json" };
			window.ErrorSocket.raw.onmessage(mockEvent);
		}, "Received non-JSON message from socket: not json");
		
		delete window.ErrorSocket;
	});

	it("handles RPC responses with return values", function (done) {
		_hyperscript("socket RPCReturnSocket ws://test/");
		var mockSend = sinon.stub(window.RPCReturnSocket.raw, 'send');
		
		var promise = window.RPCReturnSocket.rpc.testMethod();
		
		promise.then(function(res) {
			assert.equal(res, "success");
			mockSend.restore();
			delete window.RPCReturnSocket;
			done();
		});
		
		// Get the UUID from the sent data
		var sentData = JSON.parse(mockSend.firstCall.args[0]);
		var uuid = sentData.iid;
		
		// Simulate RPC response
		var mockResponse = { data: JSON.stringify({ iid: uuid, return: "success" }) };
		window.RPCReturnSocket.raw.onmessage(mockResponse);
	});

	it("handles RPC responses with errors", function (done) {
		_hyperscript("socket RPCErrorSocket ws://test/");
		var mockSend = sinon.stub(window.RPCErrorSocket.raw, 'send');
		
		var promise = window.RPCErrorSocket.rpc.testMethod();
		
		promise.catch(function(err) {
			assert.equal(err, "RPC Error");
			mockSend.restore();
			delete window.RPCErrorSocket;
			done();
		});
		
		// Get the UUID from the sent data
		var sentData = JSON.parse(mockSend.firstCall.args[0]);
		var uuid = sentData.iid;
		
		// Simulate RPC error response
		var mockResponse = { data: JSON.stringify({ iid: uuid, throw: "RPC Error" }) };
		window.RPCErrorSocket.raw.onmessage(mockResponse);
	});

	it("handles socket close event by clearing socket reference", function () {
		_hyperscript("socket CloseSocket ws://test/");
		var closeEvent = new Event('close');
		window.CloseSocket.raw.dispatchEvent(closeEvent);
		// Socket should be recreated on next RPC call
		delete window.CloseSocket;
	});

	it("handles non-RPC JSON messages", function () {
		var messageReceived = false;
		window.testNonRPCHandler = function(msg) { messageReceived = msg; };
		
		_hyperscript("socket NonRPCSocket ws://test/ on message as json call testNonRPCHandler(message) end");
		
		// Simulate non-RPC JSON message (no iid)
		var mockEvent = { data: '{"type": "notification", "data": "test"}' };
		window.NonRPCSocket.raw.onmessage(mockEvent);
		
		assert.deepEqual(messageReceived, {type: "notification", data: "test"});
		
		delete window.testNonRPCHandler;
		delete window.NonRPCSocket;
	});

	it("sends RPC data with correct structure", function () {
		_hyperscript("socket RPCDataSocket ws://test/");
		var mockSend = sinon.stub(window.RPCDataSocket.raw, 'send');
		
		window.RPCDataSocket.rpc.testFunction("arg1", 42, {key: "value"});
		
		assert.isTrue(mockSend.calledOnce);
		var sentData = JSON.parse(mockSend.firstCall.args[0]);
		assert.property(sentData, 'iid');
		assert.equal(sentData.function, 'testFunction');
		assert.deepEqual(sentData.args, ["arg1", 42, {key: "value"}]);
		
		mockSend.restore();
		delete window.RPCDataSocket;
	});
});
