/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.dto.response;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DiscountDto implements Serializable {

	private static final long serialVersionUID = 1L;

	@NotNull
	private String discountCode;

	@NotBlank
	private String description;

	@NotNull
	private transient Object discountDetails;

	private Date startDate;

	private Date endDate;

	@NotNull
	@NotBlank
	private String discountType;

	private Date previewStartDate;

	private Date previewEndDate;

	@NotNull
	@NotBlank
	private String approvedBy;

	private Boolean isActive;

}
