import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import ReactSVG from 'react-svg'

import { Link } from 'react-router-dom';
import history from "../history";

import ElixirAuthService from '../ElixirAuthService';
import jwt_decode from 'jwt-decode';

import { AuthConsumer, AuthContext } from '../auth-context';
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    headerBar: {
        elevation: 0,
    },
    menuButton: {
        color: 'inherit',
        background: 'inherit',
        textShadow: 'inherit',
        marginRight: theme.spacing(2),
    },
    button: {
        textTransform: 'none',
        color: 'inherit',
        background: 'inherit',
        textShadow: 'inherit',
        '&:hover': {
            color: '#FFF',
        },
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    title: {
        textTransform: 'none',
    },
    logo: {
        marginRight: 12,
        marginBottom: 4,
        alt: 'GWAS Logo',
    },
    logoButton: {
        color: 'inherit',
        marginLeft: theme.spacing(4),
        paddingRight: theme.spacing(0),
    },
    navLinkButton: {
        color: 'inherit',
        marginRight: theme.spacing(2),
        '&:hover': {
            color: '#FFF',
        },
    },
    downloadButton: {
        color: 'inherit',
        background: 'inherit',
        textShadow: 'inherit',
        marginRight: theme.spacing(2),
        '&:hover': {
            color: '#FFF',
        },
    },
    docButton: {
        color: 'inherit',
        background: 'inherit',
        textShadow: 'inherit',
        marginRight: theme.spacing(2),
        '&:hover': {
            color: '#FFF',
        },
    },
    loginButton: {
        color: 'inherit',
        marginRight: theme.spacing(2),
        '&:hover': {
            color: '#FFF',
        },
    },
}));


function MenuAppBar() {
    const classes = useStyles();

    const user = useContext(AuthContext)

    // Set auth status for Testing
    // const [auth, setAuth] = React.useState(false);
    // console.log("** Login Toggle State: ", auth);

    const eas = new ElixirAuthService();

    let userName = ''
    if (eas.loggedIn()) {
        userName = jwt_decode(eas.getToken()).name;
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    // Change auth toggle for Testing
    // function handleChange(event) {
    //     setAuth(event.target.checked);
    // }

    function handleMenu(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    function showMySubmissions() {
        let token = localStorage.getItem('id_token');
        let gdprAccepted = JSON.parse(localStorage.getItem('gdpr-accepted'));

        // Check if logged in and if token is still valid and if GDPR accepted
        if (token && !eas.isTokenExpired(token) && gdprAccepted) {
            history.push(`${process.env.PUBLIC_URL}/submissions`);
        }
        // Check GDPR accepted state - if true, login, else, present GDPR page
        else {
            if (!JSON.parse(gdprAccepted)) {
                history.push(`${process.env.PUBLIC_URL}/gdpr`, ({ from: `/submissions` }));
            }
            else {
                history.push(`${process.env.PUBLIC_URL}/login`, ({ from: `/submissions` }));
            }
        }
    }

    function handleLogout() {
        handleMenuClose();

        // Clear token
        eas.logout();

        // Use Context to reset auth status
        user.onLogout();

        // Refresh Home page on Logout
        history.push(`${process.env.PUBLIC_URL}`);

        // Reset "auth" so Login is displayed for Testing
        // setAuth(false);
    }

    return (
        <div className={classes.root}>
            <FormGroup>
                {/* <FormControlLabel
                    control={<Switch checked={auth} onChange={handleChange} aria-label="LoginSwitch" />}
                    label={auth ? 'Logout' : 'Login'}
                /> */}
            </FormGroup>
            <AppBar position="static" elevation={0}>
                <Alert severity="warning">We've recently updated our authentication system. If you encounter any issues please reach out to us on gwas-subs@ebi.ac.uk</Alert>
                <Toolbar>
                    <Button target="_blank" href="https://www.ebi.ac.uk/gwas" className={classes.logoButton}>
                        <ReactSVG src={process.env.PUBLIC_URL + '/images/GWAS_Catalog_banner_logo_34x40.svg'} className={classes.logo} />
                    </Button>
                    <Button component={Link} to={`${process.env.PUBLIC_URL}`} className={classes.navLinkButton}>
                        <Typography variant="h6" className={classes.title}>
                            GWAS Catalog Submission
                    </Typography>
                    </Button>

                    {/* <AuthConsumer>
                        {({ isAuthenticated }) => <h4> Login State: {isAuthenticated.toString()}</h4>}
                    </AuthConsumer> */}

                    <div className={classes.grow} />
                    <Button target="_blank" href="https://www.ebi.ac.uk/gwas/docs/submission" className={classes.docButton}>Documentation</Button>

                    {/* <Button onClick={downloadTemplate} className={classes.downloadButton} style={{ float: 'right' }}>Download Template</Button> */}

                    <Button onClick={showMySubmissions} className={classes.navLinkButton}>My Submissions</Button>

                    <AuthConsumer>
                        {value => value.isAuthenticated && (<div>
                            {/* Authentication is TRUE */}
                            <div>
                                <Button
                                    onClick={handleMenu}
                                    color="inherit"
                                    className={classes.button}
                                >
                                    {<span>{userName}</span>}
                                    <AccountCircle className={classes.rightIcon} />
                                </Button>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={handleMenuClose}
                                >
                                    {/* <MenuItem onClick={showMySubmissions}>My Submissions</MenuItem> */}
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </div>
                        </div>)}
                    </AuthConsumer>

                    <AuthConsumer>
                        {value => !value.isAuthenticated && (<div>
                            {/* Authentication is FALSE */}

                            <Button component={Link} to={{
                                pathname: `${process.env.PUBLIC_URL}/gdpr`,
                                state: { from: `/` }
                            }}
                                className={classes.loginButton}
                                style={{ float: 'right', background: 'inherit' }}>
                                Login
                            </Button>

                        </div>)}
                    </AuthConsumer>

                </Toolbar>
            </AppBar>
            <div style={{ backgroundColor: '#FFDFC2', height: '4px' }}></div>
            <div style={{ backgroundColor: '#398A96', height: '8px' }}></div>
            <div style={{ backgroundColor: '#B0DFE6', height: '8px' }}></div>
        </div>
    );
}


export default () => (
    <AuthConsumer>
        {(context) => (
            <MenuAppBar
                onLogout={context.onLogout}
                isAuthenticated={context.isAuthenticated}
            />
        )}
    </AuthConsumer>
)
