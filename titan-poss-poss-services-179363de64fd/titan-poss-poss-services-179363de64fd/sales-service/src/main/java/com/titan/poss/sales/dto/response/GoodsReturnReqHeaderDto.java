/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class GoodsReturnReqHeaderDto {

	private String refId;
	private Integer refDocNo;
	private String refTxnType;
	private String refSubTxnType;

	private String id;
	private Integer docNo;
	private String txnType;
	private String subTxnType;

	private Integer customerId;
	private String customerName;

	private String srcLocationCode;
	private String destLocationCode;

	private String cancelType;
	private String reasonForCancellation;
	private Short totalQuantity;
	private BigDecimal totalValue;
	private BigDecimal totalWeight;
	private List<ItemLotGrnDto> items;

	private String approverRoleCode;
	private String approvalCode;
	private String ccafNo;
	private Date approvalDate;
}
