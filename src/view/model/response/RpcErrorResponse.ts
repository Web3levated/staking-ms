import { ApiProperty } from '@nestjs/swagger';

export class RpcErrorResponse {
    @ApiProperty({type: String, description: "Unique identifier of request"})
    requestId: string
    @ApiProperty({type: String, description: "Human readable description of the error that ocurred"})
    error: string
}