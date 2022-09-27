import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ethers } from 'ethers';
import { CoinchainStaking__factory, CoinchainToken__factory } from 'typechain';
import { AppController } from './app.controller';
import { AppService as AppServiceWithFireblocks } from './app.service';
import { AppService as AppServiceWithoutFireblocks } from './app.stakingService';

const coinchainStakingFactory = {
  provide: "CoinchainStaking",
  useFactory: () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contractAddress = process.env.COINCHAIN_STAKING_ADDRESS;
    return CoinchainStaking__factory.connect(contractAddress, provider);
  }
}

const coinchainTokenFactory = {
  provide: "CoinchainToken",
  useFactory: () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contractAddress = process.env.COINCHAIN_TOKEN_ADDRESS;
    return CoinchainToken__factory.connect(contractAddress, provider);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [
    AppServiceWithoutFireblocks,
    coinchainStakingFactory,
    coinchainTokenFactory
  ],
})
export class AppModule {}
