import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Container, Row, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from '../api-authorization/LoginMenu';
import { getPageName } from '../../reducers/pageName.selectors'
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    render () {
        return (
            <div id="header">
                <Container>
                    <Row>
                        <div id="heap">
                            <div id="logo">
                                    <img src={require("../../images/MiddleLightBlueTree.png")} alt="Logo" />
                            </div>
                            <div id="menu" className="d-sm-inline-flex flex-sm-row-reverse">
                                <ul>
                                    <li>
                                        <NavLink tag={Link} to="/">
                                            <div>Генеалогическое древо</div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink tag={Link} to="/reference">
                                            <div>Справка</div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink tag={Link} to="/about">
                                            <div>О проекте</div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                            <LoginMenu />
                        </div>
                        <div id="headerText" className="container">{this.props.pageName}</div>
                    </Row>
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        pageName: getPageName(state),
    }
}

export default connect(mapStateToProps)(NavMenu)
