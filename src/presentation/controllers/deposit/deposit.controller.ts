import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseUUIDPipe, Post, Query } from '@nestjs/common';

import { DepositService } from '../../../business/services';
import { CreateDepositDto, PaginationDto, DataRangeDto } from '../../../business/dtos';
import { DepositEntity } from '../../../data/persistence/entities';


@Controller('deposit')
export class DepositController {

    constructor(private depositService: DepositService) { }


    //TODO: verify JWT for the user ( if is allow to make transactions )

    // Create new deposit        
    @Post('register')
    async createDeposit(@Body() deposit: CreateDepositDto): Promise<DepositEntity> {

        return await this.depositService.createDeposit(deposit);
    }

    // delete Deposit ( Only soft delete from here )
    @Delete('delete/:id')
    deleteDeposit(@Param('id', ParseUUIDPipe) depositId: string,
        @Query('soft', ParseBoolPipe) soft?: boolean): void {

        this.depositService.deleteDeposit(depositId, soft);
    }


    // Get historical Data    
    @Get('/:id')
    getDeposit(@Param('id', ParseUUIDPipe) depositId: string,
        @Query('limit') limit?: number,
        @Query('start') start?: number,
        @Query('end') end?: number)
        : DepositEntity[] {

        const range = new DataRangeDto();
        if (start) { range.start = start; }
        else { range.start = 0; }

        if (end) { range.end = end; }
        else { range.end = Number.MAX_VALUE; }

        const page = new PaginationDto();
        page.offset = 0;           

        if (limit) { page.limit = limit; } 
        else { page.limit = Number.MAX_VALUE; }

        return this.depositService.getHistory(depositId, page, range);

    }   
}
