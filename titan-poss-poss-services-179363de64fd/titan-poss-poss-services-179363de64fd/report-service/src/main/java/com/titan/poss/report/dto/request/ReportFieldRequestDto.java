/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dto.request;


import javax.validation.constraints.PositiveOrZero;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ReportFieldRequestDto {

	@PatternCheck(regexp = RegExConstants.FIELD_NAME_REGEX, nullCheck = true)
	private String fieldName;

	private String fontName;

	@PositiveOrZero(message = "height should be 0 or more than 0")
	private Integer height;

	@PositiveOrZero(message = "width should be 0 or more than 0")
	private Integer width;

	@PositiveOrZero(message = "font size should be 0 or more than 0")
	private Integer fontSize;

	private String hrAlign;

	private String vrAlign;

	@PatternCheck(regexp = RegExConstants.FIELD_TYPE_REGEX, nullCheck = true)
	private String fieldType;

	private Boolean isOptional;
	
	private String headerFieldName;
	
	private Boolean isEncrypted;

}
