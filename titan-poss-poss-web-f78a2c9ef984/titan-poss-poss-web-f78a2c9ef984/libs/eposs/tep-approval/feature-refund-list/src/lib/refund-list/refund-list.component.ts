import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { TepApprovalFacade } from '@poss-web/eposs/tep-approval/data-access-tep-approval';
import {
  EditRefundItemPayload,
  OverlayNotificationEventRef,
  OverlayNotificationType,
  RefundDateRangeTypeEnum,
  RefundList,
  RefundListingPayload,
  RefundListItem,
  RefundOptionTypes,
  RefundStatusEnum,
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  SelectDropDownOption,
  ApprovalsMenuKeyEnum,
  LocationSettingAttributesEnum,
  DocumentListResponse,
  FileTypeEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { getApprovalsHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { FileDownloadPopupComponent } from '@poss-web/shared/file-upload/ui-file-download-popup';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
@Component({
  selector: 'poss-web-refund-list',
  templateUrl: './refund-list.component.html'
})
export class RefundListComponent implements OnInit, OnDestroy {
  showChequeList: boolean;
  showRtgsList: boolean;
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject();
  isLoggedIn: boolean;
  minPageSize: any;
  refundType: string;
  possibleRefundStatus: string[] = [
    RefundStatusEnum.ALLOWED_TO_CANCEL,
    RefundStatusEnum.APPROVAL_PENDING,
    RefundStatusEnum.PENDING_FROM_RO,
    RefundStatusEnum.REFUNDED,
    RefundStatusEnum.REJECTED,
    RefundStatusEnum.CANCELLED
  ];

  tepApprovalPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  pageSizeOptions: number[] = [];

  tepRefundList: RefundListItem[];
  totalElements: number;
  filterForm: FormGroup;
  refundStatusOptions: SelectDropDownOption[] = [];
  dateRangeTypes: SelectDropDownOption[] = [];
  currentDate = moment();
  showDateRangePicker = false;
  startDate: number;
  endDate: number;
  uploadedFilesLocationCode: string;
  filesList: DocumentListResponse[];
  imageUrl: string;
  defaultImageUrl = 'assets/img/product-default-image.svg';
  downloadFileDetails: DocumentListResponse;
  currentFiscalYear: string;

  constructor(
    private router: Router,
    private tepApprovalFacade: TepApprovalFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private fileFacade: FileFacade,
    private dialog: MatDialog,
    private alertPopUpService: AlertPopupServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotificationServiceAbstraction: OverlayNotificationServiceAbstraction
  ) {
    this.refundStatusOptions = [
      {
        value: 'PENDING_FROM_RO',
        description: 'PENDING FROM RO'
      },
      {
        value: 'REJECTED',
        description: 'REJECTED'
      },
      {
        value: 'ALLOWED_TO_CANCEL',
        description: 'ALLOWED TO CANCEL'
      },
      {
        value: 'REFUNDED',
        description: 'REFUNDED'
      },
      {
        value: 'CANCELLED',
        description: 'CANCELLED'
      }
    ];

    this.dateRangeTypes = [
      {
        value: 'TODAY',
        description: 'TODAY'
      },
      {
        value: 'LAST_WEEK',
        description: 'LAST WEEK'
      },
      {
        value: 'LAST_MONTH',
        description: 'LAST MONTH'
      },
      {
        value: 'LAST_YEAR',
        description: 'LAST YEAR'
      },
      {
        value: 'CUSTOM',
        description: 'CUSTOM'
      }
    ];

    this.filterForm = new FormGroup({
      locationCode: new FormControl(null, [
        this.fieldValidatorsService.locationCodeField('Location Code')
      ]),
      tepNo: new FormControl(null, [
        this.fieldValidatorsService.requestNumberField('TEP Number')
      ]),
      fiscalYear: new FormControl(null),
      status: new FormControl(null),
      dateRangeType: new FormControl('TODAY'),
      fromDate: new FormControl(null),
      toDate: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.showChequeList = this.router.url.includes('cheque') ? true : false;
    this.showRtgsList = this.router.url.includes('rtgs') ? true : false;
    if (this.showChequeList) {
      this.refundType = RefundOptionTypes.CHEQUE;
    } else if (this.showRtgsList) {
      this.refundType = RefundOptionTypes.RTGS;
    }
    this.isLoading$ = this.tepApprovalFacade.getIsLoading();

    this.tepApprovalFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });
    this.fileFacade
      .getDocumentsLst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docs => {
        if (docs?.length > 0) {
          this.filesList = docs;
          this.openFileDownloadPopup();
        } else if (docs?.length == 0) {
          this.showAlertPopUp('No Attachments Available');
        }
      });

    this.fileFacade
      .getDocumentUrlById()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docUrl => {
        if (docUrl) {
          this.imageUrl = docUrl;
          this.showPopup();
        }
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

    this.getTepRefundListData();

    this.filterForm
      .get('locationCode')
      .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(value => {
        this.loadRefundList();
      });

    this.filterForm
      .get('tepNo')
      .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(value => {
        this.loadRefundList();
      });

    this.filterForm
      .get('fiscalYear')
      .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(value => {
        this.loadRefundList();
      });

    this.tepApprovalFacade
      .getEditedRefundListItemResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((editRefundResponse: any) => {
        if (editRefundResponse) {
          this.loadRefundList();
          this.showNotifications(
            'Refund status is successfully updated for selected item.'
          );
        }
      });

    this.filterForm
      .get('fromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.filterForm.get('toDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }

  openFileDownloadPopup() {
    const dialogRef = this.dialog.open(FileDownloadPopupComponent, {
      height: 'auto',
      width: '700px',
      autoFocus: false,
      data: {
        files: this.filesList
      }
    });
    dialogRef.componentInstance.downloadFile
      .pipe(takeUntil(this.destroy$))
      .subscribe(fileData => {
        this.downloadFileDetails = fileData;
        let extn = fileData.name.split('.').pop();
        extn = extn.toLowerCase();
        if (extn === FileTypeEnum.PDF)
          this.fileFacade.downloadPdfFile({
            ...fileData,
            locationCode: this.uploadedFilesLocationCode
          });
        else if (extn === FileTypeEnum.JPG || extn === FileTypeEnum.JPEG)
          this.fileFacade.loadDocumentUrlById(
            fileData.id,
            this.uploadedFilesLocationCode
          );
      });
  }

  showAlertPopUp(message: string) {
    this.alertPopUpService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  showPopup(): void {
    this.dialog.open(FilePreviewComponent, {
      height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: this.imageUrl,
        previewHeader: 'File upload'
      }
    });
  }

  getUploadedFiles(data) {
    this.uploadedFilesLocationCode = data.locationCode;
    this.fileFacade.loadDocumentsList({
      customerId: null,
      docType: 'TEP',
      fileType: 'OTHERS',
      id: data.refTxnId,
      locationCode: data.locationCode
    });
  }

  filter() {
    this.loadRefundList();
  }

  loadRefundList() {
    let refundListPayload: RefundListingPayload = {
      status: this.filterForm.get('status').value,
      docNo: this.filterForm.get('tepNo').value
        ? this.filterForm.get('tepNo').value
        : null,
      fiscalYear: this.filterForm.get('fiscalYear').value
        ? this.filterForm.get('fiscalYear').value
        : null,
      locationCode: this.filterForm.get('locationCode').value
        ? this.filterForm.get('locationCode').value
        : null,
      refundType: this.showChequeList ? 'CHEQUE' : 'RTGS',
      subTxnType: null,
      dateRangeType: this.filterForm.get('dateRangeType').value
        ? this.filterForm.get('dateRangeType').value
        : 'LAST_YEAR'
    };
    if (this.startDate && this.endDate) {
      refundListPayload = {
        ...refundListPayload,
        startDate: this.startDate,
        endDate: this.endDate
      };
    }
    this.tepApprovalFacade.loadTepRefundList(
      refundListPayload,
      0,
      this.minPageSize
    );
  }

  clearTepNoSearch() {
    this.filterForm.get('tepNo').reset();
    this.filterForm.get('tepNo').updateValueAndValidity();
  }

  clearLocationSearch() {
    this.filterForm.get('locationCode').reset();
    this.filterForm.get('locationCode').updateValueAndValidity();
  }

  clearFiscalYearSearch() {
    this.filterForm.get('fiscalYear').reset();
    this.filterForm.get('fiscalYear').updateValueAndValidity();
  }

  filterByStatus(event) {
    this.loadRefundList();
  }

  filterByDateRangeType(event) {
    if (event.value === 'CUSTOM') {
      this.showDateRangePicker = true;
    } else {
      this.showDateRangePicker = false;
      this.filterForm.get('fromDate').setValue('');
      this.filterForm.get('toDate').setValue('');
      this.filterForm.updateValueAndValidity();
      this.loadRefundList();
    }
  }

  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    console.log('Start Date :', dateRangeStart.value);
    console.log('End Date :', dateRangeEnd.value);
    console.log(this.filterForm.get('fromDate').value.format('YYYY-MM-DD'));
    console.log(this.filterForm.get('toDate').value.format('YYYY-MM-DD'));
    this.startDate = moment(this.filterForm.get('fromDate').value)
      .startOf('day')
      .valueOf();
    this.endDate = moment(this.filterForm.get('toDate').value)
      .endOf('day')
      .valueOf();
    if (this.startDate && this.endDate) {
      this.loadRefundList();
    }
  }

  getTepRefundListData() {
    this.tepApprovalFacade
      .getTepRefundList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((refundList: RefundList) => {
        if (refundList) {
          const refundStatusList = refundList.results.filter(
            (listItem: RefundListItem) => {
              return listItem.status !== RefundStatusEnum.APPROVAL_PENDING;
            }
          );
          this.tepRefundList = refundStatusList;
          this.totalElements = refundList.totalElements;
        }
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  changeTab(tab: string) {
    if (tab === 'CHEQUE') {
      this.router.navigate(['/approvals/tep-refund-status/cheque']);
    } else if (tab === 'RTGS') {
      this.router.navigate(['/approvals/tep-refund-status/rtgs']);
    }
  }

  paginate(pageEvent: PageEvent) {
    this.tepApprovalPageEvent = pageEvent;
    console.log('Page Event in feature :', pageEvent);
    const refundListPayload: RefundListingPayload = {
      fiscalYear: this.filterForm.get('fiscalYear').value,
      locationCode: this.filterForm.get('locationCode').value,
      refundType: this.showChequeList ? 'CHEQUE' : 'RTGS',
      subTxnType: null,
      dateRangeType: RefundDateRangeTypeEnum.LAST_YEAR
    };
    this.tepApprovalFacade.loadTepRefundList(
      refundListPayload,
      this.tepApprovalPageEvent.pageIndex,
      this.tepApprovalPageEvent.pageSize
    );
  }

  getEditedRefundItem(event: {
    data: EditRefundItemPayload;
    status: any;
    index: any;
  }) {
    if (event) {
      if (this.possibleRefundStatus.includes(event.status)) {
        this.tepApprovalFacade.editTepRefundListItem(
          event.data,
          event.status,
          this.tepRefundList[event.index].id
        );
      } else if (!event.status) {
        this.showNotifications(
          'Please select proper status for selected item.'
        );
      }
    }
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotificationServiceAbstraction
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.tepApprovalFacade.clearResponse();
    this.fileFacade.clearResponse();
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
