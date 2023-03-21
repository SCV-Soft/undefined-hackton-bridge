import BRIDGE_ABI from "@/constants/abis/bridge";
import { ethers } from "ethers";

const PK = process.env.ADMIN_PK;
const KLAYTN_JSONRPC = process.env.KLAYTN_JSONRPC;
const KON_JSONRPC = process.env.KON_JSONRPC;

const KLAYTN_BRIDGE_ADDRESS = process.env.KLAYTN_BRIDGE_ADDRESS;
const KON_BRIDGE_ADDRESS = process.env.KON_BRIDGE_ADDRESS;

const KLAYTN_CHAIN_ID = process.env.KLAYTN_CHAIN_ID;
const KON_CHAIN_ID = process.env.KON_CHAIN_ID;

const KLAYTN_TOKEN_ADDRESS = process.env.KLAYTN_TOKEN_ADDRESS;
const KON_TOKEN_ADDRESS = process.env.KON_TOKEN_ADDRESS;

async function subscribe() {
  // 체인별로 등록
  subscribe_contract(PK, KLAYTN_JSONRPC, KLAYTN_BRIDGE_ADDRESS, BRIDGE_ABI, "Deposit", handle_deposit);
  subscribe_contract(PK, KON_JSONRPC, KON_BRIDGE_ADDRESS, BRIDGE_ABI, "Deposit", handle_deposit);
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
    case KLAYTN_CHAIN_ID:
      provider = new ethers.providers.JsonRpcProvider(KLAYTN_JSONRPC);
      bridgeAddress = KLAYTN_BRIDGE_ADDRESS;

      // KON 이외의 토큰에 대한 deposit은 무시
      if (_token != KON_TOKEN_ADDRESS) {
        return;
      }

      bridgeTokenAddress = KLAYTN_TOKEN_ADDRESS;

      break;
    case KON_CHAIN_ID:
      provider = new ethers.providers.JsonRpcProvider(KON_JSONRPC);
      bridgeAddress = KON_BRIDGE_ADDRESS;

      // KON 이외의 토큰에 대한 deposit은 무시
      if (_token != KLAYTN_TOKEN_ADDRESS) {
        return;
      }

      bridgeTokenAddress = KON_TOKEN_ADDRESS;

      break;
    default:
      // wrong network
      return;
  }

  // 상대 체인으로 보낸다.
  // 일단은 무조건 상대 체인으로 가정 (클튼 <-> 콘). 추후 설정파일로 매핑

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
    console.error(e);
  }
}

export default subscribe;
