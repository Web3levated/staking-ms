import { Controller, Post, Body, Logger, HttpCode, UseFilters, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiInternalServerErrorResponse, ApiOkResponse } from "@nestjs/swagger"
import { TransactionService } from './transactions.service';
import { CreateStakesRequest } from './model/request/CreateStakesRequest';
import { UnstakeRequest } from './model/request/UnstakeRequest';
import { GenericTransactionResponse } from './model/response/GenericTransactionResponse';
import { MintRequest } from './model/request/MintRequest'
import { MintResponse } from './model/response/MintResponse';
import { TransactionError } from './error/transactions.error';
import { FireblocksException } from './error/fireblocks.exception';
import { FireblocksExceptionFilter } from './error/fireblocks-exception.filter';
import { TransactionErrorResponse } from './model/response/TransactionErrorResponse';


@Controller('transactions')
@UseFilters( new FireblocksExceptionFilter() )
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);
  constructor(private readonly transactionService: TransactionService) {}

  @Post('createStakes')
  @HttpCode(200)
  @ApiOkResponse({
    description: "Tokens successfully deposited.",
    type: GenericTransactionResponse
  })
  @ApiInternalServerErrorResponse({
    description: "Error encountered while trying to deposit",
    type: TransactionErrorResponse
  })
  @ApiBody({type: CreateStakesRequest})
  async createStakes(@Body() request: CreateStakesRequest): Promise<GenericTransactionResponse>{
    try{
      const response = await this.transactionService.createStakes(request);
      this.logger.log(JSON.stringify({
        requestId: request.requestId,
        request: request,
        response: response
      }));
      return response;
    }catch(e){
      if(e instanceof TransactionError){
        throw new FireblocksException(e.requestId, e.fireblocksTxId);
      }else{
        throw e;
      }
    }
  }

 @Post('unstake')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Deposit ID succesfully unstaked",
  type: GenericTransactionResponse
 })
 @ApiInternalServerErrorResponse({
  description: "Error encountered while trying to withdraw",
  type: TransactionErrorResponse
})
 @ApiBody({type: UnstakeRequest})
 async unstake(@Body() request: UnstakeRequest): Promise<GenericTransactionResponse>{

  try{
    const response = await this.transactionService.withdraw(request);
    this.logger.log(JSON.stringify({
      requestId: request.requestId,
      request: request,
      response: response
    }));
    return response;
  }catch(e){
    if(e instanceof TransactionError){
      throw new FireblocksException(e.requestId, e.fireblocksTxId);
    }else{
      throw e;
    }
  }
 }

 @Post('unstakeNoReward')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Deposit ID succesfully unstaked",
  type: GenericTransactionResponse
 })
 @ApiInternalServerErrorResponse({
  description: "Error encountered while trying to withdraw",
  type: TransactionErrorResponse
})
 @ApiBody({type: UnstakeRequest})
 async unstakeNoReward(@Body() request: UnstakeRequest): Promise<GenericTransactionResponse>{
  try{ 
    const response = await this.transactionService.withdrawNoReward(request);
    this.logger.log(JSON.stringify({
      requestId: request.requestId,
      request: request,
      response: response
    }));
      return response;
  } catch(e){
    if(e instanceof TransactionError){
      throw new FireblocksException(e.requestId, e.fireblocksTxId);
    }else{
      throw e;
    }
  }
 }

 @Post('mint')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Total mint allowance succesfully minted",
  type: MintResponse
 })
 @UseFilters()
 @ApiInternalServerErrorResponse({
  description: "Error encountered while trying to mint",
  type: TransactionErrorResponse
})
 @ApiBody({type: MintRequest})
 async mint(@Body() request: MintRequest): Promise<MintResponse>{
  try{
    const mintResponse = await this.transactionService.mint(request);
    this.logger.log(JSON.stringify({
      requestId: request.requestId,
      request: request,
      response: mintResponse
    }));
      return mintResponse;
  } catch(e){
    if(e instanceof TransactionError){
      throw new FireblocksException(e.requestId, e.fireblocksTxId);
    }else{
      throw e;
    }
  }
 }

}

