import { AccountTypeEntity } from "../../../../data/persistence/entities";
import { AccountTypeFactory } from "../../factory/accountType";

export interface IAccountTypeStrategy{
    assignAccountType(): AccountTypeEntity;
}


export class AccountTypeContext {
    private strategy: IAccountTypeStrategy;

    constructor(strategy: IAccountTypeStrategy) {
        this.strategy = strategy;
    }

    assignAccountTypeStrategy(): AccountTypeEntity {
        return this.strategy.assignAccountType();
    }
}

export class SavingAccountStrategy implements IAccountTypeStrategy{

    assignAccountType(): AccountTypeEntity {
        const accountTypeFactory = new AccountTypeFactory();
        return accountTypeFactory.createAccountType({name:"Saving Account"});
    }
}

export class ChecksAccountStrategy implements IAccountTypeStrategy{

    assignAccountType(): AccountTypeEntity {
        const accountTypeFactory = new AccountTypeFactory();
        return accountTypeFactory.createAccountType({name:"Checks Account"});
    }
}