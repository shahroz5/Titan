import { Town, TownSummary } from '@poss-web/shared/models';

export class TownDataAdaptor {
  static townDataFromJson(data: any): Town[] {
    const townData: Town[] = [];
    for (const town of data.results) {
      townData.push({
        description: town.description,
        isActive: town.isActive,
        stateCode: town.stateId,
        townCode: town.townId
      });
    }
    return townData;
  }

  static townFromJson(data: any): Town {
    if (!data) {
      return null;
    }

    const town: Town = {
      description: data.description,
      isActive: data.isActive,
      stateCode: data.stateId,
      townCode: data.townId
    };
    return town;
  }
  static townDataSummaryFromJson(data: any): TownSummary[] {
    const townData: TownSummary[] = [];
    for (const town of data.results) {
      townData.push({
        description: town.description,
        townCode: town.townId
      });
    }
    return townData;
  }
}
