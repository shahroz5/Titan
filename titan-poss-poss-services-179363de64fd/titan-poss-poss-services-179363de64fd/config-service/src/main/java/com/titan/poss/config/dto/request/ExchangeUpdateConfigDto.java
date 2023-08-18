/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request;

import java.util.Date;
import java.util.Set;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.TodayOrFutureDay;
import com.titan.poss.core.response.JsonData;
import java.math.BigDecimal;
import lombok.Data;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class ExchangeUpdateConfigDto {
	
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50)
	private String description;
	
	private Boolean isActive;

	private JsonData offerDetails;

	private JsonData configDetails;

	private Boolean isOfferEnabled;

	@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX)
	private String itemCode;

//	@TodayOrFutureDay
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;

	@TodayOrFutureDay
	private Date endDate;

	private Set<@PatternCheck(regexp = RegExConstants.IND_MOBILE_REGEX) String> customerMobileNos;
	
	@Max(value = 22, message = "karat max value should be 22")
	@Min(value = 14, message = "karat max value should be 14")
	private BigDecimal karat;
	
}
