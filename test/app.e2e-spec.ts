import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateStakesRequest } from '../src/transactions/model/request/CreateStakesRequest';
import { ethers } from "ethers";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const transactionResponseMock = {
    wait: jest.fn(),
    hash: jest.fn()
  }
  const coinchainStakingMock = {
    connect: jest.fn(),
    deposit: transactionResponseMock,
    withdraw: transactionResponseMock,
    withdrawNoReward: transactionResponseMock,
    mint: transactionResponseMock
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider("CoinchainStaking")
      .useValue(coinchainStakingMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    transactionResponseMock.wait.mockReset();
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/createStakes (POST)', () => {
    it('Should create a single deposit', async () => {

      coinchainStakingMock.connect.mockReturnValue({
        deposit: jest.fn().mockReturnValue({
          hash: "TestTransactionHash",
          wait: jest.fn()
        })
      });

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
