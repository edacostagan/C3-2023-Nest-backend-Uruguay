import { PaginationModel } from "../../../business/models";

export class PaginationEntity implements PaginationModel {
    offset?: number;
    limit?: number;
}
