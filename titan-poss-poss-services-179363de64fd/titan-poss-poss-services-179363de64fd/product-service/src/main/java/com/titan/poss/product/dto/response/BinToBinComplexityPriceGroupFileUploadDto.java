/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class BinToBinComplexityPriceGroupFileUploadDto {
	
	@NotNull(message = "priceGroup can not be null")
	@PatternCheck(regexp = RegExConstants.PRICE_GROUP_REGEX)
	private String priceGroup;

	@NotNull(message = "complexityCode can not be null")
	@PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX)
	private String complexityCode;

	@PositiveOrZero
	private BigDecimal makingChargePunit;

	@PositiveOrZero
	private BigDecimal makingChargePgram;

	@PositiveOrZero
	private BigDecimal wastagePct;

	@PositiveOrZero
	private BigDecimal makingChargePct;
	

	private Boolean isActive;

	private String loginID;
	
	private String lastModifiedID;
	
	private Date createDate;
	
	private Date lastmodifiedDate;
	
}
