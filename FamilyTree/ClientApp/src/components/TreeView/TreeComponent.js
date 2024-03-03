import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import authService from '../api-authorization/AuthorizeService'
import { populateTreeData } from './TreeView.requests'
import TreeStructure from './TreeStructure';
import { AddPerson } from './AddPerson'
import { changePageName } from '../../reducers/pageName.actions'
import { getLoadingState } from '../../reducers/application.selectors'
import { hideAppLoader, showAppLoader } from '../../reducers/application.actions'

export class TreeComponent extends Component {
    static displayName = TreeComponent.name;

    constructor(props) {
        super(props);
        this.state = {
            treeData: {}, 
            bloodTree: null, 
            treeId: null,
            mainPersonId: null,
            redirect: false
        };
    }

    componentDidMount() {
        var id = this.props.match.params.id
        this.setState({treeId: id})
        
        this.props.showAppLoader()

        this.getTreeClean()
    }

    getNewTreePersonId(personId, bloodFlag,  wifeId = null) {
        this.setState({
            treeData: {}
        });
        this.props.showAppLoader()//this.setState({ loading: true })
        if (bloodFlag) {
            this.getAllTrees(this.state.treeId, personId, wifeId)
        }
        else {
            this.getTree(this.state.treeId, personId, wifeId);
        }
    }

    getBloodTree(personId, wifeId) {
        this.populateBloodTree(personId, null, wifeId)
    }

    async handleAddPerson(payload, start = false) {
        payload.treeId = this.state.treeId
        this.props.showAppLoader()
        try {
            await this.addNewPerson(payload, start)
        }
        catch(e) {
            alert("При отправке данных произошла ошибка")
            this.props.hideAppLoader()
        }
    }

    handleAddStartPerson(name, surname, middlename, date, gender) {
        var payload = {
            name,
            surname,
            middlename,
            birthday: date,
            gender,
            treeId: 0,
            parentNumber: 0,
//            personRelationType: '',
            wifeId: 0,
            mainPersonId: 0
        };

        this.handleAddPerson(payload, true)
    }

    render() {
        return (
            <div>
                {
                    this.state.redirect && <Redirect push to="/"/>
                }
                {
                    this.props.loading && <></>
                }
                {
                    !this.props.loading && !this.state.treeData &&
                    <AddPerson id="start-tree-block"
                        visibility="visible"
                        realImageId="imgAdd"
                        realClassName=" "
                        addPersonCallback={(name, surname, middlename, date, gender) => 
                            this.handleAddStartPerson(name, surname, middlename, date, gender)}/>
                }
                {
                    !this.props.loading && this.state.treeData &&
                    <TreeStructure 
                        callback={(personId, bloodFlag, wifeId) => this.getNewTreePersonId(personId, bloodFlag, wifeId)} 
                        handleAddPerson={(payload) => this.handleAddPerson(payload)}
                        treeData={this.state.treeData} 
                        mainPersonId={this.state.treeData.mainPerson.id}
                        realMainPersonId={this.state.mainPersonId}
                        handleUpdateMainPerson={(personId) => this.handleUpdateMainPerson(personId)}
                        handleDeletePerson={(personId) => this.handleDeletePerson(personId)}
                        shareTreeCallback={(username) => this.shareTreeCallback(username)}
                        getBloodTree={(personId, wifeId) => this.getBloodTree(personId, wifeId)}
                        bloodTree={this.state.bloodTree}/>
                }
            </div>
        )
    }

    async shareTreeCallback(username) {
        this.props.showAppLoader()
        await this.shareTree(username);
        this.props.hideAppLoader()
    }

    async shareTree(username) {
        const token = await authService.getAccessToken();
        var link = `FamilyTree/shareFamilyTree`
        var payload = { 
            id: this.state.treeId,
            username: username
        } 
        await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async getAllTrees(treeId, personId, wifeId) {
        var tree = await this.populateTreeData(treeId, personId, wifeId)
        await this.populateBloodTree(personId, tree, wifeId);
        this.props.hideAppLoader()//this.setState({ loading: false })
    }

    async getTree(id, personId, wifeId){
        await this.populateTreeData(id, personId, wifeId)
        this.props.hideAppLoader()//this.setState({ loading: false })
    }

    async getTreeClean() {
        var trees = await populateTreeData()

        var tree = trees.find((el, i, arr) => {
            if (el.id.toString() === this.state.treeId) 
                return el
        }, this)

        if (!tree) {
            alert("При получении данных произошла ошибка")
            this.setState({
                redirect: true
            })
            return;
        }

        sessionStorage.setItem('treeId', this.state.treeId);

        this.props.changePageName(tree.name)

        var mainPersonId = tree.mainPersonId
        if (mainPersonId) {
            this.getTree(this.state.treeId, mainPersonId);
            this.setState({ mainPersonId })
        }
        else {
            this.setState({ treeData: null });
            this.props.hideAppLoader()
        }
    }
    
    async populateBloodTree(personId, backupTree = null, wifeId = null) {
        const token = await authService.getAccessToken();
        var id = this.state.treeId
        var mainId = 0
        if (backupTree) {
            mainId = backupTree.mainPerson.id
        }
        else {
            mainId = this.state.treeData.mainPerson.id
        }
        
        var link = `FamilyTree/GetBloodTree?id=${id}&bloodMainId=${mainId}&currentMainId=${personId}` + (wifeId ? `&wifeId=${wifeId}` : "")
        const response = await fetch(link, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ bloodTree: data });
    }

    async populateTreeData(id, personId, wifeId = null) {
        const token = await authService.getAccessToken();
        var link = `FamilyTree/getTree?id=${id}&personId=${personId}` + (wifeId ? `&wifeId=${wifeId}` : "")
        const response = await fetch(link, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ treeData: data });
        return data
    }

    async handleUpdateMainPerson(personId) {
        //this.setState({ loading: true });
        await this.updateMainPerson(this.state.treeId, personId)
        this.setState({ mainPersonId: personId })
        //await this.getTree(this.state.treeId, personId);
    }

    async handleDeletePerson(personId) {
        this.props.showAppLoader()
        await this.deletePerson(personId)
        await this.getTreeClean()
    }

    async updateMainPerson(id, personId) {
        const token = await authService.getAccessToken();
        var requestData = {
            'Id': id,
            'PersonId': personId
        }
        var link = `FamilyTree/UpdateMainPerson?id=${id}`
        await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify(requestData)
        });
    }

    async deletePerson(personId) {
        const token = await authService.getAccessToken();
        var link = `People/Delete/?id=${personId}`
        await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}` },
            method: 'DELETE',
        });
    }

    async addNewPerson(payload, start) {
        const token = await authService.getAccessToken();
        var link = `People/Create`
        var result = await fetch(link, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(payload)
        });
        if (!result.ok) {
            throw Error
        }
        var personId = await result.json()
        var mainId = 0
        if (start) {
            mainId = personId
        }
        else {
            mainId = this.state.treeData.mainPerson.id
        }

        await this.getTree(this.state.treeId, mainId, this.state.wifeId);
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

export default connect(mapStateToProps, mapDispatchToProps)(TreeComponent)