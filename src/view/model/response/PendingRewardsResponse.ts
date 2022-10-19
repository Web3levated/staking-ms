import { ApiProperty } from "@nestjs/swagger";
import { GenericViewResponse } from "./GenericViewResponse";

export class PendingRewardsResponse extends GenericViewResponse{
    @ApiProperty({type: Number, description: "Pending rewards by deposit ID"})
    rewards: number;
}