import { OverrideByFactoryOptions, Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateStakesRequest } from '../src/model/CreateStakesRequest';
import { ethers, providers } from 'ethers';
import { APP_PIPE } from '@nestjs/core';
import { MockProvider } from './apparatus/mock.ethersProvider';
import { CoinchainStaking__factory } from '../typechain/factories/CoinchainStaking__factory';
import {
  CreateTransactionResponse,
  PeerType,
  TransactionOperation,
  TransactionArguments,
} from 'fireblocks-sdk';
import { MintRequest } from 'src/model/MintRequest';

describe('Response Tests', () => {
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
      .useFactory(testCoinchainStakingFactory)
      .overrideProvider('EthersBridge')
      .useValue(mockBridge)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    mockBridge.sendTransaction.mockReset();
    mockBridge.waitForTxHash.mockReset();
    process.env = originalEnv;
  });

  describe('/createStakes (POST)', () => {
    it('Should return transaction hash with 200 status code', async () => {

      const mockTransactionResponse: CreateTransactionResponse = {
        id: 'testId',
        status: 'SUBMITTED',
      };
      mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);
      mockBridge.waitForTxHash.mockReturnValue('TestTransactionHash');

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
      const mockTransactionResponse: CreateTransactionResponse = {
        id: 'testId',
        status: 'SUBMITTED',
      };
      mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);
      mockBridge.waitForTxHash.mockReturnValue('TestTransactionHash');

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
      const mockTransactionResponse: CreateTransactionResponse = {
        id: 'testId',
        status: 'SUBMITTED',
      };
      mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);
      mockBridge.waitForTxHash.mockReturnValue('TestTransactionHash');

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
      const mockTransactionResponse: CreateTransactionResponse = {
        id: 'testId',
        status: 'SUBMITTED',
      };
      mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);
      mockBridge.waitForTxHash.mockReturnValue('TestTransactionHash');

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
      const mockTransactionResponse: CreateTransactionResponse = {
        id: 'testId',
        status: 'SUBMITTED',
      };
      mockBridge.sendTransaction.mockReturnValue(mockTransactionResponse);
      mockBridge.waitForTxHash.mockReturnValue('TestTransactionHash');

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

      mockBridge.waitForTxHash.mockReturnValue('TestTransactionHash');


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
