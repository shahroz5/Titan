import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {
  PayerBankConfiguration,
  ToggleButtonPayload
} from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-payer-bank-config-items',
  templateUrl: './payer-bank-config-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayerBankConfigItemsComponent
  implements OnDestroy, AfterViewInit {
  @Input() payerBankConfigurationList: PayerBankConfiguration[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() payerBankConfigNameView = new EventEmitter<{
    description: string;
    id: string;
  }>();
  @Output() payerBankConfigName = new EventEmitter<{
    description: string;
    id: string;
  }>();
  @Output() isActive = new EventEmitter<ToggleButtonPayload>();
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() invalidSearch: boolean;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  destroy$ = new Subject<null>();



  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.emitSearchValue.emit(searchValue);
        } else this.clearSearch();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  emitPayerConfigNameView(payerDetails) {
    this.payerBankConfigNameView.emit(payerDetails);
  }
  emitPayerConfigName(payerDetails) {
    this.payerBankConfigName.emit(payerDetails);
  }
  emitIsActive($event) {
    this.searchForm.reset();
    this.isActive.emit($event);
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearEvent.emit();
  }
  emitPageEvent($event) {
    this.searchForm.reset();
    this.paginator.emit($event);
  }
  trackBy(_: string, payerBankConfigName: PayerBankConfiguration) {
    return payerBankConfigName.description;
  }
}
