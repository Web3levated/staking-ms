import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiProperty, ApiBody, ApiOkResponse } from "@nestjs/swagger"
import { AppService } from './app.stakingService';
import { CreateStakesRequest } from './model/CreateStakesRequest';
import { UnstakeRequest } from './model/UnstakeRequest';
import { GenericResponse } from './model/GenericResponse';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('createStakes')
  @ApiOkResponse({
    description: "Tokens successfully deposited.",
    type: GenericResponse
  })
  @ApiBody({type: CreateStakesRequest})
  async createStakes(@Body() request: CreateStakesRequest): Promise<GenericResponse>{
    console.log(request);

    const depositTxHash = await this.appService.createStakes(request.deposits);
    const response =  {
      requestId: request.requestId,
      txHash: depositTxHash
    };
    console.log(JSON.stringify({
      requestId: request.requestId,
      request: request,
      response: response
    }));
    return response;
  }

 @Post('unstake')
 @ApiBody({type: UnstakeRequest})
 async unstake(@Body() request: UnstakeRequest): Promise<string>{
    return this.appService.withdraw(request.depositId);
 }

 @Post('unstakeNoReward')
 @ApiBody({type: UnstakeRequest})
 async unstakeNoReward(@Body() request: UnstakeRequest): Promise<string>{
    return this.appService.withdrawNoReward(request.depositId);
 }

 @Post('mint')
 async mint(): Promise<string>{
  return this.appService.mint();
 }
}

