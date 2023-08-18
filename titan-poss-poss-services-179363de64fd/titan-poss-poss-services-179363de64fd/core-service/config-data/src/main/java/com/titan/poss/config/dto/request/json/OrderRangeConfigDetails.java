/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request.json;

import java.math.BigDecimal;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.Positive;

import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class OrderRangeConfigDetails extends BaseFieldsValidator {

	@Positive
	@DecimalMax(value = "100", inclusive = true, message = "max value of purity is 100")
	private BigDecimal configPercent;

	@Positive
	@DecimalMax(value = "100", inclusive = true, message = "max value of purity is 100")
	private BigDecimal configValue;

/*	@Override
	public void validate(Object object) {
		super.validate(object);

		JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(object, JsonData.class);

		OrderRangeConfigDetails rangeDetails = MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(),
				OrderRangeConfigDetails.class);

		if (jsonData.getType().equalsIgnoreCase(RuleTypeEnum.ORDER_AB_RESIDUAL_TOLERANCE_CONFIG.toString())
				&& rangeDetails.getConfigPercent() != null && rangeDetails.getConfigValue() != null) {
			throw new ServiceException(ConfigConstants.PERCENT_OR_VALUE_SHOULD_BE_PRESENT,
					ConfigConstants.ERR_CONFIG_098,jsonData.getType());
		}

	}
*/

}
