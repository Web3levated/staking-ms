import { ApiProperty } from '@nestjs/swagger';

export class UnstakeRequest{
    @ApiProperty({type: Number, description: "Deposit ID to unstake"})
    depositId: number
}