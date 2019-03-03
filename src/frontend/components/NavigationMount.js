import * as React from "react";
import { View } from "react-native";

const withNavigationMount = WrapperComponent =>
  class NavigationMount extends React.Component<Props, State> {
    state = {
      isFocussed: false
    };
    componentDidMount() {
      const { navigation } = this.props;
      navigation.addListener("willFocus", () =>
        this.setState({ isFocussed: true })
      );
      navigation.addListener("willBlur", () =>
        this.setState({ isFocussed: false })
      );
    }
    render() {
      if (this.state.isFocussed) return <WrapperComponent />;
      else return <View />;
    }
  };

export default withNavigationMount;
