import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#6fbf73',
            main: '#222222',
            dark: '#357a38',
            contrastText: '#9d9d9d',
        },
        secondary: {
            light: '#5464c0',
            main: '#E5F6F8',
            // main: "linear-gradient(to right, tomato, cyan)",
            dark: '#1d2b7b',
            contrastText: '#000',
        },
        tableRowHighlight: {
            main: '#F0F0F0',
        }
    },
    typography: {
        "fontFamily": "\"Helvetica Neue\", \"Helvetica\", \"Arial\", sans-serif",
        "fontSize": 14,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 400,
        "lineHeight": 1.42857143
    },
    props: {
        // Name of the component ⚛️
        MuiButtonBase: {
            // The properties to apply
            disableRipple: true, // No more ripple, on the whole application 💣!
        },
    },
});

export default theme;
