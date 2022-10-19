import { Inject, Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import { CoinchainStaking } from 'typechain/CoinchainStaking';
import { DepositByIdRequest } from './model/request/DepositByIdRequest';
import { DepositsByUserRequest } from './model/request/DepositsByUserRequest';
import { DepositExistsResponse } from './model/response/DepositExistsResponse';
import { DepositsByUserResponse } from './model/response/DepositsByUserResponse';
import { PendingRewardsResponse } from './model/response/PendingRewardsResponse';
 
@Injectable()
export class ViewService {
  constructor(
    @Inject("CoinchainStaking") 
    private readonly coinchainStaking: CoinchainStaking,
  ) {}

  async depositIdExists(request: DepositByIdRequest) : Promise<DepositExistsResponse> {
    let depositExists: boolean;
    const deposit = await this.coinchainStaking.deposits(request.depositId)
    if (deposit.user == ethers.constants.AddressZero) {
      depositExists = false; 
    } else {
      depositExists = true;
    }
    return {
      requestId: request.requestId,
      exists: depositExists
    }
  }

  async getPendingRewards(request: DepositByIdRequest) : Promise<PendingRewardsResponse> {
    const rewards = parseFloat(ethers.utils.formatEther(await this.coinchainStaking.calculatePendingRewards(request.depositId)));
    return {
      requestId: request.requestId,
      rewards: rewards
    }
  }

  async getDepositsByUser(request: DepositsByUserRequest) : Promise<DepositsByUserResponse> {
    let deposits = await this.coinchainStaking.getDepositsByUser(request.requestId);
    const result: number[] = deposits.map((bigNum) => parseInt(ethers.utils.formatEther(bigNum)));
    return {
      requestId: request.requestId,
      deposits: result
    }
  }


}
