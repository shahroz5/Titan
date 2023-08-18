import { Injectable } from '@angular/core';
import { getErrorLogUrl, ApiService } from '@poss-web/shared/util-api-service';
import { responseTypeEnum, FileGroupEnum } from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  constructor(private apiService: ApiService) {}

  download(fileName, path) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = path;
    link.click();
  }
  getErrorResponse(errorId: string, type) {
    const downLoadUrl = getErrorLogUrl(errorId, type);
    console.log('downLoadUrl', downLoadUrl);
    this.apiService.ResponseContentType = responseTypeEnum.BLOB;
    return this.apiService
      .get(downLoadUrl.path, downLoadUrl.params)
      .pipe(map((data: any) => data));
  }

  downloadErrorFile(data: any, filename) {
    const blob: Blob = new Blob([data], { type: 'text/csv' });
    const fileName: string = filename + '.csv';

    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  downloadReportFile(data: any, filename) {
    const blob: Blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const fileName: string = filename + '.xlsx';

    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  downloadDocumentFile(data: any, filename) {
    const blob: Blob = new Blob([data], {
      type: 'application/pdf'
    });
    const fileName: string = filename + '.pdf';

    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }
}
