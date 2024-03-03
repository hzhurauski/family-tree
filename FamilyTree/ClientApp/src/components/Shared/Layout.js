import React, { Component } from 'react';
import NavMenu from './NavMenu';
import Loader from './Loader'
import { Footer } from './Footer';

export class Layout extends Component {
    static displayName = Layout.name;

    render () {
        return (
            <div id="backgroundImageWrapper">
                <div id="wrapper">
                    <NavMenu />
                    <div id="content">
                        <Loader />
                        {this.props.children}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}
