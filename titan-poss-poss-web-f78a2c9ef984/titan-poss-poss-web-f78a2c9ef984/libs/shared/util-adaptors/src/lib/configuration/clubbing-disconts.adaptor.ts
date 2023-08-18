import {
  ClubDiscountsList,
  ClubDiscountsSuccessList,
  DiscountTypeBasedCodes,
} from '@poss-web/shared/models';
export class ClubbingDiscountsAdaptor {
  static getClubbedDiscountList(data: any): ClubDiscountsSuccessList {
    console.log(data, 'adaptor');
    const clubbedList: ClubDiscountsList[] = [];
    for (const listItem of data.results) {
      clubbedList.push({
        id: listItem.id,
        type1DiscountCode: listItem.type1DiscountCode
          ? listItem.type1DiscountCode
          : null,
        type2DiscountCode: listItem.type2DiscountCode
          ? listItem.type2DiscountCode
          : null,
        type3DiscountCode: listItem.type3DiscountCode
          ? listItem.type3DiscountCode
          : null
      });
    }
    return {
      clubDiscountsList: clubbedList,
      count: data.totalElements
    };
  }

  static getDiscountCodes(data: any): DiscountTypeBasedCodes[] {
    const discountCodeList: DiscountTypeBasedCodes[] = [];
    for (const item of data.results) {
      discountCodeList.push({
        id: item.id ? item.id : '',
        discountCode: item.discountCode ? item.discountCode : ''
      });
    }
    return discountCodeList;
  }
}
