/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.dto.request.json;

import java.util.List;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.constant.RegExConstants;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountTransactionReportCustomRequestDto extends BaseFieldsValidator {
    private String fiscalYear;
    private String customerMobileNo;
    private String ulpNo;
    private String customerName;

    private List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> cfa;
    private String fromWt;
    private String toWt;
    private String fromValue;
    private String toValue;
    private List<String> rsoName;

}

