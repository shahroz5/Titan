/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.dto.request.json;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.report.dto.constants.ReportTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class StockInventoryCustomRequestDto extends BaseFieldsValidator {

    private List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX)String> productCategoryCode;

    private List< @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroupCode;

    private List<@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String> binGroupCode;

    private List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode;

    @ValueOfEnum(enumClass = ReportTypeEnum.class)
    private String reportType;

}
