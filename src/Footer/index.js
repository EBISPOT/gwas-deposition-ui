import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

var style = {
    backgroundColor: "#D2D1D4",
    textAlign: "center",
    padding: "20px",
    height: "80px",
    width: "100%",
}

var linkStyle = {
    color: '#3C5398',
    paddingLeft: 4,
    paddingRight: 4,
}

var button = {
    backgroundColor: "#D2D1D4",
    border: 'none',
}

function getCurrentYear() {
    let date = new Date();
    let currentYear = date.getFullYear();
    return currentYear;
}

function Footer() {
    const textDivider = "|";

    return (
        <div style={style}>
            <Typography>
                Copyright © EMBL-EBI {getCurrentYear()} {textDivider} EMBL-EBI is an Outstation of the
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
                <Button style={button} target="_blank" href="https://www.ebi.ac.uk/">
                    <img src={process.env.PUBLIC_URL + '/images/EMBL_EBI_Logo_white.png'} alt="embl-ebi" />
                </Button>
                <Button style={button} target="_blank" href="https://www.genome.gov/">
                    <img src={process.env.PUBLIC_URL + '/images/NHGRI_NIH_logo.png'} alt="nih" />
                </Button>
            </Typography>
        </div>
    )
}

export default Footer
