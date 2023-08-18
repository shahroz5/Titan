/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.dto.request.json;

import com.titan.poss.report.dto.request.ReportRequestDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class StockInventoryRequestDto extends ReportRequestDto {

	private StockInventoryCustomRequestDto stockInventoryCustomRequestDto;


}
