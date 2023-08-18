import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  Inject
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilePreviewComponent } from '../file-preview/file-preview.component';
import { POSS_WEB_IMAGE_FILE_SIZE } from '@poss-web/shared/util-config';

@Component({
  selector: 'poss-web-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() imageUrl: string;
  defaultImageUrl = 'assets/img/product-default-image.svg';
  @Input() fileName = 'View';
  @Input() disabled = false;
  @Input() uploadLabel = 'Upload';
  @Input() previewHeader = 'Preview';
  @Input() enableClose = true;
  @Input() isDocumentDownload: boolean;
  @Input() isViewLabelWithoutHeading = false;

  @Output() downloadDocument = new EventEmitter<boolean>();
  @ViewChild('fileInput') fileInput: any;
  @Output() fileEmitter = new EventEmitter<any>();
  @Output() errorEmitter = new EventEmitter<string>();
  @Output() clearEmitter = new EventEmitter<null>();
  jpgExtn = 'jpg';
  jpegExtn = 'jpeg';
  pdfExtn = 'pdf';
  docExtn = 'docx';
  constructor(
    public dialog: MatDialog,
    @Inject(POSS_WEB_IMAGE_FILE_SIZE) public fileSize
  ) {}

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];

      let extn = file.name.split('.').pop();
      extn = extn.toLowerCase();
      if (file.size > this.fileSize) {
        const errorKey = 'pw.fileUpload.maximumFileSizeErrorMessage';
        this.errorEmitter.emit(errorKey);
      } else if (!this.checkFileType(extn)) {
        const errorKey = 'pw.fileUpload.JPGFileTypeErrorMessage';
        this.errorEmitter.emit(errorKey);
      } else if (this.checkFileType(extn) && file.size < this.fileSize) {
        // this.fileName = event.target.files[0].name;

        this.fileEmitter.emit(event.target.files);
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = onloadEvent => {
          // called once readAsDataURL is completed
          this.imageUrl = this.imageUrl
            ? this.imageUrl
            : (onloadEvent.target.result as string);
        };
      }
    }
  }

  showPopup(): void {
    let extns = '';

    if (this.imageUrl) {
      const fileName = this.imageUrl.substring(0, this.imageUrl.indexOf('?'));
      extns = fileName.split('.').pop();
    }

    if (this.isDocumentDownload) {
      this.downloadDocument.emit(true);
    } else if (extns === 'pdf') {
      const a: HTMLAnchorElement = document.createElement(
        'a'
      ) as HTMLAnchorElement;
      a.href = this.imageUrl;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(this.imageUrl);
    } else {
      this.dialog.open(FilePreviewComponent, {
        height: '550px',
        width: '750px',
        autoFocus: false,
        data: {
          defaultImageUrl: this.defaultImageUrl,
          imageUrl: this.imageUrl,
          previewHeader: this.previewHeader
        }
      });
    }
  }

  removeSelectedFile() {
    this.fileInput.nativeElement.value = '';
    // this.fileName = '';
    this.imageUrl = '';
    this.clearEmitter.emit();
  }

  checkFileType(extn: string): boolean {
    if (extn === this.jpgExtn) {
      return true;
    } else if (extn === this.jpegExtn) {
      return true;
    } else if (extn === this.pdfExtn) {
      return true;
    } else if (extn === this.docExtn && this.isDocumentDownload) {
      return true;
    } else {
      return false;
    }
  }
}
