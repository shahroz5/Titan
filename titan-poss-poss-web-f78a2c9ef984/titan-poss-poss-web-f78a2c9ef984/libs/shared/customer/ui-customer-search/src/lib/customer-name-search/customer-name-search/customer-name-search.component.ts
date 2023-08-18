import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { Subject, fromEvent } from 'rxjs';
import { distinctUntilChanged, takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'poss-web-customer-name-search',
  templateUrl: './customer-name-search.component.html',
  styleUrls: ['./customer-name-search.component.scss']
})
export class CustomerNameSearchComponent 
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
    const pattern = fieldValidation.customerSearchNameField.pattern;

    const isValid = pattern.test($event.key);
    if (isValid) {
      const inputLength = (this.searchControl.value as string)?.length;
      const validLength = fieldValidation.customerNameField.maxLength;
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

