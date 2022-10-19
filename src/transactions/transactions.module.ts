import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ethers } from 'ethers';
import { CoinchainStaking__factory } from '../../typechain/factories/CoinchainStaking__factory';
import { CoinchainToken__factory } from '../../typechain/factories/CoinchainToken__factory';
import { TransactionsController } from './../transactions/transactions.controller';
import { TransactionService } from '../transactions/transactions.service';
import * as fs from "fs";
import { Chain, EthersBridge, FireblocksSDK } from 'fireblocks-defi-sdk';


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

const ethersBridge = {
  provide: "EthersBridge",
  useFactory: () => {
    const apiSecret = fs.readFileSync(process.env.FIREBLOCKS_API_SECRET_PATH, "utf8");
    const apiKey = process.env.FIREBLOCKS_API_KEY;
    const fireblocksApiBaseUrl = process.env.FIREBLOCKS_API_BASE_URL;
    const fireblocksApiClient = new FireblocksSDK(apiSecret, apiKey, fireblocksApiBaseUrl);
    return new EthersBridge({
      fireblocksApiClient,
      vaultAccountId: process.env.FIREBLOCKS_SOURCE_VAULT_ACCOUNT,
      externalWalletId: process.env.FIREBLOCKS_EXTERNAL_WALLET,
      chain: Chain.GOERLI
    });
  } 
}

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionService,
    coinchainStakingFactory,
    coinchainTokenFactory,
    ethersBridge
  ],
})
export class TransactionModule {}
