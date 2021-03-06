import React, {Component} from 'react';
import './AutoTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import AutoTradingMarket from "./AutoTradingMarket";

let timer = null;
let stopRefresh = false;

export default class AutoTrading extends Component {

    constructor(props) {
        super(props);
        this.state = {...props};
    }

    componentDidMount() {
        userService.getUserBalances()
            .catch(console.error)
            .then(balance => {
                this.setState({
                    userBalances: balance,
                }, () => {
                    userService.getAutoTradingOrders(null, null)
                        .catch(console.error)
                        .then(orders => {
                            this.setState({orders: orders}, () => {
                                userService.getAutoTradingHiddenOrders(null, null)
                                    .catch(console.error)
                                    .then(orders => {
                                        this.setState({
                                            hiddenOrders: (orders || [])
                                        }, () => this.refreshOrdersDelayed())
                                    });
                            })
                        });
                })
            });
    }

    componentWillUnmount() {
        stopRefresh = true;
        clearTimeout(timer);
    }

    refreshOrdersDelayed() {
        if (timer || stopRefresh) {
            return;
        }
        timer = setTimeout(() => {
            if (stopRefresh) {
                return;
            }
            this.refreshOrders();
            timer = null;
            this.refreshOrdersDelayed();
        }, 3_000)
    }

    refreshOrders() {
        userService.getAutoTradingOrders(null, null)
            .catch(console.error)
            .then(orders => {
                this.setState({orders: orders})
            });
    }

    refreshHiddenOrders() {
        userService.getAutoTradingHiddenOrders(null, null)
            .catch(console.error)
            .then(orders => {
                this.setState({
                    hiddenOrders: (orders || [])
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

    getMarkets() {
        return [
            {market: "BTCUSDT", asset: "BTC", quotable: "USDT"},
            {market: "ETHUSDT", asset: "ETH", quotable: "USDT"},
            {market: "BNBUSDT", asset: "BNB", quotable: "USDT"},
            {market: "ETHBTC", asset: "ETH", quotable: "BTC"},
            {market: "BNBBTC", asset: "BNB", quotable: "BTC"},
            {market: "BNBETH", asset: "BNB", quotable: "ETH"},
        ]
    }

    render() {
        if (!this.state.userBalances || !this.state.orders || !this.state.hiddenOrders) {
            return <LoadingIndicator/>
        }
        const markets = this.getMarkets();
        const marketOrders = this.state.orders.reduce((a, b) => {
            a[b.market] = (a[b.market] || []).concat(b);
            return a;
        }, {});
        const marketHiddenOrders = this.state.hiddenOrders.reduce((a, b) => {
            a[b.market] = (a[b.market] || []).concat(b);
            return a;
        }, {});
        return (
            <div className="auto-trading-container">{markets.map(market => {
                let orders = (marketOrders[market.market] || [])
                    .sort((a, b) => (b.profit || 0) - a.profit);
                let hiddenOrders = marketHiddenOrders[market.market] || [];
                return (
                    <AutoTradingMarket market={market}
                                       orders={orders}
                                       hiddenOrders={hiddenOrders}
                                       refreshHiddenOrders={() => this.refreshHiddenOrders()}
                                       userBalanceAsset={this.state.userBalances[market.asset] || {}}
                                       userBalanceQuotable={this.state.userBalances[market.quotable] || {}}/>
                );
            })}</div>
        )
    }
}
