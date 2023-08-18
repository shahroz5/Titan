import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  OnChanges,
  ViewChild,
  HostListener,
  Output,
  Input,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, fromEvent, Observable, of } from 'rxjs';
import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'poss-web-ui-gv-bar-code',
  templateUrl: './ui-gv-bar-code.component.html',
  styleUrls: ['./ui-gv-bar-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiGvBarCodeComponent implements OnInit, OnChanges, OnDestroy {
  barCodeSearchForm: FormGroup;
  trackData = '';

  regexNumber: RegExp = fieldValidation.gcScannedCode.pattern;
  giftCardNumber: string;
  maskData = '';

  isLoading$: Observable<boolean> = of(false);

  @ViewChild('visibleGcCardInput', { static: true })
  visibleGcCardInput: ElementRef;

  destroy$: Subject<null> = new Subject<null>();

  @Input() clearCardNumberField = true;

  @Input() isScan: boolean;
  @Output() cardNumberEmit: EventEmitter<{
    cardNumber: string;
    trackdata: string;
  }> = new EventEmitter<{ cardNumber: string; trackdata: string }>();

  constructor(
    private barCodeService: BarcodeReaderService,
    public translate: TranslateService
  ) {
    this.barCodeSearchForm = new FormGroup({
      visibleCardControl: new FormControl('')
    });
  }

  ngOnChanges() {
    if (this.clearCardNumberField) {
      this.barCodeSearchForm.get('visibleCardControl').enable();
      this.barCodeSearchForm.get('visibleCardControl').reset();
      this.barCodeSearchForm.get('visibleCardControl').updateValueAndValidity();
    }
  }

  ngOnInit() {
    fromEvent(this.visibleGcCardInput.nativeElement, 'input')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.giftCardNumber) {
          this.barCodeSearchForm
            .get('visibleCardControl')
            .setValue(this.maskData);
        } else {
          this.barCodeSearchForm.get('visibleCardControl').setValue('');
          this.barCodeSearchForm
            .get('visibleCardControl')
            .setValue(this.giftCardNumber);
        }
      });
    // this.cardsList = this.cardsList;
  }

  onVisibleInputFieldFocus() {
    this.trackData = '';
  }

  @HostListener('keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    //comment
    if (this.giftCardNumber && event) {
      this.giftCardNumber = '';
    }
    if (this.regexNumber.test(event.key)) {
      this.maskData = this.maskData + '*';
      this.trackData += event.key;
      //Length of trackData when scanned is 26 and card number is 16
      if (this.trackData.length > 8) {
        this.maskData = '';
        this.getGiftCardNumber(this.trackData);
      }
    } else {
      this.maskData = '';
      this.trackData = '';
    }
  }

  getGiftCardNumber(TrackData: string) {
    //key value pair mapping to get the card number
    this.giftCardNumber = TrackData;

    this.cardNumberEmit.emit({
      cardNumber: this.giftCardNumber,
      trackdata: this.trackData
    });

    this.trackData = '';
    this.barCodeSearchForm
      .get('visibleCardControl')
      .setValue(this.giftCardNumber);
    this.barCodeSearchForm.updateValueAndValidity();
  }

  trackBy(_: number, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
