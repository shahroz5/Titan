/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class RequestWorkflowCNDto extends RemarksBaseDto {

	// where cn will be approved
	// will not be null in case of cn transfer
	private String approverLocationCode;
	
	private Map<@NotBlank(message = "File Type can not be blank") String, @NotNull @Size(min = 1, message = "Minimum no of tempId for a file type is {min}") List<@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String>> tempFileIds;

}
