import { Inject, Injectable } from '@nestjs/common';
import { time } from 'console';
import { ethers, PopulatedTransaction, Transaction, ContractReceipt } from 'ethers';
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
    try {
      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.withdraw(request.depositId);
      res = await this.ethersBridge.sendTransaction(transaction);
      txHash = await this.ethersBridge.waitForTxHash(res.id);
    } catch(e) {
      console.log(e);
      throw e;
    }
    return {
      requestId: request.requestId,
      txHash: txHash
    }
  }

  async withdrawNoReward(request: UnstakeRequest) : Promise<GenericResponse> {
    let res: CreateTransactionResponse;
    let txHash: string;
    try {
      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.withdrawNoReward(request.depositId);
      res = await this.ethersBridge.sendTransaction(transaction);
      txHash = await this.ethersBridge.waitForTxHash(res.id);
    } catch(e) {
      throw e;
    }
    return {
      requestId: request.requestId,
      txHash: txHash
    }
  }

  async mint(request: MintRequest) : Promise<MintResponse> {
    let res: CreateTransactionResponse;
    let txHash: string;
    let tokensMinted: number;
    try {

      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.mint();
      res = await this.ethersBridge.sendTransaction(transaction);
      txHash = await this.ethersBridge.waitForTxHash(res.id);
      const provider: ethers.providers.Provider = this.coinchainStaking.provider;
      const response: ethers.providers.TransactionResponse = await provider.getTransaction(txHash);
      const receipt = await response.wait();
      tokensMinted = parseFloat(ethers.utils.formatEther(receipt.logs.pop().topics[1]));
    } catch(e) {
      throw e;
    }
    return {
      requestId: request.requestId,
      txHash: txHash,
      mintAmount: tokensMinted
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
