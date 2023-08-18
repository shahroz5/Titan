import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  getApprovalsHomeRouteUrl,
} from '@poss-web/shared/util-site-routes';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ApprovalsMenuKeyEnum,
  CnApprovalListRequest,
  cnApprovalsEnum,
  CustomErrors,
  grnRequestEnum,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SaveCnApproval,
  SortItem,
  tepApprovalListResponse
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { TepApprovalFacade } from '@poss-web/eposs/tep-approval/data-access-tep-approval';
import { StoneDetailsPopupComponent } from '@poss-web/eposs/tep-approval/ui-stone-details-popup';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-tep-approval-list',
  templateUrl: './tep-approval-list.component.html'
})
export class TepApprovalListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  tepApprovalPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  minPageSize: any;
  isSearching = false;
  tepRequestList$: Observable<tepApprovalListResponse[]>;
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  locationCode: any;
  pageSizeOptions: number[] = [];
  pageSize = 10;
  pageIndex = 0;
  inValidSearch = false;
  totalElements$: Observable<number>;
  defaultSort: SortItem = { colId: 'createdDate', sort: 'Desc' };
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  filterForm = new FormGroup({});
  invalidSearch = false;
  editErrorLabelText: string;

  typeList = [
    {
      value: 'TEP_APPROVAL_WORKFLOW',
      description: 'Regular TEP',
      isActive: true
    },

    {
      value: 'MANUAL_TEP',
      description: 'Manual TEP',
      isActive: true
    }
  ];
  constructor(
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private tepApprovalFacade: TepApprovalFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.stone.addStoneDeatilsAlert'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.editErrorLabelText =
          translatedMessages['pw.stone.addStoneDeatilsAlert'];
      });
  }

  ngOnInit(): void {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.tepApprovalPageEvent.pageSize = data;
        this.pageSize = data;

      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.componentInit();

    this.filterForm = new FormGroup({
      locationCode: new FormControl(null),
      variantCode: new FormControl(null),
      type: new FormControl('TEP_APPROVAL_WORKFLOW')
    });

    this.loadList();

    this.filterForm.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadList();
      });
  }
  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });

  }

  loadList() {
    this.inValidSearch = false;
    const tepApprovalListRequest: CnApprovalListRequest = {
      approvalStatus: cnApprovalsEnum.PENDING,
      pageIndex: this.tepApprovalPageEvent.pageIndex,
      pageSize: this.tepApprovalPageEvent.pageSize,
      workflowType: this.filterForm.get('type').value,
      filterOptions: {
        dateRangeType: grnRequestEnum.ALL,
        filterParams: {
          locationCode: this.filterForm.get('locationCode').value
            ? this.filterForm.get('locationCode').value
            : undefined,
          itemCode: this.filterForm.get('variantCode').value
            ? this.filterForm.get('variantCode').value
            : undefined
        }
      }
    };
    if (this.filterForm.valid) {
      this.tepApprovalFacade.loadApprovalList(tepApprovalListRequest);
    } else {
      this.inValidSearch = true;
    }
  }

  componentInit() {
    this.tepRequestList$ = this.tepApprovalFacade.GetApprovalListList();
    this.isLoading$ = this.tepApprovalFacade.getIsLoading();

    this.totalElements$ = this.tepApprovalFacade.getTotalElements();

    this.tepApprovalFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {

          this.errorHandler(error);
        }
      });

    this.tepApprovalFacade
      .getUpdatedWorkflowDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: tepApprovalListResponse) => {
        if (value) {

          this.openStoneDetails(value);
        }
      });
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;

        this.locationCode = searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else this.clearSearch();
      });
  }

  clearSearch() {
    this.invalidSearch = false;
    this.isSearching = false;
    this.searchForm.reset();

  }

  search(searchValue) {
    this.isSearching = true;
    if (fieldValidation.locationCodeField.pattern.test(searchValue)) {


      this.invalidSearch = false;
    } else {


      this.invalidSearch = true;
    }
  }



  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        // Action based event
      });
  }

  clearvariantCodeSearch() {
    this.inValidSearch = false;
    this.pageIndex = 0;
    this.filterForm.get('variantCode').clearValidators();
    this.filterForm.get('variantCode').reset();
    this.loadList();
  }
  clearLocationSearch() {
    this.inValidSearch = false;
    this.pageIndex = 0;
    this.filterForm.get('locationCode').clearValidators();
    this.filterForm.get('locationCode').reset();
    this.loadList();
  }

  ngOnDestroy(): void {
    this.tepApprovalFacade.clearResponse();
    this.destroy$.next();
    this.destroy$.complete();
  }
  saveStatus(requestApproval: SaveCnApproval) {
    if (!requestApproval.bulkApproverRequestObjectDto[0].approvedData) {
      this.openPopUp(this.editErrorLabelText);
    } else {
      this.tepApprovalFacade.saveTepStatus(requestApproval);
    }
  }
  openPopUp(errorMessage) {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: errorMessage
    });
  }
  cellClicked(data: tepApprovalListResponse) {
    if (data.approvedData?.data?.stones) {
      this.openStoneDetails(data);
    } else {
      this.tepApprovalFacade.loadworkflowProcessDetails({
        processId: data.processId,
        workflowType: this.filterForm.get('type').value
      });
    }
  }

  onSelectionStatusChange(event) {
  }
  openStoneDetails(data: tepApprovalListResponse) {
    this.dialog
      .open(StoneDetailsPopupComponent, {
        autoFocus: false,
        width: '1000px',
        data: { stones: data.approvedData?.data?.stones, workflowData: data }
      })

      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: tepApprovalListResponse) => {
        if (res) {
          this.tepApprovalFacade.updateApprovalList(res);
        }
      });
  }

  paginate(pageEvent: PageEvent) {
    this.tepApprovalPageEvent = pageEvent;
    this.loadList();
  }
}
