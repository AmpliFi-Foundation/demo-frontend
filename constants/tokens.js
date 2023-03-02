
const PUD = {
    address: "0x0b27a79cb9C0B38eE06Ca3d94DAA68e0Ed17F953",
    decimals: 6,
    symbol: "PUD",
    logo: ""
}

const USDC = {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    symbol: "USDC",
    logo: ""
}

const DAI = {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    symbol: "DAI",
    logo: ""
}

const _tokenMap = [PUD, USDC, DAI].reduce((col, item) => {
    col[item.address] = item;
    return col;
}, {});

function getTokenByAddress(addr) {
    const token = _tokenMap[addr];
    if (token == null) {
        throw "Token not found.";
    }
    return token;
}

export const Tokens = {
    PUD,
    USDC,
    DAI,
    getTokenByAddress
}