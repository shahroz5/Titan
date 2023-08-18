import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConversionFacade } from '@poss-web/eposs/conversion/data-access-conversion';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { SelectionDailogOption } from '@poss-web/shared/components/ui-selection-dialog';
import {
  BinCode,
  CashMemoTaxDetails,
  Command,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConversionApprovalStatus,
  ConversionItemPayload,
  ConversionRequestItems,
  ConversionRequests,
  ConversionSplitItemPayload,
  CustomErrors,
  InStockConversionTypesEnum,
  ItemDetailPopupserviceAbstraction,
  ItemDetailsPopupTabType,
  LocationSettingAttributesEnum,
  MetalTypeEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PriceRequestPayload,
  ProductPriceDetails,
  ProductTypesEnum,
  SelectDropDownOption,
  ShortcutServiceAbstraction,
  TaxTypesEnum
} from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getConversionRouteUrl } from '@poss-web/shared/util-site-routes';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { calculatePriceBreakup } from '@poss-web/shared/util-price';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';

const selectRSOShortcutKey = 'ConversionDetailsComponent.PRIMARY_DROPDOWN';
const backShortcutKey = 'ConversionDetailsComponent.BACK';
const componentName = 'ConversionDetailsComponent';

@Component({
  selector: 'poss-web-conversion-details',
  templateUrl: './conversion-details.component.html',
  styleUrls: ['./conversion-details.component.scss']
})
export class ConversionDetailsComponent implements OnInit, OnDestroy {
  storeType: string;
  selectedRequestId: number;
  isL1L2Store: boolean;
  isL3Store: boolean;
  lotNumber;
  itemCode;

  selectedRequest: ConversionRequests;
  selectedRequestData: ConversionRequestItems[];
  parentItem: ConversionRequestItems = null;
  childItems: ConversionRequestItems[] = [];
  childItemsWeight = 0;
  isLoadingSelectedRequest$: Observable<boolean>;
  isLoadingSelectedRequestData$: Observable<boolean>;
  isLoadingCount$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  status: string;
  statusColor: string;
  hasRsoDetails$: Observable<boolean>;
  rsoDetails$: Observable<string[]>;
  isLoadingRsoDetails$: Observable<boolean>;
  rsoNames: string[] = [];
  hasNotification = false;

  binGroupCode: string;
  binCodes: BinCode[] = [];
  binsForSelection: SelectionDailogOption[] = [];

  parentForm: FormArray;
  rsoForm: FormGroup;

  conversionDocNo = 0;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;

  @ViewChild('rsoDropdown', { read: ElementRef })
  rsoDropdown: ElementRef;
  type: string;
  isShowingErrorNotifcation = false;
  enterWeightBinCodeErrorMsg: string;

  rsoNamesArray: SelectDropDownOption[] = [];
  conversionApprovalStatus = ConversionApprovalStatus;
  isLoadImageUrl: boolean;
  isLoadChildImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  standardPrice: {};

  currencyCode: string;
  weightCode: string;
  productType: string;
  stdPriceDetailsTitle: string;
  priceDetailsTitle: string;
  enableAddRowBtn: boolean;
  weightMissmatchError: string;
  priceMissmatchError: string;

  childItemArray = [];
  conversionWeightToleranceForBangle: number;
  locationCode: string;
  priceDetails: ProductPriceDetails[];

  constructor(
    private conversionFacade: ConversionFacade,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private currencyFormatterService: CurrencyFormatterService,
    private formBuilder: FormBuilder,
    private profiledatafacade: ProfileDataFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private weightFormatter: WeightFormatterService,
    private commonFacade: CommonFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private itemDetailPopupservice: ItemDetailPopupserviceAbstraction,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.parentForm = new FormArray([]);

    this.rsoForm = this.formBuilder.group({
      rsoName: []
    });

    this.translate
      .get([
        'pw.conversionNotificationMessages.enterWeight-BinCode-errorMsg',
        'pw.conversion.stdPriceTitle',
        'pw.conversion.priceDetailsTitle'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string[]) => {
        this.enterWeightBinCodeErrorMsg =
          translatedMsg[
            'pw.conversionNotificationMessages.enterWeight-BinCode-errorMsg'
          ];
        this.stdPriceDetailsTitle = translatedMsg['pw.findPrice.stdPriceTitle'];
        this.priceDetailsTitle =
          translatedMsg['pw.findPrice.priceDetailsTitle'];
      });
  }

  ngOnInit() {
    this.isLoadingImage$ = this.conversionFacade.getIsLoadingImage();
    this.conversionFacade.resetError();
    this.overlayNotification.close();
    this.conversionFacade.loadStandardPrice();
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
    this.selectedRequestId = this.activatedRoute.snapshot.params['_id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    combineLatest([
      this.profiledatafacade.getBoutiqueType(),
      this.profiledatafacade.isL1Boutique(),
      this.profiledatafacade.isL2Boutique(),
      this.profiledatafacade.isL3Boutique()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([val, val1, val2, val3]) => {
        this.storeType = val;
        this.isL1L2Store = val1 || val2;
        this.isL3Store = val3;
        this.binGroupCode = this.isL1L2Store
          ? InStockConversionTypesEnum.STN
          : InStockConversionTypesEnum.PURCFA;
        this.componentInit();
      });
    this.parentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.showNotification();
      });
    this.conversionFacade
      .getStandardPrice()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
        if (data) {
          this.standardPrice = data;
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_WEIGHT_UNIT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(weightCode => {
        this.weightCode = weightCode;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((locationCode: string) => {
        this.locationCode = locationCode;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.INV_CONVERSION_WT_TOLERANCE_FOR_BANGLE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((conversionWeightTolerance: string) => {
        this.conversionWeightToleranceForBangle = Number(
          conversionWeightTolerance
        );
      });
  }

  componentInit() {
    this.conversionFacade.loadBinCodes(this.binGroupCode);
    this.conversionFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.conversionFacade.loadStuddedProductGroups();
    this.isLoadingSelectedRequestData$ = this.conversionFacade.getIsLoadingSelectedRequestData();
    this.isLoadingCount$ = this.conversionFacade.getIsLoadingConversionRequestCount();
    this.isLoadingSelectedRequest$ = this.conversionFacade.getIsLoadingSelectedRequest();
    this.isLoadChildImageUrl = true;
    this.conversionFacade.loadSelectedRequest(this.selectedRequestId);
    this.isLoadingRsoDetails$ = this.conversionFacade.getIsLoadingRsoDetails();
    this.conversionFacade
      .getSelectedRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: ConversionRequests) => {
        if (response) {
          this.selectedRequest = response;
          this.initialLoad();
        }
      });

    this.conversionFacade
      .getHasRsoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasData: any) => {
        if (hasData) {
          this.conversionFacade
            .getRsoDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((empNames: any) => {
              this.rsoNames = empNames;
              for (const rso of empNames) {
                this.rsoNamesArray = [];
                this.rsoNamesArray.push({
                  value: rso,
                  description: rso
                });
              }
            });
        }
      });
    this.conversionFacade
      .getItemSplitResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.conversionDocNo = data.srcDocNo;
        }
      });

    this.conversionFacade
      .getBinCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bincodes: BinCode[]) => {
        this.binCodes = bincodes;
        this.binsForSelection = bincodes.map(bincode => ({
          id: bincode.binCode,
          description: bincode.description
        }));
      });
  }
  initialLoad() {
    this.isLoadImageUrl = true;
    this.conversionFacade.loadSelectedRequestData(this.selectedRequest.id);
    this.conversionFacade.loadRsoDetails();

    this.conversionFacade
      .getSelectedRequestData()
      .pipe(
        withLatestFrom(
          this.commonFacade.getCommonFacadeAttributes(
            CommomStateAttributeTypeEnum.INVENTORY,
            CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
          )
        ),
        filter(data => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe(([data, imageCatalogueDetails]) => {
        if (data) {
          this.childItems = [];
          this.childItemArray = [];
          for (const item of data) {
            if (
              item?.itemDetails?.itemType?.toUpperCase() ===
              InStockConversionTypesEnum.PARENT
            ) {
              this.parentItem = item;
              if (item?.studded) {
                this.loadItemPriceDetails(item);
              }
            } else {
              this.childItems.push(item);
            }
          }

          if (this.parentItem && this.childItems.length > 0) {
            this.addRowShowOrNot(this.parentItem, this.childItems);
          }

          if (this.isLoadImageUrl && data.length > 0 && imageCatalogueDetails)
            this.loadImage(data, imageCatalogueDetails, false);

          if (this.childItems.length === 0) {
            this.childItems = this.selectedRequest?.otherDetails;
            if (
              this.isLoadChildImageUrl &&
              this.childItems.length > 0 &&
              imageCatalogueDetails
            )
              this.loadImage(this.childItems, imageCatalogueDetails, true);
          }
          if (this.childItems.length > 0) {
            this.getPriceDetails(this.childItems);
          }
          this.showNotification();
        }
      });
  }
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case selectRSOShortcutKey: {
        if (this.rsoDropdown) {
          this.rsoDropdown.nativeElement.focus();
        }
        break;
      }

      case backShortcutKey: {
        this.back();
        break;
      }
    }
  }

  back() {
    this.router.navigate([getConversionRouteUrl('requests')]);
  }
  showNotification() {
    if (!this.isShowingErrorNotifcation) {
      this.overlayNotification.close();
      if (
        this.selectedRequest?.status?.toUpperCase() ===
          ConversionApprovalStatus.APPROVED &&
        !this.getIsValidItemDetails()
      ) {
        this.inValidItemDetailsOverlay();
      } else if (
        this.selectedRequest?.status?.toUpperCase() ===
          ConversionApprovalStatus.APPROVED &&
        this.parentForm.invalid
      ) {
        this.parentForm.markAllAsTouched();
        this.enterWeightOverlay();
      } else if (
        this.selectedRequest?.status?.toUpperCase() ===
          ConversionApprovalStatus.APPROVED &&
        this.parentForm.valid &&
        !this.enableAddRowBtn
      ) {
        this.convertNowOverlay();
      } else if (
        this.selectedRequest?.status?.toUpperCase() ===
          ConversionApprovalStatus.APPROVED &&
        this.parentForm.valid &&
        this.enableAddRowBtn
      ) {
        this.addChildItemOverlay();
      } else {
        this.overlayNotification.close();
      }
    }
  }

  enterWeightOverlay() {
    this.overlayNotification.close();
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: this.enterWeightBinCodeErrorMsg
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
  }

  createSplitItemPayload(): ConversionSplitItemPayload {
    const issueItem: ConversionItemPayload[] = [
      {
        binCode: null,
        inventoryId: this.parentItem.inventoryId,
        itemCode: this.parentItem.itemCode,
        lotNumber: this.parentItem.lotNumber,
        measuredWeight: +this.weightFormatter.format(this.parentItem.stdWeight)
      }
    ];
    const receiveItems: ConversionItemPayload[] = [];
    console.log(this.childItems, 'ChilItems');
    for (const receivedItem of this.parentForm.controls) {
      const receiveItem: ConversionItemPayload = {
        binCode: receivedItem.value.binCode,
        inventoryId: receivedItem.value.inventoryId,
        itemCode: receivedItem.value.itemCode,
        lotNumber: receivedItem.value.lotNumber,
        measuredWeight: +this.weightFormatter.format(receivedItem.value.weight),
        makingCharges: receivedItem.value.makingCharges,
        makingChargesPct: receivedItem.value.makingChargesPct,
        final_value: receivedItem.value.finalValue
      };
      receiveItems.push(receiveItem);
    }
    // for (const childItem of this.childItems) {
    //   const receiveItem: ConversionItemPayload = {
    //     binCode: childItem.binCode,
    //     inventoryId: childItem.inventoryId,
    //     itemCode: childItem.itemCode,
    //     lotNumber: childItem.lotNumber,
    //     measuredWeight: +this.weightFormatter.format(childItem.stdWeight),
    //     makingCharges:
    //       childItem?.priceDetails?.priceDetails?.makingChargeDetails
    //         ?.preDiscountValue,
    //     makingChargesPct:
    //       childItem?.priceDetails?.priceDetails?.makingChargeDetails
    //         ?.makingChargePercentage,
    //     final_value: childItem?.priceDetails?.finalValue
    //   };
    //   receiveItems.push(receiveItem);
    // }

    const splitItemPayload: ConversionSplitItemPayload = {
      issueItems: issueItem,
      receiveItems: receiveItems,
      rsoName: this.rsoForm.get('rsoName').value,
      requestId: this.selectedRequest.id
    };
    return splitItemPayload;
  }
  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status?: string) {
    let key = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  errorHandler(error: CustomErrors) {
    this.isShowingErrorNotifcation = true;
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error,
        hasBackdrop: error.code === ErrorEnums.ERR_INV_029
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        this.isShowingErrorNotifcation = false;
        this.showNotification();
      });

    this.showNotification();
  }
  closeButtonNvaigation(event: any) {
    if (event.eventType === OverlayNotificationEventType.CLOSE) {
      this.router.navigate(['..'], {
        relativeTo: this.activatedRoute
      });
    }
  }
  showProgressNotification() {
    const key = 'pw.stockReceiveNotificationMessages.progressMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }
  conversionSuccessMsgOverlay() {
    this.overlayNotification.close();
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasClose: true,
        hasBackdrop: true,
        message: '',
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        this.closeButtonNvaigation(event);
      });
  }
  convertNowOverlay() {
    this.translate
      .get([
        'pw.conversion.confirmOverlayMessage',
        'pw.conversionNotificationMessages.btnText-ConvertNow',
        'pw.conversionNotificationMessages.priceMismatchMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string[]) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText:
              translatedMsg[
                'pw.conversionNotificationMessages.btnText-ConvertNow'
              ],
            message: translatedMsg['pw.conversion.confirmOverlayMessage']
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.rsoForm.get('rsoName').markAsTouched();
              if (this.parentItem.itemCode.charAt(6) === 'V') {
                const parentItemWeight = this.parentItem.stdWeight;
                let childItemWeight = 0;
                this.parentForm.controls.forEach(item => {
                  childItemWeight = Number(
                    (childItemWeight + Number(item.value.weight)).toFixed(3)
                  );
                });

                const parentItemPrice = this.priceDetails?.find(
                  x => x.itemCode === this.parentItem.itemCode
                )?.finalValue;
                let childItemPrice = 0;
                this.priceDetails
                  ?.filter(x => x.itemCode !== this.parentItem.itemCode)
                  ?.forEach(y => {
                    childItemPrice = childItemPrice + Number(y.finalValue);
                  });
                let priceDiff = Number(
                  Math.abs(parentItemPrice - childItemPrice).toFixed(2)
                );

                if (parentItemWeight !== childItemWeight) {
                  this.weightMissmatchError =
                    'Sum of child item weight should be equal to parent item weight.';
                } else if (this.parentItem.studded && priceDiff > 2) {
                  this.priceMissmatchError =
                    translatedMsg[
                      'pw.conversionNotificationMessages.priceMismatchMessage'
                    ];
                } else {
                  this.weightMissmatchError = '';
                  if (this.rsoForm.valid) {
                    this.showProgressNotification();
                    this.conversionFacade.confirmConversion(
                      this.createSplitItemPayload()
                    );
                    this.conversionFacade
                      .getItemSplitResponse()
                      .pipe(takeUntil(this.destroy$))
                      .subscribe((response: any) => {
                        this.overlayNotification.close();
                        if (response) {
                          this.conversionSuccessMsgOverlay();
                        }
                      });
                  } else {
                    this.showNotification();
                  }
                }
              } else {
                if (this.rsoForm.valid) {
                  this.showProgressNotification();
                  this.conversionFacade.confirmConversion(
                    this.createSplitItemPayload()
                  );
                  this.conversionFacade
                    .getItemSplitResponse()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((response: any) => {
                      this.overlayNotification.close();
                      if (response) {
                        this.conversionSuccessMsgOverlay();
                      }
                    });
                } else {
                  this.showNotification();
                }
              }
            } else if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.hasNotification = false;
              this.showNotification();
            }
          });
      });
  }
  // Image
  loadImage(itemList, imageCatalogueDetails, isChildItems) {
    if (isChildItems) this.isLoadChildImageUrl = false;
    else this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if (item.imageURL !== null && item.imageURL !== undefined) {
        this.conversionFacade.loadRequestThumbnailImageUrl({
          id: item.inventoryId,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails,
          isChildItems: isChildItems
        });
      }
    });
  }

  addChildItemOverlay() {
    this.overlayNotification.close();
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: 'Please add other child items'
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
  }

  AddNewChildItem() {
    let smallestChildItem = this.childItems[0];
    let numberOfItem = Number(smallestChildItem.itemCode.charAt(10));
    this.childItems.forEach(item => {
      if (Number(item.itemCode.charAt(10)) < numberOfItem) {
        smallestChildItem = item;
        numberOfItem = Number(smallestChildItem.itemCode.charAt(10));
      }
    });

    const newChildItem = {
      itemCode: smallestChildItem.itemCode,
      productCategoryDesc: smallestChildItem.productCategoryDesc,
      productCategory: smallestChildItem.productCategory,
      productType: null,
      stoneValue: null,
      stdWeight: smallestChildItem.stdWeight,
      stdValue: null,
      complexityCode: smallestChildItem.itemDetails.complexityCode,
      lotNumber: smallestChildItem.lotNumber,
      binCode: null,
      imageURL: smallestChildItem.imageURL,
      inventoryId: null,
      productGroupDesc: smallestChildItem.productGroupDesc,
      productGroup: smallestChildItem.productGroup,
      weightUnit: null,
      itemDetails: {
        sold: 'N'
      },
      currencyCode: null,
      itemDescription: '',
      childItems: null,
      isStudded: false,
      studded: smallestChildItem.studded,
      thumbnailImageURL: '',
      isLoadingImage: false,
      isLoadingThumbnailImage: smallestChildItem.isLoadingThumbnailImage
    };

    if (this.childItemArray.length === 0) {
      this.childItemArray = this.childItems;
    }

    this.childItemArray = [...this.childItemArray, newChildItem];

    if (this.childItemArray.length > 0) {
      this.addRowShowOrNot(this.parentItem, this.childItemArray);
    }
  }

  addRowShowOrNot(parentItem, childItems) {
    const seventCharOfItem = parentItem.itemCode.charAt(6);
    const sumOfParentItemPices = Number(parentItem.itemCode.charAt(10));
    let sumOfChildItePiecs = 0;
    childItems.forEach(item => {
      if (item?.itemCode?.charAt(10) === 'A') {
        sumOfChildItePiecs = sumOfChildItePiecs + 1;
      } else {
        if (item.itemCode) {
          sumOfChildItePiecs =
            sumOfChildItePiecs + Number(item.itemCode.charAt(10));
        }
      }
    });

    if (
      seventCharOfItem === 'V' &&
      sumOfParentItemPices !== sumOfChildItePiecs
    ) {
      this.enableAddRowBtn = true;
    } else {
      this.enableAddRowBtn = false;
    }
  }

  loadImageUrl(event, isChildItems: boolean) {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.INVENTORY,
        CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
      )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        if (event.imageUrl !== null && event.imageUrl !== undefined) {
          this.conversionFacade.loadRequestImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails,
            isChildItems: isChildItems
          });
        }
      });
  }

  getIsValidItemDetails() {
    return this.parentForm.controls.every(parentFormControl => {
      return (
        parentFormControl.value.itemCode && parentFormControl.value.lotNumber
      );
    });
  }

  inValidItemDetailsOverlay() {
    this.translate
      .get('pw.conversionNotificationMessages.inValidItemDetailsMsg')
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }

  loadItemPriceDetails(item: ConversionRequestItems) {
    let payload: PriceRequestPayload = {
      itemCode: item.itemCode,
      lotNumber: item.lotNumber,
      inventoryId: item.inventoryId,
      standardPrice: this.standardPrice,
      locationCode: this.locationCode
    };
    this.conversionFacade.loadItemPriceDetails(payload);
  }

  getPriceDetails(childItems: ConversionRequestItems[]) {
    this.conversionFacade
      .getPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductPriceDetails[]) => {
        if (data?.length > 0) {
          this.priceDetails = data;
          data.forEach(x => {
            let index = childItems.findIndex(
              item => item.itemCode === x.itemCode
            );
            this.childItems[index] = {
              ...this.childItems[index],
              priceDetails: x
            };

            //calculatethis.childItems[index]['priceDetails'] = x;
          });
        }
      });
  }

  mapItemPriceDetails(itemCode: string) {
    return (
      this.priceDetails && this.priceDetails.find(x => x.itemCode === itemCode)
    );
  }

  openPriceDetailsPopup(priceDetails: ProductPriceDetails) {
    let goldRate;
    let platinumRate;
    let silverRate;
    const dataArray =
      priceDetails?.priceDetails?.metalPriceDetails?.metalPrices;
    dataArray?.forEach(element => {
      if (element.metalTypeCode === MetalTypeEnum.GOLD) {
        goldRate = {
          karat: element.karat,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.PLATINUM) {
        platinumRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.SILVER) {
        silverRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }
    });

    const priceResult = calculatePriceBreakup(
      priceDetails?.priceDetails,
      {} as any,
      {
        isUcp: priceDetails?.priceDetails?.isUcp,
        totalValue: this.currencyRoundOff(priceDetails.finalValue),
        weightUnit: this.weightCode,
        weight: priceDetails?.stdWeight
      }
    );
    if (priceDetails.productGroupCode === this.coinCode) {
      this.productType = ProductTypesEnum.COINS;
    } else {
      this.productType = ProductTypesEnum.REGULAR;
    }
    this.itemDetailPopupservice.open({
      title: priceDetails?.lotNumber
        ? this.priceDetailsTitle
        : this.stdPriceDetailsTitle,
      tabs: [
        ItemDetailsPopupTabType.PRICE_DETAILS,
        ItemDetailsPopupTabType.STONE_DETAILS
      ],
      currencyCode: this.currencyCode,
      weightUnit: this.weightCode,
      headerDetails: {
        showTitle: false,
        itemCode: priceDetails?.itemCode,
        lotNumber: priceDetails?.lotNumber ? priceDetails?.lotNumber : '-',
        productCategory: priceDetails?.productCategoryCode,
        productGroup: priceDetails?.productGroupCode,
        grossWeight: priceDetails?.stdWeight,
        netWeight: priceDetails?.priceDetails?.netWeight,
        goldRate: goldRate,
        platinumRate: platinumRate,
        silverRate: silverRate,
        isCOMOrder: priceDetails?.lotNumber ? false : true
      },
      priceBreakup: priceResult
    });
  }

  currencyRoundOff(amount: any) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  ngOnDestroy() {
    while (this.parentForm.length !== 0) {
      this.parentForm.clear();
    }
    this.conversionFacade.resetSelectedRequestData();
    this.destroy$.next();
    this.destroy$.complete();
  }
  trackBy(_: number, item: ConversionRequestItems) {
    return item.inventoryId;
  }
}
