/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.validators;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.SalesConstants;

/**
 * Base Payment fields DTO validate function.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public abstract class BasePaymentFieldsDto {

	public void validateFields(Object sourceDto) {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		List<String> str = new ArrayList<>();

		BasePaymentFieldsDto basePaymentFieldsDto = MapperUtil.getObjectMapperInstance().convertValue(sourceDto,
				this.getClass());
		Set<ConstraintViolation<BasePaymentFieldsDto>> violationFields = validator.validate(basePaymentFieldsDto);
		violationFields
				.forEach(violation -> str.add(violation.getPropertyPath().toString() + " : " + violation.getMessage()));
		if (!violationFields.isEmpty())
			throw new ServiceException(SalesConstants.PLEASE_PROVIDE_VALID_DATA_DYNAMIC_REASON,
					SalesConstants.ERR_SALE_018, str, Map.of("reason", str.toString()));
	}

}
