import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Inject,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataUploadFacade } from '@poss-web/eposs/data-upload/data-access-data-upload';
import {
  FileTypesEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  Command,
  ShortcutServiceAbstraction,
  FileUploadPopupEnum,
  FileGroupEnum,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  NewFileUploadResponse,
  FileUploadCount,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  FileUploadTypeEnum
} from '@poss-web/shared/models';
import { getInventoryRouteUrl,getFileStatusRouteUrl } from '@poss-web/shared/util-site-routes';
import { POSS_WEB_FILE_SIZE_FIR_MER } from '@poss-web/shared/util-config';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { MatDialog } from '@angular/material/dialog';

const csvExtn = 'csv';
const reqfileKey = 'reqFile';
const stockFileKey = 'stockFile';
const firmerShortcutKey = 'Common.MENU_1';
const invoiceShortcutKey = 'Common.MENU_2';
const stnShortcutKey = 'Common.MENU_3';
const componentName = 'DataUploadComponent';

@Component({
  selector: 'poss-web-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.scss']
})
export class DataUploadComponent implements OnInit, OnDestroy {
  formData: FormData = new FormData();
  destroy$: Subject<null> = new Subject<null>();
  FIRFileUploadResponse$: Observable<NewFileUploadResponse>;
  MERFileUploadResponse$: Observable<NewFileUploadResponse>;
  InvoiceUploadResponse$: Observable<boolean>;
  STNUploadResponse$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  @ViewChild('fileInput', { static: true, read: ElementRef })
  fileInput: ElementRef;
  fileResponse: FileUploadCount;
  fileError: boolean;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('menuRef') menuRef: ElementRef;

  constructor(
    private dataUploadFacade: DataUploadFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private fileFacade: FileFacade,
    private dialog: MatDialog,
    private shortcutService: ShortcutServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_FILE_SIZE_FIR_MER) public fileSize
  ) {}

  ngOnInit() {
    this.dataUploadFacade.clearResponse();
    this.shortcutService.componentNames = [componentName]; 
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
    this.componentInit();
  }

  componentInit() {
    this.FIRFileUploadResponse$ = this.dataUploadFacade.getFIRFileUploadResponse();
    this.MERFileUploadResponse$ = this.dataUploadFacade.getMERFileUploadResponse();
    this.InvoiceUploadResponse$ = this.dataUploadFacade.getInvoiceUploadResponse();
    this.STNUploadResponse$ = this.dataUploadFacade.getSTNUploadResponse();
    this.isLoading$ = this.dataUploadFacade.getIsLoading();

    this.dataUploadFacade
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

    this.FIRFileUploadResponse$.pipe(takeUntil(this.destroy$)).subscribe(
      (fileResponse: NewFileUploadResponse) => {
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
                    label: 'FIR'
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
                      FileGroupEnum.FIR
                    );
                  }
                });
            } else if (fileResponse.uploadType === FileUploadTypeEnum.ASYNC) {
              this.showConfirmReceiveSuccessNotification();
            }
          }
        }
      }
    );

    this.MERFileUploadResponse$.pipe(takeUntil(this.destroy$)).subscribe(
      (fileResponse: NewFileUploadResponse) => {
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
                    label: 'MER'
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
                      FileGroupEnum.MER
                    );
                  }
                });
            } else if (fileResponse.uploadType === FileUploadTypeEnum.ASYNC) {
              this.showConfirmReceiveSuccessNotification();
            }
          }
        }
      }
    );

    this.InvoiceUploadResponse$.pipe(takeUntil(this.destroy$)).subscribe(
      data => {
        if (data === true) {
          const successKey = 'pw.fileUpload.invoiceProcessMsg';
          this.showNotifications(successKey);
        }
      }
    );

    this.STNUploadResponse$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data === true) {
        const successKey = 'pw.fileUpload.stnProcessMsg';
        this.showNotifications(successKey);
      }
    });
  }

  loadNotifications(data) {
    if (data !== null) {
      this.showNotifications(data.message);
    }
  }

  uploadFile(event) {
    this.dataUploadFacade.clearResponse();
    this.overlayNotification.close();
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: File = fileList[0];
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
        if (type === FileTypesEnum.FIR) {
          this.dataUploadFacade.loadFIRFileUpload(formData);
        }
        if (type === FileTypesEnum.MER) {
          this.dataUploadFacade.loadMERFileUpload(formData);
        }
      }
    }
  }

  invoiceUpload() {
    this.dataUploadFacade.clearResponse();
    this.overlayNotification.close();
    // const fileList: FileList = event.target.files;
    // const formData: FormData = new FormData();
    // if (fileList.length > 0) {
    //   const file: File = fileList[0];
    //   formData.append(stockFileKey, file);
    // }
    // this.dataUploadFacade.loadInvoiceUpload(formData);
    this.dataUploadFacade.loadInvoiceUpload();
  }

  STNUpload() {
    this.dataUploadFacade.clearResponse();
    this.overlayNotification.close();
    // const fileList: FileList = event.target.files;
    // const formData: FormData = new FormData();
    // if (fileList.length > 0) {
    //   const file: File = fileList[0];
    //   formData.append(stockFileKey, file);
    // }
    // this.dataUploadFacade.loadSTNUpload(formData);
    this.dataUploadFacade.loadSTNUpload();
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
          });
      });
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    let isMenu = false;
    const menuCount = Number(command.name.split('_').pop());
    if (
      (command.name === firmerShortcutKey ||
        command.name === invoiceShortcutKey ||
        command.name === stnShortcutKey) &&
      !isNaN(menuCount) &&
      menuCount <= this.menuRef.nativeElement.children.length
    ) {
      switch (this.menuRef.nativeElement.children[menuCount - 1].id) {
        case 'firmer': {
          if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.click();
          }
          isMenu = true;
          break;
        }
        case 'invoice': {
          this.invoiceUpload();
          isMenu = true;
          break;
        }
        case 'stn': {
          this.STNUpload();
          isMenu = true;
          break;
        }
      }
    }

    // if (!isMenu) {
      // }
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

  back(): void {
    this.router.navigate([getInventoryRouteUrl()]);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
