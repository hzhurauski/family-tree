import React, { Component, Fragment } from 'react';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';

export class LoginMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userName: null
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this._subscription);
    }

    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        this.setState({
            isAuthenticated,
            userName: user && user.name
        });
    }

    render() {
        const isAuthenticated = this.state.isAuthenticated;
        if (!isAuthenticated) {
            //const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(loginPath);
        } else {
            //const profilePath = `${ApplicationPaths.Profile}`;
            const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
            return this.authenticatedView(logoutPath);
        }
    }

    authenticatedView(logoutPath) {
        return (<Fragment>
            <div className="navbar-nav">
                <div className="loginButton">
                    <NavLink tag={Link} to={logoutPath}>
                        <div className="loginButton-text">Выход</div>
                    </NavLink>
                </div>
            </div>
        </Fragment>);

    }

    anonymousView(loginPath) {
        return (<Fragment>
            <div className="navbar-nav">
                <div className="loginButton">
                    <NavLink tag={Link} to={loginPath}>
                        <div className="loginButton-text">Вход</div>
                    </NavLink>
                </div>
            </div>
        </Fragment>);
    }
}
