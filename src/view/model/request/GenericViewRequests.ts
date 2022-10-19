import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class GenericViewRequest{
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({type: String, description: "Unique identifier"})
    requestId: string;
}