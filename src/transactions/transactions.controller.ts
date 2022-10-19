import { Controller, Post, Body, Logger, HttpCode, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from "@nestjs/swagger"
import { TransactionService } from './transactions.service';
import { CreateStakesRequest } from './model/request/CreateStakesRequest';
import { UnstakeRequest } from './model/request/UnstakeRequest';
import { GenericTransactionResponse } from './model/response/GenericTransactionResponse';
import { MintRequest } from './model/request/MintRequest'
import { MintResponse } from './model/response/MintResponse';


@Controller()
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);
  constructor(private readonly transactionService: TransactionService) {}

  @Post('createStakes')
  @HttpCode(200)
  @ApiOkResponse({
    description: "Tokens successfully deposited.",
    type: GenericTransactionResponse
  })
  @ApiBody({type: CreateStakesRequest})
  async createStakes(@Body() request: CreateStakesRequest): Promise<GenericTransactionResponse>{
    const response = await this.transactionService.createStakes(request);
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
  type: GenericTransactionResponse
 })
 @ApiBody({type: UnstakeRequest})
 async unstake(@Body() request: UnstakeRequest): Promise<GenericTransactionResponse>{

    const response = await this.transactionService.withdraw(request);
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
  type: GenericTransactionResponse
 })
 @ApiBody({type: UnstakeRequest})
 async unstakeNoReward(@Body() request: UnstakeRequest): Promise<GenericTransactionResponse>{

  const response = await this.transactionService.withdrawNoReward(request);
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
  const mintResponse = await this.transactionService.mint(request);
  this.logger.log(JSON.stringify({
    requestId: request.requestId,
    request: request,
    response: mintResponse
  }));
    return mintResponse;
 }

}

