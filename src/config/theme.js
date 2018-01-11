// MaterialUI
import { createMuiTheme } from 'material-ui/styles';
// Colors
import teal from 'material-ui/colors/teal';

const theme = createMuiTheme({
    palette: {
        primary: teal,
        type: 'dark', // Switching the dark mode on is a single property value change.
    },
    // overrides: {
    //     MuiButton: {
    //         // Name of the styleSheet
    //         root: {
    //             // Name of the rule
    //             background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    //             borderRadius: 3,
    //             border: 0,
    //             color: 'white',
    //             height: 48,
    //             padding: '0 30px',
    //             boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
    //         },
    //     },
    // },
});

export default theme