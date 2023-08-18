/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.request;

import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.constant.RefundSubTxnTypeEnum;
import com.titan.poss.core.domain.constant.RefundTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class RefundRequestCreateDto {

	@NotNull(message = "requestData cannot be null")
	private Object requestData;

	@NotNull(message = "headerData cannot be null")
	private Object headerData;

	@NotNull(message = "refundType cannot be null")
	@ValueOfEnum(enumClass = RefundTypeEnum.class)
	private String refundType;

	@PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true)
	private String refTxnId;

	@NotNull(message = "requestorName cannot be null")
	private String requestorName;

	@NotNull(message = "docNo cannot be null")
	@Positive(message = "docNo should be greater than 0")
	private Integer docNo;

	@NotNull(message = "fiscalYear cannot be null")
	private Short fiscalYear;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@NotNull(message = "docDate cannot be null")
	private Date docDate;

	@NotNull(message = "subTxnType cannot be null")
	@ValueOfEnum(enumClass = RefundSubTxnTypeEnum.class)
	private String subTxnType;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String remarks;
	
	@NotNull(message = "employeeCode cannot be null")
	private String employeeCode;

}
