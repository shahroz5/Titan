/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.dto.request;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.Size;

import com.titan.poss.config.dto.constants.ClubbingDiscountType;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DiscountUpdateDto {

	@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX)
	private String subBrandCode;

	@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX)
	private String brandCode;

	//@PatternCheck(regexp = RegExConstants.NAME_REGEX, message = RegExConstants.REGEX_MSG,nullCheck = false)
	private String approvedBy;

	private Boolean isPreviewApplicable;

	private Boolean isAbOfferApplicable;

	private Boolean isCoOfferApplicable;

	private Date ulpCreateDate;

	private Boolean isRiva;

	private Boolean isAccrualUlpPoints;

	private List<String> applicableLevels;

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

	@ValueOfEnum(message = ConfigConstants.INVALID_CLUBBING_DISCOUNT_TYPE, enumClass = ClubbingDiscountType.class)
	private String clubbingDiscountType;

	@Size(max = 250)
	private String description;

	@Size(max = 50)
	private String occasion;
	
	private JsonData workflowFileUploadDetails;
}
