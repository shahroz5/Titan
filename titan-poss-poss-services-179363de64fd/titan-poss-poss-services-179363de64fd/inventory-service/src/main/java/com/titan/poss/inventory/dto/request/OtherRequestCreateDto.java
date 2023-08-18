/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import org.hibernate.validator.constraints.Length;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * DTO class for request structure of other transaction Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class OtherRequestCreateDto {

	@NotEmpty(message = "requested items can't be empty")
	private List<@Valid RequestOtherItemDto> items;

	@Length(max = 255)
	private String remarks;

	JsonData approvalDetails;

}
