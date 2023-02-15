import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';


import { AccountEntity, AccountTypeEntity, CustomerEntity, PaginationEntity } from '../../../data/persistence/entities';
import { AccountRepository, AccountTypeRepository, CustomerRepository } from '../../../data/persistence/repositories';
import { CreateAccountDto, UpdateAccountDto, PaginationDto } from '../../dtos';
import { AccountTypeContext, ChecksAccountStrategy, SavingAccountStrategy } from '../../../common/patterns/strategy/accountType';
import { AccountModel } from 'src/business/models';



@Injectable()
export class AccountService {
  


  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountTypeRepository: AccountTypeRepository,
    private readonly customerRepository: CustomerRepository,
  ) { }

  /**
  * Create a new account - OK   *
  * @param {CreateAccountDto} account
  * @return {*}  {AccountEntity}   
  */
  createAccount(account: CreateAccountDto): AccountEntity {

    const newAccount = new AccountEntity();
    newAccount.customerId = this.customerRepository.findOneById(account.customerId);
    

    if(account.accountTypeName === "Saving"){
      const savingAccountType = new SavingAccountStrategy();
      const accountTypeContext =  new AccountTypeContext(savingAccountType);

      newAccount.accountTypeId = accountTypeContext.assignAccountTypeStrategy();
    }
    else if(account.accountTypeName === "Checks"){
      const checksAccountType = new ChecksAccountStrategy();
      const accountTypeContext =  new AccountTypeContext(checksAccountType);

      newAccount.accountTypeId = accountTypeContext.assignAccountTypeStrategy();
    }
    else{ //evaluate if is possible to create a new account type 
      throw new NotFoundException("The Account type is not valid")
    }
   
    return this.accountRepository.register(newAccount);
  }

  /**
   * Update the data of the account that matches the given ID
   * @param accountId ID of account to update
   * @param newAccountDetails new data
   * @returns updated entity
   */
  updateAccount(accountId: string, newAccountDetails: UpdateAccountDto): AccountEntity {

    const newAccount = new AccountEntity();

    const newAccountType = new AccountTypeEntity();
    newAccountType.id = newAccountDetails.accountTypeId;
    newAccount.accountTypeId = newAccountType;

    const newCustomer = new CustomerEntity();
    newCustomer.id = newAccountDetails.customerId;
    newAccount.customerId = newCustomer;

    newAccount.balance = newAccountDetails.balance;

    newAccount.state = newAccountDetails.state;

    return this.accountRepository.update(accountId, newAccount);
  }


  /**
  * Return the information of the account 
  * @param accountId account id to search
  * @returns account data or an exception
  */
  getAccountData(accountId: string): AccountEntity {

    let account = this.accountRepository.findOneById(accountId);    

    return account;
  }

  /**
   * Get account balance - OK   *
   * @param {string} accountId
   * @return {*}  {number}
   * @memberof AccountService
   */
  getBalance(accountId: string): number {

    return this.accountRepository.findOneById(accountId).balance;

  }

  /**
   * Add an amount to account balance  - OK   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  addBalance(accountId: string, amount: number): void {

    if (amount < 0) {
      throw new Error(`Negative amounts are not allowed!`);
    }

    this.accountRepository.addAmountToBalance(accountId, amount);

  }

  /**
   * Remove an amount from account balance  - OK   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  removeBalance(accountId: string, amount: number): void {

    if (amount < 0) {
      throw new Error(`Negative amounts are not allowed!`);
    }

    if (!this.verifyAmountIntoBalance(accountId, amount)) {
      throw new Error(`Not enough founds in Account Balance!`);
    }

    this.accountRepository.removeAmountToBalance(accountId, amount);

  }

  /**
   * Verify if account balance has enough to make a withdraw - OK   
   * Private Method
   * @param {string} accountId
   * @param {number} amount
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  private verifyAmountIntoBalance(accountId: string, amount: number): boolean {

    return this.getBalance(accountId) >= amount ? true : false;

  }

  /**
   * Return all the accounts in the DB
   * @returns array of entities
   */
  getAllAccounts(pagination?: PaginationEntity): AccountEntity[] {

    return this.accountRepository.findAll(pagination);
  }

  /**
   * Gets all the accounts of a Customer ID
   * @param customerId 
   * @param page 
   * @returns array
   */
  getAllAccountsOfCustomer(customerId: string, page: PaginationDto): AccountModel[] {
  
    return this.accountRepository.findAllAccountsOfCustomer(customerId, page);    

  }


  /**
   * Get account State - OK   *
   * @param {string} accountId
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  getState(accountId: string): boolean {

    return this.accountRepository.findOneById(accountId).state;

  }

  /**
   * Set state account - OK   *
   * @param {string} accountId
   * @param {boolean} state
   * @memberof AccountService
   */
  changeState(accountId: string, state: boolean): void {

    this.accountRepository.setAccountState(accountId, state);
  }

  /**
   * Get account type - OK   *
   * @param {string} accountId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  getAccountType(accountId: string): AccountTypeEntity {

    return this.accountRepository.findOneById(accountId).accountTypeId;

  }

  /**
   * Set account type - OK   *
   * @param {string} accountId
   * @param {string} accountTypeId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  changeAccountType(accountId: string, accountTypeId: string): AccountTypeEntity {

    let accountType = this.accountTypeRepository.findOneById(accountTypeId);

    //this.accountRepository.getAccountType(accountId);

    if (accountType.id === accountTypeId) {
      throw new Error('The Account Type is already the same');
    }

    return this.accountRepository.setAccountType(accountId, accountType);

  }

  /**
   * Deletes the account that matches the given ID - OK   *
   * @param {string} accountId
   * @memberof AccountService
   */
  deleteAccount(accountId: string, soft?: boolean): void {

    //Validate if account has zero balance
    if (this.getBalance(accountId) === 0) {

      this.accountRepository.delete(accountId, soft); //TODO: Soft Delete by Default, implement hard/soft selection. 

    } else {

      throw new InternalServerErrorException("Account is not Empty!. Delete Canceled");
    }

  }
}
