/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Airpay Send Request Dto")
@Data
@Builder(toBuilder = true)
public class AirpaySendRequestDto {

	@JsonProperty("EMAIL")
	@ApiModelProperty(position = 1, value = "EMAIL", name = "email", example = "true")
	private Boolean email;
	
	@JsonProperty("SMS")
	@ApiModelProperty(position = 1, value = "SMS", name = "sms", example = "true")
	private Boolean sms;
}
