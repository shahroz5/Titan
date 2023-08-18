package com.titan.poss.sales.dto;

import javax.validation.Valid;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseDtoFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class LegacyOtherChargesDetailsDto extends BaseDtoFieldsValidator{
	
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_100, message = "Please provide other charge type", nullCheck = true)
	private String type;

	@Valid
	private LegacyOtherChargesDto data;

}
