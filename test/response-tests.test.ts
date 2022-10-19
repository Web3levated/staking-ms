import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateStakesRequest } from '../src/transactions/model/request/CreateStakesRequest';
import { ethers } from 'ethers';
import { APP_PIPE } from '@nestjs/core';

describe.skip('Response Tests', () => {
  let app: INestApplication;
  const originalEnv = process.env;

  const coinchainStakingMock = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    withdrawNoReward: jest.fn(),
    mint: jest.fn(),
  };

  const coinchainStakingWithoutSignerMock = {
    connect: jest.fn().mockReturnValue(coinchainStakingMock),
  };

  beforeEach(async () => {
    // jest.resetModules();
    process.env = {
      ...originalEnv,
      COINCHAIN_STAKING_ADDRESS: '0x276f45322E0e1614C80f25faB8b3986DF0dC3777',
      COINCHAIN_TOKEN_ADDRESS: '0xEA16DC0f1eB0c0f28d74Efceee21DDE735904472',
      RPC_URL: 'testRpcUrl',
      PRIVATE_KEY:
        'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider('CoinchainStaking')
      .useValue(coinchainStakingWithoutSignerMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    coinchainStakingMock.deposit.mockReset();
    coinchainStakingMock.withdraw.mockReset();
    coinchainStakingMock.withdrawNoReward.mockReset();
    coinchainStakingMock.mint.mockReset();
    process.env = originalEnv;
  });

  describe('/createStakes (POST)', () => {
    it('Should return transaction hash with 200 status code', async () => {
      coinchainStakingMock.deposit.mockReturnValue({
        hash: 'TestTransactionHash',
        wait: jest.fn(),
      });

      const testRequest: CreateStakesRequest = {
        requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
        deposits: [
          {
            depositId: 9,
            user: ethers.Wallet.createRandom().address,
            amount: 100,
            yieldConfigId: 1,
            depositTime: Math.floor(Date.now() / 1000),
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/createStakes')
        .send(testRequest);

      expect(response.status).toEqual(200);
      expect(response.body.txHash).toEqual('TestTransactionHash');
    });

    it('Should return error response with 400 status code for bad requestId', async () => {
      coinchainStakingMock.deposit.mockReturnValue({
        hash: 'TestTransactionHash',
        wait: jest.fn(),
      });

      const testRequest = {
        requestId: 'badRequestId',
        deposits: [
          {
            depositId: 9,
            user: ethers.Wallet.createRandom().address,
            amount: "100",
            yieldConfigId: 1,
            depositTime: Math.floor(Date.now() / 1000),
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/createStakes')
        .send(testRequest);

      expect(response.status).toEqual(400);
    });

    it('Should return error response with 400 status code for bad ethereumAddress', async () => {
      coinchainStakingMock.deposit.mockReturnValue({
        hash: 'TestTransactionHash',
        wait: jest.fn(),
      });

      const testRequest = {
        requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
        deposits: [
          {
            depositId: 9,
            user: "BadEthereumAddress",
            amount: 100,
            yieldConfigId: 1,
            depositTime: Math.floor(Date.now() / 1000),
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/createStakes')
        .send(testRequest);

      expect(response.status).toEqual(400);
    });
  });

  describe("/unstake", () => {
    it("Should return 200 for a successful unstake", async () => {
      coinchainStakingMock.withdraw.mockReturnValue({
        hash: 'TestTransactionHash', 
        wait: jest.fn()
      })

      const testRequest = {
        requestId: "ae41f5ca-3dbb-4e03-93f1-50e6197215fe",
        depositId: 1
      }

      const response = await request(app.getHttpServer())
        .post("/unstake")
        .send(testRequest);

      expect(response.status).toEqual(200);
      expect(response.body.txHash).toEqual('TestTransactionHash');
    })
  })

  describe("/unstakeNoReward", () => {
    it("Should return 200 for a successful unstake", async () => {
      coinchainStakingMock.withdrawNoReward.mockReturnValue({
        hash: 'TestTransactionHash', 
        wait: jest.fn()
      })

      const testRequest = {
        requestId: "ae41f5ca-3dbb-4e03-93f1-50e6197215fe",
        depositId: 1
      }

      const response = await request(app.getHttpServer())
        .post("/unstakeNoReward")
        .send(testRequest);

      expect(response.status).toEqual(200);
      expect(response.body.txHash).toEqual('TestTransactionHash');

    })
  })

  describe("/mint", () => {
    it("Should return 200 for a successful mint", async () => {
      const mockEvents: ethers.Event[] = [
        {
          args: [
            ethers.utils.parseEther("500")
          ],
          removeListener: jest.fn(),
          getBlock: jest.fn(),
          getTransaction: jest.fn(),
          getTransactionReceipt: jest.fn(),
          blockNumber: 1,
          blockHash: "BlockHash",
          transactionIndex: 1,
          removed: false,
          address: "address",
          data: "data",
          topics: ["TokensMinted", ethers.utils.parseEther("500").toString()],
          transactionHash: "txHash",
          logIndex: 1
        }
      ]
      const transactionRecieptMock = jest.fn().mockReturnValue({
        events: mockEvents
      });

      coinchainStakingMock.mint.mockReturnValue({
        hash: 'TestTransactionHash',
        wait: transactionRecieptMock
      });


      const testRequest = {
        requestId: "ae41f5ca-3dbb-4e03-93f1-50e6197215fe"
      }

      const response = await request(app.getHttpServer())
        .post("/mint")
        .send(testRequest);

      expect(response.status).toEqual(200);
      expect(response.body.txHash).toEqual('TestTransactionHash');
      expect(response.body.mintAmount).toEqual(500);
    })
  })

});
