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
        userService.getManualOrders("BTC", "USDT")
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
        switch (status) {
            case 'CREATED':
                return `created`;
            case 'INIT_BUY_ORDER_SENT':
                return `init buy order sent`;
            case 'INIT_BUY_ORDER_FILLED':
                return `init buy order filled`;
        }
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
        const market = "BTCUSDT";
        const asset = "BTC";
        const quotable = "USDT";
        const sign = "$"
        let totalBalance = this.getDemoBalance() + this.getActiveBalance();
        const onClickBuy = () => {
            if (totalBalance < BUY_USDT_AMOUNT) {
                this.setState({redirectToNoMoney: true});
            } else {
                userService.sendBuy(asset, quotable, BUY_USDT_AMOUNT)
                    .catch(console.error)
                    .then(newOrder => this.setState({
                        orders: (this.state.orders || []).concat(newOrder)
                    }, () => this.refreshBalances()))
            }
        };
        let buildOrder = order => (
            <div key={order.id} className="manual-trading-panel--order">
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
                <div className="manual-trading-panel--order-info-row">
                    bought price: {order.buyOrderPrice}
                </div>
                <div className="manual-trading-panel--order-info-row">
                    last price: {order.lastPrice}
                </div>
                <div className="manual-trading-panel--order-info-row">
                    profit: {order.profit}
                </div>
            </div>
        );
        let orders = this.state.orders || [];
        return (
            <div className="manual-trading-container">
                <div className="market">
                    <ChartTradingView symbol={market}/>
                    <div className="manual-trading-panel--container">
                        <div className="manual-trading-panel--container-invisible">&nbsp;</div>
                        <div onClick={onClickBuy} className="manual-trading-panel--button--buy">BUY</div>
                        <div className="manual-trading-panel">
                            <div className="manual-trading-panel--info-row">
                                <div className="manual-trading-panel-info-row--balance">
                                <span className="manual-trading-panel-info-row-balance--text">
                                    Your current balance:&nbsp;
                                </span>
                                    <span className="manual-trading-panel-info-row-balance--value">
                                    {sign}{totalBalance}
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
                </div>
            </div>
        )
    }
}
