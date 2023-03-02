import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification, Input, Button, ENSAvatar } from "web3uikit";

import { Flex, Box, Card, Heading, Label} from "rebass";

import { Bookkeeper } from "services/bookkeeper.js";
import { UniswapV3Operator } from "services/uniswapV3Operator.js";
import { Tokens } from "constants/tokens.js";

export default function Position() {

  const positionId = 1;

  const { isWeb3Enabled } = useMoralis();
  const dispatch = useNotification();

  const [erc20Stats, setErc20Stats] = useState();
  const [amountToBorrow, setAmountToBorrow] = useState();
  const [amountToSwap, setAmountToSwap] = useState();
  const [tokenToSwap, setTokenToSwap] = useState();
  const [tokenToSwapFor, setTokenToSwapFor] = useState();

  async function updateUI() {
    const { ethereum } = window;
    setErc20Stats(
      await Bookkeeper.getAllERC20AssetOfPosition(ethereum, positionId)
    );
  }

  async function borrow() {
    const { ethereum } = window;
    await Bookkeeper.borrow(ethereum, 1, amountToBorrow);
    // TODO update UI after metamask get confirmed message
    return updateUI();
  }

  async function swap() {
    const tokenIn = Tokens.PUD;
    const tokenOut = Tokens.USDC;
    const fee = 500;

    if (amountToSwap > 0) {
      const amountOut = await UniswapV3Operator.swapExactInputSingle(
        positionId, tokenIn.address, tokenOut.address, fee, amountToSwap,
      )
      console.log("swap amount out:", amountOut);
    }

    // TODO update UI after metamask get confirmed message
    return updateUI();
  }



  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    updateUI();
    handleNotification(tx);
  };

  const handleNotification = function () {
    dispatch({
      tyep: "info",
      message: "Transaction Successful!",
      title: "Tansaction Successful!",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <Flex flexWrap='wrap' mx={20}>
      <Box px={20} py={20} width={1 / 2}>
      <Heading>Amplifi Position #1</Heading>
        {(erc20Stats || []).map((asset) => {
          const token = Tokens.getTokenByAddress(asset.address);
          return (
            <Card width={128}>
              <ENSAvatar address={asset.address} size={48}/>
              <div> { ethers.utils.formatUnits(asset.value, token.decimals)} &nbsp; {token.symbol}</div>
            </Card>
          )
        })
        }
      </Box>
      <Box px={20} py={20} width={1 / 2}>
        <Box px={20} py={20} width={1}>
          <Box>
            <Input
              id="amountToBorrow"
              label="Amount in PUD"
              name="Test text Input"
              onBlur={function noRefCheck() { }}
              onChange={(e) => setAmountToBorrow(e.target.value)}
              placeholder=""
              validation={null}
              value=""
            />
            <Button
              id=""
              onClick={async function () {
                await borrow({
                  onSuccess: handleSuccess,
                  onError: (error) => console.log(error),
                });
              }}
              text="Borrow"
            />
            <div>amount to borrow {amountToBorrow}</div>
          </Box>
        </Box>
        <Box px={20} py={20} width={1}>
          <div>
            Swap{" "}
            <Input
              id="amountToSwap"
              label="Amount"
              name="Test text Input"
              onBlur={function noRefCheck() { }}
              onChange={(e) => setAmountToSwap(e.target.value)}
              placeholder=""
              validation={null}
              value=""
            />{" "}
            of{" "}
            <Input
              id="tokenToSwap"
              label="Token 0"
              name="Test text Input"
              onBlur={function noRefCheck() { }}
              onChange={(e) => setTokenToSwap(e.target.value)}
              placeholder=""
              validation={null}
              value=""
            />{" "}
            for{" "}
            <Input
              id="tokenToSwapFor"
              label="Token 0"
              name="Test text Input"
              onBlur={function noRefCheck() { }}
              onChange={(e) => setTokenToSwapFor(e.target.value)}
              placeholder=""
              validation={null}
              value=""
            />
            <Button
              id=""
              onClick={() => {
                swap()
              }}
              text="Swap"
            />
          </div>
        </Box>

      </Box>
    </Flex>
  );
}
