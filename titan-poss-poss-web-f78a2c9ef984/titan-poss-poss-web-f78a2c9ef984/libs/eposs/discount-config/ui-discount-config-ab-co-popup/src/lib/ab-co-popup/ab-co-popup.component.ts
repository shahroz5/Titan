import { AbCoData, DiscountApplicableEnum } from '@poss-web/shared/models';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-ab-co-popup',
  templateUrl: './ab-co-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbCoPopupComponent implements OnInit {
  configForm: FormGroup;
  abCoData: {
    abPreview: string;
    coPreview: string;
    abPostPreview: string;
    coPostPreview: string;
  } = {
    abPreview: null,
    coPreview: null,
    abPostPreview: null,
    coPostPreview: null
  };
  constructor(
    public dialogRef: MatDialogRef<AbCoPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isABOfferApplicable: boolean;
      isCOOfferApplicable: boolean;
      isPreviewApplicable: boolean;
      config: AbCoData;
    }
  ) {}

  ngOnInit() {
    this.getData();
    this.configForm = new FormGroup({
      abPreview: new FormControl(this.abCoData?.abPreview),
      coPreview: new FormControl(this.abCoData?.coPreview),
      abPostPreview: new FormControl(this.abCoData?.abPostPreview),
      coPostPreview: new FormControl(this.abCoData?.coPostPreview)
    });
  }

  getData() {
    if (this.data && this.data.config) {
      const abData = this.data.config.abDiscount;
      const coData = this.data.config.coDiscount;

      if (abData?.preview) {
        this.abCoData.abPreview = 'Preview';
      } else if (abData?.regular) {
        this.abCoData.abPreview = 'Regular';
      } else if (abData?.ab) {
        this.abCoData.abPreview = 'AB';
      }

      if (abData?.postAB) {
        this.abCoData.abPostPreview = 'AB';
      } else if (abData?.postRegular) {
        this.abCoData.abPostPreview = 'Regular';
      }

      if (coData?.preview) {
        this.abCoData.coPreview = 'Preview';
      } else if (coData?.regular) {
        this.abCoData.coPreview = 'Regular';
      } else if (coData?.co) {
        this.abCoData.coPreview = 'CO';
      }

      if (coData?.postCO) {
        this.abCoData.coPostPreview = 'CO';
      } else if (coData?.postRegular) {
        this.abCoData.coPostPreview = 'Regular';
      }
    }
  }

  getResponse() {
    const data = this.configForm.value;

    if (!this.data?.isABOfferApplicable) {
      (data.abPreview = null), (data.abPostPreview = null);
    }

    if (!this.data?.isCOOfferApplicable) {
      (data.coPreview = null), (data.coPostPreview = null);
    }

    if (!this.data?.isPreviewApplicable) {
      (data.abPreview = null), (data.coPreview = null);
    }

    return {
      abCoData: {
        type: DiscountApplicableEnum.AB_CO_DATA,
        data: {
          coDiscount: {
            preview: data.coPreview === 'Preview' ? true : false,
            regular: data.coPreview === 'Regular' ? true : false,
            co: data.coPreview === 'CO' ? true : false,
            postCO: data.coPostPreview === 'CO' ? true : false,
            postRegular: data.coPostPreview === 'Regular' ? true : false
          },
          abDiscount: {
            preview: data.abPreview === 'Preview' ? true : false,
            regular: data.abPreview === 'Regular' ? true : false,
            ab: data.abPreview === 'AB' ? true : false,
            postAB: data.abPostPreview === 'AB' ? true : false,
            postRegular: data.abPostPreview === 'Regular' ? true : false
          }
        }
      }
    };
  }

  close() {
    this.dialogRef.close(null);
  }

  apply() {
    this.dialogRef.close(this.getResponse());
  }


}
