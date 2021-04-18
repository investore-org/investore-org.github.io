import React, {Component} from 'react';
import './AutoTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import ChartTradingView from "../../chart/ChartTradingView";
import {Redirect} from "react-router-dom";

const INVEST_USDT_AMOUNT = 50;

export default class AutoTradingMarket extends Component {

    constructor(props) {
        super(props);
        this.state = {...props};
    }

    getActiveBalance() {
        return +this.state.userBalance.activeBalance
    }

    getAutoTradingBalance() {
        return +this.state.userBalance.autoTradingBalance
    }

    getDemoBalance() {
        return +this.state.userBalance.demoBalance
    }

    getStatusText(status) {
        return status.toLowerCase().replaceAll("_", " ")
    }

    render() {
        if (this.state.redirectToNoMoney) {
            return <Redirect
                to={{
                    pathname: '/no-balance',
                    state: {from: this.props.location}
                }}
            />
        }
        if (!this.state.orders) {
            return <LoadingIndicator/>
        }
        let totalBalance = this.getDemoBalance() + this.getActiveBalance();
        let autoTradingBalance = this.getAutoTradingBalance();
        const sign = "$"

        const onClickInvest = (market) => {
            if (totalBalance < INVEST_USDT_AMOUNT) {
                this.setState({redirectToNoMoney: true});
            } else {
                userService.sendAutoTradingInvest(market.asset, market.quotable, INVEST_USDT_AMOUNT)
                    .catch(console.error)
            }
        };
        let buildOrder = order => (
            <div key={order.id} className="auto-trading-panel--order">
                <div className="auto-trading-panel--order-info-row">
                    market: {order.asset}-{order.quotable}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    status: {this.getStatusText(order.status)}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    side: {order.side}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    invested: {order.amountQuotable} {order.quotable}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    bought: {order.boughtAssetQuantity} {order.asset}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    bought price: {order.buyOrderPrice}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    last price: {order.lastPrice}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    profit: {order.profit}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    created: {new Date(order.createdDate).toLocaleString()}
                </div>
            </div>
        );
        let orders = this.props.orders || [];
        return (
            <div key={this.props.market.market} className="market">
                <ChartTradingView symbol={this.props.market.market}/>
                <div className="auto-trading-panel--container">
                    <div className="auto-trading-panel--container-invisible">&nbsp;</div>
                    <div onClick={() => onClickInvest(this.props.market)}
                         className="auto-trading-panel--button--buy">Invest
                    </div>
                    <div className="auto-trading-panel">
                        <div className="auto-trading-panel--info-row">
                            <div className="auto-trading-panel-info-row--balance">
                                <span className="auto-trading-panel-info-row-balance--text">
                                    Your total balance:&nbsp;
                                </span>
                                <span className="auto-trading-panel-info-row-balance--value">
                                    {sign}{totalBalance}
                                </span>
                                <span className="auto-trading-panel-info-row-balance--text">
                                    &nbsp;Your autotrading balance:&nbsp;
                                </span>
                                <span className="auto-trading-panel-info-row-balance--value">
                                    {sign}{autoTradingBalance}
                                </span>
                            </div>
                        </div>
                        <div className="auto-trading-panel--buttons-container">
                            <div className="auto-trading-panel--buttons-container-row">
                                {orders.map(buildOrder)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
