import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Deposit{
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({type: Number, description: "Unique identifier for individual deposit"})
    depositId: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({type: String, description: "User address"})
    user: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({type: Number, description: "Amount of CCH tokens to stake"})
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({type: Number, description: "Yield config identifier"})
    yieldConfigId: number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({type: Number, description: "Time of depoist"})
    depositTime: number;
}

export class CreateStakesRequest{
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({type: String, description: "Unique identifier"})
    requestId: string;

    @IsNotEmpty()
    @ApiProperty({type: [Deposit], description: "List of deposits to create"})
    deposits: Deposit[];
}

