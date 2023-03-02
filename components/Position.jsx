import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification, Input, Button } from "web3uikit";
import abis from "../constants/abis.json";
import addresses from "../constants/addresses.json";

export default function Position() {
  const { isWeb3Enabled } = useMoralis();
  const dispatch = useNotification();

  const [erc20Stats, setErc20Stats] = useState();
  const [amountToBorrow, setAmountToBorrow] = useState();
  const [amountToSwap, setAmountToSwap] = useState();
  const [tokenToSwap, setTokenToSwap] = useState();
  const [tokenToSwapFor, setTokenToSwapFor] = useState();

  const { runContractFunction: getERC20Stats } = useWeb3Contract({
    abi: abis["bookkeeper"],
    contractAddress: addresses["bookkeeper"],
    functionName: "getERC20Stats",
    params: { positionId: 1 },
  });

  const { runContractFunction: borrow } = useWeb3Contract({
    abi: abis["bookkeeper"],
    contractAddress: addresses["bookkeeper"],
    functionName: "borrow",
    params: {
      positionId: 1,
      amount: amountToBorrow,
      data: "0x4e487b710000000000000000000000000000000000000000000000000000000000000012",
    },
  });

  const { runContractFunction: swap } = useWeb3Contract({
    abi: abis["uniswapV3Operator"],
    contractAddress: addresses["uniswapV3Operator"],
    functionName: "swapExactInputSingle",
    params: {
      //TODO:
    },
  });

  async function updateUI() {
    setErc20Stats(
      await getERC20Stats({
        onError: (error) => console.log(error),
      })
    );
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
    <div>
      <div>{JSON.stringify(erc20Stats)}</div>
      <div>//TODO: list vitae</div>
      <div>
        <Input
          id="amountToBorrow"
          label="Amount in PUD"
          name="Test text Input"
          onBlur={function noRefCheck() {}}
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
      </div>
      <div>
        Swap{" "}
        <Input
          id="amountToSwap"
          label="Amount"
          name="Test text Input"
          onBlur={function noRefCheck() {}}
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
          onBlur={function noRefCheck() {}}
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
          onBlur={function noRefCheck() {}}
          onChange={(e) => setTokenToSwapFor(e.target.value)}
          placeholder=""
          validation={null}
          value=""
        />
        <Button
          id=""
          onClick={async function () {
            await swap({
              onSuccess: handleSuccess,
              onError: (error) => console.log(error),
            });
          }}
          text="Borrow"
        />
      </div>
      {
        //TODO: delete below later
      }
      <div>amount to borrow {amountToBorrow}</div>
    </div>
  );
}
