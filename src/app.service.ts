import { Inject, Injectable } from '@nestjs/common';
import { time } from 'console';
import { PopulatedTransaction } from 'ethers';
import { Chain, EthersBridge, FireblocksSDK } from 'fireblocks-defi-sdk';
import { CoinchainStaking } from 'typechain';

@Injectable()
export class AppService {
  constructor(
    @Inject("CoinchainStaking") 
    private readonly coinchainStaking: CoinchainStaking
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createStakes() : Promise<string> {
    const apiSecret = "secret";
    const apiKey = "key";
    const fireblocksApiBaseUrl = "url";
    const vaultAccount = "vaultAccount";
    const fireblocksApiClient = new FireblocksSDK(apiSecret, apiKey, fireblocksApiBaseUrl);
    const bridge = new EthersBridge({
      fireblocksApiClient,
      vaultAccountId: vaultAccount,
      externalWalletId: this.coinchainStaking.address,
      chain: Chain.ROPSTEN
    })
    const deposit: CoinchainStaking.DepositStruct = {
      depositId: 1,
      data: {
        user: "0xBEf62fCa4E7bC887C295db13Bc4c81D0c3B786eF",
        amount: 100,
        yieldConfigId: 1,
        depositTime: Date.now() / 1000
      }
    }
    const populatedTransaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.deposit([deposit]);
    const res  = await bridge.sendTransaction(populatedTransaction);
    const txHash = await bridge.waitForTxHash(res.id);
    return "createStakes called";
  }
}
