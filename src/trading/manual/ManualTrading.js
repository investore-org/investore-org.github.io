import React, {Component} from 'react';
import './ManualTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import {Redirect} from "react-router-dom";
import Chart from "../../chart/Chart";

const BUY_USDT_AMOUNT = 50;

export default class ManualTrading extends Component {

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
            <div key={order.id} className="manual-trading-panel--order">
                <div className="manual-trading-panel--order-info-row">
                    market: {order.asset}/{order.quotable}
                </div>
                <div className="manual-trading-panel--order-info-row">
                    status: {order.status}
                </div>
                <div className="manual-trading-panel--order-info-row">
                    side: {order.side}
                </div>
                <div className="manual-trading-panel--order-info-row">
                    amount: {order.amount} {order.quotable}
                </div>
                <div className="manual-trading-panel--order-info-row">
                    price: {order.price}
                </div>
            </div>
        );
        let orders = this.state.orders || [];
        // let firstOrders = orders.length > 3 ? orders.slice(0, 3) : orders;
        // let restOfOrders = orders.length > 3 ? orders.slice(3, orders.length) : [];
        return (
            <div className="manual-trading-container">
                <div className="market">
                    <Chart symbol={market}/>
                    <div className="manual-trading-panel--container">
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
