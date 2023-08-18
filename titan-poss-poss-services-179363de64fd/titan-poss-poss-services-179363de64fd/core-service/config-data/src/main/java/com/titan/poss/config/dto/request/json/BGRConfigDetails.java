/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.request.json;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.config.dto.constants.BGRApplicableDateEnum;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class BGRConfigDetails extends BaseFieldsValidator {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@NotNull
	private Date bgrOfferFromDate;

	@NotNull
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date bgrOfferToDate;

	@NotNull
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date redemptionPeriodFromDate;

	@NotNull
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date redemptionPeriodToDate;

	@NotNull
	private BigDecimal downSideAmount;

	@NotNull
	private BGRApplicableDateEnum applicableRateDate;

	private BGROtherDetailsData otherDetails;

}
