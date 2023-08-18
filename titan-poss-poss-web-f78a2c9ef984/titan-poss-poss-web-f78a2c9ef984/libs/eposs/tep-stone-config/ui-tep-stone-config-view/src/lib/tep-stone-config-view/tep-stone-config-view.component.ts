import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  TEPStoneConfig,
  TEPStoneConfigDetails,
  TEPStoneConfigRange,
  TEPStoneConfigStoneType
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-stone-config-view',
  templateUrl: './tep-stone-config-view.component.html'
})
export class TepStoneConfigViewComponent
  implements OnChanges, AfterViewInit {
  @Input() tepStoneConfig: TEPStoneConfig;
  @Input() tepStoneConfigDetailsList: TEPStoneConfigDetails[];
  @Input() tepStoneConfigStoneType: TEPStoneConfigStoneType[];
  @Input() tepStoneConfigRange: TEPStoneConfigRange[];
  @Output() openLocationMapping = new EventEmitter<boolean>();
  @Output() stoneTypeCodeGridSearch = new EventEmitter<string>();
  @Output() clearGridSearch = new EventEmitter<boolean>();
  destroy$: Subject<null> = new Subject<null>();

  columnDefs = [];
  defaultColDef = {
    suppressMovable: true
  };
  gridAPI: GridApi;
  rowData = [];
  animateRows = true;
  domLayout = 'autoHeight';
  rowHeight = 35;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  expanded = true;

  constructor(private translationService: TranslateService) {
    this.translationService
      .get([
        'pw.tepStoneConfig.configName',
        'pw.tepStoneConfig.stoneTypeCodeTranslate',
        'pw.tepStoneConfig.descriptionTranslate',
        'pw.tepStoneConfig.stoneQualityTranslate',
        'pw.tepStoneConfig.rangeTranslate',
        'pw.tepStoneConfig.deductionPercentTranslate',
        'pw.tepStoneConfig.removeTranslate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.columnDefs = [
          {
            headerName:
              translatedMsg['pw.tepStoneConfig.stoneTypeCodeTranslate'],
            field: 'stoneTypeCode',
            minWidth: 190,
            width: 190,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMsg['pw.tepStoneConfig.descriptionTranslate'],
            field: 'description',
            minWidth: 190,
            width: 190,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName:
              translatedMsg['pw.tepStoneConfig.stoneQualityTranslate'],
            field: 'stoneQuality',
            minWidth: 190,
            width: 190,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMsg['pw.tepStoneConfig.rangeTranslate'],
            field: 'range',
            minWidth: 190,
            width: 190,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: 'rangeId',
            field: 'range',
            width: 190,
            minWidth: 190,
            hide: true,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName:
              translatedMsg['pw.tepStoneConfig.deductionPercentTranslate'],
            field: 'dedutionPercent',
            minWidth: 190,
            width: 190,
            resizable: true,
            suppressSizeToFit: true
          }
        ];
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue: string) {
    this.stoneTypeCodeGridSearch.emit(searchValue);
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearGridSearch.emit(true);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['tepStoneConfigDetailsList'] ||
      changes['tepStoneConfigStoneType'] ||
      changes['tepStoneConfigRange']
    ) {
      this.rowData = [];
      this.tepStoneConfigDetailsList.forEach(details => {
        this.rowData.push({
          dedutionPercent: details.dedutionPercent,
          range: this.getTepStoneConfigRange(details.rangeId),
          stoneQuality: details.stoneQuality,
          stoneTypeCode: details.stoneTypeCode,
          description: this.getStoneDescription(details.stoneTypeCode)
        });
      });
    }
  }
  getStoneDescription(stoneTypeCode: string) {
    return this.tepStoneConfigStoneType.find(
      val => val.stoneTypeCode === stoneTypeCode
    ).description;
  }
  getTepStoneConfigRange(rangeId) {
    return this.tepStoneConfigRange.find(val => val.id === rangeId).range;
  }
  openViewLocationMapping() {
    this.openLocationMapping.emit(true);
  }
  gridReady(params: GridReadyEvent) {
    this.gridAPI = params.api;
  }
  onGridSizeChanged(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
