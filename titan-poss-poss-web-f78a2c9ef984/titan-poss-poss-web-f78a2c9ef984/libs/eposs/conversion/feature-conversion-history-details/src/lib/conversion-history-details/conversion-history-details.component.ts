import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversionFacade } from '@poss-web/eposs/conversion/data-access-conversion';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  Command,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConversionHistory,
  ConversionHistoryItems,
  CustomErrors,
  InStockConversionTypesEnum,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { combineLatest, Observable, Subject } from 'rxjs';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';

const backShortcutKey = 'ConversionDetailsComponent.BACK';

@Component({
  selector: 'poss-web-conversion-history-details',
  templateUrl: './conversion-history-details.component.html'
})
export class ConversionHistoryDetailsComponent implements OnInit, OnDestroy {
  storeType: string;
  id: number;
  isL1L2Store: boolean;
  isL3Store: boolean;
  childItems: ConversionHistoryItems[] = [];
  parentItem: ConversionHistoryItems = null;
  hasNotification = false;
  InStockConversionTypesEnumRef = InStockConversionTypesEnum;

  destroy$: Subject<null> = new Subject<null>();

  @ViewChild('rsoDropdown', { read: ElementRef })
  rsoDropdown: ElementRef;
  requestType: string;
  selectedRequest: ConversionHistory;
  isHistoryLoading$: Observable<boolean>;

  isShowingErrorNotifcation = false;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  constructor(
    private conversionFacade: ConversionFacade,
    private activatedRoute: ActivatedRoute,
    private profiledatafacade: ProfileDataFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
  }

  ngOnInit() {
    this.isLoadingImage$ = this.conversionFacade.getIsLoadingImage();

    this.id = this.activatedRoute.snapshot.params['_id'];
    this.requestType = this.activatedRoute.snapshot.params['requestType'];

    this.conversionFacade.loadStuddedProductGroups();
    this.conversionFacade.resetError();
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });

    this.isHistoryLoading$ = this.conversionFacade.getIsLoadingHistory();
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
        this.componentInit();
      });
  }

  componentInit() {
    this.conversionFacade.loadSelectedRequestHistory(this.id, this.requestType);
    this.conversionFacade
      .getSelectedRequestHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedRequestHistory: ConversionHistory) => {
        if (selectedRequestHistory) {
          this.selectedRequest = selectedRequestHistory;
          this.loadItems();
        }
      });
    this.conversionFacade
      .getConversionHistoryItems()
      .pipe(
        withLatestFrom(
          this.commonFacade.getCommonFacadeAttributes(
            CommomStateAttributeTypeEnum.INVENTORY,
            CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([data, imageCatalogueDetails]) => {
        if (data) {
          this.childItems = [];
          for (const item of data) {
            if (
              item.itemDetails.itemType === InStockConversionTypesEnum.Parent
            ) {
              this.parentItem = item;
            } else {
              this.childItems.push(item);
            }
          }
          if (this.isLoadImageUrl && data.length > 0 && imageCatalogueDetails)
            this.loadImage(data, imageCatalogueDetails);
        }
      });
    this.conversionFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  shortcutEventHandler(command: Command) {
    if (command.name === backShortcutKey) {
      this.back();
    }
  }
  loadItems() {
    this.isLoadImageUrl = true;
    this.conversionFacade.loadConversionHistoryItems({
      historyItemsPaylod: {
        binCodes: [null],
        binGroupCode: null,
        itemCode: null,
        lotNumber: null,
        productCategories: [null],
        productGroups: [null]
      },
      id: this.id,
      pageIndex: 0,
      pageSize: 8,
      requestType: this.requestType,
      preTransactionId: this.selectedRequest.prevTransaction
        ? this.selectedRequest.prevTransaction
        : null,
      childItems: this.selectedRequest?.otherDetails?.data?.childItems
        ? this.selectedRequest?.otherDetails?.data?.childItems
        : []
    });
  }

  // Image
  loadImage(itemList: ConversionHistoryItems[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if (item.imageURL !== null && item.imageURL !== undefined) {
        this.conversionFacade.loadHistoryThumbnailImageUrl({
          id: item.id,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails
        });
      }
    });
  }

  loadImageUrl(event) {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.INVENTORY,
        CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
      )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        if (event.imageUrl !== null && event.imageUrl !== undefined) {
          this.conversionFacade.loadHistoryImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails
          });
        }
      });
  }
  back() {
    this.conversionFacade.resetConversionHistory();
    this.router.navigate(
      ['inventory/instock/conversion/history', this.requestType],
      { state: { clearFilter: false } }
    );
  }

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */

  errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackBy(_: number, item: ConversionHistoryItems) {
    return item.id;
  }
}
