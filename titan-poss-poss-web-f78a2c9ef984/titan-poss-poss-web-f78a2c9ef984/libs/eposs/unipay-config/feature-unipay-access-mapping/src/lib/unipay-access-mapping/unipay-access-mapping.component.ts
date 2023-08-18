import {
  getConfigurationHomeRouteUrl,
  getFileStatusRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
  OnDestroy,
  Inject,
  AfterViewInit,
  TemplateRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take, debounceTime } from 'rxjs/operators';
import { Subject, Observable, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { UnipayConfigurationFacade } from '@poss-web/eposs/unipay-config/data-access-unipay-config';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  AccessList,
  SortItem,
  FileNamesEnum,
  FilePathEnum,
  ConfigurationsMenuKeyEnum,
  FileUploadPopupEnum,
  VendorUploadCount,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  FileGroupEnum,
  OverlayNotificationEventType,
  NewFileUploadResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

import { PageEvent } from '@angular/material/paginator';
import { POSS_WEB_UNIPAY_HOST_CONFIG_FILE_SIZE } from '@poss-web/shared/util-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { MatDialog } from '@angular/material/dialog';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { FormControl, FormGroup } from '@angular/forms';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
const csvExtn = 'csv';
const reqfileKey = 'reqFile';

@Component({
  selector: 'poss-web-unipay-access-mapping',
  templateUrl: './unipay-access-mapping.component.html',
  styleUrls: ['./unipay-access-mapping.component.scss']
})
export class UnipayAccessMappingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  formData: FormData = new FormData();
  destroy$: Subject<null> = new Subject<null>();
  fileResponse: VendorUploadCount;
  unipayConfigPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  fileError: boolean;
  uploadResponse$: Observable<any>;
  updateResponse$: Observable<any>;
  accessList$: Observable<AccessList[]>;
  totalElements$: Observable<number>;
  isLoading$: Observable<boolean>;
  count = 0;
  defaultSort: SortItem = { colId: 'createdDate', sort: 'Desc' };
  filename: '';
  fileUploadErrorMsg: '';
  statusUpdateMsg: '';
  templatePath: '';
  statusFailedMsg: '';
  successText: '';
  failedText: '';
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  invalidSearch = false;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  @Output() updateAccessList = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput;
  context = this;

  length = 0;
  unipayConfiguration: any[] = [];
  locationCode: any;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number;
  // MatPaginator Output
  pageEvent: PageEvent;
  isSearching = false;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;

  constructor(
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private unipayConfigurationFacade: UnipayConfigurationFacade,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private dialog: MatDialog,
    public fileFacade: FileFacade,
    private fileDownloadService: FileDownloadService,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_UNIPAY_HOST_CONFIG_FILE_SIZE) public fileSize
  ) {
    this.translate
      .get([
        'pw.fileUpload.uploadFailedMsg',
        'pw.unipayConfiguration.itemQuantityLabelText',
        'pw.unipayConfiguration.itemWeightLableText',
        'pw.unipayConfiguration.statusUpdateMsg',

        'pw.unipayConfiguration.statusFailedMsg',
        'pw.unipayConfiguration.successText',
        'pw.unipayConfiguration.failedText'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fileUploadErrorMsg =
          translatedMessages['pw.fileUpload.uploadFailedMsg'];

        this.statusUpdateMsg =
          translatedMessages['pw.unipayConfiguration.statusUpdateMsg'];
        this.statusFailedMsg =
          translatedMessages['pw.unipayConfiguration.statusFailedMsg'];
        this.successText =
          translatedMessages['pw.unipayConfiguration.successText'];
        this.failedText =
          translatedMessages['pw.unipayConfiguration.failedText'];
      });
  }

  ngOnInit() {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.unipayConfigPageEvent.pageSize = data;
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
  downloadFile() {
    this.fileDownloadService.download(
      FileNamesEnum.UNIPAY,
      FilePathEnum.UNIPAY
    );
  }
  componentInit() {
    this.uploadResponse$ = this.fileFacade.getFileUploadResponse();
    this.fileFacade.clearResponse();
    this.accessList$ = this.unipayConfigurationFacade.GetAccessList();
    this.isLoading$ = this.unipayConfigurationFacade.getIsLoading();
    this.updateResponse$ = this.unipayConfigurationFacade.getUpdateResposne();
    this.totalElements$ = this.unipayConfigurationFacade.getTotalElements();
    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.unipayConfigurationFacade
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
                    label: 'Unipay Access Mapping'
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
                      this.fileResponse.errorLogId,
                      FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
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

    this.accessList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AccessList[]) => {
        this.unipayConfiguration = data;

        this.length = data.length;
        //   data.forEach(element => {
        //     console.log(element)
        //     this.rowData.push({ ...element });
        // });
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
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
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
  uploadFile(event) {
    //this.dataUploadFacade.clearResponse();

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
            FileGroupEnum.PAYMENT_HOSTNAME_MAPPING,
            'UNIPAY'
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

  search(searchValue) {
    this.isSearching = true;
    if (fieldValidation.locationCodeField.pattern.test(searchValue)) {
      this.unipayConfigurationFacade.loadAccessList(
        this.unipayConfigPageEvent,
        this.defaultSort,
        searchValue.toUpperCase()
      );

      this.invalidSearch = false;
    } else {
      this.unipayConfiguration = [];
      this.length = 0;
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.isSearching = false;
    this.searchForm.reset();
    this.loadConfiguration();
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

  // onCellClicked(event) {
  //   console.log(event);
  //   if (event.colDef.celId === 'Status') {
  //     this.updateAccessList.emit(event.data);

  //     this.unipayConfigurationFacade.updateAccessList({
  //       paymentHostnamesDetails: event.data
  //     });
  //   }
  // }

  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
  }
  ngOnDestroy(): void {
    this.unipayConfigurationFacade.clearResponse();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadConfiguration(sortField?: SortItem, locationCode?: string) {
    this.unipayConfigurationFacade.loadAccessList(
      this.unipayConfigPageEvent,
      sortField,
      locationCode
    );
  }

  paginate(pageEvent: PageEvent) {
    this.unipayConfigPageEvent = pageEvent;
    if (this.isSearching)
      this.loadConfiguration(this.defaultSort, this.locationCode);
    else this.loadConfiguration(this.defaultSort);
  }
}
