import BRIDGE_ABI from "@/constants/abis/bridge";
import { ethers } from "ethers";

const PK = process.env.ADMIN_PK;
const L1_JSONRPC = process.env.L1_JSONRPC;
const L2_JSONRPC = process.env.L2_JSONRPC;

const L1_BRIDGE_ADDRESS = process.env.L1_BRIDGE_ADDRESS;
const L2_BRIDGE_ADDRESS = process.env.L2_BRIDGE_ADDRESS;

const L1_CHAIN_ID = process.env.L1_CHAIN_ID;
const L2_CHAIN_ID = process.env.L2_CHAIN_ID;

const L1_TOKEN_ADDRESS = process.env.L1_TOKEN_ADDRESS;
const L2_TOKEN_ADDRESS = process.env.L2_TOKEN_ADDRESS;

async function subscribe() {
  // 체인별로 등록
  subscribe_contract(PK, L1_JSONRPC, L1_BRIDGE_ADDRESS, BRIDGE_ABI, "Deposit", handle_deposit);
  subscribe_contract(PK, L2_JSONRPC, L2_BRIDGE_ADDRESS, BRIDGE_ABI, "Deposit", handle_deposit);
}

function subscribe_contract(
  pk: string,
  jsonrpc: string,
  contractAddress: string,
  contractAbi: any,
  event: string,
  handler: any,
) {
  const wallet = new ethers.Wallet(pk, new ethers.providers.JsonRpcProvider(jsonrpc));
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
  contract.on(event, handler);
}

async function handle_deposit(
  _token: string,
  _fromChainId: string,
  _toChainId: string,
  _amount: string,
  _from: string,
  _to: string,
  _nonce: string,
  event: any,
) {
  console.log(`deposited: ${_token} ${_fromChainId} ${_toChainId} ${_amount} ${_from} ${_to} ${_nonce}`);

  let provider;
  let bridgeAddress;
  let bridgeTokenAddress;
  // 컨트랙트 상에서 fromChainId != toChainId 보장
  switch (_toChainId.toString()) {
    case L1_CHAIN_ID:
      provider = new ethers.providers.JsonRpcProvider(L1_JSONRPC);
      bridgeAddress = L1_BRIDGE_ADDRESS;

      // L2 이외의 토큰에 대한 deposit은 무시
      if (_token != L2_TOKEN_ADDRESS) {
        return;
      }

      bridgeTokenAddress = L1_TOKEN_ADDRESS;

      break;
    case L2_CHAIN_ID:
      provider = new ethers.providers.JsonRpcProvider(L2_JSONRPC);
      bridgeAddress = L2_BRIDGE_ADDRESS;

      // L2 이외의 토큰에 대한 deposit은 무시
      if (_token != L1_TOKEN_ADDRESS) {
        return;
      }

      bridgeTokenAddress = L2_TOKEN_ADDRESS;

      break;
    default:
      // wrong network
      return;
  }

  // 상대 체인으로 보낸다.
  // 일단은 무조건 상대 체인으로 가정 (L1 <-> L2). 추후 설정파일로 매핑

  try {
    const wallet = new ethers.Wallet(PK, provider);
    const bridge = new ethers.Contract(bridgeAddress, BRIDGE_ABI, wallet);

    // let gasPrice = await getBaseGas();
    const tx = await bridge.withdraw(
      bridgeTokenAddress,
      _fromChainId,
      _amount,
      _from,
      _to,
      _nonce,
      // {
      //   gasPrice: gasPrice,
      //   nonce: await wallet.getTransactionCount("pending"),
      // },
    );

    await tx.wait();
  } catch (e) {
    console.log(e);
    // if (e?.body?.includes("txpool is full")) {
    //   console.log("txpool is full, retry!");
    //   // 실패시 재호출
    //   handle_deposit(_token, _fromChainId, _toChainId, _amount, _from, _to, _nonce, event);
    // }
  }
}

export default subscribe;
