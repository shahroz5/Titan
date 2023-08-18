import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  OnChanges,
  ViewChild,
  Output,
  Input,
  ChangeDetectionStrategy,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-ui-gc-number-manual-entry',
  templateUrl: './ui-gc-number-manual-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiGcNumberManualEntryComponent
  implements OnInit, OnChanges, OnDestroy {
  gcManualEntryForm: FormGroup;

  @ViewChild('gcManualEntryCard', { static: true })
  gcManualEntryCard: ElementRef;

  destroy$ = new Subject();

  @Input() clearCardNumberField = true;
  @Output() gcNumberManualEmit: EventEmitter<{
    cardNumber: string;
    error: boolean;
  }> = new EventEmitter<{
    cardNumber: string;
    error: boolean;
  }>();

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService
  ) {
    this.gcManualEntryForm = new FormGroup({
      manualCardNumber: new FormControl('', [
        Validators.required,
        this.fieldValidatorsService.numbersField('Manual Card Number'),
        this.fieldValidatorsService.requiredField('Manual Card Number')
      ])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clearCardNumberField']) {
      this.gcManualEntryForm.get('manualCardNumber').reset();
      this.gcManualEntryForm.get('manualCardNumber').updateValueAndValidity();
    }
  }

  ngOnInit() {
    // this.gcManualEntryForm.valueChanges
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((value: any) => {
    //     if (
    //       !value.manualCardNumber ||
    //       (value.manualCardNumber && value.manualCardNumber.length === 16)
    //     ) {
    //       this.gcNumberManualEmit.emit(value.manualCardNumber);
    //     }
    //   });

    this.gcManualEntryForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (!value.manualCardNumber || value.manualCardNumber) {
          this.gcNumberManualEmit.emit({
            cardNumber: value.manualCardNumber,
            error: this.gcManualEntryForm.invalid
          });
        }
      });
  }

  trackBy(_: number, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
