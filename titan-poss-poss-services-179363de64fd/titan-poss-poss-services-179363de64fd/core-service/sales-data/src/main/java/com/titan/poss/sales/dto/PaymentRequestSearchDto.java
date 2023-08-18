package com.titan.poss.sales.dto;

/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */



import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.DateEnum;

import lombok.Data;

/**
 * DTO for searching payment requests.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class PaymentRequestSearchDto {

	private Integer customerId;
	private String referenceId;
	private List<String> status;
	private Boolean isWorkFlowApproval;
	private Short fiscalYear;

	@ValueOfEnum(enumClass = DateEnum.class)
	private String dateRangeType;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date endDate;
}
