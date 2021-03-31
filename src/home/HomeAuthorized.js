import React, {Component} from 'react';
import './HomeAuthorized.css';
import userService from "../user/UserService";
import LoadingIndicator from "../common/LoadingIndicator";
import {Redirect} from "react-router-dom";

const manualTradingUrl = "/manual";
const autoTradingUrl = "/autotrading";

class HomeAuthorized extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: props.currentUser,
            authenticated: props.authenticated,
        }
    }

    getInvestProfitValue() {
        return "+5.4%"
    }

    getAutotradeProfitValue() {
        return "+3.4%"
    }

    onManualInvestClick() {
        this.props.history.push(manualTradingUrl);
    }

    onAutotradeInvestClick() {
        this.props.history.push(autoTradingUrl);
    }

    componentDidMount() {
        this.setState({userBalance: userService.getUserBalance(this.props.currentUser)});
    }

    getActiveBalance() {
        return +this.state.userBalance.activeBalance
    }

    getDemoBalance() {
        return +this.state.userBalance.demoBalance
    }

    render() {
        if (!this.state.userBalance) {
            return <LoadingIndicator/>
        }
        if (this.getActiveBalance() > 0 || this.getDemoBalance() > 0) {
            return (
                <div className="home-container">
                    <div className="container">
                        <div className="container-invest">
                            <div className="button-manual-invest"
                                 onClick={() => this.onManualInvestClick()}>
                                {this.getInvestProfitValue()}
                                <div className={"button--text"}>Manual</div>
                            </div>
                        </div>
                        <div className="container-autotrade">
                            <div className="button-autotrade"
                                 onClick={() => this.onAutotradeInvestClick()}>
                                {this.getAutotradeProfitValue()}
                                <div className={"button--text"}>Autotrade</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return <Redirect to={{
            pathname: "/pop-up",
            state: {from: this.props.location}
        }}/>;
    }
}

export default HomeAuthorized;
