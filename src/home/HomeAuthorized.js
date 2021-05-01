import React, {Component} from 'react';
import './HomeAuthorized.css';
import userService from "../user/UserService";
import LoadingIndicator from "../common/LoadingIndicator";
import {Redirect} from "react-router-dom";

const manualTradingUrl = "/manual";
const autoTradingUrl = "/autotrading";
const advancedTradingUrl = "/advanced-trading";

const DEFAULT_CURRENCY = "USDT";

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
        return "+3.8%"
    }

    getAdvancedTradeProfitValue() {
        return "+10.2%"
    }

    onManualInvestClick() {
        this.props.history.push(manualTradingUrl);
    }

    onAutotradeInvestClick() {
        this.props.history.push(autoTradingUrl);
    }

    onAdvancedTradeInvestClick() {
        this.props.history.push(advancedTradingUrl);
    }

    componentDidMount() {
        userService.getUserBalance(DEFAULT_CURRENCY)
            .catch(console.error)
            .then(balance => {
                this.setState({userBalance: balance})
            });
    }

    getActiveBalance() {
        return +this.state.userBalance.activeBalance
    }

    getDemoBalance() {
        return +this.state.userBalance.demoBalance
    }

    getRealAutoTradingBalance() {
        return +this.state.userBalance.realAutoTradingBalance
    }

    getAutoTradingBalance() {
        return +this.state.userBalance.autoTradingBalance
    }

    render() {
        if (!this.state.userBalance) {
            return <LoadingIndicator/>
        }
        const balance = this.getActiveBalance() > 0 ? this.getActiveBalance() : this.getDemoBalance();
        if (balance > 0) {
            const sign = DEFAULT_CURRENCY;
            return (
                <div className="home-container">
                    <div className="container">
                        <div className="container-balance-info">
                            <div className="container-balance-info-text">Your funds:</div>
                            <div className="container-balance-info-text">
                                Active balance: {this.getActiveBalance()} {sign}
                            </div>
                            <div className="container-balance-info-text">
                                Demo balance: {this.getDemoBalance()} {sign}
                            </div>
                            <div className="container-balance-info-text">
                                Auto trading balance: {this.getRealAutoTradingBalance()} {sign}
                            </div>
                            <div className="container-balance-info-text">
                                Demo auto trading balance: {this.getAutoTradingBalance()} {sign}
                            </div>
                        </div>
                        <div className="container-invest">
                            <div className="button-invest"
                                 onClick={() => this.onManualInvestClick()}>
                                {this.getInvestProfitValue()}
                                <div className={"button--text"}>Manual</div>
                            </div>
                        </div>
                        <div className="container-invest">
                            <div className="button-invest"
                                 onClick={() => this.onAutotradeInvestClick()}>
                                {this.getAutotradeProfitValue()}
                                <div className={"button--text"}>Autotrade</div>
                            </div>
                        </div>
                        <div className="container-invest">
                            <div className="button-invest"
                                 onClick={() => this.onAdvancedTradeInvestClick()}>
                                {this.getAdvancedTradeProfitValue()}
                                <div className={"button--text"}>Advanced</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        console.log("balance", balance);
        return <Redirect to={{
            pathname: "/no-balance",
            state: {from: this.props.location}
        }}/>;
    }
}

export default HomeAuthorized;
