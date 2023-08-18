import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  TemplateRef
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take, debounceTime } from 'rxjs/operators';
import { Subject, Observable, fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getConfigurationHomeRouteUrl,
  getFileStatusRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  FileGroupEnum,
  NewFileUploadResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  FileUploadTypeEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  HostNameList,
  SortItem,
  ConfigurationsMenuKeyEnum,
  FileNamesEnum,
  FilePathEnum,
  FileUploadPopupEnum,
  FileUploadCount
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';

import { FileDownloadService } from '@poss-web/shared/util-common';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AirpayHostConfigurationFacade } from '@poss-web/eposs/airpay-host-config/data-access-airpay-host-config';
import { POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE } from '@poss-web/shared/util-config';
import { FormControl, FormGroup } from '@angular/forms';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
const csvExtn = 'csv';
const reqfileKey = 'reqFile';
@Component({
  selector: 'poss-web-airpay-host-list',
  templateUrl: './airpay-host-list.component.html'
})
export class AirpayHostListComponent
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
  fileResponse: FileUploadCount;
  uploadResponse$: Observable<any>;
  updateResponse$: Observable<any>;
  totalElements$: Observable<number>;
  hostNameList$: Observable<HostNameList[]>;
  isLoading$: Observable<boolean>;
  count = 0;
  defaultSort: SortItem = { colId: 'createdDate', sort: 'Desc' };
  @ViewChild('fileInput') fileInput;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  filename: '';
  fileUploadErrorMsg: '';
  statusUpdateMsg: '';
  templatePath: '';
  statusFailedMsg: '';
  successText: '';
  failedText: '';

  configList: any[] = [];
  length = 0;
  pageSize = 10;
  minPageSize = 0;
  pageSizeOptions: number[] = [];

  // MatPaginator Output
  pageEvent: PageEvent;
  fileError: boolean;
  isSearching = false;
  locationCode: any;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog,
    private appSettingFacade: AppsettingFacade,
    public  fileFacade: FileFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private airpayHostConfigurationFacade: AirpayHostConfigurationFacade,
    private fileDownloadService: FileDownloadService,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE) public fileSize
  ) {
    this.translate
      .get([
        'pw.fileUpload.airpayHostFileName',
        'pw.fileUpload.uploadFailedMsg',
        'pw.airpayHostConfiguration.statusUpdateMsg',
        'pw.airpayHostConfiguration.templatePath',
        'pw.airpayHostConfiguration.statusFailedMsg',
        'pw.airpayHostConfiguration.successText',
        'pw.airpayHostConfiguration.failedText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.filename = translatedMessages['pw.fileUpload.airpayHostFileName'];
        this.fileUploadErrorMsg =
          translatedMessages['pw.fileUpload.uploadFailedMsg'];
        this.templatePath =
          translatedMessages['pw.airpayHostConfiguration.templatePath'];
        this.statusUpdateMsg =
          translatedMessages['pw.airpayHostConfiguration.statusUpdateMsg'];
        this.statusFailedMsg =
          translatedMessages['pw.airpayHostConfiguration.statusFailedMsg'];
        this.successText =
          translatedMessages['pw.airpayHostConfiguration.successText'];
        this.failedText =
          translatedMessages['pw.airpayHostConfiguration.failedText'];
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
    this.fileFacade.clearResponse();
    this.componentInit();
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
  search(searchValue) {
    this.isSearching = true;
    if (fieldValidation.locationCodeField.pattern.test(searchValue)) {
      this.airpayHostConfigurationFacade.loadHostNameList(
        this.listingPageEvent,
        this.defaultSort,
        searchValue.toUpperCase()
      );
    } else {
      this.configList = [];
    }
  }
  downloadFile() {
    this.fileDownloadService.download(
      FileNamesEnum.AIRPAYHOST,
      FilePathEnum.AIRPAYHOST
    );
  }
  componentInit() {
    this.fileFacade.clearResponse();
    this.uploadResponse$ = this.fileFacade.getFileUploadResponse();
    this.hostNameList$ = this.airpayHostConfigurationFacade.GetHostNameList();
    this.isLoading$ = this.airpayHostConfigurationFacade.getIsLoading();

    this.totalElements$ = this.airpayHostConfigurationFacade.getTotalElements();
    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.airpayHostConfigurationFacade
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
        console.log(fileResponse, 'fileResponse');
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
                    label: 'Airpay Hosts'
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
                      FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
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

    this.hostNameList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: HostNameList[]) => {
        this.configList = data;
        this.length = data.length;
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
      console.log(file.name, 'check file');

      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.failureNotification(errorKey);
      }

      const type = file.name.substring(0, 3);

      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        console.log(this.filename, 'check2');

        if (type) {
          formData.set(reqfileKey, file, file.name);
          this.fileFacade.loadFileUpload(
            formData,
            FileGroupEnum.PAYMENT_HOSTNAME_MAPPING,
            'AIRPAY'
          );
          this.fileInput.nativeElement.value = '';
        }
      }
    }
  }
  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
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
  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
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
  sort(sortItem: SortItem) {
    if (sortItem) {
      this.defaultSort = sortItem;
    } else {
      this.defaultSort = { colId: 'createdDate', sort: 'Desc' };
    }
    this.loadConfiguration(this.defaultSort);
  }
  loadConfiguration(sortField?: SortItem, locationCode?: string) {
    this.airpayHostConfigurationFacade.loadHostNameList(
      this.listingPageEvent,
      sortField,
      locationCode
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  clearSearch() {
    this.isSearching = false;
    this.searchForm.reset();
    this.loadConfiguration();
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
