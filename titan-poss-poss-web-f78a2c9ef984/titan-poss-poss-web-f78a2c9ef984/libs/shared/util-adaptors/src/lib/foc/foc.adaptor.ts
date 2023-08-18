import {
  PendingCMResponsePayload,
  IssuePendingFocConfirmationPayload,
  FocItemDetailsResponsePayload,
  AvailableSchemesPayload,
  FocSchemeDetailsDto,
  FocItemsDto,
  FocPurchaseItemsDto,
  AddFocToCmResponsePayload,
  PendingFocSchemesPayload,
  ABFocSchemeDetailsDto
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { FocHelper } from '../helpers/foc.helper';

export class FocAdaptor {
  static pendingCm(data: any): PendingCMResponsePayload {
    return {
      customerId: data.customerId,
      docDate: moment(data.docDate),
      docNo: data.docNo,
      finalValue: data.finalValue,
      fiscalYear: data.fiscalYear,
      id: data.id
    };
  }

  static issuePendingFOC(data: any): IssuePendingFocConfirmationPayload {
    return {
      docNo: data.docNo,
      fiscalYear: data.fiscalYear,
      focItems: data.focItems,
      id: data.id,
      refTxnId: data.refTxnId,
      status: data.status,
      subTxnType: data.subTxnType,
      txnType: data.txnType
    };
  }

  static focItemDetails(data: any): FocItemDetailsResponsePayload {
    return {
      binCode: data.binCode,
      // imageUrl: data.imageUrl,
      // inventoryId: data.inventoryId,
      itemCode: data.itemCode,
      // karatage: data.karatage,
      lotNumber: data.lotNumber,
      // productCategoryCode: data.productCategoryCode,
      // productCategoryDescription: data.productCategoryDescription,
      // productGroupCode: data.productGroupCode,
      // productGroupDescription: data.productGroupDescription,
      availableQuantity: data.totalQuantity,
      stdWeight: data.stdWeight,
      unitWeight: data.unitWeight,
      weightDetials: data.totalWeightDetails,
      availbleQty: 0
    };
  }

  static availableSchemesFromJson(data: any): AvailableSchemesPayload {
    return {
      description: data.description,
      id: data.id,
      isActive: data.isActive,
      name: data.name
    };
  }
  static focSchemesAndItemsFromJson(data: any): FocSchemeDetailsDto {
    return {
      focItems: this.getFocItemsFromResponse(data.focItems),
      purchaseItems: this.getFocPurchaseItemsFromResponse(data.purchaseItems),
      schemeDetailId: data.schemeDetailId,
      schemeId: data.schemeId,
      schemeName: data.schemeName,
      schemeCategory: data.schemeCategory,
      weight: data.weight
    };
  }

  static getFocItems(data: any): FocItemsDto {
    return {
      itemCode: data.itemCode,
      quantity: data.quantity,
      weight: data.weight
    };
  }
  static getFocPurchaseItems(data: any): FocPurchaseItemsDto {
    return {
      itemCodeList: data.itemCodeList,
      productGroupCode: data.productGroupCode
    };
  }

  static getFocItemsFromResponse(data: any): FocItemsDto[] {
    const response: FocItemsDto[] = [];
    if (!data) {
      return [];
    }
    for (const item of data) {
      response.push(FocAdaptor.getFocItems(item));
    }
    return response;
  }
  static getFocPurchaseItemsFromResponse(data: any): FocPurchaseItemsDto[] {
    const response: FocPurchaseItemsDto[] = [];
    for (const item of data) {
      response.push(FocAdaptor.getFocPurchaseItems(item));
    }
    return response;
  }
  static focItemListAddedtoCmFromJson(data: any): AddFocToCmResponsePayload {
    return {
      binCode: data.binCode,
      employeeCode: data.employeeCode,
      focSchemeId: data.focSchemeId,
      id: data.id,
      inventoryId: data.inventoryId,
      itemCode: data.itemCode,
      lotNumber: data.lotNumber,
      rowId: data.rowId,
      salesTxnId: data.salesTxnId,
      status: data.status,
      totalQuantity: data.totalQuantity,
      totalWeight: data.totalWeight,
      unitWeight: data.unitWeight,
      isManualFOC: data.isManualFOC,
      actualQuantity:data.totalQuantity
    };
  }
  static pendingFocResponseFromJson(data: any): PendingFocSchemesPayload {
    return {
      eligibleFocItemDetails: {
        focItems: this.getFocItemsFromResponse(
          data.eligibleFocItemDetails.focItems
        )
      },
      eligibleWeight: data.eligibleWeight,
      eligibleQuantity: data.eligibleQuantity,
      id: data.id,
      purchaseItemDetails: {
        purchaseItems: this.getFocPurchaseItemsFromResponse(
          data.purchaseItemDetails.purchaseItems
        )
      },
      schemeName: data.schemeName,
      salesTxnId: data.salesTxnId,
      status: data.status
    };
  }

  static ABfocSchemesDetailssFromJson(data: any): ABFocSchemeDetailsDto {
    return {
      schemeDetailId: data.schemeDetails.data.schemeDetailIds,
      schemeId: data.schemeDetails.data.schemeId,
      schemeName: data.schemeDetails.data.schemeName,
      schemeCategory: data.schemeDetails.data.schemeCategory,
      weight: data.schemeDetails.data.weight,
      id: data.id
    };
  }
}
