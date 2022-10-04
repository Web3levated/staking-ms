import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsNumber } from 'class-validator';

export class UnstakeRequest{
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({type: String, description: "Unique identifier"})
    requestId: string;
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({type: Number, description: "Deposit ID to unstake"})
    depositId: number
}