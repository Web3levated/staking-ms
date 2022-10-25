import { Controller, Get, Post, Body, Logger, HttpCode, BadRequestException, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger"
import { ViewService } from './view.service';
import { DepositByIdRequest } from './model/request/DepositByIdRequest'
import { DepositsByUserRequest } from './model/request/DepositsByUserRequest'
import { DepositExistsResponse } from './model/response/DepositExistsResponse';
import { DepositsByUserResponse } from './model/response/DepositsByUserResponse';
import { PendingRewardsResponse } from './model/response/PendingRewardsResponse';
import { RpcExceptionFilter } from './error/rpc-exception.filter';
import { RpcErrorResponse } from './model/response/RpcErrorResponse';
import { ViewError } from './error/view.error';
import { request } from 'http';
import { RpcException } from './error/rpc.exception';



@Controller('views')
@UseFilters( new RpcExceptionFilter())
export class ViewController {
  private readonly logger = new Logger(ViewController.name);
  constructor(private readonly viewService: ViewService) {}

  @Post('depositIdExists')
  @HttpCode(200)
  @ApiOkResponse({
    description: "Deposit ID validation successful",
    type: DepositExistsResponse
  })
  @ApiInternalServerErrorResponse({
    description: "Error encountered while checking if deposit ID exists",
    type: RpcErrorResponse
  })
  @ApiBody({type: DepositByIdRequest})
  async depositIdExists(@Body() request: DepositByIdRequest): Promise<DepositExistsResponse>{
    try{
      const response = await this.viewService.depositIdExists(request);
      this.logger.log(JSON.stringify({
        requestId: request.requestId,
        request: request,
        response: response
      }));
      return response;
    } catch(e) {
      if(e instanceof ViewError){
        throw new RpcException(e.message, e.requestId);
      }else{
        throw e;
      }
    }
  }

 @Post('getPendingRewards')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Pending rewards retrieved successfully",
  type: PendingRewardsResponse
 })
 @ApiInternalServerErrorResponse({
  description: "Error encountered while retrieving pending rewards",
  type: RpcErrorResponse
})
 @ApiBody({type: DepositByIdRequest})
 async getPendingRewards(@Body() request: DepositByIdRequest): Promise<PendingRewardsResponse>{
    try{
      const response = await this.viewService.getPendingRewards(request);
      this.logger.log(JSON.stringify({
        requestId: request.requestId,
        request: request,
        response: response
      }));
      return response;
    }  catch(e){
      if(e instanceof ViewError){
        throw new RpcException(e.message, e.requestId);
      }else{
        throw e;
      }
    }
 }

 @Post('getDepositsByUser')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Deposits for user retrieved successfully",
  type: DepositsByUserResponse
 })
 @ApiInternalServerErrorResponse({
  description: "Error encountered while retrieving deposits by user address",
  type: RpcErrorResponse
})
 @ApiBody({type: DepositsByUserRequest})
 async getDepositsByUser(@Body() request: DepositsByUserRequest): Promise<DepositsByUserResponse>{
  try{
    const response = await this.viewService.getDepositsByUser(request);
    this.logger.log(JSON.stringify({
      requestId: request.requestId,
      request: request,
      response: response
    }));
      return response;
  } catch(e){
    if(e instanceof ViewError){
      throw new RpcException(e.message, e.requestId);
    }else{
      throw e;
    }
  }
 }

}

