/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.discount.dto.CummulativeDiscountWithExcludeDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsReqDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AbCoDiscountRequestDto {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@NotNull
	private Date businessDate;

	private String clubDiscountId;

	private List<DiscountDetailsConfigRequestDto> discountDetilsConfigRequestDto;

	private DiscountItemDetailsReqDto itemDetails;

	private RivaahGhsDiscountDto eligibleRivaahGhsDetails;

	private Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails;// discount id is key
																									// and respective
																									// cumm. details is
																									// the value

}
