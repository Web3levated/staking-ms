import { Inject, Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { CoinchainToken } from 'typechain/CoinchainToken';
import { CoinchainStaking } from 'typechain/CoinchainStaking';
import { CreateStakesRequest, Deposit } from './model/CreateStakesRequest';
import { ConfigRequest } from './model/ConfigRequest';
import { min } from 'rxjs';
import { MintRequest } from './model/MintRequest';
import { MintResponse } from './model/MintResponse';
import { GenericResponse } from './model/GenericResponse';
import { UnstakeRequest } from './model/UnstakeRequest';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject("CoinchainStaking") 
    private readonly coinchainStaking: CoinchainStaking,

    @Inject("CoinchainToken")
    private readonly coinchainToken: CoinchainToken
  ) {}


  async createStakes(request: CreateStakesRequest) : Promise<GenericResponse> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainToken.provider);
    // let approvalTx = await this.coinchainToken.connect(signer).approve(this.coinchainStaking.address, ethers.utils.parseEther("1000000"));
    // await approvalTx.wait();
    this.logger.log("Ethers Call: " + JSON.stringify({
      contract: "CoinchainStaking",
      contractAddress: this.coinchainStaking.address,
      signerAddress: signer.address,
      method: "deposit", 
      params: [
        request.deposits
      ]
    }))
    let depositTx = await this.coinchainStaking.connect(signer).deposit(request.deposits.map((deposit) => this.buildDepositPayload(deposit)));
    await depositTx.wait();
    const response: GenericResponse = {
      txHash: depositTx.hash,
      requestId: request.requestId
    }
    return response;
  }

  async withdraw(request: UnstakeRequest) : Promise<GenericResponse> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    this.logger.log("Ethers Call: " + JSON.stringify({
      contract: "CoinchainStaking",
      contractAddress: this.coinchainStaking.address,
      signerAddress: signer.address,
      method: "withdraw", 
      params: [
        request.depositId
      ]
    }))
    let withdrawTx = await this.coinchainStaking.connect(signer).withdraw(request.depositId);
    await withdrawTx.wait();
    const response: GenericResponse = {
      requestId: request.requestId,
      txHash: withdrawTx.hash
    }
    return response;
  }

  async withdrawNoReward(request: UnstakeRequest) : Promise<GenericResponse> {

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    this.logger.log("Ethers Call: " + JSON.stringify({
      contract: "CoinchainStaking",
      contractAddress: this.coinchainStaking.address,
      signerAddress: signer.address,
      method: "withdrawNoReward", 
      params: [
        request.depositId
      ]
    }))
    let withdrawNoRewardTx = await this.coinchainStaking.connect(signer).withdrawNoReward(request.depositId);
    await withdrawNoRewardTx.wait();
    const response: GenericResponse = {
      requestId: request.requestId,
      txHash: withdrawNoRewardTx.hash
    }
    return response;
  }

  async mint(request: MintRequest) : Promise<MintResponse> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    this.logger.log("Ethers Call: " + JSON.stringify({
      contract: "CoinchainStaking",
      contractAddress: this.coinchainStaking.address,
      signerAddress: signer.address,
      method: "mint", 
      params: []
    }))
    let mintTx = await this.coinchainStaking.connect(signer).mint();
    const receipt = await mintTx.wait();
    const tokensMinted = parseInt(ethers.utils.formatEther(receipt.events.pop().topics[1])); 
    const response: MintResponse = {
      requestId: request.requestId,
      mintAmount: tokensMinted,
      txHash: mintTx.hash
    }
    return response;
  }

  async depositIdExists(depositId: number) : Promise<boolean> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    const deposit = await this.coinchainStaking.connect(signer).deposits(depositId)
    if (deposit.user == ethers.constants.AddressZero) {
      return false; 
    } else {
      return true;
    }
  }

  async setYieldConfig(config: ConfigRequest) : Promise<string>{
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    const set = await this.coinchainStaking.connect(signer).setYieldConfig(config.yieldConfigId, this.buildConfigPayload(config))
    await set.wait();
    return set.hash;
  }

  private buildConfigPayload(config: ConfigRequest) : CoinchainStaking.YieldConfigStruct {
    return {
      lockupTime: config.lockUpTime,
      rate: config.rate
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
