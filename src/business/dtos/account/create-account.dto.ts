import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAccountDto{
    
    @IsUUID(4, {message:'The value provided is not a UUID valid!' })
    @IsNotEmpty({message:'CustomerID - This value cannot be empty!'})
    customerId: string;
    
    @IsNotEmpty({message:'AccountTypeName - This value cannot be empty!'})
    @IsString()
    accountTypeName: string;
    
    
}