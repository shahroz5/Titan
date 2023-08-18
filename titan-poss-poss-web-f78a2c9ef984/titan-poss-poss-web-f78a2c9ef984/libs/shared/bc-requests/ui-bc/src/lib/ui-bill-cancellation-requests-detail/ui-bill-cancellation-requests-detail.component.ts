import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-ui-bill-cancellation-requests-detail',
  templateUrl: './ui-bill-cancellation-requests-detail.component.html',
  styleUrls: []
})
export class UiBillCancellationRequestsDetailComponent implements OnInit {
  @Input() headerDetails;
  @Output() componentEmit = new EventEmitter<any>();
  form: FormGroup;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    form: FormBuilder,
    private fieldValidator: FieldValidatorsService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.form = form.group({
      approve: [null],

      reason: [
        null,
        [
          this.fieldValidator.remarkField('Reason'),
          this.fieldValidator.requiredField('Reason'),
          this.fieldValidator.minLength(5, 'Reason'),
          this.fieldValidator.maxLength(250, 'Reason')
        ]
      ]
    });
  }

  ngOnInit() {
    console.log(this.headerDetails);

  }

  cancel() {
    this.componentEmit.emit('cancel');
  }
  confirm() {
    if (!this.form.controls['approve'].value) {
      this.errorNotifications('Please Select Approve/Reject');
    }
    if (!this.form.controls['reason'].value) {
      this.form.markAllAsTouched();
    }

    if (
      this.form.controls['approve'].value &&
      this.form.controls['reason'].value
    ) {
      this.componentEmit.emit({
        approved: this.form.controls['approve'].value,

        body: {
          approvedData: {
            data: {},
            type: 'BILL_CANCELLATION'
          },
          approverRemarks: this.form.controls['reason'].value
        },
        processId: this.headerDetails.processId,
        taskId: this.headerDetails.taskId,
        taskName: 'REQUEST_APPROVER_L1'
      });
    }
  }
  errorNotifications(errorKey) {
    const key = errorKey;
    // this.translate
    //   .get(key)
    //   .pipe(take(1))
    //   .subscribe((translatedMessage: string) => {
    //     // this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: key,
        hasClose: true,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
    // });
  }
}
