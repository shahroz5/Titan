import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getProductLOVTypeUrl,
  getLocationLOVTypeUrl,
  getInventoryLOVTypeUrl,
  getProductLOVUrl,
  getLocationLOVeUrl,
  getInventoryLOVUrl,
  getPaymentLOVTypeUrl,
  getPaymentLOVUrl,
  getConfigLOVTypeUrl,
  getConfigLOVUrl,
  getLovMasterTypeUrl,
  getReportPostLOVTypeUrl,
  getReportLOVTypeUrl
} from '@poss-web/shared/util-api-service';
import {
  LovMasterType,
  LoadLovListingSuccessPayload,
  LovMaster,
  LovMasterEnum,
  LovMasterEndpointServiceEnum,
  LovMasterTypeMain
} from '@poss-web/shared/models';
import { LovMasterAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class LovMasterService {
  constructor(private apiService: ApiService) {}

  getLovMasterType(): Observable<LovMasterType[]> {
    const url = getLovMasterTypeUrl();

    return this.apiService.get(url).pipe(
      map(data => {
        return LovMasterAdaptor.getLOVTypes(data); // Switch the adaptor based on the lovType
      })
    );
  }

  getLovMasterTypeMain(): Observable<LovMasterTypeMain[]> {
    const url = getLovMasterTypeUrl();

    return this.apiService.get(url).pipe(
      map(data => {
        return LovMasterAdaptor.getLOVTypesMain(data); // Switch the adaptor based on the lovType
      })
    );
  }

  /*  getLovMasterType(): Observable<LovMasterType[]> {
    // const url = getLOVReasonTypeListingUrl(); // Switch the endpoint based on the lovType
    // return this.apiService
    //   .get(url)
    //   .pipe(
    //     map(data => {
    //       return LovMasterAdaptor.getLOVReasonTypeListing(data); // Switch the adaptor based on the lovType
    //     })
    //   );
    const masterTypes = [
      // { value: 'LOCATIONTYPE', name: 'Location' },
      { value: LovMasterEnum.REASONTYPE, name: 'pw.lovmaster.reasonType' },
      { value: LovMasterEnum.PRODUCTTYPE, name: 'pw.lovmaster.productType' },
      { value: LovMasterEnum.INDENTTYPE, name: 'pw.lovmaster.indentType' },
      { value: LovMasterEnum.SUPPLYCHAIN, name: 'pw.lovmaster.supplyChain' },
      {
        value: LovMasterEnum.PRICINGGROUPTYPE,
        name: 'pw.lovmaster.pricingGroupType'
      },
      { value: LovMasterEnum.PRICINGTYPE, name: 'pw.lovmaster.pricingType' },
      { value: LovMasterEnum.FINDING, name: 'pw.lovmaster.finding' },
      { value: LovMasterEnum.LOCATIONTYPE, name: 'pw.lovmaster.locationType' },
      { value: LovMasterEnum.OWNERTYPE, name: 'pw.lovmaster.ownerType' },
      {
        value: LovMasterEnum.LOCATIONFORMAT,
        name: 'pw.lovmaster.locationFormat'
      },
      {
        value: LovMasterEnum.MATERIALPRICETYPE,
        name: 'pw.lovmaster.materialPriceType'
      },
      { value: LovMasterEnum.DEFECTTYPE, name: 'pw.lovmaster.defectType' },
      { value: LovMasterEnum.MATERIALTYPE, name: 'pw.lovmaster.materialType' },
      { value: LovMasterEnum.GEPITEMTYPE, name: 'pw.lovmaster.GEPItemType' },
      {
        value: LovMasterEnum.PLAINSTUDDEDTYPE,
        name: 'pw.lovmaster.plainStuddedType'
      },
      {
        value: LovMasterEnum.WEIGHT_EDIT_REASON_TYPE,
        name: 'pw.lovmaster.weightEditReasonType'
      },
      { value: LovMasterEnum.PRICETYPE, name: 'pw.lovmaster.priceType' },
      { value: LovMasterEnum.TAXSYSTEM, name: 'pw.lovmaster.taxSystem' },
      { value: LovMasterEnum.DATEFORMAT, name: 'pw.lovmaster.dateFormat' },
      { value: LovMasterEnum.TIMEFORMAT, name: 'pw.lovmaster.timeFormat' },
      {
        value: LovMasterEnum.TAXTRANSACTIONTYPE,
        name: 'pw.lovmaster.taxTransactionType'
      },
      {
        value: LovMasterEnum.PRINT_DOC_TYPE,
        name: 'pw.lovmaster.printDocType'
      },
      {
        value: LovMasterEnum.TRANSACTION_TYPE,
        name: 'pw.lovmaster.transactionType'
      },
      { value: LovMasterEnum.PAYMENT_GROUP, name: 'pw.lovmaster.paymentGroup' },
      { value: LovMasterEnum.CUSTOMER_TYPE, name: 'pw.lovmaster.customerType' },
      { value: LovMasterEnum.OCCASION_TYPE, name: 'pw.lovmaster.cccasionType' },
      {
        value: LovMasterEnum.OTHER_CHARGES_REASONS,
        name: 'pw.lovmaster.otherChargesReasons'
      },
      { value: LovMasterEnum.SALUTATION, name: 'pw.lovmaster.salutation' },
      {
        value: LovMasterEnum.GIFT_CARD_TYPE,
        name: 'pw.lovmaster.giftCardType'
      },
      {
        value: LovMasterEnum.ID_PROOF,
        name: 'pw.lovmaster.idProof'
      },
      {
        value: LovMasterEnum.GRN_REASON_TYPE,
        name: 'pw.lovmaster.GRNReasonType'
      },
      {
        value: LovMasterEnum.TATA_COMPANY,
        name: 'pw.lovmaster.tataCompany'
      },
      {
        value: LovMasterEnum.REFUND_PAYMENT_MODE,
        name: 'pw.lovmaster.refundPaymentMode'
      },
      {
        value: LovMasterEnum.INVOICE_TYPE,
        name: 'pw.lovmaster.invoiceType'
      },
      {
        value: LovMasterEnum.DISCOUNT_TYPE,
        name: 'pw.lovmaster.discountType'
      },
      {
        value: LovMasterEnum.RANGE_TYPE,
        name: 'pw.lovmaster.rangeType'
      },
      {
        value: LovMasterEnum.CLUBBING_DISCOUNT_TYPE,
        name: 'pw.lovmaster.clubbingDiscountType'
      },
      {
        value: LovMasterEnum.APPROVAL_ROLES,
        name: 'pw.lovmaster.approvalRoles'
      }
    ];
    return of(masterTypes);
  } */

  getLovMasterList(
    lovTypeRaw: string
  ): Observable<LoadLovListingSuccessPayload> {
    let url = ''; //getLOVReasonTypeListingUrl(lovType); // Switch the endpoint based on the lovType
    const lovType = lovTypeRaw.split('|')[0];
    const baseServicePath = lovTypeRaw.split('|')[1];
    switch (baseServicePath) {
      case LovMasterEndpointServiceEnum.PRODUCT:
        url = getProductLOVTypeUrl(lovType);
        break;
      case LovMasterEndpointServiceEnum.LOCATION:
        url = getLocationLOVTypeUrl(lovType);
        break;
      case LovMasterEndpointServiceEnum.INVENTORY:
        url = getInventoryLOVTypeUrl(lovType);
        break;
      case LovMasterEndpointServiceEnum.PAYMENT:
        url = getPaymentLOVTypeUrl(lovType);
        break;
      case LovMasterEndpointServiceEnum.CONFIG:
        url = getConfigLOVTypeUrl(lovType);
        break;
      case LovMasterEndpointServiceEnum.REPORT:
        url = getReportLOVTypeUrl(lovType);
        break;
    }
    return this.apiService.get(url).pipe(
      map(data => {
        return LovMasterAdaptor.getLOVTypeListing(data); // Switch the adaptor based on the lovType
      })
    );
  }

  saveLovFormDetails(
    saveForm: LovMaster
  ): Observable<LoadLovListingSuccessPayload> {
    let url = '';
    switch (
      saveForm.lovType // TODO, temp solution
    ) {
      case LovMasterEnum.REASONTYPE:
      case LovMasterEnum.PRODUCTTYPE:
      case LovMasterEnum.INDENTTYPE:
      case LovMasterEnum.SUPPLYCHAIN:
      case LovMasterEnum.PRICINGGROUPTYPE:
      case LovMasterEnum.PRICINGTYPE:
      case LovMasterEnum.FINDING:
      case LovMasterEnum.MATERIALTYPE:
      case LovMasterEnum.GEPITEMTYPE:
      case LovMasterEnum.PLAINSTUDDEDTYPE:
      case LovMasterEnum.WEIGHT_EDIT_REASON_TYPE:
      case LovMasterEnum.HALLMARK_KARAT:
        url = getProductLOVTypeUrl(saveForm.lovType);
        break;
      case LovMasterEnum.LOCATIONTYPE:
      case LovMasterEnum.OWNERTYPE:
      case LovMasterEnum.LOCATIONFORMAT:
      case LovMasterEnum.MATERIALPRICETYPE:
      case LovMasterEnum.PRICETYPE:
      case LovMasterEnum.TAXSYSTEM:
      case LovMasterEnum.DATEFORMAT:
      case LovMasterEnum.TIMEFORMAT:
      case LovMasterEnum.TAXTRANSACTIONTYPE:
      case LovMasterEnum.PRINT_DOC_TYPE:
      case LovMasterEnum.TEPPARTIALCNCANCELLATION:
        url = getLocationLOVTypeUrl(saveForm.lovType);
        break;
      case LovMasterEnum.DEFECTTYPE:
      case LovMasterEnum.DEFECTCODE:
        url = getInventoryLOVTypeUrl(saveForm.lovType);
        break;
      case LovMasterEnum.TRANSACTION_TYPE:
      case LovMasterEnum.PAYMENT_GROUP:
      case LovMasterEnum.CUSTOMER_TYPE:
      case LovMasterEnum.OCCASION_TYPE:
      case LovMasterEnum.OTHER_CHARGES_REASONS:
      case LovMasterEnum.SALUTATION:
      case LovMasterEnum.GIFT_CARD_TYPE:
      case LovMasterEnum.ID_PROOF:
      case LovMasterEnum.GRN_REASON_TYPE:
      case LovMasterEnum.TATA_COMPANY:
      case LovMasterEnum.REFUND_PAYMENT_MODE:
      case LovMasterEnum.INVOICE_TYPE:
      case LovMasterEnum.REASON_FOR_CANCELLATION:
      case LovMasterEnum.REASON_FOR_CHANGING_DISCOUNT:
      case LovMasterEnum.REASON_FOR_NOT_GIVING_DISCOUNT:
      case LovMasterEnum.FULL_VALUE_TEP_REASON:
      case LovMasterEnum.RELATIONSHIP_TYPE:
        url = getPaymentLOVTypeUrl(saveForm.lovType);
        break;
      case LovMasterEnum.DISCOUNT_TYPE:
      case LovMasterEnum.RANGE_TYPE:
      case LovMasterEnum.CLUBBING_DISCOUNT_TYPE:
      case LovMasterEnum.APPROVAL_ROLES:
      case LovMasterEnum.RIVAAH_CARD:
        url = getConfigLOVTypeUrl(saveForm.lovType);
        break;
      case LovMasterEnum.STOCK_ISSUE_REPORT_HEADER:
        url = getReportLOVTypeUrl(saveForm.lovType);
        break;
    }
    // const url = getProductLOVTypeUrl(saveForm.lovType);
    const formdata = {
      values: [
        {
          code: saveForm.lovName,
          isActive: saveForm.isActive,
          value: saveForm.description
        }
      ]
    };
    return this.apiService.patch(url, formdata).pipe(
      map(data => {
        return LovMasterAdaptor.getLOVTypeListing(data); // Switch the adaptor based on the lovType
      })
    );
  }

  createLovFormDetails(saveForm: LovMaster): Observable<LovMaster> {
    let url = '';
    switch (
      saveForm.lovType // TODO, temp solution
    ) {
      case LovMasterEnum.REASONTYPE:
      case LovMasterEnum.PRODUCTTYPE:
      case LovMasterEnum.INDENTTYPE:
      case LovMasterEnum.SUPPLYCHAIN:
      case LovMasterEnum.PRICINGGROUPTYPE:
      case LovMasterEnum.PRICINGTYPE:
      case LovMasterEnum.FINDING:
      case LovMasterEnum.MATERIALTYPE:
      case LovMasterEnum.GEPITEMTYPE:
      case LovMasterEnum.PLAINSTUDDEDTYPE:
      case LovMasterEnum.WEIGHT_EDIT_REASON_TYPE:
      case LovMasterEnum.HALLMARK_KARAT:
        url = getProductLOVUrl();
        break;
      case LovMasterEnum.LOCATIONTYPE:
      case LovMasterEnum.OWNERTYPE:
      case LovMasterEnum.LOCATIONFORMAT:
      case LovMasterEnum.MATERIALPRICETYPE:
      case LovMasterEnum.PRICETYPE:
      case LovMasterEnum.TAXSYSTEM:
      case LovMasterEnum.DATEFORMAT:
      case LovMasterEnum.TIMEFORMAT:
      case LovMasterEnum.TAXTRANSACTIONTYPE:
      case LovMasterEnum.PRINT_DOC_TYPE:
      case LovMasterEnum.TEPPARTIALCNCANCELLATION:
        url = getLocationLOVeUrl();
        break;
      case LovMasterEnum.DEFECTTYPE:
      case LovMasterEnum.DEFECTCODE:
        url = getInventoryLOVUrl();
        break;
      case LovMasterEnum.TRANSACTION_TYPE:
      case LovMasterEnum.PAYMENT_GROUP:
      case LovMasterEnum.CUSTOMER_TYPE:
      case LovMasterEnum.OCCASION_TYPE:
      case LovMasterEnum.OTHER_CHARGES_REASONS:
      case LovMasterEnum.SALUTATION:
      case LovMasterEnum.GIFT_CARD_TYPE:
      case LovMasterEnum.ID_PROOF:
      case LovMasterEnum.GRN_REASON_TYPE:
      case LovMasterEnum.TATA_COMPANY:
      case LovMasterEnum.REFUND_PAYMENT_MODE:
      case LovMasterEnum.INVOICE_TYPE:
      case LovMasterEnum.REASON_FOR_CANCELLATION:
      case LovMasterEnum.REASON_FOR_CHANGING_DISCOUNT:
      case LovMasterEnum.REASON_FOR_NOT_GIVING_DISCOUNT:
      case LovMasterEnum.FULL_VALUE_TEP_REASON:
      case LovMasterEnum.RELATIONSHIP_TYPE:
        url = getPaymentLOVUrl();
        break;
      case LovMasterEnum.DISCOUNT_TYPE:
      case LovMasterEnum.RANGE_TYPE:
      case LovMasterEnum.CLUBBING_DISCOUNT_TYPE:
      case LovMasterEnum.APPROVAL_ROLES:
      case LovMasterEnum.RIVAAH_CARD:
        url = getConfigLOVUrl();
        break;

      case LovMasterEnum.STOCK_ISSUE_REPORT_HEADER:
        url = getReportPostLOVTypeUrl();
        break;
    }

    const formdata = {
      code: saveForm.lovName,
      lovType: saveForm.lovType,
      value: saveForm.description,
      isActive: saveForm.isActive
    };
    return this.apiService.post(url, formdata).pipe(
      map(data => {
        return LovMasterAdaptor.getLOVTypeCreate(data); // Switch the adaptor based on the lovType
      })
    );
  }
}
