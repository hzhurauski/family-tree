/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { changePageName } from '../reducers/pageName.actions'
import { hideAppLoader } from '../reducers/application.actions'

import './Reference.css'

export class ReferenceComponent extends Component {
    static displayName = ReferenceComponent.name;

    constructor(props) {
        super(props);
        this.state = { 
            page: 1 
        };
    }


    componentDidMount() {
        var title = "Справочная информация"

        document.title = title

        this.props.changePageName(title);
        this.props.hideAppLoader()
    }

    changePage(index) {
        this.setState({
            page: index
        })
    }

    structInfoView() {
        return (
            <div className="inflistItem" id="StructInf">
                <span className="RedString"></span>Дерево представляет собой совокупность элементов дерева, соединенные между собой связями "родитель" - "ребенок"
                и "муж" - "жена".
                <div className="BigText">Обычный масштаб</div>
                <span className="RedString"></span>Так как показать все дерево займет много пространства и ориентация в нем будет затруднительна, поэтому
                в данной системе отображается только часть этого дерева. <p></p><span className="RedString"></span>В этой части отображаются:
                <ul type="square">
                    <li><span>Главная персона;</span></li>
                    <li><span>Мать;</span></li>
                    <li><span>Отец;</span></li>
                    <li><span>Родители родителей;</span></li>
                    <li><span>Список братьев и сестер;</span></li>
                    <li><span>Список детей выбранной жены;</span></li>
                    <li><span>Список жен;</span></li>
                    <li><span>Ребенок от второго брака;</span></li>
                    <li><span>Родители жены;</span></li>
                    <li><span>Родители родителей жены.</span></li>
                </ul>         
                <span className="RedString"></span>Для перемещения необходимо дважды щелкнуть левой кнопкой мыши по одному 
                из выше перечисленных людей и область просмотра дерева будет обновлена, где главным человеком станет 
                выбранный человек (выделен зеленым цветом). Таким образом можно перемещаться по всему дереву.<p></p>
                <div className="BigText">Увеличенный масштаб</div>
                <span className="RedString"></span>Также имеется кнопка увеличения масштаба, расположенная над деревом, при нажатии на которую будут отображены: 
                <ul type="square">
                    <li><span>Главная персона;</span></li>
                    <li><span>Мать;</span></li>
                    <li><span>Отец;</span></li>           
                    <li><span>Список братьев и сестер;</span></li>
                    <li><span>Список детей выбранной жены;</span></li>
                    <li><span>Список жен.</span></li>           
                </ul>      
            </div>
        )
    }

    structElemView() {
        return (
            <div className="inflistItem" id="StructElemInf">
                <div className="BigText">Элемент дерева</div>
                <span className="RedString"></span>Элементом дерева является человек. В дереве он представляется блоком, который представлен ниже.
                <div className="imgInf">
                    <img src={require("../images/TreeElement.png")} /> 
                </div>
                <span className="RedString"></span>В данном блоке отображаются фамилия, имя, отчество и изображение, которое было установлено в качестве аватара.
                Если аватар отсутствует, то вместо аватара отображается изображение по умолчанию, как представлено на рисунке выше.<p></p>
                <span className="RedString"></span>В зависимости от того, является ли человек главным в области просмотра дерева, т.е область просмотра загружена 
                относительно выбранного человека, цвет блока бывает <span className="greenText">зеленый (главный)</span> и <span className="blueText">синий</span>.<p></p>
                <div className="BigText">Блок добавления</div>
                <span className="RedString"></span>В случае, если данные об этом человеке отсутствуют, то вместо представленного блока отображается блок добавления, который представлен ниже.
                <div className="imgInf">
                    <img src={require("../images/AddElement.png")} />
                </div>
                <span className="RedString"></span>При нажатии на блок добавления человека в дерева, вы перейдете на страницу добавления человека в дерево.<p></p>
                <div className="BigText">Блок отношения</div>
                <span className="RedString"></span>При нажатии на блок человека правой кнопкой в дереве будет отображен дополнительный блок, который представлен ниже.
                <div className="imgInfLine_big">
                    <img src={require("../images/AditionalBlock.png")} />
                </div>
                <span className="RedString"></span>С помощью этого блока можно перейти на страницу с более подробной информацией о человеке, такие как персональные параметры, образование,
                трудовая делятельность, места проживания и другие события, которые случились с данным человеком. Также в этом блоке отображается информация о том,
                кем является данный человек для главного человека в дереве.
            </div>
        )
    }

    connTypeView() {
        return (
            <div className="inflistItem" id="TypeConInf">
                <span className="RedString"></span>В дереве связь между людьми отображается в виде линии. Цвет, формат и направление могут быть разными.        
                <div className="BigText">По цвету и формату</div>
                <span className="RedString"></span>Цвет бывает 2 цветов с 2-мя уровнями блеклости: <span className="blueText">синий</span> и <span className="redText">красный</span>.<p></p>
                <span className="imgInfLineColor">
                    <img src={require("../images/BlueSolidLine.png")} />
                </span> - обычная связь между элементами дерева, которые оба находятся в области просмотра дерева.<p></p>
                <span className="imgInfLineColor">
                    <img src={require("../images/BlueSolidFatedLine.png")} />
                </span> - связь между главным человеком и ребенком от второго брака, а также 2-й жены и этим же ребенком.<p></p>
                <span className="imgInfLineColor">
                    <img src={require("../images/BlueDashedFatedLine.png")} />
                </span> - связь между элементами дерева, один из которых находится за пределами области просмотра дерева.<p></p>
                <span className="imgInfLineColor">
                    <img src={require("../images/RedSolidLine.png")} />&nbsp;
                    <img src={require("../images/RedSolidFatedLine.png")} />&nbsp;
                    <img src={require("../images/RedDashedFatedLine.png")} />           
                </span>- смысл такой же, как и у соответствующих синих линий, но красный отображает кровное родство между двумя элементами дерева. <p></p>   <p></p>  <p></p>       
                <div className="BigText">По направлению</div>
                <span className="RedString"></span>Для наглядного отображения всех направлений ниже представлен рисунок.
                <div className="imgInf">
                    <img src={require("../images/BlockConnections.png")} />
                </div>
                <span className="RedString"></span>Как видно на рисунке, всего 5 направлений:
                <ul type="none">
                    <li>1<span> - "сверху вниз" - говорит о наличии родителя;</span></li>
                    <li>2<span> - "сверху налево" - говорит о наличии брата/сестры;</span></li>
                    <li>3<span> - "от блока налево/направо сплошная" - говорит о наличии ребенка в области просмотра дерева;</span></li>
                    <li>4<span> - "от блока направо/налево блеклая штриховая" - говорит о наличии ребенка от второго брака вне области просмотра дерева;</span></li>
                    <li>5<span> - "от блока вниз блеклая штриховая" - говорит о наличии ребенка вне области просмотра дерева.</span></li>            
                </ul>             
            </div>
        )
    }

    relationalInfoView() {
        return (
            <div className="inflistItem" id="RelationInf">
                <div className="BigText">"Кровное родство"</div>
                <span className="RedString"></span>Отношение между текущим человеком и главным отображается в дополнительном блоке, 
                который появляется при наведении на элемент дерева.<p></p>
                <span className="RedString"></span>Кнопка "Кровное родство" позволяет показать кровные связи с текущим главным человеком области просмотра. При движении по дереву с помощью 
                двойного целчка мышью по элементу кровные связи будут отображаться относительно человека, который был закреплен ранее. При наведении
                на элемент дерева будет отображаться отношение текущего человека относительно закрепленного. <p></p>
                <span className="RedString"></span>Чтобы открепить человека и отключить 
                отображение кровного родства, необходимо вновь нажать на кнопку "Кровное родство".
            </div>
        )
    }

    delElInfoView() {
        return (
            <div className="inflistItem" id="DeleteElemInf">
                <div className="BigText">Удаление элемента</div>
                <span className="RedString"></span>Процесс удаления элементов дерева обладает определенной особенностью.<p></p>
                <span className="RedString"></span>Для удаления элемента из дерева, необходимо перейти на более подробную информацию о человеке, которого необходимо удалить.
                В разделе персональных параметров имеется кнопка удаления.
                Однако, так как это дерево, то удаление одного элемента дерева может повлечь удаление других элементов. Этот список рассчитывается путем
                поиска элементов, которые связаны с "корневым" элементом только через удаляемый элемент. <p></p>
                <span className="RedString"></span>"Корневым" считается тот элемент,
                который был первым создан в дереве. При желании имеется возможность изменения "корневого" элемента в профиле аккаунта.<p></p>
                <div className="BigText">Пример 1</div>
                
                <span className="RedString"></span>Дерево состоит из главного человека, у которого есть 2 ребенка от 1-й жены, жена и родители жены. 
                При удалении жены, будут также удалены родители жены, но дети удалены не будут, так как между главным человеком и детьми 
                имеется прямая связь "Родитель - ребенок".<p></p>
                <div className="BigText">Пример 2</div>
            
                <span className="RedString"></span>Дерево состоит из главного человека, у которого есть оба родителя и 1 брат.
                При удалении одного из родителей, дополнительно никто удален не будет. Но если после этого удалить второго родителя, то
                также будет удален брат.
            </div>
        )
    }

    render() {

        var page = <div></div>

        switch (this.state.page) {
            case 1:
                page = this.structInfoView()
                break;
            case 2:
                page = this.structElemView()
                break;
            case 3:
                page = this.connTypeView()
                break;
            case 4:
                page = this.relationalInfoView()
                break;
            case 5:
                page = this.delElInfoView()
                break;
                
            default:
                break;
        }

        return (
            <div id="InformationBlock">
                <div id="TitleInfBlock">Особенности дерева</div>
                <div id="listInf">
                    <div id="OneItem" className={`list-item ${this.state.page === 1 ? "active" : ""}`} onClick={() => this.changePage(1)}>Структура</div>
                    <div id="TwoItem" className={`list-item ${this.state.page === 2 ? "active" : ""}`} onClick={() => this.changePage(2)}>Структура 1 элемента</div>
                    <div id="ThreeItem" className={`list-item ${this.state.page === 3 ? "active" : ""}`} onClick={() => this.changePage(3)}>Виды связей</div>
                    <div id="FourItem" className={`list-item ${this.state.page === 4 ? "active" : ""}`} onClick={() => this.changePage(4)}>Отношения между людьми</div>
                    <div id="lastItem" className={`list-item ${this.state.page === 5 ? "active" : ""}`} onClick={() => this.changePage(5)}>Удаление элементов</div>
                </div>

                {page}

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

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceComponent)

