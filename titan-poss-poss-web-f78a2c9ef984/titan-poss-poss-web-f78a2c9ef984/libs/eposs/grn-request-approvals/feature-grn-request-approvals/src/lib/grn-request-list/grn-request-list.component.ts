import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { GrnRequestApprovalFacade } from '@poss-web/eposs/grn-request-approvals/data-access-grn-request-approvals';
import { getApprovalsHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, fromEvent, Subject } from 'rxjs';
import {
  GrnRequestApprovalListResponse,
  GrnRequestApprovalListRequest,
  grnRequestEnum,
  ApprovalsMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  CustomErrors,
  SaveGrnRequestApproval,
  SelectDropDownOption,
  DocumentListResponse,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  FileTypeEnum
} from '@poss-web/shared/models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil, take } from 'rxjs/Operators';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GrnFilterPopupComponent } from '../grn-filter-popup/grn-filter-popup.component';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { FileDownloadPopupComponent } from '@poss-web/shared/file-upload/ui-file-download-popup';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';

@Component({
  selector: 'poss-web-grn-request-list',
  templateUrl: './grn-request-list.component.html',
  styleUrls: ['./grn-request-list.component.scss']
})
export class GrnRequestListComponent implements OnInit, AfterViewInit {
  grnRequestList$: Observable<GrnRequestApprovalListResponse[]>;

  utcOffset = moment().startOf('day').utcOffset();
  @ViewChild('listSearchBox', { static: false })
  listSearchBox: ElementRef;

  @ViewChild('historySearchBox', { static: false })
  historySearchBox: ElementRef;

  searchForm: FormGroup;

  historyForm: FormGroup;
  destroy$ = new Subject();
  grnRequestEnum = grnRequestEnum;
  selectedGrnType = grnRequestEnum.ALL;
  invalidSearch = false;
  pageSize = 10;
  pageIndex = 0;
  isLoading$: Observable<boolean>;
  disableButton = true;
  type: string;
  currentDate = moment();
  minDate = moment('00010101', 'YYYYMMDD');
  isApproved: boolean;
  cancelType;
  isfilterApplied = false;
  isSearchApplied = false;
  filteredData = null;
  searchValue: string;
  searchByOptions: SelectDropDownOption[] = [];
  grnTypeArray: SelectDropDownOption[] = [];
  uploadedFilesLocationCode: string;
  filesList: DocumentListResponse[];
  downloadFileDetails: DocumentListResponse;
  imageUrl: string;
  defaultImageUrl = 'assets/img/product-default-image.svg';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private grnRequestApprovalFacade: GrnRequestApprovalFacade,
    private matDailog: MatDialog,
    public fileFacade: FileFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fileDownloadService: FileDownloadService,
    private alertPopUpService: AlertPopupServiceAbstraction,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.grnRequestApprovalFacade.loadReset();
    this.grnRequestList$ = this.grnRequestApprovalFacade.getGrnRequestList();
    this.isLoading$ = this.grnRequestApprovalFacade.getIsloading();

    this.translate
      .get([
        'pw.grnRequestApproval.srcLocationCode',
        'pw.grnRequestApproval.destLocationCode',
        'pw.grnRequestApproval.mfgDefect',
        'pw.grnRequestApproval.regularDefect',
        'pw.grnRequestApproval.all'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.searchByOptions = [
          {
            description:
              translatedMessages['pw.grnRequestApproval.srcLocationCode'],
            value: translatedMessages['pw.grnRequestApproval.srcLocationCode']
          },
          {
            description:
              translatedMessages['pw.grnRequestApproval.destLocationCode'],
            value: translatedMessages['pw.grnRequestApproval.destLocationCode']
          }
        ];

        this.searchForm = new FormGroup({
          searchValue: new FormControl(),
          selectedGrnType: new FormControl(this.selectedGrnType),
          searchBy: new FormControl(this.searchByOptions[0].description)
        });
        this.historyForm = new FormGroup({
          searchValue: new FormControl(),
          historyType: new FormControl(grnRequestEnum.APPROVED),
          searchBy: new FormControl(this.searchByOptions[0].description)
        });

        this.grnTypeArray.push(
          {
            value: grnRequestEnum.ALL,
            description: translatedMessages['pw.grnRequestApproval.all']
          },

          {
            value: grnRequestEnum.MFG_DEFECT,
            description: translatedMessages['pw.grnRequestApproval.mfgDefect']
          },
          {
            value: grnRequestEnum.REGULAR,
            description:
              translatedMessages['pw.grnRequestApproval.regularDefect']
          }
        );
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

    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.type = param['type'];
        this.loadList();
      });

    this.grnRequestApprovalFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {

          this.loadList();
          this.errorHandler(error);
        }
      });

    this.grnRequestApprovalFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true && this.isApproved) {
          this.showSuccessMessageNotification(
            'pw.grnRequestApproval.approveSuccessMsg'
          );
        } else if (hasUpdated === true && !this.isApproved) {
          this.showSuccessMessageNotification(
            'pw.grnRequestApproval.rejectSuccessMsg'
          );
        }
      });
  }

  onSearchDropDownChange(event) {
    if (this.isfilterApplied) {
      this.isfilterApplied = false;
      this.filteredData = null;
    }
    this.searchForm.get('searchBy').patchValue(event.value);
    this.historyForm.get('searchBy').patchValue(event.value);
    this.searchForm.get('searchValue').reset();
    this.historyForm.get('searchValue').reset();

    this.loadList();
  }
  save(saveGrnRequestApproval: SaveGrnRequestApproval) {
    this.isApproved =
      saveGrnRequestApproval.bulkApproverRequestObjectDto[0].approved;
    this.grnRequestApprovalFacade.saveGrnRequestStatus(saveGrnRequestApproval);
  }
  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            time: 2000,
            hasBackdrop: true
          })
          .events.subscribe();
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
      .subscribe(() => {
        // Action based event
      });
  }
  ngAfterViewInit(): void {
    fromEvent(this.listSearchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });

    fromEvent(this.historySearchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.historyForm.value.searchValue;
        if (searchValue) {
          this.searchHistoryList(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  radioChange(event) {
    this.pageIndex = 0;
    this.isSearchApplied = false;
    this.isfilterApplied = false;
    this.filteredData = null;
    this.historyForm.get('searchValue')?.reset();
    this.loadList();
  }
  search(searchValue: string) {
    this.isSearchApplied = true;
    this.searchValue = searchValue;
    this.searchList(searchValue);
  }
  clearSearch() {
    this.isSearchApplied = false;
    this.invalidSearch = false;
    this.searchForm.get('searchValue').reset();
    this.historyForm.get('searchValue').reset();
    this.pageIndex = 0;
    this.loadList();
  }

  getSelectedApprovalStatus() {
    let approvalStatus;
    if (this.type === 'list') {
      this.isfilterApplied = false;
      approvalStatus = grnRequestEnum.PENDING;
    } else if (this.type === 'history') {
      if (
        this.historyForm.get('historyType').value === grnRequestEnum.APPROVED
      ) {
        approvalStatus = grnRequestEnum.APPROVED;
      } else {
        approvalStatus = grnRequestEnum.REJECTED;
      }
    }
    return approvalStatus;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    if (this.isfilterApplied) {
      this.historyFilter(this.filteredData);
    }
    if (this.isSearchApplied) {
      this.searchList(this.searchList);
    }
    this.loadList();
  }
  openFilter() {
    if (this.isSearchApplied) {
      this.historyForm.get('searchValue').reset();
      this.loadList();
      this.isSearchApplied = null;
    }
    const dialog = this.matDailog.open(
      GrnFilterPopupComponent,

      { data: this.filteredData, disableClose: true }
    );
    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res.data) {
          this.pageIndex = 0;

          this.filteredData = res.data;
          this.historyFilter(res.data);
          this.isfilterApplied = true;
        } else {
          this.loadList();

          this.filteredData = null;
          this.isfilterApplied = false;
        }
      });
  }

  searchHistoryList(searchValue) {
    this.isSearchApplied = true;

    if (this.isfilterApplied) {
      this.filteredData = null;
      this.isfilterApplied = false;
      this.loadList();
    }

    const grnRequestApprovalListRequest: GrnRequestApprovalListRequest = {
      approvalStatus: this.getSelectedApprovalStatus(),
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      workflowType: grnRequestEnum.WORK_FLOW_TYPE,
      filterOptions: {
        dateRangeType: grnRequestEnum.ALL,

        filterParams: {
          srcLocationCode:
            this.historyForm.get('searchBy').value ===
            this.searchByOptions[0].value
              ? searchValue.toUpperCase()
              : undefined,
          locationCode:
            this.historyForm.get('searchBy').value ===
            this.searchByOptions[1].value
              ? searchValue.toUpperCase()
              : undefined
        }
      }
    };
    this.grnRequestApprovalFacade.loadGrnRequestList(
      grnRequestApprovalListRequest
    );
  }
  searchList(searchValue) {
    const grnRequestApprovalListRequest: GrnRequestApprovalListRequest = {
      approvalStatus: this.getSelectedApprovalStatus(),
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      workflowType: grnRequestEnum.WORK_FLOW_TYPE,
      filterOptions: {
        dateRangeType: grnRequestEnum.ALL,

        filterParams: {
          grnType:
            this.cancelType === grnRequestEnum.ALL
              ? undefined
              : this.cancelType,
          srcLocationCode:
            this.searchForm.get('searchBy').value ===
            this.searchByOptions[0].value
              ? searchValue.toUpperCase()
              : undefined,
          locationCode:
            this.searchForm.get('searchBy').value ===
            this.searchByOptions[1].value
              ? searchValue.toUpperCase()
              : undefined
        }
      }
    };
    this.grnRequestApprovalFacade.loadGrnRequestList(
      grnRequestApprovalListRequest
    );
  }
  loadList() {
    const grnRequestApprovalListRequest: GrnRequestApprovalListRequest = {
      approvalStatus: this.getSelectedApprovalStatus(),
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      workflowType: grnRequestEnum.WORK_FLOW_TYPE,
      filterOptions: {
        dateRangeType: grnRequestEnum.CUSTOM,
        startDate: this.minDate,
        endDate: this.currentDate,
        filterParams: {
          grnType:
            this.cancelType === grnRequestEnum.ALL ? undefined : this.cancelType
        }
      }
    };
    this.grnRequestApprovalFacade.loadGrnRequestList(
      grnRequestApprovalListRequest
    );
  }

  historyFilter(data) {
    const grnRequestApprovalListRequest: GrnRequestApprovalListRequest = {
      approvalStatus: this.getSelectedApprovalStatus(),
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      workflowType: grnRequestEnum.WORK_FLOW_TYPE,
      filterOptions: {
        dateRangeType: grnRequestEnum.CUSTOM,
        startDate: data.startDate
          ? data.startDate.startOf('day').add(this.utcOffset, 'm').valueOf()
          : this.minDate,
        endDate: data.endDate
          ? data.endDate.startOf('day').add(this.utcOffset, 'm').valueOf()
          : this.currentDate,
        fiscalYear: data.fiscalYear ? data.fiscalYear : undefined,
        filterParams: {
          grnType:
            data.grnType === grnRequestEnum.ALL ? undefined : data.grnType,
          srcLocationCode: data.srcLocationCode
            ? data.srcLocationCode
            : undefined,
          locationCode: data.destLocationCode
            ? data.destLocationCode
            : undefined
        }
      }
    };
    this.grnRequestApprovalFacade.loadGrnRequestList(
      grnRequestApprovalListRequest
    );
  }

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
    this.grnRequestApprovalFacade.loadReset();
  }

  onDropDownValueChange(changeEvent) {
    this.cancelType = changeEvent.value;
    this.pageIndex = 0;
    this.pageSize = 10;
    this.loadList();
  }

  changeTab(type) {
    this.isSearchApplied = false;
    this.isfilterApplied = false;
    this.filteredData = null;

    this.disableButton = true;
    this.searchForm.get('searchValue').reset();
    this.historyForm.get('searchValue').reset();
    this.searchForm
      .get('searchBy')
      .patchValue(this.searchByOptions[0].description);
    this.historyForm
      .get('searchBy')
      .patchValue(this.searchByOptions[0].description);
    this.grnRequestApprovalFacade.loadReset();
    this.pageIndex = 0;

    this.router.navigate(['..', type], {
      relativeTo: this.activatedRoute
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
    this.uploadedFilesLocationCode = data.srcBoutiqueCode;
    this.fileFacade.loadDocumentsList({
      customerId: null,
      docType: 'GRN',
      fileType: 'OTHERS',
      id: data.refId,
      locationCode: data.srcBoutiqueCode
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();    
    this.fileFacade.clearResponse();

  }
}
