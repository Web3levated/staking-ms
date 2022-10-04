import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateStakesRequest } from '../src/model/CreateStakesRequest';
import { ethers } from "ethers";

describe('Response Tests', () => {
  let app: INestApplication;
  const originalEnv = process.env;

  const coinchainStakingMock = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    withdrawNoReward: jest.fn(),
    mint: jest.fn()
  }

  const coinchainStakingWithoutSignerMock = {
    connect: jest.fn().mockReturnValue(coinchainStakingMock),
  }

  beforeEach(async () => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      COINCHAIN_STAKING_ADDRESS: "0x276f45322E0e1614C80f25faB8b3986DF0dC3777",
      COINCHAIN_TOKEN_ADDRESS:"0xEA16DC0f1eB0c0f28d74Efceee21DDE735904472",
      RPC_URL: "testRpcUrl",
      PRIVATE_KEY: "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    }
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider("CoinchainStaking")
      .useValue(coinchainStakingWithoutSignerMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    coinchainStakingMock.deposit.mockReset();
    coinchainStakingMock.withdraw.mockReset();
    coinchainStakingMock.withdrawNoReward.mockReset();
    coinchainStakingMock.mint.mockReset();
    process.env = originalEnv;
  })

  describe('/createStakes (POST)', () => {
    it('Should create a single deposit', async () => {

        coinchainStakingMock.deposit.mockReturnValue({
            hash: "TestTransactionHash",
            wait: jest.fn()
        })

        const testRequest: CreateStakesRequest = {
        requestId: "TestRequestId",
        deposits: [
            {
            depositId: 9,
            user: ethers.Wallet.createRandom().address,
            amount: 100,
            yieldConfigId: 1,
            depositTime: Math.floor(Date.now() / 1000)
            }
        ]
        }

        const response = await request(app.getHttpServer())
            .post('/createStakes')
            .send(testRequest)
            
        expect(response.status).toEqual(200);
        expect(response.body.txHash).toEqual("TestTransactionHash");
    })
  })

});
