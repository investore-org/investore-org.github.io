import React, {Component} from 'react';
import './AutoTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import {Redirect} from "react-router-dom";
import ChartTradingView from "../../chart/ChartTradingView";

const BUY_USDT_AMOUNT = 50;

export default class AutoTrading extends Component {

    constructor(props) {
        super(props);
        this.state = {...props};
    }

    componentDidMount() {
        userService.getUserBalance()
            .catch(console.error)
            .then(balance => {
                this.setState({userBalance: balance})
            });
        userService.getOrders("BTC", "USDT")
            .catch(console.error)
            .then(orders => {
                this.setState({orders: orders})
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
        const market = "BTCUSDT";
        const asset = "BTC";
        const quotable = "USDT";
        const sign = "$"
        let totalBalance = this.getDemoBalance() + this.getActiveBalance();
        const onClickBuy = () => {
            if (totalBalance < BUY_USDT_AMOUNT) {
                this.setState({redirectToNoMoney: true});
            } else {
                userService.sendBuy(asset, quotable, BUY_USDT_AMOUNT).catch(console.error)
            }
        };
        let buildOrder = order => (
            <div key={order.id} className="auto-trading-panel--order">
                <div className="auto-trading-panel--order-info-row">
                    market: {order.asset}/{order.quotable}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    status: {order.status}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    side: {order.side}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    amount: {order.amount} {order.quotable}
                </div>
                <div className="auto-trading-panel--order-info-row">
                    price: {order.price}
                </div>
            </div>
        );
        let orders = this.state.orders || [];
        // let firstOrders = orders.length > 3 ? orders.slice(0, 3) : orders;
        // let restOfOrders = orders.length > 3 ? orders.slice(3, orders.length) : [];
        return (
            <div className="auto-trading-container">
                <div className="market">
                    <ChartTradingView symbol={market}/>
                    <div className="auto-trading-panel--container">
                        <div className="auto-trading-panel--container-invisible">&nbsp;</div>
                        <div onClick={onClickBuy} className="auto-trading-panel--button--buy">BUY</div>
                        <div className="auto-trading-panel">
                            <div className="auto-trading-panel--info-row">
                                <div className="auto-trading-panel-info-row--balance">
                                <span className="auto-trading-panel-info-row-balance--text">
                                    Your current balance:&nbsp;
                                </span>
                                    <span className="auto-trading-panel-info-row-balance--value">
                                    {sign}{totalBalance}
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
            </div>
        )
    }
}
