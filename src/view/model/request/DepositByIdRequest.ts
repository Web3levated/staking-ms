import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { GenericViewRequest } from './GenericViewRequests';

export class DepositByIdRequest extends GenericViewRequest{
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({type: Number, description: "Deposit ID to unstake"})
    depositId: number
}