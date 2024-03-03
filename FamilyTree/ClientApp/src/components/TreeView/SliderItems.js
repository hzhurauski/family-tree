import React, { Component } from 'react';
import { PersonData } from "./PersonData"
import { NewPerson } from "./NewPerson"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'


export class SliderItems extends Component {
    static displayName = SliderItems.name;
    
    constructor(props) {
        super(props);
        this.state = { currentIndex: 0 };
    }

    handleMovement(direction){
        var newIndex = this.state.currentIndex + direction

        if (newIndex >= this.props.items.length) {
            newIndex -= this.props.items.length
        }
        if (newIndex < 0) {
            newIndex += this.props.items.length
        }
        
        this.setState({
            currentIndex: newIndex
        })

        this.props.handleChange(this.props.mainPersonId, this.props.items[newIndex].id, this.state.currentIndex)
    }

    render() {
        var items = this.props.items
        var prevButtonVisibility = this.props.items?.length === 1 || this.props.items?.length === 0 || this.props.count > this.props.items?.length ? "hidden" : ""

        return(
            this.props.items &&
            <>
                <div 
                    className="PrevNext PrevItem" 
                    onClick={() => this.handleMovement(-1)}
                    style={{"visibility": prevButtonVisibility}}>
                    <div style={{padding: 3}}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                </div>
                <div className={this.props.isBigTree ? "SliderContainer-LittleTree" : "SliderContainer"} id={this.props.additionalId}>
                    <input className="itemSize" type="text" style={{display: 'none'}} value={this.props.size} />
                    <input className="itemMargin" type="text" style={{display: 'none'}} value={this.props.margin} />
                    <input className="itemVisibleCount" type="text" style={{display: 'none'}} value={this.props.count} />
                    <ul className="ListSlider" style={{transform: "translateX(0px)"}}>
                        {
                            items.length > 0 &&
                            items.map((item, i) => {    
                                var li_left = this.props.no_left 
                                ? (this.props.margin + this.props.size) * i
                                : (this.props.margin + this.props.size) * (this.props.count - (i + 1))
                                li_left = li_left < 0  ? 0 : li_left
                                return (
                                    i < this.props.count &&
                                    <li className={`itemSlider ${i === this.state.currentIndex ? "itemCurrent" : "itemAfter"}`} style={{left: li_left}}>
                                        <PersonData data={(item)} mainPersonId={this.props.mainPersonId}
                                            realMainPersonId={this.props.realMainPersonId} 
                                            doubleClickHandle={(data, isMain) => this.props.doubleClickHandle(data, isMain)}
                                            handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                            handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}
                                            isBigTree={this.props.isBigTree}/>
                                    </li>
                                ) 
                            })                                    
                        }
                        {
                            items.length === 0 &&
                            <li className="itemSlider itemCurrent" style={{left: this.props.leftOne}}>
                                    <NewPerson 
                                        addPersonCallback={(name, surname, middlename, date, gender) => this.props.addPersonCallback(name, surname, middlename, date, gender)}/>
                            </li>                                 
                        }
                    </ul>
                </div>
                {
                    (this.props.items.length > 1 && (this.props.count <= this.props.items?.length)) &&
                    <div className="PrevNext NextItem" onClick={() => this.handleMovement(1)}>
                        <div  style={{padding: 3}}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                    </div>
                }
            </>
        )
    }
}