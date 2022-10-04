import { ApiProperty } from '@nestjs/swagger';
// import { IsEthereumAddress } from '../validators/IsEthereumAddress';
import { IsUUID, IsNotEmpty, IsNumber, IsString, ValidateNested, IsEthereumAddress } from 'class-validator';
import { Type } from 'class-transformer';

export class Deposit{
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({type: Number, description: "Unique identifier for individual deposit"})
    depositId: number;

    @IsNotEmpty()
    @IsEthereumAddress({ message: 'User must be valid Ethereum address'})
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

    @ApiProperty({type: [Deposit], description: "List of deposits to create"})
    @IsNotEmpty()
    @ValidateNested( {each: true} )
    @Type(() => Deposit)
    deposits: Deposit[];
}

