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
import { FormControl, FormGroup } from '@angular/forms';
import { Lov, SelectDropDownOption } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-tata-employee',
  templateUrl: './discount-tata-employee.component.html'
})
export class DiscountTataEmployeeComponent
  implements OnInit, OnChanges, OnDestroy {
  tataEmployeeDiscountFormGroup: FormGroup;

  isDiscountApplied = false;

  @Input() tataCompanyList: Lov[] = [];
  @Input() appliedTataEmployeeDiscountDetails = null;
  @Input() cashMemoId: string = null;
  @Input() resetFormEvent: Observable<null>;

  @Output() tataEmployeeDiscountPayload = new EventEmitter<any>();
  @Output() removeTataEmployeeDiscount = new EventEmitter<null>();
  tataCompanyArrayList: SelectDropDownOption[] = [];
  destroy$: Subject<null> = new Subject<null>();
  constructor(private fieldValidatorsService: FieldValidatorsService) {
    this.createTataCompanyDropDownList();
    this.tataEmployeeDiscountFormGroup = new FormGroup({
      employeeName: new FormControl('', [
        this.fieldValidatorsService.nameWithSpaceField('EmployeeName'),
        this.fieldValidatorsService.requiredField('Employee Name')
      ]),
      employeeId: new FormControl('', [
        this.fieldValidatorsService.employeeCodeField('Employee ID'),
        this.fieldValidatorsService.requiredField('Employee ID')
      ]),
      companyName: new FormControl('', [
        this.fieldValidatorsService.alphaNumericWithSpaceField('Company Name'),
        this.fieldValidatorsService.requiredField('Company Name')
      ]),
      isIdProofUploaded: new FormControl('false')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['tataCompanyList']) {
      this.createTataCompanyDropDownList();
    }
    if (changes && changes['appliedTataEmployeeDiscountDetails']) {
      this.updateForm();
    }
  }
  ngOnInit(): void {
    this.resetFormEvent
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(data => {
        this.tataEmployeeDiscountFormGroup.reset();
        this.createTataCompanyDropDownList();
        this.updateForm();
      });
  }
  updateForm() {
    if (this.appliedTataEmployeeDiscountDetails) {
      this.tataEmployeeDiscountFormGroup.patchValue({
        companyName: this.appliedTataEmployeeDiscountDetails?.companyName
          ? this.appliedTataEmployeeDiscountDetails?.companyName
          : null,
        employeeId: this.appliedTataEmployeeDiscountDetails?.employeeId
          ? this.appliedTataEmployeeDiscountDetails?.employeeId
          : null,
        employeeName: this.appliedTataEmployeeDiscountDetails?.employeeName
          ? this.appliedTataEmployeeDiscountDetails?.employeeName
          : null,
        isIdProofUploaded: this.appliedTataEmployeeDiscountDetails
          ?.isIdProofUploaded
          ? this.appliedTataEmployeeDiscountDetails?.isIdProofUploaded
          : null
      });
      this.isDiscountApplied = true;
      this.tataEmployeeDiscountFormGroup.disable();
    } else {
      this.isDiscountApplied = false;
      this.tataEmployeeDiscountFormGroup.enable();
      this.tataEmployeeDiscountFormGroup.reset();
    }
  }
  createTataCompanyDropDownList() {
    //TODO uncommnet
    this.tataCompanyArrayList = [];
    this.tataCompanyList.forEach(company => {
      if (company.isActive) {
        this.tataCompanyArrayList.push({
          value: company.code,
          description: company.value
        });
      }
    });
  }
  onApply() {
    this.tataEmployeeDiscountPayload.emit({
      companyName: this.tataEmployeeDiscountFormGroup.get('companyName').value,
      employeeId: this.tataEmployeeDiscountFormGroup.get('employeeId').value,
      employeeName: this.tataEmployeeDiscountFormGroup.get('employeeName')
        .value,
      isIdProofUploaded: true
    });
  }
  removeCoupon() {
    this.removeTataEmployeeDiscount.emit();
  }
  ngOnDestroy() {
    this.tataEmployeeDiscountFormGroup.reset();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
