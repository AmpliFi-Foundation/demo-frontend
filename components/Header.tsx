import { ConnectButton } from "Web3uikit";

export default function Header() {
  return (
    <div>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
