import { BinToBinTransferItem } from '@poss-web/shared/models';
import * as moment from 'moment';

export class BinToBinTransferItemAdaptor {
  static fromJson(
    item: any,
    studdedProductGroups: string[] = []
  ): BinToBinTransferItem {
    return {
      id: item.id,
      binCode: item.binCode,
      itemCode: item.itemCode,
      itemDetails: item.itemDetails,
      stdValue: item.stdValue ? item.stdValue : 0,
      stdWeight: item.stdWeight,
      lotNumber: item.lotNumber,
      mfgDate: item.mfgDate ? moment(item.mfgDate) : null,
      availableValue: item.availableValue ? item.availableValue : 0,
      availableWeight: item.availableWeight,
      isBinToBinAllowed: item.isBinToBinAllowed,
      currencyCode: item.currencyCode,
      weightUnit: item.weightUnit,
      imageURL: item.imageURL,
      thumbnailImageURL: item.thumbnailImageURL,
      binGroupCode: item.binGroupCode,
      availableQuantity: item.availableQuantity,
      transferQuantity: item.availableQuantity,
      productCategory: item.productCategory,
      productGroup: item.productGroup,
      productCategoryDesc: item.productCategoryDesc,
      productGroupDesc: item.productGroupDesc,
      isSelected: false,
      isDisabled: false,
      destinationBinGroupCode: null,
      destinationBinCode: null,
      //for history item
      destBinCode: item.destBinCode,
      status: item.status,
      measuredWeight: item.measuredWeight,
      measuredQuantity: item.measuredQuantity,
      // remarks: item.remarks,
      isStudded: studdedProductGroups.includes(item.productGroup),
      isLoadingImage: false,
      isLoadingThumbnailImage: false,
      defectCodeDesc: item.defectCodeDesc,
      defectTypeDesc: item.defectTypeDesc,
      fileId: item.fileId
    };
  }
}
