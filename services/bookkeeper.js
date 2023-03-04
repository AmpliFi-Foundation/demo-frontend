import { ethers } from "ethers";

import { AmpilifiContracts } from "constants/contracts.js";
import { Tokens } from "constants/tokens.js";

const ABI = [
    "function debtOf(uint positionId) external view returns (uint debt)",
    "function getERC20Stats(uint positionId) external view returns (address[], uint[], uint[], uint[])",
    "function borrow(uint positionId, uint amount, bytes calldata data) external",
    "function repay(uint positionId, uint amount) external",
]

function buildContract(ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    return new ethers.Contract(AmpilifiContracts.getBookkeeper(), ABI, signer);
}

async function getDebtOfPosition(ethereum, positionId) {
    const Bookkeeper = buildContract(ethereum);
    const result = await Bookkeeper.debtOf(positionId);
    const PUD = Tokens.getTokenBySymbol("PUD");
    return {
        address: PUD.address,
        symbol: PUD.symbol,
        decimals: PUD.decimals,
        value: result,
    };
}

async function getAllERC20AssetOfPosition(ethereum, positionId) {
    const Bookkeeper = buildContract(ethereum);
    const result = await Bookkeeper.getERC20Stats(positionId);

    if (result == null || result[0].length == 0) {
        return [];
    }

    let tokens = [];
    result[0].forEach((address, idx) => {
        const tokenInf = Tokens.getTokenByAddress(address);
        tokens.push({
            address: address,
            symbol: tokenInf.symbol,
            decimals: tokenInf.decimals,
            amount: result[1][idx],
            value: result[2][idx],
            minEquity: result[3][idx],
        });
    });

    return tokens;
}

async function borrow(ethereum, positionID, amount) {
    const Bookkeeper = buildContract(ethereum);
    const PUD = Tokens.getTokenBySymbol("PUD");
    amount = ethers.utils.parseUnits(amount, PUD.decimals);

    return Bookkeeper.borrow(positionID, amount, ethers.utils.toUtf8Bytes(""), {
        gasLimit: 5000000,
    });
}

async function repay(ethereum, positionId, amount) {
    const Bookkeeper = buildContract(ethereum);
    const PUD = Tokens.getTokenBySymbol("PUD");
    amount = ethers.utils.parseUnits(amount, PUD.decimals);

    return Bookkeeper.repay(positionId, amount, {
        gasLimit: 5000000,
    });
}

export const Bookkeeper = {
    getDebtOfPosition,
    getAllERC20AssetOfPosition,
    borrow,
    repay,
};
