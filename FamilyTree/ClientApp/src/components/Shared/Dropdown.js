import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

export class DropdownComponent extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            openDropdown: false
        };
    }

    toggle() {
        this.setState({
            openDropdown: !this.state.openDropdown
        })
    }

    render() {
        return (
            <Dropdown isOpen={this.state.openDropdown} toggle={() => this.toggle()} className={this.props.dropdownClassName}>
                {this.props.caretButton}
                <DropdownToggle split className={this.props.toggleClassName} color="white"/>
                <DropdownMenu container="body">
                    {
                        React.Children.map(this.props.children, (child, index) => {
                            return (
                                <DropdownItem onClick={function noRefCheck(){}}>
                                    {child}
                                </DropdownItem>
                            ) 
                        })
                    }
                </DropdownMenu>
            </Dropdown>
        )
    }
}