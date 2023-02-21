import { ConsoleLogger, Injectable } from '@nestjs/common';

import { TokenResponseDto, UpdateCustomerDto } from '../../dtos';
import { CustomerEntity, DocumentTypeEntity, PaginationEntity } from '../../../data/persistence/entities';
import { CustomerRepository, AccountRepository } from '../../../data/persistence/repositories';
import { CustomerDto } from '../../dtos/customer.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomerService {



  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly accountRepository: AccountRepository,
    private readonly jwtService: JwtService
  ) { }

  /**
   * Get Customer information - OK   *
   * @param {string} customerId
   * @return {*}  {CustomerEntity}
   * @memberof CustomerService
   */
  getCustomerInfo(customerId: string): CustomerEntity {

    return this.customerRepository.findOneById(customerId);

  }

  /**
   * Update Customer information - OK   *
   * @param {string} id
   * @param {CustomerModel} customer
   * @return {*}  {CustomerEntity}
   * @memberof CustomerService
   */
  updatedCustomer(id: string, newCustomerDetails: UpdateCustomerDto): CustomerEntity {

    let customer = new CustomerEntity();

    const documentType = new DocumentTypeEntity();
    documentType.id = newCustomerDetails.documentTypeId;
    customer.documentType = documentType;
console.log("aca va bien")
    customer = {...customer, ...newCustomerDetails}

    /* customer.document = newCustomerDetails.document;
    customer.email = newCustomerDetails.email;
    customer.fullname = newCustomerDetails.fullname;
    customer.password = newCustomerDetails.password;
    customer.phone = newCustomerDetails.phone;
    customer.state = newCustomerDetails.state;
    customer.avatarUrl = newCustomerDetails.avatarUrl;  */

    return this.customerRepository.update(id, customer);




    
  }

  /**
   * Returns all the customers in the DB
   * @returns array of entities
   */
  getAll(pagination?: PaginationEntity): CustomerEntity[] {

    return this.customerRepository.findAll(pagination);
  }

  /**
   * Set Customer as inactive   *
   * @param {string} id
   * @return {*}  {boolean}
   * @memberof CustomerService
   */
  unsubscribe(id: string): boolean {

    if (this.checkCustomerBalance(id) === 0) {
      return this.customerRepository.setCustomerState(id, false);
    }
    return true; //the customer state has not change
  }

  /**
   * Find all the accounts of a customer and return the total balance
   * @param id customer id to find
   * @returns balance 
   */
  private checkCustomerBalance(id: string): number {

    let balance = 0;

    let accounts = this.accountRepository.findByCustomer(id);

    if (accounts.length > 0) {
      accounts.forEach(element => {
        balance += element.balance;
      });
    }
    return balance;
  }

  /**
   * Set Customer as active
   * @param {string} id
   * @return {*}  {boolean}
   * @memberof CustomerService
   */
  subscribe(id: string): boolean {

    return this.customerRepository.setCustomerState(id, true);

  }

  /**
   * Finds a customer in DB with the email given
   * @param email email to be found
   * @returns a response with status and customer data
   */
  findCustomerByEmail(email: string): TokenResponseDto {

    const result = this.customerRepository.findOneByEmail(email);

    const answer: TokenResponseDto = {
      status: result[0],
      token: "",
    }

    if (result[0] == true && result[1] != null) {
      answer.token = this.jwtService.sign({data: result[1]});
    }

    return answer;
  }

}
