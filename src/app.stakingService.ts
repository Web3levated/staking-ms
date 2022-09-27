import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { CoinchainStaking, CoinchainToken } from 'typechain';

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

  async createStakes() : Promise<string> {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY);

    return "createStakes called in AppServiceWithoutFireblocks";
  }
}
