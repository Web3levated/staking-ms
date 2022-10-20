import { OverrideByFactoryOptions, Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MockProvider } from '../apparatus/mock.ethersProvider';
import { CoinchainStaking__factory } from '../../typechain/factories/CoinchainStaking__factory';
import { DepositByIdRequest } from 'src/view/model/request/DepositByIdRequest';
import { CoinchainStakingInterface } from 'typechain/CoinchainStaking';
import { ethers } from 'ethers';
import { DepositsByUserRequest } from 'src/view/model/request/DepositsByUserRequest';

describe('View: Response Tests', () => {
  let app: INestApplication;
  const originalEnv = process.env;
  const mockProvider = new MockProvider();
  const coinchainStakingInterface: CoinchainStakingInterface =
    CoinchainStaking__factory.createInterface();
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
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    mockProvider.reset();
  });

  describe('depositIdExists', () => {
    it('Should return 200 status code and exists=false', async () => {
      const testRequest: DepositByIdRequest = {
        requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
        depositId: 1,
      };

      let stubResponse = coinchainStakingInterface.encodeFunctionResult(
        'deposits',
        [
          ethers.constants.AddressZero,
          ethers.constants.Zero,
          ethers.constants.Zero,
          ethers.constants.Zero,
        ],
      );

      mockProvider.setStubResponses([stubResponse]);

      const actualResponse = await request(app.getHttpServer())
        .post('/views/depositIdExists')
        .send(testRequest);
      expect(actualResponse.status).toBe(200);
      expect(actualResponse.body.exists).toBe(false);
      expect(actualResponse.body.requestId).toBe(testRequest.requestId);
    });

    it('Should return 200 status code and exists=true', async () => {
      const testRequest: DepositByIdRequest = {
        requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
        depositId: 1,
      };

      let stubResponse = coinchainStakingInterface.encodeFunctionResult(
        'deposits',
        [
          '0x2C8C6D4b360bf3ce7B2b641B27D0c7534A63E99F',
          ethers.utils.parseEther('100'),
          ethers.constants.One,
          ethers.BigNumber.from(1666048594),
        ],
      );

      mockProvider.setStubResponses([stubResponse]);

      const actualResponse = await request(app.getHttpServer())
        .post('/views/depositIdExists')
        .send(testRequest);
      expect(actualResponse.status).toBe(200);
      expect(actualResponse.body.exists).toBe(true);
      expect(actualResponse.body.requestId).toBe(testRequest.requestId);
    });

    it('Should return 500 status code', async () => {
      const testRequest: DepositByIdRequest = {
        requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
        depositId: 1,
      };
      mockProvider.callError = new Error("Expected test error")

      const actualResponse = await request(app.getHttpServer())
        .post('/views/depositIdExists')
        .send(testRequest);
      expect(actualResponse.status).toBe(500);
      expect(actualResponse.body.requestId).toBe(testRequest.requestId);
    });
  });

  describe('getPendingRewards', () => {
    it('Should return 200 status code and reward amount', async () => {
      const testRequest: DepositByIdRequest = {
        requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
        depositId: 1,
      };
      let stubResponse = coinchainStakingInterface.encodeFunctionResult(
        'calculatePendingRewards',
        [ethers.utils.parseEther('100')],
      );

      mockProvider.setStubResponses([stubResponse]);

      const actualResponse = await request(app.getHttpServer())
        .post('/views/getPendingRewards')
        .send(testRequest);

      expect(actualResponse.statusCode).toBe(200);
      expect(actualResponse.body.requestId).toBe(testRequest.requestId);
      expect(actualResponse.body.rewards).toBe(100);
    });

    it('Should return 500 status code when error encountered', async () => {
      const testRequest: DepositByIdRequest = {
        requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
        depositId: 1,
      };

      mockProvider.callError = new Error("Expected test error")

      const actualResponse = await request(app.getHttpServer())
        .post('/views/getPendingRewards')
        .send(testRequest);

      expect(actualResponse.status).toBe(500);
      expect(actualResponse.body.requestId).toBe(testRequest.requestId);
    });
  });

  describe('getDepositsByUser', () => {

    it('Should return 200 status code and a single depositId', async () => {
      const testRequest: DepositsByUserRequest = {
        requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
        user: '0x2C8C6D4b360bf3ce7B2b641B27D0c7534A63E99F',
      };

      let stubResponse = coinchainStakingInterface.encodeFunctionResult(
        'getDepositsByUser',
        [[ethers.BigNumber.from(1)]],
      );

      mockProvider.setStubResponses([stubResponse]);

      const actualResponse = await request(app.getHttpServer())
        .post('/views/getDepositsByUser')
        .send(testRequest);

      expect(actualResponse.statusCode).toBe(200);
      expect(actualResponse.body.requestId).toBe(testRequest.requestId);
      expect(actualResponse.body.deposits.length).toBe(1);
      expect(actualResponse.body.deposits[0]).toBe(1);
    });

    it('Should return 200 status code and a multiple depositIds', async () => {
      const testRequest: DepositsByUserRequest = {
        requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
        user: '0x2C8C6D4b360bf3ce7B2b641B27D0c7534A63E99F',
      };

      let stubResponse = coinchainStakingInterface.encodeFunctionResult(
        'getDepositsByUser',
        [
          [
            ethers.BigNumber.from(1),
            ethers.BigNumber.from(2),
            ethers.BigNumber.from(7),
          ],
        ],
      );

      mockProvider.setStubResponses([stubResponse]);

      const actualResponse = await request(app.getHttpServer())
        .post('/views/getDepositsByUser')
        .send(testRequest);

      expect(actualResponse.statusCode).toBe(200);
      expect(actualResponse.body.requestId).toBe(testRequest.requestId);
      expect(actualResponse.body.deposits.length).toBe(3);
      expect(actualResponse.body.deposits[0]).toBe(1);
      expect(actualResponse.body.deposits[1]).toBe(2);
      expect(actualResponse.body.deposits[2]).toBe(7);
    });
  });
});
