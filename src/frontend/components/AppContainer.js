import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import LocationScreen from "./LocationScreen";
import CameraView from "./CameraView";

const TabNavigator = createBottomTabNavigator({
  Home: LocationScreen,
  Settings: CameraView
});

export default createAppContainer(TabNavigator);
