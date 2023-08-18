import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  HostListener,
  AfterViewInit,
  OnDestroy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent, Subject, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  SearchEmitEvent,
  Command,
  ShortcutServiceAbstraction,
  SearchProductList
} from '@poss-web/shared/models';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';

const searchShortcutKey = 'ProductSearchAutocompleteComponent.MAIN_SEARCH';

@Component({
  selector: 'poss-web-product-search-autocomplete',
  templateUrl: './product-search-autocomplete.component.html',
  styleUrls: ['./product-search-autocomplete.component.scss'],
  providers: [BarcodeReaderService]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSearchAutocompleteComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  noSearchResultFound: boolean;
  noDataFoundMessage: string;
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger })
  inputAutoComplete: MatAutocompleteTrigger;

  @Input() searchData = [];
  @Input() placeholder: string;
  @Output() search = new EventEmitter<SearchEmitEvent>();
  @Output() exactSearch = new EventEmitter<SearchEmitEvent>();
  @Output() clear = new EventEmitter<null>();
  @Output() selectedData = new EventEmitter<SearchProductList>();
  @Input() searchEnableEvent: Observable<boolean>;
  @Input() autofocus = false;

  constructor(
    private formBuilder: FormBuilder,
    private barcodeService: BarcodeReaderService,
    private shortcutService: ShortcutServiceAbstraction,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.entity.productEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(
            [
              'pw.productGrid.productSearchPlaceHolder',
              'pw.global.noDataFoundMessage'
            ],
            {
              entityName: entity['pw.entity.productEntity']
            }
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessage: string) => {
            this.placeholder =
              translatedMessage['pw.productGrid.productSearchPlaceHolder'];
            this.noDataFoundMessage =
              translatedMessage['pw.global.noDataFoundMessage'];
          });
      });

    this.searchForm = this.formBuilder.group({
      searchValue: [null]
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
      .subscribe((event: any) => {
        this.searchData = [];
      });

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });

    this.searchForm.enable();
    this.searchEnableEvent.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data === true) {
        this.searchForm.enable();
      } else {
        this.searchForm.disable();
      }
    });
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(1000))
      .subscribe((event: any) => {
        this.searchEvent();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchData'] && this.inputAutoComplete)
      this.inputAutoComplete.openPanel();

    if (changes['autofocus']) {
      if (this.autofocus) {
        setTimeout(() => {
          this.searchBox.nativeElement.focus();
        }, 100);
      }
    }
  }

  searchEvent() {
    let searchValue = '';
    if (this.searchForm.get('searchValue').value) {
      searchValue = this.searchForm
        .get('searchValue')
        .value.toUpperCase()
        .trim();
    }

    if (searchValue !== '') {
      if (searchValue !== this.barcodeService.barCodeItemCode) {
        this.barcodeService.clearBarcodeData();
        if (searchValue.length >= 7) {
          this.search.emit({
            searchValue,
            lotNumber: null,
            isValid: this.validatePattern(searchValue)
          });
        } else {
          if (searchValue.length >= 4 && searchValue.length < 7) {
            this.exactSearch.emit({
              searchValue,
              lotNumber: null,
              isValid: this.validatePattern(searchValue)
            });
          }
        }
      } else {
        this.search.emit({
          searchValue,
          lotNumber: this.barcodeService.barCodeLotNumber,
          isValid: this.validatePattern(searchValue)
        });
      }
      this.barcodeService.clearBarcodeData();
    } else {
      this.clearSearch(null);
    }
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
    this.searchData = [];
    this.clear.next();
    this.noSearchResultFound = false;
  }

  /**
   * Reset function to reset the search box value
   */
  reset() {
    this.searchForm.reset();
  }

  /**
   * Barcode input read function
   * Listens for TAB and ENTER Key event
   */
  @HostListener('keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    this.barcodeService.variantCodeInput(event);
  }

  updateMySelection(event: MatAutocompleteSelectedEvent) {
    this.searchForm.patchValue({
      searchValue: event.option.value.itemCode
    });
    this.selectedData.emit(event.option.value);
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case searchShortcutKey: {
        if (this.searchBox) {
          this.focus();
        }
        break;
      }
    }
  }

  validatePattern(itemCode: string): boolean {
    return fieldValidation.itemCodeField.pattern.test(itemCode);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
