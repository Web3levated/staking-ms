import { Inject, Injectable, Logger } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import { CoinchainStaking } from 'typechain/CoinchainStaking';
import { ViewError } from './error/view.error';
import { DepositByIdRequest } from './model/request/DepositByIdRequest';
import { DepositsByUserRequest } from './model/request/DepositsByUserRequest';
import { DepositExistsResponse } from './model/response/DepositExistsResponse';
import { DepositsByUserResponse } from './model/response/DepositsByUserResponse';
import { PendingRewardsResponse } from './model/response/PendingRewardsResponse';
 
@Injectable()
export class ViewService {
  private readonly logger = new Logger(ViewService.name);
  constructor(
    @Inject("CoinchainStaking") 
    private readonly coinchainStaking: CoinchainStaking,
  ) {}

  async depositIdExists(request: DepositByIdRequest) : Promise<DepositExistsResponse> {
    try{
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
    }catch(e){
      this.logger.error(JSON.stringify({
        request: request.requestId,
        error: e.message
      }));
      throw new ViewError(e.message, request.requestId);
    }
  }

  async getPendingRewards(request: DepositByIdRequest) : Promise<PendingRewardsResponse> {
    try{
      const rewards = parseFloat(ethers.utils.formatEther(await this.coinchainStaking.calculatePendingRewards(request.depositId)));
      return {
        requestId: request.requestId,
        rewards: rewards
      }
    }catch(e){
      this.logger.error(JSON.stringify({
        request: request.requestId,
        error: e.message
      }));
      throw new ViewError(e.message, request.requestId);
    }
  }

  async getDepositsByUser(request: DepositsByUserRequest) : Promise<DepositsByUserResponse> {
    try{
      let deposits = await this.coinchainStaking.getDepositsByUser(request.user);
      const result: number[] = deposits.map((bigNum) => bigNum.toNumber());
      return {
        requestId: request.requestId,
        deposits: result
      }
    } catch(e){
      this.logger.error(JSON.stringify({
        request: request.requestId,
        error: e.message
      }));
      throw new ViewError(e.message, request.requestId);
    }
  }

}
