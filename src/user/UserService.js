import {
    getAutoTradingHiddenOrders,
    getAutoTradingOrders,
    getBalance,
    getManualHiddenOrders,
    getManualOrders,
    requestDemoDeposit,
    sendAutoTradingInvest,
    sendBuy,
    sendCancel,
    sendHide,
    sendShow
} from "../util/APIUtils";

class UserService {
    async getUserBalance() {
        return await getBalance()
    }

    async requestDemoDeposit() {
        return await requestDemoDeposit()
    }

    async sendBuy(asset, quotable, amount, isReal) {
        return await sendBuy(asset, quotable, amount, isReal)
    }

    async sendAutoTradingInvest(asset, quotable, amount) {
        return await sendAutoTradingInvest(asset, quotable, amount)
    }

    async getManualOrders(asset, quotable) {
        return await getManualOrders(asset, quotable)
    }

    async getAutoTradingOrders(asset, quotable) {
        return await getAutoTradingOrders(asset, quotable)
    }

    async getManualHiddenOrders(asset, quotable) {
        return await getManualHiddenOrders(asset, quotable)
    }

    async getAutoTradingHiddenOrders(asset, quotable) {
        return await getAutoTradingHiddenOrders(asset, quotable)
    }

    async sendCancel(investId) {
        return await sendCancel(investId)
    }

    async sendHide(investId) {
        return await sendHide(investId)
    }

    async sendShow(investId) {
        return await sendShow(investId)
    }
}

const userService = new UserService();

export default userService;
