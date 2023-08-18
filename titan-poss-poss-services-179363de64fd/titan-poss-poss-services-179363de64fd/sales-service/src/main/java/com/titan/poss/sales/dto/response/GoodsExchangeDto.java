/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoodsExchangeDto {

	private String txnId;
	private String txnType;
	private Integer docNo;
	private Date docDate;
	private Short fiscalYear;
	private String customerName;
	private BigDecimal netAmount;
	private String createdBy;
	private Date createdDate;
	private String status;
	private Integer cnDocNo;
	private String remarks;
	private String srcLocationCode;
	private String goodsType;
	private String rsoName;
	
	public GoodsExchangeDto(String txnId,Integer docNo,Date docDate,Short fiscalYear,String createdBy,Date createdDate,String status,String remarks,String srcLocationCode, String goodsType,String rsoName,BigDecimal netAmount) {
		this.txnId=txnId;
		this.docNo=docNo;
		this.docDate=docDate;
		this.fiscalYear=fiscalYear;
		this.createdBy=createdBy;
		this.createdDate=createdDate;
		this.status=status;
		this.remarks=remarks;
		this.srcLocationCode=srcLocationCode;
		this.goodsType=goodsType;
		this.rsoName=rsoName;
		this.txnType="TEP";
		this.netAmount = netAmount;
		
	}

}
