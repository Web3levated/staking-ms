import { Controller, Get, Post, Body, Logger, HttpCode, BadRequestException, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from "@nestjs/swagger"
import { ViewService } from './view.service';
import { DepositByIdRequest } from './model/request/DepositByIdRequest'
import { DepositsByUserRequest } from './model/request/DepositsByUserRequest'
import { DepositExistsResponse } from './model/response/DepositExistsResponse';
import { DepositsByUserResponse } from './model/response/DepositsByUserResponse';
import { PendingRewardsResponse } from './model/response/PendingRewardsResponse';
import { request } from 'http';



@Controller('views')
export class ViewController {
  private readonly logger = new Logger(ViewController.name);
  constructor(private readonly viewService: ViewService) {}

  @Post('depositIdExists')
  @HttpCode(200)
  @ApiOkResponse({
    description: "Deposit ID validation successful",
    type: DepositExistsResponse
  })
  @ApiBody({type: DepositByIdRequest})
  async depositIdExists(@Body() request: DepositByIdRequest): Promise<DepositExistsResponse>{
    const response = await this.viewService.depositIdExists(request);
    this.logger.log(JSON.stringify({
      requestId: request.requestId,
      request: request,
      response: response
    }));
    return response;
  }

 @Post('getPendingRewards')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Pending rewards retrieved successfully",
  type: PendingRewardsResponse
 })
 @ApiBody({type: DepositByIdRequest})
 async getPendingRewards(@Body() request: DepositByIdRequest): Promise<PendingRewardsResponse>{
    const response = await this.viewService.getPendingRewards(request);
    this.logger.log(JSON.stringify({
      requestId: request.requestId,
      request: request,
      response: response
    }));
    return response;
 }

 @Post('getDepositsByUser')
 @HttpCode(200)
 @ApiOkResponse({
  description: "Deposits for user retrieved successfully",
  type: DepositsByUserResponse
 })
 @ApiBody({type: DepositsByUserRequest})
 async getDepositsByUser(@Body() request: DepositsByUserRequest): Promise<DepositsByUserResponse>{

  const response = await this.viewService.getDepositsByUser(request);
  this.logger.log(JSON.stringify({
    requestId: request.requestId,
    request: request,
    response: response
  }));
    return response;
 }

}

