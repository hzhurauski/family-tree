import React, { Component } from 'react';
import { AddPersonModal } from './AddPersonModal'

export class AddPerson extends Component {
    static displayName = AddPerson.name;

    constructor(props) {
        super(props);
        this.state = { modalOpen: false };
    }

    openModal() {
        this.setState({
            modalOpen: true
        })
    }

    handleClose() {
        this.setState({
            modalOpen: false
        }) 
    }

    addPersonCallback(name, surname, middlename, date, gender) {
        this.handleClose()
        this.props.addPersonCallback(name, surname, middlename, date, gender)
    }

    render () {
        var style = {}
        if (this.props.visibility) {
            style = {"visibility": this.props.visibility}
        }

        var className = this.props.realClassName ? this.props.realClassName : this.props.isBigTree ? "AddPerson-LittleTree" : "AddPerson-Tree"
        var imageClassName = this.props.realImageClassName ? this.props.realImageClassName : this.props.isBigTree ? "imgAdd-LittleTree" : "imgAdd-Tree"

        return (
            <div>
                <div id={this.props.id} className={className} style={style} onClick={() => this.openModal()}>
                    <img src={require("../../images/addBlack.png")} className={imageClassName} id={this.props.realImageId ? this.props.realImageId : ''}/>
                </div>
                <AddPersonModal isOpen={this.state.modalOpen} 
                    handleClose={() => this.handleClose()} 
                    addPersonCallback={(name, surname, middlename, date, gender) => this.addPersonCallback(name, surname, middlename, date, gender)}/>
            </div>
        );
    }
}
