/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.discount.dto;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DiscountDto {

	@PatternCheck(regexp = RegExConstants.DISCOUNT_CODE_REGEX)
	private String discountCode;

	@Size(max = 50)
	private String occasion;

	@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX, nullCheck = true)
	private String subBrandCode;

	@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX, nullCheck = true)
	private String brandCode;

	@Size(max = 250)
	private String description;

	private String discountType;

	@PatternCheck(regexp = RegExConstants.NAME_REGEX, nullCheck = false)
	private String approvedBy;

	private Boolean isPreviewApplicable;

	private Boolean isAbOfferApplicable;

	private Boolean isCoOfferApplicable;

	private Boolean isAccrualUlp;

	private Boolean isRiva;

	private Date ulpCreateDate;

	private List<String> applicableLevels;

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX)
	private String remarks;

	private Boolean isActive;

	private JsonData cumulativeDetails;

	private JsonData grnDetails;

	private JsonData orderDetails;

	private JsonData tepDetails;

	private JsonData basicCriteria;

	private JsonData clubOtherOffersConfig;

	private JsonData clubDiscountType;

	private JsonData abCoData;

	private JsonData configDetails;

	private JsonData itemGroupConfig;

	private JsonData rivaahItemGroupConfig;

	private JsonData applicableThemes;

	private String clubbingDiscountType;

	private String id;

	private Boolean isPublishPending;

	private Date publishTime;

	private Boolean isCreatedByWorkflow;
	
	private Boolean isAccrualUlpPoints;
	
	private JsonData workflowFileUploadDetails;
}
