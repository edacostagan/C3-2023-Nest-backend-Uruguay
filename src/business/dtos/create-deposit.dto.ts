import { IsNotEmpty, IsNumber,  IsUUID,  } from "class-validator";

export class CreateDepositDto{
    
    @IsUUID(4, {message:'The value provided is not a UUID valid!' })
    @IsNotEmpty({message:'This value cannot be empty!'})
    accountId: string;

    @IsNumber()    
    @IsNotEmpty({message:'This value cannot be empty!'})   
    amount: number;   
    
}