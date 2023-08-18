/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TaxDetailsListDto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public abstract class BaseGepResponseDto {

	private String id;

	private String status;

	private Integer docNo;

	private Short fiscalYear;

	private Date docDate;

	private Integer customerId;

	private MetalRateListDto metalRateList;

	private Date firstHoldTime;

	private Date lastHoldTime;

	private TaxDetailsListDto taxDetails;

	private BigDecimal totalWeight;

	private BigDecimal totalValue;

	private Short totalQuantity;

	private BigDecimal totalTax;

	private BigDecimal roundingVariance;

	private Date confirmedTime;

	private ManualBillTxnDetailsDto manualBillDetails;

	private String currencyCode;

	private String weightUnit;

	private String manualBillId;

	private Integer cnDocNo;

	private JsonData refundDetails;
	
	private String createdBy;
	
	private String approvedBy;
	
	private Date createdDate;
	
	private BigDecimal finalValue;

	private BigDecimal refundDeductionAmount;
	
	private BigDecimal refundDeductionPercent;
	
	private BigDecimal netRefundAmount;
	
	private BigDecimal cumulativeRefundAmt;
	
	private String custTaxNo;
	
	private String custTaxNoOld;
	
    private String mobileNumber;
    private String emailId;
    private String customerName;
    private String instiTaxNo;
    private String passportId;
	
	
	

}
