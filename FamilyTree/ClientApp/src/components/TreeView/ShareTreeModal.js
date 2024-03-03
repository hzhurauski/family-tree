import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService'
import { ModalComponent } from '../Shared/Modal'

export class ShareTreeModal extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            username: "",
            userData: null
        };
    }

    componentDidMount() {
        this.getAllUsers()
    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value});       
    }

    shareTreeHandle() {
        this.props.shareTreeCallback(
            this.state.username
        );
    }

    async getAllUsers() {
        const token = await authService.getAccessToken();
        var link = `User/GetAll`

        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`},
            method: 'GET',
        });

        var data = await result.json()

        this.setState({
            userData: data
        })
    }

    render() {

        return (
            <ModalComponent
                isOpen={this.props.isOpen}
                backdrop="static"
                centered
                toggle={() => this.props.handleClose()}
                headerText="Share Tree"
                handleClose={() => this.props.handleClose()}
                handleSave={() => this.shareTreeHandle()}
                saveButtonClassName="Поделиться деревом"
            >
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="add-data-category-type" className="col-sm-2 control-label">Пользователь</label>
                        <div className="col-sm-10">
                            <select id="add-data-category-type" className="form-control" onChange={(e) => this.handleUsernameChange(e)}>
                                <option value=''></option>
                                {
                                    this.state.userData && 
                                    this.state.userData.map((user) => {
                                        return (
                                            <option value={user.username} selected={this.state.username === user.username}>{user.username}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="text-danger">Данный пользователь сможет просматривать ваше генеалогическое дерево, но доступ к данным будет ограничен.</div>
                </div>
            </ModalComponent>
        )
    }
}