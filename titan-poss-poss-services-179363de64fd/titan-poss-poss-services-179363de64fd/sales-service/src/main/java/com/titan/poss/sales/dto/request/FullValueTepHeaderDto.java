/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.response.FileDetailsDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FullValueTepHeaderDto {

	private String fvtLocationCode;
	private String fvtLocationType;
	private String cmLocationCode;
	private Integer cmDocNo;
	private Date cmDocDate;
	private Integer noOfDaysFromCm;
	private String customerName;
	private String customerMobileNo;
	private String reasonForFullValueTep;
	private String itemCode;
	private String lotNumber;
	private Short totalNoOfStones;
	private Short measuredNoOfStones;
	private BigDecimal measuredWeight;
	private BigDecimal billedWeight;
	private Short totalQuantity;
	private String salesTxnId;
	private BigDecimal stoneValue;
	private BigDecimal metalValue;
	private String paymentMode;
	private String cashMemoDetailsId;
	//add a field for invoice value
	private Object priceDetails;
	private Object approvalDetails;
	private ManualBillTxnDetailsDto manualDetails;
	private String employeeCode;
}
