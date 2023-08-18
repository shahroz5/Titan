import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbCoData } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-ab-co-discount-view',
  templateUrl: './ab-co-discount-view.component.html'
})
export class AbCoDiscountViewComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AbCoDiscountViewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isABOfferApplicable: boolean;
      isCOOfferApplicable: boolean;
      isPreviewApplicable: boolean;
      config: AbCoData;
    }
  ) {}
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
  close() {
    this.dialogRef.close(null);
  }
}
