import React, { Component } from 'react';
import { ButtonGroup, Button } from 'reactstrap'
import { ModalComponent } from '../Shared/Modal'
import moment from 'moment'

export class PrivacyModal extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            privacy: null,
            privacySet: false,
            validationMessage: ""
        };
    }

    componentDidUpdate() {
        if (!this.state.privacySet && this.props.data) {
            var newPrivacy = JSON.parse(JSON.stringify(this.props.data))
            this.setState({
                privacy: newPrivacy,
                privacySet: true
            })
        }
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});       
    }

    privacyHandle() {
        this.setState({validationMessage: ""})
        
        var startDateTime = moment(this.state.privacy.beginDate)
        var endDateTime = moment(this.state.privacy.endDate)

        if (startDateTime > endDateTime) {
            this.setState({
                validationMessage: "Дата начала позже даты конца"
            })
        }
        else {
            this.props.privacyCallback(
                this.state.privacy
            );  
        }
    }

    updatePrivacyLevel(level) {
        var pr = this.state.privacy
        pr.privacyLevel = level
        this.setState({privacy: pr});  
    }

    updateIsAlways(isAlways) {
        var pr = this.state.privacy
        pr.isAlways = isAlways
        this.setState({privacy: pr});  
    }

    handleDateTime(e, startDate) {
        var pr = this.state.privacy
        if (startDate) {
            pr.beginDate = e.target.value
        }
        else {
            pr.endDate = e.target.value
        }
        this.setState({privacy: pr});
    }

    handleClose() {
        this.setState({privacy: null, privacySet: false, validationMessage: ""})
        this.props.handleClose()
    }

    render() {
        return (
            <ModalComponent
                isOpen={this.props.isOpen}
                backdrop="static"
                centered
                toggle={() => this.handleClose()}
                headerText="Применение уровня доступа"
                handleClose={() => this.handleClose()}
                handleSave={() => this.privacyHandle()}
            >
                {
                    this.state.privacy &&
                    <div className="form-horizontal">
                        <span className="text-danger">{this.state.validationMessage}</span>
                        <div className="form-group">
                            <label htmlFor="privacy-level-buttons-group" className="control-label col-sm-4">Уровень доступа</label>
                            <div className="col-sm-8">
                                <ButtonGroup id="privacy-level-buttons-group" className="btn-group btn-group-toggle">
                                    <Button 
                                        className={"btn btn-default privacy-public-use" + (this.state.privacy.privacyLevel === 3 ? " active" : "")}
                                        onClick={() => this.updatePrivacyLevel(3)}
                                    >
                                        <input name="privacy-level" type="radio" value={3} checked={this.state.privacy.privacyLevel === 3}/>
                                        Публичный
                                    </Button>
                                    <Button 
                                        className={"btn btn-default privacy-internal-use" + (this.state.privacy.privacyLevel === 2 ? " active" : "")}
                                        onClick={() => this.updatePrivacyLevel(2)}
                                    >
                                        <input name="privacy-level" type="radio" value={2} checked={this.state.privacy.privacyLevel === 2}/>
                                        Внутренний
                                    </Button>
                                    <Button 
                                        className={"btn btn-default privacy-confidential" + (this.state.privacy.privacyLevel === 1 ? " active" : "")}
                                        onClick={() => this.updatePrivacyLevel(1)}
                                    >
                                        <input name="privacy-level" type="radio" value={1} checked={this.state.privacy.privacyLevel === 1}/>
                                        Личный
                                    </Button>
                                    <Button 
                                        className={"btn btn-default privacy-top-secret" + (this.state.privacy.privacyLevel === 0 ? " active" : "")}
                                        onClick={() => this.updatePrivacyLevel(0)}
                                    >
                                        <input name="privacy-level" type="radio" value={0} checked={this.state.privacy.privacyLevel === 0}/>
                                        Строго сикретно
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        {
                            this.state.privacy.privacyLevel === 2 &&
                            <div id="privacy-level-accounts" className="form-group">
                                <div>Выберите аккаунты</div>
                                <div>На данный момент недоступно.</div>
                            </div>
                        }                
                        
                        <div className="form-group">
                            <label htmlFor="limit-type-buttons-group" className="control-label col-sm-4">Ограничения</label>
                            <div className="col-sm-8">
                                <ButtonGroup id="limit-type-buttons-group" className="btn-group btn-group-toggle">
                                    <Button 
                                        className={"btn btn-default" + (this.state.privacy.isAlways ? " active" : "")}
                                        onClick={() => this.updateIsAlways(true)}
                                    >
                                        <input name="limit-type" type="radio" value="0" />Постоянно
                                    </Button>
                                    <Button 
                                        className={"btn btn-default"  + (!this.state.privacy.isAlways ? " active" : "")}
                                        onClick={() => this.updateIsAlways(false)}
                                    >
                                        <input name="limit-type" type="radio" value="1" />Период
                                    </Button>
                                </ButtonGroup>
                            </div>                        
                        </div>
                        {
                            !this.state.privacy.isAlways &&
                            <div id="privacy-level-limits">
                                <div className="form-group">
                                    <label htmlFor="privacy-level-begin-date" className="col-sm-4 control-label">Дата начала</label>
                                    <div className="col-sm-8">
                                        <input 
                                            id="privacy-level-begin-date" className="form-control" 
                                            type="datetime-local" value={this.state.privacy.beginDate === "0001-01-01T00:00:00" ? "" : this.state.privacy.beginDate }
                                            onChange={(e) => this.handleDateTime(e, true)}
                                        />
                                    </div>                                
                                </div>
                                <div className="form-group">
                                    <label htmlFor="privacy-level-end-date" className="col-sm-4 control-label">Дата окончания</label>
                                    <div className="col-sm-8">
                                        <input 
                                            id="privacy-level-end-date" className="form-control" 
                                            type="datetime-local" value={this.state.privacy.endDate === "0001-01-01T00:00:00" ? "" : this.state.privacy.endDate}
                                            onChange={(e) => this.handleDateTime(e, false)}
                                        />
                                    </div>                                
                                </div>                                               
                            </div>
                        }
                    </div>
                }
            </ModalComponent>
        )
    }
}
