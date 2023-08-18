import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {
  GrnReqStatus,
  GrnEnums,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/Operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-grn-status-items',
  templateUrl: './grn-status-items.component.html',
  styleUrls: ['./grn-status-items.component.scss']
})
export class GrnStatusItemsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() grnReqStatus: GrnReqStatus[];
  @Input() count: number;
  @Input() pageSize: number;
  @Input() invalidSearch: boolean;

  @Output() loadFilterdType = new EventEmitter<any>();
  @Output() loadSearchValue = new EventEmitter<any>();
  @Output() searchClear = new EventEmitter<any>();
  @Output() loadPaginatedList = new EventEmitter<any>();
  @Output() selectedGrn = new EventEmitter<{grnId: string, isWorkflow: boolean}>();
  grnEnums = GrnEnums;

  grnStausArray: SelectDropDownOption[] = [];
  selectedRequestType = this.grnEnums.APPROVED;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();
  requestTypeControl: FormControl;
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate
      .get(['pw.grn.approved', 'pw.grn.rejected', 'pw.grn.pending'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.requestTypeControl = new FormControl(this.grnEnums.APPROVED);
        this.grnStausArray.push(
          {
            value: this.grnEnums.APPROVED,
            description: translatedMessages['pw.grn.approved']
          },
          {
            value: this.grnEnums.PENDING,
            description: translatedMessages['pw.grn.pending']
          },
          {
            value: this.grnEnums.REJECTED,
            description: translatedMessages['pw.grn.rejected']
          }
        );
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.loadSearchValue.emit(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  onSelected(event) {
    this.selectedGrn.emit({
      grnId: event.grnId,
      isWorkflow: true
    });
  }
  clearSearch() {
    this.searchForm.reset();
    this.searchClear.emit(true);
  }
  onRequestTypeDropDownChange(changeEvent) {
    this.searchForm.reset();
    this.requestTypeControl.patchValue(changeEvent.value);
    this.loadFilterdType.emit(changeEvent.value);
  }
  loadList(event) {
    this.loadPaginatedList.emit(event);
  }
  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;
    return pattern.test($event.key);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
