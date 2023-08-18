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
public class StnStageDto {

	private String type;
	private String tilConstant;
	private String location;
	private Integer transferType;
	private String productGroup;
	private Integer createdYear;
	private Integer deliveryNo;
	private String stmDate;
	private String hdrBlank1;
	private String factoryCode;
	private String hdrBlank2;
	private String stmDate2;
	private String hdrBlank3;
	private String hdrBlank4;
	private String hdrBlank5;
	private String hdrBlank6;
	private BigDecimal hdrGoldRate;
	private Integer hdrShipQty;
	private BigDecimal hdrShipQty2;
	private BigDecimal hdrStmValue;
	private String hdrCarrierName;
	private String hdrBlank7;
	private String hdrBlank8;
	private String hdrBlank9;
	private String hdrBlank10;
	private String hdrBlank11;
	private String hdrBlank12;
	private String hdrBlank13;
	private String hdrBlank14;
	private String hdrBlank15;
	private String hdrBlank16;
	private String hdrBlank17;
	private String hdrBlank18;
	private Integer hdrZeroConstant;
	private String hdrCreatedBy;
	private String hdrStmCreatedDate;
	private String hdrStmCreatedTime;
	private String hdrUpdatedBy;
	private String hdrDocketNumber;
	private String hdrCarrierDetails;
	private String hdrStockTransferType;
	private Date hdrCreatedDate;

	private String dtlSlNo;
	private String dtlOrderType;
	private String dtlGoldRate;
	private String dtlProductCode;
	private String dtlProductValue1;
	private String dtlProductQty;
	private String dtlProductWt;
	private String dtlProductValue2;
	private String dtlZeroConstant1;
	private String dtlZeroConstant2;
	private String dtlZeroConstant3;
	private String dtlLotNumber;
	private String dtlActualF1;
	private String dtlDiamondWt;
	private String dtlOtherStoneWt;
	private String dtlOrderNo;
	private String dtlIgstPerc;
	private String dtlIgstVal;
	private String dtlSgstPerc;
	private String dtlSgstVal;
	private String dtlCgstPerc;
	private String dtlCgstVal;
	private String dtlUtgstPerc;
	private String dtlUtgstVal;
	private String dtlGoNetWt;
	private String dtlPtNetWt;
	private String dtlStnNetWt;
	private String dtlSiNetWt;
	private String dtlOtherNetWt;
	private String dtlBinCode;
	private String dtlBinGroupCode;
	private String dtlTaxDetails;
	private String dtlIssuedWeightDetails;
	private String dtlItemDetails;
	private String dtlProductCategory;
	private String dtlCreatedBy;
	private Date dtlCreatedDate;
	private boolean dtlIsHallMarking;

	private Integer ldtlLineCount;
	private Integer ldtlLineDtlCount;
	private String ldtlItemNo;
	private BigDecimal ldtlStnWeight;
	private Integer ldtlStnQty;
	private String ldtlCreatedBy;
	private Date ldtlCreatedDate;

	private Integer mdtlLineCount;
	private Integer mdtlLineDtlCount;
	private String mdtlItemNo;
	private BigDecimal mdtlStnWeight;
	private Integer mdtlStnQty;
	private String mdtlCreatedBy;
	private Date mdtlCreatedDate;

	private String itemCode;
	private String lotNumber;
	private String insertUpdate;

	private Integer ctrlTotalLines;
	private Integer ctrlTotalQuantity;
	private BigDecimal ctrlTotalWeight;
	private BigDecimal ctrlTotalValue;

	private String fileId;
	private boolean stnIbt;

}
