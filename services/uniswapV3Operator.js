import { ethers } from "ethers";

import { AmplifiABI } from "constants/abi.js";
import { AmpilifiContracts } from "constants/contracts.js";
import { Tokens } from "constants/tokens.js";

async function swapExactInputSingle(
    positionId,
    tokenIn,
    tokenOut,
    fee,
    amountIn
) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const Operator = new ethers.Contract(
        AmpilifiContracts.getUniswapV3Operator(),
        AmplifiABI.uniswapV3Operator,
        signer
    );

    const tokenInCfg = Tokens.getTokenByAddress(tokenIn);

    let sqrtPriceLimitX96 = ethers.BigNumber.from("25054144837438405210905"); // ~= 0.1 USDC/PUD
    if (tokenOut < tokenIn) {
        sqrtPriceLimitX96 = ethers.BigNumber.from("158456325028528675187087900672000000"); // ~= 4 PUD/USDC
    }

    const params = {
        positionId: positionId,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: fee,
        amountIn: ethers.utils.parseUnits(amountIn, tokenInCfg.decimals),
        amountOutMinimum: 0,
        // TODO input by user, and converted to FixPoint96
        sqrtPriceLimitX96: sqrtPriceLimitX96,
    };

    const amountOut = await Operator.swapExactInputSingle(params, {
        gasLimit: 2000000,
    });
    return amountOut;
}

export const UniswapV3Operator = {
    swapExactInputSingle,
};
