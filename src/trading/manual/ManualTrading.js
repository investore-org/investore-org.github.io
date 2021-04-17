import React, {Component} from 'react';
import './ManualTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import {Redirect} from "react-router-dom";
import ChartTradingView from "../../chart/ChartTradingView";

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

    refreshBalances() {
        userService.getUserBalance()
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
        const onCancel = order => {
            userService.sendCancel(order.id).catch(console.error)
        };
        let buildOrder = order => {
            let className = "manual-trading-panel--order" + (order?.real
                ? " manual-trading-panel--order-real" : "");
            return (
                <div key={order.id} className={className}>
                    <div className="manual-trading-panel--order-info-block">
                        <div className="manual-trading-panel--order-info-row">
                            market: {order.asset}-{order.quotable}
                        </div>
                        <div className="manual-trading-panel--order-info-row">
                            status: {this.getStatusText(order.status)}
                        </div>
                        <div className="manual-trading-panel--order-info-row">
                            side: {order.side}
                        </div>
                        <div className="manual-trading-panel--order-info-row">
                            invested: {order.amountQuotable} {order.quotable}
                        </div>
                        <div className="manual-trading-panel--order-info-row">
                            bought: {order.boughtAssetQuantity} {order.asset}
                        </div>
                        <div className="manual-trading-panel--order-info-row">{
                            order.sellOrderPrice
                                ? `sold price: ${order.sellOrderPrice}`
                                : `bought price: ${order.buyOrderPrice}`
                        }
                        </div>
                        <div className="manual-trading-panel--order-info-row">
                            last price: {order.lastPrice}
                        </div>
                        <div className="manual-trading-panel--order-info-row">
                            profit: {order.profit}
                        </div>
                        <div className="manual-trading-panel--order-info-row">
                            created: {new Date(order.createdDate).toLocaleString()}
                        </div>
                    </div>
                    <div className="order-controls-panel">
                        {
                            order.status === 'INIT_BUY_ORDER_SENT' ? (
                                <div onClick={() => onCancel(order)}
                                     className="order-control-button order-control-cancel">x</div>
                            ) : null
                        }
                    </div>
                </div>
            );
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
                                    {orders.map(buildOrder)}
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
