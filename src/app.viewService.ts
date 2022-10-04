import { Inject, Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import { CoinchainToken } from 'typechain/CoinchainToken';
import { CoinchainStaking } from 'typechain/CoinchainStaking';

@Injectable()
export class viewService {
  constructor(
    @Inject("CoinchainStaking") 
    private readonly coinchainStaking: CoinchainStaking,
  ) {}

  async depositIdExists(depositId: number) : Promise<boolean> {
    const deposit = await this.coinchainStaking.deposits(depositId)
    if (deposit.user == ethers.constants.AddressZero) {
      return false; 
    } else {
      return true;
    }
  }

  async getPendingRewards(depositId: number) : Promise<number> {
    const rewards = await this.coinchainStaking.calculatePendingRewards(depositId);
    return parseInt(ethers.utils.formatEther(rewards));
  }

  async getDepositsByUser(user: string) : Promise<number[]> {
    let deposits = await this.coinchainStaking.getDepositsByUser(user);
    const result: number[] = deposits.map((bigNum) => parseInt(ethers.utils.formatEther(bigNum)));
    return result;
  }


}
