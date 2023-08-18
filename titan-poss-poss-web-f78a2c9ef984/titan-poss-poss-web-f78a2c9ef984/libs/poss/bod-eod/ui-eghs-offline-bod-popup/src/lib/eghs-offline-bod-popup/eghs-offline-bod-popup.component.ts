import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-eghs-offline-bod-popup',
  templateUrl: './eghs-offline-bod-popup.component.html',
  styleUrls: ['./eghs-offline-bod-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EghsOfflineBodPopupComponent implements OnDestroy {
  private destroy$ = new Subject();
  eghsOfflineBodFormGroup: FormGroup;
  passwordFormControl: FormControl;
  businessDayDate: number;
  businessDateForViewing: string;
  offlineGhsPopUpData = {
    locationCode: '',
    businessDate: '',
    goldRate: null
  };
  getPassword = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<EghsOfflineBodPopupComponent>,
    public translate: TranslateService,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      locationCode: Observable<string>;
      businessDate: Observable<number>;
      goldRate: Observable<number>;
      generatedPassword: Observable<string>;
    }
  ) {
    combineLatest([
      this.data.locationCode,
      this.data.businessDate,
      this.data.goldRate
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(responseData => {
        this.offlineGhsPopUpData['locationCode'] = responseData[0];
        if (!!responseData[1]) {
          this.businessDayDate = Number(responseData[1]);
          this.businessDateForViewing = moment(this.businessDayDate).format(
            this.dateFormat
          );
          this.offlineGhsPopUpData[
            'businessDate'
          ] = this.businessDateForViewing;
        }
        this.offlineGhsPopUpData['goldRate'] = responseData[2];
      });
    this.eghsOfflineBodFormGroup = new FormGroup({
      passwordFormControl: new FormControl()
    });

    data.generatedPassword
      .pipe(
        filter(value => !!value),
        takeUntil(this.destroy$)
      )
      .subscribe(password => {
        this.eghsOfflineBodFormGroup.controls['passwordFormControl'].setValue(
          password
        );
      });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  generatePassword() {
    const requestInput = {
      businessDate: this.businessDayDate ? this.businessDayDate : null,
      goldRate: this.offlineGhsPopUpData['goldRate']
    };
    this.getPassword.emit(requestInput);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
