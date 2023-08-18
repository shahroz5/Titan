import {
  RequestApprovalEnum,
  SelectedStockPayload,
  RequestApprovalsItems,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  Command,
  ShortcutServiceAbstraction,
  RequestApprovals,
  RequestApprovalsAPITypesEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { StockReceiveFacade } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { RequestApprovalsFacade } from '@poss-web/eposs/request-approvals/data-access-request-approvals';
import { takeUntil, take, withLatestFrom } from 'rxjs/operators';
import {
  Filter,
  FilterService
} from '@poss-web/shared/components/ui-filter-dialog';
import {
  Column,
  SortDialogService
} from '@poss-web/shared/components/ui-sort-dialog';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  ItemSearchResponse,
  ItemSearchComponent
} from '@poss-web/shared/item/ui-item-search';
import { getOtherIssuesRequestRouteUrl } from '@poss-web/shared/util-site-routes';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

const BACK_SHORTCUT_KEY = 'OtherIssuesApprovalsDetailComponent.BACK';
const SELECT_ALL_SHORTCUT_KEY =
  'OtherIssuesApprovalsDetailComponent.SELECT_ALL';
const SELECT_CURRENT_PAGE_KEY =
  'OtherIssuesApprovalsDetailComponent.SELECT_CURRENT_PAGE';
const FILTER_POPUP_KEY = 'OtherIssuesApprovalsDetailComponent.FILTER';
const SORT_POPUP_KEY = 'OtherIssuesApprovalsDetailComponent.SORT';
const SEARCH_KEY = 'OtherIssuesApprovalsDetailComponent.MAIIN_SEARCH';
const CLEAR_ALL_SHORTCUT_KEY = 'OtherIssuesApprovalsDetailComponent.CLEAR_ALL';
const componentName = 'OtherIssuesApprovalsDetailComponent';
@Component({
  selector: 'poss-web-other-issues-approvals-detail',
  templateUrl: './other-issues-approvals-detail.component.html',
  styleUrls: ['./other-issues-approvals-detail.component.scss']
})
export class OtherIssuesApprovalsDetailComponent implements OnInit, OnDestroy {
  items: RequestApprovalsItems[];
  pageSizeOptions: number[] = [];
  item: any;
  requestId: any;
  tab: string;
  type: string;
  requestAppType = RequestApprovalsAPITypesEnum;
  id: number;
  pageIndex = 0;
  hasNotification: boolean;
  initailPageEvent: PageEvent = {
    pageIndex: this.pageIndex,
    pageSize: 0,
    length: 0
  };
  ids: any[];
  itemIds: any[];
  header: string;
  isSelectedArray: string[] = [];
  pageSize = 4;
  Items$: Observable<any>;
  payload: SelectedStockPayload;
  status: string;
  sendSelectCurrentEvent = true;
  approvalsTransferForm: FormGroup;
  itemCode: string;
  itemsPageEvent: PageEvent = this.initailPageEvent;
  ibtRequestApprovalsItemsCount$: Observable<any>;
  isItemsLoading: boolean;
  isSelectAll = false;
  loading$: Observable<boolean>;
  selectedArrayCount: number;
  requestApprovalRef = RequestApprovalEnum;
  selectionAllSubject: Subject<any> = new Subject<any>();
  destroy$: Subject<null> = new Subject<null>();
  PRODUCT_CATEGORIES: { [key: string]: Filter[] } = {};
  PRODUCT_GROUP: { [key: string]: Filter[] } = {};
  productCategoryFilterLable: string;
  productGroupFilterLable: string;
  maxFilterLimit: number;
  maxSortLimit: number;
  filter: { key: string; value: any[] }[] = [];
  filterData: { [key: string]: Filter[] } = {};
  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;
  isLoadImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  constructor(
    private router: Router,
    private appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private filterService: FilterService,
    private sortService: SortDialogService,
    private stockReceiveFacade: StockReceiveFacade,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appsettingFacade: AppsettingFacade,
    private activatedRoute: ActivatedRoute,
    private facade: RequestApprovalsFacade,
    private shortcutService: ShortcutServiceAbstraction,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    console.log(this.activatedRoute.snapshot.params['tab']);
    this.shortcutService.componentNames = [componentName];
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
    console.log(this.activatedRoute.snapshot.params['tab']);
    this.facade.loadStuddedProductGroups();
    this.stockReceiveFacade.loadProductGroups();
    this.stockReceiveFacade.loadProductCategories();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number[]) => {
        this.pageSizeOptions = data;
      });
    this.translate
      .get([
        'pw.stockReceive.productCategoryFilterLable',
        'pw.stockReceive.productGroupFilterLable',
        'pw.stockReceive.itemWeightSortLable',
        'pw.stockReceive.itemQuantityLable',
        'pw.stockReceive.searchBinCodeLable',
        'pw.stockReceive.selectBinCodeLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.productCategoryFilterLable =
          translatedMessages['pw.stockReceive.productCategoryFilterLable'];
        this.productGroupFilterLable =
          translatedMessages['pw.stockReceive.productGroupFilterLable'];
        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName:
              translatedMessages['pw.stockReceive.itemWeightSortLable'],
            sortAscOrder: false
          },
          {
            id: 1,
            sortByColumnName:
              translatedMessages['pw.stockReceive.itemQuantityLable'],
            sortAscOrder: false
          }
        ];
      });

    this.appsettingFacade
      .getMaxFilterLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxFilterLimit = data;
      });
    this.appsettingFacade
      .getMaxSortLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxSortLimit = data;
      });
    this.stockReceiveFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        this.PRODUCT_GROUP = this.mapToFilterOptions(
          this.productGroupFilterLable,
          productGroups.map(productGroup => ({
            id: productGroup.productGroupCode,
            description: productGroup.description,
            selected: false
          }))
        );
      });

    this.stockReceiveFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productCategories => {
        this.PRODUCT_CATEGORIES = this.mapToFilterOptions(
          this.productCategoryFilterLable,
          productCategories.map(productCategory => ({
            id: productCategory.productCategoryCode,
            description: productCategory.description,
            selected: false
          }))
        );
      });

    this.facade.resetError();
    this.facade.resetUpdate();

    this.type = this.activatedRoute.snapshot.params['tab'];
    this.requestId = this.activatedRoute.snapshot.params['_id'];

    console.log(this.type, 'type');
    this.show();
    this.facade.resetRequestApprovalsItemCount();
    this.facade.resetRequestApprovalsItem();
    this.facade.loadIbtRequestApprovalsItemsCount({
      requestType: this.type,
      id: this.requestId
    });

    this.ibtRequestApprovalsItemsCount$ = this.facade.getIbtCount();
    this.ibtRequestApprovalsItemsCount$.subscribe(data => {
      this.selectedArrayCount = data;
    });

    this.Items$ = this.facade.getIbtRequestItems();

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

    this.loading$ = this.facade.getIsLoading();

    this.Items$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.ids = [];
      if (this.approvalsTransferForm.value.selectItems === '1') {
        this.isSelectAll = true;
        this.selectionAllSubject.next({
          selectCheckbox: true,
          enableCheckbox: false
        });
      } else if (this.approvalsTransferForm.value.selectItems === '2') {
        this.selectionAllSubject.next({
          selectCheckbox: false,
          enableCheckbox: true
        });
        this.approvalsTransferForm.patchValue({
          selectItems: null
        });
      }

      items.forEach(element => {
        this.ids.push(element.id);
      });
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

    this.facade.loadSelectedRequest({
      id: this.requestId,
      requestType: this.tab
    });
    this.id = this.requestId;
    this.facade
      .getSelectedRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: RequestApprovals) => {
        if (data) {
          this.item = data;
        } else {
        }
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.initailPageEvent.pageSize = pageSize;
      });

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

  mapToFilterOptions(
    key: string,
    options: Filter[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options
    };
  }

  initialLoad() {
    this.isLoadImageUrl = true;
    // this.facade.loadIbtRequestApprovalsItemsCount(this.requestId);
    this.facade.loadIbtRequestItems({
      id: this.id,
      requestType: this.tab,
      pageIndex: this.pageIndex,
      pageSize: this.initailPageEvent.pageSize,
      isSelectedArray: []
    });
  }

  openFilter() {
    this.filterService.DataSource = {
      ...this.PRODUCT_CATEGORIES,
      ...this.PRODUCT_GROUP
    };
    this.dialog.closeAll();
    this.filterService
      .openDialog(this.maxFilterLimit, this.filterData)
      .pipe(take(1))
      .subscribe(
        (filterResult: {
          data: { [key: string]: Filter[] };
          actionfrom: string;
        }) => {
          if (filterResult.actionfrom === 'apply') {
            const filterData = filterResult.data;
            if (filterData == null) {
              this.filterData = {};
            } else {
              this.filterData = filterData;
            }
            this.filter = [];
            if (filterData) {
              let filterValues = [];
              if (filterData[this.productGroupFilterLable]) {
                filterData[this.productGroupFilterLable].forEach(value => {
                  filterValues.push(value.id);
                });
                if (filterValues.length > 0) {
                  this.filter.push({
                    key: 'productGroup',
                    value: filterValues
                  });
                }
              }
              filterValues = [];
              if (filterData[this.productCategoryFilterLable]) {
                filterData[this.productCategoryFilterLable].forEach(value => {
                  filterValues.push(value.id);
                });
                if (filterValues.length > 0) {
                  this.filter.push({
                    key: 'productCategory',
                    value: filterValues
                  });
                }
              }
            }

            this.itemsPageEvent = this.initailPageEvent;
            this.loadIbtApprovals();
          }
        }
      );
  }

  search(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.isSelectAll = false;
    this.itemsPageEvent = this.initailPageEvent;
    if (searchData.isValid) {
      this.loadIbtApprovals();
    } else {
      this.facade.resetRequestApprovalsItem();
    }
  }

  onSearchClear(): void {
    this.itemCode = null;

    this.isSelectAll = false;
    this.itemsPageEvent = this.initailPageEvent;
    this.loadIbtApprovals();
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

  shortcutEventHandler(command: Command): void {
    switch (command.name) {
      case SEARCH_KEY: {
        if (this.searchRef) {
          this.dialog.closeAll();
          this.searchRef.focus();
        }
        break;
      }

      case BACK_SHORTCUT_KEY: {
        this.dialog.closeAll();
        this.back();
        break;
      }

      case FILTER_POPUP_KEY: {
        this.openFilter();
        break;
      }

      case SORT_POPUP_KEY: {
        this.openSortDailog();
        break;
      }

      case SELECT_ALL_SHORTCUT_KEY: {
        this.dialog.closeAll();
        this.approvalsTransferForm.patchValue({
          selectItems: '1'
        });
        this.selectAll();

        break;
      }

      case SELECT_CURRENT_PAGE_KEY: {
        this.dialog.closeAll();
        this.approvalsTransferForm.patchValue({
          selectItems: '2'
        });
        this.selectPagewise();
        break;
      }

      case CLEAR_ALL_SHORTCUT_KEY: {
        this.dialog.closeAll();
        this.clearAll();
        break;
      }
    }
  }

  show() {
    this.header = this.type;
    this.tab = this.type;
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
    } else if (this.isSelectedArray.length === this.items.length) {
      this.approvalsTransferForm.get('selectItems').setValue('2');
      this.selectChange();
    }

    if (this.isSelectedArray.length !== 0) {
      this.InterBoutiqueTransferStatusRequestNotifications();
    }
  }

  selectChange() {
    if (this.approvalsTransferForm.value.selectItems === '1') {
      this.selectAll();
    } else if (this.approvalsTransferForm.value.selectItems === '2') {
      this.selectPagewise();
    }
  }

  selectPagewise() {
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: true
    });

    this.isSelectedArray = this.ids;
    console.log(this.isSelectedArray);
  }

  selectAll() {
    this.isSelectAll = true;
    this.selectionAllSubject.next({
      selectCheckbox: true,
      enableCheckbox: false
    });
    this.InterBoutiqueTransferStatusRequestNotifications();
  }

  openSortDailog() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(take(1))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        if (sortResult.actionfrom === 'apply') {
          const sortData = sortResult.data;
          if (sortData == null || sortData.length === 0) {
            this.sortData = [];
            this.sortOrder = null;
            this.sortBy = null;
          } else {
            this.sortData = sortData;
            if (sortData.length > 0) {
              if (sortData[0].id === 0) {
                this.sortBy = 'requestedWeight';
              } else if (sortData[0].id === 1) {
                this.sortBy = 'requestedQuantity';
              }
              this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
            }
          }
          this.itemsPageEvent = this.initailPageEvent;
          this.loadIbtApprovals();
        }
      });
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
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
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
      .pipe(takeUntil(this.destroy$))
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
          .events.subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.selectedId === 1) {
              console.log(this.isSelectedArray);
              if (this.isSelectAll === false) {
                if (this.isSelectedArray.length !== 0) {
                  const acceptStatus = {
                    id: this.requestId,
                    requestType: this.tab,

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
                  requestType: this.tab,

                  requestUpdateDto: {
                    itemIds: this.isSelectedArray,
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
                requestType: this.tab,
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
    const key =
      'pw.interBoutiqueTransferNotifications.statusResponseNotifications';
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
            message:
              translatedMessages[key] +
              ' ' +
              translatedMessages[statusKey.status],
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe((event: OverlayNotificationEventRef) => {
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
            hasBackdrop: false,
            hasClose: true
          })
          .events.subscribe((event1: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event1.eventType === OverlayNotificationEventType.CLOSE) {
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
    // this.facade.loadIbtRequestApprovalsItemsCount(this.requestId);
    this.isLoadImageUrl = true;
    this.facade.loadIbtRequestItems({
      id: this.id,
      itemCode: this.itemCode,
      requestType: this.tab,
      pageIndex: this.itemsPageEvent.pageIndex,
      pageSize: this.itemsPageEvent.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      filter: this.filter,
      isSelectedArray: this.isSelectedArray
    });
  }

  back() {
    this.router.navigate([getOtherIssuesRequestRouteUrl(this.type)]);
  }

  // Image
  loadImage(itemList, imageCatalogueDetails) {
    this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if(item.imageURL !== null && item.imageURL !== undefined){
        this.facade.loadThumbnailImageUrl({
          id: item.id.toString(),
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails,
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
