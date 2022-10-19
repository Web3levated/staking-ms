import { OverrideByFactoryOptions, Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateStakesRequest } from '../src/transactions/model/request/CreateStakesRequest';
import { ethers, PopulatedTransaction, providers } from 'ethers';
import { UnstakeRequest } from 'src/transactions/model/request/UnstakeRequest';
import { MintRequest } from 'src/transactions/model/request/MintRequest';
import { CoinchainStaking__factory } from '../typechain/factories/CoinchainStaking__factory';
import {
  CreateTransactionResponse,
  PeerType,
  TransactionOperation,
  TransactionArguments,
} from 'fireblocks-sdk';
import { MockProvider } from './apparatus/mock.ethersProvider';

describe('Request Tests', () => {
  let app: INestApplication;
  const originalEnv = process.env;

  const mockProvider = new MockProvider();
  const testCoinchainStakingFactory: OverrideByFactoryOptions = {
    factory: () =>
      CoinchainStaking__factory.connect(
        '0x7e1069AC2C84F79642F4aEDFbc858A26658F008D',
        mockProvider,
      ),
  };

  const mockBridge = {
    sendTransaction: jest.fn(),
    waitForTxHash: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      COINCHAIN_STAKING_ADDRESS: '0x276f45322E0e1614C80f25faB8b3986DF0dC3777',
      COINCHAIN_TOKEN_ADDRESS: '0xEA16DC0f1eB0c0f28d74Efceee21DDE735904472',
      RPC_URL: 'testRpcUrl',
      PRIVATE_KEY:
        'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('CoinchainStaking')
      .useFactory(testCoinchainStakingFactory)
      .overrideProvider('EthersBridge')
      .useValue(mockBridge)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    mockBridge.sendTransaction.mockReset();
    mockBridge.waitForTxHash.mockReset();
    process.env = originalEnv;
  });

  describe('deposit', () => {
    it('Should create a single deposit', async () => {
      const mockTransactionResponse: CreateTransactionResponse = {
        id: 'testId',
        status: 'SUBMITTED',
      };
      mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);
      

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
        .post('/transactions/createStakes')
        .send(testRequest);

      expect(mockBridge.sendTransaction.mock.calls.length).toBe(1);
      const actualPopulatedTransaction: PopulatedTransaction =
        mockBridge.sendTransaction.mock.calls[0][0];
      const actualFunctionData =
        CoinchainStaking__factory.createInterface().decodeFunctionData(
          'deposit',
          actualPopulatedTransaction.data,
        );
      expect(actualPopulatedTransaction.data);
      expect(actualFunctionData[0].length).toBe(1);
      expect(actualFunctionData[0][0].depositId).toStrictEqual(
        ethers.BigNumber.from(expectedDepositId),
      );
      expect(actualFunctionData[0][0].data.user).toBe(expectedUserAddress);
      expect(actualFunctionData[0][0].data.amount).toStrictEqual(
        ethers.utils.parseEther(expectedAmount.toString()),
      );
      expect(actualFunctionData[0][0].data.yieldConfigId).toStrictEqual(
        ethers.BigNumber.from(expectedYieldConfig),
      );
      expect(actualFunctionData[0][0].data.depositTime).toStrictEqual(
        ethers.BigNumber.from(expectedDepositTime),
      );
    });

      it('Should create a single deposit', async () => {
        const mockTransactionResponse: CreateTransactionResponse = {
          id: 'testId',
          status: 'SUBMITTED',
        };
        mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);

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
          .post('/transactions/createStakes')
          .send(testRequest);

        expect(mockBridge.sendTransaction.mock.calls.length).toBe(1);
        const actualPopulatedTransaction: PopulatedTransaction =
          mockBridge.sendTransaction.mock.calls[0][0];
        const actualFunctionData =
          CoinchainStaking__factory.createInterface().decodeFunctionData(
            'deposit',
            actualPopulatedTransaction.data,
          );
        expect(actualFunctionData[0].length).toBe(3);
        expect(actualFunctionData[0][0].depositId).toStrictEqual(ethers.BigNumber.from(expectedDepositId1));
        expect(actualFunctionData[0][0].data.user).toBe(expectedUserAddress1);
        expect(actualFunctionData[0][0].data.amount).toStrictEqual(ethers.utils.parseEther(expectedAmount1.toString()));
        expect(actualFunctionData[0][0].data.yieldConfigId).toStrictEqual(ethers.BigNumber.from(expectedYieldConfig1));
        expect(actualFunctionData[0][0].data.depositTime).toStrictEqual(ethers.BigNumber.from(expectedDepositTime1));

        expect(actualFunctionData[0][1].depositId).toStrictEqual(ethers.BigNumber.from(expectedDepositId2));
        expect(actualFunctionData[0][1].data.user).toBe(expectedUserAddress2);
        expect(actualFunctionData[0][1].data.amount).toStrictEqual(ethers.utils.parseEther(expectedAmount2.toString()));
        expect(actualFunctionData[0][1].data.yieldConfigId).toStrictEqual(ethers.BigNumber.from(expectedYieldConfig2));
        expect(actualFunctionData[0][1].data.depositTime).toStrictEqual(ethers.BigNumber.from(expectedDepositTime2));

        expect(actualFunctionData[0][2].depositId).toStrictEqual(ethers.BigNumber.from(expectedDepositId3));
        expect(actualFunctionData[0][2].data.user).toBe(expectedUserAddress3);
        expect(actualFunctionData[0][2].data.amount).toStrictEqual(ethers.utils.parseEther(expectedAmount3.toString()));
        expect(actualFunctionData[0][2].data.yieldConfigId).toStrictEqual(ethers.BigNumber.from(expectedYieldConfig3));
        expect(actualFunctionData[0][2].data.depositTime).toStrictEqual(ethers.BigNumber.from(expectedDepositTime3));
      });
    });

    describe("withdraw", () => {
      it("Should send withdraw transaction", async () => {
        const mockTransactionResponse: CreateTransactionResponse = {
          id: 'testId',
          status: 'SUBMITTED',
        };
        mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);

        const expectedDepositId = 1;
        const testRequest: UnstakeRequest = {
          requestId: "TestRequestId",
          depositId: expectedDepositId
        }

        await request(app.getHttpServer())
          .post('/transactions/unstake')
          .send(testRequest);

        expect(mockBridge.sendTransaction.mock.calls.length).toBe(1);
        const actualPopulatedTransaction: PopulatedTransaction =
          mockBridge.sendTransaction.mock.calls[0][0];
        const actualFunctionData =
          CoinchainStaking__factory.createInterface().decodeFunctionData(
            'withdraw',
            actualPopulatedTransaction.data,
          );
        expect(actualFunctionData[0]).toStrictEqual(ethers.constants.One);
      })
    })

    describe("withdrawNoReward", () => {
      it("Should send withdraw transaction", async () => {
        const mockTransactionResponse: CreateTransactionResponse = {
          id: 'testId',
          status: 'SUBMITTED',
        };
        mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);

        const expectedDepositId = 1;
        const testRequest: UnstakeRequest = {
          requestId: "TestRequestId",
          depositId: expectedDepositId
        }

        await request(app.getHttpServer())
          .post('/transactions/unstakeNoReward')
          .send(testRequest);

          expect(mockBridge.sendTransaction.mock.calls.length).toBe(1);
          const actualPopulatedTransaction: PopulatedTransaction =
            mockBridge.sendTransaction.mock.calls[0][0];
          const actualFunctionData =
            CoinchainStaking__factory.createInterface().decodeFunctionData(
              'withdrawNoReward',
              actualPopulatedTransaction.data,
            );        
          expect(actualFunctionData[0]).toStrictEqual(ethers.constants.One);
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
            topics: ["TokensMinted", ethers.utils.parseEther("500").toString()],
            transactionHash: "txHash",
            logIndex: 1
          }
        ]

        const transactionRecieptMock = {
          events: mockEvents,
          logs: mockEvents
        };

        const mockEthersTransactionResponse: providers.TransactionResponse = {
          hash: "MockHash",
          wait: jest.fn().mockReturnValue(transactionRecieptMock),
          confirmations: 5,
          from: "MockFrom",
          nonce: 0,
          gasLimit: ethers.constants.One,
          data: "",
          value: ethers.constants.Zero,
          chainId: 1
        }

        const mockTransactionResponse: CreateTransactionResponse = {
          id: 'testId',
          status: 'SUBMITTED',
        };
        mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);
        mockProvider.transactionResponse = mockEthersTransactionResponse;
        const testRequest: MintRequest = {
          requestId: "TestRequestId"
        }

        await request(app.getHttpServer())
          .post('/transactions/mint')
          .send(testRequest)

        expect(mockBridge.sendTransaction.mock.calls.length).toBe(1);
        expect(mockEvents.length).toBe(0);
      })
  });
});
