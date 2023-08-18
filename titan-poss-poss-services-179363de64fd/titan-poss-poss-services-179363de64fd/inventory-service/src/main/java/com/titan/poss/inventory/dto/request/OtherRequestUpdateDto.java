/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.inventory.dto.constants.OtherRequestStatusEnum;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for update of Other Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class OtherRequestUpdateDto extends IssueConfirmDto {

	// in case of loss this will remain null
	private JsonData carrierDetails;

	@NotNull(message = "Please provide status")
	@ValueOfEnum(enumClass = OtherRequestStatusEnum.class)
	private String status;

	@NotNull
	private JsonData approvalDetails;

}
