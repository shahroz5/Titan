import {
  Component,
  OnInit,
  EventEmitter,
  Inject,
  OnDestroy
} from '@angular/core';
import { SummaryBarBase } from '../summary-bar.service';
import {
  SummaryBarEventRef,
  SummaryBarCNTypesEnum,
  SummaryBarEventType
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-summary-bar-cn',
  templateUrl: './summary-bar-cn.component.html',
  styleUrls: ['./summary-bar-cn.component.scss']
})
export class SummaryBarCnComponent
  implements OnInit, SummaryBarBase, OnDestroy {
  events = new EventEmitter<SummaryBarEventRef>();
  remarksFormControl: FormControl;
  summaryBarCNTypesEnumRef = SummaryBarCNTypesEnum;
  destroy$ = new Subject<null>();
  remarksLabel: string;
  constructor(
    @Inject(SUMMARY_BAR_DATA) public type: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.summaryBar.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.remarksLabel = translatedMsg['pw.summaryBar.remarksLabel'];
      });
  }

  ngOnInit(): void {
    this.remarksFormControl = new FormControl('', [
      this.fieldValidatorsService.remarkField(this.remarksLabel)
    ]);
  }
  confirm() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CONFRIM,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }
  reject() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CANCEL,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }
  trimRemarks() {
    this.remarksFormControl.setValue(
      this.remarksFormControl.value.replace(/\s+/g, ' ')
    );
  }

  print() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
