import { ApiProperty } from '@nestjs/swagger';
export class GenericResponse{
    @ApiProperty({type: String, description: "Unique identifier of request"})
    requestId: string;
    @ApiProperty({type: String, description: "Transaction hash of the completed blockchain transaction"})
    txHash: string;
}