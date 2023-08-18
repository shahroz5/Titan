import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ViewChild,
  AfterViewInit,
  ElementRef,
  TemplateRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, take, debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  OverlayNotificationType,
  OverlayNotificationEventRef,
  FileGroupEnum,
  OverlayNotificationEventType,
  NewFileUploadResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  FileUploadTypeEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  SortItem,
  FileNamesEnum,
  FilePathEnum,
  VendorUploadCount,
  FileUploadPopupEnum,
  ConfigurationsMenuKeyEnum
} from '@poss-web/shared/models';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { POSS_WEB_RAZORPAY_CONFIG_FILE_SIZE } from '@poss-web/shared/util-config';
import { FormControl, FormGroup } from '@angular/forms';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { RazorpayVendorConfigurationFacade } from '@poss-web/eposs/razorpay-vendor-config/data-access-razorpay-vendor-config';
const csvExtn = 'csv';
const reqfileKey = 'reqFile';

@Component({
  selector: 'poss-web-razorpay-vendor-list',
  templateUrl: './razorpay-vendor-list.component.html'
})
export class RazorpayVendorListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;
  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  formData: FormData = new FormData();
  destroy$: Subject<null> = new Subject<null>();
  fileResponse: VendorUploadCount;
  uploadResponse$: Observable<any>;
  totalElements$: Observable<number>;
  vendorList$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  count = 0;
  defaultSort: SortItem = { colId: 'createdDate', sort: 'Desc' };
  @ViewChild('fileInput') fileInput;
  filename: '';
  fileUploadErrorMsg: '';
  templatePath: '';
  successText: '';
  failedText: '';

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  configList: any[] = [];
  length = 0;
  pageSize = 10;
  minPageSize = 0;
  pageSizeOptions: number[] = [];

  // MatPaginator Output
  pageEvent: PageEvent;
  fileprocessId: string;
  fileError: boolean;
  isSearching = false;
  locationCode: any;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog,
    private fileFacade: FileFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private razorpayVendorConfigurationFacade: RazorpayVendorConfigurationFacade,
    private fileDownloadService: FileDownloadService,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_RAZORPAY_CONFIG_FILE_SIZE) public fileSize
  ) {
    this.translate
      .get([
        'pw.fileUpload.razorpayVendorFileName',
        'pw.fileUpload.uploadFailedMsg',
        'pw.razorpayVendorConfiguration.templatePath',
        'pw.razorpayVendorConfiguration.successText',
        'pw.razorpayVendorConfiguration.failedText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.filename =
          translatedMessages['pw.fileUpload.razorpayVendorFileName'];
        this.fileUploadErrorMsg =
          translatedMessages['pw.fileUpload.uploadFailedMsg'];
        this.templatePath =
          translatedMessages['pw.razorpayVendorConfiguration.templatePath'];
        this.successText =
          translatedMessages['pw.razorpayVendorConfiguration.successText'];
        this.failedText =
          translatedMessages['pw.razorpayVendorConfiguration.failedText'];
      });
  }

  ngOnInit() {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.listingPageEvent.pageSize = data;
        this.pageSize = data;
        this.loadConfiguration(this.defaultSort);
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
    this.razorpayVendorConfigurationFacade.clearResponse();
    this.componentInit();
  }
  downloadFile() {
    this.fileDownloadService.download(
      FileNamesEnum.RAZORPAYVENDOR,
      FilePathEnum.RAZORPAYVENDOR
    );
  }
  componentInit() {
    this.fileFacade.clearResponse();
    this.uploadResponse$ = this.fileFacade.getFileUploadResponse();
    this.vendorList$ = this.razorpayVendorConfigurationFacade.GetVendorList();
    this.isLoading$ = this.razorpayVendorConfigurationFacade.getIsLoading();
    this.totalElements$ = this.razorpayVendorConfigurationFacade.getTotalElements();
    this.razorpayVendorConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
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

    this.uploadResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((fileResponse: NewFileUploadResponse) => {
        if (fileResponse) {
          if (fileResponse.hasError) {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.ERROR,
              message: fileResponse.message
            });
          } else {
            this.fileResponse = fileResponse.records;

            if (
              fileResponse.uploadType === FileUploadTypeEnum.SYNC &&
              this.fileResponse
            ) {
              this.fileError = fileResponse.hasError;
              const dialogRef = this.dialog.open(
                FileuploadConfirmationPopupComponent,
                {
                  width: '420px',
                  data: {
                    fileUploadResponse: this.fileResponse
                      ? this.fileResponse
                      : {},
                    isFileError: this.fileError,
                    label: 'Razorpay Vendors'
                  }
                }
              );
              dialogRef
                .afterClosed()
                .pipe(takeUntil(this.destroy$))
                .subscribe(data => {
                  if (data === FileUploadPopupEnum.DOWNLOAD) {
                    this.fileFacade.downloadErrorLog(
                      this.fileResponse.errorLogId,
                      FileGroupEnum.RAZORPAY_CONFIG
                    );
                  }
                });
              if (
                this.fileResponse.failureCount !== this.fileResponse.totalCount
              )
                this.loadConfiguration(this.defaultSort);
            } else if (fileResponse.uploadType === FileUploadTypeEnum.ASYNC) {
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

    this.vendorList$.pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      if (data) {
        this.configList = data;
        this.length = data.length;
      }
    });
  }
  uploadFile(event) {
    this.overlayNotification.close();
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: any = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage3';
        this.failureNotification(errorKey);
      }
      const extn = file.name.split('.').pop();
      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.failureNotification(errorKey);
      }
      const type = file.name.substring(0, 3);
      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        if (type) {
          formData.set(reqfileKey, file, file.name);
          this.fileFacade.loadFileUpload(
            formData,
            FileGroupEnum.RAZORPAY_CONFIG
          );
          this.fileInput.nativeElement.value = '';
        }
      }
    }
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
              this.back();
            }
          });
      });
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;

        this.locationCode = searchValue;
        if (searchValue) {
          this.search(searchValue.toUpperCase());
        } else this.clearSearch();
      });
  }
  failureNotification(key: string) {
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
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }
  errorHandler(error: CustomErrors) {
    if (error.code === 'ERR-LOC-001') {
      this.configList = [];
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(take(1))
        .subscribe((event: OverlayNotificationEventRef) => {
          // Action based event
        });
    }
  }
  sort(sortItem: SortItem) {
    if (sortItem) {
      this.defaultSort = sortItem;
    } else {
      this.defaultSort = { colId: 'createdDate', sort: 'Desc' };
    }
    this.loadConfiguration(this.defaultSort);
  }
  loadConfiguration(sortField?: SortItem, locationCode?: string) {
    this.razorpayVendorConfigurationFacade.loadVendorList(
      this.listingPageEvent,
      sortField,
      locationCode
    );
  }
  search(searchValue) {
    this.isSearching = true;
    if (fieldValidation.locationCodeField.pattern.test(searchValue)) {
      this.razorpayVendorConfigurationFacade.loadVendorList(
        this.listingPageEvent,
        this.defaultSort,
        searchValue.toUpperCase()
      );
    } else this.configList = [];
  }
  clearSearch() {
    this.isSearching = false;
    this.searchForm.reset();
    this.loadConfiguration();
  }
  ngOnDestroy(): void {
    this.fileFacade.clearResponse();
    this.destroy$.next();
    this.destroy$.complete();
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }
  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    if (this.isSearching)
      this.loadConfiguration(this.defaultSort, this.locationCode);
    else this.loadConfiguration(this.defaultSort);
  }
}
