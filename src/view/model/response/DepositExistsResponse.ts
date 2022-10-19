import { ApiProperty } from "@nestjs/swagger";
import { GenericViewResponse } from "./GenericViewResponse";

export class DepositExistsResponse extends GenericViewResponse{
    @ApiProperty({type: Boolean, description: "Defines if deposit ID already exists"})
    exists: boolean;
}