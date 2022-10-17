import { Inject, Injectable } from '@nestjs/common';
import { time } from 'console';
import { ethers, PopulatedTransaction } from 'ethers';
import { Chain, EthersBridge, FireblocksSDK } from 'fireblocks-defi-sdk';
import { CoinchainStaking, CoinchainToken } from 'typechain';
import { CreateTransactionResponse,  PeerType, TransactionOperation, TransactionArguments } from "fireblocks-sdk";
import { MintRequest } from './model/MintRequest';
import { MintResponse } from './model/MintResponse';
import { GenericResponse } from './model/GenericResponse';
import { UnstakeRequest } from './model/UnstakeRequest';
import { CreateStakesRequest, Deposit } from './model/CreateStakesRequest';
import { ConfigRequest } from './model/ConfigRequest';


import * as fs from "fs";

@Injectable()
export class AppService {
  constructor(
    @Inject("CoinchainStaking") 
    private readonly coinchainStaking: CoinchainStaking,

    @Inject("CoinchainToken")
    private readonly coinchainToken: CoinchainToken,

    @Inject("EthersBridge")
    private readonly ethersBridge: EthersBridge
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createStakes(request: CreateStakesRequest) : Promise<GenericResponse> {
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
    // const transaction: PopulatedTransaction = await this.coinchainToken.populateTransaction.approve(this.coinchainStaking.address, ethers.constants.MaxUint256);

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
        let txHash: string;
    try{
      // const estimatedGas = await this.coinchainStaking.estimateGas.deposit(request.deposits.map((deposit) => this.buildDepositPayload(deposit)))
      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.deposit(request.deposits.map((deposit) => this.buildDepositPayload(deposit)));
      res = await tokenBridge.sendTransaction(transaction);
      console.log(res);
      txHash = await tokenBridge.waitForTxHash(res.id);
    }catch(e){
      console.log("inside catchs block");
      // console.log(Object.getOwnPropertyNames(e));
      console.log(e);
      let txInfo = await fireblocksApiClient.getTransactionById(res.id);
      console.log("info: ", txInfo);
      throw e;
    }
    return {
      requestId: request.requestId,
      txHash: txHash
    }
  }

  async withdraw(request: UnstakeRequest) : Promise<GenericResponse> {
    let res: CreateTransactionResponse;
    let txHash: string;
    try{
      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.withdraw(request);
      
    }
    return {
      requestId: request.requestId,
      txHash: "notimplemented"
    }
  }

  async withdrawNoReward(request: UnstakeRequest) : Promise<GenericResponse> {
    return {
      requestId: request.requestId,
      txHash: "notimplemented"
    }
  }

  async mint(request: MintRequest) : Promise<MintResponse> {
    return {
      requestId: request.requestId,
      txHash: "notimplemented",
      mintAmount: 0
    }
  }

  async depositIdExists(depositId: number) : Promise<boolean> {
    return false;
  }

  async setYieldConfig(config: ConfigRequest) : Promise<string>{
    return "notimplemented";
  }

  private buildDepositPayload(deposit: Deposit) : CoinchainStaking.DepositStruct {
    return {
      depositId: deposit.depositId,
      data: {
        user: deposit.user,
        amount: ethers.utils.parseEther(deposit.amount.toString()),
        yieldConfigId: deposit.yieldConfigId,
        depositTime: deposit.depositTime
      }
    }
  }
}
