import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { AccountEntity } from '../../../data/persistence/entities';
import { CreateAccountDto, UpdateAccountDto, AccountTransactionDto, AccountDto, PaginationDto } from '../../../business/dtos';
import { AccountService } from '../../../business/services';

@Controller('account')
export class AccountController {

    constructor(
        private readonly accountService: AccountService
    ) { }

    // new account DONE    
    @Post('create')
    createAccount(@Body() account: CreateAccountDto): AccountEntity {

        return this.accountService.createAccount(account);;
    }

    //update account DONE   
    @Put('update/:id')
    async updateAccount(@Param('id', ParseUUIDPipe) accountId: string,
        @Body() newDetails: UpdateAccountDto):
        Promise<AccountEntity> {

        return this.accountService.updateAccount(accountId, newDetails);
    }


    // delete account ( Only soft delete from here )
    @Delete('delete/:id')
    async deleteAccount(@Param('id', ParseUUIDPipe) accountId: string,
        @Query('soft', ParseBoolPipe) soft?: boolean): Promise<void> {

        await this.accountService.deleteAccount(accountId, soft);
    }

    // show all accounts
    @Get()
    getAll(@Query('limit') limit?: number): AccountEntity[] {

        const page = new PaginationDto();
        page.offset = 0;

        if (limit) { page.limit = limit; }
        else { page.limit = Number.MAX_VALUE; }

        return this.accountService.getAllAccounts(page);
    }

    // get account information
    @Get('/:id')
    getAccountData(@Param('id', ParseUUIDPipe) accountId: string): AccountEntity {

        return this.accountService.getAccountData(accountId);
    }

    // get account balance
    @Get('balance/:id')
    getBalance(@Param('id', ParseUUIDPipe) accountId: string): number {

        return this.accountService.getBalance(accountId);
    }

    // add amount to balance ( )
    @Post('addBalance')
    async addBalance(@Body() transaction: AccountTransactionDto): Promise<void> {

        await this.accountService.addBalance(transaction.accountId, transaction.amount);
    }

    // remove amount to balance
    @Post('removeBalance')
    async removeBalance(@Body() transaction: AccountTransactionDto): Promise<void> {

        await this.accountService.removeBalance(transaction.accountId, transaction.amount);
    }
}
