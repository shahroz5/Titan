/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.titan.poss.sales.dto.request.FrozenRatesDetails;
import com.titan.poss.sales.dto.validators.BasePaymentFieldsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO for credit note other details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class CreditNotePaymentOtherDetailsDto extends BasePaymentFieldsDto {

	private Integer cnPriority;
	private Integer cnOwnerId;
	private BigDecimal cnAmount;// for priority checks
	private BigDecimal refundAmount;
	private Integer newCNNumber;
	private Boolean isLinkedCn;
	private BigDecimal remainingAmount; // remaining amount on partial redemption
	private Integer creditNoteNo;
	private Boolean isRateProtectedCN; // used in GRF CN
	private String allowedCategory; // used in GRF CN
	private FrozenRatesDetails frozenRateDetails; // used in GRF CN
	private Boolean isGhsDiscountPresent;
	private String schemeType;// --for GHS
	private String schemeCode;// --for GHS
	private BigDecimal bonus;// --for GHS
	private Integer discountMcPct;// --for GHS
	private Integer discountUcpPct;// --for GHS
	private String discountId;// discount id configured in EPOSS --for GHS
	private String discountCode;// discount code configured in EPOSS --for GHS
	private String discountType;// --for GHS
	private Boolean isRivaahDiscountApplicable; // for UI to enable (Calculate rivaah GHS discount) button on ADDITION
												// of payment only(one time use)
	private Boolean isDiscountPresent;
	private Date originalDocDate;
	private List<String> productGroupCodesRestricted;
	private Boolean isRivaahGhsDiscountRefresh;
	private String newCnId;// id of child CN generated to sync to EPOSS

}
