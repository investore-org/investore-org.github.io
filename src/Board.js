import React, {Component} from "react";

const rootURL = "http://localhost:8079";

const maxRows = 6;

function getPropQualityClass(condition, entity) {
    return "prop-value" + ((entity.status === "COMPLETED" || entity.status === "LIQUIDATED")
        ? ""
        : (" prop-value--" + (condition ? "positive" : "negative")))
}

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            market: props.market,
        };
        props.onRegister({
            update: (data) => this.setState(
                (this.state.skipUpdates && this.state.skipUpdates > 0)
                    ? {skipUpdates: this.state.skipUpdates - 1}
                    : {response: data}
            )
        })
    }

    buildLiquidation(entity) {
        let isSomething = entity.liquidationLimit
            && entity.profit
            && ((entity.profit + entity.liquidationLimit) >= 0);
        let propQualityClass = getPropQualityClass(isSomething, entity);
        let minusLimit = -entity.liquidationLimit;
        let propQualityClass1 = getPropQualityClass((entity.liquidationPrice <= entity.lastPrice), entity);
        let liquidationPrice = entity.liquidationPrice;
        return (<div className="projection-row">
            <span className="prop-name">liquidation:&nbsp;</span>
            {
                entity.liquidationLimit
                    ? <span className={propQualityClass}>{minusLimit}</span>
                    : <span className={propQualityClass1}>{liquidationPrice}</span>
            }
        </div>)
    }

    render() {
        if (!this.state.response) {
            return null;
        }
        let marketToMaxHiddenProfit = this.state.response
            .filter(e => e.hidden && (e.status !== "NO_MONEY"))
            .reduce((result, element) => {
                let profit1 = +(element.profit || 0);
                let profit2 = result[element.market];
                if (!profit2 || (profit1 > profit2)) {
                    result[element.market] = profit1
                }
                return result
            }, {});
        let dataContainer = (this.state.response).reduce((previousValue, currentValue) => {
                previousValue[currentValue.market] = previousValue[currentValue.market] || [];
                previousValue[currentValue.market].push(currentValue);
                return previousValue;
            },
            {});
        let buildEntity = (o) => {
            let entries = Object.entries(o);
            return (
                <span key={o.id} className="entity">{entries.map(e => (
                    <div key={e[0]} className="row">
                        <span className="propName">{e[0]}:&nbsp;</span>
                        <span className="propName">{((e[1] === null) ? "null" : e[1]).toString()}</span>
                    </div>))}
                </span>
            )
        };
        const sendCommand = (entity, command) => {
            fetch(`${rootURL}/commands/projection/${command}/${entity.id}`).catch(console.error)
            this.setState({
                skipUpdates: orders.length > 100 ? 1 : 2,
                response: this.state.response
            })
        };
        const hide = entity => {
            entity.hidden = true;
            sendCommand(entity, "hide")
        };
        const liquidateNow = entity => {
            sendCommand(entity, "liquidate")
        };
        const executeNow = entity => {
            sendCommand(entity, "execute")
        };
        const show = (entity) => {
            entity.hidden = false;
            sendCommand(entity, "show")
        };
        const buildCloseButton = entity => (
            <button className={"projection-button projection-button--hide"}
                    title={"Hide"}
                    onClick={() => hide(entity)}>-</button>
        );
        const buildSetStatusSelection = entity => {
            const onStatusSelect = (status) => {
                sendCommand(entity, status);
                openStatusSelection(entity);
            }
            const buildRow = (status) => (
                <div className="entity-status"
                     onClick={() => onStatusSelect(status)}>{status}</div>
            )
            return (
                this.state.statusSelection === entity.id
                    ? <div className="status-selection">{[
                        buildRow("BUY_ORDER_SENT"),
                        buildRow("SELL_ORDER_SENT"),
                        buildRow("REBUY_ORDER_SENT"),
                        buildRow("RESELL_ORDER_SENT"),
                    ]}
                    </div>
                    : null
            );
        };
        const openStatusSelection = entity => {
            this.setState({
                statusSelection: (this.state.statusSelection === entity.id ? null : entity.id)
            });
        }
        const buildSetStatusButton = entity => (
            (entity.status === "NO_MONEY" || entity.status === "FAILED" || entity.status === "CLOSED")
                ? <button className={"projection-button projection-button--status"}
                          title={"Set status"}
                          onClick={() => openStatusSelection(entity)}>status</button>
                : null
        );
        const buildLiquidateButton = entity => {
            if ((entity.real && (entity.status === "BUY_ORDER_SENT"))
                || (entity.real && (entity.status === "RESELL_ORDER_SENT"))
            ) {
                return <button className={"projection-button projection-button--liquidate"}
                               title={"Liquidate"}
                               onClick={() => liquidateNow(entity)}>liquidate</button>;
            } else {
                return null;
            }
        };
        const buildExecuteButton = entity => {
            if ((entity.real && (entity.status === "REBUY_ORDER_SENT"))
                || (entity.real && (entity.status === "SELL_ORDER_SENT"))
            ) {
                return <button className={"projection-button projection-button--execute"}
                               title={"Execute"}
                               onClick={() => executeNow(entity)}>execute</button>;
            } else {
                return null;
            }
        };
        const dismiss = entity => {
            entity.dismiss = true;
            entity.hidden = true;
            sendCommand(entity, "dismiss")
        };
        const buildDismissButton = entity =>
            (entity.status === "COMPLETED")
                ? <button className={"projection-button projection-button--dismiss"}
                          title={"Dismiss"}
                          onClick={() => dismiss(entity)}>x</button>
                : null
        ;
        const buildHighestOrLowestPriceRow = entity => {
            let word = entity.sellingStrategy ? "lowest" : "highest";
            let price = entity.sellingStrategy ? entity.lowestTrackedPrice : entity.highestTrackedPrice;
            return [
                <span className="prop-name">{word}: </span>,
                <span className="prop-value">{price}</span>
            ]
        };
        const buildClosePriceOrMinProfitPrice = entity => {
            if (entity.closingPriceLimit) {
                return (<div className="projection-row">
                    <span className="prop-name">close:&nbsp;</span>
                    <span className={
                        getPropQualityClass(
                            (entity.sellingStrategy && (entity.closingPriceLimit > entity.lastPrice))
                            || (!entity.sellingStrategy && (entity.closingPriceLimit <= entity.lastPrice)),
                            entity)
                    }>{entity.closingPriceLimit || 0}</span>
                </div>)
            }
            let propQualityClass = entity.sellingStrategy
                ? getPropQualityClass((entity.minProfitBuyPrice >= entity.lastPrice), entity)
                : getPropQualityClass((entity.minProfitSellPrice <= entity.lastPrice), entity);
            let minProfit = entity.sellingStrategy
                ? entity.minProfitBuyPrice
                : entity.minProfitSellPrice;
            return (<div className="projection-row">
                <span className="prop-name">min profit:&nbsp;</span>
                <span className={propQualityClass}>{minProfit}</span>
            </div>)
        };
        let buildProjection = (entity) => {
            let statusClassName = "projection-" + (entity.status || "").toLowerCase();
            let realityClassName = "projection-" + (entity.real ? "real" : "fake");
            let className = statusClassName + " projection " + realityClassName;
            let hiddenClassName = statusClassName + " projection-hidden " + realityClassName;

            if (entity.hidden) {
                let sign = entity.profit > 0 ? "+" : "";
                let scaledProfit = parseFloat(entity.profit).toFixed(8);
                let maxProfitElement = marketToMaxHiddenProfit[entity.market] || 0;
                let opacity = (scaledProfit / maxProfitElement) * 0.9;
                let colorStr = `rgba(0, 254, 0, ${opacity})`;
                let style = entity.status === "COMPLETED" ? {
                    backgroundColor: colorStr,
                } : {};
                return <div className={hiddenClassName}
                            style={style}
                            onClick={() => show(entity)}>{`${sign}${scaledProfit}`}</div>
            }

            return (
                <div id={entity.id} key={entity.id} className={className}>
                    <div className="order-controls">{[
                        buildDismissButton(entity),
                        (entity.status === "SELL_ORDER_SENT" || entity.status === "REBUY_ORDER_SENT")
                            ? buildExecuteButton(entity) : buildLiquidateButton(entity),
                        buildSetStatusButton(entity),
                        buildSetStatusSelection(entity),
                        buildCloseButton(entity),
                    ]}</div>
                    <div className="projection-row">
                        {buildHighestOrLowestPriceRow(entity)}
                    </div>
                    <div className="projection-row">
                        <span className="prop-name">latest:&nbsp;</span>
                        <span className="prop-value">{entity.lastPrice}</span>
                    </div>
                    {buildClosePriceOrMinProfitPrice(entity)}
                    <div className="projection-row">
                        {
                            (entity.sellingStrategy) ? [
                                <span className="prop-name">sold:&nbsp;</span>,
                                <span className={
                                    getPropQualityClass((entity.sellPrice >= entity.lastPrice), entity)
                                }>{entity.sellPrice}</span>
                            ] : [
                                <span className="prop-name">bought:&nbsp;</span>,
                                <span className={
                                    getPropQualityClass((entity.buyPrice <= entity.lastPrice), entity)
                                }>{entity.buyPrice}</span>
                            ]
                        }
                    </div>
                    {
                        this.buildLiquidation(entity)
                    }
                    <div className="projection-row">
                        <span className="prop-name">profit:&nbsp;</span>
                        <span className={
                            getPropQualityClass((entity.profit > 0), entity)
                        }>{entity.profit}</span>
                    </div>
                </div>
            );
        };

        function buildOpenOrders(orders) {
            if (orders.length < 4) {
                return []
            }
            let openOrders = orders.filter(o => !o.hidden);
            let length = openOrders.length;
            let notPresentOrders = length % 4;
            let presentOrders = length - notPresentOrders;
            return openOrders.slice(0, presentOrders).map(buildProjection)
        }

        function buildMidRowOpen(orders) {
            let openOrders = orders.filter(o => !o.hidden);
            let length = openOrders.length;
            let toShowOpenOrders = length % 4;
            if (!toShowOpenOrders) {
                return []
            }
            let presentOrders = length - toShowOpenOrders;
            let showOpen = openOrders.slice(presentOrders, length);
            return (
                <div className={"projections-mid-open-" + toShowOpenOrders}>
                    {showOpen.map(buildProjection)}
                </div>
            )
        }

        function buildMidRowHidden(orders) {
            let openOrders = orders.filter(o => !o.hidden);
            let hiddenOrders = orders.filter(o => o.hidden);
            let length = openOrders.length;
            let toShowOpenOrders = length % 4;
            if (!toShowOpenOrders) {
                return []
            }
            let hiddenOrdersLength = hiddenOrders.length;
            let openPositions = 4 - toShowOpenOrders;
            let timesOfHiddenOrderWidthInOpenOrderWith = 2;
            let toShowHidden = openPositions * timesOfHiddenOrderWidthInOpenOrderWith;
            if (!hiddenOrdersLength) {
                return []
            }
            if (hiddenOrdersLength < toShowHidden) {
                return hiddenOrders.map(buildProjection)
            }
            let rowsNumber = Math.min(maxRows, hiddenOrders.length / toShowHidden);
            let rows = [];
            for (let i = 0; i < rowsNumber; i++) {
                let showHidden = hiddenOrders.slice(toShowHidden * i, toShowHidden * (i + 1));
                rows.push(
                    <div className={"projections-mid-hidden-row-" + openPositions}>
                        {showHidden.map(buildProjection)}
                    </div>
                )
            }
            return <div className={"projections-mid-hidden-" + openPositions}>{rows}</div>
        }

        function buildLastRow(orders) {
            let hiddenOrders = orders.filter(o => o.hidden);
            if (!hiddenOrders.length) {
                return []
            }
            let openOrders = orders.filter(o => !o.hidden);
            let lengthOpen = openOrders.length;
            let toShowOpenOrders = lengthOpen % 4;
            if (!toShowOpenOrders) {
                return hiddenOrders.map(buildProjection)
            }
            let timesOfHiddenOrderWidthInOpenOrderWith = 2;
            let toShowHidden = (4 - toShowOpenOrders) * timesOfHiddenOrderWidthInOpenOrderWith;
            let rowsNeeded = hiddenOrders.length / toShowHidden;
            if (rowsNeeded <= maxRows) {
                return []
            }
            return hiddenOrders
                .slice(toShowHidden * maxRows, hiddenOrders.length)
                .map(buildProjection)
        }

        let orders = dataContainer[this.state.market] || [];
        return (
            <div className="board">
                {this.buildControls(this.state.market, orders)}
                <div className="orders">
                    <div className="projections">
                        {buildOpenOrders(orders)}
                    </div>
                    <div className="projections projections-mid">
                        {buildMidRowOpen(orders)}
                        {buildMidRowHidden(orders)}
                    </div>
                    <div className="projections">
                        {buildLastRow(orders)}
                    </div>
                </div>
                <div className="entities-trigger"
                     onClick={() => this.setState({entitiesOpen: !this.state.entitiesOpen})}
                >{this.state.entitiesOpen ? "Hide details" : "Show details"}</div>
                <div className="entities">
                    {this.state.entitiesOpen ? orders.map(buildEntity) : []}
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        this.state.socket?.close(1000, "bye")
    }

    buildControls(market, orders) {
        let input;
        let inputSell;
        let totalCompletedProfit = (orders
            .filter(o => o.real && (o.status === "COMPLETED" || o.status === "LIQUIDATED"))
            .reduce((result, o) => {
                return result + (o.profit || 0)
            }, 0)).toFixed(8);
        let testTotalCompletedProfit = (orders
            .filter(o => !o.real && (o.status === "COMPLETED" || o.status === "LIQUIDATED"))
            .reduce((result, o) => {
                return result + (o.profit || 0)
            }, 0)).toFixed(8);
        let sign = totalCompletedProfit > 0 ? "+" : "";
        let signClass = totalCompletedProfit > 0 ? "plus" : "minus";
        let totalOpenProfit = (orders
            .filter(o => o.real && (o.status === "BUY_ORDER_SENT"
                || o.status === "SELL_ORDER_SENT"
                || o.status === "RESELL_ORDER_SENT"
                || o.status === "REBUY_ORDER_SENT"))
            .reduce((result, o) => {
                return result + (o.profit || 0)
            }, 0)).toFixed(8);
        let signOpen = totalOpenProfit > 0 ? "+" : "";
        let signOpenClass = totalOpenProfit > 0 ? "plus" : "minus";
        let boughtAmount = (orders
            .filter(o => o.real && (o.status === "BUY_ORDER_SENT" || o.status === "SELL_ORDER_SENT"))
            .reduce((result, o) => {
                return result + (o.amount || 0)
            }, 0)).toFixed(6);
        let soldAmount = (orders
            .filter(o => o.real && (o.status === "REBUY_ORDER_SENT" || o.status === "RESELL_ORDER_SENT"))
            .reduce((result, o) => {
                return result + (o.amount || 0)
            }, 0)).toFixed(6);
        return [
            <div className="controls">
                <span className="total-profit-label">Done </span>
                <span className={`total-profit-value-${signClass}`}>{`${sign}${totalCompletedProfit}`}</span>
                <span className="total-profit-label">Test Done </span>
                <span className={`total-profit-value-${signClass}`}>{`${sign}${testTotalCompletedProfit}`}</span>
                <span className="total-profit-label">Open </span>
                <span className={`total-profit-value-${signOpenClass}`}>{`${signOpen}${totalOpenProfit}`}</span>
                <span className="total-profit-label">Bought {boughtAmount || 0}</span>
                <span className="total-profit-label">Sold {soldAmount || 0}</span>
            </div>,
            <div className="controls-more">
                <button className="button controls-button button--buy"
                        onClick={() => this.testBuy(market)}>TEST BUY
                </button>
                <button className="button controls-button button--buy"
                        onClick={() => this.testSell(market)}>TEST SELL
                </button>
                <input ref={instance => input = instance}
                       type="number"
                       defaultValue="0.3"
                       className="input input-liquidation-buy"/>
                <button className="button controls-button button--liquidation-buy"
                        onClick={() => {
                            let value = input?.valueAsNumber;
                            if (!isNaN(value)) {
                                this.realBuy(market, +value)
                            }
                        }}>REAL BUY
                </button>
                <input ref={instance => inputSell = instance}
                       type="number"
                       defaultValue="0.3"
                       className="input input-liquidation-sell"/>
                <button className="button controls-button button--liquidation-sell"
                        onClick={() => {
                            let value = inputSell?.valueAsNumber;
                            if (!isNaN(value)) {
                                this.realSell(market, +value)
                            }
                        }}>REAL SELL
                </button>
            </div>
        ]
    }

    testBuy(market) {
        fetch(`${rootURL}/commands/trade?command=start&nonce=1608384841&market=${market}`)
            .catch(console.error)
            .then(r => console.log(r.body))
    }

    testSell(market) {
        fetch(`${rootURL}/commands/trade?command=startSell&nonce=1608384841&market=${market}`)
            .catch(console.error)
            .then(r => console.log(r.body))
    }

    realBuy(market, liquidation) {
        fetch(`${rootURL}/commands/trade?command=start&nonce=${Date.now()}&market=${market}&liquidation=${liquidation}`)
            .catch(console.error)
            .then(r => console.log(r.body))
    }

    realSell(market, liquidation) {
        fetch(`${rootURL}/commands/trade?command=startSell&nonce=${Date.now()}&market=${market}&liquidation=${liquidation}`)
            .catch(console.error)
            .then(r => console.log(r.body))
    }
}
