import { AccountTypeDto } from '../../../../business/dtos/account';
import { AccountTypeEntity } from '../../../../data/persistence/entities';
import { NotFoundException } from '@nestjs/common/exceptions';

export interface IAccountTypeFactory{
    createAccountType(accountType: AccountTypeDto): AccountTypeEntity;
}


/**
 * Creation of a SavingAccount instance of AccountTypeEntity
 */
export class savingAccount implements IAccountTypeFactory{

    private static instance: AccountTypeEntity;

    constructor() {};

    /**
     * Creates a new account type entity
     * @param accountType accuntTypeDto
     * @returns new accountType Entity
     */
    createAccountType(accountType: AccountTypeDto): AccountTypeEntity {
        
        savingAccount.instance = new AccountTypeEntity();
        savingAccount.instance.name = "Saving Account";
        return savingAccount.instance;

    }

    /**
     * Singleton - checks if the instance of ChecksAccountTypeEntity exist and return it, if not exist,  creates a new one
     * @param accountType accountTypeDto
     * @returns accountTypeEntity instance
     */
    getInstance(accountType: AccountTypeDto): AccountTypeEntity{
        if(!savingAccount.instance){
            savingAccount.instance = this.createAccountType(accountType);            
        }

        return savingAccount.instance;
    }    
}


/**
 * Creation of a ChecksAccount instance of AccountTypeEntity
 */
export class checksAccount implements IAccountTypeFactory{

    private static instance: AccountTypeEntity;

    constructor() {};

    /**
     * Creates a new account type entity
     * @param accountType accuntTypeDto
     * @returns new accountType Entity
     */
    createAccountType(accountType: AccountTypeDto): AccountTypeEntity {
        
        checksAccount.instance = new AccountTypeEntity();
        checksAccount.instance.name = "Checks Account";
        return checksAccount.instance;

    }

    /**
     * Singleton - checks if the instance of ChecksAccountTypeEntity exist and return it, if not exist,  creates a new one
     * @param accountType accountTypeDto
     * @returns accountTypeEntity instance
     */
    getInstance(accountType: AccountTypeDto): AccountTypeEntity{
        if(!checksAccount.instance){
            checksAccount.instance = this.createAccountType(accountType);            
        }

        return checksAccount.instance;
    }    
}


export class AccountTypeFactory {

    createAccountType(accountType: AccountTypeDto){
        if(accountType.name === "Saving Account"){
            const account = new savingAccount();
            return account.getInstance(accountType);
        } 
        else if(accountType.name === "Checks Account"){
            const account = new checksAccount();
            return account.getInstance(accountType);
        } 
        else{
            throw new NotFoundException("Account Type doesn't exist!");
        }
    }
}