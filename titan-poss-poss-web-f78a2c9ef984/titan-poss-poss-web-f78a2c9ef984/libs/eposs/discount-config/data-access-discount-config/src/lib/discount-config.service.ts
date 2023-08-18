import { Injectable } from '@angular/core';
import {
  ApiService,
  getBestDealDiscountUrl,
  getComputeTsssDiscountUrl,
  getDiscountComponentPGConfigURl,
  getDiscountConfigsUrl,
  getDiscountDetailsByIdUrl,
  getDiscountDetailsUrl,
  getDiscountExcludeConfigsUrl,
  getDiscountMappedBestDealDiscountUrl,
  getDiscountMappedLocationsUrl,
  getDiscountMappedProductCategoriesUrl,
  getDiscountMappedProductGroupsUrl,
  getDiscountProductGroupsByIdUrl,
  getDiscountSlabDetailsUrl,
  getEditDiscountDetailsUrl,
  getPublishDiscountUrl,
  getSaveDiscountDetailsUrl,
  getTepDurationUrl,
  saveDiscountExcludeThemesUrl,
  saveDiscountExcludeTyperl,
  saveDiscountMappedBestDealDiscountUrl,
  saveDiscountMappedLocationsUrl,
  saveDiscountMappedProductCategoriesUrl,
  saveDiscountMappedProductGroupsUrl,
  saveDiscountExcludeSchemesUrl,
  getWorkFlowProcessUrl,
  getDiscountWorkflowRequesturl,
  getDiscountApprovalRequesturl,
  uploadFaqDocUrl,
  downloadFaqUrl,
  getResendEmailurl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  DiscounExcludeItemListPayload,
  DiscountBestDealListPayload,
  DiscountConfigSuccessList,
  DiscountExcludeItemSuccessList,
  DiscountLocationListPayload,
  DiscountLocationSuccessList,
  DiscountProductCategoryListPayload,
  DiscountProductCategorySuccessList,
  DiscountProductGroupListPayload,
  DiscountProductGroupSuccessList,
  DisountConfigListPayload,
  MappedBestDealDiscountSuccessList,
  MappedDetails,
  NewDiscountApplicableConfig,
  NewDiscountDetails,
  ProductGroup,
  ProductGroupMappingOption,
  responseTypeEnum,
  SaveDiscountThemesPayload,
  SaveExcludeTypePayload,
  TSSSRequestPayload,
  SaveDiscountSchemesPayload,
  RequestPayload,
  RequestLists,
  discountWorkflowpayload,
  FaqRequestPaylaod
} from '@poss-web/shared/models';
import { DiscountConfigAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class DiscountConfigService {
  constructor(private apiService: ApiService) {}

  loadDiscountConfigList(
    payload: DisountConfigListPayload
  ): Observable<DiscountConfigSuccessList> {
    const url = getDiscountConfigsUrl(
      payload.pageIndex,
      payload.pageSize,
      payload.discountCode,
      payload.discountType,
      payload.status,
      payload.publishStatus,
      payload.occasion
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountConfigAdaptor.getDiscountConfigList(data)));
  }

  loadBeastDealDiscount(
    payload: DisountConfigListPayload
  ): Observable<DiscountConfigSuccessList> {
    const url = getBestDealDiscountUrl(
      payload.discountType,
      payload.isPageable,
      payload.isActive
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountConfigAdaptor.getDiscountConfigList(data)));
  }

  loadDiscountDetailsById(id: string) {
    if (id === 'new') return of(DiscountConfigAdaptor.getNewDiscountDetails());
    else {
      const url = getDiscountDetailsByIdUrl(id);
      return this.apiService
        .get(url)
        .pipe(map(data => DiscountConfigAdaptor.getDiscountDetailsById(data)));
    }
  }
  saveDiscountsDetails(saveDetails: NewDiscountDetails) {
    console.log(saveDetails);
    const url = getSaveDiscountDetailsUrl();
    return this.apiService
      .post(url, saveDetails)
      .pipe(map(data => DiscountConfigAdaptor.getDiscountDetailsById(data)));
  }

  editDiscountDetails(id: string, editDetails: NewDiscountApplicableConfig) {
    console.log(editDetails);
    const url = getEditDiscountDetailsUrl(id);
    return this.apiService.patch(url, editDetails);
  }
  getMappedLocationsList(
    locationpayload: DiscountLocationListPayload
  ): Observable<DiscountLocationSuccessList> {
    const url = getDiscountMappedLocationsUrl(
      locationpayload.id,
      true,
      locationpayload.pageIndex,
      locationpayload.pageSize,
      locationpayload.offerStartDate,
      locationpayload.offerEndDate,
      locationpayload.previewStartDate,
      locationpayload.previewEndDate
    );
    const requestPayload: any = {};
    if (locationpayload.offerStartDate && locationpayload.offerEndDate) {
      requestPayload.offerStartDate = locationpayload.offerStartDate;
      requestPayload.offerEndDate = locationpayload.offerEndDate;
    }
    if (locationpayload.previewStartDate && locationpayload.previewEndDate) {
      requestPayload.previewStartDate = locationpayload.previewStartDate;
      requestPayload.previewEndDate = locationpayload.previewEndDate;
    }
    if (locationpayload.locationCode.length !== 0) {
      requestPayload.locationCode = locationpayload.locationCode;
    }

    return this.apiService
      .post(url.path, requestPayload, url.params)
      .pipe(map(data => DiscountConfigAdaptor.getDiscountLocations(data)));
  }
  getMappedProductCategoryList(
    productCategorypayload: DiscountProductCategoryListPayload
  ): Observable<DiscountProductCategorySuccessList> {
    const url = getDiscountMappedProductCategoriesUrl(
      productCategorypayload.id,
      true,
      productCategorypayload.pagination.pageIndex,
      productCategorypayload.pagination.pageSize,
      productCategorypayload.productCategoryCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => DiscountConfigAdaptor.getDiscountProductCategories(data))
      );
  }
  getMappedProductGroupsList(
    productGrouppayload: DiscountProductGroupListPayload
  ): Observable<DiscountProductGroupSuccessList> {
    const url = getDiscountMappedProductGroupsUrl(
      productGrouppayload.id,
      true,
      productGrouppayload.karatType,
      productGrouppayload.productType,
      productGrouppayload.pagination.pageIndex,
      productGrouppayload.pagination.pageSize,
      productGrouppayload.productGroupCodeList
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountConfigAdaptor.getDiscountProductGroups(data)));
  }

  getExcludeItemsList(
    excludeItemsPayload: DiscounExcludeItemListPayload
  ): Observable<DiscountExcludeItemSuccessList> {
    console.log(excludeItemsPayload, 'excludeItemsPayload');

    const url = getDiscountExcludeConfigsUrl(
      excludeItemsPayload.id,
      excludeItemsPayload.isPageable,
      excludeItemsPayload?.pagination?.pageIndex,
      excludeItemsPayload?.pagination?.pageSize,
      excludeItemsPayload.itemCode,
      excludeItemsPayload.excludeType,
      excludeItemsPayload.sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountConfigAdaptor.getDiscountExcludeItems(data)));
  }

  saveMappedLocations(locations) {
    const url = saveDiscountMappedLocationsUrl(locations.id);
    return this.apiService.patch(url, locations.payload);
  }
  saveMappedProductCategories(productCategory) {
    const url = saveDiscountMappedProductCategoriesUrl(productCategory.id);
    return this.apiService.patch(url, productCategory);
  }
  saveMappedProductGroups(productGroup) {
    const url = saveDiscountMappedProductGroupsUrl(
      productGroup.id,
      productGroup.karatType,
      productGroup.productType
    );
    return this.apiService.patch(url.path, productGroup, url.params);
  }
  saveExcludeThemeCodes(payload: SaveDiscountThemesPayload) {
    const url = saveDiscountExcludeThemesUrl(payload.id, payload.excludeType);
    return this.apiService.patch(url.path, payload, url.params);
  }
  saveExcludeSchemeCodes(payload: SaveDiscountSchemesPayload) {
    const url = saveDiscountExcludeSchemesUrl(payload.id, payload.excludeType);
    return this.apiService.patch(url.path, payload, url.params);
  }

  saveExcludeTypes(payload: SaveExcludeTypePayload) {
    console.log(payload, 'check in service');

    const url = saveDiscountExcludeTyperl(payload.id, payload.excludeType);
    return this.apiService.patch(url.path, payload.payload, url.params);
  }

  getSelectedLocations(
    payload: DiscountLocationListPayload
  ): Observable<MappedDetails[]> {
    const url = getDiscountMappedLocationsUrl(payload.id, false);

    return this.apiService
      .post(url.path, {}, url.params)
      .pipe(map(data => DiscountConfigAdaptor.getMappedLocationList(data)));
  }
  loadRequest(data: RequestPayload): Observable<RequestLists> {
    const reqBody = data.reqBody;

    const workflowUrl = getWorkFlowProcessUrl(data.requestParams);

    return this.apiService
      .post(workflowUrl.path, reqBody, workflowUrl.params)
      .pipe(map((res: any) => DiscountConfigAdaptor.getRequestList(res)));
  }

  getSelectedProductGroups(
    payload: DiscountProductGroupListPayload
  ): Observable<MappedDetails[]> {
    const url = getDiscountMappedProductGroupsUrl(
      payload.id,
      false,
      payload.karatType,
      payload.productType
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountConfigAdaptor.getMappedProductGroupList(data)));
  }
  getSelectedProductCategories(
    payload: DiscountProductCategoryListPayload
  ): Observable<MappedDetails[]> {
    const url = getDiscountMappedProductCategoriesUrl(payload.id, false);

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => DiscountConfigAdaptor.getMappedProductCategoryList(data))
      );
  }
  publishDiscount(discountId): Observable<boolean> {
    const url = getPublishDiscountUrl(discountId);

    return this.apiService.post(url);
  }

  getSelectedBestDealDiscount(
    payload: DiscountBestDealListPayload
  ): Observable<MappedBestDealDiscountSuccessList> {
    const url = getDiscountMappedBestDealDiscountUrl(payload);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => DiscountConfigAdaptor.getMappedBestDealDsicountList(data))
      );
  }

  saveMappedBestDealDiscount(bestDeslDisocunts) {
    const url = saveDiscountMappedBestDealDiscountUrl(bestDeslDisocunts.id);
    return this.apiService.patch(url, bestDeslDisocunts);
  }

  saveSlabDetails(payload: any): Observable<any> {
    const url = getDiscountSlabDetailsUrl(payload.discountId);
    return this.apiService
      .patch(url.path, payload.slabDetails, url.params)
      .pipe(map(data => data));
  }

  saveDiscountDetails(payload: any): Observable<any> {
    const url = getDiscountDetailsUrl(payload.discountId);
    return this.apiService
      .patch(url.path, payload.discountComponents, url.params)
      .pipe(
        map(data => DiscountConfigAdaptor.getDiscountSlabDetails(data.results))
      );
  }

  loadDiscountDetails(payload: any): Observable<any> {
    const url = getDiscountDetailsUrl(payload.discountId);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => DiscountConfigAdaptor.getDiscountSlabDetails(data.results))
      );
  }

  loadDiscountComponentPGConfig(
    loadData: {
      discountId: string;
      pgType: string;
      pageIndex: number;
      pageSize: number;
    },
    productGroups: ProductGroup[]
  ): Observable<any> {
    if (!loadData.pgType) {
      productGroups = [];
    }
    const url = getDiscountComponentPGConfigURl(
      loadData.discountId,
      '' + loadData.pageIndex,
      '' + loadData.pageSize,
      productGroups
    );
    return this.apiService.get(url.path, url.params).pipe(
      map(data => ({
        data: DiscountConfigAdaptor.getDiscountSlabDetails(data.results),
        count: data.totalElements ? data.totalElements : 0
      }))
    );
  }

  updateEmpowermentDiscountDetails(payload: any): Observable<any> {
    const url = getDiscountDetailsUrl(payload.discountId);
    return this.apiService
      .patch(url.path, payload.discountComponents, url.params)
      .pipe(
        map(data =>
          DiscountConfigAdaptor.getDiscountEmpowermentDetails(data.results)
        )
      );
  }

  getEmpowermentDiscountDetails(payload: any): Observable<any> {
    console.log('check service', payload);

    const url = getDiscountDetailsUrl(payload.discountId);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          DiscountConfigAdaptor.getDiscountEmpowermentDetails(data.results)
        )
      );
  }

  updateDiscountComponentPGConfig(data: {
    discountId: string;
    discountComponents: any;
  }): Observable<any> {
    const url = getDiscountComponentPGConfigURl(
      data.discountId,
      null,
      null,
      []
    );
    return this.apiService.patch(url.path, data.discountComponents);
  }

  loadMappedProductGroups(discountId: string, discountDetailsId: string) {
    const url = getDiscountProductGroupsByIdUrl(
      discountId,
      discountDetailsId,
      true
    );
    console.log(url);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountConfigAdaptor.getMappedProductGroup(data)));
  }

  updateMappedProductGroups(
    discountId: string,
    discountDetailsId: string,
    data: {
      addProducts: ProductGroupMappingOption[];
      removeProducts: ProductGroupMappingOption[];
      updateProducts: ProductGroupMappingOption[];
    }
  ) {
    const url = getDiscountProductGroupsByIdUrl(
      discountId,
      discountDetailsId,
      false
    );

    return this.apiService
      .patch(url.path, data, url.params)
      .pipe(map(res => DiscountConfigAdaptor.getMappedProductGroup(res)));
  }

  loadRangeTepDurationDays() {
    const url = getTepDurationUrl();

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => DiscountConfigAdaptor.getRangeTepDuration(data)));
  }

  computeTSSSConfig(requestPaylaod: TSSSRequestPayload) {
    const url = getComputeTsssDiscountUrl(requestPaylaod.discountId);
    return this.apiService.post(url, requestPaylaod.couponRequest);
  }

  getDownloadUrlOfTsssConfig(discountId: string) {
    const url = getComputeTsssDiscountUrl(discountId);

    this.apiService.ResponseContentType = responseTypeEnum.BLOB;

    return this.apiService
      .getBlobResponse(url)
      .pipe(
        map(data =>
          DiscountConfigAdaptor.getTSSSConfigCouponUrl(data, discountId)
        )
      );
  }

  sendDiscountForApproval(payload: discountWorkflowpayload) {
    const url = getDiscountWorkflowRequesturl(
      payload.id,
      payload.typeOfDiscount
    );

    return this.apiService
      .patch(url.path, payload.remarks, url.params)
      .pipe(map(res => true));
  }

  approveOrCancelDiscount(payload: discountWorkflowpayload) {
    const url = getDiscountApprovalRequesturl(
      payload.id,
      payload.approvalStatus
    );

    return this.apiService
      .patch(url.path, payload.remarks, url.params)
      .pipe(map(res => res.status));
  }

  resendEmail(processId: string) {
    const url = getResendEmailurl(processId);
    return this.apiService.get(url.path, url.params).pipe(
      map(res => {
        return res.response;
      })
    );
  }

  uploadFaq(fileRequest: FaqRequestPaylaod): Observable<any> {
    const url = uploadFaqDocUrl(fileRequest.docType, fileRequest.fileType);

    return this.apiService
      .postImage(url.path, fileRequest.file, 'text', url.params)
      .pipe(map((data: any) => data));
  }

  // downloadFaqFile(data: { fileId: string; fileName: string }): Observable<any> {
  //   const url = downloadFaqUrl(data);
  //   return this.apiService
  //     .get(url.path, url.params)
  //     .pipe(map((idData: any) => idData.url));
  // }

  downloadFaqFile(data: { fileId: string; fileName: string }) {
    const url = downloadFaqUrl(data);
    this.apiService.ResponseContentType = responseTypeEnum.BLOB;
    return this.apiService.get(url.path, url.params).pipe(
      map((iddata: any) => {
        this.downloadDocFile(iddata, data.fileName);
        return true;
      })
    );
  }

  downloadDocFile(data: any, filename: string) {
    let blob: Blob;
    if (data.type === 'application/pdf') {
      blob = new Blob([data], {
        type: 'application/pdf'
      });
    } else {
      blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
    }

    const fileName: string = filename;

    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    a.target = '_blank';
    a.title = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }
}
