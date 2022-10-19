import { ApiProperty } from '@nestjs/swagger';
import { GenericTransactionRequest } from './GenericTransactionRequest';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UnstakeRequest extends GenericTransactionRequest{
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({type: Number, description: "Deposit ID to unstake"})
    depositId: number
}