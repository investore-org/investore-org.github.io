import React, {Component} from 'react';
import './PopUp.css';
import {Link} from 'react-router-dom';

class PopUp extends Component {
    render() {
        return (
            <div className="pop-up-container">
                <h1 className="title">
                    Deposit
                </h1>
                <div className="desc">
                    Deposit to be able to buy
                </div>
                <div className={"deposit-button-container"}>
                    <Link to="/deposit">
                        <button className="go-back-btn btn btn-primary" type="button">Deposit</button>
                    </Link>
                </div>
                <div className={"deposit-button-container"}>
                    <Link to="/demo-deposit">
                        <button className="go-back-btn btn btn-primary" type="button">Demo</button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default PopUp;
