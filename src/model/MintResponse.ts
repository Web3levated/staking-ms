import { ApiProperty } from "@nestjs/swagger";
import { GenericResponse } from "./GenericResponse";

export class MintResponse extends GenericResponse{
    @ApiProperty({type: Number, description: "Number of tokens minted"})
    mintAmount: number;
}