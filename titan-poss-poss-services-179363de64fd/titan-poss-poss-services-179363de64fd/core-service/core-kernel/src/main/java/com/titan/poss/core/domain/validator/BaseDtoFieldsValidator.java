/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;

/**
 * Class to validate DTOs fields.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public abstract class BaseDtoFieldsValidator {

	private static final String JSON_DATA_FORMAT_ERROR = "JSON data format error";
	private static final String ERR_CORE_013 = "ERR-CORE-013";

	public void validateFields(Object sourceDto) {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		List<String> str = new ArrayList<>();

		BaseDtoFieldsValidator baseDtoFieldsValidator = MapperUtil.getObjectMapperInstance().convertValue(sourceDto,
				this.getClass());
		Set<ConstraintViolation<BaseDtoFieldsValidator>> violationFields = validator.validate(baseDtoFieldsValidator);
		violationFields.forEach(violation -> str.add(violation.getMessage()));
		if (!violationFields.isEmpty())
			throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013, str);
	}
}
