import {
  getConfigurationHomeRouteUrl,
  getFileStatusRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  Inject,
  TemplateRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  SortItem,
  FileNamesEnum,
  FilePathEnum,
  GvStatusList,
  GiftVoucherStatusDropdownEnum,
  GVStatusListingPayload,
  GVExtendValidity,
  GVStatusChange,
  ConfigurationsMenuKeyEnum,
  FileUploadPopupEnum,
  VendorUploadCount,
  FileGroupEnum,
  OverlayNotificationEventType,
  NewFileUploadResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  OverlayNotificationEventRef
} from '@poss-web/shared/models';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { TranslateService } from '@ngx-translate/core';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil, take } from 'rxjs/operators';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { POSS_WEB_GV_STATUS_UPDATE_CONFIG_FILE_SIZE } from '@poss-web/shared/util-config';
import { GVStatusUpdateFacade } from '@poss-web/eposs/gv-status-update/data-access-gv-status-update';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
const csvExtn = 'csv';
const reqfileKey = 'reqFile';

@Component({
  selector: 'poss-web-gv-status-update',
  templateUrl: './gv-status-update.component.html',
  styleUrls: ['./gv-status-update.component.scss']
})
export class GvStatusUpdateComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  @ViewChild('fileInput') fileInput;

  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('GVSuccessNotificationTemplate', { static: true })
  GVSuccessNotificationTemplate: TemplateRef<any>;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  fileResponse: VendorUploadCount;
  // filterSelected = new FormControl(
  //   GiftVoucherStatusDropdownEnum.REDEEMABLE_VALUE
  // );
  filterSelected = new FormControl();
  totalElements$: Observable<number>;
  gvStatusPageEvent: GVStatusListingPayload = {
    pageIndex: 0,
    pageSize: 0,
    length: 0,
    serialNo: '',
    status: GiftVoucherStatusDropdownEnum.REDEEMABLE_VALUE
  };
  fileError: boolean;
  successCount = 0;
  successAmount = 0;
  gvStatusList: GvStatusList[] = [];
  uploadResponse$: Observable<any>;
  updateResponse$: Observable<any>;
  newList$: Observable<GvStatusList[]>;
  gvStatusList$: Observable<GvStatusList[]>;
  count = 0;
  length = 0;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number;
  defaultSort: SortItem = { colId: 'createdDate', sort: 'Asc' };
  invalidSearch = false;
  currentDate = moment();
  date = moment();
  dateFormControl: FormControl;
  extendValidityEnabled = true;

  dropDownvalues = [
    {
      value: GiftVoucherStatusDropdownEnum.REDEEMABLE_CODE,
      description: GiftVoucherStatusDropdownEnum.REDEEMABLE_VALUE,
      isActive: true
    },
    {
      value: GiftVoucherStatusDropdownEnum.INACTIVE_CODE,
      description: GiftVoucherStatusDropdownEnum.INACTIVE_VALUE,
      isActive: true
    },
    {
      value: GiftVoucherStatusDropdownEnum.ISSUEDTORO_CODE,
      description: GiftVoucherStatusDropdownEnum.ISSUEDTORO_VALUE,
      isActive: true
    },
    {
      value: GiftVoucherStatusDropdownEnum.FOR_INWARDING_CODE,
      description: GiftVoucherStatusDropdownEnum.FOR_INWARDING_VALUE,
      isActive: true
    },
    {
      value: GiftVoucherStatusDropdownEnum.BLOCKED_CODE,
      description: GiftVoucherStatusDropdownEnum.BLOCKED_VALUE,
      isActive: true
    },
    {
      value: GiftVoucherStatusDropdownEnum.REDEEMED_CODE,
      description: GiftVoucherStatusDropdownEnum.REDEEMED_VALUE,
      isActive: true
    },
    {
      value: GiftVoucherStatusDropdownEnum.CANCELLED_CODE,
      description: GiftVoucherStatusDropdownEnum.CANCELLED_VALUE,
      isActive: true
    },
    {
      value: GiftVoucherStatusDropdownEnum.FORCECLOSED_CODE,
      description: GiftVoucherStatusDropdownEnum.FORCECLOSED_VALUE,
      isActive: true
    },
    {
      value: GiftVoucherStatusDropdownEnum.EXPIRED_CODE,
      description: GiftVoucherStatusDropdownEnum.EXPIRED_VALUE,
      isActive: true
    },
    {
      value: GiftVoucherStatusDropdownEnum.AUTO_CANCELLATION_CODE,
      description: GiftVoucherStatusDropdownEnum.AUTO_CANCELLATION_VALUE,
      isActive: true
    }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fileDownloadService: FileDownloadService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private dialog: MatDialog,
    private gvStatusUpdateFacade: GVStatusUpdateFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private appSettingFacade: AppsettingFacade,
    private fileFacade: FileFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_GV_STATUS_UPDATE_CONFIG_FILE_SIZE) public fileSize
  ) {}

  ngOnInit() {
    // this.appSettingFacade
    //   .getPageSize()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(data => {
    //     this.gvStatusPageEvent.pageSize = data;
    //     this.pageSize = data;
    //     this.loadConfiguration(this.defaultSort);
    //   });
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
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }
  componentInit() {
    this.fileFacade.clearResponse();
    this.newList$ = this.gvStatusUpdateFacade.getNewList();
    this.uploadResponse$ = this.fileFacade.getFileUploadResponse();
    this.gvStatusList$ = this.gvStatusUpdateFacade.GetGVStatusList();
    this.isLoading$ = this.gvStatusUpdateFacade.getIsLoading();
    this.totalElements$ = this.gvStatusUpdateFacade.getTotalElements();

    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.gvStatusUpdateFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.uploadResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((uploadResponseData: NewFileUploadResponse) => {
        if (uploadResponseData) {
          if (uploadResponseData.hasError) {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.ERROR,
              message: uploadResponseData.message
            });
          } else {
            this.fileResponse = uploadResponseData.records;
            if (this.fileResponse !== null) {
              this.fileError = uploadResponseData.hasError;
              const dialogRef = this.dialog.open(
                FileuploadConfirmationPopupComponent,
                {
                  width: '420px',
                  data: {
                    fileUploadResponse: this.fileResponse
                      ? this.fileResponse
                      : {},

                    isFileError: this.fileError,
                    label: 'GV Status Update'
                  }
                }
              );
              dialogRef
                .afterClosed()
                .pipe(takeUntil(this.destroy$))
                .subscribe(data => {
                  if (data === FileUploadPopupEnum.OK) {
                    dialogRef.close();
                  } else if (data === FileUploadPopupEnum.DOWNLOAD) {
                    this.fileFacade.downloadErrorLog(
                      uploadResponseData.records.errorLogId,
                      this.extendValidityEnabled
                        ? FileGroupEnum.GV_VALIDITY_EXTEND
                        : FileGroupEnum.GV_STATUS_UPDATE
                    );
                  }
                });
              if (
                this.fileResponse.failureCount !== this.fileResponse.totalCount
              )
                this.loadConfiguration(this.defaultSort);
            } else if (uploadResponseData !== undefined) {
              this.showConfirmReceiveSuccessNotification();
              this.loadConfiguration(this.defaultSort);
            }
          }
        }
      });

    this.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        if (data) {
          this.count = data;
        }
      });

    this.newList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((updateResponseData: any) => {
        console.log(updateResponseData);
        if (updateResponseData && updateResponseData.length > 0) {
          this.successAmount = 0;
          this.successCount = updateResponseData.length;
          updateResponseData.forEach(element => {
            this.gvStatusList
              .filter(giftvoucher => {
                if (giftvoucher.serialNo === element.serialNo) {
                  return true;
                }
              })
              .forEach(row => {
                this.successAmount += row.totalValue;
              });
          });
        }
        if (this.successCount > 0) {
          this.showSuccessMessageNotification();
        }
      });

    this.gvStatusList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: GvStatusList[]) => {
        if (data) {
          this.gvStatusList = data;

          this.length = data.length;
        }
      });

    this.dateFormControl = new FormControl(moment().format(), [
      this.fieldValidatorsService.requiredField('Date')
    ]);
  }

  showConfirmReceiveSuccessNotification() {
    const key = 'pw.fileUpload.fileUploadStatusMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMsg,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.overlayNotification.close();
            }
          });
      });
  }
  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
  }
  statusChange(selected) {
    this.gvStatusPageEvent = {
      ...this.gvStatusPageEvent,
      status: selected.value
    };
    this.loadConfiguration(this.defaultSort);
    this.checkMatDatePicker();
  }
  ngOnDestroy() {
    this.gvStatusUpdateFacade.clearResponse();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  extentValidity(gvList: GVExtendValidity) {
    if (!this.checkMatDatePicker()) {
      this.gvStatusUpdateFacade.validityExtend(gvList);
    }
  }

  changeStatus(gvList: GVStatusChange) {
    this.gvStatusUpdateFacade.changeStatus(gvList);
  }
  search(searchValue) {
    if (
      fieldValidation.giftVoucherSerialNumberSearchField.pattern.test(
        searchValue
      )
    ) {
      this.gvStatusPageEvent = {
        ...this.gvStatusPageEvent,
        serialNo: searchValue,
        pageIndex: 0
      };
      this.loadConfiguration(this.defaultSort);

      this.invalidSearch = false;
    } else {
      this.invalidSearch = false;
      this.gvStatusList = [];
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.gvStatusPageEvent = {
      ...this.gvStatusPageEvent,
      serialNo: ''
    };
    this.loadConfiguration(this.defaultSort);
  }

  uploadFile(event) {
    this.overlayNotification.close();
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: any = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage3';
        this.showNotifications(errorKey);
      }
      const extn = file.name.split('.').pop();
      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.showNotifications(errorKey);
      }

      const type = file.name.substring(0, 3);

      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        if (type) {
          formData.set(reqfileKey, file, file.name);
          this.fileFacade.loadFileUpload(
            formData,
            this.extendValidityEnabled
              ? FileGroupEnum.GV_VALIDITY_EXTEND
              : FileGroupEnum.GV_STATUS_UPDATE
          );
          this.fileInput.nativeElement.value = '';
        }
      }
    }
  }
  downloadFile() {
    this.extendValidityEnabled
      ? this.fileDownloadService.download(
          FileNamesEnum.GV_EXTEND_VALIDITY,
          FilePathEnum.GV_EXTEND_VALIDITY
        )
      : this.fileDownloadService.download(
          FileNamesEnum.GV_STATUS_UPDATE,
          FilePathEnum.GV_STATUS_UPDATE
        );
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
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {});
      });
  }
  onSelectionChange() {
    this.extendValidityEnabled = !this.extendValidityEnabled;
    this.checkMatDatePicker();
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {});
  }

  loadConfiguration(sortField?: SortItem) {
    this.gvStatusUpdateFacade.loadGVStatusList(
      this.gvStatusPageEvent,
      sortField
    );
  }
  paginate(pageEvent: GVStatusListingPayload) {
    this.gvStatusPageEvent = pageEvent;

    this.gvStatusPageEvent = {
      ...this.gvStatusPageEvent,
      status: this.filterSelected.value
    };
    this.loadConfiguration(this.defaultSort);
  }

  checkMatDatePicker() {
    if (
      this.extendValidityEnabled &&
      this.filterSelected.value ===
        GiftVoucherStatusDropdownEnum.REDEEMABLE_VALUE
    ) {
      this.dateFormControl.enable();
      return false;
    } else {
      this.dateFormControl.disable();
      return true;
    }
  }

  showSuccessMessageNotification() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.GVSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.loadConfiguration(this.defaultSort);
      });
  }
}
