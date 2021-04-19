import React, {Component} from 'react';
import './AutoTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import ChartTradingView from "../../chart/ChartTradingView";
import {Redirect} from "react-router-dom";
import orderBuilder from "../order/orderBuilder";

const INVEST_USDT_AMOUNT = 50;

export default class AutoTradingMarket extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    getActiveBalance() {
        return +this.props.userBalance.activeBalance
    }

    getAutoTradingBalance() {
        return +this.props.userBalance.autoTradingBalance
    }

    getRealAutoTradingBalance() {
        return +this.props.userBalance.realAutoTradingBalance
    }

    getDemoBalance() {
        return +this.props.userBalance.demoBalance
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
        if (!this.props.orders) {
            return <LoadingIndicator/>
        }
        let totalBalance = this.getDemoBalance() + this.getActiveBalance();
        let autoTradingBalance = this.getAutoTradingBalance();
        let realAutoTradingBalance = this.getRealAutoTradingBalance();
        const sign = this.props.market.quotable;

        const onClickInvest = (market) => {
            if (totalBalance < INVEST_USDT_AMOUNT) {
                this.setState({redirectToNoMoney: true});
            } else {
                userService.sendAutoTradingInvest(market.asset, market.quotable, INVEST_USDT_AMOUNT)
                    .catch(console.error)
            }
        };
        let orders = this.props.orders || [];
        let hiddenOrders = this.props.hiddenOrders || [];
        const onCancel = order => {
            userService.sendCancel(order.id).catch(console.error)
        };
        const onHide = order => {
            userService.sendHide(order.id).catch(console.error)
        };
        const onShow = order => {
            userService.sendShow(order.id).catch(console.error)
        };
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
                                    {totalBalance}&nbsp;{sign}
                                </span>
                                <span className="auto-trading-panel-info-row-balance--text">
                                    &nbsp;Your demo autotrading balance:&nbsp;
                                </span>
                                <span className="auto-trading-panel-info-row-balance--value">
                                    {autoTradingBalance}&nbsp;{sign}
                                </span>
                                <span className="auto-trading-panel-info-row-balance--text">
                                    &nbsp;Your real autotrading balance:&nbsp;
                                </span>
                                <span className="auto-trading-panel-info-row-balance--value">
                                    {realAutoTradingBalance}&nbsp;{sign}
                                </span>
                            </div>
                        </div>
                        <div className="auto-trading-panel--buttons-container">
                            <div className="auto-trading-panel--buttons-container-row">
                                {orders.map(order => orderBuilder.buildOrder(order, onCancel, onHide, onShow))}
                            </div>
                            <div className="auto-trading-panel--buttons-container-row">
                                {hiddenOrders.map(order => orderBuilder.buildHiddenOrder(order, onShow))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
