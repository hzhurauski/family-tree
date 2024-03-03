import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService'

export class MediaHolder extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            imageSrc: ""
        };
    }


    mediaTypes = {
        Image: 2,
        Video: 3,
        Audio: 4,
    }

    componentDidMount() {
        if (this.props.type === this.mediaTypes.Image) {
            this.getImage()
        }
    }

    renderVideo() {
        var videoPosterSrc = "data:image/" + this.props.data.previewImageType + ";base64," + this.props.data.previewImageData
        return (
            <div className="video videos__item">
                <div className="video__selector">
                    <div className="checkbox">
                        <input type="checkbox" checked={this.props.checked} onChange={(e) => this.props.checkboxSelectCallback(e)}></input>
                    </div>
                </div>
                <img src={videoPosterSrc} alt={this.props.data.title} onClick={() => this.props.clickCallback()}/>;
            </div>
        )
    }

    renderAudio() {
        return (
            <div className="audio audios__item">
                <div className="audio__selector">
                    <div className="checkbox">
                        <input type="checkbox" checked={this.props.checked} onChange={(e) => this.props.checkboxSelectCallback(e)}></input>
                    </div>
                </div>
                <div className="audio__play btn btn-default" onClick={() => this.props.clickCallback()}>
                    <img src={require("../..//images/play.svg")} />
                </div>
                <div className="audio__title">
                    {this.props.data.title}
                </div>
            </div>
        )
    }

    renderImage() {
        var imageUrl = this.props.imageUrl ? this.props.imageUrl : this.state.imageSrc
        return (
            <div className="image images__item">
                <div className="image__selector">
                    <div className="checkbox">
                        <input type="checkbox" checked={this.props.checked} onChange={(e) => this.props.checkboxSelectCallback(e)}></input>
                    </div>
                </div>
                <img src={imageUrl} decoding="async" alt={this.props.data.title} onClick={() => this.props.clickCallback()}/>
            </div>
        )
    }

    async getImage(){
        var imageSrc = ""
        if (this.props.data.id != null) {
            const link = "/Media/Image/GetFile/" + this.props.data.id;

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
            imageSrc
        })
    }

    

    render() {
        return (
            <>
                {
                    this.props.type === this.mediaTypes.Image &&
                    this.renderImage()
                }
                {
                    this.props.type === this.mediaTypes.Video &&
                    this.renderVideo()
                }
                {
                    this.props.type === this.mediaTypes.Audio &&
                    this.renderAudio()
                }
            </>
        )
    }
}
