import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateStakesRequest } from '../src/model/CreateStakesRequest';
import { ethers } from "ethers";

describe('Response Tests', () => {
  let app: INestApplication;

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
