import { BinToBinTransferItemListGroup } from '@poss-web/shared/models';

export class BinToBinTransferItemListGroupAdaptor {
  static fromJson(group: any): BinToBinTransferItemListGroup {
    return {
      id: group.name + group.currencyCode + group.weightUnit,
      name: group.name,
      description: group.description,
      products: group.products ? group.products : 0,
      totalValue: group.totalValue ? group.totalValue : 0,
      totalWeight: group.totalWeight ? group.totalWeight : 0,
      currencyCode: group.currencyCode,
      weightUnit: group.weightUnit
    };
  }
}
