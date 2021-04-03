import {getBalance, getOrders, requestDemoDeposit, sendBuy} from "../util/APIUtils";

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

    async getOrders(asset, quotable) {
        return await getOrders(asset, quotable)
    }
}

const userService = new UserService();

export default userService;
