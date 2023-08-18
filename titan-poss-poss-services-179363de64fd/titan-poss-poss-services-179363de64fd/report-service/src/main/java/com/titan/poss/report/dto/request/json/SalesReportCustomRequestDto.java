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
public class SalesReportCustomRequestDto extends BaseFieldsValidator {
	private String fiscalYear;
	private String docNo;
	private List<String> rsoName;
	private String customerMobileNo;
	private String ulpNo;
	private String customerName;

	private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> cfa;
	private String fromWt;
	private String toWt;
	private String fromValue;
	private String toValue;
	private List<String> karatage;
	private List<@PatternCheck(regexp = RegExConstants.COMPLEXITY_CODE_REGEX) String> complexity;
	private List<@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String> binGroup;

}
