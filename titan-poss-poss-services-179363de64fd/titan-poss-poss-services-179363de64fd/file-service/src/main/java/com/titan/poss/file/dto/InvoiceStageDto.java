/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class InvoiceStageDto {

	private String type;
	private String tilConstant;
	private String srcLocation;
	private Integer cfaType;
	private String cfaProductCode;
	private Integer cfaInvoiceNumber;
	private Date cfaInvoiceDate;
	private Integer cfaFiscalYear;
	private String cfaUniqueKey;
	private String cfaCustomerNumber;
	
	private Integer ihdrCfaTotPrimaryQty;
	private BigDecimal ihdrCfaTotSecondaryQty;
	private BigDecimal ihdrCfaItemBasicValue;
	private BigDecimal ihdrCfaTotDiscountAmount;
	private BigDecimal ihdrCfaTaxAmount;
	private BigDecimal ihdrCfaOtherCharges;
	
	private String ihdrDestLocationCode;
	
	private String currencyCode;

	private String idtlItemNo;
	private Integer idtlLineCount;
	private String idtlCfaVariantType;
	private String idtlItemNo2;
	private BigDecimal idtlUnitPrice;
	private Integer idtlPrimaryQty;
	private BigDecimal idtlSecondaryQty;
	private BigDecimal idtlCfaNetAmount;
	private String idtlLotNumber;
	private BigDecimal idtlCfaF1;
	private BigDecimal idtlCfaDiamondWeight;
	private BigDecimal idtlCfaOtherStoneWeight;
	private String idtlCfaInvoiceType;
	private BigDecimal idtlGoNetWt;
	private BigDecimal idtlPtNetWt;
	private BigDecimal idtlStnNetWt;
	private BigDecimal idtlSiNetWt;
	private BigDecimal idtlOtherNetWt;
	private Date idtlMfgDate;
	private String idtlOrderNo;
	private boolean isHallMarking;
	
	private String idtlIsacDetails;
	private String idtlBinCode;
	private String idtlBinGroupCode;
	private String issuedWeightDetails;
	private String productCategoryCode;
	private String itemDetails;
	
	private Integer isacLineCount;
	private Integer isacLineDtlCount;
	private String isacGlKey;
	private String isacDcInd;
	private BigDecimal isacDiscPerc;
	private BigDecimal isacDiscAmt;
	private BigDecimal isacDiscSrcAmt;

	private Integer ildtlLineCount;
	private Integer ildtlLineDtlCount;
	private String ildtlItemNo;
	private BigDecimal ildtlStnWeight;
	private Integer ildtlStnQty;

	private Integer imdtlLineCount;
	private Integer imdtlLineDtlCount;
	private String imdtlItemNo;
	private BigDecimal imdtlStnWeight;
	private Integer imdtlStnQty;
	
	private String itemCode;
	private String lotNumber;
	private String insertUpdate;

	private Integer ictrlCfaFileLines;
	private Integer ictrlHdrLineCount;
	private BigDecimal ictrlHdrTotalWeight;
	private BigDecimal ictrlHdrTotalValue;

	private String fileId;

}
