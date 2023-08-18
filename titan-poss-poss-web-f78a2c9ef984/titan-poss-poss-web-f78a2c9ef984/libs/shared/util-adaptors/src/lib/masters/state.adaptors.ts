import { State, StateSummary } from '@poss-web/shared/models';

export class StateDataAdaptor {
  static stateDataFromJson(data: any): State[] {
    const stateData: State[] = [];
    for (const state of data.results) {
      stateData.push({
        configDetails: state.configDetails,
        countryCode: state.countryCode,
        description: state.description,
        isActive: state.isActive,
        stateCode: state.stateCode,
        stateId: state.stateId,
        stateTaxCode: state.stateTaxCode,
        isUnionTerritory: state.isUnionTerritory
      });
    }
    return stateData;
  }

  static stateFromJson(data: any): State {
    if (!data) {
      return null;
    }

    const state: State = {
      configDetails: data.configDetails,
      countryCode: data.countryCode,
      description: data.description,
      isActive: data.isActive,
      stateCode: data.stateCode,
      stateId: data.stateId,
      stateTaxCode: data.stateTaxCode,
      isUnionTerritory: data.isUnionTerritory
    };
    return state;
  }
  static stateDataSummaryFromJson(data: any): StateSummary[] {
    const stateData: StateSummary[] = [];
    for (const state of data.results) {
      stateData.push({
        stateId: state.stateId,
        description: state.description,
        stateTaxCode: state.stateTaxCode
      });
    }
    return stateData;
  }
}
