/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.dto.request;

import java.util.Date;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.workflow.dto.constants.DateEnum;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ProcessListFilterRequestDto {
	
	private Map<String, String> filterParams;
	
	@ValueOfEnum(enumClass = DateEnum.class)
	private String dateRangeType;
	
	private Integer docNo;
	
	private Short fiscalYear;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date endDate;

}
