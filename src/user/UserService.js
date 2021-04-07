import {
    getAutotradingOrders,
    getBalance,
    getOrders,
    requestDemoDeposit,
    sendAutotradingInvest,
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

    async sendAutotradingInvest(asset, quotable, amount) {
        return await sendAutotradingInvest(asset, quotable, amount)
    }

    async getOrders(asset, quotable) {
        return await getOrders(asset, quotable)
    }

    async getAutotradingOrders(asset, quotable) {
        return await getAutotradingOrders(asset, quotable)
    }
}

const userService = new UserService();

export default userService;
