// Libraries
import { Injectable, UnauthorizedException, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';


// Data transfer objects
import { SignInDto, SignUpDto, CreateAccountDto } from '../../dtos';

// Models

// Repositories
import { CustomerRepository } from '../../../data/persistence/repositories';

// Services
import { AccountService } from '../account';

// Entities
import { CustomerEntity } from '../../../data/persistence/entities';
import { DocumentTypeContext, IdCardStrategy, PassportStrategy } from '../../../common/patterns/strategy/documentType/document-type.strategy';
import { TokenResponseDto as TokenResponseDto } from '../../dtos/security/token-response.dto';




@Injectable()
export class SecurityService {

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly accountService: AccountService,
    private jwtService: JwtService
  ) { }

  /**
   * Login to the system -
   *
   * @param {SignInDto} user
   * @return {*}  {status: boolean, token: string}   
   */
  signIn(user: SignInDto): TokenResponseDto {
    const answer = this.customerRepository.findOneByEmailAndPassword(
      user.username,
      user.password,
    );

    let res: TokenResponseDto = {
      status: answer[0],
      token: ""
    };

    if (answer[0] === true) {
      res.token = this.jwtService.sign({ id: answer[1] });
    };

    return res;
  }

  /**
   * Create a new user
   * @param {SignUpDto} user
   * @return {*}  {string}   
   */
  signUp(user: SignUpDto): TokenResponseDto {

    const newCustomer = new CustomerEntity();

    if (user.documentType != 'ID Card' && user.documentType != 'Passport ID') throw new NotAcceptableException("The Document Type is not acceptable!");

    if (user.documentType === 'ID Card') {
      const strategy = new IdCardStrategy();
      const context = new DocumentTypeContext(strategy);
      newCustomer.documentType = context.assignDocumentTypeStrategy();
    }

    if (user.documentType === 'Passport ID') {
      const strategy = new PassportStrategy();
      const context = new DocumentTypeContext(strategy);
      newCustomer.documentType = context.assignDocumentTypeStrategy();
    }

    newCustomer.document = user.document;
    newCustomer.fullname = user.fullname;
    newCustomer.email = user.email;
    newCustomer.phone = user.phone;
    newCustomer.password = user.password;

    const customer = this.customerRepository.register(newCustomer);

    if (customer) {

      const newAccount = new CreateAccountDto();

      newAccount.customerId = customer.id;
      newAccount.accountTypeName = "Saving"; // Assigns a new "saving account" to be created 

      const account = this.accountService.createAccount(newAccount);

      let res: TokenResponseDto = {
        status: false,
        token: ""
      };

      if (account) {
        res.status = true;
        res.token = this.jwtService.sign({ id: customer.id });
      }

      return res;


    } else {

      throw new Error("New Customer cannot be created!");
    }
  }

  /**
   * Salir del sistema
   *
   * @param {string} JWToken
   * @memberof SecurityService
   */
  signOut(JWToken: string): void {

    try {

      const tokenValidation = this.jwtService.verify(JWToken);

      if (this.customerRepository.findOneByEmailAndPassword(tokenValidation.id, tokenValidation.pass)) {

        console.log(`User: ${tokenValidation.id} - Pass: ${tokenValidation.pass}`);
        console.log("Logging Out!")
      }

    } catch (err) {
      throw new InternalServerErrorException("Token expired or something went wrong! Not logging Out!");
    }


    //TODO: save token in a blocklist to check from unauthorized possible future access until expires

  }
}
