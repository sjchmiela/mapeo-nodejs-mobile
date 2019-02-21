// @flow
import * as React from "react";
import nodejs from "nodejs-mobile-react-native";
import SplashScreen from "react-native-splash-screen";
import debug from "debug";
import {
  AppState,
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from "react-native";
import * as status from "../../constants/server";

const log = debug("mapeo:AppLoading");

// Time before we think something is up with the server
const DEFAULT_TIMEOUT = 10000; // 10 seconds

type Props = {
  children: React.Node,
  timeout: number
};

type State = {
  serverStatus: string,
  didTimeout: boolean
};

type AppStateType = "active" | "background" | "inactive";

export default class AppLoading extends React.Component<Props, State> {
  static defaultProps = {
    timeout: DEFAULT_TIMEOUT
  };

  state = {
    serverStatus: status.STARTING,
    didTimeout: false
  };

  timeoutId: TimeoutID;

  constructor(props: Props) {
    super(props);
    // Start up the node process
    nodejs.start("loader.js");
    this.restartTimeout();
    log("Constructor");
  }

  componentDidMount() {
    log("Didmount");
    nodejs.channel.addListener("status", this.handleStatusChange);
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    nodejs.channel.removeListener("status", this.handleStatusChange);
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleStatusChange = (serverStatus: string) => {
    log("status change", serverStatus);
    // If we get a heartbeat, restart the timeout timer
    if (serverStatus === status.LISTENING) this.restartTimeout();
    // No unnecessary re-renders
    if (serverStatus === this.state.serverStatus) return;
    this.setState({ serverStatus });
  };

  handleAppStateChange = (nextAppState: AppStateType) => {
    log("AppState change", nextAppState);
    // Clear timeout while app is in the background
    if (nextAppState === "active") {
      this.restartTimeout();
      this.setState({ serverStatus: status.STARTING });
    } else clearTimeout(this.timeoutId);
  };

  restartTimeout() {
    clearTimeout(this.timeoutId);
    if (this.state.didTimeout) this.setState({ didTimeout: false });
    this.timeoutId = setTimeout(() => {
      this.setState({ didTimeout: true });
    }, this.props.timeout);
  }

  render() {
    if (this.state.didTimeout) return <ServerTimeout />;
    switch (this.state.serverStatus) {
      case status.LISTENING:
        SplashScreen.hide();
        return this.props.children;
      case status.ERROR:
        return <ServerError />;
      default:
        return <Waiting />;
    }
  }
}

const Waiting = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const ServerError = () => (
  <View style={styles.container}>
    <Text style={styles.notice}>
      Oh dear, something is broken in the Mapeo database. You can try
      force-restarting the app, but there may be something that needs fixing.
      Really sorry about this, making apps is hard.
    </Text>
  </View>
);

const ServerTimeout = () => (
  <View style={styles.container}>
    <Text style={styles.notice}>Something is up with the Mapeo database</Text>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text style={styles.description}>
      If you continue to see this message you may need to force-restart Mapeo
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20
  },
  notice: {
    fontSize: 20,
    textAlign: "center",
    margin: 20
  },
  description: {
    textAlign: "center",
    color: "#333333",
    margin: 20
  }
});
