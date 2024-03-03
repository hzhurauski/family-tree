import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export class Footer extends Component {
    static displayName = Footer.name;

    render () {
        return (
            <div id="footer">
                <div className="container">
                    <div id="footerMenu">
                        <div className="row col-md-12 nullPadding">
                            <div className="col-md-4"><Link to="/"><div className="col-md-12">Генеалогическое древо</div></Link></div>
                            <div className="col-md-4"><Link to="/Reference"><div className="col-md-12">Справка</div></Link></div>
                            <div className="col-md-4"><Link to="/About"><div className="col-md-12">О проекте</div></Link></div>
                        </div>
                    </div>
                    <div>
                        <div id="copyright" className="col-md-offset-3">
                            &copy; {new Date().getFullYear()} <span id="author">Стрельников И. А.</span>. Все права защищены.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
