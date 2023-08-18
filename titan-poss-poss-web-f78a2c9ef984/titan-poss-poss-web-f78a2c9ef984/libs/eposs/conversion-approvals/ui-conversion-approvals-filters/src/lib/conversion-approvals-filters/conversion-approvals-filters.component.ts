import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationSummaryList } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-conversion-approvals-filters',
  templateUrl: './conversion-approvals-filters.component.html'
})
export class ConversionApprovalsFiltersComponent
  implements OnChanges, OnInit, OnDestroy {
  @Input() locations: LocationSummaryList[] = [];
  @Input() clearFilters = false;
  @Output() private search: EventEmitter<{
    locationCode: string;
    requestDocNo: number;
  }> = new EventEmitter<{
    locationCode: string;
    requestDocNo: number;
  }>();

  selectLocationLableText: string;
  searchLocationPlaceHolder: string;
  destroy$: Subject<null> = new Subject<null>();
  locationForSelection: SelectionDailogOption[] = [];
  selectedLocation: SelectionDailogOption;
  locationCode: string;
  searchFormControl = new FormControl();

  constructor(
    public translate: TranslateService,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService
  ) {
    this.translate
      .get([
        'pw.conversionApprovals.selectLocationCode',
        'pw.conversionApprovals.searchByLocationCode'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectLocationLableText =
          translatedMessages['pw.conversionApprovals.selectLocationCode'];
        this.searchLocationPlaceHolder =
          translatedMessages['pw.conversionApprovals.searchByLocationCode'];
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clearFilters'] && this.clearFilters === true) {
      this.locationCode = null;
      this.selectedLocation = null;
      this.searchFormControl.patchValue('');
      // Emit Search
      this.searchFilters();
    }

    if (changes['locations']) {
      if (this.locations && this.locations.length > 0) {
        this.locationForSelection = this.locations.map(location => ({
          id: location.locationCode,
          description: location.locationCode + ' - ' + location.description
        }));
      }
    }
  }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((a, b) => a === b),
        debounceTime(1000)
      )
      .subscribe((event: any) => {
        if (!this.clearFilters) {
          this.searchFilters();
        }
      });
  }

  openLocationPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          this.locationCode = selectedOption.id;

          this.searchFilters();
        }
      });
  }
  searchFilters() {
    const filterPayload: {
      locationCode: string;
      requestDocNo: number;
    } = {
      locationCode: this.locationCode,
      requestDocNo: this.searchFormControl.value
    };
    this.search.emit(filterPayload);
  }

  clearPopup() {
    this.locationCode = null;
    this.selectedLocation = null;
    this.searchFilters();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
