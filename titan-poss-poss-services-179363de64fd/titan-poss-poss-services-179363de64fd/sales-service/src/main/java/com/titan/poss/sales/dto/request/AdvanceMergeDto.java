/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AdvanceMergeDto {

	@NotNull
	@Size(min = 2)
	private List<@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String> ids;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250)
	private String remarks;

	@NotNull
	@Positive
	private Integer customerId;

	private Map<@NotBlank(message = "File Type can not be blank") String, @NotNull @Size(min = 1, message = "Minimum no of tempId for a file type is {min}") List<@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String>> tempFileIds;

	private String employeeCode;

}
