import { Injectable } from '@angular/core';
// import { dynamicFormFieldKeyMapMasters } from 'libs/features/inventorymaster/src/lib/master/common/dynamic-form-field-translation-masters.map';
import { TranslateService } from '@ngx-translate/core';

// import { customErrorTranslateKeyMapInventoryMasters } from '@poss-web/features/inventorymaster'
@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  constructor(private translate: TranslateService) { }

  data: any;

  // public requestErrorMessages(formId: number) {
  //   // this.httpClient.get(`http://localhost:3000/data`).subscribe(response => {
  //   //   this.data = response;
  //   // });

  //   this.translate
  //     .get('pw.errorMessages')
  //     .pipe(take(1))
  //     .subscribe((translatedMsg: string) => {
  //       this.data = translatedMsg;
  //     });
  // }

  public getErrorMessage(key: string): Promise<string> {
    // if (dynamicFormFieldKeyMapMasters.has(errorCode)) {
    //   //Obtain the transation key which will be use to obtain the translated error message
    //   //based on the language selected. Default is the english language(refer en.json from asset folder).
    //   key = dynamicFormFieldKeyMapMasters.get(errorCode);
    // } else {
    //   key = 'pw.inventoryMasterValidation.defaultRequired';
    // }
    if (!key) {
      key = 'pw.inventoryMasterValidation.defaultRequired';
    }

    return this.translate.get(key).toPromise();
  }

  /*  public getErrorMessage(errorCode: string): string {
     let key = '';
     if (customErrorTranslateKeyMapInventoryMasters.has(errorCode)) {
       //Obtain the transation key which will be use to obtain the translated error message
       //based on the language selected. Default is the english language(refer en.json from asset folder).
       key = customErrorTranslateKeyMapInventoryMasters.get(errorCode);
     }

     return this.data[key] ? this.data[key] : '';
   } */
}
