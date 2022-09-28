import { ApiProperty } from '@nestjs/swagger';

export class MintRequest{
    @ApiProperty({type: String, description: "Unique identifier"})
    requestId: string;
}