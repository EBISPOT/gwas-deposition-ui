import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import BodyOfWorks from '../BodyOfWorks';
import Submissions from '../Submissions';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    const classes = useStyles();

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={2} className={classes.Box}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    Box: {
        padding: 4,
    },
    AppBar: {
        backgroundColor: '#f2f2f2',
    }
}));


const StyledTabs = withStyles((theme) => ({
    indicator: {
        display: "flex",
        justifyContent: 'center',
        backgroundColor: 'unset',
        "& > div": {
            maxWidth: 110,
            width: "100%",
            backgroundColor: "rgb(57, 138, 150)"
        }
    },
}))(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: "none",
        fontSize: theme.typography.pxToRem(15),
        fontWeight: 500,
        marginRight: theme.spacing(1),
        "&:hover": {
            color: "#000",
            opacity: 1,
            fontWeight: 500,
        },
        "&$selected": {
            color: "#1890ff",
            fontWeight: theme.typography.fontWeightMedium,
        },
        "&:focus": {
            fontWeight: 500,
        },
    }
}))(props => <Tab disableRipple {...props} />);

export default function FullWidthTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" elevation={2} className={classes.AppBar}>
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <StyledTab label="Incomplete Submissions" {...a11yProps(0)} />
                    <StyledTab label="Active Submissions" {...a11yProps(1)} />
                </StyledTabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <BodyOfWorks />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Submissions />
            </TabPanel>
        </div>
    );
}
