/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class InvoiceFileStageDto {

	private String type;
	private String tilConstant;
	private String srcLocation;
	private String cfaType;
	private String cfaProductCode;
	private String cfaInvoiceNumber;
	private String cfaInvoiceDate;
	private String cfaFiscalYear;
	private String cfaUniqueKey;
	private String cfaCustomerNumber;
	
	private String ihdrCfaTotPrimaryQty;
	private String ihdrCfaTotSecondaryQty;
	private String ihdrCfaItemBasicValue;
	private String ihdrCfaTotDiscountAmount;
	private String ihdrCfaTaxAmount;
	private String ihdrCfaOtherCharges;

	private String idtlItemNo;
	private String idtlLineCount;
	private String idtlCfaVariantType;
	private String idtlItemNo2;
	private String idtlUnitPrice;
	private String idtlPrimaryQty;
	private String idtlSecondaryQty;
	private String idtlCfaNetAmount;
	private String idtlLotNumber;
	private String idtlCfaF1;
	private String idtlCfaDiamondWeight;
	private String idtlCfaOtherStoneWeight;
	private String idtlCfaInvoiceType;
	private String idtlGoNetWt;
	private String idtlPtNetWt;
	private String idtlStnNetWt;
	private String idtlSiNetWt;
	private String idtlOtherNetWt;
	private String idtlMfgDate;
	private String idtlOrderNo;
	private String idtlIsHallMarking;
	private String idtlHallMarkingCode;
	private String idtlHallMarkingCenterName;
	private String idtlHallMarkedDate;
	private String idtlHallMarkRemarks;
	private String idtlHallMarkRemarks1;
	
	private String isacLineCount;
	private String isacLineDtlCount;
	private String isacGlKey;
	private String isacDcInd;
	private String isacDiscPerc;
	private String isacDiscAmt;
	private String isacDiscSrcAmt;

	private String ildtlLineCount;
	private String ildtlLineDtlCount;
	private String ildtlItemNo;
	private String ildtlStnWeight;
	private String ildtlStnQty;

	private String imdtlLineCount;
	private String imdtlLineDtlCount;
	private String imdtlItemNo;
	private String imdtlStnWeight;
	private String imdtlStnQty;

	private String ictrlCfaFileLines;
	private String ictrlHdrLineCount;
	private String ictrlHdrTotalWeight;
	private String ictrlHdrTotalValue;

	private String fileId;

}
