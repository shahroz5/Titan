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

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class HistoryRequestBinDto {

	@PatternCheck(regexp = RegExConstants.BIN_REGEX)
	private String binName;

	@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX)
	private String binGroupCode;

	private Short reqFiscalYear;

	private List<String> statuses;

	private Integer reqDocNo;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date endDate;

	@NotNull(message = "date range type cannot be null")
	@ValueOfEnum(enumClass = DateEnum.class)
	private String dateRangeType;

}
