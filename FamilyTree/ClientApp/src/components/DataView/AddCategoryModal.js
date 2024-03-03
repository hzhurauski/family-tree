import React, { Component } from 'react';
import { ModalComponent } from '../Shared/Modal'

export class AddCategoryModal extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            type: 0
        };
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});       
    }

    addCategoryHandle() {
        this.props.addCategoryCallback(
            this.state.name,
            this.state.type
        );
    }

    handleDataSelectChange(e) {
        this.setState({
            type: Number(e.target.value)
        })
    }

    dataCategoryType = {
        InfoBlock: 0,
        ListBlock: 1,
    }

    render() {
        return (
            <ModalComponent
                isOpen={this.props.isOpen}
                backdrop="static"
                centered
                toggle={() => this.props.handleClose()}
                headerText="Добавление категории"
                handleClose={() => this.props.handleClose()}
                handleSave={() => this.addCategoryHandle()}
            >
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="add-data-category-name" className="col-sm-2 control-label">Имя</label>
                        <div className="col-sm-10">
                            <input 
                                id="add-data-category-name" className="form-control" 
                                type="text" value={this.state.name} onChange={(e) => this.handleNameChange(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="add-data-category-type" className="col-sm-2 control-label">Тип</label>
                        <div className="col-sm-10">
                            <select id="add-data-category-type" className="form-control" onChange={(e) => this.handleDataSelectChange(e)}>
                                <option value={this.dataCategoryType.InfoBlock} selected={this.state.type === this.dataCategoryType.InfoBlock}>Блок</option>
                                <option value={this.dataCategoryType.ListBlock} selected={this.state.type === this.dataCategoryType.ListBlock}>Список</option>
                            </select>
                        </div>
                    </div>
                </div>
            </ModalComponent>
        )
    }
}