/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.constant.RefundRequestStatusEnum;
import com.titan.poss.core.domain.constant.RefundSubTxnTypeEnum;
import com.titan.poss.core.domain.constant.RefundTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.DateEnum;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RefundListRequestDto {

	@NotNull(message = "dateRangeType cannot be null")
	@ValueOfEnum(enumClass = DateEnum.class)
	private String dateRangeType;

	@Positive(message = "docNo should be greater than 0")
	private Integer docNo;

	private Short fiscalYear;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date endDate;

	@NotNull(message = "refundType cannot be null")
	@ValueOfEnum(enumClass = RefundTypeEnum.class)
	private String refundType;

	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX)
	private String locationCode;

	@ValueOfEnum(enumClass = RefundRequestStatusEnum.class)
	private String status;

	@ValueOfEnum(enumClass = RefundSubTxnTypeEnum.class)
	private String subTxnType;

}
