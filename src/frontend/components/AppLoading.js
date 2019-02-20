// @flow
import React from "react";
import nodejs from "nodejs-mobile-react-native";

type Props = {
	onError: (error: Error) => void,
	onFinish: () => void
};

export default class AppLoading extends React.Component<Props> {
	static defaultProps = {
		onError: () => {},
		onFinish: () => {}
	};

	constructor(props: Props) {
		super(props);
		// Start up the node process
		nodejs.start("loader.js");
	}

	componentDidMount() {
		// Just in case, remove previous listener. Sometimes react-native can call
		// componentDidMount() multiple times without calling componentWillUnmount()
		nodejs.channel.removeListener("status", this.handleStatusChange);
		nodejs.channel.addListener("status", this.handleStatusChange);
	}

	componentWillUnmount() {
		nodejs.channel.removeListener("status", this.handleStatusChange);
	}

	handleStatusChange = (serverStatus: string) => {
		switch (serverStatus) {
			case "LISTENING":
				this.props.onFinish();
				break;
			case "ERROR":
				this.props.onError(new Error("Uncaught exception in Mapeo Core"));
				break;
		}
	};

	render() {
		return null;
	}
}
