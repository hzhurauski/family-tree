/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { PersonData } from "./PersonData"
import { SliderItems } from "./SliderItems";
import { AddPerson } from "./AddPerson"
import { NewPerson } from "./NewPerson"
import { ShareTreeModal } from './ShareTreeModal'
import Canvas from "./Canvas";
import * as canvasHelpers from "../../helpers/CanvasHelpers"
import { PersonRelationTypes } from "../../helpers/RelationTypes"
import { getIsBigScale } from '../../reducers/application.selectors';
import { setBigScale, removeBigScale, hideAppLoader, showAppLoader } from '../../reducers/application.actions';

export class TreeStructure extends Component {
    static displayName = TreeStructure.name;

    constructor(props) {
        super(props);
        this.state = { 
            bloodFlag: props.bloodTree !== null,
            mainId: null,
            wifeId: null,
            shareModalOpen: false
        };
    }

    componentDidMount() {

        var areAnyWifes = this.props.treeData.wifes && this.props.treeData.wifes?.length

        this.setState({
            mainId: this.props.treeData.mainPerson.id,
            wifeId: areAnyWifes ? this.props.treeData.wifes[0].id : null
        })
    }

    toggleBlood() {
        var bl = !this.state.bloodFlag
        this.setState({
            bloodFlag: bl
        })

        if (bl) {
            this.props.getBloodTree(this.state.mainId, this.state.wifeId)
        }
    }

    goToMain() {
        this.props.callback(this.props.realMainPersonId, this.state.bloodFlag, null)
    }

    toggleTreeScale() {
        if (this.props.bigScale) {
            this.props.removeBigScale()
        }
        else {
            this.props.setBigScale()
        }
    }

    wifeChangeHandle(mainId, wifeId) {
        this.props.callback(mainId, this.state.bloodFlag, wifeId)
    }
    
    doubleClickHandle(data, isMain) {
        if (isMain) return;
        this.props.callback(data.id, this.state.bloodFlag)
    }

    addPersonCallback(name, surname, middlename, date, gender, relation, relativeId, relativeWifeId, parentNumber = 0) {

        var createPersonData = {
            name,
            surname,
            middlename,
            birthday: date,
            gender,
            treeId: 0,
            parentNumber,
            personRelationType: relation,
            wifeId: 0,
            mainPersonId: relativeId,
            userData: []
        };

        if (relation === PersonRelationTypes.Child) {
            createPersonData.wifeId = relativeWifeId;
        }

        console.log(name, surname, middlename, date, gender, relation, relativeId, relativeWifeId, parentNumber)

        this.props.handleAddPerson(createPersonData)
    }

    handleSonsRotate(index) {
        console.log(index)
    }

    openShareModal() {
        this.setState({
            shareModalOpen: true
        })
    }

    closeShareModal() {
        this.setState({
            shareModalOpen: false
        })
    }

    drawCanvas0(context) {
        var colorLine = ""
        for (var i = 0; i < 8; i++) {
            if (this.props.treeData.grand_has_parent[i]) {
                if (this.state.bloodFlag && this.props.bloodTree?.grand[i]) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted;
                }
    
                canvasHelpers.drawLine(context, 50 + 150 * i, 15, 50 + 150 * i, 50, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
        }
    }

    drawCanvas1(context) {
        var colorLine = ""
        
        // Ones
        for (var i = 0; i < 8; i++) {
            if (this.props.treeData.grand_has_parent[i]) {
                if (this.state.bloodFlag && this.props.bloodTree?.grand[i]) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted;
                }

                if (i % 2 === 0) {
                    canvasHelpers.drawHalf(context, 50 + 300 * i / 2, 0, 0 + 300 * i / 2, 30, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
                } else {
                    canvasHelpers.drawHalf(context, 200 + 300 * (i - 1) / 2, 0, 250 + 300 * (i - 1) / 2, 30, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
                }
            }
        }

        for (var i = 0; i < 4; i++) {
            if (this.props.treeData.parent_has_brother[i]) {
                if (this.state.bloodFlag && this.props.bloodTree?.parent[i]) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted
                }

                canvasHelpers.drawHalf(context, 125 + 300 * i, 60, 75 + 300 * i, 90, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
        }

        var arrGrand = [
            this.props.treeData.grand_1_1, this.props.treeData.grand_1_2, 
            this.props.treeData.grand_2_1, this.props.treeData.grand_2_2,
            this.props.treeData.grand_W_1_1, this.props.treeData.grand_W_1_2, 
            this.props.treeData.grand_W_2_1, this.props.treeData.grand_W_2_2
        ];
        var arrParent = [
            this.props.treeData.parent_1, this.props.treeData.parent_2, 
            this.props.treeData.parent_W_1, this.props.treeData.parent_W_2
        ];

        // Есть ли дедушка
        for (var i = 0; i < 8; i++) {
            if (i % 2 === 0) {
                if (arrGrand[i] != null) {
                    if (this.state.bloodFlag && this.props.bloodTree?.grand[i]) {
                        colorLine = canvasHelpers.colorBlood
                    }
                    else {
                        colorLine = canvasHelpers.colorDefault
                    }

                    canvasHelpers.draw(context, 50 + 300 * i / 2, 0, 125 + 300 * i / 2, 60, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength, false);
                }
                else {
                    if (arrParent[Math.trunc(i / 2)] != null) {
                        canvasHelpers.draw(context, 50 + 300 * i / 2, 0, 125 + 300 * i / 2, 60, canvasHelpers.width, canvasHelpers.colorMuted, true, canvasHelpers.dashLength, false);
                    }
                }
            } 
            else {
                if (arrGrand[i] != null) {
                    if (this.state.bloodFlag && this.props.bloodTree?.grand[i]) {
                        colorLine = canvasHelpers.colorBlood
                    }
                    else {
                        colorLine = canvasHelpers.colorDefault
                    }
                    
                    canvasHelpers.draw(context, 200 + 300 * (i - 1) / 2, 0, 125 + 300 * (i - 1) / 2, 60, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength, true);
                }
                else {
                    if (arrParent[Math.trunc(i / 2)] != null) {
                        canvasHelpers.draw(context, 200 + 300 * (i - 1) / 2, 0, 125 + 300 * (i - 1) / 2, 60, canvasHelpers.width, canvasHelpers.colorMuted, true, canvasHelpers.dashLength, true);
                    }
                }
            }
        }

        for (var i = 0; i < 4; i++) {
            if (arrParent[i] != null) {
                if (arrGrand[i * 2] == null && arrGrand[i * 2 + 1] == null) {
                    canvasHelpers.drawLine(context, 125 + 300 * i, 60, 125 + 300 * i, 100, canvasHelpers.width, canvasHelpers.colorMuted, true, canvasHelpers.dashLength);
                } else {
                    if (this.state.bloodFlag && this.props.bloodTree?.grand[i]) {
                        colorLine = canvasHelpers.colorBlood
                    }
                    else {
                        colorLine = canvasHelpers.colorDefault
                    }

                    canvasHelpers.drawLine(context, 125 + 300 * i, 60, 125 + 300 * i, 100, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
                }
            }
        }
    }

    drawCanvas2(context) {
        var colorLine = ""
        // One
        // Братья
        if (this.props.treeData.brothers != null && this.props.treeData.brothers.length > 0) {
            if (this.state.bloodFlag && (this.props.bloodTree?.parent[0] || this.props.bloodTree?.parent[1])) {
                colorLine = canvasHelpers.colorBlood
            }
            else {
                colorLine = canvasHelpers.colorDefault;
            }

            canvasHelpers.drawHalf(context, 270, 60, 220, 90, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
            canvasHelpers.drawHalfUp(context, 185, 90, 160, 100, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
            canvasHelpers.drawLine(context, 185, 90, 220, 90, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);

            if (this.props.treeData.brothers.length > 1) {
                canvasHelpers.drawLine(context, 75, 90, 185, 90, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
                canvasHelpers.drawHalfUp(context, 75, 90, 50, 100, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
            }

            if (colorLine === canvasHelpers.colorBlood) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorDefault
            }

            if (this.props.treeData.brothers.length > 2) {
                canvasHelpers.drawLine(context, 75, 90, 10, 90, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
        }

        var arrParent = [
            this.props.treeData.parent_1, this.props.treeData.parent_2, 
            this.props.treeData.parent_W_1, this.props.treeData.parent_W_2
        ];

        // Есть ли родитель
        for (var i = 0; i < 4; i++) {
            if (i % 2 === 0) {
                // Если нет жены
                if (i === 2 && this.props.treeData.wifes == null) {
                    break;
                }

                if (arrParent[i] != null) {
                    if (this.state.bloodFlag && (this.props.bloodTree?.parent[i])) {
                        colorLine = canvasHelpers.colorBlood
                    }
                    else {
                        colorLine = canvasHelpers.colorDefault;
                    }

                    canvasHelpers.draw(context, 125 + 600 * i / 2, 0, 270 + 605 * i / 2, 60, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength, false);
                }
                else {
                    canvasHelpers.draw(context, 125 + 600 * i / 2, 0, 270 + 605 * i / 2, 60, canvasHelpers.width, canvasHelpers.colorMuted, true, canvasHelpers.dashLength, false);
                }
            } else {
                if (arrParent[i] != null) {
                    if (this.state.bloodFlag && (this.props.bloodTree?.parent[i])) {
                        colorLine = canvasHelpers.colorBlood
                    }
                    else {
                        colorLine = canvasHelpers.colorDefault;
                    }

                    canvasHelpers.draw(context, 425 + 600 * (i - 1) / 2, 0, 270 + 605 * (i - 1) / 2, 60, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength, true);
                }
                else {
                    canvasHelpers.draw(context, 425 + 600 * (i - 1) / 2, 0, 270 + 605 * (i - 1) / 2, 60, canvasHelpers.width, canvasHelpers.colorMuted, true, canvasHelpers.dashLength, true);
                }
            }
        }

        for (var i = 0; i < 2; i++) {
            // Если нет жены
            if (i === 1 && this.props.treeData.wifes == null) {
                break;
            }
            if (arrParent[i * 2] == null && arrParent[i * 2 + 1] == null) {
                if (this.state.bloodFlag && (this.props.bloodTree?.parent[i * 2] || this.props.bloodTree?.parent[i * 2 + 1])) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted;
                }

                canvasHelpers.drawLine(context, 270 + 605 * i, 60, 270 + 605 * i, 100, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            } else {
                if (this.state.bloodFlag && (this.props.bloodTree?.parent[i * 2] || this.props.bloodTree?.parent[i * 2 + 1])) {
                    colorLine = canvasHelpers.colorBlood
                }
                else {
                    colorLine = canvasHelpers.colorDefault;
                }

                canvasHelpers.drawLine(context, 270 + 605 * i, 60, 270 + 605 * i, 100, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
            }
        }

        var tail = -125;

        for (var i = 0; i < 4; i++) {
            if (i % 2 === 0) {
                tail += 200;
            } else {
                tail += 400;
            }
            if (this.props.treeData.parent_has_another_child[i]) {
                if (this.state.bloodFlag && (this.props.bloodTree?.parent[i])) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted;
                }
                
                canvasHelpers.drawHalf(context, 125 + 300 * i, 0, tail, 30, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
        }

        // Three
        // Есть ли у второй жены родитель
        if (this.props.treeData.wife_2_has_parent) {
            if (this.state.bloodFlag && (this.props.bloodTree?.wifes[1])) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted;
            }
            canvasHelpers.drawLine(context, 1100, 75, 1100, 100, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
        }
    }

    drawCanvas3(context) {
        var colorLine = ""
        
        // One
        // Есть ли дети у жен от других браков
        if (this.props.treeData.wife_has_another_child != null) {
            for (var i = 0; i < 2; i++) {
                if (this.props.treeData.wife_has_another_child[i]) {
                    if (this.state.bloodFlag && this.props.bloodTree?.wifes[i]) {
                        colorLine = canvasHelpers.colorBloodMuted
                    }
                    else {
                        colorLine = canvasHelpers.colorMuted;
                    }

                    canvasHelpers.drawHalf(context, 875 + i * 225, 0, 925 + i * 225, 30, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
                }
            }
        }

        // Есть вторая жена и ребенок от нее
        if (this.props.treeData.childWife_2 != null) {
            if (this.state.bloodFlag && this.props.bloodTree?.main) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted;
            }


            canvasHelpers.drawLine(context, 450, 40, 950, 40, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
            canvasHelpers.drawHalfUp(context, 950, 40, 988, 80, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);

            if (this.state.bloodFlag && this.props.bloodTree?.wifes[1]) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted;
            }

            canvasHelpers.draw(context, 1100, 0, 988, 80, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength, true);

            if (this.state.bloodFlag && (this.props.bloodTree?.wifes[1] || this.props.bloodTree?.main)) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted;
            }
            canvasHelpers.drawLine(context, 988, 80, 988, 120, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);


            // Количество детей у 2-й жены больше 1
            if (this.props.treeData.countChildrenWife_2) {
                if (this.state.bloodFlag && this.props.bloodTree?.wifes[1]) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted;
                }

                canvasHelpers.drawHalf(context, 988, 80, 938, 110, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }

            // Есть ли ребенок от 3-й жены
            if (this.props.treeData.child_Wife_3) {
                if (this.state.bloodFlag && this.props.bloodTree?.main) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted;
                }

                canvasHelpers.drawLine(context, 950, 40, 1150, 40, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
        }

        // Two       
        if (this.props.treeData.children == null) {
            canvasHelpers.draw(context, 270, 0, 575, 80, canvasHelpers.width, canvasHelpers.colorMuted, true, canvasHelpers.dashLength, false);
            canvasHelpers.draw(context, 875, 0, 575, 80, canvasHelpers.width, canvasHelpers.colorMuted, true, canvasHelpers.dashLength, true);
            canvasHelpers.drawLine(context, 575, 80, 575, 120, canvasHelpers.width, canvasHelpers.colorMuted, true, canvasHelpers.dashLength);
        } 
        else {
            if (this.state.bloodFlag && this.props.bloodTree?.main) {
                colorLine = canvasHelpers.colorBlood
            }
            else {
                colorLine = canvasHelpers.colorDefault
            }

            canvasHelpers.draw(context, 270, 0, 575, 80, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength, false);

            if (this.state.bloodFlag && this.props.bloodTree?.children[0]) {
                colorLine = canvasHelpers.colorBlood
            }
            else {
                colorLine = canvasHelpers.colorDefault
            }

            canvasHelpers.drawLine(context, 575, 80, 575, 120, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);

            if (this.props.treeData.wifes == null) {
                canvasHelpers.draw(context, 875, 0, 575, 80, canvasHelpers.width, canvasHelpers.colorMuted, true, canvasHelpers.dashLength, true);
            } else {
                if (this.state.bloodFlag && this.props.bloodTree?.wifes[0]) {
                    colorLine = canvasHelpers.colorBlood
                }
                else {
                    colorLine = canvasHelpers.colorDefault
                }

                canvasHelpers.draw(context, 875, 0, 575, 80, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength, true);
            }
        }

        if (this.props.treeData.children != null) {
            if (this.state.bloodFlag && this.props.bloodTree?.children[0]) {
                colorLine = canvasHelpers.colorBlood
            }
            else {
                colorLine = canvasHelpers.colorDefault
            }

            if (this.props.treeData.children.length > 1) {
                canvasHelpers.drawHalf(context, 575, 80, 525, 110, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
                canvasHelpers.drawHalfUp(context, 490, 110, 465, 120, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
                canvasHelpers.drawLine(context, 490, 110, 525, 110, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
            }

            if (this.props.treeData.children.length > 2) {
                canvasHelpers.drawHalfUp(context, 380, 110, 355, 120, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
                canvasHelpers.drawLine(context, 380, 110, 490, 110, canvasHelpers.width, colorLine, false, canvasHelpers.dashLength);
            }

            if (this.props.treeData.children.length > 3) {
                if (colorLine === canvasHelpers.colorBlood) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted
                }

                canvasHelpers.drawLine(context, 315, 110, 380, 110, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
        }


        // Three
        // Есть ли у братьев дети

        if (this.props.treeData.brothersSons != null && this.props.treeData.brothersSons.length > 0) {
            if (this.state.bloodFlag && this.props.bloodTree?.main) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted;
            }

            if (this.props.treeData.brothersSons[0]) {
                canvasHelpers.drawLine(context, 160, 0, 160, 35, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
            if (this.props.treeData.brothersSons.length > 1) {
                if (this.props.treeData.brothersSons[1]) {
                    canvasHelpers.drawLine(context, 50, 0, 50, 35, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
                }
            }
        }
    }

    drawCanvas4(context) {
        var colorLine = ""
        
        if (this.props.treeData.children != null) {
            if (this.state.bloodFlag && this.props.bloodTree?.children[0]) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted
            }
    
    
            var i = 2;
            switch (this.props.treeData.children.length) {
                case 1: i = 2; break;
                case 2: i = 1; break;
                case 3: i = 0; break;
                default: i = 0;
            }
            if (this.props.treeData.child_has_sons[0]) {
                canvasHelpers.drawLine(context, 355 + i * 110, 0, 355 + i * 110, 35, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
            if (this.props.treeData.children.length > 1 && this.props.treeData.child_has_sons[1]) {
                canvasHelpers.drawLine(context, 465 + i * 110, 0, 465 + i * 110, 35, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
            if (this.props.treeData.children.length > 2 && this.props.treeData.child_has_sons[2]) {
                canvasHelpers.drawLine(context, 575, 0, 575, 35, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
            }
        }
    
        if (this.props.treeData.child_Another_has_sons) {
            if (this.state.bloodFlag && this.props.bloodTree?.anotherChild) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted
            }
            
            canvasHelpers.drawLine(context, 988, 0, 988, 35, canvasHelpers.width, colorLine, true, canvasHelpers.dashLength);
        }
    }

    drawCanvas5(context) {
        var colorLine = ""
        
        var arrGrand = [
            this.props.treeData.grand_1_1, this.props.treeData.grand_1_2, 
            this.props.treeData.grand_2_1, this.props.treeData.grand_2_2
        ];

        if (arrGrand[0] != null || arrGrand[1] != null) {
            if (this.state.bloodFlag && this.props.bloodTree?.parent[0]) {
                colorLine = canvasHelpers.colorBloodMuted;
            }
            else {
                colorLine = canvasHelpers.colorMuted;
            }

            canvasHelpers.drawLine(context, 100, 50, 100, 100, canvasHelpers.widthBig, colorLine, true, canvasHelpers.dashLengthBig)
        }
        if (arrGrand[2] != null || arrGrand[3] != null) {
            if (this.state.bloodFlag && this.props.bloodTree?.parent[1]) {
                colorLine = canvasHelpers.colorBloodMuted;
            }
            else {
                colorLine = canvasHelpers.colorMuted;
            }
            canvasHelpers.drawLine(context, 926, 50, 926, 100, canvasHelpers.widthBig, colorLine, true, canvasHelpers.dashLengthBig)
        }
    }

    drawCanvas6(context) {
        var colorLine = ""
        
        var arrParent = [
            this.props.treeData.parent_1, this.props.treeData.parent_2, 
            this.props.treeData.parent_W_1, this.props.treeData.parent_W_2
        ];

        if (this.state.bloodFlag && this.props.bloodTree?.parent[0]) {}

        // Есть ли родитель
        for (var i = 0; i < 2; i++) {
            if (i % 2 === 0) {
                if (arrParent[i] != null) {
                    if (this.state.bloodFlag && this.props.bloodTree?.parent[0]) {
                        colorLine = canvasHelpers.colorBlood;
                    }
                    else {
                        colorLine = canvasHelpers.colorDefault;
                    }
                    canvasHelpers.draw(context, 100, 0, 513, 120, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig, false);
                }
                else {
                    canvasHelpers.draw(context, 100, 0, 513, 120, canvasHelpers.widthBig, canvasHelpers.colorMuted, true, canvasHelpers.dashLengthBig, false);
                }
            } else {
                if (arrParent[i] != null) {
                    if (this.state.bloodFlag && this.props.bloodTree?.parent[1]) { 
                        colorLine = canvasHelpers.colorBlood;
                    }
                    else {
                        colorLine = canvasHelpers.colorDefault;
                    }
                    canvasHelpers.draw(context, 926, 0, 513, 120, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig, true);
                }
                else {
                    canvasHelpers.draw(context, 926, 0, 513, 120, canvasHelpers.widthBig, canvasHelpers.colorMuted, true, canvasHelpers.dashLengthBig, true);
                }
            }
        }

        if (arrParent[0] == null && arrParent[1] == null) {
            canvasHelpers.drawLine(context, 513, 120, 513, 200, canvasHelpers.widthBig, canvasHelpers.colorMuted, true, canvasHelpers.dashLengthBig);
        } else {
            if (this.state.bloodFlag && (this.props.bloodTree?.parent[0] || this.props.bloodTree?.parent[1])) {
                 colorLine = canvasHelpers.colorBlood;
            }
            else {
                colorLine = canvasHelpers.colorDefault
            }
            canvasHelpers.drawLine(context, 513, 120, 513, 200, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig);
        }

        for (var i = 0; i < 2; i++) {
            if (this.props.treeData.parent_has_another_child[i]) {
                if (this.state.bloodFlag && this.props.bloodTree?.parent[i]) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted
                }
                canvasHelpers.drawHalf(context, 100 + 826 * i, 0, 0 + 1026 * i, 60, canvasHelpers.widthBig, colorLine, true, canvasHelpers.dashLengthBig);
            }
        }

        // Братья
        if (this.props.treeData.brothers != null && this.props.treeData.brothers.length > 0) {
            if (this.state.bloodFlag && this.props.bloodTree?.main) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted
            }
            if (this.props.treeData.brothers.length > 1) {
                canvasHelpers.drawLine(context, 215, 180, 313, 180, canvasHelpers.widthBig, colorLine, true, canvasHelpers.dashLengthBig)
            }

            if (this.state.bloodFlag && this.props.bloodTree?.main) { 
                colorLine = canvasHelpers.colorBlood
            }
            else {
                colorLine = canvasHelpers.colorDefault
            }

            canvasHelpers.drawHalf(context, 513, 120, 413, 180, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig);
            canvasHelpers.drawHalfUp(context, 333, 180, 283, 200, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig);
            canvasHelpers.drawLine(context, 333, 180, 413, 180, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig);
        }

        // Есть ли у жены родитель
        if (arrParent[2] != null || arrParent[3] != null) {
            if (this.state.bloodFlag && this.props.bloodTree?.wifes[0]) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted
            }
            canvasHelpers.drawLine(context, 863, 150, 863, 200, canvasHelpers.widthBig, colorLine, true, canvasHelpers.dashLengthBig);
        }
    }

    drawCanvas7(context) {
        var colorLine = ""
        
        // Дети        
        if (this.props.treeData.children == null) {
            canvasHelpers.draw(context, 513, 0, 690, 120, canvasHelpers.widthBig, canvasHelpers.colorMuted, true, canvasHelpers.dashLengthBig, false);
            canvasHelpers.draw(context, 863, 0, 690, 120, canvasHelpers.widthBig, canvasHelpers.colorMuted, true, canvasHelpers.dashLengthBig, true);
            canvasHelpers.drawLine(context, 690, 120, 690, 200, canvasHelpers.widthBig, canvasHelpers.colorMuted, true, canvasHelpers.dashLengthBig);
        } else {
            if (this.state.bloodFlag && this.props.bloodTree?.main) {
                colorLine = canvasHelpers.colorBlood
            }
            else {
                colorLine = canvasHelpers.colorDefault
            }
            canvasHelpers.draw(context, 513, 0, 690, 120, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig, false);

            if (this.state.bloodFlag && (this.props.bloodTree?.main || this.props.bloodTree?.wifes[0])) {
                colorLine = canvasHelpers.colorBlood
            }
            else {
                colorLine = canvasHelpers.colorDefault
            }
            canvasHelpers.drawLine(context, 690, 120, 690, 200, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig);

            if (this.props.treeData.wifes == null) {
                canvasHelpers.draw(context, 863, 0, 690, 120, canvasHelpers.widthBig, canvasHelpers.colorMuted, true, canvasHelpers.dashLengthBig, true);
            } else {
                if (this.state.bloodFlag && this.props.bloodTree?.wifes[0]) {
                    colorLine = canvasHelpers.colorBlood
                }
                else {
                    colorLine = canvasHelpers.colorDefault
                }
                canvasHelpers.draw(context, 863, 0, 690, 120, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig, true);
            }
        }

        if (this.props.treeData.children != null) {
            if (this.props.treeData.children.length > 2) {
                if (this.state.bloodFlag && this.props.bloodTree?.children[0]) {
                    colorLine = canvasHelpers.colorBloodMuted
                }
                else {
                    colorLine = canvasHelpers.colorMuted
                }
                canvasHelpers.drawLine(context, 392, 180, 490, 180, canvasHelpers.widthBig, colorLine, true, canvasHelpers.dashLengthBig);
            }

            if (this.props.treeData.children.length > 1) {
                if (this.state.bloodFlag && this.props.bloodTree?.children[0]) {
                    colorLine = canvasHelpers.colorBlood
                }
                else {
                    colorLine = canvasHelpers.colorDefault
                }
                canvasHelpers.drawHalf(context, 690, 120, 590, 180, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig);
                canvasHelpers.drawHalfUp(context, 510, 180, 460, 200, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig);
                canvasHelpers.drawLine(context, 510, 180, 590, 180, canvasHelpers.widthBig, colorLine, false, canvasHelpers.dashLengthBig);
            }
        }

        // Есть ли у братьев дети

        if (this.props.treeData.brothersSons != null && this.props.treeData.brothersSons.length > 0) {
            if (this.props.treeData.brothersSons[0]) {
                if (this.state.bloodFlag && this.props.bloodTree?.brothers[0]) {
                    colorLine = canvasHelpers.colorBloodMuted;
                }
                else {
                    colorLine = canvasHelpers.colorMuted;
                }
                canvasHelpers.drawLine(context, 283, 0, 283, 50, canvasHelpers.widthBig, colorLine, true, canvasHelpers.dashLengthBig);
            }
        }
    }

    drawCanvas8(context) {
        var colorLine = ""
        
        if (this.props.treeData.children != null) {
            if (this.state.bloodFlag && this.props.bloodTree?.children[0]) {
                colorLine = canvasHelpers.colorBloodMuted
            }
            else {
                colorLine = canvasHelpers.colorMuted
            }
    
            var i = 1;
            switch (this.props.treeData.children.length) {
                case 1: i = 1; break;
                case 2: i = 0; break;
                default: i = 0;
            }
            if (this.props.treeData.child_has_sons[0]) {
                canvasHelpers.drawLine(context, 460 + i * 230, 0, 460 + i * 230, 50, canvasHelpers.widthBig, colorLine, true, canvasHelpers.dashLengthBig);
            }
            if (this.props.treeData.children.length > 1 && this.props.treeData.child_has_sons[1]) {
                canvasHelpers.drawLine(context, 690, 0, 690, 50, canvasHelpers.widthBig, colorLine, true, canvasHelpers.dashLengthBig);
            }
        }
    }

    
    renderBigScaleTree() {
        var brothers = this.props.treeData.brothers ?? []
        var wifes = this.props.treeData.wifes ?? []
        var wifesVisibility = wifes.length === 0 ? "hidden" : ""
        var children = this.props.treeData.children ?? []
        var childrenVisibility = children.length === 0 ? "hidden" : ""

        return (
            <div id="BlockPartTree">
                <Canvas width={1025} height={100} id="canvas5" draw={(context) => this.drawCanvas5(context)}/>

                {
                    this.props.treeData.parent_1 &&
                    <div id="blood-parentOne-LittleTree" className="LittleTreePerson-container" data-value="">
                        <PersonData data={(this.props.treeData.parent_1)} mainPersonId={this.props.mainPersonId} 
                            realMainPersonId={this.props.realMainPersonId} 
                            doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                            handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                            handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}
                            isBigTree={this.props.bigScale}/>
                    </div>
                }
                {
                    !this.props.treeData.parent_1 &&
                    <NewPerson id="blood-parentOne-LittleTree" 
                        addPersonCallback={(name, surname, middlename, date, gender) => 
                            this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.state.mainId, this.state.wifeId, 1)}/>
                }
                {
                    this.props.treeData.parent_2 &&
                    <div id="blood-parentTwo-LittleTree" className="LittleTreePerson-container" data-value="">
                        <PersonData data={(this.props.treeData.parent_2)} mainPersonId={this.props.mainPersonId} 
                            realMainPersonId={this.props.realMainPersonId} 
                            doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                            handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                            handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}
                            isBigTree={this.props.bigScale}/>
                    </div>
                }
                {
                    !this.props.treeData.parent_2 &&
                    <NewPerson id="blood-parentTwo-LittleTree" 
                        addPersonCallback={(name, surname, middlename, date, gender) => 
                            this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.state.mainId, this.state.wifeId, 2)}/>
                }

                <Canvas width={1025} height={200} id="canvas6" draw={(context) => this.drawCanvas6(context)}/>
                
                <div>
                    <div id="brothers-LittleTree">
                        <AddPerson id="addBrother-LittleTree" isBigTree={this.props.bigScale} 
                            addPersonCallback={(name, surname, middlename, date, gender) => this.addPersonCallback(name, surname, middlename, date, gender)}/>
                        <SliderItems 
                            items={[this.props.treeData.mainPerson, ...brothers]} 
                            doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                            handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                            handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}
                            mainPersonId={this.props.mainPersonId} 
                            realMainPersonId={this.props.realMainPersonId}
                            size={200}
                            margin={30}
                            count={2}
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Sibling, this.state.mainId, this.state.wifeId)}
                            isBigTree={this.props.bigScale}/>
                    </div>

                    <div id="wifes-LittleTree">

                        <SliderItems 
                            items={wifes} 
                            additionalId="SliderWifes"
                            doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                            handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                            handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}
                            handleChange={(mainPersonId, wifeId) => this.wifeChangeHandle(mainPersonId, wifeId)}
                            mainPersonId={this.props.mainPersonId} 
                            realMainPersonId={this.props.realMainPersonId}
                            size={200}
                            margin={30}
                            leftOne={0}
                            count={1}
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Lover, this.state.mainId, this.state.wifeId)}
                            isBigTree={this.props.bigScale}
                            no_left />

                        <AddPerson id="addWife-LittleTree" visibility={wifesVisibility}  isBigTree={this.props.bigScale}
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Lover, this.state.mainId, this.state.wifeId)}/>
                    </div>
                </div>

                <Canvas width={1025} height={200} id="canvas7" draw={(context) => this.drawCanvas7(context)}/>
                
                <div>
                    <div id="sons-LittleTree">
                        <SliderItems 
                            items={children} 
                            doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                            handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                            handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}
                            handleChange={(mainPersonId, wifeId) => {}}
                            mainPersonId={this.props.mainPersonId} 
                            realMainPersonId={this.props.realMainPersonId}
                            leftOne={230}
                            size={200}
                            margin={30}
                            count={2}
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Child, this.state.mainId, this.state.wifeId)}
                            isBigTree={this.props.bigScale}/>

                        <AddPerson id="AddSon-LittleTree" visibility={childrenVisibility} isBigTree={this.props.bigScale}
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Child, this.state.mainId, this.state.wifeId)}/>
                </div>
                <Canvas width={1025} height={100} id="canvas8" draw={(context) => this.drawCanvas8(context)}/>
            </div>
        </div>
        )
    }

    renderTree() {
        var brothers = this.props.treeData.brothers ?? []
        var wifes = this.props.treeData.wifes ?? []
        var wifesVisibility = wifes.length === 0 ? "hidden" : ""
        var children = this.props.treeData.children ?? []
        var childrenVisibility = children.length === 0 ? "hidden" : ""
 
        return (
            <div id="BlockFullTree">
                <Canvas width={1150} height={50} id="canvas0" draw={(context) => this.drawCanvas0(context)}/>
                {/* GRANDS */}
                <div>
                    { 
                        this.props.treeData.parent_1 &&
                        <div style={{marginLeft: 0}}>
                            {
                                this.props.treeData.grand_1_1 &&
                                <div id="blood-grandOne" className="person-container grand" data-value="">
                                    <PersonData data={(this.props.treeData.grand_1_1)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId}
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.grand_1_1 &&
                                <NewPerson id="blood-grandOne" additionalClassName="grand"
                                    addPersonCallback={(name, surname, middlename, date, gender) => 
                                        this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.props.treeData.parent_1.id, this.state.wifeId, 1)}/>
                            }
                            {
                                this.props.treeData.grand_1_2 &&
                                <div id="blood-grandTwo" className="person-container grand" data-value="">
                                    <PersonData data={(this.props.treeData.grand_1_2)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId} 
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.grand_1_2 &&
                                <NewPerson id="blood-grandTwo" additionalClassName="grand" 
                                    addPersonCallback={(name, surname, middlename, date, gender) => 
                                        this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.props.treeData.parent_1.id, this.state.wifeId, 2)}/>
                            }
                        </div>
                    }
                    {
                        this.props.treeData.parent_2 &&
                        <div style={{marginLeft: 300}}>
                            {
                                this.props.treeData.grand_2_1 &&
                                <div id="blood-grandThree" className="person-container grand" data-value="">
                                    <PersonData data={(this.props.treeData.grand_2_1)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId} 
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.grand_2_1 &&
                                <NewPerson id="blood-grandThree" additionalClassName="grand"
                                    addPersonCallback={(name, surname, middlename, date, gender) => 
                                        this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.props.treeData.parent_2.id, this.state.wifeId, 1)}/>
                            }
                            {
                                this.props.treeData.grand_2_2    &&
                                <div id="blood-grandFour" className="person-container grand" data-value="">
                                    <PersonData data={(this.props.treeData.grand_2_2)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId} 
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.grand_2_2 &&
                                <NewPerson id="blood-grandFour" additionalClassName="grand"
                                    addPersonCallback={(name, surname, middlename, date, gender) => 
                                        this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.props.treeData.parent_2.id, this.state.wifeId, 2)}/>
                            }
                        </div>
                    }
                    {
                        this.props.treeData.parent_W_1 &&
                        <div style={{marginLeft: 600}}>
                            {
                                this.props.treeData.grand_W_1_1 &&
                                <div id="grandOne" className="person-container grand" data-value="">
                                    <PersonData data={(this.props.treeData.grand_W_1_1)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId} 
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.grand_W_1_1 &&
                                <NewPerson id="grandOne" additionalClassName="grand" 
                                    addPersonCallback={(name, surname, middlename, date, gender) => 
                                        this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.props.treeData.parent_W_1.id, this.state.wifeId, 1)}/>
                            }
                            {
                                this.props.treeData.grand_W_1_2 &&
                                <div id="grandTwo" className="person-container grand" data-value="">
                                    <PersonData data={(this.props.treeData.grand_W_1_2)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId} 
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.grand_W_1_2 &&
                                <NewPerson id="grandTwo" additionalClassName="grand" 
                                    addPersonCallback={(name, surname, middlename, date, gender) => 
                                        this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.props.treeData.parent_W_1.id, this.state.wifeId, 2)}/>
                            }
                        </div>
                    }
                    {
                        this.props.treeData.parent_W_2 &&
                        <div style={{marginLeft: 900}}>
                            {
                                this.props.treeData.grand_W_2_1 &&
                                <div id="grandThree" className="person-container grand" data-value="">
                                    <PersonData data={(this.props.treeData.grand_W_2_1)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId} 
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.grand_W_2_1 &&
                                <NewPerson id="grandThree" additionalClassName="grand" 
                                    addPersonCallback={(name, surname, middlename, date, gender) => 
                                        this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.props.treeData.parent_W_2.id, this.state.wifeId, 1)}/>
                            }
                            {
                                this.props.treeData.grand_W_2_2 &&
                                <div id="grandFour" className="person-container" data-value="">
                                    <PersonData data={(this.props.treeData.grand_W_2_2)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId} 
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.grand_W_2_2 &&
                                <NewPerson id="grandFour" additionalClassName="grand" 
                                addPersonCallback={(name, surname, middlename, date, gender) => 
                                    this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.props.treeData.parent_W_2.id, this.state.wifeId, 2)}/>

                            }
                        </div>
                    }
                </div>
                <Canvas width={1150} height={100} id="canvas1" draw={(context) => this.drawCanvas1(context)}/>
                {/* PARENTS */}
                <div>
                    {
                        this.props.treeData.parent_1 &&
                        <div id="blood-parentOne" className="person-container" data-value="">
                            <PersonData data={(this.props.treeData.parent_1)} mainPersonId={this.props.mainPersonId} 
                                realMainPersonId={this.props.realMainPersonId} 
                                doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                        </div>
                    }
                    {
                        !this.props.treeData.parent_1 &&
                        <NewPerson id="blood-parentOne"
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.state.mainId, this.state.wifeId, 1)}/>
                    }
                    {
                        this.props.treeData.parent_2 &&
                        <div id="blood-parentTwo" className="person-container" data-value="">
                            <PersonData data={(this.props.treeData.parent_2)} mainPersonId={this.props.mainPersonId} 
                                realMainPersonId={this.props.realMainPersonId} 
                                doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                        </div>
                    }
                    {
                        !this.props.treeData.parent_2 &&
                        <NewPerson id="blood-parentTwo" 
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.state.mainId, this.state.wifeId, 2)}/>
                    }
                    {
                        wifes?.length > 0 &&
                        <>
                            {
                                this.props.treeData.parent_W_1 &&
                                <div id="parentOne" className="person-container" data-value="">
                                    <PersonData data={(this.props.treeData.parent_W_1)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId} 
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.parent_W_1 &&
                                <NewPerson id="parentOne"
                                    addPersonCallback={(name, surname, middlename, date, gender) => 
                                        this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.state.wifeId, this.state.wifeId, 1)}/>
                            }
                            {
                                this.props.treeData.parent_W_2 &&
                                <div id="parentTwo" className="person-container" data-value="">
                                    <PersonData data={(this.props.treeData.parent_W_2)} mainPersonId={this.props.mainPersonId} 
                                        realMainPersonId={this.props.realMainPersonId} 
                                        doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                        handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                        handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                                </div>
                            }
                            {
                                !this.props.treeData.parent_W_2 &&
                                <NewPerson id="parentTwo"
                                    addPersonCallback={(name, surname, middlename, date, gender) => 
                                        this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Parent, this.state.wifeId, this.state.wifeId, 2)}/>
                            }
                        </>
                    }
                </div>
                <Canvas width={1150} height={100} id="canvas2" draw={(context) => this.drawCanvas2(context)} />
                {/* ALL OTHER */}
                <div>
                    {/* BROTHERS */}
                    <div id="brothers">
                        <SliderItems 
                            items={[this.props.treeData.mainPerson, ...brothers]} 
                            doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                            handleChange={(mainPersonId, wifeId) => {}}
                            handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                            handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}
                            mainPersonId={this.props.mainPersonId} 
                            realMainPersonId={this.props.realMainPersonId}
                            size={100}
                            margin={10}
                            count={3}
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Sibling, this.state.mainId, this.state.wifeId)}/>

                            
                        <AddPerson id="blood-newBrother"
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Sibling, this.state.mainId, this.state.wifeId)}/>
                    </div>
                    {/* WIFES */}
                    <div id="wifes">
                        <AddPerson id="blood-newWife" visibility={wifesVisibility} 
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Lover, this.state.mainId, this.state.wifeId)} />
                        <SliderItems 
                            items={wifes} 
                            doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                            handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                            handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}
                            handleChange={(mainPersonId, wifeId) => this.wifeChangeHandle(mainPersonId, wifeId)}
                            mainPersonId={this.props.mainPersonId} 
                            realMainPersonId={this.props.realMainPersonId}
                            size={100}
                            margin={126}
                            leftOne={0}
                            count={2}
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Lover, this.state.mainId, this.state.wifeId)}
                            no_left />
                    </div>
                </div>
                <Canvas width={1150} height={120} id="canvas3" draw={(context) => this.drawCanvas3(context)} />
                {/* SONS */}
                <div>
                    <div id="sons">
                        <SliderItems 
                            items={children} 
                            doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                            handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                            handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}
                            handleChange={(mainPersonId, wifeId, index) => this.handleSonsRotate(index)}
                            mainPersonId={this.props.mainPersonId} 
                            realMainPersonId={this.props.realMainPersonId}
                            leftOne={220}
                            size={100}
                            margin={10}
                            count={3}
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Child, this.state.mainId, this.state.wifeId)}   />
                        <AddPerson id="blood-newSon" visibility={childrenVisibility} 
                            addPersonCallback={(name, surname, middlename, date, gender) => 
                                this.addPersonCallback(name, surname, middlename, date, gender, PersonRelationTypes.Child, this.state.mainId, this.state.wifeId)} />
                    </div>
                    {
                        this.props.treeData.childWife_2 &&
                        <div id="sonAnotherWife" className="person-container" data-toggle="modal" data-target="#myModal" data-value="">
                            <PersonData data={(this.props.treeData.childWife_2)} mainPersonId={this.props.mainPersonId} 
                                realMainPersonId={this.props.realMainPersonId}
                                doubleClickHandle={(data, isMain) => this.doubleClickHandle(data, isMain)}
                                handleUpdateMainPerson={(personId) => this.props.handleUpdateMainPerson(personId)}
                                handleDeletePerson={(personId) => this.props.handleDeletePerson(personId)}/>
                        </div>
                    }
                </div>
                <Canvas width={1150} height={50} id="canvas4" draw={(context) => this.drawCanvas4(context)}  />
            </div>
        )
    }

    render() {
        return (
            <div>
                <div id="main-tree-block">
                    <div id="Buttons">
                        <div id="show-main-person-button" className="btn btn-my-outline-primary" onClick={() => this.goToMain()}>
                            Перейти к главной персоне
                        </div>
                        <div id="BloodTree" className="btn btn-my-outline-danger" onClick={() => this.toggleBlood()}>
                            Кровное родство
                        </div>
                        <div id="ScaleTree" className="btn btn-my-outline-primary" onClick={() => this.toggleTreeScale()}>
                            {this.props.bigScale ? "Уменьшить масштаб" : "Увеличить масштаб"}
                        </div>
                        <div id="ShareTree" className="btn btn-my-new-outline-primary" onClick={() => this.openShareModal()}>
                            Поделиться деревом
                        </div>
                    </div>
                    {
                        !this.props.bigScale &&
                        this.renderTree()
                    }
                    {
                        this.props.bigScale &&
                        this.renderBigScaleTree()
                    }
                </div>
                <ShareTreeModal 
                    isOpen={this.state.shareModalOpen} 
                    handleClose={() => this.closeShareModal()}
                    shareTreeCallback={(username) => this.props.shareTreeCallback(username)}/>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        bigScale: getIsBigScale(state),
    }
}

const mapDispatchToProps = {
    setBigScale,
    removeBigScale,
    hideAppLoader, 
    showAppLoader
}

export default connect(mapStateToProps, mapDispatchToProps)(TreeStructure)
