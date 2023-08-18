import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CNDetailsResponsePayload, CreditNoteType, ProductTypesEnum } from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'poss-web-view-cn-popup',
  templateUrl: './view-cn-popup.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewCnPopupComponent implements OnInit, OnDestroy {

  cnForm: FormGroup;
  cnTypeChange = new EventEmitter();
  cnAdd = new EventEmitter();
  cnTypesList = [];
  cnNumbersList = [];
  selectedCnDetails: CNDetailsResponsePayload;
  productTypesRef = ProductTypesEnum;
  destroy$: Subject<null> = new Subject<null>();
  goldRateFixLabel:string;
  grnGoldRateLabel:string;

  constructor(
    public dialogRef: MatDialogRef<ViewCnPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: CNDetailsResponsePayload,  private translate: TranslateService) { 
      this.translate
      .get([
        'pw.productGrid.goldRateFixLabel',
        'pw.productGrid.grnGoldRateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.goldRateFixLabel =
          translatedMessages['pw.productGrid.goldRateFixLabel'];
        this.grnGoldRateLabel =
          translatedMessages['pw.productGrid.grnGoldRateLabel'];
      });

      this.cnTypesList = [{
        value: CreditNoteType.ADV,
        description: this.goldRateFixLabel
      },
      {
        value: CreditNoteType.GRN,
        description: this.grnGoldRateLabel
      }
    ];
    }

  ngOnInit(): void {
    this.cnNumbersList =[{
      value: this.data.docNo,
      description: this.data.docNo
    }]
    this.createForm();
  }

  createForm() {
    this.cnForm = new FormGroup({
      cnType: new FormControl(this.data.creditNoteType),
      cnNumber: new FormControl(this.data.docNo),
      billingType: new FormControl(this.data.productType)
    })
  }

  closePopup(): void {
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  }
