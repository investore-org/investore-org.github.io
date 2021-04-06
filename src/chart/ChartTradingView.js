import React, {Component} from 'react';
import './Chart.css'
import TradingViewWidget from 'react-tradingview-widget';

const CHART_HEIGHT = 450;
const startZoom = 0.2;
const MINUTE_INTERVAL = "1m";

export default class ChartTradingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoomK: startZoom,
            zoomIndex: 0,
        };
    }

    componentDidMount() {
    }

    render() {
        const market = "BTCUSDT";
        return (
            <div key={"chart-wide"} className={"chart-wide"}>
                <div className="chart-wide-wrap">
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
            </div>
        )
    }
}
