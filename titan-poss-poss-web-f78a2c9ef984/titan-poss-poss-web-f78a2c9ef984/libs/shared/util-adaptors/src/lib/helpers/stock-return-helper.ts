import { StockReturnFilterOption } from '@poss-web/shared/models';
import { StockReturnAdaptor } from '../stock-return/stock-return.adaptor';

export class FilterOptionHelper {
  static getOptions(
    data: any,
    idField: string,
    descriptionField: string = 'description'
  ): StockReturnFilterOption[] {
    const filters: StockReturnFilterOption[] = [];
    for (const filter of data) {
      filters.push(
        StockReturnAdaptor.filterAdaptor(filter, idField, descriptionField)
      );
    }
    return filters;
  }
}
