/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.sales.dto.MetalRateListDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for other details of GHS payment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GhsPaymentOtherDetailsDto {

	private BigDecimal refundAmount;
	private Integer customerId;
	MetalRateListDto metalRateDetails;
	private Boolean isSameCustomerAccount;
	private String accountId;
	private BigDecimal bonus;
	private List<String> discountTxnIdList;// required for discount details update(only valid at the addition of
											// payment, after that no use of the list)
	private String creditNoteId;// related CN id
	private List<String> productGroupCodesRestricted;
	private BigDecimal installmentAmount; // needed for DV check
	private String discountId;// discount id configured in EPOSS
	private String discountCode;// discount code configured in EPOSS
	private String discountType;
	private Integer newCNNumber;
	private Integer creditNoteNo;
	private Boolean isFinalUpdateCompleted;// update GHS account on CM confirm
	private String schemeCode;
	private Integer discountMcPct;
	private Integer discountUcpPct;
	private BigDecimal minUtilizationPct;
	private BigDecimal balance;
	private Boolean isRivaahDiscountApplicable; // for UI to enable (Calculate rivaah GHS discount) button on ADDITION
												// of payment only(one time use)
	private String allowedCategory;
	private BigDecimal remainingAmount; // remaining amount on partial redemption
}
