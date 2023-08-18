/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.dto.request.json;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class StockIssueCustomRequestDto extends BaseFieldsValidator {

	private List<String> header;
	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> cfa;
	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCode;
	private List<@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String> binGroup;

}
