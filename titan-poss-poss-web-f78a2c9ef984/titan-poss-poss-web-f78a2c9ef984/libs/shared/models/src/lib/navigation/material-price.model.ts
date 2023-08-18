export interface MetalPrice {
  metalName: string;
  offset: number;
  karatage: number;
  purity: number;
  ratePerUnit: number;
  unit: string;
  applicableDate: Date;
  metalTypeCode: string;
}

export interface MaterialPricePayloads {
  results: MetalPrice[];
}
