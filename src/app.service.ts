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
    // console.log(this.coinchainStaking.populateTransaction);
    let res: CreateTransactionResponse;
    let txHash: string;
    try{
      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.deposit(request.deposits.map((deposit) => this.buildDepositPayload(deposit)));
      res = await this.ethersBridge.sendTransaction(transaction);
      console.log(res);
      txHash = await this.ethersBridge.waitForTxHash(res.id);
    }catch(e){
      console.log(e);
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
      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.withdraw(request.depositId);
    }catch(e){
      console.log(e);
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
