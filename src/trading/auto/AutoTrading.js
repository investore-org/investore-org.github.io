import React, {Component} from 'react';
import './AutoTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import AutoTradingMarket from "./AutoTradingMarket";

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
    }

    render() {
        if (!this.state.userBalance) {
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
        return (
            <div className="auto-trading-container">{markets.map(market => (
                <AutoTradingMarket market={market} userBalance={this.state.userBalance}/>
            ))}</div>
        )
    }
}
