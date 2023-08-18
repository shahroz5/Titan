import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MappedDetails } from '@poss-web/shared/models';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-product-category-mapping-view',
  templateUrl: './product-category-mapping-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryMappingViewComponent
  implements AfterViewInit {
  @Input() mappedProductCategory: {
    id: string;
    productCategoryCode: string;
    productCategoryDescription: string;
  }[] = [];

  @Input() allMappedProductCategory: MappedDetails[] = [];

  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize: number;

  searchParameter: string;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  destroy$ = new Subject<null>();
  filterForm = new FormGroup({
    searchValue: new FormControl()
  });
  @Output() loadPc = new EventEmitter<any>();




  ngAfterViewInit(): void {
    console.log(this.allMappedProductCategory, 'selected in UI');
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('filterForm', this.filterForm);
        const searchValue = this.filterForm.value.searchValue;
        console.log(searchValue);
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  search(searchValue: string) {
    console.log(searchValue);
    this.searchParameter = searchValue;
    this.loadMappedProductCategories();
  }
  clearSearch() {
    this.filterForm.get('searchValue').reset();
    this.searchParameter = null;
    this.loadMappedProductCategories();
  }
  loadMappedProductCategories() {
    this.loadPc.emit({
      searchValue: this.searchParameter,
      pageEvent: this.pageEvent
    });
  }
  paginate(data) {
    this.pageEvent = data;
    this.loadMappedProductCategories();
  }
}
