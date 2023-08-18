import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-transaction-type-search',
  templateUrl: './transaction-type-search.component.html',
  styleUrls: ['./transaction-type-search.component.css']
})
export class TransactionTypeSearchComponent implements AfterViewInit ,OnChanges,OnDestroy{

  @Input() resetSearch = false;
  @Output() searchData = new EventEmitter<string>();
  @Output() searchReset = new EventEmitter<boolean>();
  destroy$ = new Subject<null>();

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });



  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.searchData.emit(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnChanges() {
    if (this.resetSearch) {
      this.clearSearch();
      this.resetSearch = false;
    }
  }

  clearSearch() {
    this.searchForm.reset();
    this.searchReset.emit(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
