import { DataRangeModel } from "../../../business/models";

export class DataRangeEntity <T> implements DataRangeModel  {
    start?: number;
    end?: number;
}
