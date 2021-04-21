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
                    order.status === 'COMPLETED' ? buildHideButton(order) : null
                }
                {
                    (order.status === 'CREATED' || order.status === 'CANCELED') ? buildCloseButton(order) : null
                }
            </div>
        )
        const buildDateRow = order => {
            return order.completedDate
                ? `completed: ${new Date(order.completedDate).toLocaleString()}`
                : `created: ${new Date(order.createdDate).toLocaleString()}`
        }

        let className = "manual-trading-panel--order" + (order?.real
            ? " manual-trading-panel--order-real" : "");
        return (
            <div key={order.id} className={className}>
                <div className="manual-trading-panel--order-info-block">
                    <div className="manual-trading-panel--order-info-row">
                        market: {order.asset}-{order.quotable}
                    </div>
                    <div className="manual-trading-panel--order-info-row">
                        status: {getStatusText(order.status)}
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
                    <div className="manual-trading-panel--order-info-row">{
                        order.sellOrderPrice
                            ? `sold price: ${order.sellOrderPrice}`
                            : `bought price: ${order.buyOrderPrice}`
                    }
                    </div>
                    <div className="manual-trading-panel--order-info-row">
                        last price: {order.lastPrice}
                    </div>
                    <div className="manual-trading-panel--order-info-row">
                        profit: {order.profit}
                    </div>
                    <div className="manual-trading-panel--order-info-row">
                        {buildDateRow(order)}
                    </div>
                </div>
                {buildControlsPanel(order)}
            </div>
        );
    };
}

const orderBuilder = new OrderBuilder();

export default orderBuilder;

