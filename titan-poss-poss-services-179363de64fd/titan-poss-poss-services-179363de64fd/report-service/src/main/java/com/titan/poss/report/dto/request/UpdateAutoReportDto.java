/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.report.dto.constants.SchedulerFrequencyEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.validation.constraints.NotNull;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class UpdateAutoReportDto {
    
    @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
    private String schedulerId;

    @ValueOfEnum(enumClass = SchedulerFrequencyEnum.class)
    private String frequency;

    @NotNull(message = "cron expression cannot be null")
    private String cronExpression;

}
