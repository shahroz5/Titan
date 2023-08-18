import { Component, OnInit, Inject } from '@angular/core';
import { FileUploadPopupEnum } from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-fileupload-confirmation-popup',
  templateUrl: './fileupload-confirmation-popup.component.html'
})
export class FileuploadConfirmationPopupComponent implements OnInit {
  destroy$: Subject<null> = new Subject<null>();
  successMsg: any;
  failureMag: any;
  label: string;
  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<FileuploadConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.translate
      .get([
        'pw.fileUpload.fileValidMessage',
        'pw.fileUpload.fileInvalidMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.successMsg = translatedMessages['pw.fileUpload.fileValidMessage'];
        this.failureMag =
          translatedMessages['pw.fileUpload.fileInvalidMessage'];
      });
    this.label = data.label;
  }

  ngOnInit() {
    console.log('data', this.data);
  }
  closePopUp() {
    this.dialogRef.close();
  }
  download() {
    this.dialogRef.close(FileUploadPopupEnum.DOWNLOAD);
  }
  showErrorRecords() {
    this.dialogRef.close(FileUploadPopupEnum.ERROR);
  }
  okButton() {
    this.dialogRef.close(FileUploadPopupEnum.OK);
  }
}
