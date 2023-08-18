/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Customer Loyalty Dto")
@Data
@EqualsAndHashCode(callSuper=false)
public class CustomerLoyaltyDto extends UlpBaseResponseDto{

	@ApiModelProperty(position = 1, value = "Loyalty Card Number", name = "ulpId", required = false, example = "700001964929")
	private String ulpId;

	@ApiModelProperty(position = 2, value = "Loyalty card point balance", name = "pointBalance", required = false, example = "1000")
	private BigDecimal pointBalance;

	@ApiModelProperty(position = 3, value = "currentTier", name = "currentTier", required = false, example = "Encircle Silver")
	private String currentTier;

	@ApiModelProperty(position = 4, value = "enrollmentDate", name = "enrollmentDate", required = false, example = "02-Jan-2020")
	private Date enrollmentDate;

	@ApiModelProperty(position = 5, value = "isMemberBlocked", name = "isMemberBlocked", required = false, example = "false")
	private Boolean isMemberBlocked;

	@ApiModelProperty(position = 5, value = "birthdayDiscount", name = "birthdayDiscount", required = false, example = "Y")
	private String birthdayDiscount;

	@ApiModelProperty(position = 5, value = "birthdayValdityPeriod", name = "birthdayValdityPeriod", required = false, example = "03-May-2020~12-Jun-2020")
	private String birthdayValdityPeriod;

	@ApiModelProperty(position = 5, value = "anniversaryDiscount", name = "anniversaryDiscount", required = false, example = "Y")
	private String anniversaryDiscount;

	@ApiModelProperty(position = 5, value = "anniversaryValidityPeriod", name = "anniversaryValidityPeriod", required = false, example = "03-May-2020~12-Jun-2020")
	private String anniversaryValidityPeriod;

	@ApiModelProperty(position = 5, value = "spouseBirthdayDiscount", name = "spouseBirthdayDiscount", required = false, example = "Y")
	private String spouseBirthdayDiscount;

	@ApiModelProperty(position = 5, value = "spouseBirthdayValidityPeriod", name = "spouseBirthdayValidityPeriod", required = false, example = "03-May-2020~12-Jun-2020")
	private String spouseBirthdayValidityPeriod;

	@ApiModelProperty(position = 5, value = "child1BirthdayDiscount", name = "child1BirthdayDiscount", required = false, example = "Y")
	private String child1BirthdayDiscount;

	@ApiModelProperty(position = 5, value = "child1BirthdayValidityPeriod", name = "child1BirthdayValidityPeriod", required = false, example = "03-May-2020~12-Jun-2020")
	private String child1BirthdayValidityPeriod;

	@ApiModelProperty(position = 5, value = "child2BirthdayDiscount", name = "child2BirthdayDiscount", required = false, example = "Y")
	private String child2BirthdayDiscount;

	@ApiModelProperty(position = 5, value = "child2BirthdayValidityPeriod", name = "child2BirthdayValidityPeriod", required = false, example = "03-May-2020~12-Jun-2020")
	private String child2BirthdayValidityPeriod;

}
