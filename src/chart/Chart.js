import React, {Component} from 'react';
import './Chart.css'
import binanceApi from "../binance/binanceApi";

const CHART_HEIGHT = 550;
const startZoom = 0.2;
const MINUTE_INTERVAL = "1m";

export default class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoomK: startZoom,
            zoomIndex: 0,
        };
    }

    componentDidMount() {
        this.extractKlines();
    }

    extractKlines() {
        let interval = MINUTE_INTERVAL;
        binanceApi.getKlines(this.props.symbol, this.state.zoomIndex, interval).then(_klines => {
            console.log("new first line is " + new Date(_klines[0][0]))
            console.log("new last line is " + new Date(_klines[_klines.length - 1][0]))
            console.log("new candles " + _klines.length)

            let prevKlines = this.state.klines || [];

            if (prevKlines.length) {
                console.log("old first line is " + new Date(prevKlines[0].openTime))
                console.log("old last line is " + new Date(prevKlines[prevKlines.length - 1].openTime))
                console.log("old candles " + prevKlines.length)
            }

            let klines = _klines
                .map(kline => ({
                    openTime: kline[0],
                    openPrice: +kline[1],
                    highestPrice: +kline[2],
                    lowestPrice: +kline[3],
                    closePrice: +kline[4],
                    volume: +kline[5],
                    closeTime: +kline[6],
                    quoteAssetVolume: +kline[7],
                    numberOfTrades: +kline[8],
                    takerBuyBaseAssetVolume: +kline[9],
                    takerBuyQuoteAssetVolume: +kline[10],
                }))
                .concat(prevKlines)
            ;
            const minPrice = klines.map(kline => +kline.lowestPrice).sort()[0];
            const maxPrice = klines.map(kline => +kline.highestPrice).sort()[klines.length - 1];
            const deltaPrice = maxPrice - minPrice;
            const priceK = deltaPrice / CHART_HEIGHT;
            console.log("priceK", priceK)
            const lines = klines.map(kline => {
                const isUpwards = kline.openPrice < kline.closePrice;
                const lowPrice = !isUpwards ? kline.closePrice : kline.openPrice;
                const highPrice = isUpwards ? kline.closePrice : kline.openPrice;
                return {
                    origin: kline,
                    isUpwards: isUpwards,
                    bottom: (lowPrice - minPrice) / priceK,
                    top: (maxPrice - highPrice) / priceK,
                    highestTop: (maxPrice - kline.highestPrice) / priceK,
                    lowestBottom: (kline.lowestPrice - minPrice) / priceK,
                    height: (highPrice - lowPrice) / priceK,
                }
            });
            let newState = {
                klines: klines,
                minPrice: minPrice,
                maxPrice: maxPrice,
            };
            newState.lines = lines;
            newState[this.state.zoomK] = lines;
            this.setState(newState);
        })
    }

    render() {
        if (!this.state.klines) {
            return null
        }
        const onZoomMinusCLicked = () => {
            this.setState(
                {
                    zoomK: this.state.zoomK / 2,
                    zoomIndex: this.state.zoomIndex + 1,
                },
                () => this.extractKlines()
            )
        }
        const onZoomPlusCLicked = () => {
            this.setState(
                {
                    zoomK: this.state.zoomK * 2,
                    zoomIndex: this.state.zoomIndex - 1,
                },
                () => this.extractKlines()
            )
        }
        let usedTimes = {};
        return [
            <div key={"chart-wide"} className={"chart-wide"}>
                <div className="klines">
                    {this.state.lines.map(line => {
                        if (usedTimes[line.origin.openTime]) {
                            return null;
                        }
                        usedTimes[line.origin.openTime] = true;
                        return <div key={line.origin.openTime}
                                    style={{
                                        backgroundColor: line.isUpwards ? "green" : "red",
                                        top: line.top,
                                        bottom: line.bottom,
                                        height: line.height,
                                        width: (2 / (this.state.zoomIndex + 1)) + "px",
                                    }}
                                    className="kline">
                        </div>;
                    })}
                </div>
            </div>,
            <div key="chart-wide-options" className="chart-wide-options">
                <div className="chart-wide-option--left">
                    <div onClick={onZoomMinusCLicked} className="chart-wide-option--zoom-minus">-</div>
                    <div onClick={onZoomPlusCLicked} className="chart-wide-option--zoom-plus">+</div>
                </div>
                <div className="chart-wide-option--right">
                    <div className="chart-wide-option--prev-page">&lt;</div>
                    <div className="chart-wide-option--next-page">&gt;</div>
                </div>
            </div>
        ]
    }
}
