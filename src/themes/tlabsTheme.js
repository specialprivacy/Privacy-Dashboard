import {cyan500, grey300, white, darkBlack, fullBlack} from "material-ui/styles/colors";
import {fade} from "material-ui/utils/colorManipulator";
import spacing from "material-ui/styles/spacing";

export default {
  background: "#E20074",
  spacing: spacing,
  fontFamily: "'Maven Pro', sans serif",
  apiKey: "d9fb8af0-dd06-4ea4-a010-75b2044c6a23",
  borderRadius: 2,
  palette: {
    primary1Color: "#E20074",
    accent1Color: "#333333",
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