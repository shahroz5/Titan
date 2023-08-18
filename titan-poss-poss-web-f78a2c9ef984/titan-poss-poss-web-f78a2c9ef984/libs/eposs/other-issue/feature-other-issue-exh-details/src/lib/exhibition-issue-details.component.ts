import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OtherIssuesFacade } from '@poss-web/eposs/other-issue/data-access-other-issue';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  FilterActions,
  FilterService
} from '@poss-web/shared/components/ui-filter-dialog';
import { SortDialogService } from '@poss-web/shared/components/ui-sort-dialog';
import {
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import {
  Column,
  Command,
  CustomErrors,
  Filter,
  OtherIssuesFilterOption,
  OtherIssuesItem,
  OtherReceiptsIssuesEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  printDocTypeEnum,
  printTransactionTypesEnum,
  ProductCategory,
  ProductGroup,
  RequestOtherIssueStockTransferNote,
  ShortcutServiceAbstraction,
  sortFilterData
} from '@poss-web/shared/models';
import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getOtherIssuesReceiptUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

const mainSearchShortCutKey = 'ExhibitionIssueDetailsComponent.MAIN_SEARCH';
const filterShortCutKey = 'ExhibitionIssueDetailsComponent.FILTER';
const sortShortCutKey = 'ExhibitionIssueDetailsComponent.SORT';
const backShortCutKey = 'ExhibitionIssueDetailsComponent.BACK';
const componentName = 'ExhibitionIssueDetailsComponent';
@Component({
  selector: 'poss-web-exhibition-issue-details',
  templateUrl: './exhibition-issue-details.component.html',
  styleUrls: ['./exhibition-issue-details.component.scss']
})
export class ExhibitionIssueDetailsComponent implements OnInit, OnDestroy {
  type: string;
  reqDocNumber: number;
  destroy$: Subject<null> = new Subject<null>();
  storeType: string;
  selectedIssue: RequestOtherIssueStockTransferNote;
  pageSize = 0;
  pageIndex = 0;
  initialPageEvent: PageEvent = {
    pageIndex: this.pageIndex,
    pageSize: this.pageSize,
    length: 0
  };
  nonVerifiedOtherIssueItemsPageEvent: PageEvent = this.initialPageEvent;
  isLoadingSelectedStock$: Observable<boolean>;
  nonVerifiedOtherIssueItems$: Observable<OtherIssuesItem[]>;
  isNonVerifiedOtherIssueItemsLoading$: Observable<boolean>;
  isVerifiedOtherIssueItemsLoading$: Observable<boolean>;
  isOtherIssueItemsTotalCountLoaded$: Observable<boolean>;
  isOtherIssueItemsTotalCountLoading$: Observable<boolean>;
  hasNotification = false;
  nonVerifiedOtherIssueItemsTotalCount = 0;
  verifiedOtherIssueItemsTotalCount = 0;
  otherIssuesTabEnumRef = OtherReceiptsIssuesEnum;
  searchForm: FormGroup;
  isSearchingOtherIssueItems$: Observable<boolean>;
  hasSearchedOtherIssueItems$: Observable<boolean>;
  transferType: string;

  createOtherStockIssueItemsResponse$: Observable<any>;
  confirmOtherStockIssueResponse$: Observable<any>;
  isLoadingOtherIssueDetails$: Observable<boolean>;
  sortByData = '';
  isLoadingCancelStockRequestResponse$: Observable<boolean>;
  cancelOtherStockRequestResponse$: Observable<any>;
  itemCode: string;
  lotNumber: string;
  printdata$: Observable<any>;
  requestDocNumber: number;
  productCategory: { [key: string]: Filter[] };
  productGroup: { [key: string]: Filter[] };
  maxFilterLimit: number;
  maxSortLimit: number;
  filterData: { [key: string]: Filter[] } = {};
  filterMap = new Map();
  filterDataOtherIssue: any;
  sortDataOtherIssue$: Observable<Column[]>;
  sortData: Column[];
  sortMap = new Map();
  sortOrder: string;
  sortBy: string;
  filter: { key: string; value: any[] }[] = [];
  stockTransactionNumber: number;
  dateFormat: string;
  pageSizeOptions: number[] = [];
  PrintErrorText: string;
  noDataFoundMessage = '';
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  adjustMentItem: OtherIssuesItem[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private otherIssueFacade: OtherIssuesFacade,
    private router: Router,
    private fb: FormBuilder,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private filterService: FilterService,
    private shortcutService: ShortcutServiceAbstraction,
    private appsettingFacade: AppsettingFacade,
    private sortDialogService: SortDialogService,
    private dialog: MatDialog,

    private printingService: PrintingService
  ) {
    this.sortDialogService.DataSource = sortFilterData;
    this.searchForm = this.fb.group({
      searchValue: []
    });

    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });

    this.translate
      .get(['pw.entity.otherIssueEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.otherIssueEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.otherIssueFacade.loadStuddedProductGroups();
    this.reset();
    this.reqDocNumber = this.activatedRoute.snapshot.params['_reqDocNo'];
    this.type = this.activatedRoute.snapshot.params['type'];
    switch (this.type) {
      case OtherReceiptsIssuesEnum.EXHIBITION: {
        this.transferType = OtherReceiptsIssuesEnum.EXHIBITION_TYPE;
        break;
      }
      case OtherReceiptsIssuesEnum.LOAN_TYPE: {
        this.transferType = OtherReceiptsIssuesEnum.LOAN;
        break;
      }
      case OtherReceiptsIssuesEnum.ADJUSTMENT: {
        this.transferType = OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE;
        break;
      }
      case OtherReceiptsIssuesEnum.LOSS: {
        this.transferType = OtherReceiptsIssuesEnum.LOSS_TYPE;
        break;
      }
      case OtherReceiptsIssuesEnum.PSV: {
        this.transferType = OtherReceiptsIssuesEnum.PSV;
        break;
      }
      case OtherReceiptsIssuesEnum.FOC: {
        this.transferType = OtherReceiptsIssuesEnum.FOC;
        break;
      }
    }
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

    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.appsettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => (this.initialPageEvent.pageSize = JSON.parse(resp.toString()))
      );
    this.otherIssueFacade.loadSelectedIssue({
      reqDocNo: this.reqDocNumber,
      type: this.transferType
    });
    this.otherIssueFacade
      .getSelectedIssue()
      .pipe(takeUntil(this.destroy$))
      .subscribe(requestStockTransferNote => {
        if (requestStockTransferNote) {
          this.selectedIssue = requestStockTransferNote;
          if (
            this.selectedIssue &&
            this.selectedIssue.status ===
              OtherReceiptsIssuesEnum.APPROVED_STATUS
          ) {
            this.otherIssueFacade.createOtherStockIssueItems({
              id: this.selectedIssue.id,
              data: [],
              transferType: this.transferType
            });
          }

          this.componentInit();
        }
      });
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
  }
  componentInit() {
    this.otherIssueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.isLoadingSelectedStock$ = this.otherIssueFacade.getisLoadingSelectedIssueStock();

    this.nonVerifiedOtherIssueItems$ = this.otherIssueFacade.getNonVerifiedOtherissueItems();
    this.nonVerifiedOtherIssueItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.nonVerifiedOtherIssueItemsTotalCount = 0;
        if (data.length !== 0) {
          this.nonVerifiedOtherIssueItemsTotalCount = data[0].totalElements;
        }
        this.adjustMentItem = data;

        this.showNotifications();
      });
    this.isLoadingOtherIssueDetails$ = this.otherIssueFacade.getisLoadingOtherIssueDetails();
    this.confirmOtherStockIssueResponse$ = this.otherIssueFacade.getConfirmOtherStockIssueResponse();
    this.confirmOtherStockIssueResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.srcDocNo) {
          this.requestDocNumber = data.srcDocNo;
          this.stockTransactionNumber = data.id;
          this.showSuccessMessageNotification();
        }
      });
    this.isSearchingOtherIssueItems$ = this.otherIssueFacade.getIsSearchingOtherIssueItems();
    this.hasSearchedOtherIssueItems$ = this.otherIssueFacade.getHasSearchedOtherIssueItems();

    if (
      this.selectedIssue &&
      this.selectedIssue.status === OtherReceiptsIssuesEnum.APPROVED_STATUS
    ) {
      this.createOtherStockIssueItemsResponse$ = this.otherIssueFacade.getCreateOtherStockIssueItemsResponse();
      this.createOtherStockIssueItemsResponse$
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data === null) {
            this.initialLoad();
          }
        });
    }
    this.isLoadingCancelStockRequestResponse$ = this.otherIssueFacade.getIsLoadingCancelStockRequestResponse();
    this.cancelOtherStockRequestResponse$ = this.otherIssueFacade.getCancelOtherStockRequestResponse();
    this.cancelOtherStockRequestResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const key =
            'pw.otherReceiptsIssues.OtherStockIssueCancellationSuccessMessage';
          this.translate
            .get(key)
            .pipe(takeUntil(this.destroy$))
            .subscribe((translatedMessage: string) => {
              this.showCancelSuccessMessageNotification(translatedMessage);
            });
        }
      });

    if (
      this.selectedIssue &&
      this.selectedIssue.status === OtherReceiptsIssuesEnum.APVL_PENDING_STATUS
    ) {
      this.initialLoad();
    }
    this.printdata$ = this.otherIssueFacade.getPrintDataResponse();
    this.printdata$
      .pipe(
        filter(data => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        //const blob = new Blob([data], { type: 'text/html' });
        // const url = window.URL.createObjectURL(blob);
        // window.open(url);
        const printData = [
          {
            type: 'pixel',
            format: 'html',
            flavor: 'plain',
            data: data
          }
        ];
        // this.printer.print(this.printerName, printData).subscribe(
        //   response => {},
        //   Error => {
        //     this.overlayNotification
        //       .show({
        //         type: OverlayNotificationType.TIMER,
        //         message: this.PrintErrorText,
        //         hasClose: false
        //       })
        //       .events.pipe(takeUntil(this.destroy$))
        //       .subscribe((event: OverlayNotificationEventRef) => {
        //         this.showSuccessMessageNotification();
        //       });
        //   }
        // );
      });

    this.otherIssueFacade.loadProductCategories();
    this.otherIssueFacade.loadProductGroups(null);
    this.otherIssueFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productCategories: ProductCategory[]) => {
        if (productCategories !== null) {
          this.productCategory = this.mapToFilterOptions(
            'Product Category',
            productCategories.map(productCategory => ({
              id: productCategory.productCategoryCode,
              description: productCategory.description
            }))
          );
        }
      });

    this.otherIssueFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        if (productGroups !== null) {
          this.productGroup = this.mapToFilterOptions(
            'Product Group',
            productGroups.map(productGroup => ({
              id: productGroup.productGroupCode,
              description: productGroup.description
            }))
          );
        }
      });
    this.filterDataOtherIssue = this.otherIssueFacade.getFilterDataOtherIssue();
    this.filterDataOtherIssue
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterData = filterValue;
      });
    this.sortDataOtherIssue$ = this.otherIssueFacade.getSortDataOtherIssue();
    this.sortDataOtherIssue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortValue => {
        this.sortData = sortValue;
      });
  }

  initialLoad() {
    this.loadPendingItems();
  }
  back() {
    this.otherIssueFacade.removeInitialLoadOtherIssue();
    this.router.navigate([
      getOtherIssuesReceiptUrl(OtherReceiptsIssuesEnum.OTHER_ISSUES, this.type)
    ]);
  }
  loadPendingItems() {
    if (this.selectedIssue) {
      this.otherIssueFacade.loadNonVerifiedItems({
        id: this.selectedIssue.id,
        pageIndex: this.nonVerifiedOtherIssueItemsPageEvent.pageIndex,
        pageSize: this.nonVerifiedOtherIssueItemsPageEvent.pageSize,
        type: this.transferType,
        status:
          this.selectedIssue.status ===
          OtherReceiptsIssuesEnum.APVL_PENDING_STATUS
            ? OtherReceiptsIssuesEnum.APVL_PENDING_STATUS
            : OtherReceiptsIssuesEnum.SELECTED,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        sort: this.sortMap,
        filter: this.filter
      });
    }
  }
  paginateNonVerifedItems(event: PageEvent) {
    this.nonVerifiedOtherIssueItemsPageEvent = event;
    this.loadPendingItems();
  }

  searchItems(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;

    if (searchData.isValid) {
      this.loadPendingItems();
    } else {
      this.otherIssueFacade.clearItems();
    }
  }

  showConfirmIssueNotification(key: string) {
    this.hasNotification = true;
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: 'CONFIRM ISSUE',
            hasRemarks: true,
            message: translatedMsg,
            isRemarksMandatory: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.hasNotification = true;
              if (this.adjustMentItem.length > 0) {
                let totalIssuedQty = 0;
                for (const items of this.adjustMentItem) {
                  totalIssuedQty = totalIssuedQty + items.availableQuantity;
                }
                if (totalIssuedQty !== 0) {
                  this.showProgressNotification();
                  if (
                    this.transferType ===
                      OtherReceiptsIssuesEnum.EXHIBITION_TYPE ||
                    this.transferType === OtherReceiptsIssuesEnum.LOAN ||
                    this.transferType === OtherReceiptsIssuesEnum.LOSS_TYPE
                  ) {
                    this.otherIssueFacade.confirmOtherStockIssue({
                      id: this.selectedIssue.id,
                      transferType: this.transferType,
                      carrierDetails: {
                        type: null,
                        data: null
                      },
                      remarks: event.data,
                      destinationLocationCode: ''
                    });
                  }
                  if (
                    this.transferType ===
                      OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE ||
                    this.transferType === OtherReceiptsIssuesEnum.PSV ||
                    this.transferType === OtherReceiptsIssuesEnum.FOC
                  ) {
                    this.otherIssueFacade.confirmOtherStockIssue({
                      id: this.selectedIssue.id,
                      transferType: this.transferType,
                      carrierDetails: {
                        type: '',
                        data: ''
                      },
                      remarks: event.data,
                      destinationLocationCode: ''
                    });
                  }
                } else {
                  this.showNotificationForError(
                    'There is no item quantity to confirm issue'
                  );
                }
              }
            }
          });
      });
  }

  clearSearchItems() {
    this.itemCode = null;
    this.lotNumber = null;
    if (this.searchRef) {
      this.searchRef.reset();
    }
    this.loadPendingItems();
  }

  showNotifications() {
    this.overlayNotification.close();
    if (
      this.selectedIssue.status === OtherReceiptsIssuesEnum.APPROVED_STATUS &&
      this.filter.length === 0 &&
      this.itemCode == null &&
      this.lotNumber == null
    ) {
      this.showConfirmIssueNotification(
        'pw.otherReceiptsIssues.confirmIssueNotificationMessage'
      );
    }
    if (
      this.selectedIssue.status ===
        OtherReceiptsIssuesEnum.APVL_PENDING_STATUS &&
      this.filter.length === 0 &&
      this.itemCode == null &&
      this.lotNumber == null
    ) {
      this.OtherIssueCancelNotifications();
    }
  }
  showSuccessMessageNotification() {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.successCancelCloseOperation(event);
      });
  }
  showCancelSuccessMessageNotification(msg: string) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: msg,
        hasBackdrop: true,
        hasClose: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.successCancelCloseOperation(event);
      });
  }
  showProgressNotification() {
    const key = 'pw.stockReceiveNotificationMessages.progressMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.PROGRESS,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
  }
  openFilter() {
    this.filterService.DataSource = {
      ...this.productCategory,
      ...this.productGroup
    };
    this.dialog.closeAll();
    this.filterService
      .openDialog(this.maxFilterLimit, this.filterData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (filterResult: {
          data: { [key: string]: Filter[] };
          actionfrom: string;
        }) => {
          if (filterResult.actionfrom === FilterActions.APPLY) {
            this.otherIssueFacade.setOtherIssueFilter(filterResult.data);
            const filterData = filterResult.data;
            if (filterData == null) {
              this.filterData = {};
            } else {
              this.filterData = filterData;
            }
            this.filter = [];
            if (filterData) {
              let filterValues = [];
              if (filterData['Product Group']) {
                filterData['Product Group'].forEach(value => {
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
              if (filterData['Product Category']) {
                filterData['Product Category'].forEach(value => {
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
            this.nonVerifiedOtherIssueItemsPageEvent = this.initialPageEvent;
            this.loadPendingItems();
          }
        }
      );
  }
  openSort() {
    this.dialog.closeAll();
    this.sortDialogService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        if (sortResult.actionfrom === FilterActions.APPLY) {
          this.otherIssueFacade.setOtherIssueAllProductsSort(sortResult.data);
          this.sortMap.clear();
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
                this.sortBy = 'approvedQuantity';
              }
              this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
            }
          }
          if (this.sortBy !== null && this.sortOrder !== null) {
            this.sortMap.set('sort', this.sortBy + ',' + this.sortOrder);
          }
          this.nonVerifiedOtherIssueItemsPageEvent = this.initialPageEvent;
          this.loadPendingItems();
        }
      });
  }
  getStatusColor(status: string) {
    switch (status) {
      case 'REQUESTED':
      case 'ACPT_REJECTED':
      case 'APRVL_PENDING':
      case 'APRVL_REJECTED':
      case 'CANCELLED':
      case 'EXPIRED':
      case 'REJECTED':
        return false;

      case 'ACCEPTED':
      case 'APPROVED':
        return true;
    }
  }
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (event.eventType === OverlayNotificationEventType.CLOSE) {
            this.showNotifications();
          }
        });
    }
  }

  printError() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: this.PrintErrorText,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.showSuccessMessageNotification();
      });
  }
  reset() {
    this.otherIssueFacade.resetConfirmOtherIssueResponse();
  }
  /**
   * Notification overlay for cancel request
   */
  OtherIssueCancelNotifications() {
    this.hasNotification = true;
    const key = 'pw.otherReceiptsIssues.cancelNotificationsMsg';
    const buttonKey = 'pw.otherReceiptsIssues.cancelRequestButtonText';
    this.translate
      .get([key, buttonKey])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: translatedMessages[key],
            buttonText: translatedMessages[buttonKey],
            hasClose: false,
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.otherIssueFacade.cancelOtherStockRequestResponse({
                id: this.selectedIssue.id,
                requestType: this.transferType
              });
            }
          });
      });
  }
  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case mainSearchShortCutKey: {
        if (this.searchRef) {
          this.dialog.closeAll();
          this.searchRef.focus();
        }
        break;
      }
      case filterShortCutKey: {
        this.openFilter();
        break;
      }
      case sortShortCutKey: {
        this.openSort();
        break;
      }
      case backShortCutKey: {
        this.back();
        this.dialog.closeAll();
        break;
      }
    }
  }

  showNotificationForError(msg: string) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: msg,
        hasBackdrop: true,
        hasClose: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {});
  }

  print() {
    this.printingService.loadPrintData({
      printType: this.transferType,
      transacionId: this.stockTransactionNumber,
      transacionType: printTransactionTypesEnum.OTHER_ISSUE,
      doctype: printDocTypeEnum.STOCK_PRINT
    });

    // this.otherIssueFacade.printOtherIssue({
    //   id: this.stockTransactionNumber,
    //   requestType: this.transferTypethis.transferType
    // });
  }
  mapToFilterOptions(
    key: string,
    options: OtherIssuesFilterOption[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options.map(option => ({
        id: option.id,
        description: option.description,
        selected: false
      }))
    };
  }
  successCancelCloseOperation(event: OverlayNotificationEventRef) {
    if (event.eventType === OverlayNotificationEventType.CLOSE) {
      this.router.navigateByUrl(
        getOtherIssuesReceiptUrl(
          OtherReceiptsIssuesEnum.OTHER_ISSUES,
          this.type
        )
      );
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayNotification.close();
    this.printingService.resetPrint();
  }

  /// added for demo will be removed
}
