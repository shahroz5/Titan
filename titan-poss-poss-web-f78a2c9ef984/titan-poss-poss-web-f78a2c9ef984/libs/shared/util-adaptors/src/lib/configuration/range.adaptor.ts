import {
  ConfigurationRanges,
  Lov,
} from '@poss-web/shared/models';

export class RangeAdaptor {
  static rangeList(data: any): ConfigurationRanges[] {
    const ranges: ConfigurationRanges[] = [];
    for (const range of data.results) {
      ranges.push({
        fromRange: range.fromRange,
        toRange: range.toRange,
        id: range.id,
        rowId: range.rowId,
        isActive: range.isActive
      });
    }
    return ranges;
  }
  static rangeTypes(data: any): Lov[] {
    const rangeTypes: Lov[] = [];
    for (const types of data.results) {
      rangeTypes.push({
        code: types.code,
        value: types.value,
        isActive: types.isActive
      });
    }
    return rangeTypes;
  }
}
