import { Inject, Injectable, Logger } from '@nestjs/common';
import { ethers, PopulatedTransaction } from 'ethers';
import { EthersBridge } from 'fireblocks-defi-sdk';
import { CoinchainStaking, CoinchainToken } from 'typechain';
import { CreateTransactionResponse } from "fireblocks-sdk";
import { MintRequest } from './model/request/MintRequest';
import { MintResponse } from './model/response/MintResponse';
import { GenericTransactionResponse } from './model/response/GenericTransactionResponse';
import { UnstakeRequest } from './model/request/UnstakeRequest';
import { CreateStakesRequest, Deposit } from './model/request/CreateStakesRequest';
import { TransactionError } from './error/transactions.error';


@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    @Inject("CoinchainStaking") 
    private readonly coinchainStaking: CoinchainStaking,

    @Inject("CoinchainToken")
    private readonly coinchainToken: CoinchainToken,

    @Inject("EthersBridge")
    private readonly ethersBridge: EthersBridge
  ) {}

  async createStakes(request: CreateStakesRequest) : Promise<GenericTransactionResponse> {
    let res: CreateTransactionResponse;
    let txHash: string;
    try{
      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.deposit(request.deposits.map((deposit) => this.buildDepositPayload(deposit)));
      res = await this.ethersBridge.sendTransaction(transaction);
      txHash = await this.ethersBridge.waitForTxHash(res.id);
    }catch(e){
      
      this.logger.error(JSON.stringify({
        request: request.requestId,
        error: e.message
      }));

      if(res != undefined){
        throw new TransactionError(e.message, request.requestId, res.id)
      }else{
        throw e;
      }
    }
    return {
      requestId: request.requestId,
      txHash: txHash
    }
  }

  async withdraw(request: UnstakeRequest) : Promise<GenericTransactionResponse> {
    let res: CreateTransactionResponse;
    let txHash: string;
    try {
      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.withdraw(request.depositId);
      res = await this.ethersBridge.sendTransaction(transaction);
      txHash = await this.ethersBridge.waitForTxHash(res.id);
    } catch(e) {

      this.logger.error(JSON.stringify({
        request: request.requestId,
        error: e.message
      }));

      if(res != undefined){
        throw new TransactionError(e.message, request.requestId, res.id)
      }else{
        throw e;
      }
    }
    return {
      requestId: request.requestId,
      txHash: txHash
    }
  }

  async withdrawNoReward(request: UnstakeRequest) : Promise<GenericTransactionResponse> {
    let res: CreateTransactionResponse;
    let txHash: string;
    try {
      const transaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.withdrawNoReward(request.depositId);
      res = await this.ethersBridge.sendTransaction(transaction);
      txHash = await this.ethersBridge.waitForTxHash(res.id);
    } catch(e) {

      this.logger.error(JSON.stringify({
        request: request.requestId,
        error: e.message
      }));

      if(res != undefined){
        throw new TransactionError(e.message, request.requestId, res.id)
      }else{
        throw e;
      }
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
    } catch(e) {

      this.logger.error(JSON.stringify({
        request: request.requestId,
        error: e.message
      }));
      
      if(res != undefined){
        throw new TransactionError(e.message, request.requestId, res.id)
      }else{
        throw e;
      }
    }
    try {
      const provider: ethers.providers.Provider = this.coinchainStaking.provider;
      const response: ethers.providers.TransactionResponse = await provider.getTransaction(txHash);
      const receipt = await response.wait();
      tokensMinted = parseFloat(ethers.utils.formatEther(receipt.logs.pop().topics[1]));
    } catch(e){
      this.logger.error(JSON.stringify({
        request: request.requestId,
        error: e.message
      }));
    }
    return {
      requestId: request.requestId,
      txHash: txHash,
      mintAmount: tokensMinted
    }
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
