const apiBaseUrl = "https://ntrocp887e.execute-api.eu-central-1.amazonaws.com/prod/binance";

function getKlines(symbol, index, interval) {
    let k = 29_900_000;
    let now = Date.now();
    console.log("now", new Date(now))
    let ki = index * k;
    console.log("ki", ki)
    const end = now - ki - (30_000);
    console.log("end", new Date(end))
    const start = end - k;
    console.log("start", new Date(start))
    console.log("dTime", (end - start))
    return fetch(
        `${apiBaseUrl}/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${start}&endTime=${end}`)
        .catch(console.error)
        .then(response => response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
}

class BinanceApi {
    getKlines(symbol, index, interval) {
        return getKlines(symbol, index, interval)
    }
}

const binanceApi = new BinanceApi();

export default binanceApi;
