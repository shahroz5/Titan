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
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, fromEvent, Observable, of } from 'rxjs';
import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';
import {
  GiftCardErrorMessageEnum,
  GiftCardItem
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-ui-gc-bar-code',
  templateUrl: './ui-gc-bar-code.component.html',
  styleUrls: ['./ui-gc-bar-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiGcBarCodeComponent implements OnInit, OnChanges, OnDestroy {
  barCodeSearchForm: FormGroup;
  trackData = '';
  // sequence = [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23];
  regexNumber: RegExp = fieldValidation.gcScannedCode.pattern;
  giftCardNumber: string;
  maskData = '';
  paymentGrid=false;
  isLoading$: Observable<boolean> = of(false);

  @ViewChild('visibleGcCardInput', { static: true })
  visibleGcCardInput: ElementRef;

  destroy$: Subject<null> = new Subject<null>();

  @Input() cardsList: GiftCardItem[] = [];
  @Input() clearCardNumberField = true;
  @Input() tabType: string;
  @Input() isScan: boolean;
  @Output() cardNumberEmit: EventEmitter<{
    cardNumber: string;
    trackdata: string;
  }> = new EventEmitter<{ cardNumber: string; trackdata: string }>();
  @Output() isScanEmit = new EventEmitter<boolean>();

  constructor(
    private barCodeService: BarcodeReaderService,
    public translate: TranslateService
  ) {
    this.barCodeSearchForm = new FormGroup({
      visibleCardControl: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clearCardNumberField']) {
      this.barCodeSearchForm.get('visibleCardControl').enable();
      this.barCodeSearchForm.get('visibleCardControl').reset();
      this.barCodeSearchForm.get('visibleCardControl').updateValueAndValidity();
    }
  }

  ngOnInit() {
    this.visibleGcCardInput.nativeElement.focus();
    fromEvent(this.visibleGcCardInput.nativeElement, 'input')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.giftCardNumber) {
          this.barCodeSearchForm
            .get('visibleCardControl')
            .setValue(this.maskData);
        } else {
          if (this.isDuplicateCardAdded(this.giftCardNumber)) {
            this.barCodeSearchForm.get('visibleCardControl').setErrors({
              errorArray: [GiftCardErrorMessageEnum.DUPLICATE_CARD_ERROR]
            });
          } else {
            this.barCodeSearchForm.get('visibleCardControl').setValue('');
            // this.barCodeSearchForm
            //   .get('visibleCardControl')
            //   .setValue(this.giftCardNumber);
          }
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
    if (this.giftCardNumber && event && event.key !== 'Tab') {
      this.giftCardNumber = '';
    }
    if (event.key !== 'Tab') {
      if (this.regexNumber.test(event.key)) {
        this.maskData = this.maskData + '';
        this.trackData += event.key;
        //Length of trackData when scanned is 26 and card number is 16
        if (this.trackData.length > 25) {
          this.maskData = '';
          this.getGiftCardNumber(this.trackData);
        }
      } else {
        this.maskData = '';
        this.trackData = '';
      }
    }
  }

  onFocusOut() {
    if (!this.giftCardNumber) {
      this.isScanEmit.emit(false);
    }
  }

  isDuplicateCardAdded(giftCardNumber: string): boolean {
    const cardNumbersList = this.cardsList.map(cardObj => cardObj.cardNo);
    return cardNumbersList.length !== 0
      ? cardNumbersList.includes(giftCardNumber)
      : false;
  }

  getGiftCardNumber(TrackData: string) {
    //key value pair mapping to get the card number
    this.giftCardNumber = this.barCodeService.getGiftCardNumber(TrackData);

    if (!this.isDuplicateCardAdded(this.giftCardNumber)) {
      this.cardNumberEmit.emit({
        cardNumber: this.giftCardNumber,
        trackdata: this.trackData
      });
    }

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
