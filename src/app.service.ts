import { Inject, Injectable } from '@nestjs/common';
import { time } from 'console';
import { ethers, PopulatedTransaction } from 'ethers';
import { Chain, EthersBridge, FireblocksSDK } from 'fireblocks-defi-sdk';
import { CoinchainStaking, CoinchainToken } from 'typechain';
import { CreateTransactionResponse,  PeerType, TransactionOperation, TransactionArguments } from "fireblocks-sdk";
import * as fs from "fs";

@Injectable()
export class AppService {
  constructor(
    @Inject("CoinchainStaking") 
    private readonly coinchainStaking: CoinchainStaking,

    @Inject("CoinchainToken")
    private readonly coinchainToken: CoinchainToken
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createStakes() : Promise<string> {
    const apiSecret = fs.readFileSync(process.env.FIREBLOCKS_API_SECRET_PATH, "utf8");
    const apiKey = process.env.FIREBLOCKS_API_KEY;
    const fireblocksApiBaseUrl = process.env.FIREBLOCKS_API_BASE_URL;
    // const vaultAccount = process.env.FIREBLOCKS_CCH_VAULT;
    const fireblocksApiClient = new FireblocksSDK(apiSecret, apiKey, fireblocksApiBaseUrl);
    // const bridge = new EthersBridge({
    //   fireblocksApiClient,
    //   vaultAccountId: vaultAccount,
    //   externalWalletId: this.coinchainStaking.address,
    //   chain: Chain.ROPSTEN
    // })
    // const deposit: CoinchainStaking.DepositStruct = {
    //   depositId: 1,
    //   data: {
    //     user: "0xBEf62fCa4E7bC887C295db13Bc4c81D0c3B786eF",
    //     amount: 100,
    //     yieldConfigId: 1,
    //     depositTime: Date.now() / 1000
    //   }
    // }
    // const populatedTransaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.deposit([deposit]);
    // const res  = await bridge.sendTransaction(populatedTransaction);
    // const txHash = await bridge.waitForTxHash(res.id);
    const tokenBridge = new EthersBridge({
      fireblocksApiClient,
      vaultAccountId: process.env.FIREBLOCKS_SOURCE_VAULT_ACCOUNT,
      externalWalletId: process.env.FIREBLOCKS_EXTERNAL_WALLET,
      chain: Chain.GOERLI
    });
    const transaction: PopulatedTransaction = await this.coinchainToken.populateTransaction.approve("0x2C8C6D4b360bf3ce7B2b641B27D0c7534A63E99F", ethers.utils.parseEther("100"));
    // const txArguments: TransactionArguments = {
    //   operation: TransactionOperation.CONTRACT_CALL,
    //   assetId: "CCHTEST1",
    //   source: {
    //       type: PeerType.VAULT_ACCOUNT,
    //       id: process.env.FIREBLOCKS_SOURCE_VAULT_ACCOUNT
    //   },
    //   gasPrice: transaction.gasPrice != undefined ? ethers.utils.formatUnits(transaction.gasPrice.toString(), "gwei") : undefined,
    //   gasLimit: transaction.gasLimit?.toString(),
    //   destination: {
    //       type: PeerType.EXTERNAL_WALLET,
    //       id: this.coinchainToken.address
    //   },
    //   amount: ethers.utils.formatEther(transaction.value?.toString() || "0"),
    //   extraParameters: {
    //       contractCallData: transaction.data
    //   }
    // };
    let res: CreateTransactionResponse;
    try{
      res = await tokenBridge.sendTransaction(transaction);
    }catch(e){
      console.log(e);
      throw e;
    }
    const txHash = await tokenBridge.waitForTxHash(res.id);
    return "token approval tx: " + txHash;
  }
}
