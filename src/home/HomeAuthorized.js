import React, {Component} from 'react';
import './HomeAuthorized.css';

class HomeAuthorized extends Component {
    getProfitValue() {
        return "+5.4%"
    }

    render() {
        return (
            <div className="home-container">
                <div className="container">
                    <div className="container-invest">
                        <div className="button-invest">
                            {this.getProfitValue()}
                        </div>
                        <h1 className="home-title">Invest</h1>
                    </div>
                    <div className="graf-bg-container">
                        <div className="graf-layout">
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                            <div className="graf-circle"></div>
                        </div>
                    </div>
                    <h1 className="home-title">Autotrading</h1>
                </div>
            </div>
        )
    }
}

export default HomeAuthorized;