import React, {Component} from "react";

class Maintenance extends Component {
    render() {
        return (
            <div>
                <h1 style={{textAlign: "center"}}>We'll be back soon!</h1>
                <h4 style={{textAlign: "center"}}>We apologize for the inconvenience but we're performing some maintenance at the moment.
                We'll be back shortly, but you can always contact gwas-subs@ebi.ac.uk for help.</h4>
            </div>
        )
    }
}

export default () => (
        <Maintenance/>
)