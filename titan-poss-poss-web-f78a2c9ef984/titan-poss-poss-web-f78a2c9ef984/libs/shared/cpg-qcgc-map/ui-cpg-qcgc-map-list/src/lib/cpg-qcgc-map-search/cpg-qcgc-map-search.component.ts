import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cpg-qcgc-map-search',
  templateUrl: './cpg-qcgc-map-search.component.html',
  styleUrls: ['./cpg-qcgc-map-search.component.scss']
})
export class CpgQcgcMapSearchComponent implements AfterViewInit, OnDestroy {

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
