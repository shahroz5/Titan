import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { getApprovalsHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  ApprovalsMenuKeyEnum,
  CnApprovalListRequest,
  cnApprovalsEnum,
  CustomErrors,
  DocumentListResponse,
  FileTypeEnum,
  FullValueApprovalListItem,
  FullValueTepRequestsResponse,
  FvtAcceptOrRejectRequestPayload,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SortItem
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { TepApprovalFacade } from '@poss-web/eposs/tep-approval/data-access-tep-approval';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { FileDownloadService } from '@poss-web/shared/util-common';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import { FileDownloadPopupComponent } from '@poss-web/shared/file-upload/ui-file-download-popup';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';

@Component({
  selector: 'poss-web-full-value-tep-approval',
  templateUrl: './full-value-tep-approval.component.html'
})
export class FullValueTepApprovalComponent implements OnInit, OnDestroy {
  tepApprovalPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  filterForm = new FormGroup({});
  minPageSize: any;
  fullValueTepRequestsList: FullValueApprovalListItem[];
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  pageSizeOptions: number[] = [];
  pageSize = 10;
  pageIndex = 0;
  inValidSearch = false;
  totalElements: number;
  defaultSort: SortItem = { colId: 'createdDate', sort: 'Desc' };
  tepTypes = [
    {
      description: 'Full Value TEP',
      value: 'FULL_VALUE_TEP'
    },
    {
      description: 'Manual Full Value TEP',
      value: 'MANUAL_FULL_VALUE_TEP'
    }
  ];
  selectedTepType: string;
  downloadFileDetails: DocumentListResponse;
  filesList: DocumentListResponse[] = [
    {
      id: '1D901639-D16E-4155-8F73-7C1BADA2B40A',
      name: 'okk_277336.pdf'
    },
    {
      id: 'B27338DA-56BD-4EAB-818F-32E2AF83A7A8',
      name: 'download_259966.jpg'
    },
    {
      id: '98336F0D-068A-4BED-99D3-CCE651671AB1',
      name: 'cmprint_918758.pdf'
    }
  ];

  maxSortLimit = 1;
  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  sort: string[] = ['docNo,desc'];
  imageUrl: string;
  defaultImageUrl = 'assets/img/product-default-image.svg';

  constructor(
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private tepApprovalFacade: TepApprovalFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private fileFacade: FileFacade,
    private fileDownloadService: FileDownloadService,
    private sortService: SortDialogService,
  ) {
    this.filterForm = new FormGroup({
      locationCode: new FormControl('', [
        this.fieldValidatorsService.locationCodeField('Location Code')
      ]),
      mobileNumber: new FormControl('', [
        this.fieldValidatorsService.mobileField('Mobile Number')
      ]),
      tepType: new FormControl('FULL_VALUE_TEP')
    });
  }

  ngOnInit(): void {
    this.selectedTepType = 'FULL_VALUE_TEP';
    this.fileFacade.clearResponse();
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

    this.loadList();

    this.filterForm.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadList();
      });

    this.fileFacade
      .getDocumentsLst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docs => {
        if (docs) {
        }
      });

    this.fileFacade
      .getDocumentUrlById()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docUrl => {
        if (docUrl) {
          if (docUrl) {
            this.imageUrl = docUrl;
            this.showPopup();
          }
        }
      });

    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

      this.translate
      .get([
        'pw.regularTepApproval.reqNumber',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName: translatedMessages['pw.regularTepApproval.reqNumber'],
            sortAscOrder: false
          }
        ];
      });
  }

  getUploadedFiles(data) {
    this.fileFacade.loadDocumentsList({
      customerId: null,
      docType: 'AB',
      fileType: 'OTHERS',
      id: data.id,
      locationCode: data.locationCode
    });
  }

  openFileDownloadPopup(event: {
    filesList: DocumentListResponse[];
    locationCode: string;
  }) {
    const dialogRef = this.dialog.open(FileDownloadPopupComponent, {
      height: 'auto',
      width: '700px',
      autoFocus: false,
      data: {
        files: event.filesList?.length ? event.filesList : []
      }
    });
    dialogRef.componentInstance.downloadFile
      .pipe(takeUntil(this.destroy$))
      .subscribe(fileData => {
        this.downloadFileDetails = fileData;
        let extn = fileData.name.split('.').pop();
        extn = extn.toLowerCase();
        if (extn === FileTypeEnum.PDF) {
          this.fileFacade.downloadPdfFile({
            ...fileData,
            locationCode: event.locationCode
          });
        } else {
          this.fileFacade.loadDocumentUrlById(fileData.id, event.locationCode);
        }
      });
  }

  componentInit() {
    this.tepApprovalFacade
      .getfullValueTepRequestsListResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (fullValueTepRequestsResponse: FullValueTepRequestsResponse) => {
          if (fullValueTepRequestsResponse) {
            this.fullValueTepRequestsList =
              fullValueTepRequestsResponse.results;
            this.totalElements = fullValueTepRequestsResponse.totalElements;
            console.log('RESPONSE 123 $ :', this.fullValueTepRequestsList);
            console.log('TotalElements 123 $ :', this.totalElements);
          }
        }
      );

    this.isLoading$ = this.tepApprovalFacade.getIsLoading();

    this.tepApprovalFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepApprovalFacade
      .getFvtApprovedDetailsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((approvedDetails: any) => {
        if (approvedDetails) {
          this.showNotifications('Successfully updated the status!');
          this.loadList();
        }
      });
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.tepApprovalFacade.clearApprovalForFvtRequestResponse();
            }
          });
      });
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

  onTepTypeChanged(event: any) {
    console.log('EVENT ON TEP TYPE CHANGED :', event);
    if (event) {
      this.selectedTepType = event.value;
      this.loadList();
    }
  }

  loadList() {
    this.inValidSearch = false;
    const tepApprovalListRequest: CnApprovalListRequest = {
      approvalStatus: cnApprovalsEnum.PENDING,
      pageIndex: this.tepApprovalPageEvent.pageIndex,
      pageSize: this.tepApprovalPageEvent.pageSize,
      sort: this.sort,
      workflowType: this.selectedTepType,
      filterOptions: {
        dateRangeType: 'LAST_YEAR'
      }
    };
    const filterParams = {};
    if (this.filterForm.get('locationCode').value) {
      filterParams['locationCode'] = this.filterForm.get('locationCode').value;
    }
    if (this.filterForm.get('mobileNumber').value) {
      filterParams['mobileNo'] = this.filterForm.get('mobileNumber').value;
    }

    if (Object.keys(filterParams).length > 0) {
      tepApprovalListRequest.filterOptions.filterParams = filterParams;
    }
    if (this.filterForm.valid) {
      this.tepApprovalFacade.loadFullValueApprovalRequestsList(
        tepApprovalListRequest
      );
    } else {
      this.inValidSearch = true;
    }
  }

  clearMobileNumberSearch() {
    this.filterForm.get('mobileNumber').setValue('');
    this.filterForm.updateValueAndValidity();
  }

  clearLocationSearch() {
    this.filterForm.get('locationCode').setValue('');
    this.filterForm.updateValueAndValidity();
  }

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }

  getApprovedData(event: {
    data: FvtAcceptOrRejectRequestPayload;
    type: string;
    processId: string;
    taskId: string;
    taskName: string;
  }) {
    console.log('Event 123 :', event);
    const isApprove = event.type === 'APPROVE' ? true : false;
    this.tepApprovalFacade.sendApprovalForFvtRequest(
      isApprove,
      event.data,
      event.processId,
      event.taskId,
      event.taskName
    );
  }

  openSortDailog() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(take(1))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        this.sort = [];
        if (sortResult.actionfrom === 'apply') {
          const sortData = sortResult.data;
          if (sortData == null || sortData.length === 0) {
            this.sortData = [];
            this.sortOrder = null;
            this.sortBy = null;
          } else {
            this.sortData = sortData;
            if (sortData.length > 0) {
              this.sortData.forEach(sort=>{
                switch(sort.id)
                {
                  case 0: this.sortBy = 'docNo';
                    break;
                }
                this.sortOrder = sort.sortAscOrder ? 'asc' : 'desc';
                this.sort = [...this.sort, this.sortBy + ',' + this.sortOrder];
              })
            }
          }
          this.loadList();
        }
      });
  }

  showPopup(): void {
    this.dialog.open(FilePreviewComponent, {
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: this.imageUrl,
        previewHeader: 'File upload'
      }
    });
  }

  paginate(pageEvent: PageEvent) {
    this.tepApprovalPageEvent = pageEvent;
    this.loadList();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.tepApprovalFacade.clearApprovalForFvtRequestResponse();
    this.fileFacade.clearResponse();
  }
}
