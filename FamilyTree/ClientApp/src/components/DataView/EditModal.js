import React, { Component } from 'react';
import { ModalComponent } from '../Shared/Modal'

export class EditModal extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            nameSet: false
        };
    }

    componentDidUpdate() {
        if (!this.state.nameSet && this.props.data) {
            this.setState({
                name: this.props.data.name,
                nameSet: true
            })
        }
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});       
    }

    editHandle() {
        this.props.editCallback(
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
                headerText="Редактирование"
                handleClose={() => this.props.handleClose()}
                handleSave={() => this.editHandle()}
            >
                <div className="data-holders__item data-holder">
                    <div className="data-holder__title wide_holder">
                        <div>Название</div>
                    </div>
                    <div className="data-holder__data">
                        <input id="create-person-name" type="text" onChange={(e) => this.handleNameChange(e)} value={this.state.name}/>
                    </div>
                </div>
            </ModalComponent>
        )
    }
}