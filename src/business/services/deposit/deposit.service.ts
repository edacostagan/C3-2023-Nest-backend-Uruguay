import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DepositEntity, PaginationEntity,DataRangeEntity } from '../../../data/persistence/entities';
import { DepositRepository } from '../../../data/persistence/repositories';
import { CreateDepositDto , DepositDto} from '../../dtos';
import { AccountService } from '../account';

@Injectable()
export class DepositService {


  constructor(
    private readonly depositRepository: DepositRepository,
    private readonly accountService: AccountService) { }

  /**
   * Make a new Deposit - OK
   *
   * @param {DepositModel} deposit
   * @return {*}  {DepositEntity}
   * @memberof DepositService
   */
  createDeposit(deposit: CreateDepositDto): [boolean,  DepositDto | null] {

    if (this.accountService.getState(deposit.accountId)) {
      
      const newDeposit = new DepositEntity();

      newDeposit.accountId = deposit.accountId;
      newDeposit.amount = deposit.amount as number;
      newDeposit.dateTime = Date.now();

      const depositDone = this.depositRepository.register(newDeposit);

      if (depositDone) {

        this.accountService.addBalance(deposit.accountId, deposit.amount);
        return [true, depositDone];
      }
      
    }
    return [false, null];    //throw new InternalServerErrorException("Something went Wrong. Null Deposit! ");
  }

  /**
   * Deletes the deposit that matches the given ID - OK
   *
   * @param {string} depositId
   * @memberof DepositService
   */
  deleteDeposit(depositId: string, soft?: boolean): void {

    //TODO: apply validations for allow to delete the deposit ( don't know the logic )

    this.depositRepository.delete(depositId, soft); //TODO: Soft Delete by Default,  implement hard/soft selection. 
  }

  /**
   * Gets the historical data of an account, can be filter by dates
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dateRange]
   * @return {*}  {DepositEntity[]}
   * @memberof DepositService
   */
  getHistory(accountId: string, pagination?: PaginationEntity, dataRange?: DataRangeEntity): DepositEntity[] {

    return this.depositRepository.findBy("accountId", accountId, pagination, dataRange);

  }
}