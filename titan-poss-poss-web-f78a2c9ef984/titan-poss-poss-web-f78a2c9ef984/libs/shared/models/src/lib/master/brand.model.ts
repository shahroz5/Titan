export interface Brand {
  brandCode: string;
  configDetails: any;
  description: string;
  isActive: boolean;
  orgCode: string;
  parentBrandCode: string;
  customerDetails?: {};
  panCardDetails?: any;
  brandTcsDetails?: any;
}
export interface BrandSummary {
  brandCode: string;
  description: string;
}
