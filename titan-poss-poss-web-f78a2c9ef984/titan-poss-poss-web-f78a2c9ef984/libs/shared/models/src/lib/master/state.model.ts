export interface State {
  configDetails: {};
  countryCode: number;
  description: string;
  isActive: boolean;
  stateCode: number;
  stateId: number;
  stateTaxCode: number;
  isUnionTerritory: boolean;
}
export interface StateSummary {
  stateId: number;
  description: string;
  stateTaxCode?: number;
}
