import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


var style = {
    backgroundColor: "#E7F7F9",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
}

var phantom = {
    display: 'block',
    padding: '20px',
    height: '60px',
    width: '100%',
}

var linkStyle = {
    color: '#3C5398',
    paddingLeft: 4,
    paddingRight: 4,
}


function Footer({ children }) {
    const textDivider = "|";

    return (
        <div>
            <div style={phantom} />
            <div style={style}>
                {children}
                <Typography>
                    Copyright © EMBL-EBI 2019 {textDivider} EMBL-EBI is an Outstation of the
                    <Link target="_blank" href="https://www.embl.org/" style={linkStyle}>
                        European Molecular Biology Laboratory
                    </Link>
                    {textDivider}
                    <Link target="_blank" href="https://www.ebi.ac.uk/about/privacy" style={linkStyle}>
                        Privacy
                    </Link>
                    {textDivider}
                    <Link target="_blank" href="https://www.ebi.ac.uk/about/cookies" style={linkStyle}>
                        Cookies
                    </Link>
                    {textDivider}
                    <Link target="_blank" href="https://www.ebi.ac.uk/about/terms-of-use" style={linkStyle}>
                        Terms of use
                    </Link>
                </Typography>
            </div>
        </div>
    )
}

export default Footer
