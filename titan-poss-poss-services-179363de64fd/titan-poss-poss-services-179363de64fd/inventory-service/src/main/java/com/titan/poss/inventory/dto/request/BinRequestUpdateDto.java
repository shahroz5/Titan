package com.titan.poss.inventory.dto.request;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.inventory.dto.constants.ApprovalRequestStatusEnum;

import lombok.Data;

@Data
public class BinRequestUpdateDto {

	@PatternCheck(regexp = RegExConstants.REMARKS_REGEX)
	private String remarks;

	@NotNull(message = "Update status can't be null")
	@ValueOfEnum(enumClass = ApprovalRequestStatusEnum.class)
	private String status;

}
