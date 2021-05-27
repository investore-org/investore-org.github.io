const getStatusText = (status) => {
    return status.toLowerCase().replaceAll("_", " ")
}

class OrderBuilder {

    buildHiddenOrder(order, onShow) {
        let className = "manual-trading-panel--hidden-order" + (order?.real
            ? " manual-trading-panel--hidden-order-real" : "");
        return (
            <div key={order.id}
                 onClick={() => onShow(order)}
                 className={className}>
                {(order.profit <= 0) || '+'}{order.profit}
            </div>
        )
    }

    buildOrder(order, onClose, onCancel, onHide) {
        const buildCancelButton = (order) => {
            return <div onClick={() => onCancel(order)}
                        className="order-control-button order-control-cancel">x</div>;
        }
        const buildHideButton = (order) => {
            return <div onClick={() => onHide(order)}
                        className="order-control-button order-control-hide">-</div>;
        }
        const buildCloseButton = (order) => {
            return <div onClick={() => onClose(order)}
                        className="order-control-button order-control-close">x</div>;
        }
        const buildControlsPanel = (order) => (
            <div className="order-controls-panel">
                {
                    order.status === 'INIT_BUY_ORDER_SENT' ? buildCancelButton(order) : null
                }
                {
                    (order.status === 'COMPLETED' || order.status === 'LIQUIDATED') ? buildHideButton(order) : null
                }
                {
                    (order.status === 'CREATED' || order.status === 'CANCELED') ? buildCloseButton(order) : null
                }
            </div>
        )
        let className = "manual-trading-panel--order" + (order?.real
            ? " manual-trading-panel--order-real" : "");
        let statusText = `status: ${getStatusText(order.status)}`;
        let sideText = `side: ${order.side}`;
        let investedText = `invested: ${order.amountQuotable} ${order.quotable}`;
        let boughtText = `bought: ${order.boughtAssetQuantity} ${order.asset}`;
        let priceText = order.sellOrderPrice
            ? `sold price: ${order.sellOrderPrice}`
            : `bought price: ${order.buyOrderPrice}`;
        let lastPriceText = `last price: ${order.lastPrice}`;
        let minProfitText = `min profit: ${order.minProfitSellPrice}`;
        let profitText = `profit: ${order.profit}`;
        let dateText = order.completedDate
            ? `finished: ${new Date(order.completedDate).toLocaleString()}`
            : `created: ${new Date(order.createdDate).toLocaleString()}`;
        let infoRowClassName = "manual-trading-panel--order-info-row";
        return (
            <div key={order.id} className={className}>
                <div className="manual-trading-panel--order-info-block">
                    <div className={infoRowClassName} title={statusText}>{statusText}</div>
                    <div className={infoRowClassName} title={sideText}>{sideText}</div>
                    <div className={infoRowClassName} title={investedText}>{investedText}</div>
                    <div className={infoRowClassName} title={boughtText}>{boughtText}</div>
                    <div className={infoRowClassName} title={priceText}>{priceText}</div>
                    <div className={infoRowClassName} title={lastPriceText}>{lastPriceText}</div>
                    <div className={infoRowClassName} title={minProfitText}>{minProfitText}</div>
                    <div className={infoRowClassName} title={profitText}>{profitText}</div>
                    <div className={infoRowClassName} title={dateText}>{dateText}</div>
                </div>
                {buildControlsPanel(order)}
            </div>
        );
    };
}

const orderBuilder = new OrderBuilder();

export default orderBuilder;

