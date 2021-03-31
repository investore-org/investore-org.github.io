import {getBalance, requestDemoDeposit} from "../util/APIUtils";

class UserService {
    async getUserBalance() {
        return await getBalance()
    }

    async requestDemoDeposit() {
        return await requestDemoDeposit()
    }
}

const userService = new UserService();

export default userService;
