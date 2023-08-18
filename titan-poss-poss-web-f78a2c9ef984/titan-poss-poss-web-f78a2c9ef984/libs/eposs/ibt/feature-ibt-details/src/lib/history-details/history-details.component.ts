import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';

import {
  RequestList,
  ItemList,
  IsSelectedItemCode,
  InterBoutiqueTransferRequestTypesEnum,
  InterBoutiqueTransferStatusTypesEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  IBThistoryHeaderPayload,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  Command,
  ShortcutServiceAbstraction,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';

import { InterBoutiqueTransferFacade } from '@poss-web/eposs/ibt/data-access-ibt';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { getInterBoutiqueTransferRouteUrl } from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

const backShortcutKey = 'InterBoutiqueTransferHistoryDetailsComponent.BACK';
const componentName = 'InterBoutiqueTransferHistoryDetailsComponent';
@Component({
  selector: 'poss-web-history-details',
  templateUrl: './history-details.component.html'
})
export class HistoryDetailsComponent implements OnInit, OnDestroy {
  interBoutiqueTransferRequestTypesEnumRef = InterBoutiqueTransferRequestTypesEnum;

  request$: Observable<RequestList>;
  itemList$: Observable<ItemList[]>;
  item: IBThistoryHeaderPayload;
  updateItemListStatusResponse$: Observable<RequestList>;

  isSelectedArray: string[] = [];
  isSelectedItemCodeArray: string[] = [];
  selectedRequest: RequestList;
  requestId: number;
  requestType: string;
  status: string;
  statusColor: string;
  selectedRequestStatus: string;

  hasNotification = false;
  isLoading = false;

  selectedItemCode$: Subject<IsSelectedItemCode> = new Subject<
    IsSelectedItemCode
  >();
  selectedItemCodeObservable = this.selectedItemCode$.asObservable();
  dateFormat$: Observable<string>;
  destroy$: Subject<null> = new Subject<null>();
  btqReqType: string;
  actionTypeParam: string;
  statusEnumRef = InterBoutiqueTransferStatusTypesEnum;
  noDataFoundMessage: string;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private interBoutiqueTransferFacade: InterBoutiqueTransferFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private appsettingFacade: AppsettingFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.translate
      .get(['pw.entity.productEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.productEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessage: string) => {
            this.noDataFoundMessage =
              translatedMessage['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.requestId = this.activatedRoute.snapshot.params['_requestId'];
    this.requestType = this.activatedRoute.snapshot.params['requestType'];
    this.btqReqType = this.activatedRoute.snapshot.params['actionType'];
    this.interBoutiqueTransferFacade
      .getHasSelectedHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasData: boolean) => {
        if (hasData === true) {
          this.loadHistoryItems();
        }
      });
    if (this.btqReqType === InterBoutiqueTransferRequestTypesEnum.SENT)
      this.actionTypeParam = InterBoutiqueTransferRequestTypesEnum.RECEIVE;
    else this.actionTypeParam = InterBoutiqueTransferRequestTypesEnum.ISSUE;

    this.interBoutiqueTransferFacade.loadSelectedHistory({
      id: this.requestId,
      actionType: this.actionTypeParam
    });

    this.itemList$ = this.interBoutiqueTransferFacade.getItemList();
    this.isLoadingImage$ = this.interBoutiqueTransferFacade.getIsLoadingImage();
    this.interBoutiqueTransferFacade.loadItemList({
      id: this.requestId,
      requestGroup: this.btqReqType.toUpperCase()
    });
    this.interBoutiqueTransferFacade.loadStuddedProductGroups();
    this.componentInit();
  }

  componentInit() {
    this.interBoutiqueTransferFacade
      .getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });
    this.interBoutiqueTransferFacade
      .getSelectedHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item: IBThistoryHeaderPayload) => {
        if (item) {
          this.item = item;
        }
      });
    this.interBoutiqueTransferFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.dateFormat$ = this.appsettingFacade.getDateFormat();

    this.shortcutService.componentNames = [componentName]; 
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });

    this.itemList$
      .pipe(
        withLatestFrom( this.commonFacade.getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.INVENTORY,
          CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
        )),
        takeUntil(this.destroy$)
      )
      .subscribe(([itemList, imageCatalogueDetails]) => {
        if (itemList.length !== 0) {
          if (this.isLoadImageUrl && itemList.length > 0 && imageCatalogueDetails)
            this.loadImage(itemList, imageCatalogueDetails);
        }
      });
  }

  loadHistoryItems() {
    this.isLoadImageUrl = true;
    this.interBoutiqueTransferFacade.loadHistoryItems({
      historyItemsData: {
        binCodes: [null],
        binGroupCode: null,
        itemCode: null,
        lotNumber: null,
        productCategories: [null],
        productGroups: [null]
      },
      requestType: this.requestType,
      page: 0,
      size: 0,
      value: this.requestId,
      actionType: this.actionTypeParam
    });
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

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    if (command.name === backShortcutKey) {
      this.back();
    }
  }

  /**
   * to display error message
   * @param error : error from api
   */
  private errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        this.showNotification();
      });
  }

  private showNotification() {
    this.overlayNotification.close();
    this.hasNotification = false;
  }

  /**
   * to go back to previous page
   */
  back() {
    this.router.navigate([getInterBoutiqueTransferRouteUrl(this.requestType)], {
      state: { clearFilter: false }
    });
  }

  // Image
  loadImage(itemList: ItemList[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if(item.imageURL !== null && item.imageURL !== undefined){
        this.interBoutiqueTransferFacade.loadThumbnailImageUrl({
          id: item.id,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails
        });
      }
    });
  }

  loadImageUrl(event) {
    this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.INVENTORY,
      CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
    )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        if(event.imageUrl !== null && event.imageUrl !== undefined){
          this.interBoutiqueTransferFacade.loadImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails
          });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
