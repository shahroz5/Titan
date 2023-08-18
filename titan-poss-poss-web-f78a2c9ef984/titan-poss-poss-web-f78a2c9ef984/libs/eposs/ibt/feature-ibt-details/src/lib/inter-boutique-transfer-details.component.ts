import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take, withLatestFrom } from 'rxjs/operators';

import {
  RequestList,
  ItemList,
  IsSelectedItemCode,
  InterBoutiqueTransferRequestTypesEnum,
  InterBoutiqueTransferStatusTypesEnum,
  IsSelectedData,
  CustomErrors,
  IsSelectedItem,
  OverlayNotificationServiceAbstraction,
  Command,
  ShortcutServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';
import { InterBoutiqueTransferFacade } from '@poss-web/eposs/ibt/data-access-ibt';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { getInterBoutiqueTransferRouteUrl } from '@poss-web/shared/util-site-routes';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

const backShortcutKey = 'InterBoutiqueTransferDetailsComponent.BACK';
const componentName = 'InterBoutiqueTransferDetailsComponent';

@Component({
  selector: 'poss-web-inter-boutique-transfer-details',
  templateUrl: './inter-boutique-transfer-details.component.html',
  styleUrls: ['./inter-boutique-transfer-details.component.scss']
})
export class InterBoutiqueTransferDetailsComponent
  implements OnInit, OnDestroy {
  interBoutiqueTransferRequestTypesEnumRef = InterBoutiqueTransferRequestTypesEnum;

  request$: Observable<RequestList>;
  itemList$: Observable<ItemList[]>;
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
  noDataFoundMessage: string;
  isLoadingImage$: Observable<boolean>;
  isLoadImageUrl: boolean;

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
  }

  ngOnInit() {
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
    this.interBoutiqueTransferFacade.resetRequestList();
    this.requestId = this.activatedRoute.snapshot.params['_requestId'];
    this.requestType = this.activatedRoute.snapshot.params['requestType'];
    this.interBoutiqueTransferFacade.loadRequest({
      id: this.requestId,
      requestGroup: this.requestType.toUpperCase()
    });
    this.interBoutiqueTransferFacade.loadStuddedProductGroups();
    this.componentInit();
  }

  componentInit() {
    this.request$ = this.interBoutiqueTransferFacade.getRequest();
    this.itemList$ = this.interBoutiqueTransferFacade.getItemList();
    this.updateItemListStatusResponse$ = this.interBoutiqueTransferFacade.updateSelectedRequestProductListStatusResponse();

    this.interBoutiqueTransferFacade
      .getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });

    this.isLoadingImage$ = this.interBoutiqueTransferFacade.getIsLoadingImage();

    this.interBoutiqueTransferFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.request$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.selectedRequest = data;
        this.selectedRequestStatus = data.status;
        this.isLoadImageUrl = true;
        this.interBoutiqueTransferFacade.loadItemList({
          id: this.requestId,
          requestGroup: this.requestType.toUpperCase()
        });
      }
    });

    this.itemList$.pipe(
      withLatestFrom(
        this.commonFacade.getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.INVENTORY,
          CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe(([data, imageCatalogueDetails]) => {
      if (data.length !== 0) {
        switch (this.requestType) {
          case InterBoutiqueTransferRequestTypesEnum.SENT: {
            if (this.getCancelStatus(this.selectedRequestStatus)) {
              this.interBoutiqueTransferCancelNotifications();
            }
            break;
          }
          case InterBoutiqueTransferRequestTypesEnum.RECEIVED: {
            switch (this.selectedRequestStatus) {
              case InterBoutiqueTransferStatusTypesEnum.REQUESTED: {
                this.interBoutiqueTransferAcceptRejectNotifications();
                break;
              }
              case InterBoutiqueTransferStatusTypesEnum.APVL_PENDING: {
                this.interBoutiqueTransferCancelNotifications();
                break;
              }
            }
            break;
          }
        }
        if (this.isLoadImageUrl && data.length > 0 && imageCatalogueDetails)
          this.loadImage(data, imageCatalogueDetails);
      }
    });

    this.updateItemListStatusResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null && data.status) {
          this.interBoutiqueTransferStatusNotifications(data);
        }
      });
    this.dateFormat$ = this.appsettingFacade.getDateFormat();

    this.shortcutService.componentNames = [componentName]; 
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
  }

  isSelectedChange(event: IsSelectedData) {
    if (event.isSelected) {
      if (this.isSelectedItemCodeArray.includes(event.itemCode)) {
        this.selectedItemCode$.next({
          isSelected: false,
          itemId: event.itemId
        });
      } else {
        this.isSelectedArray.push(event.itemId);
        this.isSelectedItemCodeArray.push(event.itemCode);
        this.interBoutiqueTransferFacade.updateItemList({
          id: this.requestId,
          itemId: event.itemId,
          requestGroup: this.requestType.toUpperCase(),
          data: {
            quantity: event.quantity,
            status: InterBoutiqueTransferStatusTypesEnum.ACCEPTED
          }
        });
      }
    } else {
      this.isSelectedArray.splice(
        this.isSelectedArray.indexOf(event.itemId),
        1
      );
      this.isSelectedItemCodeArray.splice(
        this.isSelectedItemCodeArray.indexOf(event.itemCode),
        1
      );
      this.interBoutiqueTransferFacade.updateItemList({
        id: this.requestId,
        itemId: event.itemId,
        requestGroup: this.requestType.toUpperCase(),
        data: {
          quantity: event.quantity,
          status: InterBoutiqueTransferStatusTypesEnum.ACPT_REJECTED
        }
      });
    }
  }

  /**
   * Notification overlay for accept and reject
   */
  interBoutiqueTransferAcceptRejectNotifications() {
    const key = 'pw.interBoutiqueTransferNotifications.acceptRejectMsg';
    const buttonKey1 = 'pw.instock.acceptButtonText';
    const buttonKey2 = 'pw.instock.rejectButtonText';
    this.translate
      .get([key, buttonKey1, buttonKey2])
      .pipe(take(1))
      .subscribe((translatedMessages: any) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.MULTI_ACTION,
            message: translatedMessages[key],
            buttons: [
              {
                id: 1,
                text: translatedMessages[buttonKey1],
                css: 'pw-accent-btn',
                hasRemarksValidation: true
              },
              {
                id: 2,
                text: translatedMessages[buttonKey2],
                css: 'pw-primary-btn',
                hasRemarksValidation: true
              }
            ],
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            this.showProgressNotification();
            switch (event.selectedId) {
              case 1: {
                if (this.isSelectedArray.length !== 0) {
                  const acceptRequest = {
                    type: InterBoutiqueTransferStatusTypesEnum.ACCEPTED,
                    id: this.requestId,
                    requestGroup: this.requestType.toUpperCase(),
                    itemIds: this.isSelectedArray,
                    remarks: event.data
                  };
                  this.interBoutiqueTransferFacade.updateItemListStatus(
                    acceptRequest
                  );
                  this.resetValue();
                } else {
                  this.interBoutiqueTransferErrorNotifications();
                }
                break;
              }
              case 2: {
                const rejectRequest = {
                  type: InterBoutiqueTransferStatusTypesEnum.ACPT_REJECTED,
                  id: this.requestId,
                  requestGroup: this.requestType.toUpperCase(),
                  itemIds: [],
                  remarks: event.data
                };
                this.interBoutiqueTransferFacade.updateItemListStatus(
                  rejectRequest
                );
                break;
              }
            }
          });
      });
  }

  /**
   * Notification overlay for cancel request
   */
  interBoutiqueTransferCancelNotifications() {
    const buttonKey = 'pw.interboutiqueTransfer.cancelRequestButtonText';
    this.translate
      .get([buttonKey])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: '',
            buttonText: translatedMessages[buttonKey],
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            this.showProgressNotification();
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              let type = '';
              switch (this.requestType) {
                case InterBoutiqueTransferRequestTypesEnum.SENT: {
                  type = InterBoutiqueTransferStatusTypesEnum.CANCELLED;
                  break;
                }
                case InterBoutiqueTransferRequestTypesEnum.RECEIVED: {
                  type = InterBoutiqueTransferStatusTypesEnum.ISSUE_REJECTED;
                  break;
                }
              }

              const cancelRequest = {
                type: type,
                id: this.requestId,
                requestGroup: this.requestType.toUpperCase(),
                itemIds: [],
                remarks: event.data
              };

              this.interBoutiqueTransferFacade.updateItemListStatus(
                cancelRequest
              );
            }
          });
      });
  }

  /**
   * Notification overlay for status
   * @param status: status of request
   */
  interBoutiqueTransferStatusNotifications(request: RequestList) {
    const approveIssueKey =
      'pw.interBoutiqueTransferNotifications.acceptIssueNotificationMessages';
    const key1 =
      'pw.interBoutiqueTransferNotifications.requestNotificationMesssage1';
    const key2 =
      'pw.interBoutiqueTransferNotifications.requestNotificationMesssage2';
    const key3 =
      'pw.interBoutiqueTransferNotifications.requestNotificationMesssage3';
    const key4 =
      'pw.interBoutiqueTransferNotifications.requestNotificationMesssage4';
    const rejectedMessageKey =
      'pw.interBoutiqueTransferNotifications.rejectedMessageNotifications';
    let statusKey = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(request.status)) {
      statusKey = commonTranslateKeyMap.get(request.status);
    }
    this.translate
      .get([
        key1,
        key2,
        key3,
        key4,
        approveIssueKey,
        statusKey.status,
        rejectedMessageKey
      ])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.hasNotification = true;
        let message = '';
        switch (this.requestType) {
          case InterBoutiqueTransferRequestTypesEnum.SENT: {
            message = translatedMessages[key2] + request.srcLocationCode;
            break;
          }
          case InterBoutiqueTransferRequestTypesEnum.RECEIVED: {
            message = translatedMessages[key3] + request.destLocationCode;
            break;
          }
        }
        switch (request.status) {
          case InterBoutiqueTransferStatusTypesEnum.APPROVED: {
            this.overlayNotification
              .show({
                type: OverlayNotificationType.SIMPLE,
                message:
                  translatedMessages[key1] +
                  request.reqDocNo +
                  message +
                  translatedMessages[key4] +
                  translatedMessages[statusKey.status] +
                  translatedMessages[approveIssueKey],
                hasBackdrop: true,
                hasClose: true
              })
              .events.pipe(take(1))
              .subscribe((acceptEvent: OverlayNotificationEventRef) => {
                this.hasNotification = false;
                if (
                  acceptEvent.eventType === OverlayNotificationEventType.CLOSE
                ) {
                  this.back();
                }
              });
            break;
          }
          case InterBoutiqueTransferStatusTypesEnum.ACPT_REJECTED: {
            this.overlayNotification
              .show({
                type: OverlayNotificationType.SIMPLE,
                message:
                  translatedMessages[key1] +
                  request.reqDocNo +
                  message +
                  translatedMessages[key4] +
                  translatedMessages[rejectedMessageKey],
                hasBackdrop: true,
                hasClose: true
              })
              .events.pipe(take(1))
              .subscribe((rejectEvent: OverlayNotificationEventRef) => {
                this.hasNotification = false;
                if (
                  rejectEvent.eventType === OverlayNotificationEventType.CLOSE
                ) {
                  this.back();
                }
              });
            break;
          }
          default: {
            this.overlayNotification
              .show({
                type: OverlayNotificationType.SIMPLE,
                message:
                  translatedMessages[key1] +
                  request.reqDocNo +
                  message +
                  translatedMessages[key4] +
                  translatedMessages[statusKey.status],
                hasBackdrop: true,
                hasClose: true
              })
              .events.pipe(take(1))
              .subscribe((defaultEvent: OverlayNotificationEventRef) => {
                this.hasNotification = false;
                if (
                  defaultEvent.eventType === OverlayNotificationEventType.CLOSE
                ) {
                  this.back();
                }
              });
            break;
          }
        }
      });
  }

  interBoutiqueTransferErrorNotifications() {
    const key =
      'pw.interBoutiqueTransferNotifications.selectItemsNotifications';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.interBoutiqueTransferAcceptRejectNotifications();
            }
          });
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

  getCancelStatus(status: string): boolean {
    switch (status) {
      case InterBoutiqueTransferStatusTypesEnum.REQUESTED:
      case InterBoutiqueTransferStatusTypesEnum.ACCEPTED:
      case InterBoutiqueTransferStatusTypesEnum.APPROVED:
      case InterBoutiqueTransferStatusTypesEnum.APVL_PENDING:
        return true;
      case InterBoutiqueTransferStatusTypesEnum.ACPT_REJECTED:
      case InterBoutiqueTransferStatusTypesEnum.APVL_REJECTED:
      case InterBoutiqueTransferStatusTypesEnum.ISSUE_REJECTED:
      case InterBoutiqueTransferStatusTypesEnum.CANCELLED:
      case InterBoutiqueTransferStatusTypesEnum.EXPIRED:
      case InterBoutiqueTransferStatusTypesEnum.ISSUED:
        return false;
      default:
        return false;
    }
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
  errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    if (error.code === ErrorEnums.ERR_INV_013) {
      let cancelStatusErrorMessageKey = '';
      switch (this.requestType) {
        case InterBoutiqueTransferRequestTypesEnum.SENT: {
          cancelStatusErrorMessageKey =
            'pw.interBoutiqueTransferNotifications.cancelStatusMessage2';
          break;
        }
        case InterBoutiqueTransferRequestTypesEnum.RECEIVED: {
          cancelStatusErrorMessageKey =
            'pw.interBoutiqueTransferNotifications.cancelStatusMessage1';
          break;
        }
      }

      this.translate
        .get(cancelStatusErrorMessageKey)
        .pipe(take(1))
        .subscribe((translatedMessage: string) => {
          this.overlayNotification
            .show({
              type: OverlayNotificationType.SIMPLE,
              hasClose: true,
              message: translatedMessage,
              hasBackdrop: true
            })
            .events.pipe(take(1))
            .subscribe((cancelEvent: OverlayNotificationEventRef) => {
              this.hasNotification = false;
              if (
                cancelEvent.eventType === OverlayNotificationEventType.CLOSE
              ) {
                this.back();
              }
            });
        });
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          this.hasNotification = false;
          if (event.eventType === OverlayNotificationEventType.CLOSE) {
            switch (this.requestType) {
              case InterBoutiqueTransferRequestTypesEnum.SENT: {
                if (this.getCancelStatus(this.selectedRequestStatus)) {
                  this.interBoutiqueTransferCancelNotifications();
                }
                break;
              }
              case InterBoutiqueTransferRequestTypesEnum.RECEIVED: {
                switch (this.selectedRequestStatus) {
                  case InterBoutiqueTransferStatusTypesEnum.REQUESTED: {
                    this.interBoutiqueTransferAcceptRejectNotifications();
                    break;
                  }
                  case InterBoutiqueTransferStatusTypesEnum.APVL_PENDING: {
                    this.interBoutiqueTransferCancelNotifications();
                    break;
                  }
                }
                break;
              }
            }
          }
        });
    }
  }

  isSelectedItemChange(event: IsSelectedItem) {
    this.isSelectedItemCodeArray.push(event.itemCode);
    this.isSelectedArray.push(event.itemId);
  }

  showProgressNotification(): void {
    const key = 'pw.stockReceiveNotificationMessages.progressMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }

  /**
   * to go back to previous page
   */
  back() {
    this.router.navigate([getInterBoutiqueTransferRouteUrl(this.requestType)]);
  }

  /**
   * to reset values when component loads
   */
  resetValue() {
    this.isSelectedArray = [];
    this.isSelectedItemCodeArray = [];
  }

  // Image
  loadImage(itemList: ItemList[], imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      console.log('Image - item', item);
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
    this.commonFacade
      .getCommonFacadeAttributes(
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
