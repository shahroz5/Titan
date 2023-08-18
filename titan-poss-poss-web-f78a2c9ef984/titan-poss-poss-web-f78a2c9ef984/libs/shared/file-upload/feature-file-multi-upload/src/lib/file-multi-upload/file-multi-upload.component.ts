import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import {
  AcceptFileTypeEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomErrors,
  FileTypeEnum,
  FileUploadTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SubTransactionTypeEnum
} from '@poss-web/shared/models';
import {
  POSS_WEB_IMAGE_FILE_SIZE,
  POSS_WEB_MAX_FILE_UPLOADS
} from '@poss-web/shared/util-config';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { take, takeUntil } from 'rxjs/operators';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { Observable, Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatRadioButton } from '@angular/material/radio';
@Component({
  selector: 'poss-web-file-multi-upload',
  templateUrl: './file-multi-upload.component.html',
  styleUrls: ['./file-multi-upload.component.scss']
})
export class FileMultiUploadComponent implements OnInit, OnDestroy, OnChanges {
  @Input() docType = null;
  @Input() title;
  @Input() fileType;
  imageUrl: string;
  defaultImageUrl = 'assets/img/product-default-image.svg';
  uploadLabel = 'Upload';
  previewHeader = 'Preview';
  enableClose = true;
  disabled = false;
  type = FileUploadTypeEnum.UPLOAD;
  @ViewChild('fileInput') fileInput: any;
  acceptType;
  fileTypeEnum = FileTypeEnum;
  radioFormGroup: FormGroup;
  selectedFileType;

  destroy$ = new Subject();
  transactionID: any;
  transactionType: any;
  subTransactionType: any;
  dropDown;
  isLoading$: Observable<boolean>;
  fileList: { id: string; name: string }[] = [];
  disable: boolean;
  uploadType: any;
  fileUploadTypeEnumRef: typeof FileUploadTypeEnum;
  customerId: any;
  fileTypeLabel;
  uploadTitle;
  Offline;
  UploadImage;
  UploadPdf;
  fileId: string;
  docName: string;
  fileData = [];
  docData$: Subject<any> = new Subject<any>();
  deleteFileId: any;
  uploadedFileIds = [];
  filesList = [];
  prevFileListData: { id: string; name: string }[];
  selectionAllSubject: Subject<any> = new Subject<any>();
  selectionAllObservable = this.selectionAllSubject.asObservable();
  show = true;
  extn: string;
  @ViewChild('uploadButton')
  uploadButton: ElementRef;
  @Input() setFocus: number;
  badgeNumber = 4;
  @ViewChild(MatExpansionPanel) pannel?: MatExpansionPanel;
  @Input() disableUpload = false;
  @ViewChild('pdfRadioButton')
  pdfRadioButton: MatRadioButton;
  subTransactionTypeRef = SubTransactionTypeEnum;

  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    private facade: FileFacade,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,

    @Inject(POSS_WEB_MAX_FILE_UPLOADS) public maxUploads,
    @Inject(POSS_WEB_IMAGE_FILE_SIZE) public fileSize
  ) {
    this.translate
      .get([
        'pw.fileUpload.fileTypeLabel',
        'pw.fileUpload.uploadLabel',
        'pw.fileUpload.Offline',
        'pw.fileUpload.UploadImage',
        'pw.fileUpload.UploadPdf',
        'pw.fileUpload.ImageLabel',
        'pw.fileUpload.PdfLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fileTypeLabel = translatedMessages['pw.fileUpload.fileTypeLabel'];
        this.uploadTitle = translatedMessages['pw.fileUpload.uploadLabel'];
        this.Offline = translatedMessages['pw.fileUpload.Offline'];
        this.UploadImage = translatedMessages['pw.fileUpload.UploadImage'];
        this.UploadPdf = translatedMessages['pw.fileUpload.UploadPdf'];
      });
    this.fileUploadTypeEnumRef = FileUploadTypeEnum;
    this.fileTypeEnum = FileTypeEnum;
  }

  ngOnInit() {
    this.selectedFileType = FileTypeEnum.PDF;
    this.acceptType = AcceptFileTypeEnum.PDF;

    this.radioFormGroup = new FormGroup({
      selectRadioButton: new FormControl(this.selectedFileType)
    });

    this.facade
      .getResetFileType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reset => {
        if (reset) {
          this.selectedFileType = FileTypeEnum.PDF;
          this.acceptType = AcceptFileTypeEnum.PDF;
          this.radioFormGroup
            .get('selectRadioButton')
            .patchValue(this.selectedFileType);
          this.facade.resetFileType(false);
        }
      });
    this.facade.clearResponse();
    this.dropDown = [
      {
        value: 'PANCARD',
        description: 'Pan card'
      },
      {
        value: 'OTHERS',
        description: 'Others'
      }
    ];

    this.radioFormGroup
      .get('selectRadioButton')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(selectedFileType => {
        this.selectedFileType = selectedFileType;
        if (this.selectedFileType === this.fileTypeEnum.IMAGE) {
          this.acceptType = AcceptFileTypeEnum.IMAGE;
        } else if (this.selectedFileType === this.fileTypeEnum.PDF) {
          this.acceptType = AcceptFileTypeEnum.PDF;
        }
      });

    this.isLoading$ = this.facade.getIsLoading();
    this.imageUrl = null;

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_ID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionID => {
        this.transactionID = transactionID;
        if (transactionID && transactionID !== 'new') {
          this.loadDocuments();
        }
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionConfig => {
        if (transactionConfig) {
          this.transactionType = transactionConfig.transactionType?.type;
          this.subTransactionType = transactionConfig.transactionType?.subType;
        }
      });

    this.facade
      .getDocumentsLst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docs => {
        if (docs) {
          const filesList = docs;
          this.filesList = [...filesList];
        }
      });
    this.facade
      .getDocumentUploadResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(imgData => {
        if (imgData) {
          if (this.transactionID) this.loadDocuments();
          else {
            this.fileId = imgData;
            this.uploadedFileIds = [...this.uploadedFileIds, this.fileId];
            this.fileData.push({
              id: this.fileId,
              name: this.docName
            });
            const fileList = this.fileData;
            this.filesList = [...fileList];
            const fileIds = this.filesList.map(x => x.id);
            this.facade.loadFileIds(fileIds);
          }
        }
      });
    this.facade
      .getIsDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          if (this.transactionID) this.loadDocuments();
          else {
            this.fileData = this.fileData.filter(
              x => x.id !== this.deleteFileId[0]
            );
            this.filesList = [...this.fileData];
            const fileIds = this.fileData.map(x => x.id);
            this.facade.loadFileIds(fileIds);
          }
        }
      });

    this.facade
      .getDocumentUrlById()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docUrl => {
        if (docUrl) {
          this.imageUrl = docUrl;
          this.showPopup();
        }
      });
    this.facade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.fileInput.nativeElement.value = '';
          this.errorHandler(error);
        }
      });
    this.facade
      .getClearFileList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((clearList: boolean) => {
        if (clearList) {
          this.selectionAllSubject.next([]);
          this.fileList = [];
          this.fileData = [];
          this.filesList = [];
          this.uploadedFileIds = [];
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.IS_FILE_UPLOAD_VISIBLE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isVisible: boolean) => {
        if (isVisible) {
          this.show = true;
          this.disableUpload = false;
          this.facade.clearFileList(false);
        } else {
          this.show = false;
          this.disableUpload = true;
          this.facade.clearFileList(true);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['setFocus']) {
      if (
        this.setFocus === this.badgeNumber &&
        this.subTransactionType === SubTransactionTypeEnum.NEW_CM
      ) {
        this.pannel.open();
        setTimeout(() => {
          this.pdfRadioButton.focus();
        }, 100);
      }
    }
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }
  loadDocuments() {
    this.facade.loadDocumentsList({
      customerId: this.customerId ? this.customerId : null,
      docType: this.docType ? this.docType : this.transactionType,
      fileType: this.fileType,
      id: this.transactionID
    });
  }
  deleteDocument(id) {
    this.facade.deleteDocument(id);
    this.deleteFileId = id;
  }
  maxFileUploadedPopup() {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.INFO,
      message: 'pw.fileUpload.maxFileUploadMessage'
    });
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      let extn = file.name.split('.').pop();
      extn = extn.toLowerCase();

      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage';
        this.showNotifications(errorKey);
      } else if (
        this.selectedFileType === this.fileTypeEnum.IMAGE &&
        extn !== FileTypeEnum.JPG &&
        extn !== FileTypeEnum.JPEG
      ) {
        const errorKey = 'pw.fileUpload.JPGFileTypeErrorMessage';
        this.showNotifications(errorKey);
        this.fileInput.nativeElement.value = '';
      } else if (
        this.selectedFileType === FileTypeEnum.PDF &&
        extn !== FileTypeEnum.PDF
      ) {
        const errorKey = 'pw.fileUpload.PDFFileTypeErrorMessage';
        this.showNotifications(errorKey);
        this.fileInput.nativeElement.value = '';
      } else if (this.checkFileType(extn) && file.size < this.fileSize) {
        this.upload(event.target.files);
        this.fileInput.nativeElement.value = '';
      }
    }
  }
  checkFileType(extn: string): boolean {
    if (extn === FileTypeEnum.JPG) {
      return true;
    } else if (extn === FileTypeEnum.JPEG) {
      return true;
    } else if (extn === FileTypeEnum.PDF) {
      return true;
    } else {
      return false;
    }
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
  loadImageUrl(fileData) {
    this.imageUrl = null;
    let extn = fileData.name.split('.').pop();
    extn = extn.toLowerCase();
    if (extn === FileTypeEnum.PDF) this.facade.downloadPdfFile(fileData);
    else this.facade.loadDocumentUrlById(fileData.id);
  }
  removeSelectedFile() {
    this.fileInput.nativeElement.value = '';
    this.imageUrl = '';
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
          .subscribe();
      });
  }
  upload(event) {
    const fileList: FileList = event;
    const formData: FormData = new FormData();

    if (fileList.length > 0) {
      this.docName = fileList.item(0).name;
      formData.append('file', fileList.item(0));
      this.facade.uploadForm({
        customerId: this.customerId ? this.customerId : null,
        docType: this.docType ? this.docType : this.transactionType,
        fileType: this.fileType,
        file: formData,
        id: this.transactionID ? this.transactionID : null
      });
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
