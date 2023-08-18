import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-customer-pan-no-search',
  templateUrl: './customer-pan-no-search.component.html',
  styleUrls: ['./customer-pan-no-search.component.scss']
})
export class CustomerPanNoSearchComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() searchControl: FormControl;
  @Input() placeholder: FormControl;
  @Output() search = new EventEmitter();
  @Output() clearSearch = new EventEmitter();
  @Output() clearError = new EventEmitter();

  @ViewChild('searchBox', { static: true, read: ElementRef })
  searchBox: ElementRef;

  destroy$: Subject<null> = new Subject<null>();



  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value) {
          this.searchControl.patchValue(value.toUpperCase());
        }
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.search.emit();
      });
  }

  clearSearchFn(): void {
    this.clearSearch.emit();
  }

  validKeyCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.alphaNumericField.pattern;

    const isValid = pattern.test($event.key);

    if (isValid) {
      const inputLength = (this.searchControl.value as string)?.length;
      const validLength = fieldValidation.pancardField.maxLength;

      if (!inputLength || !validLength || inputLength + 1 <= validLength)
        this.clearError.emit($event);
    }

    return isValid;
  }

  focus() {
    if (this.searchBox) this.searchBox?.nativeElement?.focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
