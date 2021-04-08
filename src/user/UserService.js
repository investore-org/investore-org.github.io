import {
    getAutoTradingOrders,
    getBalance,
    getManualOrders,
    requestDemoDeposit,
    sendAutoTradingInvest,
    sendBuy
} from "../util/APIUtils";

class UserService {
    async getUserBalance() {
        return await getBalance()
    }

    async requestDemoDeposit() {
        return await requestDemoDeposit()
    }

    async sendBuy(asset, quotable, amount) {
        return await sendBuy(asset, quotable, amount)
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
}

const userService = new UserService();

export default userService;
