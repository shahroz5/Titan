import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import { MatRadioButton } from '@angular/material/radio';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-order-search',
  templateUrl: './order-search.component.html',
  styleUrls: ['./order-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSearchComponent implements OnInit, OnDestroy, OnChanges {
  orderForm: FormGroup;
  @Output() selectedDocNumberEmit = new EventEmitter<any>();
  destroy$: Subject<null> = new Subject<null>();
  @Input() clearFormEvent: Observable<null>;
  @Input() disableFormEvent: Observable<boolean>;
  @Input() currentFiscalYear;
  currentYear = moment().year();
  docNumberTxt: string;
  fiscalYearTxt: string;
  @Input() abDetails: any;
  @ViewChild('docNumber', { static: true })
  docNumber: ElementRef;
  @Input() setFocus: boolean;
  @ViewChild('abRadioButton')
  abRadioButton: MatRadioButton;
  @ViewChild(SelectDropdownComponent, { static: true })
  selectDropdownRef: SelectDropdownComponent;
  permissions$: Observable<any[]>;

  CASH_MEMO_AB_TO_CM_SUBMENU =
    'Customer Transaction Status-Cashmemo AB to CM Submenu';

  constructor(
    private formBuilder: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.translate
      .get(['pw.orderSearch.docNumberTxt', 'pw.orderSearch.fiscalYearTxt'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.docNumberTxt = translatedMessages['pw.orderSearch.docNumberTxt'];
        this.fiscalYearTxt = translatedMessages['pw.orderSearch.fiscalYearTxt'];
      });
    this.orderForm = this.formBuilder.group({
      orderType: new FormControl(null),
      fiscalYear: new FormControl(null, [
        // this.fieldValidatorsService.numbersField(this.fiscalYearTxt),
        // this.fieldValidatorsService.maxLength(4, this.fiscalYearTxt),
        // this.fieldValidatorsService.minLength(4, this.fiscalYearTxt),
        // this.fieldValidatorsService.max(this.currentYear, this.fiscalYearTxt)
      ]),
      docNumber: new FormControl(null, [
        this.fieldValidatorsService.numbersField(this.docNumberTxt),
        this.fieldValidatorsService.min(1, this.docNumberTxt)
      ])
    });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.clearFormEvent.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.orderForm.reset();
      this.orderForm.enable();
      this.orderForm.get(['fiscalYear']).patchValue(this.currentFiscalYear);
    });

    this.disableFormEvent.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.orderForm.disable();
      } else {
        this.orderForm.enable();
      }
    });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['abDetails'] && this.abDetails) {
      this.orderForm.get(['orderType']).patchValue('1');
      this.orderForm.get(['fiscalYear']).patchValue(this.abDetails.fiscalYear);
      this.orderForm.get(['docNumber']).patchValue(this.abDetails.docNo);
    }

    if (changes['fiscalYear']) {
      this.orderForm.get(['fiscalYear']).patchValue(this.currentFiscalYear);
    }

    if (changes['setFocus']) {
      if (this.setFocus) {
        setTimeout(() => {
          this.abRadioButton.focus();
          this.orderForm.get(['orderType']).patchValue('1');
        }, 100);
      }
    }
  }

  selectedDocNumber() {
    const searchData = {
      orderType: this.orderForm.value.orderType,
      fiscalYear: this.orderForm.value.fiscalYear,
      docNumber: this.orderForm.value.docNumber
    };
    this.selectedDocNumberEmit.emit(searchData);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
