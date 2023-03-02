import { ethers } from "ethers";

import { AmpilifiContracts } from "constants/contracts.js";
import { Tokens } from "constants/tokens.js";

const ABI = [
    "function getERC20Stats(uint positionId) external view returns (address[], uint[], uint[], uint[])",
    "function borrow(uint positionId, uint amount, bytes calldata data) external"
]

function buildContract(ethereum) {

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    return new ethers.Contract(AmpilifiContracts.bookkeeper, ABI, signer);
}

async function getAllERC20AssetOfPosition(ethereum, positionID) {
    const Bookkeeper = buildContract(ethereum);
    const result = await Bookkeeper.getERC20Stats(positionID);

    if (result == null || result[0].length == 0) {
        return [];
    }

    let tokens = [];
    result[0].forEach((address, idx) => {
        tokens.push({
            address: address,
            amount: result[1][idx],
            value: result[2][idx],
            minEquities: result[3][idx],
        });
    });

    return tokens;
}

async function borrow(ethereum, positionID, amount) {
    const Bookkeeper = buildContract(ethereum);

    amount = ethers.utils.parseUnits(amount, Tokens.PUD.decimals);

    return Bookkeeper.borrow(positionID, amount, ethers.utils.toUtf8Bytes(""), { gasLimit: 1000000 });
}

export const Bookkeeper = {
    getAllERC20AssetOfPosition,
    borrow
}