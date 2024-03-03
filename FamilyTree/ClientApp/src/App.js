import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from './components/Shared/Layout';
import TreeView from './components/TreeView/TreeView';
import DataViewComponent from './components/DataView/DataView';
import TreeComponent from './components/TreeView/TreeComponent';
import ReferenceComponent from './components/Reference';
import AboutComponent from './components/About';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render () {
        return (
            <Layout>
                <Switch>
                    <AuthorizeRoute exact path='/' component={TreeView} />
                    <AuthorizeRoute path='/tree/:id' component={TreeComponent} />
                    <AuthorizeRoute path='/data/:personId' component={DataViewComponent} />
                    <Route path='/about' component={AboutComponent} />
                    <Route path='/reference' component={ReferenceComponent} />
                    <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
                </Switch>
            </Layout>
        );
    }
}
