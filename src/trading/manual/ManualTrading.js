import React, {Component} from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import './ManualTrading.css';
import userService from "../../user/UserService";
import LoadingIndicator from "../../common/LoadingIndicator";

export default class ManualTrading extends Component {

    constructor(props) {
        super(props);
        this.state = {...props};
    }

    componentDidMount() {
        userService.getUserBalance(this.props.currentUser)
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
        if (!this.state.userBalance) {
            return <LoadingIndicator/>
        }
        const market = "BTCUSDT";
        return (
            <div className="manual-trading-container">
                <div className="market">
                    <div className="chart">
                        <TradingViewWidget
                            symbol={"BINANCE:" + market}
                            autosize
                            interval="1"
                            timezone="Etc/UTC"
                            theme="Dark"
                            locale="en"
                            toolbar_bg="#f1f3f6"
                            enable_publishing={false}
                            hide_side_toolbar={false}
                            allow_symbol_change={false}
                            container_id="tradingview_3d521"
                        />
                    </div>
                    <div className="manual-trading-panel">
                        <div className="manual-trading-panel--info-row">
                            <div className="manual-trading-panel-info-row--balance">
                                <span className="manual-trading-panel-info-row-balance--text">
                                    Your current balance:
                                </span>
                                <span className="manual-trading-panel-info-row-balance--value">
                                    {this.getDemoBalance() + this.getActiveBalance()}
                                </span>
                            </div>
                        </div>
                        <div className="manual-trading-panel--button--buy">BUY</div>
                    </div>
                </div>
            </div>
        )
    }
}