import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DropdownSearchOptionsEnum } from '@poss-web/shared/models';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cn-validation-search',
  templateUrl: './cn-validation-search.component.html',
  styleUrls: ['./cn-validation-search.component.scss']
})
export class CnValidationSearchComponent implements AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchBy: new FormControl('CN_TYPE'),
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();
  @Output() searchEvent = new EventEmitter<any>();
  @Output() clearEvent = new EventEmitter<boolean>();
  dropdownSearchOptions = [
    {
      value: DropdownSearchOptionsEnum.CN_TYPE,
      description: 'CN Type'
    },
    {
      value: DropdownSearchOptionsEnum.CONFIG_NAME,
      description: 'Config Name'
    }
  ];

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        const searchBy = this.searchForm.value.searchBy;
        if (searchValue && searchBy) {
          this.search(searchBy, searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  onSelectionChang($event) {
    const searchValue = this.searchForm.value.searchValue;
    const searchBy = this.searchForm.value.searchBy;
    if (searchValue && searchBy) {
      this.search(searchBy, searchValue);
    }
  }

  search(searchBy, searchValue) {
    if (searchBy === DropdownSearchOptionsEnum.CN_TYPE) {
      this.searchEvent.emit({ ruleType: searchValue });
    } else {
      this.searchEvent.emit({ description: searchValue });
    }
  }

  clearSearch() {
    this.searchForm.get('searchValue').setValue('');
    this.clearEvent.emit(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
