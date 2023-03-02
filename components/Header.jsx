import { ConnectButton, Grid } from "Web3uikit";
import { Flex, Text, Box } from "rebass";

export default function Header() {
  return (
    <Flex
      px={20}
      py={20}
      color='white'
      // bg='black'
      alignItems='center'>
      <Text p={2} fontWeight='bold'>Amplifi</Text>
      <Box mx='auto' />
      <ConnectButton moralisAuth={false} />
    </Flex>
  );
}
