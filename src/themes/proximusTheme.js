import {cyan500, grey300, white, darkBlack, fullBlack} from "material-ui/styles/colors";
import {fade} from "material-ui/utils/colorManipulator";
import spacing from "material-ui/styles/spacing";

export default {
  background: "linear-gradient(to top, rgb(92, 45, 145), rgb(0, 188, 238)",
  spacing: spacing,
  apiKey: "38895e56-554f-4ca0-ab1c-4716482d2882",
  fontFamily: "'Maven Pro', sans serif",
  borderRadius: 2,
  palette: {
    primary1Color: "#5C2D91",
    accent1Color: "#00BCEE",
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};