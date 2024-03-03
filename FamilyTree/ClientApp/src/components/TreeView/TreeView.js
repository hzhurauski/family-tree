import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import Container from 'reactstrap/lib/Container';
import { populateTreeData, createNewTree } from './TreeView.requests'
import { changePageName } from '../../reducers/pageName.actions'
import { getLoadingState } from '../../reducers/application.selectors'
import { hideAppLoader, showAppLoader } from '../../reducers/application.actions'
import "./TreeView.css"
import { AddTreeModal } from './AddTreeModal';

export class TreeView extends Component {
    static displayName = TreeView.name;

    constructor(props) {
        super(props);
        this.state = { 
            trees: [],
            modalOpen: false
        };
    }

    openModal() {
        this.setState({
            modalOpen: true
        })
    }

    handleClose() {
        this.setState({
            modalOpen: false
        }) 
    }

    componentDidMount() {
        var title = "Все деревья пользователя"
        window.title = title

        this.props.showAppLoader()

        this.props.changePageName(title)
        this.populateTreeData();
    }

    addTreeCallback(name) {
        this.handleClose()
        this.props.showAppLoader()
        this.handleAddTree(name)
    }

    render () {
        return (
            <div>
                {
                    this.props.loading && <></>
                }
                {
                    !this.props.loading && this.state.trees.length === 0 &&
                    <div id="has-no-trees-block">
                        <div className="has-no-trees-block__content">
                            <h3>У вас нет деревьев.</h3>
                            <h3>Создайте новое дерево.</h3>
                            <div id="create-family-tree-button" className="btn btn-my-primary" onClick={() => this.openModal()}>Создать</div>
                        </div>
                    </div>
                }
                {
                    !this.props.loading && this.state.trees.length !== 0 &&
                    <Container className="treeContainer">
                        <div id="create-family-tree-button" className="btn btn-my-primary" onClick={() => this.openModal()}>Создать новое дерево</div>
                        <br />
                        <br />
                        <span>Все деревья пользователя:</span>
                        <ul className="treeList">
                        {
                            this.state.trees.map((tree, i) => {    
                                return (
                                    <li key={i}>
                                        <Link to={"/tree/" + tree.id} onClick={()=> this.handleRedirect()}>{tree.name}</Link>
                                    </li>
                                ) 
                            })  
                        }  
                        </ul>
                    </Container>
                    // <TreeComponent tree={this.state.trees[0]}/>
                }
                <AddTreeModal 
                    isOpen={this.state.modalOpen} 
                    handleClose={() => this.handleClose()} 
                    addTreeCallback={(name) => this.addTreeCallback(name)}/>
            </div>
        );
    }

    handleRedirect() {
        this.props.showAppLoader()
    }

    async handleAddTree(name) {
        await createNewTree(name);
        await this.populateTreeData()
    }

    async populateTreeData() {
        var tree = await populateTreeData()
        this.setState({ trees: tree });
        this.props.hideAppLoader()//this.setState({ loading: false })
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

export default connect(mapStateToProps, mapDispatchToProps)(TreeView)
