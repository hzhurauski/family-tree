import React, { Component } from 'react';
import { ModalComponent } from '../Shared/Modal'

export class AddPersonModal extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            checked: 0,
            name: "",
            surname: "",
            middlename: "",
            date: null
        };
    }

    genders = {
        Unknown: 0,
        Male: 1,
        Female: 2
    }

    setGender(gender) {
        this.setState({
            checked: gender
        })
    }
    
    handleDateChange(e) {
        this.setState({date: e.target.value});       
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});       
    }


    handleSurnameChange(e) {
        this.setState({surname: e.target.value});       
    }


    handleMiddleNameChange(e) {
        this.setState({middlename: e.target.value});       
    }

    addPersonHandle() {
        this.props.addPersonCallback(
            this.state.name,
            this.state.surname,
            this.state.middlename,
            this.state.date,
            this.state.checked
        );
    }

    render() {
        var activeClassName = "btn btn-default active"
        var btnClassName = "btn btn-default"

        return (
            <ModalComponent
                isOpen={this.props.isOpen}
                backdrop="static"
                centered
                toggle={() => this.props.handleClose()}
                headerText="Add Person"
                handleClose={() => this.props.handleClose()}
                handleSave={() => this.addPersonHandle()}
            >
                <div className="data-holders__item data-holder">
                    <div className="data-holder__title">
                        <div>Имя</div>
                    </div>
                    <div className="data-holder__data">
                        <input id="create-person-name" type="text" onChange={(e) => this.handleNameChange(e)} value={this.state.name}/>
                    </div>
                </div>
                <div className="data-holders__item data-holder">
                    <div className="data-holder__title">
                        <div>Фамилия</div>
                    </div>
                    <div className="data-holder__data">
                        <input id="create-person-surname" type="text" onChange={(e) => this.handleSurnameChange(e)} value={this.state.surname}/>
                    </div>
                </div>
                <div className="data-holders__item data-holder">
                    <div className="data-holder__title">
                        <div>Отчество</div>
                    </div>
                    <div className="data-holder__data">
                        <input id="create-person-middlename" type="text" onChange={(e) => this.handleMiddleNameChange(e)} value={this.state.middlename}/>
                    </div>
                </div>
                <div className="data-holders__item data-holder">
                    <div className="data-holder__title">
                        <div>День рождения</div>
                    </div>
                    <div className="data-holder__data">
                        <input id="create-person-birthday" type="date" onChange={(e) => this.handleDateChange(e)}/>
                    </div>
                </div>
                <div className="data-holders__item data-holder-gender">
                    <div className="data-holder-gender__title">
                        <div className="data-holder-gender__title_modal">Пол</div>
                    </div>
                    <div className="data-holder-gender__data">
                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                            <label className={this.state.checked === this.genders.Male ? activeClassName : btnClassName}>
                                <input type="radio" name="person-gender" value="Male" checked={this.state.checked === this.genders.Male} onClick={() => this.setGender(this.genders.Male)}/>Мужской
                            </label>
                            <label className={this.state.checked === this.genders.Female ? activeClassName : btnClassName}>
                                <input type="radio" name="person-gender" value="Female" checked={this.state.checked === this.genders.Female} onClick={() => this.setGender(this.genders.Female)}/>Женский
                            </label>
                            <label className={this.state.checked === this.genders.Unknown ? activeClassName : btnClassName}>
                                <input type="radio" name="person-gender" value="Unknown" checked={this.state.checked === this.genders.Unknown} onClick={() => this.setGender(this.genders.Unknown)} />Неизвестно
                            </label>
                        </div>
                    </div>
                </div>
            </ModalComponent>
        )
    }
}