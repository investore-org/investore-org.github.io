import {ACCESS_TOKEN, API_BASE_URL} from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/users/current",
        method: 'GET',
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest),
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest),
    });
}

export function getBalance() {
    return request({
        url: `${API_BASE_URL}/balances/current`,
        method: 'GET',
    });
}

export function requestDemoDeposit() {
    return request({
        url: `${API_BASE_URL}/demo/deposit`,
        method: 'POST',
    });
}

export function sendBuy(asset, quotable, amount, isReal) {
    return sendInvest(asset, quotable, amount, 'MANUAL', isReal);
}

export function sendAutoTradingInvest(asset, quotable, amount) {
    return sendInvest(asset, quotable, amount, 'AUTO');
}

function sendInvest(asset, quotable, amount, type, isReal) {
    return request({
        url: `${API_BASE_URL}/orders`,
        method: 'POST',
        body: JSON.stringify({
            asset: asset,
            quotable: quotable,
            side: 'BUY',
            amountQuotable: amount,
            orderType: type,
            real: isReal,
        }),
    });
}

export function sendCancel(orderId) {
    return sendCommand("cancel", orderId)
}

export function sendHide(orderId) {
    return sendCommand("hide", orderId)
}

export function sendShow(orderId) {
    return sendCommand("show", orderId)
}

function sendCommand(command, orderId) {
    return request({
        url: `${API_BASE_URL}/commands/orders/${command}/${orderId}`,
        method: 'POST',
    });
}

export function getManualOrders(asset, quotable) {
    return getOrders(asset, quotable, 'MANUAL');
}

export function getAutoTradingOrders(asset, quotable) {
    return getOrders(asset, quotable, 'AUTO');
}

function getOrders(asset, quotable, orderType) {
    return request({
        url: `${API_BASE_URL}/orders?asset=${asset}&quotable=${quotable}&orderType=${orderType}`,
        method: 'GET',
    });
}

export function getManualHiddenOrders(asset, quotable) {
    return getHiddenOrders(asset, quotable, 'MANUAL');
}

export function getAutoTradingHiddenOrders(asset, quotable) {
    return getHiddenOrders(asset, quotable, 'AUTO');
}

function getHiddenOrders(asset, quotable, orderType) {
    return request({
        url: `${API_BASE_URL}/orders/hidden?asset=${asset}&quotable=${quotable}&orderType=${orderType}`,
        method: 'GET',
    });
}

