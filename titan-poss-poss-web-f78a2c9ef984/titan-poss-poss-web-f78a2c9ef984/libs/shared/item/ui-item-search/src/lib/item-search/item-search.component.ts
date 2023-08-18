import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  HostListener,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ItemSearchResponse } from '../model/item-search.model';

@Component({
  selector: 'poss-web-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss'],
  providers: [BarcodeReaderService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSearchComponent implements OnInit, OnDestroy {
  @Input() placeholder;
  @Input() autocomplete = 'off';
  @Input() hasSuggestiveSearch = false;

  @Output() search = new EventEmitter<ItemSearchResponse>();
  @Output() clear = new EventEmitter<null>();

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  noSearchResultFound = false;

  constructor(
    private formBuilder: FormBuilder,
    private barcodeService: BarcodeReaderService
  ) {
    this.searchForm = this.formBuilder.group({
      searchValue: []
    });

    this.barcodeService.complete
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.searchForm.patchValue({
          searchValue: this.barcodeService.barCodeItemCode
        });
      });
  }

  ngOnInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(1000))
      .subscribe((event: any) => {
        let searchValue = this.searchForm.get('searchValue').value;
        if (searchValue !== '') {
          // To check if it is user input or bracode input
          if (searchValue !== this.barcodeService.barCodeItemCode) {
            this.barcodeService.clearBarcodeData();
          }
          searchValue = (searchValue as string).toUpperCase();
          if (this.hasSuggestiveSearch) {
            if (
              searchValue.length >= 7 ||
              (searchValue.length >= 4 && searchValue.length < 7)
            ) {
              this.search.emit({
                searchValue: searchValue,
                lotNumber: this.barcodeService.barCodeLotNumber,
                isValid: this.validatePattern(
                  searchValue,
                  this.barcodeService.barCodeLotNumber
                )
              });
            }
          } else {
            this.search.emit({
              searchValue: searchValue,
              lotNumber: this.barcodeService.barCodeLotNumber,
              isValid: this.validatePattern(
                searchValue,
                this.barcodeService.barCodeLotNumber
              )
            });
          }

          this.barcodeService.clearBarcodeData();
        } else {
          this.clearSearch(null);
        }
      });
  }

  validatePattern(itemCode: string, lotNumber): boolean {
    // TODO : add lot nummber pattern  check
    return fieldValidation.itemCodeField.pattern.test(itemCode);
  }

  focus() {
    if (
      this.searchBox &&
      this.searchBox.nativeElement &&
      this.searchBox.nativeElement.focus
    )
      this.searchBox.nativeElement.focus();
  }

  /**
   * Clear Search Event to the user of the control
   * @param event : click event to stop propagation
   */
  clearSearch(event): void {
    if (event) {
      event.stopPropagation();
    }
    this.reset();
    this.clear.next();
    this.noSearchResultFound = false;
  }

  /**
   * Reset fucntion to reset the search box value
   */
  reset(): void {
    this.searchForm.reset();
    this.barcodeService.clearBarcodeData();
  }

  /**
   * Barcode input read function
   * Listens for TAB and ENTER Key event
   */
  @HostListener('keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    this.barcodeService.variantCodeInput(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
