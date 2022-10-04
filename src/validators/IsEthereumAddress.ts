import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint} from 'class-validator';
import { ethers } from 'ethers';

@ValidatorConstraint({async: false})
export class EthereumAddressConstraints implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        return typeof value === 'string' && ethers.utils.isAddress(value);
    }
}

export function IsEthereumAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEthereumAddress',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: EthereumAddressConstraints,
      async: false
    });
  };
}

