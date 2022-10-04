import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { CoinchainToken } from 'typechain/CoinchainToken';
import { CoinchainStaking } from 'typechain/CoinchainStaking';
import { Deposit } from './model/CreateStakesRequest';
import { ConfigRequest } from './model/ConfigRequest';
import { min } from 'rxjs';

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

  async createStakes(deposits: Deposit[]) : Promise<string> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainToken.provider);
    let approvalTx = await this.coinchainToken.connect(signer).approve(this.coinchainStaking.address, ethers.utils.parseEther("1000000"));
    await approvalTx.wait();
    let depositTx = await this.coinchainStaking.connect(signer).deposit(deposits.map((deposit) => this.buildDepositPayload(deposit)));
    await depositTx.wait();
    return depositTx.hash;
  }

  async withdraw(depositId: number) : Promise<string> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    let withdrawTx = await this.coinchainStaking.connect(signer).withdraw(depositId);
    await withdrawTx.wait();
    
    return withdrawTx.hash;
  }

  async withdrawNoReward(depositId: number) : Promise<string> {

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    let withdrawNoRewardTx = await this.coinchainStaking.connect(signer).withdrawNoReward(depositId);
    await withdrawNoRewardTx.wait();

    return withdrawNoRewardTx.hash;
  }

  async mint() : Promise<string> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    let mintTx = await this.coinchainStaking.connect(signer).mint();
    const receipt = await mintTx.wait();
    this.coinchainStaking.filters.TokensMinted
    console.log(receipt.logs);
    const tokensMinted = parseInt(ethers.utils.formatEther(receipt.events.pop().topics[1])); 
    console.log('Tokens minted: ', tokensMinted);
    return mintTx.hash;
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
