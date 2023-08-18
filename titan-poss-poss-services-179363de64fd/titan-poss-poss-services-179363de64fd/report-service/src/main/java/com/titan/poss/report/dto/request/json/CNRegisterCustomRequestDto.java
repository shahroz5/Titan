/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.dto.request.json;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CNRegisterCustomRequestDto {

    private BigDecimal amountFrom;

    private BigDecimal amountTo;

    private List<String> cnType;

    private List<String> cnStatus;
}
