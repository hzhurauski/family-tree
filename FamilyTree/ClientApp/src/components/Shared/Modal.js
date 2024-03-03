import React, { Component } from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader, Button} from 'reactstrap'

export class ModalComponent extends Component {
    render() {
        var backdrop = this.props.backdrop === "static" ? this.props.backdrop : true

        return (
            <Modal
                isOpen={this.props.isOpen}
                backdrop={backdrop}
                centered={this.props.centered}
                toggle={() => this.props.toggle()}
            >
                <ModalHeader toggle={() => this.props.toggle()}>
                    {this.props.headerText}
                </ModalHeader>
                <ModalBody>
                    {this.props.children}
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
}