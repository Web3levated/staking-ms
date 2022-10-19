import { ApiProperty } from "@nestjs/swagger";
import { GenericTransactionResponse } from "./GenericTransactionResponse";

export class MintResponse extends GenericTransactionResponse{
    @ApiProperty({type: Number, description: "Number of tokens minted"})
    mintAmount: number;
}