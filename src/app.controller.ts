import { Controller, Get, Post, Body, Logger, HttpCode, BadRequestException, UseFilters } from '@nestjs/common';

import { ApiProperty, ApiBody, ApiOkResponse } from "@nestjs/swagger"
import { AppService } from './app.stakingService';
import { CreateStakesRequest } from './model/CreateStakesRequest';
import { UnstakeRequest } from './model/UnstakeRequest';
import { GenericResponse } from './model/GenericResponse';
import { MintRequest } from './model/MintRequest'
import { ConfigRequest } from './model/ConfigRequest';
import { request } from 'http';
import { MintResponse } from './model/MintResponse';


@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('createStakes')
  @HttpCode(200)
  @ApiOkResponse({
    description: "Tokens successfully deposited.",
    type: GenericResponse
  })
  @ApiBody({type: CreateStakesRequest})
  async createStakes(@Body() request: CreateStakesRequest): Promise<GenericResponse>{
    const depositTxHash = await this.appService.createStakes(request.deposits);
    const response =  {
      requestId: request.requestId,
      txHash: depositTxHash
    };
    this.logger.log(JSON.stringify({
      requestId: request.requestId,
      request: request,
      response: response
    }));
    return response;
  }

 @Post('unstake')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Deposit ID succesfully unstaked",
  type: GenericResponse
 })
 @ApiBody({type: UnstakeRequest})
 async unstake(@Body() request: UnstakeRequest): Promise<GenericResponse>{

    const unstakeTxHash = await this.appService.withdraw(request.depositId);
    const response = {
      requestId: request.requestId,
      txHash: unstakeTxHash
    }
    this.logger.log(JSON.stringify({
      requestId: request.requestId,
      request: request,
      response: response
    }));
    return response;
 }

 @Post('unstakeNoReward')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Deposit ID succesfully unstaked",
  type: GenericResponse
 })
 @ApiBody({type: UnstakeRequest})
 async unstakeNoReward(@Body() request: UnstakeRequest): Promise<GenericResponse>{

  const unstakeNoRewardTxHash = await this.appService.withdrawNoReward(request.depositId);
  const response = {
    requestId: request.requestId,
    txHash: unstakeNoRewardTxHash
  }
  this.logger.log(JSON.stringify({
    requestId: request.requestId,
    request: request,
    response: response
  }));
    return response;
 }

 @Post('mint')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Total mint allowance succesfully minted",
  type: MintResponse
 })
 @UseFilters()
 @ApiBody({type: MintRequest})
 async mint(@Body() request: MintRequest): Promise<MintResponse>{
  const mintResponse = await this.appService.mint(request);
  this.logger.log(JSON.stringify({
    requestId: request.requestId,
    request: request,
    response: mintResponse
  }));
    return mintResponse;
 }

 @Post('setYieldConfig')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Yield config succesfully set",
  type: GenericResponse
 })
 async setYieldConfig(@Body() request: ConfigRequest): Promise<GenericResponse>{
  const setTxHash = await this.appService.setYieldConfig(request);
  const response = {
    requestId: request.requestId,
    txHash: setTxHash
  }
  this.logger.log(JSON.stringify({
    requestId: request.requestId,
    request: request,
    response: response
  }));
    return response;
 }

}

