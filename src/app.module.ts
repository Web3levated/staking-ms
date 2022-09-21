import { Module } from '@nestjs/common';
import { ethers } from 'ethers';
import { CoinchainStaking__factory } from 'typechain';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const coinchainStakingFactory = {
  provide: "CoinchainStaking",
  useFactory: () => {
    const provider = new ethers.providers.JsonRpcProvider("provider");
    const contractAddress = "contractAddress";
    return CoinchainStaking__factory.connect(contractAddress, provider);
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    coinchainStakingFactory
  ],
})
export class AppModule {}
