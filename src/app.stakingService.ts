import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { CoinchainToken } from 'typechain/CoinchainToken';
import { CoinchainStaking } from 'typechain/CoinchainStaking';
import { Deposit } from './model/CreateStakesRequest';

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
    console.log("SignerBalance: ", await this.coinchainToken.balanceOf(signer.address));
    console.log("yieldConfig1: ", await this.coinchainStaking.yieldConfigs(1));
    let approvalTx = await this.coinchainToken.connect(signer).approve(this.coinchainStaking.address, ethers.utils.parseEther("100"));
    let depositTx = await this.coinchainStaking.connect(signer).deposit(deposits.map((deposit) => this.buildDepositPayload(deposit)));
    console.log("approvalTx: ", approvalTx.hash);


    return depositTx.hash;
  }

  async withdraw(depositId: number) : Promise<string> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    let withdrawTx = await this.coinchainStaking.connect(signer).withdraw(depositId);

    return withdrawTx.hash;
  }

  async withdrawNoReward(depositId: number) : Promise<string> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    let withdrawNoRewardTx = await this.coinchainStaking.connect(signer).withdrawNoReward(depositId);

    return withdrawNoRewardTx.hash;
  }

  async mint() : Promise<string> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.coinchainStaking.provider);
    let mintTx = await this.coinchainStaking.connect(signer).mint();

    return mintTx.hash;
  }

  private buildDepositPayload(deposit: Deposit) : CoinchainStaking.DepositStruct {
    return {
      depositId: deposit.depositId,
      data: {
        user: deposit.data.user,
        amount: ethers.utils.parseEther(deposit.data.amount.toString()),
        yieldConfigId: deposit.data.yieldConfigId,
        depositTime: deposit.data.depositTime
      }
    }
  }
}
