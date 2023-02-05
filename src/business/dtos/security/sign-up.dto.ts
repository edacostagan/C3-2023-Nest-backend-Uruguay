import { IsAlphanumeric, IsEmail, IsNotEmpty, IsNumberString, IsString, IsUUID } from "class-validator";

export class SignUpDto{
    
    @IsNotEmpty({message:'DocumentType - This value cannot be empty!'})
    documentType: string;
                     
    @IsNumberString()
    @IsNotEmpty({message:'Document Number - This value cannot be empty!'})
    document: string;

    @IsNotEmpty({message:'Fullname - This value cannot be empty!'})
    @IsString()
    fullname: string;

    @IsEmail()
    @IsNotEmpty({message:'Email - This value cannot be empty!'})
    email: string;

    @IsNumberString()
    @IsNotEmpty({message:'Phone - This value cannot be empty!'})
    phone: string;

    @IsAlphanumeric()
    @IsNotEmpty({message:'Password - This value cannot be empty!'})       
    password: string;
        
    @IsNotEmpty({message:'AccountTypeName - This value cannot be empty!'})
    accountTypeName: string;
}