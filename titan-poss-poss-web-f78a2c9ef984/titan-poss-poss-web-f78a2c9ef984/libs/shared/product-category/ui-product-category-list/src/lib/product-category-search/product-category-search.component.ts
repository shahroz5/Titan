import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-product-category-search',
  templateUrl: './product-category-search.component.html',
  styleUrls: ['./product-category-search.component.css']
})
export class ProductCategorySearchComponent
  implements AfterViewInit, OnInit, OnChanges, OnDestroy {


  @Input() clearSearch = false;
  @Output() searchData = new EventEmitter<string>();
  @Output() searchReset = new EventEmitter<boolean>();
  destroy$ = new Subject<null>();

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          // this.search(searchValue);
          this.searchData.emit(searchValue);
        } else {
          this.resetSearch();
        }
      });
  }

  ngOnInit() {
    // this.clearSearch.pipe(takeUntil(this.destroy$)).subscribe(data => {
    //   if (data) {
    //     this.resetSearch();
    //   }
    // });
  }

  ngOnChanges() {
    if (this.clearSearch) {
      this.resetSearch();
      this.clearSearch = false;
    }
  }

  resetSearch() {
    this.searchForm.reset();
    this.searchReset.emit(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
