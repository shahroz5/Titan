import { BinGroup } from '@poss-web/shared/models';

export class BinGroupDataAdaptor {
  static binGroupDataFromJson(data: any): BinGroup[] {
    const binGroupData: BinGroup[] = [];
    for (const binGroup of data.results) {
      binGroupData.push({
        binGroupCode: binGroup.binGroupCode,
        description: binGroup.description,
        isActive: binGroup.isActive
      });
    }
    return binGroupData;
  }

  static binGroupFromJson(data: any): BinGroup {
    if (!data) {
      return null;
    }

    const binGroup: BinGroup = {
      binGroupCode: data.binGroupCode,
      description: data.description,
      isActive: data.isActive
    };
    return binGroup;
  }
}
