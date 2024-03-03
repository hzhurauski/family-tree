import React, { Component } from 'react';
import { connect } from 'react-redux'
import { changePageName } from '../reducers/pageName.actions'
import { hideAppLoader } from '../reducers/application.actions'
import './About.css'

export class AboutComponent extends Component {
    static displayName = AboutComponent.name;

    componentDidMount() {
        var title = "О проекте"
        document.title = title

        this.props.changePageName(title)
        this.props.hideAppLoader()
    }

    render() {
        return (
            <div id="AboutInformationBlock">    
                <div id="AboutDipInf">Данная система была разработана в качестве дипломного проекта для БНТУ, Минск.</div>
                <div className="inf"><span className="blueText">Разработчик: </span>Стрельников И. А.</div>
                <div className="inf"><span className="blueText">Факультет: </span>Информационных технологий и робототехники</div>       
                <div className="inf"><span className="blueText">Группа: </span>10702218</div>       
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

const mapDispatchToProps = {
    changePageName,
    hideAppLoader
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutComponent)
