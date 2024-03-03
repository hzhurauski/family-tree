import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService'
import { ModalComponent } from '../Shared/Modal'

export class PersonRelationModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            relation: "",
            isOpenYN: false
        };
    }

    componentDidUpdate(){
        if (this.props.isOpen && !this.state.relation) {
            this.getRelation()
        }
    }

    showYN() {
        this.setState({
            isOpenYN: true
        })
    }

    handleCloseYN() {
        this.setState({
            isOpenYN: false
        })
    }

    handleDelete() {
        this.handleCloseYN()
        this.props.handleClose()
        this.props.handleDelete()
    }
    
    render () {
        var modalText = this.props.data.surname + " " + this.props.data.name + " " + this.props.data.middlename
        return (
            <>
            <ModalComponent
                    isOpen={this.props.isOpen}
                    toggle={() => this.props.handleClose()}
                    headerText="Информация о персоне"
                    handleClose={() => this.props.handleRedirect()}
                    handleSave={() => this.showYN()}
                    saveButtonName="Удалить человека"
                    closeButtonName="Подробнее..."
                    saveButtonId="delete-person-button"
                    closeButtonId="editPersonModal"
                >
                    <div id="textModal">
                        {modalText}
                        <br />
                        {this.state.relation}
                    </div>
                </ModalComponent>

                <ModalComponent
                    isOpen={this.state.isOpenYN}
                    toggle={() => this.handleCloseYN()}
                    headerText="Удаление человека"
                    handleClose={() => this.handleCloseYN()}
                    handleSave={() => this.handleDelete()}
                    saveButtonName="Удалить человека"
                    saveButtonId="delete-person-submit-button"
                    saveButtonClassName="btn-my-danger"
                    closeButtonClassName="btn-my-dark"
                >
                    <div>Вы уверенны, что хотите удалить данного человека?</div>
                    <div className="text-danger">Также будут удалены люди связанные с этим человеком.</div>
                </ModalComponent>
            </>
        )
    }

    async getRelation() {
        const token = await authService.getAccessToken();
        var treeId = sessionStorage.getItem("treeId")
        var link = `People/GetRelationsByPeopleIds?treeId=${treeId}&targetPersonId=${this.props.mainPerson}&personId=${this.props.data.id}`
        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'text' },
            method: 'GET'
        });
        var relation = await result.text()

        this.setState({
            relation: relation
        })
    }
}