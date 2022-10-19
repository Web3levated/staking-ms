import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEthereumAddress } from 'class-validator';
import { GenericViewRequest } from './GenericViewRequests';

export class DepositsByUserRequest extends GenericViewRequest{
    @IsNotEmpty()
    @IsEthereumAddress({ message: 'User must be valid Ethereum address'})
    @ApiProperty({type: String, description: "Address of user"})
    user: string
}