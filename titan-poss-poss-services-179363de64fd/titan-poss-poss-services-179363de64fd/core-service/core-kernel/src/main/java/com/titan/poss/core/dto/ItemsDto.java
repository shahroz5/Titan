/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.math.BigInteger;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemsDto {

	@JsonProperty("serial_no")
	private BigInteger serialNo;

	@JsonProperty("product_code")
	private String productCode;

	@JsonProperty("product_group")
	private String productGroup;

	@JsonProperty("lot_number")
	private String lotNumber;

	@JsonProperty("product_qty")
	private Integer productQty;

	@JsonProperty("product_wt")
	private BigDecimal productWt;

	@JsonProperty("product_value")
	private BigDecimal productValue;

	@JsonProperty("total_value")
	private BigDecimal totalValue;

	@JsonProperty("actual_f1")
	private Integer actualF1;

	@JsonProperty("oth_stn_wt")
	private BigDecimal othStnWt;

	@JsonProperty("diamond_wt")
	private BigDecimal diamondWt;

	@JsonProperty("cust_po_no")
	private String custPoNo;

	@JsonProperty("order_ref")
	private String orderRef;

	@JsonProperty("lot_date")
	private String lotDate;

	@JsonProperty("pt_net_wt")
	private BigDecimal ptNetWt;

	@JsonProperty("igst_val")
	private BigDecimal igstVal;
	
	@JsonProperty("igst_perc")
	private BigDecimal igstPerc;
	
	@JsonProperty("sgst_val")
	private BigDecimal sgstVal;
	
	@JsonProperty("sgst_perc")
	private BigDecimal sgstPerc;
	
	@JsonProperty("cgst_val")
	private BigDecimal cgstVal;
	
	@JsonProperty("cgst_perc")
	private BigDecimal cgstPerc;
	
	@JsonProperty("utgst_val")
	private BigDecimal utgstVal;
	
	@JsonProperty("utgst_perc")
	private BigDecimal utgstPerc;
	
	@JsonProperty("go_net_wt")
	private BigDecimal goNetWt;
	
	@JsonProperty("si_net_wt")
	private BigDecimal siNetWet;
	
	@JsonProperty("other_net_wt")
	private BigDecimal otherNetWt;
	
	@JsonProperty("IsHallMarking")
	private String isHallMarking;
	
	@JsonProperty("HallMarkingCentreName")
	private String hallMarkingCentreName;
	
	@JsonProperty("HallMarkingCode")
	private String hallMarkingCode;
	
	@JsonProperty("HallmarkedDate")
	private String hallMarkedDate;
	
	@JsonProperty("HallMarkremarks")
	private String hallMarkRemarks;
	
	@JsonProperty("HallMarkremarks1")
	private String hallMarkRemarks1;

	private String productCategory;

	private String binCode;
	
	private String itemTypeCode;
	
	private BigDecimal karat;

	private String binGroupCode;
	@JsonProperty("productType")
	private String productType;
	
	private String hsnSacCode;
}
