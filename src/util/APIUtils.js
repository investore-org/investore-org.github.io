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
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function getBalance() {
    return request({
        url: `${API_BASE_URL}/users/current/balance`,
        method: 'GET'
    });
}

export function requestDemoDeposit() {
    return request({
        url: `${API_BASE_URL}/demo/deposit`,
        method: 'POST'
    });
}

export function sendBuy(asset, quotable, amount) {
    return request({
        url: `${API_BASE_URL}/orders`,
        method: 'POST',
        body: JSON.stringify({
            asset: asset,
            quotable: quotable,
            side: 'BUY',
            amount: amount,
        }),
    });
}

export function sendAutotradingInvest(asset, quotable, amount) {
    return request({
        url: `${API_BASE_URL}/investments/auto-trading`,
        method: 'POST',
        body: JSON.stringify({
            asset: asset,
            quotable: quotable,
            side: 'BUY',
            amount: amount,
        }),
    });
}

export function getOrders(asset, quotable) {
    return request({
        url: `${API_BASE_URL}/orders?asset=${asset}&quotable=${quotable}`,
        method: 'GET',
    });
}

export function getAutotradingOrders(asset, quotable) {
    return request({
        url: `${API_BASE_URL}/orders?asset=${asset}&quotable=${quotable}`,
        method: 'GET',
    });
}

