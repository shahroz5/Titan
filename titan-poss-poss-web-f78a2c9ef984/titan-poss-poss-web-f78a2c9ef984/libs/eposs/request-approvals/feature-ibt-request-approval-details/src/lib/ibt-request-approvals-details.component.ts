import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  Command,
  ShortcutServiceAbstraction,
  RequestApprovalsAPITypesEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  RequestApprovals,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { RequestApprovalsFacade } from '@poss-web/eposs/request-approvals/data-access-request-approvals';
import { takeUntil, take, withLatestFrom } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { TranslateService } from '@ngx-translate/core';

import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { FormGroup, FormBuilder } from '@angular/forms';
import { getIbtRequestApprovalsRouteUrl } from '@poss-web/shared/util-site-routes';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
const BACK_SHORTCUT_KEY = 'IbtRequestApprovalsDetailsComponent.BACK';
const SELECT_ALL_KEY = 'IbtRequestApprovalsDetailsComponent.SELECT_ALL';
const CLEAR_ALL_KEY = 'IbtRequestApprovalsDetailsComponent.CLEAR_ALL';
const componentName = 'IbtRequestApprovalsDetailsComponent';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poss-web-ibt-request-approvals-details',
  templateUrl: './ibt-request-approvals-details.component.html'
})
export class IbtRequestApprovalsDetailsComponent implements OnInit, OnDestroy {
  item: any;
  requestId: any;
  type: string;
  id: number;
  pageIndex = 0;
  pageSizeOptions: number[] = [];
  hasNotification: boolean;
  approvalsTransferForm: FormGroup;
  initailPageEvent: PageEvent = {
    pageIndex: this.pageIndex,
    pageSize: 50,
    length: 0
  };
  isSelectedArray: string[] = [];
  pageSize = 4;
  Items$: Observable<any>;
  items: any;
  isSelectAll = false;
  itemsPageEvent: PageEvent = this.initailPageEvent;
  ibtRequestApprovalsItemsCount$: Observable<any>;
  isItemsLoading: boolean;
  updateItemListStatusResponse$: Observable<RequestApprovals>;
  selectionAllSubject: Subject<any> = new Subject<any>();
  loading$: Observable<boolean>;
  selectedArrayCount: number;
  destroy$: Subject<null> = new Subject<null>();
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  constructor(
    private router: Router,
    private appSettingFacade: AppsettingFacade,
    private dialog: MatDialog,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private activatedRoute: ActivatedRoute,
    private facade: RequestApprovalsFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private commonFacade: CommonFacade
  ) {
    this.shortcutService.componentNames = [componentName];
    this.commonFacade.loadImageCatalogueDetails();
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
    this.approvalsTransferForm = this.formBuilder.group({
      selectItems: ['']
    });
  }

  ngOnInit() {
    this.isLoadingImage$ = this.facade.getIsLoadingImage();
    this.facade.loadStuddedProductGroups();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number[]) => {
        this.pageSizeOptions = data;
      });
    this.facade.resetError();
    this.facade.resetUpdate();
    this.requestId = this.activatedRoute.snapshot.params['_id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    this.facade.resetRequestApprovalsItemCount();
    this.facade.resetRequestApprovalsItem();
    this.facade.loadIbtRequestApprovalsItemsCount({
      requestType: 'BTQ',
      id: this.requestId
    });
    this.facade
      .getSelectedRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: RequestApprovals) => {
        if (data) {
          this.item = data;
        } else {
        }
      });
    this.ibtRequestApprovalsItemsCount$ = this.facade.getIbtCount();
    this.ibtRequestApprovalsItemsCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.selectedArrayCount = data;
      });
    this.Items$ = this.facade.getIbtRequestItems();
    this.InterBoutiqueTransferStatusRequestNotifications();
    this.facade.loadSelectedRequest({
      id: this.requestId,
      requestType: 'BTQ'
    });

    this.Items$
      .pipe(
        withLatestFrom( this.commonFacade.getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.INVENTORY,
          CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
        )),
        takeUntil(this.destroy$)
      )
      .subscribe(([data, imageCatalogueDetails]) => {
        this.items = data;
        if (this.items.length !== 0) {
          if (this.isLoadImageUrl && data.length > 0 && imageCatalogueDetails)
            this.loadImage(data, imageCatalogueDetails);
          this.InterBoutiqueTransferStatusRequestNotifications();
        }
      });

    this.facade
      .getIbt()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.facade.clearItemList();
          this.resetValue();

          if (data.status) {
            this.InterBoutiqueTransferStatusNotifications(data.status);
          }
        }
      });
    this.Items$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      if (this.approvalsTransferForm.value.selectItems === '1') {
        this.isSelectAll = true;
        this.selectionAllSubject.next({
          selectCheckbox: true,
          enableCheckbox: false
        });
      }
    });
    this.id = this.requestId;
    this.loading$ = this.facade.getIsLoading();

    this.initialLoad();

    this.facade
      .getIsIbtRequestApprovalsItemsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.isItemsLoading = data;
      });

    this.facade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });

    this.facade
      .getHasUpdatingApprovalsFailure()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  shortcutEventHandler(command: Command): void {
    switch (command.name) {
      case BACK_SHORTCUT_KEY: {
        this.dialog.closeAll();
        this.back();
        break;
      }

      case SELECT_ALL_KEY: {
        this.approvalsTransferForm.patchValue({
          selectItems: '1'
        });
        this.selectAll();

        break;
      }

      case CLEAR_ALL_KEY: {
        this.clearAll();
        break;
      }
    }
  }

  initialLoad() {
    this.isLoadImageUrl = true;
    this.facade.loadIbtRequestItems({
      id: this.id,
      requestType: RequestApprovalsAPITypesEnum.BTQ,
      pageIndex: this.pageIndex,
      pageSize: this.initailPageEvent.pageSize,
      isSelectedArray: []
    });
  }

  clearAll() {
    this.isSelectAll = false;
    this.isSelectedArray = [];
    this.approvalsTransferForm.patchValue({
      selectItems: null
    });
    this.selectionAllSubject.next({
      selectCheckbox: false,
      enableCheckbox: true
    });
    this.InterBoutiqueTransferStatusRequestNotifications();
  }

  isSelect(event) {
    if (event.isSelected) {
      this.isSelectedArray = [...this.isSelectedArray, event.id];
    } else {
      const valueToRemove = event.id;
      this.isSelectedArray = this.isSelectedArray.filter(
        item => item !== valueToRemove
      );
    }

    if (this.isSelectedArray.length === this.selectedArrayCount) {
      this.approvalsTransferForm.get('selectItems').setValue('1');

      this.selectChange();
    }

    if (this.isSelectedArray.length !== 0) {
      this.InterBoutiqueTransferStatusRequestNotifications();
    }
  }

  selectChange() {
    if (this.approvalsTransferForm.value.selectItems === '1') {
      this.selectAll();
    }
  }

  selectAll() {
    this.isSelectAll = true;
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: false
    });
    this.InterBoutiqueTransferStatusRequestNotifications();
  }

  errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event1: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        if (event1.eventType === OverlayNotificationEventType.CLOSE) {
          this.InterBoutiqueTransferStatusRequestNotifications();
        }
      });
  }

  InterBoutiqueTransferStatusRequestNotifications() {
    const key = 'pw.interBoutiqueTransferNotifications.acceptRejectMsg';
    const buttonKey1 = 'pw.instock.acceptButtonText';
    const buttonKey2 = 'pw.instock.rejectButtonText';
    this.hasNotification = true;

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
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.selectedId === 1) {
              if (this.isSelectAll === false) {
                if (this.isSelectedArray.length !== 0) {
                  const acceptStatus = {
                    id: this.requestId,
                    requestType: 'BTQ',

                    requestUpdateDto: {
                      itemIds: this.isSelectedArray,
                      remarks: event.data,
                      status: 'APPROVED'
                    }
                  };
                  this.facade.updateIbtSucess(acceptStatus);
                } else {
                  this.InterBoutiqueTransferErrorNotifications();
                }
              } else {
                const acceptStatus = {
                  id: this.requestId,
                  requestType: 'BTQ',

                  requestUpdateDto: {
                    itemIds: [],
                    remarks: event.data,
                    status: 'APPROVED'
                  }
                };
                this.facade.updateIbtSucess(acceptStatus);
              }
            }
            if (event.selectedId === 2) {
              const rejectStatus = {
                id: this.requestId,
                requestType: 'BTQ',
                requestUpdateDto: {
                  itemIds: [],
                  remarks: event.data,
                  status: 'APVL_REJECTED'
                }
              };
              this.facade.updateIbtSucess(rejectStatus);
            }
          });
      });
  }

  InterBoutiqueTransferStatusNotifications(status: string) {
    this.hasNotification = true;
    console.log(status);
    let key;
    if (status === 'APPROVED') {
      key = 'pw.interBoutiqueTransferNotifications.approveNotifications';
    } else {
      key = 'pw.interBoutiqueTransferNotifications.rejectNotifications';
    }
    let statusKey = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      statusKey = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key, statusKey.status])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessages[key],

            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }

  InterBoutiqueTransferErrorNotifications() {
    const key =
      'pw.interBoutiqueTransferNotifications.selectItemsNotifications';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.InterBoutiqueTransferStatusRequestNotifications();
            }
          });
      });
  }

  resetValue() {
    this.isSelectedArray = [];
  }

  paginateItems(event: PageEvent) {
    this.itemsPageEvent = event;
    this.loadIbtApprovals();
  }

  loadIbtApprovals() {
    this.isLoadImageUrl = true;
    this.facade.loadIbtRequestItems({
      id: this.id,
      requestType: RequestApprovalsAPITypesEnum.BTQ,
      pageIndex: this.itemsPageEvent.pageIndex,
      pageSize: this.itemsPageEvent.pageSize,
      isSelectedArray: this.isSelectedArray
    });
  }

  back() {
    this.router.navigate([getIbtRequestApprovalsRouteUrl()]);
  }

  // Image
  loadImage(itemList, imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if(item.imageURL !== null && item.imageURL !== undefined){
        this.facade.loadThumbnailImageUrl({
          id: item.id.toString(),
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
          this.facade.loadImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails,
          });
        }
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
