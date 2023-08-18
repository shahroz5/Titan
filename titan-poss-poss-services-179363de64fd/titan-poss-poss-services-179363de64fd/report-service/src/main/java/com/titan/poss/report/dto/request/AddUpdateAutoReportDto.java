/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.validation.Valid;
import java.util.Set;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class AddUpdateAutoReportDto {

    private Set<@Valid AddAutoReportDto> addScheduler;

    private Set<@Valid UpdateAutoReportDto> updateScheduler;

    private Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> removeScheduler;
}
