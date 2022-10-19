import { ApiProperty } from '@nestjs/swagger';

export class GenericViewResponse{
    @ApiProperty({type: String, description: "Unique identifier of request"})
    requestId: string;
}