export interface ClubDiscountsListPayload {
  pageIndex?: number;
  pageSize?: number;
}
export interface ClubDiscountsList {
  id: string;
  type1DiscountCode: string;
  type2DiscountCode: string;
  type3DiscountCode: string;
}
export interface ClubDiscountsSuccessList {
  clubDiscountsList: ClubDiscountsList[];
  count: number;
}
export interface SaveRulesPayload {
  addRules: [
    {
      type1DiscountCode: string;
      type2DiscountCode: string;
      type3DiscountCode: string;
    }
  ];
  removeRules: string[];
}
export interface DiscountTypeBasedCodes {
  id: string;
  discountCode: string;
}
