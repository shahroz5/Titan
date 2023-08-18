import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class BarcodeReaderService {
  private regexNumber: RegExp = new RegExp('^[A-Z a-z 0-9]$');
  private regexGepNumber: RegExp = new RegExp('^[0-9. ]$');
  private _barCodeInput = '';
  private _barCodeGepInput = '';
  private _barCodeItemCode: string = null;
  private _barCodeLotNumber: string = null;
  private sequence = [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23];
  private _barCodeWeight: string = null;
  private _barCodePurity: string = null;

  get barCodeItemCode(): string {
    return this._barCodeItemCode;
  }
  get barCodeLotNumber(): string {
    return this._barCodeLotNumber;
  }

  get GepBarCodeWeight(): string {
    return this._barCodeWeight;
  }
  get GepBarCodePurity(): string {
    return this._barCodePurity;
  }

  complete = new Subject();
  gepInput = new Subject();


  variantCodeInput(event: KeyboardEvent) {
    if (this.regexNumber.test(event.key)) {
      this._barCodeInput += event.key;
    }
    if (event.key === 'Tab') {
      if (this._barCodeInput !== '') {
        event.preventDefault();
        // Assign the input to barCodeItemCode and barCodeLotNumber after TAB key event
        if (this._barCodeItemCode) {
          this._barCodeLotNumber = this._barCodeInput;
        } else {
          this._barCodeItemCode = this._barCodeInput;
        }
        this._barCodeInput = '';
      }
      console.log('keyboard event: Tab : ItemCode, LotNumber:', this._barCodeItemCode, this._barCodeLotNumber);
      // Inset barcode lotnumber in search box if lotnuber is inputed by barcode
      if (this._barCodeItemCode && this._barCodeItemCode !== '' && this._barCodeLotNumber) {
        this.complete.next({
          barCodeItemCode: this._barCodeItemCode,
          barCodeLotNumber: this._barCodeLotNumber
        });
      }
    // } else if (event.key === 'Enter') {
    }
  }

  gepBarCodeReader(event: KeyboardEvent) {
    if (this.regexGepNumber.test(event.key)) {
      console.log('abc' + event.key + 'gj');
      console.log(this._barCodeGepInput);
      this._barCodeGepInput = this._barCodeGepInput + event.key;
    }
    console.log(this._barCodeGepInput);
    console.log('event=' + event.key );
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Tab') {
      if (this._barCodeGepInput !== '' && !this._barCodeWeight) {
        console.log(this._barCodeGepInput);

        this._barCodeWeight = this._barCodeGepInput;
        this._barCodeGepInput = '';
        console.log(this._barCodeWeight, this._barCodePurity, 'IN');
      } else if (this._barCodeGepInput !== '' && !this._barCodePurity) {
        console.log(this._barCodeGepInput);

        this._barCodePurity = this._barCodeGepInput;

        console.log(this._barCodeWeight, this._barCodePurity, 'IN');
      }
    } else if (event.key === 'Enter') {
      // Inset barcode lotnumber in search box if lotnuber is inputed by barcode
      // if (this._barCodeGepInput !== '') {
      //   console.log(this._barCodeGepInput);

      //   this._barCodePurity = this._barCodeGepInput;

      //   console.log(this._barCodeWeight, this._barCodePurity, 'IN');
      // }

      if (this._barCodePurity && this._barCodePurity !== '') {
        console.log(this._barCodeWeight, this._barCodePurity, 'Check');
        this.gepInput.next({
          barCodeWeight: this._barCodeWeight,
          barCodePurity: this._barCodePurity
        });
        console.log(this.gepInput, 'IN');
      }
      this._barCodeGepInput = '';
    }
  }

  getGiftCardNumber(TrackData) {
    //key value pair mapping to get the card number
    const trackDataList = Array.from(TrackData, Number);
    return this.sequence.map(x => trackDataList[x]).join('');
  }

  clearBarcodeData(): void {
    this._barCodeInput = '';
    this._barCodeItemCode = null;
    this._barCodeLotNumber = null;
  }

  clearGepBarcodeData(): void {
    this._barCodeGepInput = '';
    this._barCodeWeight = null;
    this._barCodePurity = null;
  }
}
