import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { TransferService } from '../../../business/services';
import { TransferEntity } from '../../../data/persistence/entities';
import { CreateTransferDto, DataRangeDto, PaginationDto } from '../../../business/dtos';

@Controller('transfer')
export class TransferController {

    constructor(private transferService: TransferService) { }


    // create tranfer
    // TODO: implement newTranferDTO to use instead of transferModel
    @Post('register')
    async createTransfer(@Body() transfer: CreateTransferDto): Promise<TransferEntity> {

        return await this.transferService.createTransfer(transfer);
    }

    // get history by origin account
    //TODO: see how to send values for pagination and date range ( look for info and methods )
    @Get('from/:id')
    getTransfersFromOriginAccount(@Param('id', ParseUUIDPipe) accountId: string,
        @Query('limit') limit?: number,
        @Query('start') start?: number,
        @Query('end') end?: number)
        : TransferEntity[] {

        let range = new DataRangeDto();
        let page = new PaginationDto();

        if (limit) {

            page.limit = limit;
            page.offset = 0;

            let range = new DataRangeDto();
            range = this.checkDataRange(range, start, end);

        }

        return this.transferService.getHistoryOut(accountId, page, range);
    }


    // get history by destination account
    //TODO: see how to send values for pagination and date range ( look for info and methods )
    @Get('to/:id')
    getTransfersToDestinationAccount(@Param('id', ParseUUIDPipe) accountId: string,
        @Query('limit') limit?: number,
        @Query('start') start?: number,
        @Query('end') end?: number)
        : TransferEntity[] {

        let range = new DataRangeDto();
        let page = new PaginationDto();

        if (limit) {

            page.limit = limit;
            page.offset = 0;

            let range = new DataRangeDto();
            range = this.checkDataRange(range, start, end);

        }
        /* 
                let range = new DataRangeDto();
                range = this.checkDataRange(range, start, end);
        
                const page = new PaginationDto();
                if (limit) {
                    page.limit = limit;
                    page.offset = 0;
                }
         */
        return this.transferService.getHistoryIn(accountId, page, range);
    }


    // get historical in and out trasnfers for an account
    //TODO: see how to send values for pagination and date range ( look for info and methods )
    @Get('getAll/:id')
    getAllTransfersByAccount(@Param('id', ParseUUIDPipe) accountId: string,
        @Query('limit') limit?: number,
        @Query('start') start?: number,
        @Query('end') end?: number)
        : TransferEntity[] {

        let range = new DataRangeDto();
        let page = new PaginationDto();

        if (limit) {

            page.limit = limit;
            page.offset = 0;

            let range = new DataRangeDto();
            range = this.checkDataRange(range, start, end);

        }

        return this.transferService.getHistory(accountId, page);
    }

    /**
     * Check if there are start and end for a datarange and assign correct values
     * @param range dataRangeDto to evaluate
     * @param start range start     * 
     * @param end  range end
     * @returns range evaluated
     */
    private checkDataRange(range: DataRangeDto, start: number | undefined, end: number | undefined): DataRangeDto {
        
        if (start) {
            range.start = start;
            if (end) {
                range.end = end;
            } else {
                range.end = Number.MAX_VALUE;
            }
        }
        else {
            range.start = 0;
        }

        return range;
    }


    // delete transfer ( Only soft delete from here )
    @Delete('delete/:id')
    async deleteTransfer(@Param('id', ParseUUIDPipe) transferId: string,
        @Query('soft', ParseBoolPipe) soft?: boolean): Promise<void> {

        await this.transferService.deleteTransfer(transferId);
    }


}
