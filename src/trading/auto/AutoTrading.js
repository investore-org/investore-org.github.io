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
        this.refreshBalances();
        this.refreshOrders();
        this.refreshOrdersDelayed();
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

    refreshBalances() {
        userService.getUserBalance()
            .catch(console.error)
            .then(balance => {
                this.setState({userBalance: balance})
            });
    }

    render() {
        if (!this.state.userBalance || !this.state.orders) {
            return <LoadingIndicator/>
        }
        const markets = [
            {market: "BTCUSDT", asset: "BTC", quotable: "USDT"},
            {market: "ETHUSDT", asset: "ETH", quotable: "USDT"},
            {market: "BNBUSDT", asset: "BNB", quotable: "USDT"},
            {market: "ETHBTC", asset: "ETH", quotable: "BTC"},
            {market: "BNBBTC", asset: "BNB", quotable: "BTC"},
            {market: "BNBETH", asset: "BNB", quotable: "ETH"},
        ];
        const marketOrders = this.state.orders.reduce((a, b) => {
            a[b.market] = (a[b.market] || []).concat(b);
            return a;
        }, {});
        return (
            <div className="auto-trading-container">{markets.map(market => (
                <AutoTradingMarket market={market}
                                   orders={(marketOrders[market.market] || [])
                                       .sort((a, b) => (b.profit || 0) - a.profit)}
                                   userBalance={this.state.userBalance}/>
            ))}</div>
        )
    }
}
