import { Module } from '@nestjs/common';
import { ethers } from 'ethers';
import { CoinchainStaking__factory } from '../../typechain/factories/CoinchainStaking__factory';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import * as fs from "fs";


const coinchainStakingFactory = {
  provide: "CoinchainStaking",
  useFactory: () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contractAddress = process.env.COINCHAIN_STAKING_ADDRESS;
    return CoinchainStaking__factory.connect(contractAddress, provider);
  }
}


@Module({
  controllers: [ViewController],
  providers: [
    ViewService,
    coinchainStakingFactory,
  ],
})
export class ViewModule {}