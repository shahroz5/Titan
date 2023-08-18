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
import com.titan.poss.inventory.constant.DateTypeEnum;
import com.titan.poss.inventory.dto.constants.ActionTypeEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class HistoryIssueRequestDto {

	@ValueOfEnum(enumClass = ActionTypeEnum.class)
	@NotNull(message = "Please provide actionType")
	private String actionType;

	@ValueOfEnum(enumClass = DateEnum.class)
	private String dateRangeType;

	private List<String> statuses;

	//@NotNull(message = "dateType field cannot be null")
	private DateTypeEnum dateType;
	
	private Integer reqDocNo;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date endDate;

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX)
	private String locationCode;

	private Short reqFiscalYear;

}
