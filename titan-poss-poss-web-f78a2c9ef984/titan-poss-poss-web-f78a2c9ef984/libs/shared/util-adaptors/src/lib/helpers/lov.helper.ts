import { Lov } from '@poss-web/shared/models';
import { LovAdaptor } from '../masters/lov.adaptors';

export class LovHelper {
  static getLovs(data: any): Lov[] {
    const Lovs: Lov[] = [];
    for (const lov of data) {
      Lovs.push(LovAdaptor.LovDataFromJson(lov));
    }
    return Lovs;
  }
}
