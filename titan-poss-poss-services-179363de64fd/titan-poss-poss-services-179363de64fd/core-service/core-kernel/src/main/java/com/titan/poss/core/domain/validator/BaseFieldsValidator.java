/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.validator;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
public abstract class BaseFieldsValidator {

	private static final String JSON_DATA_FORMAT_ERROR = "JSON data format error";

	private static final String ERR_CORE_013 = "ERR-CORE-013";

	public void validate(Object object) {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Map<String, String> messages = new HashMap<>();
		BaseFieldsValidator fieldData = MapperUtil.getObjectMapperInstance().convertValue(object, this.getClass());
		Set<ConstraintViolation<BaseFieldsValidator>> violations = validator.validate(fieldData);
		violations.forEach(violation -> messages.put(violation.getPropertyPath().toString(), violation.getMessage()));
		if (!violations.isEmpty()) {
			throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013, messages);
		}
	}

}
