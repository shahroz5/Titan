import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  Inject,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject, fromEvent } from 'rxjs';
import { FileDownloadService } from '@poss-web/shared/util-common';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  FileNamesEnum,
  FilePathEnum,
  OverlayNotificationEventType,
  FileGroupEnum,
  FileUploadPopupEnum,
  NewFileUploadResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  F2MarginList,
  FileUploadCount,
  MasterMenuKeyEnum,
  FileUploadTypeEnum
} from '@poss-web/shared/models';
import { takeUntil, take, debounceTime } from 'rxjs/operators';
import {
  getFileStatusRouteUrl,
  getMasterHomeRouteUrl
} from '@poss-web/shared/util-site-routes';

import { TranslateService } from '@ngx-translate/core';

import { PageEvent } from '@angular/material/paginator';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE } from '@poss-web/shared/util-config';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { F2MarginFacade } from '@poss-web/shared/f2-margin/data-access-f2-margin';
import { FormGroup, FormControl } from '@angular/forms';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
const csvExtn = 'csv';
const reqfileKey = 'reqFile';

@Component({
  selector: 'poss-web-f2-margin-list',
  templateUrl: './f2-margin-list.component.html'
})
export class F2MarginListComponent implements OnInit, OnDestroy, AfterViewInit {
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  fileResponse: FileUploadCount;
  fileError: boolean;
  params: string;
  isLoading$: Observable<boolean>;
  uploadResponse$: Observable<any>;

  f2MarginList$: Observable<F2MarginList[]>;
  totalElements$: Observable<number>;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;
  f2MarginLabel: string;
  invalidSearch: boolean;
  searchValue: string;

  constructor(
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private router: Router,
    private fileFacade: FileFacade,
    private f2MarginFacade: F2MarginFacade,
    private appsettingFacade: AppsettingFacade,
    private fileDownloadService: FileDownloadService,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE) public fileSize
  ) {}

  ngOnInit() {
    this.fileFacade.clearResponse();
    this.f2MarginFacade.loadReset();
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.initialPageEvent.pageSize = pageSize;
        this.pageEvent.pageSize = pageSize;
        this.loadF2MarginList();
      });
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.isLoading$ = this.f2MarginFacade.getIsloading();

    this.translate
      .get(['pw.cashbackConfig.cardDetails'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.f2MarginLabel =
          translatedMessages['pw.cashbackConfig.cardDetails'];
      });

    this.f2MarginList$ = this.f2MarginFacade.getF2MarginList();
    this.totalElements$ = this.f2MarginFacade.getTotalElements();

    this.uploadResponse$ = this.fileFacade.getFileUploadResponse();
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
                    label: this.f2MarginLabel
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
                      FileGroupEnum.CARD_DETAILS
                    );
                  }
                });
              if (
                this.fileResponse.failureCount !== this.fileResponse.totalCount
              )
                this.loadF2MarginList();
            } else if (fileResponse.uploadType === FileUploadTypeEnum.ASYNC) {
              this.showConfirmReceiveSuccessNotification();
              this.loadF2MarginList();
            }
          }
        }
      });

    this.f2MarginFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue) {
    this.searchValue = searchValue;
    if (fieldValidation.productGroupCodeField.pattern.test(searchValue)) {
      this.loadF2MarginList();
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.searchForm.reset();
    this.searchValue = null;
    this.invalidSearch = false;
    this.initialPageEvent = this.pageEvent;
    this.loadF2MarginList();
  }

  downloadFileFormat() {
    this.fileDownloadService.download(
      FileNamesEnum.PRODUCT_PRICE_MAPPING,
      FilePathEnum.PRODUCT_PRICE_MAPPING
    );
  }
  paginate(pageEvent: PageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadF2MarginList();
  }
  loadF2MarginList() {
    this.f2MarginFacade.loadF2MarginList({
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      cfaCode: this.searchValue ? this.searchValue : undefined
    });
  }

  uploadFile(event) {
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage3';
        this.showNotifications(errorKey);
      }
      const extn = file.name.split('.').pop();
      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.showNotifications(errorKey);
      }
      const name = file.name.substring(0, 3);

      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        if (name) {
          formData.set(reqfileKey, file, file.name);

          this.fileFacade.loadFileUpload(
            formData,
            FileGroupEnum.PRODUCT_PRICE_MAPPING
          );
        }
      }
    }
  }

  back() {
    this.f2MarginFacade.loadReset();
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_PRICING_MENU_KEY
      }
    });
  }

  showNotifications(key) {
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
          .subscribe();
      });
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === 'ERR-PAY-033') {
      return;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
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
              this.back();
            }
          });
      });
  }
  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
