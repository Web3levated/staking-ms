import { ApiProperty } from "@nestjs/swagger";
import { GenericViewResponse } from "./GenericViewResponse";

export class DepositsByUserResponse extends GenericViewResponse{
    @ApiProperty({type: [Number], description: "Array of deposits of a user"})
    deposits: number[];
}