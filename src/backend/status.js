const rnBridge = require("rn-bridge");
const debug = require("debug")("mapeo-core:status");

class ServerStatus {
	constructor() {
		this.setState(ServerStatus.STARTING);
	}
	startHeartbeat() {
		this.intervalId = setInterval(() => {
			rnBridge.channel.post("status", serverState);
		}, 2000);
	}
	pauseHeartbeat() {
		clearInterval(this.intervalId);
	}
	setState(nextState) {
		if (nextState === this.state) return;
		debug("state changed", nextState);
		this.state = nextState;
		rnBridge.channel.post("status", nextState);
	}
}

ServerStatus.STARTING = "STARTING";
ServerStatus.LISTENING = "LISTENING";
ServerStatus.CLOSING = "CLOSING";
ServerStatus.CLOSED = "CLOSED";
ServerStatus.ERROR = "ERROR";

module.exports = ServerStatus;
