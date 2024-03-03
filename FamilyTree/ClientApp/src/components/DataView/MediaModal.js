import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader, Button} from 'reactstrap'
import Slider from "react-slick";
import authService from '../api-authorization/AuthorizeService'

export class MediaModal extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            description: "",
            file: null,
            selectedType: 0,
            image: null
        };
    }

    componentDidUpdate() {
        if (this.props.mediaType === this.mediaTypes.Image && this.state.image === null && this.props.data && this.props.data?.id) {
            this.getImage()
        }
    }

    async getImage(id = null){
        var imageSrc = ""
        if (this.props.data.id != null) {
            const link = "/Media/Image/GetFile/" + (id ?? this.props.data.id);

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
        }

        this.setState({
            image: imageSrc
        })
    }

    mediaTypes = {
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

    renderImageModal() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                backdrop="static"
                centered={true}
                toggle={() => this.props.handleClose()}
                id={this.props.modalId}
                size="lg"
            >
                <ModalHeader toggle={() => this.props.handleClose()}>
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-8">
                            <Slider 
                                dots={false}
                                lazyLoad={true}
                                infinite={true}
                                speed={500}
                                slidesToShow={1}
                                slidesToScroll={1}
                                initialSlide={this.props.index}
                            >
                                {this.props.images.map((image) => {
                                    return (
                                        <div> 
                                            <img src={this.state.image} onLoadStart={() => this.getImage(image.id)} alt={image.title}/>
                                        </div>
                                    )
                                })}
                            </Slider>
                        </div>
                        <div className="col-md-4 image-details">
                            <div className="image-details__title image-title">
                                <div className="image-title__text">Заголовок</div>
                                <div className="image-title__value">
                                    <textarea id="slider-image-title" rows="3"></textarea>
                                </div>
                            </div>
                            <div className="image-details__desc image-desc">
                                <div className="image-desc__text">Описание</div>
                                <div className="image-desc__value">
                                    <textarea id="slider-image-desc" rows="10"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {/* <div className="modal-footer">
                        <div className="pages modal-footer__pages">
                            <div className="pages__current-page"></div>
                            <div className="pages__separator">/</div>
                            <div className="pages__count"></div>
                        </div>                
                        <div className="buttons modal-footer__buttons">
                            <div className="privacy">
                                <div className="privacy__privacy-level"></div>
                                <div id="edit-image-privacy-button" className="btn privacy__privacy-button"></div>
                            </div>
                            <button id="set-image-as-avatar-button" type="button" className="btn modal-primary-button">Сделать изображением персоны</button>
                            <button id="save-image-submit-button" type="button" className="btn modal-primary-button">Сохранить</button>
                        </div>
                    </div> */}
                    <div className="pages modal-footer__pages">
                        <div className="pages__current-page">{this.props.index}</div>
                        <div className="pages__separator">/</div>
                        <div className="pages__count">{this.props.mediaCount}</div>
                    </div>  
                    <Button variant="secondary" id={this.closeButtonId} className={this.props.closeButtonClassName} onClick={() => this.props.handleClose()}>
                        {this.props.closeButtonName ? this.props.closeButtonName : "Close"}
                    </Button>
                    <Button variant="primary" id={this.saveButtonId} className={this.props.saveButtonClassName} onClick={() => this.props.handleSave()}>
                        {this.props.saveButtonName ? this.props.saveButtonName : "Save"}
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderVideoModal() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                backdrop="static"
                centered={true}
                toggle={() => this.props.handleClose()}
                id={this.props.modalId}
            >
                <ModalHeader toggle={() => this.props.handleClose()}>
                </ModalHeader>
                <ModalBody>
                    
                </ModalBody>
                <ModalFooter>
                    
                    <Button variant="secondary" id={this.closeButtonId} className={this.props.closeButtonClassName} onClick={() => this.props.handleClose()}>
                        {this.props.closeButtonName ? this.props.closeButtonName : "Close"}
                    </Button>
                    <Button variant="primary" id={this.saveButtonId} className={this.props.saveButtonClassName} onClick={() => this.props.handleSave()}>
                        {this.props.saveButtonName ? this.props.saveButtonName : "Save"}
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderAudioModal() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                backdrop="static"
                centered={true}
                toggle={() => this.props.handleClose()}
                id={this.props.modalId}
            >
                <ModalHeader toggle={() => this.props.handleClose()}>
                </ModalHeader>
                <ModalBody>
                    
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" id={this.closeButtonId} className={this.props.closeButtonClassName} onClick={() => this.props.handleClose()}>
                        {this.props.closeButtonName ? this.props.closeButtonName : "Close"}
                    </Button>
                    <Button variant="primary" id={this.saveButtonId} className={this.props.saveButtonClassName} onClick={() => this.props.handleSave()}>
                        {this.props.saveButtonName ? this.props.saveButtonName : "Save"}
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }

    render() {
        var mediaModal = null
        switch (this.props.mediaType) {
            case this.mediaTypes.Image:
                mediaModal = this.renderImageModal()
                break;            
            case this.mediaTypes.Video:
                mediaModal = this.renderVideoModal()
                break;            
            case this.mediaTypes.Audio:
                mediaModal = this.renderAudioModal()
                break;
            default:
                break;
        }

        return (
            <>
                {mediaModal}
            </>
        )
    }
}