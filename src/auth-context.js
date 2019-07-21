import React, { createContext } from 'react';
import ElixirAuthService from './ElixirAuthService';

export const AuthContext = createContext({
    isAuthenticated: false,
    JWTToken: null,
    onAuthenticate: () => { },
});

export class AuthProvider extends React.Component {
    constructor() {
        super();
        this.elixirAuthService = new ElixirAuthService();
    }

    state = {
        isAuthenticated: false,
        JWTToken: null,
        onAuthenticate: this.onAuthenticate,
    }

    componentDidMount() {
        const savedToken = this.elixirAuthService.getToken();

        if (savedToken) {
            this.setState({
                isAuthenticated: true,
                JWTToken: savedToken
            });
        }
    }

    onAuthenticate = (token) => {
        this.setState({
            isAuthenticated: true,
            JWTToken: token
        })
    }

    onLogout = () => {
        this.setState({
            isAuthenticated: false,
            JWTToken: null
        })
    }

    getProvidedState() {
        return {
            isAuthenticated: this.state.isAuthenticated,
            JWTToken: this.state.JWTToken,
            onAuthenticate: this.onAuthenticate,
            onLogout: this.onLogout
        };
    }


    render() {
        return (
            <AuthContext.Provider value={this.getProvidedState()} >
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export const AuthConsumer = AuthContext.Consumer;
