import { Bin } from '@poss-web/shared/models';

export class BinDataAdaptor {
  static binFromJson(data: any): Bin {
    if (!data) {
      return null;
    }

    const binGroup: Bin = {
      binCode: data.binCode,
      binGroups: data.binGroups,
      description: data.description
    };
    return binGroup;
  }
}
