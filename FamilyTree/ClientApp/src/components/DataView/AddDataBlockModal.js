import React, { Component } from 'react';
import { ModalComponent } from '../Shared/Modal'

export class AddDataBlockModal extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: ""
        };
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});       
    }

    addDataBlockHandle() {
        this.props.addDataBlockCallback(
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
                headerText="Добавление блока"
                handleClose={() => this.props.handleClose()}
                handleSave={() => this.addDataBlockHandle()}
            >
                <div class="form-horizontal">
                    <div class="form-group">
                        <label for="add-data-block-title" class="col-sm-2 control-label">Заголовок</label>
                        <div class="col-sm-10">
                            <input id="add-data-block-title" class="form-control" type="text" onChange={(e) => this.handleNameChange(e)} value={this.state.name}/>
                        </div>
                    </div>
                </div>
            </ModalComponent>
        )
    }
}