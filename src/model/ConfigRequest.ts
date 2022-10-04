import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CpuInfo } from 'os';

export class ConfigData{

}

export class ConfigRequest{
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({type: String, description: "Unique identifier"})
    requestId: string;

    @IsNotEmpty()
    @ApiProperty({type: Number, description: "Yield Config ID"})
    yieldConfigId: number;

    @IsNotEmpty()
    @ApiProperty({type: Number, description: "Lock up time"})
    lockUpTime: number;

    @IsNotEmpty()
    @ApiProperty({type: Number, description: "Yield rate"})
    rate: number;
}