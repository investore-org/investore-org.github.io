import React, {Component} from 'react';
import './ManualTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import {Redirect} from "react-router-dom";
import ChartTradingView from "../../chart/ChartTradingView";
import orderBuilder from "../order/orderBuilder";

const BUY_USDT_AMOUNT = 50;
let timer = null;

export default class ManualTrading extends Component {

    constructor(props) {
        super(props);
        this.state = {...props};
    }

    componentDidMount() {
        this.refreshBalances();
        this.refreshOrders();
        this.refreshOrdersDelayed();
        this.refreshHiddenOrders();
    }

    getMarkets() {
        return [
            {market: "BTCUSDT", asset: "BTC", quotable: "USDT"},
            {market: "ETHUSDT", asset: "ETH", quotable: "USDT"},
            {market: "BNBUSDT", asset: "BNB", quotable: "USDT"},
            {market: "ETHBTC", asset: "ETH", quotable: "BTC"},
            {market: "BNBBTC", asset: "BNB", quotable: "BTC"},
            {market: "BNBETH", asset: "BNB", quotable: "ETH"},
        ];
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    refreshOrdersDelayed() {
        if (timer) {
            return;
        }
        timer = setTimeout(() => {
            this.refreshOrders();
            timer = null;
            this.refreshOrdersDelayed();
        }, 3_000)
    }

    refreshOrders() {
        let market = this.getMarkets()[this.state.marketIndex || 0];
        userService.getManualOrders(market.asset, market.quotable)
            .catch(console.error)
            .then(orders => {
                this.setState({
                    orders: (orders || []).sort((a, b) => (b.profit || 0) - a.profit)
                })
            });
    }

    refreshHiddenOrders() {
        let market = this.getMarkets()[this.state.marketIndex || 0];
        userService.getManualHiddenOrders(market.asset, market.quotable)
            .catch(console.error)
            .then(orders => {
                this.setState({
                    hiddenOrders: (orders || [])
                })
            });
    }

    refreshBalances() {
        let market = this.getMarkets()[this.state.marketIndex || 0];
        userService.getUserBalance(market.quotable)
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

    render() {
        if (this.state.redirectToNoMoney) {
            return <Redirect
                to={{
                    pathname: '/no-balance',
                    state: {from: this.props.location}
                }}
            />
        }
        if (!this.state.userBalance) {
            return <LoadingIndicator/>
        }
        const metaMarket = this.getMarkets()[this.state.marketIndex || 0];
        const market = metaMarket.market;
        const asset = metaMarket.asset;
        const quotable = metaMarket.quotable;
        const sign = quotable
        let totalBalance = this.getDemoBalance() + this.getActiveBalance();
        const getOnClickBuy = (isReal) => () => {
            if (totalBalance < BUY_USDT_AMOUNT) {
                this.setState({redirectToNoMoney: true});
            } else {
                userService.sendBuy(asset, quotable, BUY_USDT_AMOUNT, isReal)
                    .catch(console.error)
                    .then(newOrder => this.setState({
                        orders: (this.state.orders || []).concat(newOrder)
                    }, () => this.refreshBalances()))
            }
        };

        const onMarketChangeRequest = newIndex => {
            this.setState({
                marketIndex: newIndex,
            })
        }
        const buildNextMarketButton = () => {
            const currentIndex = this.state.marketIndex || 0;
            let markets = this.getMarkets();
            let maxIndex = markets.length - 1;
            if (currentIndex >= maxIndex) {
                return null;
            }
            const nextIndex = Math.min(currentIndex + 1, maxIndex);
            let newMarket = markets[nextIndex];
            return (
                <button onClick={() => onMarketChangeRequest(nextIndex)}
                        className="next-market-button">{`${newMarket.asset}-${newMarket.quotable}  >`}</button>
            )
        }
        const buildPrevMarketButton = () => {
            const currentIndex = this.state.marketIndex || 0;
            if (!currentIndex) {
                return null;
            }
            let markets = this.getMarkets();
            const prevIndex = Math.max(currentIndex - 1, 0);
            let newMarket = markets[prevIndex];
            return (
                <button onClick={() => onMarketChangeRequest(prevIndex)}
                        className="prev-market-button">{`<  ${newMarket.asset}-${newMarket.quotable}`}</button>
            )
        }
        let orders = this.state.orders || [];
        let hiddenOrders = this.state.hiddenOrders || [];
        const onClose = order => {
            userService.sendClose(order.id).catch(console.error)
                .then(__ => {
                    this.setState({
                        orders: this.state.orders.filter(_order => _order !== order)
                    }, () => this.refreshHiddenOrders())
                })
        };
        const onCancel = order => {
            userService.sendCancel(order.id).catch(console.error)
                .then(__ => {
                    this.setState({
                        orders: this.state.orders.filter(_order => _order !== order)
                    }, () => this.refreshHiddenOrders())
                })
        };
        const onHide = order => {
            userService.sendHide(order.id).catch(console.error)
                .then(__ => {
                    this.setState({
                        orders: this.state.orders.filter(_order => _order !== order)
                    }, () => this.refreshHiddenOrders())
                })
        };
        const onShow = order => {
            userService.sendShow(order.id).catch(console.error).then(__ => this.refreshHiddenOrders())
        };
        return (
            <div className="manual-trading-container">
                <div className="market">
                    <ChartTradingView symbol={market}/>
                    <div className="manual-trading-panel--container">
                        <div className="manual-trading-panel--container-invisible">&nbsp;</div>
                        <div className="manual-trading-panel--control-buttons-container">
                            <div onClick={getOnClickBuy(false)}
                                 className="manual-trading-panel--button--buy">TEST BUY
                            </div>
                            <div onClick={getOnClickBuy(true)}
                                 className="manual-trading-panel--button--buy">REAL BUY
                            </div>
                        </div>
                        <div className="manual-trading-panel">
                            <div className="manual-trading-panel--info-row">
                                <div className="manual-trading-panel-info-row--balance">
                                    <span className="manual-trading-panel-info-row-balance--text">
                                        Your active balance:&nbsp;
                                    </span>
                                    <span className="manual-trading-panel-info-row-balance--value">
                                        {this.getActiveBalance()}&nbsp;{sign}
                                    </span>
                                    <span className="manual-trading-panel-info-row-balance--text">
                                        &nbsp;Your demo balance:&nbsp;
                                    </span>
                                    <span className="manual-trading-panel-info-row-balance--value">
                                        {this.getDemoBalance()}&nbsp;{sign}
                                    </span>
                                </div>
                            </div>
                            <div className="manual-trading-panel--buttons-container">
                                <div className="manual-trading-panel--buttons-container-row">
                                    {orders.map(order => orderBuilder.buildOrder(order, onClose, onCancel, onHide))}
                                </div>
                                <div className="manual-trading-panel--buttons-container-row">
                                    {hiddenOrders.map(order => orderBuilder.buildHiddenOrder(order, onShow))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {buildPrevMarketButton()}
                    {buildNextMarketButton()}
                </div>
            </div>
        )
    }
}
