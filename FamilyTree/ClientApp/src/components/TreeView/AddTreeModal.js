import React, { Component } from 'react';
import { ModalComponent } from '../Shared/Modal'

export class AddTreeModal extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: ""
        };
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});       
    }

    addTreeHandle() {
        this.props.addTreeCallback(
            this.state.name
        );
    }

    render() {

        return (
            <ModalComponent
                isOpen={this.props.isOpen}
                backdrop="static"
                centered
                toggle={() => this.props.handleClose()}
                headerText="Add Tree"
                handleClose={() => this.props.handleClose()}
                handleSave={() => this.addTreeHandle()}
            >
                <div className="data-holders__item data-holder">
                    <div className="data-holder__title">
                        <div>Имя</div>
                    </div>
                    <div className="data-holder__data">
                        <input id="create-person-name" type="text" onChange={(e) => this.handleNameChange(e)} value={this.state.name}/>
                    </div>
                </div>
            </ModalComponent>
        )
    }
}