import React, {Component} from 'react';
import './AutoTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import ChartTradingView from "../../chart/ChartTradingView";
import {Redirect} from "react-router-dom";
import orderBuilder from "../order/orderBuilder";
import orderService from "../order/OrderService";
import {setAfterDecimalPoint} from "../../util/Utils";

const INVEST_USDT_AMOUNT = 50;

export default class AutoTradingMarket extends Component {

    constructor(props) {
        super(props);
        this.state = {...props};
    }

    getAssetBalance() {
        return this.state.userBalanceAsset
    }

    getQuotableBalance() {
        return this.state.userBalanceQuotable
    }

    getActiveBalance() {
        return +this.state.userBalanceQuotable.activeBalance
    }

    getAutoTradingBalance() {
        return +this.state.userBalanceQuotable.autoTradingBalance
    }

    getRealAutoTradingBalance() {
        return +this.state.userBalanceQuotable.realAutoTradingBalance
    }

    getDemoBalance() {
        return +this.state.userBalanceQuotable.demoBalance
    }

    getStatusText(status) {
        return status.toLowerCase().replaceAll("_", " ")
    }

    refreshBalance() {
        userService.getUserBalances()
            .catch(console.error)
            .then(balance => {
                this.setState({
                    userBalanceAsset: balance[this.props.market.asset],
                    userBalanceQuotable: balance[this.props.market.quotable],
                })
            })
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
                    .then(() => this.refreshBalance())
            }
        };
        let orders = this.props.orders || [];
        let hiddenOrders = this.props.hiddenOrders || [];
        const onClose = order => {
            userService.sendClose(order.id).catch(console.error)
        };
        const onCancel = order => {
            userService.sendCancel(order.id).catch(console.error)
        };
        const onHide = order => {
            userService.sendHide(order.id).catch(console.error)
        };
        const onShow = order => {
            userService.sendShow(order.id).catch(console.error)
        };
        const refreshMoreInfo = (market) => {
            orderService.getAutoTradingOrdersInfo(market.asset, market.quotable).catch(console.error)
                .then(data => this.setState({
                    moreInfoData: {
                        [market.market]: data,
                    }
                }))
        }
        const moreInfoTrigger = (market) => this.setState({
            showMoreInfo: !this.state.showMoreInfo,
        }, () => refreshMoreInfo(market))
        const buildMoreInfo = (market) => {
            let moreInfoDatum = this.state.moreInfoData;

            if (!moreInfoDatum) {
                return null
            }
            let marketInfo = moreInfoDatum[market.market] || {};
            return (
                <div className="manual-trading-panel-info-row-balance--more-info-block">
                    {
                        Object.entries(marketInfo).map((entry, index) => (
                            <div key={index} className="manual-trading-panel-info-row-balance--more-info-row">
                                {entry[0].replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`)}
                                : {entry[1]}
                            </div>
                        ))
                    }
                </div>
            )
        }
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
                                    {setAfterDecimalPoint(totalBalance, 2)}&nbsp;{sign}
                                </span>
                                <span className="auto-trading-panel-info-row-balance--text">
                                    &nbsp;Your demo autotrading balance:&nbsp;
                                </span>
                                <span className="auto-trading-panel-info-row-balance--value">
                                    {setAfterDecimalPoint(autoTradingBalance, 2)}&nbsp;{sign}
                                </span>
                                <span className="auto-trading-panel-info-row-balance--text">
                                    &nbsp;Your real autotrading balance:&nbsp;
                                </span>
                                <span className="auto-trading-panel-info-row-balance--value">
                                    {setAfterDecimalPoint(realAutoTradingBalance, 2)}&nbsp;{sign}
                                </span>
                                <button
                                    className="manual-trading-panel-info-row-balance--more-info-button"
                                    onClick={() => moreInfoTrigger(this.props.market)}>
                                    {this.state.showMoreInfo ? 'Less Info' : 'More Info'}
                                </button>
                            </div>
                        </div>
                        {this.state.showMoreInfo ? buildMoreInfo(this.props.market) : null}
                        <div className="auto-trading-panel--buttons-container">
                            <div className="auto-trading-panel--buttons-container-row">
                                {orders.map(order => orderBuilder.buildOrder(order, onClose, onCancel, onHide))}
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
