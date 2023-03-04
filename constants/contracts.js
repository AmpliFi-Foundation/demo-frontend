const _contracts = {
    Bookkeeper: "0x7bdd3b028C4796eF0EAf07d11394d0d9d8c24139",
    UniswapV3Operator: "0x47c05BCCA7d57c87083EB4e586007530eE4539e9",
    PUD: "0x0b27a79cb9C0B38eE06Ca3d94DAA68e0Ed17F953",
    Registra: ""
}

const _goerliContracts = {
    Bookkeeper: "0x0367c8dea3a4Feb29aa67b7D3883593aBf78b5bA",
    UniswapV3Operator: "0x8179944D08EE97ae7dae2F4C8B445001Da865383",
    PUD: "0xdEE798a8Cb54757BEd361d5479c818362c24e42D",
}

let _chainId = 1;

function setChainId(chainId) {
    _chainId = chainId;
}

function getBookkeeper() {
    return _chainId == 5 ? _goerliContracts.Bookkeeper : _contracts.Bookkeeper;
}

function getPUD() {
    return _chainId == 5 ? _goerliContracts.PUD : _contracts.PUD;
}

function getUniswapV3Operator() {
    return _chainId == 5 ? _goerliContracts.UniswapV3Operator : _contracts.UniswapV3Operator;
}

export const AmpilifiContracts = {
  getPUD,
  getBookkeeper,
  getUniswapV3Operator,
  setChainId,
};
