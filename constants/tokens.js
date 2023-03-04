
const _tokens = [
    {
        address: "0x0b27a79cb9C0B38eE06Ca3d94DAA68e0Ed17F953",
        decimals: 18,
        symbol: "PUD",
    },
    {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        symbol: "USDC",
    },
    {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: 18,
        symbol: "DAI",
    }
];

const _goerliTokens = [
    {
        address: "0xdEE798a8Cb54757BEd361d5479c818362c24e42D",
        decimals: 18,
        symbol: "PUD",
    },
    {
        address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
        decimals: 6,
        symbol: "USDC",
    },
    {
        address: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
        decimals: 18,
        symbol: "DAI",
    }
];

let _tokenMapCache = _buildMap(1);

function _buildMap(chainId) {
    let src = chainId == 5 ? _goerliTokens : _tokens;

    return src.reduce((col, item) => {
        col.byAddr[item.address] = item;
        col.bySym[item.symbol] = item;
        col.all.push(item);
        return col;
    }, {byAddr:{}, bySym:{}, all: []});
}

function setChainId(chainId) {
    _tokenMapCache = _buildMap(chainId);
}

function getTokenByAddress(addr) {
    const token = _tokenMapCache.byAddr[addr];
    if (token == null) {
        throw "Token not found.";
    }
    return token;
}

function getTokenBySymbol(symbol) {
    const token = _tokenMapCache.bySym[symbol];
    if (token == null) {
        throw "Token not found.";
    }
    return token;
}

export const Tokens = {
    getTokenByAddress,
    getTokenBySymbol,
    getAllTokens: () => {return _tokenMapCache.all; },
    setChainId
};
