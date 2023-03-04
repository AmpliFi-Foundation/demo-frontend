import Head from "next/head";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";
import {
  createTheme,
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  Select,
  MenuItem
} from "@mui/material";

import { Tokens } from "constants/tokens";
import { AmpilifiContracts } from "@/constants/contracts";
import { Bookkeeper } from "services/bookkeeper";
import { UniswapV3Operator } from "services/uniswapV3Operator";

function getPositionIdFromSearch() {
  const query = new URLSearchParams(location.search);
  const positionId = (query.get("positionId") || "1");
  return parseInt(positionId);
}

export default function Home() {
  const fee = 500;
  const mdTheme = createTheme();
  const { isWeb3Enabled } = useMoralis();

  const [positionId, setPositionId] = useState(1);
  const [assets, setAssets] = useState([]);
  const [stats, setStats] = useState({ value: 0, debt: 0, minEquity: 0 });
  const [amountToBorrow, setAmountToBorrow] = useState(0);
  const [amountToRepay, setAmountToRepay] = useState(0);
  const [amountToSwap, setAmountToSwap] = useState(0);
  const [tokenToSwap, setTokenToSwap] = useState("PUD");
  const [tokenToSwapFor, setTokenToSwapFor] = useState("USDC");

  async function updateUI() {
    const { ethereum } = window;
    Tokens.setChainId(ethereum.chainId);
    AmpilifiContracts.setChainId(ethereum.chainId);

    const positionId = getPositionIdFromSearch();
    setPositionId(positionId);

    const erc20Assets = await Bookkeeper.getAllERC20AssetOfPosition(ethereum, positionId);
    const debt = await Bookkeeper.getDebtOfPosition(ethereum, positionId);
    const PUD = Tokens.getTokenBySymbol("PUD");

    let totalValue = 0, totalMinEquity = 0 ;
    erc20Assets.forEach((asset) => {
      totalValue += formatUnits(asset.value, PUD.decimals);
      totalMinEquity += formatUnits(asset.minEquity, PUD.decimals);
    });

    setAssets(erc20Assets);
    setStats({
      value: totalValue,
      debt: formatUnits(debt.value, PUD.decimals),
      minEquity: totalMinEquity,
    });
  }

  async function borrow() {
    if (isWeb3Enabled) {
      const { ethereum } = window;
      await Bookkeeper.borrow(ethereum, positionId, amountToBorrow);
    }
  }

  async function repay() {
    if (isWeb3Enabled) {
      const { ethereum } = window;
      await Bookkeeper.repay(ethereum, positionId, amountToRepay); //TODO:
    }
  }

  async function swap() {
    if (isWeb3Enabled) {
      await UniswapV3Operator.swapExactInputSingle(
        positionId,
        Tokens.getTokenBySymbol(tokenToSwap).address,
        Tokens.getTokenBySymbol(tokenToSwapFor).address,
        fee,
        amountToSwap
      );
    }
  }

  function formatUnits(amount, decimals) {
    return parseFloat(ethers.utils.formatUnits(amount, decimals));
  }

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    updateUI();
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      <Head>
        <title>AmpliFi</title>
        <meta name="description" content="A self-custodial margin protocol" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Container sx={{ flexGrow: 1 }}>{<img src="/logo.png" />}</Container>
          <ConnectButton moralisAuth={false} />
        </Toolbar>
      </AppBar>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar>
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                  Position #{positionId}
                </Typography>{" "}
              </Container>
            </Toolbar>
            <Container maxWidth="lg">
              <Grid container spacing={3}>
                {/* Actions */}
                <Grid item xs={12} md={8} lg={8}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 240,
                    }}
                  >
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                      Actions
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Grid container spacing={2}>
                        <Typography variant="body" color="text.secondary" sx={{ mt: 4, ml: 4 }}>
                          Borrow
                        </Typography>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            required
                            fullWidth
                            label="amount"
                            autoFocus
                            onChange={(e) => setAmountToBorrow(e.target.value)}
                          />
                        </Grid>
                        <Typography variant="body" color="text.secondary" sx={{ mt: 4, ml: 1 }}>
                          PUD
                        </Typography>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ mt: 3, mb: 2, ml: 2, mr: 2 }}
                          disabled={amountToBorrow == 0}
                          onClick={async function () {
                            await borrow({ onSuccess: handleSuccess, onError: (error) => console.log(error) });
                          }}
                        >
                          Borrow
                        </Button>
                        <Typography variant="body" color="text.secondary" sx={{ mt: 4, ml: 4 }}>
                          Repay
                        </Typography>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            required
                            fullWidth
                            label="amount"
                            autoFocus
                            onChange={(e) => setAmountToRepay(e.target.value)}
                          />
                        </Grid>
                        <Typography variant="body" color="text.secondary" sx={{ mt: 4, ml: 1 }}>
                          PUD
                        </Typography>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ mt: 3, mb: 2, ml: 2, mr: 2 }}
                          disabled={amountToRepay == 0}
                          onClick={async function () {
                            await repay({ onSuccess: handleSuccess, onError: (error) => console.log(error) });
                          }}
                        >
                          Repay
                        </Button>

                        <Typography variant="body" color="text.secondary" sx={{ mt: 4, ml: 4 }}>
                          Swap
                        </Typography>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            required
                            fullWidth
                            label="amount"
                            onChange={(e) => setAmountToSwap(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Select
                            labelId="tokenIn-select-label"
                            id="tokenIn-select"
                            value={tokenToSwap}
                            label="tokenIn"
                            onChange={(e) => {setTokenToSwap(e.target.value); }}
                          >
                            { Tokens.getAllTokens().map((token) => {
                              return <MenuItem value={token.symbol} key={token.symbol}> {token.symbol} </MenuItem>
                            })
                            }
                          </Select>
                        </Grid>
                        <Typography variant="body" color="text.secondary" sx={{ mt: 4, ml: 2 }}>
                          for
                        </Typography>
                        <Grid item xs={12} sm={2}>
                          <Select
                            labelId="tokenOut-select-label"
                            id="tokenOut-select"
                            value={tokenToSwapFor}
                            label="tokenOut"
                            onChange={(e) => {setTokenToSwapFor(e.target.value); }}
                          >
                            { Tokens.getAllTokens().filter((t) => t.symbol != tokenToSwap ).map((token) => {
                              return <MenuItem value={token.symbol} key={token.symbol}> {token.symbol} </MenuItem>
                            })
                            }
                          </Select>
                        </Grid>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ mt: 3, mb: 2, ml: 5, mr: 2 }}
                          disabled={amountToSwap == 0 || tokenToSwap == tokenToSwapFor }
                          onClick={async function () {
                            await swap({ onSuccess: handleSuccess, onError: (error) => console.log(error) });
                          }}
                        >
                          Swap
                        </Button>
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>

                {/* Stats */}
                <Grid item xs={12} md={4} lg={4}>
                  <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                      Stats
                    </Typography>
                    <Typography color="text.secondary" sx={{ pl: 2, pr: 2, flex: 1 }}>
                      Position Value: {stats.value.toFixed(4)} PUD
                    </Typography>
                    <Typography color="text.secondary" sx={{ pl: 2, pr: 2, flex: 1 }}>
                      Position Debt: {stats.debt.toFixed(4)} PUD
                    </Typography>
                    <Typography color="text.secondary" sx={{ pl: 2, pr: 2, flex: 1 }}>
                      Position Equity: {(stats.value - stats.debt).toFixed(4)} PUD
                    </Typography>
                    <Typography color="text.secondary" sx={{ pl: 2, pr: 2, flex: 1 }}></Typography>
                    <Typography color="text.secondary" sx={{ pl: 2, pr: 2, flex: 1 }}>
                      Equity Ratio: {((stats.value - stats.debt) * 100 / stats.value).toFixed(2)}%
                    </Typography>
                    <Typography color="text.secondary" sx={{ pl: 2, pr: 2, flex: 1 }}>
                      Liquidation Ratio: {(stats.minEquity * 100 / stats.value).toFixed(2)}%
                    </Typography>
                  </Paper>
                </Grid>

                {/* Assets */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                      Assets
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Token</TableCell>
                          <TableCell>Liquidation Ratio</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell align="right">Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assets.map((asset) => {
                          return (
                            <TableRow key={asset.address}>
                              <TableCell>{asset.symbol}</TableCell>
                              <TableCell>{((asset.minEquity / asset.value) * 100).toFixed(2)} %</TableCell>
                              <TableCell>
                                {formatUnits(asset.amount, asset.decimals).toFixed(4)} {asset.symbol}
                              </TableCell>
                              <TableCell align="right">
                                {formatUnits(asset.value, 18).toFixed(4) } PUD {/* TODO: fix hardcode*/}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
              <Container sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {"Copyright © "}
                  <Link color="inherit" href="https://ampli.finance/">
                    AmpliFi
                  </Link>{" "}
                  {new Date().getFullYear()}
                  {"."}
                </Typography>
              </Container>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
