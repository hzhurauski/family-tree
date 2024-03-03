import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { PersonRelationModal } from './PersonRelationModal'
import { Redirect } from 'react-router-dom';

export class PersonData extends Component {
    static displayName = PersonData.name;

    constructor(props) {
        super(props);
        this.state = { 
            imageSrc: "",
            modalOpen: false,
            redirect: false
        };
    }

    componentDidMount() {
        this.getPersonImage()
    }

    openModal(e) {
        e.preventDefault();
        this.setState({
            modalOpen: true
        })
    }

    handleClose() {
        this.setState({
            modalOpen: false
        }) 
    }

    handleRedirect() {
        this.setState({
            redirect: true
        })
    }

    handleDelete() {
        this.props.handleDeletePerson(this.props.data.id)
    }

    componentDidUpdate() {
        //this.getPersonImage()
    }

    async getPersonImage(){
        var imageSrc = ""
        if (this.props.data.avatarImageId != null) {
            const link = "/Media/Image/GetFile/" + this.props.data.avatarImageId;

            const token = await authService.getAccessToken();
            try {
                const response = await fetch(link, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const imgBlob = await response.blob()
                imageSrc = URL.createObjectURL(imgBlob)
            }
            catch(e){
                imageSrc = require("../../images/person.png")
            }
        } else {
            imageSrc = require("../../images/person.png")
        }

        this.setState({
            imageSrc
        })
    }

    handleMainPersonChange() {
        this.props.handleUpdateMainPerson(this.props.data.id)
    }

    render() {

        var imageUrl = this.props.imageUrl ? this.props.imageUrl : this.state.imageSrc
        var isMainPerson = this.props.mainPersonId === this.props.data.id
        var isRealMainPerson = this.props.realMainPersonId === this.props.data.id

        var mainPersonId = this.props.isBigTree ? "mainPerson-LittleTree" : "mainPerson"

        return(
            <>
                {
                    this.state.redirect && <Redirect push to={"/data/" + this.props.data.id}/>
                }
                <div 
                    onContextMenu={(e) => this.openModal(e)}
                    className={this.props.isBigTree ? "LittleTreePerson" : "person"}
                    data-toggle="modal" 
                    data-target="#myModal" 
                    data-value=""
                    id={isMainPerson ? mainPersonId : ""}
                    onDoubleClick={() => this.props.doubleClickHandle(this.props.data, isMainPerson)}>
                    <div className="imgBlock">
                        <img src={imageUrl} className="imgPerson" decoding="async" alt="imgPerson"/>
                    </div>
                    <div>
                        <div className="surname">{this.props.data.surname}</div>
                        <div className="name">{this.props.data.name}</div>
                        <div className="middlename">{this.props.data.middlename}</div>
                    </div>
                    {
                        !isRealMainPerson &&
                        <div className="btn btn-default star-button" onClick={() => this.handleMainPersonChange()}>
                            <FontAwesomeIcon icon={faStar} />
                        </div>
                    }
                </div>
                <PersonRelationModal 
                    isOpen={this.state.modalOpen}
                    data={this.props.data} 
                    mainPerson={this.props.mainPersonId}
                    handleClose={() => this.handleClose()}
                    handleRedirect={() => this.handleRedirect()}
                    handleDelete={() => this.handleDelete()}
                />
            </>
        )
    }
}