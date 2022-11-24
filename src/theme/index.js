import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#26af4c',
    secondary: '#6C7F92',
    text: '#000000',
    white: '#FFFFFF'
  },
  listColors: [
    "#ffeee7",
    "#f5faff",
    "#ecffe3",
    "#ffeaf4",
    "#f7e7ff",
    "#ecf3ff",
  ]
};
export { theme }