/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.math.BigDecimal;

import com.titan.poss.config.dto.constants.CategoryEnum;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.FocEligibilityEnum;
import com.titan.poss.config.dto.constants.ItemTypeEnum;
import com.titan.poss.config.dto.constants.OfferTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocSchemeDetailsListDto {

	@PatternCheck(regexp = RegExConstants.UUID_REGEX)
	private String id;

	@ValueOfEnum(message = ConfigConstants.INVALID_CATEGORY, enumClass = CategoryEnum.class)
	private String category;

	@ValueOfEnum(message = ConfigConstants.INVALID_ITEM_TYPE, enumClass = ItemTypeEnum.class)
	private String itemType;

	@ValueOfEnum(message = ConfigConstants.INVALID_OFFER_TYPE, enumClass = OfferTypeEnum.class)
	private String offerType;

	@ValueOfEnum(message = ConfigConstants.INVALID_ELIGIBILITY, enumClass = FocEligibilityEnum.class)
	private String focEligibility;

	private String itemCode;

	private Boolean isMultiple;

	private BigDecimal stdSaleValue;

	private BigDecimal fromSaleValue;

	private BigDecimal toSaleValue;

	private BigDecimal weight;

	private short quantity;

	private Integer rowId;

	private BigDecimal karat;

	private Boolean isSingle;

	private Boolean isActive;

	private Integer productGroupCount;

}
