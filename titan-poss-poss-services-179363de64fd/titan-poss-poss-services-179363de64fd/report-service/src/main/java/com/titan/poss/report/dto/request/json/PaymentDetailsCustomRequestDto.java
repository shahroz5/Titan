package com.titan.poss.report.dto.request.json;

/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentDetailsCustomRequestDto extends BaseFieldsValidator {

    private List<@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String> paymentType;
}
