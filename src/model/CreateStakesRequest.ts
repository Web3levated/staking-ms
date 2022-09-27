// import { CoinchainStaking } from 'typechain/CoinchainStaking';
import { ApiProperty } from '@nestjs/swagger';
export class DepositData{
    @ApiProperty({type: String, description: "User address"})
    user: string;
    @ApiProperty({type: Number, description: "Amount of CCH tokens to stake"})
    amount: number;
    @ApiProperty({type: Number, description: "Yield config identifier"})
    yieldConfigId: number;
    @ApiProperty({type: Number, description: "Time of depoist"})
    depositTime: number;
}

export class Deposit{
    @ApiProperty({type: Number, description: "Unique identifier for individual deposit"})
    depositId: number;
    @ApiProperty({type: DepositData, description: "Deposit data"})
    data: DepositData;
}

export class CreateStakesRequest{
    @ApiProperty({type: String, description: "Unique identifier"})
    requestId: string;
    @ApiProperty({type: [Deposit], description: "List of deposits to create"})
    deposits: Deposit[];
}

