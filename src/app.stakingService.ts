import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { CoinchainToken } from 'typechain/CoinchainToken';
import { CoinchainStaking } from 'typechain/CoinchainStaking';
import { Deposit } from './model/CreateStakesRequest';
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
    // let approvalTx = await this.coinchainToken.connect(signer).approve(this.coinchainStaking.address, ethers.utils.parseEther("100"));
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
    // console.log(receipt.events);
    // const tokensMinted = receipt.events.pop().args[0]; 
    
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
