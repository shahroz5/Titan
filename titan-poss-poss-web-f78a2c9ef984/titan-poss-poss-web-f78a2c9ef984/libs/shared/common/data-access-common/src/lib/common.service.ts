import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FileUploadDownloadPayload,
  MetalRates,
  MetalRatesPayload
} from '@poss-web/shared/models';
import {
  AbToleranceConfigAdaptor,
  CashMemoHelper
} from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  downloadManualBillUrl,
  getCashPaymentEngineUrl,
  getfailedInvoiceUrl,
  getCopiedInvoiceUrl,
  getMetalTypesUrl,
  getStandardMetalPriceHistoryUrl,
  getStandardMetalPriceUrl,
  getToleranceUrl,
  getvendorsCodeUrl,
  manualBillListUrl,
  triggerFailedInvoiceUrl,
  uploadManualBillUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CommonService {
  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  getStandardMetalPriceDetails(): Observable<any> {
    const url = getStandardMetalPriceUrl();
    return this.apiService.get(url).pipe(map(data => data));
  }

  getStandardMaterialPriceDetailsHistory(
    metalPriceRequest: MetalRatesPayload
  ): Observable<MetalRates[]> {
    const standardMetalPriceHistoryurl = getStandardMetalPriceHistoryUrl();
    return this.apiService
      .post(standardMetalPriceHistoryurl, metalPriceRequest)
      .pipe(map(data => CashMemoHelper.getMetalRatesHistory(data.results)));
  }

  getMaximumCashLimit(request: {
    ruleType: string;
    requestBody: any;
  }): Observable<any> {
    const url = getCashPaymentEngineUrl(request.ruleType);
    return this.apiService
      .post(url, request.requestBody)
      .pipe(map(data => data.cashAmountMaxCap));
  }
  loadMetalTypes() {
    const url = getMetalTypesUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          AbToleranceConfigAdaptor.getAbToleranceConfigMetalTypes(data)
        )
      );
  }
  getFailedInvoices() {
    const url = getfailedInvoiceUrl();
    return this.apiService.get(url).pipe(map(data => data));
  } 

  getCopiedInvoices() {
    const url = getCopiedInvoiceUrl();
    return this.apiService.get(url).pipe(map(data => data));
  } 

  triggerFailedInvoices() {
    const url = triggerFailedInvoiceUrl();
    return this.apiService.get(url);
  }

  loadTolerance(toleranceInput) {
    const url = getToleranceUrl(toleranceInput.ruleType);
    return this.apiService
      .post(url, toleranceInput.ruleRequestList)
      .pipe(map(data => data));
  }

  // Inventory Image Loading
  getThumbnailImageUrl(item) {
    let thumbNailImageBaseUrl = item.imageUrl;
    let imageUrlHeaders = item.imageCatalogueDetails;

    let apiKey = imageUrlHeaders.vendorDetails.data.apikey;
    let userToken = imageUrlHeaders.vendorDetails.data.usertoken;
    let thumbNailImageUrl = imageUrlHeaders.baseurl + thumbNailImageBaseUrl;

    return of({
      id: item.id,
      itemCode: item?.itemCode,
      thumbnailImageUrl: thumbNailImageUrl,
      isSearchedItem: item?.isSearchedItem,
      isChildItems: item?.isChildItems,
      isCancelItems: item?.isCancelItems,
      isHistoryItems: item?.isHistoryItems,
      isAdjustmentItems: item?.isAdjustmentItems,
      isPSVItems: item?.isPSVItems,
      isVerifiedItems: item?.isVerifiedItems
    })
    // return this.apiService
    //   .getImageSrcUrl(thumbNailImageUrl, apiKey, userToken)
    //   .pipe(
    //     map(data => ({
    //       id: item.id,
    //       itemCode: item?.itemCode,
    //       thumbnailImageUrl: data.length
    //         ? this.sanitizer.bypassSecurityTrustResourceUrl(
    //           'data:image/jpg;base64,' + data
    //         )
    //         : null,
    //       isSearchedItem: item?.isSearchedItem,
    //       isChildItems: item?.isChildItems,
    //       isCancelItems: item?.isCancelItems,
    //       isHistoryItems: item?.isHistoryItems,
    //       isAdjustmentItems: item?.isAdjustmentItems,
    //       isPSVItems: item?.isPSVItems,
    //       isVerifiedItems: item?.isVerifiedItems
    //     }))
    //   );
  }

  getImageUrl(item) {
    let thumbNailImageBaseUrl = item.imageUrl;
    let imageUrlHeaders = item.imageCatalogueDetails;

    let apiKey = imageUrlHeaders.vendorDetails.data.apikey;
    let userToken = imageUrlHeaders.vendorDetails.data.usertoken;
    let hugeImageBaseUrl = thumbNailImageBaseUrl.replace(
      'ImageParameter=2',
      'ImageParameter=1'
    );
    let hugeImageUrl = imageUrlHeaders.baseurl + hugeImageBaseUrl;

    return of({
      id: item.id,
      imageUrl: hugeImageUrl,
      itemCode: item?.itemCode,
      isSearchedItem: item?.isSearchedItem,
      isChildItems: item?.isChildItems,
      isCancelItems: item?.isCancelItems,
      isHistoryItems: item?.isHistoryItems,
      isAdjustmentItems: item?.isAdjustmentItems,
      isPSVItems: item?.isPSVItems,
      isVerifiedItems: item?.isVerifiedItems
    })
    // return this.apiService.getImageSrcUrl(hugeImageUrl, apiKey, userToken).pipe(
    //   map(data => ({
    //     id: item.id,
    //     imageUrl: data.length
    //       ? this.sanitizer.bypassSecurityTrustResourceUrl(
    //         'data:image/jpg;base64,' + data
    //       )
    //       : null,
    //     itemCode: item?.itemCode,
    //     isSearchedItem: item?.isSearchedItem,
    //     isChildItems: item?.isChildItems,
    //     isCancelItems: item?.isCancelItems,
    //     isHistoryItems: item?.isHistoryItems,
    //     isAdjustmentItems: item?.isAdjustmentItems,
    //     isPSVItems: item?.isPSVItems,
    //     isVerifiedItems: item?.isVerifiedItems
    //   }))
    // );
  }

  getImageCatalogueDetails() {
    return this.apiService
      .get(getvendorsCodeUrl('CATALOGUE'))
      .pipe(map(imageData => imageData));
  }

  // file upload flow
  uploadFile(fileDetails: FileUploadDownloadPayload): Observable<any> {
    const url = uploadManualBillUrl(fileDetails);
    return this.apiService
      .postImage(url, fileDetails.file, 'text')
      .pipe(map((data: any) => data));
  }

  uploadFileList(fileDetails: FileUploadDownloadPayload): Observable<any> {
    const url = manualBillListUrl(fileDetails);
    return this.apiService.get(url).pipe(map((idData: any) => idData.results));
  }

  downloadFile(data: { id: string; locationCode: string }): Observable<any> {
    const url = downloadManualBillUrl(data);
    return this.apiService.get(url).pipe(map((idData: any) => idData.url));
  }
}
