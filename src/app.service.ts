import { Inject, Injectable } from '@nestjs/common';
import { time } from 'console';
import { PopulatedTransaction } from 'ethers';
import { Chain, EthersBridge, FireblocksSDK } from 'fireblocks-defi-sdk';
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
    const apiSecret = process.env.FIREBLOCKS_API_SECRET_PATH;
    const apiKey = process.env.FIREBLOCKS_API_KEY;
    const fireblocksApiBaseUrl = process.env.FIREBLOCKS_API_BASE_URL;
    const vaultAccount = process.env.FIREBLOCKS_CCH_VAULT;
    const fireblocksApiClient = new FireblocksSDK(apiSecret, apiKey, fireblocksApiBaseUrl);
    // const bridge = new EthersBridge({
    //   fireblocksApiClient,
    //   vaultAccountId: vaultAccount,
    //   externalWalletId: this.coinchainStaking.address,
    //   chain: Chain.ROPSTEN
    // })
    // const deposit: CoinchainStaking.DepositStruct = {
    //   depositId: 1,
    //   data: {
    //     user: "0xBEf62fCa4E7bC887C295db13Bc4c81D0c3B786eF",
    //     amount: 100,
    //     yieldConfigId: 1,
    //     depositTime: Date.now() / 1000
    //   }
    // }
    // const populatedTransaction: PopulatedTransaction = await this.coinchainStaking.populateTransaction.deposit([deposit]);
    // const res  = await bridge.sendTransaction(populatedTransaction);
    // const txHash = await bridge.waitForTxHash(res.id);
    const tokenBridge = new EthersBridge({
      fireblocksApiClient,
      vaultAccountId: vaultAccount,
      externalWalletId: this.coinchainToken.address,
      chain: Chain.GOERLI
    });
    return "createStakes called";
  }
}
