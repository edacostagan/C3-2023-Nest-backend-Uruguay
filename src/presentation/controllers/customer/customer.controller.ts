import { Body, Controller, Delete, Get, Param, Post, Put, ParseUUIDPipe, Query } from '@nestjs/common';

import { CustomerService } from '../../../business/services';
import { CustomerEntity } from '../../../data/persistence/entities';
import { CustomerDto, PaginationDto, UpdateCustomerDto } from '../../../business/dtos';


@Controller('customer')
export class CustomerController {

    constructor(private customerService: CustomerService) { }

    //TODO: Implment checks and controls - Verify user token


    //update account    
    @Put('update/:id')
    async updateAccount(@Param('id') customerId: string,
        @Body() newDetails: UpdateCustomerDto):
        Promise<CustomerEntity> {

        return await this.customerService.updatedCustomer(customerId, newDetails);
    }

    // Get list of customers
    @Get()
    async getCustomers(@Query('limit') limit?: number): Promise<CustomerDto[]> {

        const page = new PaginationDto();
        page.offset = 0;

        if (limit) { page.limit = limit; }
        else { page.limit = Number.MAX_VALUE; }

        return await this.customerService.getAll(page);
    }
    // get customer information
    @Get('/:id')
    getInformation(@Param('id', ParseUUIDPipe) customerId: string): CustomerDto {

        console.log("buscando usuarios con id: " +customerId)

        return this.customerService.getCustomerInfo(customerId);
    }

    // Unsuscribe customer
    @Post('unsubscribe/:id')
    async unsubscribeCustomer(@Param('id', ParseUUIDPipe) customerId: string): Promise<boolean> {

        return await this.customerService.unsubscribe(customerId);
    }

    // Suscribe customer
    @Post('subscribe/:id')
    async subscribeCustomer(@Param('id', ParseUUIDPipe) customerId: string): Promise<boolean> {

        return await this.customerService.subscribe(customerId);
    }

    @Get('email/:email')
    findCustomerByEmail(@Param('email') customerEmail: string) : CustomerDto {
        return this.customerService.findCustomerByEmail(customerEmail);
    }
}
