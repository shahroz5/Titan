import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ManualBillRequest,
  ManualBillDetails,
  OverlayNotificationEventRef,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'poss-web-manual-approval-details',
  templateUrl: './manual-approval-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualApprovalDetailsComponent implements OnChanges {
  @Input() billDetails: ManualBillRequest;
  @Input() currencyCode: string;
  @Input() imageUrl: string;
  @Output() uploadFile = new EventEmitter<FormData>();
  billData: ManualBillDetails;
  weightCode = 'gm';

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService
  ) {}



  ngOnChanges() {
    console.log('billDetails', this.billDetails);
    if (!!this.billDetails) {
      this.billData = this.billDetails?.manualBillDetails;
    }
  }

  upload(event) {
    const fileList: FileList = event;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      formData.append('file', fileList.item(0));
      this.uploadFile.emit(formData);
    }
  }

  uploadError(event: string) {
    this.showNotifications(event);
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

  clear() {
    this.imageUrl = null;
  }
}
