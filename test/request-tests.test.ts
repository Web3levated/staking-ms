import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateStakesRequest } from '../src/model/CreateStakesRequest';
import { ethers } from 'ethers';
import { UnstakeRequest } from 'src/model/UnstakeRequest';
import { MintRequest } from 'src/model/MintRequest';

describe('Request Tests', () => {
  let app: INestApplication;

  const coinchainStakingMock = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    withdrawNoReward: jest.fn(),
    mint: jest.fn(),
  };

  const coinchainStakingWithoutSignerMock = {
    connect: jest.fn().mockReturnValue(coinchainStakingMock),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('CoinchainStaking')
      .useValue(coinchainStakingWithoutSignerMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  })

  afterEach(async () => {
    coinchainStakingMock.deposit.mockReset();
    coinchainStakingMock.withdraw.mockReset();
    coinchainStakingMock.withdrawNoReward.mockReset();
    coinchainStakingMock.mint.mockReset();
  });

  describe('deposit', () => {
    it('Should create a single deposit', async () => {
      coinchainStakingMock.deposit.mockReturnValue({
        hash: 'TestTransactionHash',
        wait: jest.fn(),
      });

      const expectedDepositId = 1;
      const expectedUserAddress = ethers.Wallet.createRandom().address;
      const expectedAmount = 100;
      const expectedYieldConfig = 1;
      const expectedDepositTime = Math.floor(Date.now() / 1000);
      const testRequest: CreateStakesRequest = {
        requestId: 'TestRequestId',
        deposits: [
          {
            depositId: expectedDepositId,
            user: expectedUserAddress,
            amount: expectedAmount,
            yieldConfigId: expectedYieldConfig,
            depositTime: expectedDepositTime,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/createStakes')
        .send(testRequest);

      expect(coinchainStakingMock.deposit.mock.calls.length).toBe(1);
      expect(coinchainStakingMock.deposit.mock.calls[0][0].length).toBe(1);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].depositId).toBe(expectedDepositId);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].data.user).toBe(expectedUserAddress);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].data.amount).toStrictEqual(ethers.utils.parseEther(expectedAmount.toString()));
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].data.yieldConfigId).toBe(expectedYieldConfig);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].data.depositTime).toBe(expectedDepositTime);

    });

    it('Should create a single deposit', async () => {
      coinchainStakingMock.deposit.mockReturnValue({
        hash: 'TestTransactionHash',
        wait: jest.fn(),
      });

      const expectedDepositId1 = 1;
      const expectedDepositId2 = 2;
      const expectedDepositId3 = 3;
      const expectedUserAddress1 = ethers.Wallet.createRandom().address;
      const expectedUserAddress2 = ethers.Wallet.createRandom().address;
      const expectedUserAddress3 = ethers.Wallet.createRandom().address;
      const expectedAmount1 = 100;
      const expectedAmount2 = 200;
      const expectedAmount3 = 300;
      const expectedYieldConfig1 = 1;
      const expectedYieldConfig2 = 2;
      const expectedYieldConfig3 = 3;
      const expectedDepositTime1 = Math.floor(Date.now() / 1000);
      const expectedDepositTime2 = Math.floor(Date.now() / 1000);
      const expectedDepositTime3 = Math.floor(Date.now() / 1000);
      const testRequest: CreateStakesRequest = {
        requestId: 'TestRequestId',
        deposits: [
          {
            depositId: expectedDepositId1,
            user: expectedUserAddress1,
            amount: expectedAmount1,
            yieldConfigId: expectedYieldConfig1,
            depositTime: expectedDepositTime1,
          },
          {
            depositId: expectedDepositId2,
            user: expectedUserAddress2,
            amount: expectedAmount2,
            yieldConfigId: expectedYieldConfig2,
            depositTime: expectedDepositTime2,
          },
          {
            depositId: expectedDepositId3,
            user: expectedUserAddress3,
            amount: expectedAmount3,
            yieldConfigId: expectedYieldConfig3,
            depositTime: expectedDepositTime3,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/createStakes')
        .send(testRequest);

      expect(coinchainStakingMock.deposit.mock.calls.length).toBe(1);
      expect(coinchainStakingMock.deposit.mock.calls[0][0].length).toBe(3);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].depositId).toBe(expectedDepositId1);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].data.user).toBe(expectedUserAddress1);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].data.amount).toStrictEqual(ethers.utils.parseEther(expectedAmount1.toString()));
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].data.yieldConfigId).toBe(expectedYieldConfig1);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][0].data.depositTime).toBe(expectedDepositTime1);

      expect(coinchainStakingMock.deposit.mock.calls[0][0][1].depositId).toBe(expectedDepositId2);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][1].data.user).toBe(expectedUserAddress2);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][1].data.amount).toStrictEqual(ethers.utils.parseEther(expectedAmount2.toString()));
      expect(coinchainStakingMock.deposit.mock.calls[0][0][1].data.yieldConfigId).toBe(expectedYieldConfig2);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][1].data.depositTime).toBe(expectedDepositTime2);

      expect(coinchainStakingMock.deposit.mock.calls[0][0][2].depositId).toBe(expectedDepositId3);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][2].data.user).toBe(expectedUserAddress3);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][2].data.amount).toStrictEqual(ethers.utils.parseEther(expectedAmount3.toString()));
      expect(coinchainStakingMock.deposit.mock.calls[0][0][2].data.yieldConfigId).toBe(expectedYieldConfig3);
      expect(coinchainStakingMock.deposit.mock.calls[0][0][2].data.depositTime).toBe(expectedDepositTime3);
    });
  });

  describe("withdraw", () => {
    it("Should send withdraw transaction", async () => {
      coinchainStakingMock.withdraw.mockReturnValue({
        hash: 'TestTransactionHash',
        wait: jest.fn(),
      });

      const expectedDepositId = 1;
      const testRequest: UnstakeRequest = {
        requestId: "TestRequestId",
        depositId: expectedDepositId
      }

      await request(app.getHttpServer())
        .post('/unstake')
        .send(testRequest);

      expect(coinchainStakingMock.withdraw.mock.calls.length).toBe(1);
      expect(coinchainStakingMock.withdraw.mock.calls[0][0]).toBe(1);
    })
  })

  describe("withdrawNoReward", () => {
    it("Should send withdraw transaction", async () => {
      coinchainStakingMock.withdrawNoReward.mockReturnValue({
        hash: 'TestTransactionHash',
        wait: jest.fn(),
      });

      const expectedDepositId = 1;
      const testRequest: UnstakeRequest = {
        requestId: "TestRequestId",
        depositId: expectedDepositId
      }

      await request(app.getHttpServer())
        .post('/unstakeNoReward')
        .send(testRequest);

      expect(coinchainStakingMock.withdrawNoReward.mock.calls.length).toBe(1);
      expect(coinchainStakingMock.withdrawNoReward.mock.calls[0][0]).toBe(1);
    })
  })

  describe("mint", () => {
    it("Should sent a minting request", async () => {
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
          topics: [""],
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
      const testRequest: MintRequest = {
        requestId: "TestRequestId"
      }
  
      await request(app.getHttpServer())
        .post('/mint')
        .send(testRequest)

      expect(coinchainStakingMock.mint.mock.calls.length).toBe(1);
      expect(mockEvents.length).toBe(0);
    })
  })
});
