import { Injectable } from '@angular/core';
import * as qz from 'qz-tray';
import { KJUR } from 'jsrsasign';
import {
  ApiService,
  getDigitalCertificateUrl,
  getQZTraySignatureUrl
} from '@poss-web/shared/util-api-service';

import { from as fromPromise, Observable } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { printMsgEnum } from '@poss-web/shared/models';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  constructor(private apiService: ApiService) {
    qz.api.setSha256Type(data => KJUR.crypto.Util.sha256(data));

    qz.api.setPromiseType(resolver => new Promise(resolver));

    qz.security.setCertificatePromise((resolve, reject) => {
      this.getQztrayCertificate().subscribe(
        (certificate: any) => {
          resolve(certificate);
        },
        error => {
          console.log(error);
        }
      );
    });

    qz.security.setSignaturePromise(toSign => {
      return (resolve, reject) => {
        this.getQztraySignature(toSign).subscribe((signedMessage: any) => {
          resolve(signedMessage);
        });
      };
    });
  }

  getPrinterList(): Observable<any> {
    if (!qz.websocket.isActive()) {
      return fromPromise(
        qz.websocket
          .connect()
          .then(qz.printers.find)
          .catch(qz.websocket.disconnect)
      );
    } else if (qz.websocket.isActive()) {
      return fromPromise(qz.printers.find().catch(qz.websocket.disconnect));
    }
  }

  print(printerName: string, printData: any): Observable<any> {
    const config = qz.configs.create(printerName, { rasterize: 'false' });

    const data = [
      {
        type: 'pixel',
        format: 'pdf',
        flavor: 'base64',
        data: printData
      }
    ];

    if (!qz.websocket.isActive()) {
      return fromPromise(
        qz.websocket
          .connect()
          .then(() => qz.printers.find(printerName))
          .then(() => qz.print(config, data))
      ).pipe(
        map((x: any) => {
          return printMsgEnum.PRINT_SUCCESS;
        })
      );
    } else if (qz.websocket.isActive()) {

      return fromPromise(
        qz.printers.find(printerName).then(() => qz.print(config, data))
      ).pipe(map((x: any) => printMsgEnum.PRINT_SUCCESS));
    }
  }

  getQztrayCertificate(): Observable<string> {
    const url = getDigitalCertificateUrl();
    return this.apiService.get(url.path, url.params).pipe(
      map((data: any) => data.key),
      catchError(err => {
        return err;
      })
    );
  }

  getQztraySignature(toSign: string): Observable<string> {
    const url = getQZTraySignatureUrl(toSign);

    return this.apiService
      .post(url.path, url.body)
      .pipe(map((data: any) => data.message));
  }
}
