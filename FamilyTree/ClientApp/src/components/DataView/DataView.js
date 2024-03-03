import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import moment from 'moment'
import authService from '../api-authorization/AuthorizeService'
import { changePageName } from '../../reducers/pageName.actions'
import { getLoadingState } from '../../reducers/application.selectors'
import { MediaHolder } from './MediaHolder'
import { AddFileModal } from './AddFileModal';
import { EditModal } from './EditModal';
import { PrivacyModal } from './PrivacyModal';
import { AddDataBlockModal } from './AddDataBlockModal';
import { AddCategoryModal } from './AddCategoryModal';
import { MediaModal } from './MediaModal';
import { DropdownComponent } from '../Shared/Dropdown'
import { hideAppLoader, showAppLoader } from '../../reducers/application.actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faClipboard, 
    faTrash, 
    faPencil, 
    faArrowLeft, 
    faPlus,
    faCheckSquare,
    faClipboardCheck,
    faLock
} from '@fortawesome/free-solid-svg-icons'
import "./DataView.css"

export class DataViewComponent extends Component {
    static displayName = DataViewComponent.name;

    constructor(props) {
        super(props);
        this.state = { 
            data: [],
            personId: null,
            currentCategory: null,
            currentSubCategory: 1,
            currentDataBlock: null,
            categoryData: {},
            image: [],
            video: [],
            audio: [],
            holderData: [],
            imageSelected: [],
            videoSelected: [],
            audioSelected: [],
            selectedHolders: [],
            selectedCategories: [],
            selectedBlocks: [],
            redirect: false,
            addFileModalOpen: false,
            viewFileModalOpen: false,
            editModalOpen: false,
            currentMedia: null,
            editDataItem: null,
            editDataType: null,
            editNameType: null,
            privateModalOpen: false,
            privateDataItem: null,
            addDataBlockModalOpen: false,
            addCategoryModalOpen: false,
            mediaModalOpen: false,
            mediaIndex: null,
            mediaCount: null,
            mediaModalId: null
        };
    }

    copyObjectSessionStorageKey = "COPY_OBJECT";

    copyTypes = {
        DataCategory: 0,
        DataBlock: 1,
        DataHolder: 2,
        Image: 3,
        Video: 4,
        Audio: 5,
    }

    types = {
        DataHolder: 0,
        DataBlock: 1,
        DataCategory: 2,
    }

    subCategories = {
        Data: 1,
        Image: 2,
        Video: 3,
        Audio: 4,
    }

    privacyLevels = {
        TopSecret: 0,
        Confidential: 1,
        InternalUse: 2,
        PublicUse: 3
    };

    dataHolderTypes = {
        Text: 0,
        TextArea: 1,
        Date: 2,
        Time: 3,
        DateTime: 4,
        Name: 5,
        Surname: 6,
        MiddleName: 7,
        Birthday: 8,
        Gender: 9
    }

    componentDidMount() {
        var title = "Данные пользователя"
        window.title = title


        var id = this.props.match.params.personId
        this.setState({personId: id})


        this.props.showAppLoader()

        this.props.changePageName(title)
        this.populatePersonData();
    }

    handleCategoryChange(categoryId) {
        this.props.showAppLoader()
        this.setState({
            currentCategory: categoryId,
            currentSubCategory: 1,
            imageSelected: [],
            videoSelected: [],
            audioSelected: [],
            selectedHolders: [],
            selectedBlocks: [],
        })

        this.getCategoryData()
    }

    handleSubCategoryChange(subCategory) {
        var data = this.state.categoryData.dataBlocks.find((el) => {
            if (el.id === this.state.currentDataBlock) 
                return el
        }, this)

        if (!data) {
            data = []
        }

        this.setState({
            currentSubCategory: subCategory,
            imageSelected: new Array(this.state.image.length).fill(false),
            videoSelected: new Array(this.state.video.length).fill(false),
            audioSelected: new Array(this.state.audio.length).fill(false),
            selectedHolders: new Array(this.state.holderData.length).fill(false),
            selectedBlocks: new Array(data.length).fill(false)
        })
    }

    handleDataBlockClick(dataBlockId) {
        this.changeCurrentDataBlock(dataBlockId)
    }

    handleDataBlockSelect(e, index) {
        e.stopPropagation()

        var values = this.state.selectedBlocks
        values[index] = e.target.checked
        this.setState({
            selectedBlocks: values
        })
    }

    goBackHistory() {
        window.location.replace(window.location.origin);
    }

    handleHolderDataChange(e, index) {
        var values = this.state.holderData
        values[index] = e.target.value
        this.setState({
            holderData: values
        })
    }

    async changeCurrentDataBlock(dataBlock, backupCategoryData = null) {
        var values = []
        var audios = []
        var videos = []
        var images = []
        var selectedHolders = []
        var audiosSelected = []
        var videosSelected = []
        var imagesSelected = []

        var searchEl = backupCategoryData ? backupCategoryData : this.state.categoryData

        var data = searchEl.dataBlocks.find((el) => {
            if (el.id === dataBlock) 
                return el
        }, this)

        if (data) {
            data.dataHolders.map((item) => {
                values.push(item.data)
            })

            audios = await this.getMedia(dataBlock, this.subCategories.Audio)
            videos = await this.getMedia(dataBlock, this.subCategories.Video)
            images = await this.getMedia(dataBlock, this.subCategories.Image)
            
            selectedHolders = new Array(values.length).fill(false)
            audiosSelected = new Array(audios.length).fill(false)
            videosSelected = new Array(videos.length).fill(false)
            imagesSelected = new Array(images.length).fill(false)
        }

        this.setState({
            currentDataBlock: dataBlock,
            holderData: values,
            audio: audios,
            video: videos,
            image: images,
            audioSelected: audiosSelected,
            videoSelected: videosSelected,
            imageSelected: imagesSelected,
            selectedHolders: selectedHolders
        })
    }

    async saveDataHolderChanges() {
        this.props.showAppLoader()

        var data = this.state.categoryData.dataBlocks.find((el) => {
            if (el.id === this.state.currentDataBlock) 
                return el
        }, this)

        if (!data) {
            return
        }

        await Promise.all(data.dataHolders.map(async (item, index) => {
            if (this.state.holderData[index] !== item.data) {
                await this.saveDataHolderData(item.id, this.state.holderData[index])
            }
        }))

        this.props.hideAppLoader()
        
    }

    renderData() {
        var data = this.state.categoryData.dataBlocks.find((el) => {
            if (el.id === this.state.currentDataBlock) 
                return el
        }, this)

        if (!data) {
            return
        }

        return (
            <>
            {
                data.dataHolders.map((item, index) => {
                    var dataHolder = this.renderDataHolder(item, index)
                    return (
                        <>
                            {dataHolder}
                        </>
                    )
                })
            }
            </>
        )
    }

    renderDataHolder(dataHolder, index) {
        var dataHolderElement = null
        switch (dataHolder.dataHolderType) {
            case this.dataHolderTypes.Text:
            case this.dataHolderTypes.Name:
            case this.dataHolderTypes.Surname:
            case this.dataHolderTypes.MiddleName: {
                dataHolderElement = this.CreateTextDataHolderElement(dataHolder, index);
                break;
            }        
            case this.dataHolderTypes.TextArea: {
                dataHolderElement = this.CreateTextAreaDataHolderElement(dataHolder, index);
                break;
            }
            case this.dataHolderTypes.Date:
            case this.dataHolderTypes.Birthday: {
                dataHolderElement = this.CreateDateDataHolderElement(dataHolder, index);
                break;
            }
            case this.dataHolderTypes.DateTime : {
                dataHolderElement = this.CreateDateTimeDataHolderElement(dataHolder, index);
                break;
            }
            case this.dataHolderTypes.Time : {
                dataHolderElement = this.CreateTimeDataHolderElement(dataHolder,  index);
                break;
            }
            case this.dataHolderTypes.Gender: {
                dataHolderElement = this.CreateGenderDataHolderElement(dataHolder, index);
                break;
            }
            default:
                return;
        }
        return dataHolderElement
    }

    handleDataHolderSelect(e, index) {
        var values = this.state.selectedHolders
        values[index] = e.target.checked
        this.setState({
            selectedHolders: values
        })
    }

    CreateDataHolderSelectorElement(index, replaceClassName = "", replacedClassName = "") {
        var selectorClassName = "data-holder__selector"
        if (replaceClassName) {
            selectorClassName = selectorClassName.replace(replaceClassName, replacedClassName)
        }
        return (
            <div className={selectorClassName}>
                <div className="checkbox checkbox-box">
                    <input type="checkbox" checked={this.state.selectedHolders[index]} onChange={(e) => this.handleDataHolderSelect(e, index)}></input>
                </div>
            </div>
        )
    }
    
    CreateDataHolderPrivacyElement(dataHolder, replaceClassName = "", replacedClassName = "") {
        var conClassName = ""
        var title = "";
        if (dataHolder.privacy == null) {
            title = "Личный";
            conClassName = "privacy-confidential";
        }
        else {
            switch (dataHolder.privacy.privacyLevel) {
                case this.privacyLevels.Confidential: {
                    title = "Личный";
                    conClassName = "privacy-confidential";
                    break;
                }
    
                case this.privacyLevels.InternalUse: {
                    title = "Внутренний";
                    conClassName = "privacy-internal-use";
                    break;
                }
    
                case this.privacyLevels.PublicUse: {
                    title = "Публичный";
                    conClassName = "privacy-public-use";
                    break;
                }
    
                case this.privacyLevels.TopSecret: {
                    title = "Строго сикретно";
                    conClassName = "privacy-top-secret";
                    break;
                }
    
                default:
                    break;
            }
        }

        var fullClassName = "data-holder__privacy" + " " + conClassName
        if (replaceClassName) {
            fullClassName = fullClassName.replace(replaceClassName, replacedClassName)
        }
        return (
            <div className={fullClassName} data-toggle="tooltip" data-placement="right" title={title}></div>
        )
    }
    
    CreateTextDataHolderElement(dataHolder, index) {
        return (
            <div className="data-holders__item data-holder">
                {this.CreateDataHolderSelectorElement(index)}
                <div className="data-holder__title">
                    <div>
                        {dataHolder.title}
                    </div>
                </div>
                <div className="data-holder__data">
                    <input type="text" value={this.state.holderData[index]} onChange={(e) => this.handleHolderDataChange(e, index)}></input>
                </div>
                {this.CreateDataHolderPrivacyElement(dataHolder)}
            </div>
        )
    }
    
    CreateTextAreaDataHolderElement(dataHolder, index) {
        return (
            <div className="data-holders__item data-holder-textarea">
                {this.CreateDataHolderSelectorElement(index, "data-holder__selector", "data-holder-textarea__selector")}
                <div className="data-holder-textarea__title">
                    <div>
                        {dataHolder.title}
                    </div>
                </div>
                {this.CreateDataHolderPrivacyElement(dataHolder, "data-holder__privacy", "data-holder-textarea__privacy")}
                <div className="data-holder-textarea__data">
                    <textarea value={this.state.holderData[index]}  onChange={(e) => this.handleHolderDataChange(e, index)} rows={6}>
                    
                    </textarea>
                </div>
            </div>
        )
    }
    
    CreateDateDataHolderElement(dataHolder, index) {
        var dateValue = ""
        if (this.state.holderData[index] === "") {
            dateValue = null;
        }
        else {
            let tmpdate = moment(this.state.holderData[index], "DD/MM/YYYY")
            if (!tmpdate.isValid()) {
                tmpdate = moment(this.state.holderData[index], "YYYY/MM/DD")
            }
    
            dateValue = tmpdate.format("YYYY-MM-DD")
        }

        return (
            <div className="data-holders__item data-holder">
                {this.CreateDataHolderSelectorElement(index)}
                <div className="data-holder__title">
                    <div>
                        {dataHolder.title}
                    </div>
                </div>
                <div className="data-holder__data">
                    <input type="date" value={dateValue} onChange={(e) => this.handleHolderDataChange(e, index)}></input>
                </div>
                {this.CreateDataHolderPrivacyElement(dataHolder)}
            </div>
        )
    }
    
    CreateDateTimeDataHolderElement(dataHolder, index) {
        return (
            <div className="data-holders__item data-holder">
                {this.CreateDataHolderSelectorElement(index)}
                <div className="data-holder__title">
                    <div>
                        {dataHolder.title}
                    </div>
                </div>
                <div className="data-holder__data">
                    <input type="datetime-local" value={this.state.holderData[index]} onChange={(e) => this.handleHolderDataChange(e, index)}></input>
                </div>
                {this.CreateDataHolderPrivacyElement(dataHolder)}
            </div>
        )
    }
    
    CreateTimeDataHolderElement(dataHolder, index) {
        return (
            <div className="data-holders__item data-holder">
                {this.CreateDataHolderSelectorElement(index)}
                <div className="data-holder__title">
                    <div>
                        {dataHolder.title}
                    </div>
                </div>
                <div className="data-holder__data">
                    <input type="time" value={this.state.holderData[index]} onChange={(e) => this.handleHolderDataChange(e, index)}></input>
                </div>
                {this.CreateDataHolderPrivacyElement(dataHolder)}
            </div>
        )
    }
    
    CreateGenderDataHolderElement(dataHolder, index) {
        var gender = this.state.holderData[index]
        return (
            <div className="data-holders__item data-holder-gender">
                {this.CreateDataHolderSelectorElement(index, "data-holder__selector", "data-holder-gender__selector")}
                <div className="data-holder-gender__title">
                    <div>
                        {dataHolder.title}
                    </div>
                </div>
                <div className="data-holder-gender__data gender-checkbox-box">
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <label className={"btn btn-default" + (gender === "Male" ? " active" : "")}>
                            <input type="radio" name="person-gender" value="Male" checked={gender === "Male"} onChange={(e) => this.handleHolderDataChange(e, index)}></input>
                            Мужчина
                        </label>
                        <label className={"btn btn-default" + (gender === "Female" ? " active" : "")}>
                            <input type="radio" name="person-gender" value="Female" checked={gender === "Female"} onChange={(e) => this.handleHolderDataChange(e, index)}></input>
                            Женщина
                        </label>
                        <label className={"btn btn-default" + (gender === "Unknown" ? " active" : "")}>
                            <input type="radio" name="person-gender" value="Unknown" checked={gender === "Unknown"} onChange={(e) => this.handleHolderDataChange(e, index)}></input>
                            Неизвестно
                        </label>
                    </div>
                </div>
                {this.CreateDataHolderPrivacyElement(dataHolder, "data-holder__privacy", "data-holder-gender__privacy")}
            </div>
        )
    }

    handleCategorySelection (e, index) {
        e.stopPropagation()
        
        var values = this.state.selectedCategories
        values[index] = e.target.checked

        this.setState({
            selectedCategories: values
        })
    }

    openAddFileModal() {
        this.setState({
            addFileModalOpen: true
        })
    }

    handleAddFileClose() {
        this.setState({
            addFileModalOpen: false
        }) 
    }

    addFileCallback(name, desc, file) {
        this.handleAddFileClose()
        this.props.showAppLoader()
        this.addFile(name, desc, file)
    }

    addFieldCallback(name, type) {
        this.handleAddFileClose()
        this.props.showAppLoader()
        this.addField(name, type)
    }

    handleMediaCheckbox(e, index) {
        e.stopPropagation()

        switch (this.state.currentSubCategory) {
            case this.subCategories.Data:
                var data = this.state.categoryData.dataBlocks.find((el) => {
                    if (el.id === this.state.currentDataBlock) 
                        return el
                }, this)
        
                if (!data) {
                    return
                }
                var values = this.state.selectedHolders
                values[index] = e.target.checked
                this.setState({
                    selectedHolders: values
                })
                break;

            case this.subCategories.Audio:
                var values = this.state.audioSelected
                values[index] = e.target.checked
                this.setState({
                    audioSelected: values
                })
                break;

            case this.subCategories.Video:
                var values = this.state.videoSelected
                values[index] = e.target.checked
                this.setState({
                    videoSelected: values
                })
                break;

            case this.subCategories.Image:
                var values = this.state.imageSelected
                values[index] = e.target.checked
                this.setState({
                    imageSelected: values
                })
                break;
            default:
                break;
        }

        console.log(index)
    }

    handleMediaClick(item) {
        var index = 0
        var mediaCount = 0
        var mediaModalId = ""
        switch (this.state.currentSubCategory) {
            case this.subCategories.Audio:
                index = this.state.audio.indexOf(item)
                mediaCount = this.state.audio.length
                mediaModalId = "audio-modal"
                break;
            case this.subCategories.Video:
                index = this.state.video.indexOf(item)
                mediaCount = this.state.video.length
                mediaModalId = "video-modal"
                break;
            case this.subCategories.Image:
                index = this.state.image.indexOf(item)
                mediaCount = this.state.image.length
                mediaModalId = "image-carousel-modal"
                break;
            default:
                break;
        }

        this.setState({
            currentMedia: item,
            mediaModalOpen: true,
            mediaIndex: index,
            mediaCount: mediaCount,
            mediaModalId: mediaModalId
        })
        console.log("item click", item)
    }

    closeMediaModal() {
        this.setState({
            mediaModalOpen: false
        })
    }

    selectAllElements(value = true) {
        switch (this.state.currentSubCategory) {
            case this.subCategories.Data:
                var data = this.state.categoryData.dataBlocks.find((el) => {
                    if (el.id === this.state.currentDataBlock) 
                        return el
                }, this)
        
                if (!data) {
                    return
                }
                var values = new Array(data.dataHolders.length).fill(value)
                if (value == null) {
                    values = this.state.selectedHolders.map(item => !item)
                }
                this.setState({
                    selectedHolders: values
                })
                break;

            case this.subCategories.Audio:
                var values = new Array(this.state.audio.length).fill(value)
                if (value == null) {
                    values = this.state.audioSelected.map(item => !item)
                }
                this.setState({
                    audioSelected: values
                })
                break;

            case this.subCategories.Video:
                var values = new Array(this.state.video.length).fill(value)
                if (value == null) {
                    values = this.state.videoSelected.map(item => !item)
                }
                this.setState({
                    videoSelected: values
                })
                break;

            case this.subCategories.Image:
                var values =  new Array(this.state.image.length).fill(value)
                if (value == null) {
                    values = this.state.imageSelected.map(item => !item)
                }
                this.setState({
                    imageSelected: values
                })
                break;
            default:
                break;
        }
    }

    renderMediaHolder(item, index, selectArr) {
        return (
            <MediaHolder 
                data={item}
                type={this.state.currentSubCategory}
                checkboxSelectCallback={(e) => this.handleMediaCheckbox(e, index)}
                clickCallback={() => this.handleMediaClick(item)}
                checked={selectArr[index]}
            />
        )
    }

    renderImages() {
        return (
            <>
            {
                this.state.image.map((item, index) => {
                    var imageHolder = this.renderMediaHolder(item, index, this.state.imageSelected)
                    return (
                        <>
                            {imageHolder}
                        </>
                    )
                })
            }
            </>
        )
    }

    renderVideos() {
        return (
            <>
            {
                this.state.video.map((item, index) => {
                    var videoHolder = this.renderMediaHolder(item, index, this.state.videoSelected)
                    return (
                        <>
                            {videoHolder}
                        </>
                    )
                })
            }
            </>
        )
    }

    renderAudios() {
        return (
            <>
            {
                this.state.audio.map((item, index) => {
                    var audioHolder = this.renderMediaHolder(item, index, this.state.audioSelected)
                    return (
                        <>
                            {audioHolder}
                        </>
                    )
                })
            }
            </>
        )
    }

    getSelectedItems(arr, arrBool) {
        return arr.filter((_, index) => arrBool[index])
    }

    editAnyData(dataType) {
        var arr = []
        var arrBool = []

        switch (dataType) {
            case this.types.DataHolder:
                var data = this.state.categoryData.dataBlocks.find((el) => {
                    if (el.id === this.state.currentDataBlock) 
                        return el
                }, this)
        
                if (!data) {
                    return
                }

                arr = data.dataHolders
                arrBool = this.state.selectedHolders
                break;
            
            case this.types.DataBlock:
                arr = this.state.categoryData.dataBlocks
                arrBool = this.state.selectedBlocks
                break;
        
            case this.types.DataCategory:
                arr = this.state.data
                arrBool = this.state.selectedCategories
                break;
            
            default:
                break;
        }
        var items = this.getSelectedItems(arr, arrBool)
        if (items.length === 0) {
            alert("Не выбраны данные")
            return
        }
        if (items.length > 1) {
            alert("Должен быть выбран только 1 элемент")
            return
        }

        var item = items[0]
        var name = ""
        var nameType = ""
        if (item.name) {
            name = item.name
            nameType = "Name"
        } else if (item.title) {
            name = item.title
            nameType = "Title"
        }
        var editItem = {
            id: item.id,
            name: item.name ?? item.title,
        }

        this.setState({
            editDataItem: editItem,
            editDataType: dataType,
            editNameType: nameType,
            editModalOpen: true
        })
    }

    handleEditClose() {
        this.setState({
            editModalOpen: false
        })
    }

    handlePrivate() {
        var arr = []
        var arrBool = []

        var data = this.state.categoryData.dataBlocks.find((el) => {
            if (el.id === this.state.currentDataBlock) 
                return el
        }, this)

        if (!data) {
            return
        }

        arr = data.dataHolders
        arrBool = this.state.selectedHolders

        var items = this.getSelectedItems(arr, arrBool)
        if (items.length === 0) {
            alert("Не выбраны данные")
            return
        }
        if (items.length > 1) {
            alert("Должен быть выбран только 1 элемент")
            return
        }

        var item = items[0]

        this.setState({
            privateDataItem: item.privacy,
            privateModalOpen: true
        })
    }

    handlePrivateClose() {
        this.setState({
            privateModalOpen: false,
            privateDataItem: null
        })
    }

    handleCopy(copyType) {
        var arr = []
        var arrBool = []

        switch (copyType) {
            case this.copyTypes.DataHolder:
                var data = this.state.categoryData.dataBlocks.find((el) => {
                    if (el.id === this.state.currentDataBlock) 
                        return el
                }, this)
        
                if (!data) {
                    return
                }

                arr = data.dataHolders
                arrBool = this.state.selectedHolders
                break;
            
            case this.copyTypes.DataBlock:
                arr = this.state.categoryData.dataBlocks
                arrBool = this.state.selectedBlocks
                break;
        
            case this.copyTypes.DataCategory:
                arr = this.state.data
                arrBool = this.state.selectedCategories
                break;
            
            case this.copyTypes.Audio:
                arr = this.state.audio
                arrBool = this.state.audioSelected
                break;

            case this.copyTypes.Video:
                arr = this.state.video
                arrBool = this.state.videoSelected
                break;

            case this.copyTypes.Image:
                arr = this.state.image
                arrBool = this.state.imageSelected
                break;

            default:
                break;
        }
        var ids = this.getSelectedItems(arr, arrBool).map((item) => item.id)

        var copyObject = {
            ids: ids,
            copyObjectType: copyType
        }
        sessionStorage.setItem(this.copyObjectSessionStorageKey, JSON.stringify(copyObject));
    }

    handlePaste(copyType) {
        var copyObject = JSON.parse(sessionStorage.getItem(this.copyObjectSessionStorageKey));

        if (copyObject == null || copyObject.ids.length === 0) {
            alert("Ошибка при вставке из буфера (неверный тип объектов)");
            return
        }

        if (copyObject.copyObjectType == null || copyObject.copyObjectType !== copyType) {
            alert("Ошибка при вставке из буфера (неверный тип объектов)");
            return;
        }

        this.pasteData(copyObject)
    }

    openAddDataBlockModal() {
        this.setState({
            addDataBlockModalOpen: true
        })
    }

    closeAddDataBlockModal() {
        this.setState({
            addDataBlockModalOpen: false
        })
    }

    openAddCategoryModal() {
        this.setState({
            addCategoryModalOpen: true
        })
    }

    closeAddCategoryModal() {
        this.setState({
            addCategoryModalOpen: false
        })
    }

    handleDelete(copyType) {
        var arr = []
        var arrBool = []

        switch (copyType) {
            case this.copyTypes.DataHolder:
                var data = this.state.categoryData.dataBlocks.find((el) => {
                    if (el.id === this.state.currentDataBlock) 
                        return el
                }, this)
        
                if (!data) {
                    return
                }

                arr = data.dataHolders
                arrBool = this.state.selectedHolders
                break;
            
            case this.copyTypes.DataBlock:
                arr = this.state.categoryData.dataBlocks
                arrBool = this.state.selectedBlocks
                break;
        
            case this.copyTypes.DataCategory:
                arr = this.state.data
                arrBool = this.state.selectedCategories
                break;
            
            case this.copyTypes.Audio:
                arr = this.state.audio
                arrBool = this.state.audioSelected
                break;

            case this.copyTypes.Video:
                arr = this.state.video
                arrBool = this.state.videoSelected
                break;

            case this.copyTypes.Image:
                arr = this.state.image
                arrBool = this.state.imageSelected
                break;

            default:
                break;
        }
        var items = this.getSelectedItems(arr, arrBool)

        if (this.copyTypes.DataHolder === copyType) {
            items = items.filter((item) => item.isDeletable)
        }

        var ids = items.map((item) => item.id)

        this.deleteItems(ids, copyType)
    }

    render () {
        return (
            <div>
                {
                    this.props.loading && <></>
                }
                {
                    this.state.redirect && <Redirect push to="/"/>
                }
                {
                    !this.props.loading && this.state.data &&
                    <div id="person-data-block" className="person-data-block">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="toolbox">
                                        <div className="toolbox_buttons">
                                            <div 
                                                id="back-to-tree-button" className="btn btn-default button-back" 
                                                data-toggle="tooltip" data-placement="top" title="Вернуться к дереву" 
                                                onClick={() => this.goBackHistory()}
                                            >
                                                <div className="button-back__img">
                                                    <FontAwesomeIcon icon={faArrowLeft} />
                                                </div>
                                            </div>
                                            <DropdownComponent 
                                                caretButton={
                                                    <button 
                                                        id="add-data-category-button" className="btn btn-default button-add" 
                                                        data-toggle="tooltip" data-placement="top" title="Добавить категорию" type="button"
                                                        onClick={() => this.openAddCategoryModal()} 
                                                    >
                                                        <div className="button-add__img">
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </div>
                                                    </button>
                                                }
                                                dropdownClassName="btn-group data-category-dropdown-buttons"
                                                toggleClassName="btn btn-default button-caret-down"
                                            >
                                                <div 
                                                    id="edit-data-category-button" className="dropdown-item" 
                                                    onClick={() => this.editAnyData(this.types.DataCategory)}
                                                >
                                                    Изменить
                                                </div>
                                                <div 
                                                    id="copy-data-category-button" className="dropdown-item" 
                                                    onClick={() => this.handleCopy(this.copyTypes.DataCategory)}
                                                >
                                                    Копировать
                                                </div>
                                                <div 
                                                    id="paste-data-category-button" className="dropdown-item"
                                                    onClick={() => this.handlePaste(this.copyTypes.DataCategory)}
                                                >
                                                    Вставить
                                                </div>
                                                <div 
                                                    id="delete-data-category-button" className="dropdown-item"
                                                    onClick={() => this.handleDelete(this.copyTypes.DataCategory)}
                                                >
                                                    Удалить
                                                </div>
                                            </DropdownComponent>
                                            <div className="toolbox__horizontal-separator"></div>
                                        </div>
                                    </div>
                                    <div className="data-categories person-data-block__data-categories">
                                        {
                                            this.state.data &&
                                            this.state.data.map((item, i) => {
                                                var dcClassName="data-categories__item"
                                                if (item.id === this.state.currentCategory) {
                                                    dcClassName += " data-categories__item_active"
                                                }
                                                return (
                                                    <div className={dcClassName} onClick={() => this.handleCategoryChange(item.id)} key={"data-categories_" + i}>
                                                        {item.name}
                                                        <div className="checkbox checkbox-box">
                                                            <input type="checkbox" onClick={(e) => this.handleCategorySelection(e, i)}></input>
                                                        </div>
                                                    </div>
                                                ) 
                                            })  
                                        }
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <div className="toolbox">
                                        <div className="toolbox_buttons">
                                            <DropdownComponent 
                                                caretButton={
                                                    <button 
                                                        id="select-all-button" type="button" 
                                                        className="btn btn-default button-select" 
                                                        data-toggle="tooltip" data-placement="top" title="Выделить всё"
                                                        onClick={() => this.selectAllElements()}
                                                    >
                                                        <div className="button-select__img">
                                                            <FontAwesomeIcon icon={faCheckSquare} />
                                                        </div>
                                                    </button>
                                                }
                                                dropdownClassName="btn-group"
                                                toggleClassName="btn btn-default button-caret-down"
                                            >
                                                <div id="deselect-all-button" className="dropdown-item" onClick={() => this.selectAllElements(false)}>Убрать выделение</div>
                                                <div id="invert-selection-button" className="dropdown-item" onClick={() => this.selectAllElements(null)}>Инвертировать выделение</div>
                                            </DropdownComponent>
                                            <div className="toolbox__vertical-separator"></div>
                                            <div 
                                                id="add-element-button" className="btn btn-default button-add" 
                                                data-toggle="tooltip" data-placement="top" title="Добавить" 
                                                onClick={() => {
                                                    if (this.state.currentDataBlock) {
                                                        this.openAddFileModal()
                                                    }
                                                    else {
                                                        this.openAddDataBlockModal()
                                                    }
                                                }}
                                            >
                                                <div className="button-add__img">
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </div>
                                            </div>
                                            {
                                                this.state.currentDataBlock && this.state.currentSubCategory === this.subCategories.Data &&
                                                <div 
                                                    id="edit-privacy-button" className="btn btn-default button-privacy" 
                                                    data-toggle="tooltip" data-placement="top" title="Приватность"
                                                    onClick={() => this.handlePrivate()}
                                                >
                                                    <div className="button-privacy__img">
                                                        <FontAwesomeIcon icon={faLock} />
                                                    </div>
                                                </div>
                                            }
                                            <div 
                                                id="copy-button" className="btn btn-default button-copy" 
                                                data-toggle="tooltip" data-placement="top" title="Копировать"
                                                onClick={() => {
                                                    var copyType = null
                                                    switch (this.state.currentSubCategory) {
                                                        case this.subCategories.Data:
                                                            copyType = this.copyTypes.DataHolder
                                                            break;
                                                        case this.subCategories.Video:
                                                            copyType = this.copyTypes.Video
                                                            break;
                                                        case this.subCategories.Audio:
                                                            copyType = this.copyTypes.Audio
                                                            break;
                                                        case this.subCategories.Image:
                                                            copyType = this.copyTypes.Image
                                                            break;
                                                
                                                        default:
                                                            break;
                                                    }
                                                    if (!this.state.currentDataBlock) {
                                                        copyType = this.copyTypes.DataBlock
                                                    }
                                                    this.handleCopy(copyType)
                                                }}
                                            >
                                                <div className="button-copy__img">
                                                    <FontAwesomeIcon icon={faClipboard} />
                                                </div>
                                            </div>
                                            <div 
                                                id="paste-button" className="btn btn-default button-paste" 
                                                data-toggle="tooltip" data-placement="top" title="Вставить"
                                                onClick={() => {
                                                    var copyType = null
                                                    switch (this.state.currentSubCategory) {
                                                        case this.subCategories.Data:
                                                            copyType = this.copyTypes.DataHolder
                                                            break;
                                                        case this.subCategories.Video:
                                                            copyType = this.copyTypes.Video
                                                            break;
                                                        case this.subCategories.Audio:
                                                            copyType = this.copyTypes.Audio
                                                            break;
                                                        case this.subCategories.Image:
                                                            copyType = this.copyTypes.Image
                                                            break;
                                                
                                                        default:
                                                            break;
                                                    }
                                                    if (!this.state.currentDataBlock) {
                                                        copyType = this.copyTypes.DataBlock
                                                    }
                                                    this.handlePaste(copyType)
                                                }}
                                            >
                                                <div className="button-paste__img">
                                                    <FontAwesomeIcon icon={faClipboardCheck} />
                                                </div>
                                            </div>
                                            {
                                                this.state.currentSubCategory === this.subCategories.Data &&
                                                <div 
                                                    id="edit-element-button" className="btn btn-default button-edit" 
                                                    data-toggle="tooltip" data-placement="top" title="Редактировать"
                                                    onClick={() => {
                                                        var type = null
                                                        if (this.state.currentDataBlock) {
                                                            type = this.types.DataHolder
                                                        }
                                                        else {
                                                            type = this.types.DataBlock
                                                        }
                                                        this.editAnyData(type)
                                                    }}
                                                >
                                                    <div className="button-edit__img">
                                                        <FontAwesomeIcon icon={faPencil} />
                                                    </div>
                                                </div>
                                            }
                                            <div 
                                                id="delete-button" className="btn btn-danger button-delete" 
                                                data-toggle="tooltip" data-placement="top" title="Удалить"
                                                onClick={() => {
                                                    var copyType = null
                                                    switch (this.state.currentSubCategory) {
                                                        case this.subCategories.Data:
                                                            copyType = this.copyTypes.DataHolder
                                                            break;
                                                        case this.subCategories.Video:
                                                            copyType = this.copyTypes.Video
                                                            break;
                                                        case this.subCategories.Audio:
                                                            copyType = this.copyTypes.Audio
                                                            break;
                                                        case this.subCategories.Image:
                                                            copyType = this.copyTypes.Image
                                                            break;
                                                
                                                        default:
                                                            break;
                                                    }
                                                    if (!this.state.currentDataBlock) {
                                                        copyType = this.copyTypes.DataBlock
                                                    }
                                                    this.handleDelete(copyType)
                                                }}
                                            >
                                                <div className="button-delete__img">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </div>
                                            </div>
                                            {
                                                this.state.currentDataBlock && this.state.currentSubCategory === this.subCategories.Data &&
                                                <div id="save-elements-button" className="btn button-save btn-success" onClick={() => this.saveDataHolderChanges()}>
                                                    <div className="btn__vertical-separator"></div>
                                                    <div className="btn__text">Сохранить</div>
                                                </div>
                                            }
                                            <div className="toolbox__horizontal-separator"></div>
                                        </div>                    
                                    </div>
                                    {
                                        this.state.categoryData && !this.state.currentDataBlock &&
                                        <div className="data-blocks person-data-block__data-blocks">
                                            {
                                                this.state.categoryData.dataBlocks &&
                                                this.state.categoryData.dataBlocks.map((item, i) => {
                                                    return (
                                                        <div className="data-blocks__item data-block">
                                                            <div className="data-block__header"></div>
                                                            <div className="data-block__body">
                                                                <div className="data-block__selector">
                                                                    <div className="checkbox">
                                                                        <input type="checkbox" checked={this.state.selectedBlocks[i]} onChange={(e) => this.handleDataBlockSelect(e, i)}/>
                                                                    </div>
                                                                </div>
                                                                <div className="data-block__content" onClick={() => this.handleDataBlockClick(item.id)}>
                                                                    <div className="data-block__item">
                                                                        <div className="data-block__title">{item.title}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="data-block__footer"></div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                    {
                                        this.state.categoryData && this.state.currentDataBlock &&
                                        <div className="data-block-content">
                                            <div className="tabs-containers data-block-content__tabs-containers">
                                                {
                                                    this.state.currentSubCategory === this.subCategories.Data &&
                                                    <div className="data-holders person-data-block__data-holders tab-container">
                                                        {this.renderData()}
                                                    </div>
                                                }
                                                {
                                                    this.state.currentSubCategory === this.subCategories.Image &&
                                                    <div className="images tab-container">
                                                        {this.renderImages()}
                                                    </div>
                                                }
                                                {
                                                    this.state.currentSubCategory === this.subCategories.Video &&
                                                    <div className="videos tab-container">
                                                        {this.renderVideos()}
                                                    </div>
                                                }
                                                {
                                                    this.state.currentSubCategory === this.subCategories.Audio &&
                                                    <div className="audios tab-container">
                                                        {this.renderAudios()}
                                                    </div>
                                                }
                                            </div>
                                        
                                            <div className="tabs-buttons data-block-content__tabs-buttons">
                                                <div className={"tabs-buttons__button tab-button-data" + (this.state.currentSubCategory === this.subCategories.Data ? " tabs-buttons__button_active" : "")}
                                                    onClick={() => this.handleSubCategoryChange(this.subCategories.Data)}
                                                >
                                                    Данные
                                                </div>
                                                <div className={"tabs-buttons__button tab-button-images" + (this.state.currentSubCategory === this.subCategories.Image ? " tabs-buttons__button_active" : "")}
                                                    onClick={() => this.handleSubCategoryChange(this.subCategories.Image)}
                                                >
                                                    Изображения
                                                </div>
                                                <div className={"tabs-buttons__button tab-button-videos" + (this.state.currentSubCategory === this.subCategories.Video ? " tabs-buttons__button_active" : "")}
                                                    onClick={() => this.handleSubCategoryChange(this.subCategories.Video)}
                                                >
                                                    Видео
                                                </div>
                                                <div className={"tabs-buttons__button tab-button-audios" + (this.state.currentSubCategory === this.subCategories.Audio ? " tabs-buttons__button_active" : "")}
                                                    onClick={() => this.handleSubCategoryChange(this.subCategories.Audio)}
                                                >
                                                    Аудио
                                                </div>
                                            </div>
                                        </div> 
                                    }             
                                </div>
                            </div>
                        </div>
                        <AddFileModal 
                            isOpen={this.state.addFileModalOpen} 
                            handleClose={() => this.handleAddFileClose()}
                            mediaType={this.state.currentSubCategory}
                            addFileCallback={(name, desc, file) => this.addFileCallback(name, desc, file)}
                            addFieldCallback={(name, type) => this.addFieldCallback(name, type)}
                        />

                        <EditModal 
                            isOpen={this.state.editModalOpen} 
                            handleClose={() => this.handleEditClose()}
                            editCallback={(name) => this.handleEditCallback(name)}
                            data={this.state.editDataItem}
                        />

                        <PrivacyModal 
                            isOpen={this.state.privateModalOpen} 
                            handleClose={() => this.handlePrivateClose()}
                            privacyCallback={(payload) => this.handlePrivacyCallback(payload)}
                            data={this.state.privateDataItem}
                        />

                        <AddDataBlockModal 
                            isOpen={this.state.addDataBlockModalOpen} 
                            handleClose={() => this.closeAddDataBlockModal()}
                            addDataBlockCallback={(name) => this.addDataBlockHandler(name)}
                        />
                        
                        <AddCategoryModal 
                            isOpen={this.state.addCategoryModalOpen} 
                            handleClose={() => this.closeAddCategoryModal()}
                            addCategoryCallback={(name, type) => this.addCaterogyHandler(name, type)}
                        />

                        <MediaModal 
                            isOpen={this.state.mediaModalOpen} 
                            handleClose={() => this.closeMediaModal()}
                            setAvatarCallback={(data) => this.setAvatarHandle(data)}
                            index={this.state.mediaIndex + 1}
                            mediaCount={this.state.mediaCount}
                            modalId={this.state.mediaModalId}
                            mediaType={this.state.currentSubCategory}
                            data={this.state.currentMedia}
                            images={this.state.image}
                        />
                    </div>
                }
            </div>
        );
    }

    async setAvatarHandle(data) {

    }

    async deleteItems(ids, type) {
        this.props.showAppLoader()

        await Promise.all(ids.map(async (id) => {
            var ok = await this.deleteItem(id, type)
            if (!ok) {
                alert("При удалении произошла ошибка")
            }
        }))
        switch (type) {
            case this.copyTypes.DataHolder:
            case this.copyTypes.DataBlock:
                await this.getCategoryData()
                break;            
            case this.copyTypes.DataCategory:
                await this.populatePersonData()
                break;
            case this.copyTypes.Audio:
            case this.copyTypes.Video:
            case this.copyTypes.Image:
                await this.changeCurrentDataBlock(this.state.currentDataBlock)
                break;
            default:
                break;
        }

        this.props.hideAppLoader()
    }

    async deleteItem(id, dataType) {
        const token = await authService.getAccessToken();

        var controller = ""
        switch (dataType) {
            case this.copyTypes.DataHolder:
            case this.copyTypes.DataBlock:            
            case this.copyTypes.DataCategory:
                controller = "PersonContent"
                break;
            case this.copyTypes.Audio:
            case this.copyTypes.Video:
            case this.copyTypes.Image:
                controller = "Media"
                break;
            default:
                break;
        }
        var type = ""
        switch (dataType) {
            case this.copyTypes.DataHolder:
                type = "DataHolder"
                break;
            case this.copyTypes.DataBlock:
                type = "DataBlock"  
                break;         
            case this.copyTypes.DataCategory:
                type = "DataCategory"
                break;
            case this.copyTypes.Audio:
                type = "Audio"
                break;
            case this.copyTypes.Video:
                type = "Video"
                break;
            case this.copyTypes.Image:
                type = "Image"
                break;
            default:
              break;
        }

        var link = `/${controller}/${type}/Delete/${id}`
        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}` },
            method: 'DELETE'
        });
        return result.ok
    }

    async addCaterogyHandler(name, type) {
        this.closeAddCategoryModal()
        this.props.showAppLoader()
        var ok = await this.addCaterogy(name, type)
        if (ok) {
            await this.populatePersonData()
        }
        this.props.hideAppLoader()
    }

    async addCaterogy(name, type) {
        const token = await authService.getAccessToken();
        var link = `/PersonContent/DataCategory/Create`
        var requestData = {
            Name: name,
            DataCategoryType: type,
            PersonId: this.state.personId
        };
        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(requestData)
        });

        return result.ok
    }
    
    async addDataBlockHandler(name) {
        this.closeAddDataBlockModal()
        this.props.showAppLoader()
        var ok = await this.addDataBlock(name)
        if (ok) {
            await this.getCategoryData() 
        }
        this.props.hideAppLoader()
    }

    async addDataBlock(name) {
        const token = await authService.getAccessToken();
        var link = `/PersonContent/DataBlock/Create`
        var requestData = {
            Title: name,
            DataCategoryId: this.state.currentCategory
        };
        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(requestData)
        });
        return result.ok
    }

    async pasteData(copyObject) {
        this.props.showAppLoader()
        var ok = await this.copyData(copyObject)
        if (ok) {
            switch (copyObject.copyObjectType) {
                case this.copyTypes.DataHolder:
                case this.copyTypes.DataBlock:
                    await this.getCategoryData()
                    break;            
                case this.copyTypes.DataCategory:
                    await this.populatePersonData()
                    break;
                case this.copyTypes.Audio:
                case this.copyTypes.Video:
                case this.copyTypes.Image:
                    await this.changeCurrentDataBlock(this.state.currentDataBlock)
                    break;
                default:
                    break;
            }
        }
        this.props.hideAppLoader()
    }

    async copyData(copyObject) {
        const token = await authService.getAccessToken();
        
        var controller = ""
        switch (copyObject.copyObjectType) {
            case this.copyTypes.DataHolder:
            case this.copyTypes.DataBlock:            
            case this.copyTypes.DataCategory:
                controller = "PersonContent"
                break;
            case this.copyTypes.Audio:
            case this.copyTypes.Video:
            case this.copyTypes.Image:
                controller = "Media"
                break;
            default:
                break;
        }
        var type = ""
        switch (copyObject.copyObjectType) {
            case this.copyTypes.DataHolder:
                type = "DataHolder"
                break;
            case this.copyTypes.DataBlock:
                type = "DataBlock"  
                break;         
            case this.copyTypes.DataCategory:
                type = "DataCategory"
                break;
            case this.copyTypes.Audio:
                type = "Audio"
                break;
            case this.copyTypes.Video:
                type = "Video"
                break;
            case this.copyTypes.Image:
                type = "Image"
                break;
            default:
                break;
        }

        var link = `/${controller}/${type}/Copy`

        var requestData = {}
        var idsName = type + "sIds"
        requestData[idsName] = copyObject.ids

        switch (copyObject.copyObjectType) {
            case this.copyTypes.DataBlock:
                requestData.DataCategoryId = this.state.currentCategory
                break;         
            case this.copyTypes.DataCategory:
                requestData = {
                    DataCategoriesIds: copyObject.ids,
                    PersonId: Number(this.state.personId)
                }
                break;
            case this.copyTypes.DataHolder:
            case this.copyTypes.Audio:
            case this.copyTypes.Video:
            case this.copyTypes.Image:
                requestData.DataBlockId = this.state.currentDataBlock
                break;
            default:
                break;
        }
        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(requestData)
        }); 

        return result.ok
    }

    async handlePrivacyCallback(payload) {
        this.handlePrivateClose()
        this.props.showAppLoader()
        var ok = await this.updatePrivacy(payload)
        if (ok) {
            await this.getCategoryData()
        }
        this.props.hideAppLoader()
    }

    async updatePrivacy(payload) {
        const token = await authService.getAccessToken();

        var link = `/Privacy/Update?id=${payload.id}`

        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(payload)
        }); 

        if (!result.ok) {
            alert("При реактировании произошла ошибка")
        }
        return result.ok
    }

    async handleEditCallback(name) {
        this.handleEditClose()
        this.props.showAppLoader()
        var ok = await this.editAnything(name)
        if (ok) {
            switch (this.state.editDataType) {
                case this.types.DataHolder:
                case this.types.DataBlock:
                    await this.getCategoryData()
                    break;            
                case this.types.DataCategory:
                    await this.populatePersonData()
                    break;
            
                default:
                    break;
            }
        }
        this.props.hideAppLoader()
    }

    async editAnything(name) {
        const token = await authService.getAccessToken();
        var type = ""
        switch (this.state.editDataType) {
            case this.types.DataHolder:
                type = "DataHolder"
                break;            
            case this.types.DataBlock:
                type = "DataBlock"
                break;            
            case this.types.DataCategory:
                type = "DataCategory"
                break;
        
            default:
                break;
        }

        var link = `/PersonContent/${type}/Update${this.state.editNameType}/${this.state.editDataItem.id}`

        var requestData = {
            Id: this.state.editDataItem.id,
            Name: name
        };
        
        if (this.state.editNameType === "Name") {
            requestData.Name = name
        }
        else if (this.state.editNameType === "Title") {
            requestData.Title = name
        }

        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(requestData)
        }); 

        if (!result.ok) {
            alert("При реактировании произошла ошибка")
        }
        return result.ok
    }

    async populatePersonData() {
        var data = await this.getAllPersonData()
        if (data.errors?.personId || data.length === 0) {
            alert("При получении данных произошла ошибка")
            this.setState({
                redirect: true
            })
            return;
        }

        var selectedCategories = Array(data.length).fill(false)
        this.setState({ 
            data: data, 
            currentCategory: data[0].id,
            selectedCategories: selectedCategories
        });
        await this.getCategoryData()
    }

    async getCategoryData(backupDataBlockId = null) {
        var data = await this.getAllCategories()

        var currentDataBlock = null

        if (data.dataCategoryType === 2) {
            currentDataBlock = data.dataBlocks[0].id
        }

        var selectedBlocks = Array(data.dataBlocks.length).fill(false)

        this.setState({
            categoryData: data,
            selectedBlocks: selectedBlocks
        })

        if (backupDataBlockId) {
            currentDataBlock = backupDataBlockId
        }

        this.changeCurrentDataBlock(currentDataBlock, data)

        this.props.hideAppLoader()
    }

    async addFile(name, desc, file) {
        var type = this.state.currentSubCategory;
        await this.uploadFile(name, desc, file, type)
        await this.changeCurrentDataBlock(this.state.currentDataBlock)
        this.props.hideAppLoader()
    }

    async addField(name, type) {
        await this.addNewField(name, type)
        await this.getCategoryData(this.state.currentDataBlock)
        this.props.hideAppLoader()
    }

    async getMedia(blockId, type) {
        const token = await authService.getAccessToken();
        var fileType = ""
        switch (type) {
            case this.subCategories.Image:
                fileType = "Image"
                break;            
            case this.subCategories.Audio:
                fileType = "Audio"
                break;            
            case this.subCategories.Video:
                fileType = "Video"
                break;
        
            default:
                break;
        }

        var link = `/Media/${fileType}/GetAll?dataBlockId=${blockId}`
        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'GET'
        }); 
        return await result.json()
    }
    
    async addNewField(name, type) {
        const token = await authService.getAccessToken();
        var link = `/PersonContent/DataHolder/Create`
        var requestData = {
            DataHolderType: type,
            Title: name,
            Data: "",
            DataBlockId: this.state.currentDataBlock
        };
        await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(requestData)
        }); 
    }

    async uploadFile(name, desc, file, type) {
        const token = await authService.getAccessToken();
        var fileType = ""
        switch (type) {
            case this.subCategories.Image:
                fileType = "Image"
                break;            
            case this.subCategories.Audio:
                fileType = "Audio"
                break;            
            case this.subCategories.Video:
                fileType = "Video"
                break;
        
            default:
                break;
        }
        var link = `/Media/${fileType}/Create`

        var formData = new FormData();
        formData.append("DataBlockId", this.state.currentDataBlock);
        formData.append("Title", name);
        formData.append("Description", desc);
        formData.append(`${fileType}File`, file);

        await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`},
            method: 'POST',
            body: formData
        }); 
    }

    async getAllPersonData() {
        const token = await authService.getAccessToken();
        var link = `PersonContent/DataCategory/GetAll?personId=${this.state.personId}`
        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'GET'
        }); 
        return await result.json()
    }


    async getAllCategories() {
        const token = await authService.getAccessToken();
        var link = `/PersonContent/DataCategory/Get/${this.state.currentCategory}`
        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'GET'
        }); 
        return await result.json()
    }

    async saveDataHolderData(id, value) {
        const token = await authService.getAccessToken();
        var link = `/PersonContent/DataHolder/UpdateData/${id}`

        var requestData = {
            'Id': id,
            'Data': value
        }
        await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(requestData)
        }); 
    }
}

function mapStateToProps(state) {
    return {
        loading: getLoadingState(state),
    }
}

const mapDispatchToProps = {
    changePageName,
    hideAppLoader, 
    showAppLoader
}

export default connect(mapStateToProps, mapDispatchToProps)(DataViewComponent)
