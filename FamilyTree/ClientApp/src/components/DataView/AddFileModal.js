import React, { Component } from 'react';
import { ModalComponent } from '../Shared/Modal'

export class AddFileModal extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            description: "",
            file: null,
            selectedType: 0
        };
    }

    dataTypes = {
        Text: 0,
        TextArea: 1,
        Date: 2,
        Time: 3,
        DateTime: 4,
    };

    mediaTypes = {
        Data: 1,
        Image: 2,
        Video: 3,
        Audio: 4,
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});       
    }

    handleDescriptionChange(e) {
        this.setState({description: e.target.value});       
    }

    addFileHandle() {
        if (this.state.file) {
            this.props.addFileCallback(
                this.state.name, 
                this.state.description, 
                this.state.file
            );
        }
        else{
            alert("Не выбран файл")
        }
    }

    addFieldHandle() {
        this.props.addFieldCallback(
            this.state.name,
            this.state.selectedType
        )
    }

    handleFile(e) {
        var files = e.target.files;
        var file = files[0];

        if (file?.size > 2147483647) {
            alert("Размер файла превышает лимит в 2 ГБ");
            return
        }

        this.setState({
            file: file
        })
    }

    handleDataSelectChange(e) {
        this.setState({
            selectedType: Number(e.target.value)
        })
    }

    renderDataModal() {
        return (
            <ModalComponent
                isOpen={this.props.isOpen}
                backdrop="static"
                centered
                toggle={() => this.props.handleClose()}
                headerText="Добавление поля для данных"
                handleClose={() => this.props.handleClose()}
                handleSave={() => this.addFieldHandle()}
            >
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="add-data-holder-title" className="col-sm-2 control-label">Заголовок</label>
                        <div className="col-sm-10">
                            <input id="add-data-holder-title" className="form-control" type="text" value={this.state.name} onChange={(e) => this.handleNameChange(e)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="add-data-holder-type" className="col-sm-2 control-label">Тип</label>
                        <div className="col-sm-10">
                            <select id="add-data-holder-type" className="form-control" onChange={(e) => this.handleDataSelectChange(e)}>
                                <option value={this.dataTypes.Text} selected={this.state.selectedType === this.dataTypes.Text}>Текст</option>
                                <option value={this.dataTypes.TextArea} selected={this.state.selectedType === this.dataTypes.TextArea}>Большой текст</option>
                                <option value={this.dataTypes.Date} selected={this.state.selectedType === this.dataTypes.Date}>Дата</option>
                                <option value={this.dataTypes.Time} selected={this.state.selectedType === this.dataTypes.Time}>Время</option>
                                <option value={this.dataTypes.DateTime} selected={this.state.selectedType === this.dataTypes.DateTime}>Дата и время</option>
                            </select>
                        </div>                        
                    </div>
                </div>
            </ModalComponent>
        )
    }

    render() {

        if (this.props.mediaType === this.mediaTypes.Data) {
            return (
                <>
                    {this.renderDataModal()}
                </>
            )
        }

        var inputFormGroup = null
        var headerText = "Добавление "
        switch (this.props.mediaType) {
            case this.mediaTypes.Image:
                headerText += "изображения"
                inputFormGroup = (
                    <div className="form-group">
                        <label htmlFor="image-file" className="col-sm-2 control-label">Файл</label>
                        <div className="col-sm-10">
                            <input id="image-file" type="file" accept="image/*" onChange={(e) => this.handleFile(e)}/>
                        </div>
                    </div>
                )
                break;            
            case this.mediaTypes.Video:
                headerText += "видео"
                inputFormGroup = (
                    <div className="form-group">
                        <label htmlFor="video-file" className="col-sm-2 control-label">Файл</label>
                        <div className="col-sm-10">
                            <input id="video-file" type="file" accept="video/*" onChange={(e) => this.handleFile(e)}/>
                        </div>
                    </div>
                )
                break;            
            case this.mediaTypes.Audio:
                headerText += "аудио"
                inputFormGroup = (
                    <div className="form-group">
                        <label htmlFor="audio-file" className="col-sm-2 control-label">Файл</label>
                        <div className="col-sm-10">
                            <input id="audio-file" type="file" accept="audio/*" onChange={(e) => this.handleFile(e)}/>
                        </div>
                    </div>
                )
                break;
            default:
                break;
        }

        return (
            <ModalComponent
                isOpen={this.props.isOpen}
                backdrop="static"
                centered
                toggle={() => this.props.handleClose()}
                headerText={headerText}
                handleClose={() => this.props.handleClose()}
                handleSave={() => this.addFileHandle()}
            >
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="image-title" className="col-sm-2 control-label">Заголовок</label>
                        <div className="col-sm-10">
                            <input id="image-title" className="form-control" type="text" value={this.state.name} onChange={(e) => this.handleNameChange(e)}/>
                        </div>
                    </div>
                    {inputFormGroup}
                    <div className="form-group">
                        <label htmlFor="image-desc" className="col-sm-2 control-label">Описание</label>
                        <div className="col-sm-10">
                            <input id="image-desc" className="form-control" type="text" value={this.state.description} onChange={(e) => this.handleDescriptionChange(e)}/>
                        </div>
                    </div>
                </div>
            </ModalComponent>
        )
    }
}