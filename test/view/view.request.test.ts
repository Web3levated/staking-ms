import { OverrideByFactoryOptions, Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MockProvider } from '../apparatus/mock.ethersProvider';
import { CoinchainStaking__factory } from '../../typechain/factories/CoinchainStaking__factory';
import { DepositByIdRequest } from 'src/view/model/request/DepositByIdRequest';
import { CoinchainStakingInterface } from 'typechain/CoinchainStaking';
import { ethers } from 'ethers';
import { DepositsByUserRequest } from 'src/view/model/request/DepositsByUserRequest';

describe.skip('View: Request Tests', () => {
  let app: INestApplication;
  const originalEnv = process.env;
  const mockProvider = new MockProvider();
  const coinchainStakingInterface: CoinchainStakingInterface = CoinchainStaking__factory.createInterface();
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
    await app.init();
  })

  afterEach(async () => {
    mockProvider.reset();
  })

  describe('depositIdExists', () => {
    it("Should populate deposits() function call with correct values", async () => {
        const testRequest: DepositByIdRequest = {
            requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
            depositId: 1
        };

        let stubResponse = coinchainStakingInterface.encodeFunctionResult("deposits", [
            ethers.constants.AddressZero,
            ethers.constants.Zero,
            ethers.constants.Zero,
            ethers.constants.Zero
        ]);

        mockProvider.setStubResponses([stubResponse]);

        await request(app.getHttpServer())
            .post('/views/depositIdExists')
            .send(testRequest)
        
        let spyData = await mockProvider.getSpyData();
        let actualFunctionData = coinchainStakingInterface.decodeFunctionData("deposits", spyData[0].data);
        expect(actualFunctionData[0]).toStrictEqual(ethers.BigNumber.from(1));
    })
  })

  describe("getPendingRewards", () => {
    it("Should populate calculatePendingRewards() function call with correct values", async () => {
        const testRequest: DepositByIdRequest = {
            requestId: 'ae41f5ca-3dbb-4e03-93f1-50e6197215fe',
            depositId: 1
        };
        let stubResponse = coinchainStakingInterface.encodeFunctionResult("calculatePendingRewards", [
            ethers.utils.parseEther("100")
        ]);
    
        mockProvider.setStubResponses([stubResponse]);
    
        await request(app.getHttpServer())
            .post('/views/getPendingRewards')
            .send(testRequest)

        let spyData = await mockProvider.getSpyData();
        let actualFunctionData = coinchainStakingInterface.decodeFunctionData("calculatePendingRewards", spyData[0].data);
        expect(actualFunctionData[0]).toStrictEqual(ethers.BigNumber.from(1));
    })

  })

  describe("getDepositsByUser", () => {
    it("Should populate getDepositsByUser() function call with correct value", async () => {
        const testRequest: DepositsByUserRequest = {
            requestId: "ae41f5ca-3dbb-4e03-93f1-50e6197215fe",
            user: "0x2C8C6D4b360bf3ce7B2b641B27D0c7534A63E99F"
        };

        let stubResponse = coinchainStakingInterface.encodeFunctionResult("getDepositsByUser", [
            [ethers.BigNumber.from(1)]
        ])

        mockProvider.setStubResponses([stubResponse]);

        await request(app.getHttpServer())
            .post("/views/getDepositsByUser")
            .send(testRequest)
        
        let spyData = await mockProvider.getSpyData();
        let actualFunctionData = coinchainStakingInterface.decodeFunctionData("getDepositsByUser", spyData[0].data);
        expect(actualFunctionData[0]).toBe(testRequest.user);
    })
  })
});
