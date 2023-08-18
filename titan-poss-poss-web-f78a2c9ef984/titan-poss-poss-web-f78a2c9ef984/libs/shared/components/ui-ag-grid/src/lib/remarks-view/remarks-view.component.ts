import {
  Component,
  OnDestroy,
  ViewChildren,
  ViewContainerRef,
  QueryList
} from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-remarks-view',
  templateUrl: './remarks-view.component.html',
  styleUrls: ['./remarks-view.component.scss']
})
export class RemarksViewComponent
  implements ICellEditorAngularComp, OnDestroy {
  params: any;
  remarksControl: FormControl;

  @ViewChildren('input', { read: ViewContainerRef })
  public inputs: QueryList<any>;
  destroy$: Subject<null> = new Subject<null>();
  remarksPlaceHolder: string;

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get(['pw.remarksPopup.remarksPlaceHolder'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksPlaceHolder =
          translatedMessages['pw.remarksPopup.remarksPlaceHolder'];
      });
  }

  agInit(params: any): void {
    this.params = params;
    console.log(this.params);
    this.remarksControl = new FormControl(params.data.remarks);
  }



  getValue() {
    return this.remarksControl.value;
  }

  isPopup(): boolean {
    return true;
  }

  closePopup() {
    this.params.api.stopEditing();
  }

  // clearRemarks() {
  //   this.remarksControl.reset();
  // }
  // applyRemarks() {
  //   this.params.api.stopEditing();
  // }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
