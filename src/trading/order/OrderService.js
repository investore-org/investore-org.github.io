import {getAutoTradingOrdersInfo, getManualOrdersInfo} from "../../util/APIUtils";

class OrderService {
    async getManualOrdersInfo(asset, quotable) {
        return await getManualOrdersInfo(asset, quotable)
    }

    async getAutoTradingOrdersInfo(asset, quotable) {
        return await getAutoTradingOrdersInfo(asset, quotable)
    }
}

const orderService = new OrderService();

export default orderService;