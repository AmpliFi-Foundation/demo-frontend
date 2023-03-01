import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import abis from "../constants/abis.json";
import addresses from "../constants/addresses.json";

export default function Position() {
  const { isWeb3Enabled } = useMoralis();

  const [erc20Stats, setErc20Stats] = useState();

  const { runContractFunction: getERC20Stats } = useWeb3Contract({
    abi: abis["bookkeeper"],
    contractAddress: addresses["bookkeeper"],
    functionName: "getERC20Stats",
    params: { positionId: 1 },
  });

  useEffect(() => {
    console.log("isWeb3Enabled: " + isWeb3Enabled);
    if (isWeb3Enabled) {
      async function updateUI() {
        setErc20Stats(await getERC20Stats());
        console.log("ran");
      }
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      <div>{erc20Stats}</div>
      <div>//TODO: list vitae</div>
      <div>//TODO: borrow input and button</div>
      <div>//TODO: swap inputs and button</div>
    </div>
  );
}
