import { ErrorEnums } from '@poss-web/shared/util-error';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { GSTMappingFormComponent } from '@poss-web/eposs/gst-mapping/ui-gst-mapping-form';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Inject,
  TemplateRef
} from '@angular/core';
import {
  OverlayNotificationServiceAbstraction,
  GSTMappingDetails,
  OverlayNotificationType,
  CustomErrors,
  FileNamesEnum,
  FilePathEnum,
  Lov,
  Tax,
  GSTMappingFilter,
  ConfigurationsMenuKeyEnum,
  GSTMappingFormTypeEnum,
  FileUploadCount,
  FileUploadPopupEnum,
  FileGroupEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  FileUploadTypeEnum,
  NewFileUploadResponse,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { GSTMappingFacade } from '@poss-web/eposs/gst-mapping/data-access-gst-mapping';
import { Router } from '@angular/router';
import {
  getConfigurationHomeRouteUrl,
  getFileStatusRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';
import { POSS_WEB_GST_DETAILS_FILE_SIZE } from '@poss-web/shared/util-config';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';

const csvExtn = 'csv';
const reqfileKey = 'reqFile';
@Component({
  selector: 'poss-web-gst-mapping',
  templateUrl: './gst-mapping.component.html',
  styleUrls: []
})
export class GSTMappingComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<null>();
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;
  gstMappingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  @ViewChild('fileInput') fileInput;
  context = this;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  gstMappingList: GSTMappingDetails[];
  totaElements$: Observable<number>;
  isLoading$: Observable<boolean>;

  srcLocationTypes: SelectDropDownOption[] = [
    {
      value: 'L1',
      description: 'L1'
    },
    {
      value: 'L2',
      description: 'L2'
    },
    {
      value: 'L3',
      description: 'L3'
    },
    {
      value: 'FAC',
      description: 'FACTORY'
    },
    {
      value: 'CFA',
      description: 'CFA'
    }
    ];
  destLocationTypes: SelectDropDownOption[] = [
    {
      value: 'L1',
      description: 'L1'
    },
    {
      value: 'L2',
      description: 'L2'
    },
    {
      value: 'L3',
      description: 'L3'
    },
    {
      value: 'FAC',
      description: 'FACTORY'
    },
    {
      value: 'CFA',
      description: 'CFA'
    }
    ];
  customerTypes: string[] = ['REGISTERED', 'NONREGISTERED'];
  txnTypes: Lov[];
  taxes: Tax[];

  filter: GSTMappingFilter = {
    isActive: null,
    customerTaxType: null,
    destLocationTaxType: null,
    srcLocationTaxType: null,
    txnType: null
  };
  hasFilter = false;
  filename: '';
  fileResponse: FileUploadCount;
  gstMappingLable: string;

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private appsettingFacade: AppsettingFacade,
    private gstMappingFacade: GSTMappingFacade,
    private router: Router,
    private translate: TranslateService,
    private fileDownloadService: FileDownloadService,
    private fileFacade: FileFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_GST_DETAILS_FILE_SIZE) public fileSize
  ) {}

  ngOnInit(): void {
    this.gstMappingFacade.resetData();
    this.fileFacade.clearResponse();
    this.translate
      .get([
        'pw.fileUpload.gstMappingFileName',
        'pw.gstMapping.gstMappingLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.filename = translatedMessages['pw.fileUpload.gstMappingFileName'];
        this.gstMappingLable =
          translatedMessages['pw.gstMapping.gstMappingLabel'];
      });



    this.fileFacade
      .getFileUploadResponse()
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
              const dialogRef = this.dialog.open(
                FileuploadConfirmationPopupComponent,
                {
                  width: '420px',
                  disableClose: true,
                  data: {
                    fileUploadResponse: this.fileResponse
                      ? this.fileResponse
                      : {},
                    isFileError: fileResponse.hasError,
                    label: this.gstMappingLable
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
                      FileGroupEnum.TAX_CONFIG
                    );
                  }

                  this.fileFacade.clearResponse();
                });
              if (
                this.fileResponse &&
                this.fileResponse.successCount === this.fileResponse.totalCount
              ) {
                this.loadGSTMappingList();
              }
            } else if (fileResponse.uploadType === FileUploadTypeEnum.ASYNC) {
              this.showConfirmReceiveSuccessNotification();
              this.loadGSTMappingList();
            }
          }
        }
      });

    this.gstMappingFacade.loadTransactionTypes();
    this.gstMappingFacade.loadTaxes();

    this.gstMappingFacade
      .getReloadStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (status && status.reload) {
          this.successNotification(status.type);

          this.loadGSTMappingList();
        }
      });

    this.gstMappingFacade
      .getTxnTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(txnTypes => {
        this.txnTypes = txnTypes;
      });

    this.gstMappingFacade
      .getTaxes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(taxes => {
        this.taxes = taxes;
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.gstMappingPageEvent.pageSize = pageSize;
        this.loadGSTMappingList();
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

    this.gstMappingFacade
      .getGSTMappingList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((gstDetails: GSTMappingDetails[]) => {
        if (gstDetails) {
          this.gstMappingList = gstDetails;
        }
      });

    this.gstMappingFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.totaElements$ = this.gstMappingFacade.getTotalElements();
    this.isLoading$ = this.gstMappingFacade.getIsLoading();
  }

  uploadFile(event) {
    this.overlayNotification.close();
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: any = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage';
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
          this.fileFacade.loadFileUpload(formData, FileGroupEnum.TAX_CONFIG);
          this.fileInput.nativeElement.value = '';
        }
      }
    }
  }

  loadGSTMappingList() {
    this.gstMappingFacade.loadGSTMappingList({
      pageIndex: this.gstMappingPageEvent.pageIndex,
      pageSize: this.gstMappingPageEvent.pageSize,
      filter: this.filter
    });
  }

  createNew() {
    this.openForm(GSTMappingFormTypeEnum.NEW);
  }

  openFilter() {
    this.openForm(GSTMappingFormTypeEnum.FILTER);
  }

  edit(config: GSTMappingDetails) {
    this.openForm(GSTMappingFormTypeEnum.EDIT, config);
  }

  openForm(type: GSTMappingFormTypeEnum, config?: GSTMappingDetails) {
    this.dialog
      .open(GSTMappingFormComponent, {
        autoFocus: false,
        disableClose: true,
        width: '450px',
        data: {
          type: type,
          filterData: this.filter,
          configData: config,
          txnTypes: this.txnTypes,
          taxes: this.taxes,
          srcLocationTypes: this.srcLocationTypes,
          destLocationTypes: this.destLocationTypes,
          customerTypes: this.customerTypes
        }
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          if (type === GSTMappingFormTypeEnum.NEW) {
            this.gstMappingFacade.addGSTMapping(data);
          } else if (type === GSTMappingFormTypeEnum.EDIT) {
            this.gstMappingFacade.editGSTMapping({
              configId: config.id,
              data
            });
          } else if (type === GSTMappingFormTypeEnum.FILTER) {
            this.filter = data;
            if (
              this.filter.isActive !== null ||
              !!this.filter.customerTaxType ||
              !!this.filter.destLocationTaxType ||
              !!this.filter.srcLocationTaxType ||
              !!this.filter.txnType
            ) {
              this.hasFilter = true;
            } else {
              this.hasFilter = false;
            }
            this.gstMappingPageEvent.pageIndex = 0;
            this.loadGSTMappingList();
          }
        }
      });
  }
  downloadFile() {
    this.fileDownloadService.download(
      FileNamesEnum.GST_MAPPING,
      FilePathEnum.GST_MAPPING
    );
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
  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          message: translatedMsg,
          hasClose: true,
          hasBackdrop: true
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
  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
  }
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_CORE_012) {
      const key = 'pw.gstMapping.addErrorMsg';
      this.translate
        .get(key)
        .pipe(take(1))
        .subscribe((translatedMsg: string) => {
          this.overlayNotification.show({
            type: OverlayNotificationType.SIMPLE,
            hasBackdrop: true,
            hasClose: true,
            message: translatedMsg
          });
        });
    } else {
      this.overlayNotification.show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: false,
        hasClose: true,
        error: error
      });
    }
  }

  successNotification(type: string) {
    let key;
    if (type === 'NEW') {
      key = 'pw.gstMapping.addSuccuessMsg';
    } else {
      key = 'pw.gstMapping.updateSuccuessMsg';
    }
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.TIMER,
          hasBackdrop: false,
          message: translatedMsg
        });
      });
  }

  paginate(pageEvent: PageEvent) {
    this.gstMappingPageEvent = pageEvent;
    this.loadGSTMappingList();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
