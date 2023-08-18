import {
  Component,
  AfterViewInit,
  ViewChildren,
  ViewContainerRef,
  QueryList,
  OnDestroy,
  ViewChild,
  HostListener
} from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import {
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';

@Component({
  selector: 'poss-web-actual-weight-popup',
  templateUrl: './actual-weight-popup.component.html',
  styleUrls: ['./actual-weight-popup.component.scss']
})
export class ActualWeightPopupComponent
  implements ICellEditorAngularComp, AfterViewInit, OnDestroy {
  params: any;
  formGroup: FormGroup = new FormGroup({});
  actualWeightControl: FormControl;
  reasonControl: FormControl;
  remarksControl: FormControl;
  rowIndex: number;
  reasonOptions = [];
  @ViewChildren('input', { read: ViewContainerRef })
  public inputs: QueryList<any>;
  private focusedInput = 0;
  prevMeasuredWeight: number;

  isValid = true;
  isApplied: boolean;

  destroy$: Subject<null> = new Subject<null>();
  actualWeightPlaceHolder: string;
  remarksPlaceHolder: string;
  reasonPlaceHolder: string;
  toleranceLimit: number;
  shiftKey = false;
  @ViewChild(SelectDropdownComponent)
  selectDropdownRef: SelectDropdownComponent;
  isWeightFocused = true;

  constructor(
    private weightFormatterService: WeightFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.productGrid.actualWeightPlaceHolder',
        'pw.productGrid.remarksPlaceHolder',
        'pw.productGrid.reasonPlaceHolder'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.actualWeightPlaceHolder =
          translatedMessages['pw.productGrid.actualWeightPlaceHolder'];
        this.remarksPlaceHolder =
          translatedMessages['pw.productGrid.remarksPlaceHolder'];
        this.reasonPlaceHolder =
          translatedMessages['pw.productGrid.reasonPlaceHolder'];
      });
  }

  agInit(params: any): void {
    this.params = params;
    this.formGroup = params.context.formGroup;
    this.rowIndex = params.node.rowIndex;
    this.actualWeightControl = this.params.context.formGroup[
      params.node.rowIndex
    ].get('actualWeightGroup.actualWeight');
    this.prevMeasuredWeight = params.value;
    this.actualWeightControl.patchValue(
      this.weightFormatterService.format(this.prevMeasuredWeight)
    );
    this.actualWeightControl.setValidators([
      this.fieldValidatorsService.requiredField(this.actualWeightPlaceHolder),
      this.measuredWeightValidator()
    ]);
    this.reasonControl = this.params.context.formGroup[
      params.node.rowIndex
    ].get('actualWeightGroup.reason');
    this.remarksControl = this.params.context.formGroup[
      params.node.rowIndex
    ].get('actualWeightGroup.remarks');

    this.clearValidation();

    this.isApplied = false;
    this.params.context.componentParent.validEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          if (data === 'error') {
            this.actualWeightControl.patchValue(
              this.weightFormatterService.format(this.prevMeasuredWeight)
            );
            this.params.context.componentParent.closePopup(this.rowIndex);
          } else {
            this.isValid = data.isSuccess;
            if (this.isValid === false) {
              this.toleranceLimit = data.toleranceLimit;
            }
            if (
              this.formGroup[this.rowIndex].valid &&
              this.isValid === true
              // && this.remarksControl.value !== ''
            ) {
              this.actualWeightData();
            }
          }
        }
      });

    this.params.context.componentParent.reasonsEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // console.log('reasonssss', data);
        if (data.length !== 0) {
          data.forEach(element => {
            this.reasonOptions.push({
              value: element,
              description: element
            });
          });
        }
      });
  }

  ngAfterViewInit() {
    this.focusOnInputNextTick(this.inputs.first);
  }

  private focusOnInputNextTick(input: ViewContainerRef) {
    window.setTimeout(() => {
      input.element.nativeElement.focus();
    }, 0);
  }

  getValue() {
    if (this.isApplied === true && this.isValid === true) {
      return this.actualWeightControl.value;
    } else {
      this.actualWeightControl.patchValue(
        this.weightFormatterService.format(this.prevMeasuredWeight)
      );
      return this.weightFormatterService.format(this.prevMeasuredWeight);
    }
  }

  isPopup(): boolean {
    return true;
  }

  stopEditing() {
    this.isApplied = true;
    this.measuredWeightChange();
    this.addValidation();
  }

  closePopup() {
    // if (
    //   this.actualWeightControl.valid &&
    //   this.reasonControl.valid &&
    //   this.remarksControl.valid &&
    //   this.isValid === true
    // // && this.remarksControl.value !== ''
    // ) {
    this.params.context.componentParent.closePopup(this.rowIndex);
    // } else {
    //   this.formGroup[this.rowIndex].markAllAsTouched();
    // }
  }

  onKeyDown(event): void {
    let inputToFocusOn;
    const key = event.which || event.keyCode;
    // shift key
    if (key === 16) {
      if (!this.isWeightFocused) {
        this.shiftKey = true;
      } else {
        this.shiftKey = false;
        this.focusedInput = 0;
        // event.preventDefault();
        // this.focusedInput = 4;
        // const focusedInput = this.focusedInput;
        // inputToFocusOn = this.inputs.find((item: any, index: number) => {
        //   return index === focusedInput;
        // });
        // this.focusOnInputNextTick(inputToFocusOn);
      }
    }
    // tab key = 9  enter key = 13  esc key = 27
    if (key === 9) {
      // tab
      this.preventDefaultAndPropagation(event);

      if (this.shiftKey) {
        this.focusedInput = this.focusedInput - 1;
        const focusedInput = this.focusedInput;
        inputToFocusOn = this.inputs.find((item: any, index: number) => {
          return index === focusedInput;
        });
        if (this.focusedInput !== 1) this.shiftKey = false;
      } else {
        // either move one input along, or cycle back to 0
        this.focusedInput =
          this.focusedInput === this.inputs.length - 1
            ? 0
            : (this.formGroup[this.rowIndex].invalid  && this.focusedInput === 3) ? 0 : this.focusedInput + 1;
        const focusedInput = this.focusedInput;
        inputToFocusOn = this.inputs.find((item: any, index: number) => {
          return index === focusedInput;
        });
      }
      if (this.focusedInput === 1 && this.shiftKey) {
        this.selectDropdownRef.focus();
        this.shiftKey = false;
      } else this.focusOnInputNextTick(inputToFocusOn);
    } else if (key === 13) {
      this.inputs.forEach(input => {
        if (this.focusedInput !== 4 && this.focusedInput !== 3) {
          if (!input.element.nativeElement.value) {
            this.preventDefaultAndPropagation(event);
          }
        }
      });
      if (this.focusedInput === 3) {
        this.resetValue();
        this.preventDefaultAndPropagation(event);
      }
      if (this.focusedInput === 4) {
        this.stopEditing();
        this.preventDefaultAndPropagation(event);
      }
    } else if (key === 27) {
      this.preventDefaultAndPropagation(event);
    }
  }

  private preventDefaultAndPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  addValidation() {
    this.reasonControl.setValidators([
      this.fieldValidatorsService.requiredField(this.reasonPlaceHolder)
    ]);
    this.remarksControl.setValidators([
      // this.fieldValidatorsService.requiredField(this.remarksPlaceHolder),
      this.fieldValidatorsService.remarkField(this.remarksPlaceHolder)
    ]);
    this.reasonControl.updateValueAndValidity();
    this.remarksControl.updateValueAndValidity();
  }

  clearValidation() {
    this.remarksControl.clearValidators();
    this.reasonControl.clearValidators();
    this.reasonControl.updateValueAndValidity();
    this.remarksControl.updateValueAndValidity();
  }

  resetValue() {
    this.actualWeightControl.patchValue(
      this.weightFormatterService.format(this.prevMeasuredWeight)
    );
    this.remarksControl.reset();
    this.reasonControl.reset();
    this.clearValidation();
    this.isValid = true;
  }

  measuredWeightChange() {
    const newMessuredWeight = +this.actualWeightControl.value;
    if (this.prevMeasuredWeight !== newMessuredWeight) {
      this.params.context.componentParent.validate.emit({
        itemId: this.params.data.itemId,
        productGroupCode: this.params.data.productGroup,
        availableWeight: this.params.data.unitWeight,
        measuredWeight: newMessuredWeight,
        measuredQuantity: this.params.data.quantity,
        availableQuantity: this.params.data.quantity
      });
    } else {
      if (
        this.weightFormatterService.format(this.params.data.unitWeight) !==
        this.actualWeightControl.value
      ) {
        this.addValidation();
        if (
          this.formGroup[this.rowIndex].valid
          // && this.remarksControl.value !== ''
        ) {
          this.actualWeightData();
        }
      } else {
        this.actualWeightData();
      }
    }
  }

  private measuredWeightValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value <= 0
        ? { minZero: 'pw.productGrid.weightInvalidErrorMessage' }
        : null;
    };
  }

  actualWeightData() {
    const actualWeightData = {
      actualWeight: this.actualWeightControl.value,
      reason: this.reasonControl.value,
      remarks: this.remarksControl.value
    };
    this.params.context.componentParent.stopEditing(
      actualWeightData,
      this.rowIndex,
      this.params.data
    );
  }

  @HostListener('keyup', ['$event'])
  onKeyDownCheck(event: KeyboardEvent) {
    if (
      this.focusedInput === 0 &&
      event.key === 'Tab' &&
      this.shiftKey === false
    )
      this.onKeyDown(event);
  }

  weightFocused() {
    this.isWeightFocused = true;
  }

  weightUnFocused() {
    this.isWeightFocused = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.params.context.componentParent.validateClear.emit();
  }
}
