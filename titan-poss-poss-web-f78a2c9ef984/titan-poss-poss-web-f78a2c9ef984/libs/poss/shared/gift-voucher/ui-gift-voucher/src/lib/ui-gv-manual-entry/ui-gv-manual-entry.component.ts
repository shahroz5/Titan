import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { take, takeUntil } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'poss-web-ui-gv-manual-entry',
  templateUrl: './ui-gv-manual-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiGvManualEntryComponent implements OnInit, OnChanges, OnDestroy {
  gcManualEntryForm: FormGroup;

  @ViewChild('gcManualEntryCard', { static: true })
  gcManualEntryCard: ElementRef;

  destroy$ = new Subject();

  @Input() clearCardNumberField = true;
  @Input() mutipleGVsearch = true;
  @Output() gcNumberManualEmit: EventEmitter<{
    cardNumber: string;
    error: boolean;
  }> = new EventEmitter<{
    cardNumber: string;
    error: boolean;
  }>();

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  constructor(
    private _ngZone: NgZone,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService
  ) {
    this.gcManualEntryForm = new FormGroup({
      manualCardNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField('GV Card Number')
      ])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clearCardNumberField']) {
      this.gcManualEntryForm.get('manualCardNumber').reset();
      this.gcManualEntryForm.get('manualCardNumber').updateValueAndValidity();
    }

    if (changes['mutipleGVsearch']) {
      if (this.mutipleGVsearch === false) {
        this.gcManualEntryForm.controls['manualCardNumber'].setValidators(
          this.fieldValidatorsService.numbersField('GV Card Number')
        );
        this.gcManualEntryForm.controls[
          'manualCardNumber'
        ].updateValueAndValidity();
        // this.gcManualEntryForm.setValidators([
        //   this.fieldValidatorsService.numbersField('GV Card Number')
        // ]);
      }
    }
  }

  ngOnInit() {
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
