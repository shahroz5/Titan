import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-emp-discount-location-view',
  templateUrl: './emp-discount-location-view.component.html'
})
export class EmpDiscountLocationViewComponent
  implements OnInit, AfterViewInit, OnChanges {
  @Input() mappedLocation;
  @Input() levels: [] = [];
  @Output() paginator = new EventEmitter<PageEvent>();

  @Input() allSelectedLocations: {
    id: string;
    description: string;
  }[] = [];

  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize;
  @Output() loadLocations = new EventEmitter<any>();
  filterForm = new FormGroup({
    searchValue: new FormControl()
  });
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  destroy$ = new Subject<null>();
  searchValue: string;
  @Output() clear = new EventEmitter<any>();
  rowData = [];

  ngOnInit(): void {
    console.log('mappedLocations', this.mappedLocation);
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.filterForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue: string) {
    this.searchValue = searchValue;
    this.pageEvent.pageIndex = 0;
    this.loadMappedLocation();
  }
  clearSearch() {
    this.filterForm.get('searchValue').reset();
    this.searchValue = null;
    this.clear.emit(false);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['mappedLocation']) {
      console.log(this.mappedLocation, 'rowData');
      this.rowData = [];
      this.mappedLocation.forEach(row => {
        this.rowData.push({
          description: row.description ? row.description : '',
          id: row.id ? row.id : '',
          locationCode: row.locationCode ? row.locationCode : '',
          isQ1Enabled: row.configDetails.Q1.value
            ? row.configDetails.Q1.isQ1Enabled
            : '',
          q1Value: row.configDetails.Q1.value ? row.configDetails.Q1.value : '',
          isQ2Enabled: row.configDetails.Q2.value
            ? row.configDetails.Q2.isQ2Enabled
            : '',
          q2Value: row.configDetails.Q2.value ? row.configDetails.Q2.value : '',
          isQ3Enabled: row.configDetails.Q3.value
            ? row.configDetails.Q3.isQ3Enabled
            : '',
          q3Value: row.configDetails.Q3.value ? row.configDetails.Q3.value : '',
          isQ4Enabled: row.configDetails.Q4.value
            ? row.configDetails.Q4.isQ4Enabled
            : '',
          q4Value: row.configDetails.Q4.value ? row.configDetails.Q4.value : '',
          isActive: row.isActive ? row.isActive : false,
          subBrandCode: row.subBrandCode ? row.subBrandCode : ''
        });
      });
    }
  }
  loadMappedLocation() {
    this.loadLocations.emit({
      searchValue: this.searchValue
    });
  }
}
