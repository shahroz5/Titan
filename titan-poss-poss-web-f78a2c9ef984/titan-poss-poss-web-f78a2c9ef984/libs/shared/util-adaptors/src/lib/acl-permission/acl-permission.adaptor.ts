import {
  ElementLevelPermissionItemModel,
  ElementLevelPermissionModel,
  TransactionCodesModel,
  UrlLevelPermissionResponseModel
} from '@poss-web/shared/models';

export class AclPermissionAdaptor {
  static getPermissionforURL(
    data: ElementLevelPermissionModel
  ): ElementLevelPermissionItemModel[] {
    if (
      !data ||
      (data && !data.results) ||
      (data && data.results && data.results.length === 0)
    ) {
      return [];
    } else {
      const elementLevelPermissionData = [];
      data.results.forEach(
        (elementLevelItem: ElementLevelPermissionItemModel) => {
          const elementLevelPermissionItemObject = {
            element: elementLevelItem.element,
            url: elementLevelItem.url,
            transactionCodes: elementLevelItem.transactionCodes,
            authorisedStrategy: elementLevelItem.authorisedStrategy,
            unauthorisedStrategy: elementLevelItem.unauthorisedStrategy
          };
          elementLevelPermissionData.push(elementLevelPermissionItemObject);
        }
      );
      return elementLevelPermissionData;
    }
  }

  static getUrlPermissions(
    data: UrlLevelPermissionResponseModel
  ): TransactionCodesModel[] {
    if (
      !data ||
      (data && !data.results) ||
      (data && data.results && data.results.length === 0)
    ) {
      return [];
    } else {
      const urlLevelPermissionsList = [];
      data.results.forEach((urlLevelPermissionItem: TransactionCodesModel) => {
        const urlLevelItem = {
          url: urlLevelPermissionItem.url,
          transactionCodes: urlLevelPermissionItem.transactionCodes
        };
        urlLevelPermissionsList.push(urlLevelItem);
      });
      return urlLevelPermissionsList;
    }
  }
}
