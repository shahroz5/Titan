/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import java.math.BigDecimal;

import com.titan.poss.config.dto.constants.CategoryEnum;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.FocEligibilityEnum;
import com.titan.poss.config.dto.constants.ItemTypeEnum;
import com.titan.poss.config.dto.constants.OfferTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class FocSchemeDetailResponseDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String id;

	@ValueOfEnum(message = ConfigConstants.INVALID_CATEGORY, enumClass = CategoryEnum.class)
	private String category;

	@ValueOfEnum(message = ConfigConstants.INVALID_ITEM_TYPE, enumClass = ItemTypeEnum.class)
	private String itemType;

	private String itemCode;

	@ValueOfEnum(message = ConfigConstants.INVALID_OFFER_TYPE, enumClass = OfferTypeEnum.class)
	private String offerType;

	@ValueOfEnum(message = ConfigConstants.INVALID_ELIGIBILITY, enumClass = FocEligibilityEnum.class)
	private String focEligibility;

	private BigDecimal stdSaleValue;

	private BigDecimal fromSaleValue;

	private BigDecimal toSaleValue;

	private BigDecimal weight;

	private Integer quantity;

	private Integer rowId;

	private BigDecimal karat;

	private Boolean isSingle;

	private Boolean isActive;

	private Boolean isMultiple;
}
