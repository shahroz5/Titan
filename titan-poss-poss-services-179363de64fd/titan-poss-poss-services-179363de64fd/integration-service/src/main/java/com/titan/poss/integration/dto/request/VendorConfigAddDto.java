/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Vendor Config Add Dto")
@Data
public class VendorConfigAddDto {

	@ApiModelProperty(position = 1, value = "Location code", name = "locationCode", example = "PNA")
	@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, message = "Invalid vendor code", nullCheck = true)
	private String locationCode;

	@ApiModelProperty(position = 2, value = "orgCode", name = "orgCode", example = "TJEW")
	@PatternCheck(regexp = RegExConstants.ORG_CODE_REGEX, message = "Invalid vendor code", nullCheck = true)
	private String orgCode;

	@ApiModelProperty(position = 3, value = "configDetails", notes = "Config Details required for contacting the third party API's. This is usually given by the third parties and inserted to our system through file upload or API.", name = "configDetails", example = "{\"TerminalId\": \"TQ:Tanishq-SCLP-POS-01\"}")
	private JsonData configDetails;

	@ApiModelProperty(position = 4, value = "isActive", name = "isActive", example = "true")
	private Boolean isActive;
}
