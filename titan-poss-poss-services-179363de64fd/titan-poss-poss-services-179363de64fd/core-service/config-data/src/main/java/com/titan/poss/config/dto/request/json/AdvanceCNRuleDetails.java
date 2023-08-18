/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import java.util.regex.Pattern;

import javax.validation.constraints.NotNull;

import org.apache.commons.lang.BooleanUtils;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class AdvanceCNRuleDetails extends CNRuleDetails {

	@NotNull
	private Boolean isMergingGRFCNAllowed; // validation should use in create cn

	private Boolean isOnlyCNCustomerAllowedForMergeGRF;

	@JsonProperty("gRFResidualValueAmount")
	private String grfResidualValueAmount; // validation should be used in create cn

	@NotNull
	private Boolean isPercent;

	@JsonProperty("gRFResidentialClosure")
	private String grfResidentialClosure; // validation should be grn create cn

	@Override
	public void validate(Object object) {
		super.validate(object);

		AdvanceCNRuleDetails advanceCNRuleDetails = MapperUtil.getObjectMapperInstance().convertValue(object,
				AdvanceCNRuleDetails.class);

		if (BooleanUtils.isTrue(advanceCNRuleDetails.getIsPercent())
				&& (advanceCNRuleDetails.getGrfResidualValueAmount() != null
						&& Double.parseDouble(advanceCNRuleDetails.getGrfResidualValueAmount()) > 100))
			throw new ServiceException("Percentage cannot be greater than 100", "ERR-SALE-177");

		Pattern pattern = Pattern.compile(RegExConstants.NUMERIC_REGEX);
		if (BooleanUtils.isNotTrue(advanceCNRuleDetails.getIsPercent())
				&& (advanceCNRuleDetails.getGrfResidualValueAmount() != null
						&& !pattern.matcher(advanceCNRuleDetails.getGrfResidualValueAmount()).matches())) {
			throw new ServiceException("GRF Residual value amount should be a whole number", "ERR-CONFIG-096",
					"GRF Residual value amount should be a whole number");
		}
		if (BooleanUtils.isTrue(advanceCNRuleDetails.getIsMergingGRFCNAllowed())
				&& advanceCNRuleDetails.getIsOnlyCNCustomerAllowedForMergeGRF() == null)
			throw new ServiceException("Need to disable isMergingGRFCNAllowed in CN Validation ", "ERR-CORE-050",
					"Need to disable isMergingGRFCNAllowed in CN Validation");

	}

}
