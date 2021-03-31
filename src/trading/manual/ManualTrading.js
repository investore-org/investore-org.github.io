import React, {Component} from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import './ManualTrading.css';

export default class ManualTrading extends Component {
    render() {
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

                    </div>
                </div>
            </div>
        )
    }
}