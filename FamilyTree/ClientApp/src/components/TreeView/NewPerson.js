import React, { Component } from 'react';
import { AddPerson } from './AddPerson';

export class NewPerson extends Component {
    static displayName = NewPerson.name;

    render () {
        var className = "newPerson"
        if (this.props.additionalClassName !== "") {
            className += ` ${this.props.additionalClassName}`
        }

        return (
            <AddPerson
                id={this.props.id}
                visibility={true}
                realClassName={className}
                realImageClassName={""}
                addPersonCallback={(name, surname, middlename, date, gender) => this.props.addPersonCallback(name, surname, middlename, date, gender)}/>
        );
    }
}
