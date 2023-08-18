/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.DateEnum;
import com.titan.poss.inventory.dto.constants.ActionTypeEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class HistoryInvoiceRequestDto {

	@NotNull(message = "Please provide actionType")
	@ValueOfEnum(enumClass = ActionTypeEnum.class)
	private String actionType;

	@NotNull(message = "date range type cannot be null")
	@ValueOfEnum(enumClass = DateEnum.class)
	private String dateRangeType;

	private Integer srcDocNo;
	private Integer destDocNo;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date endDate;

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, caseInsensitive = true)
	private String locationCode;

	private Short destFiscalYear;

	private Short srcFiscalYear;

	private List<String> statuses;

}
