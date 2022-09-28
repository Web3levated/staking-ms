import { ApiProperty } from '@nestjs/swagger';

export class UnstakeRequest{
    @ApiProperty({type: String, description: "Unique identifier"})
    requestId: string;
    @ApiProperty({type: Number, description: "Deposit ID to unstake"})
    depositId: number
}