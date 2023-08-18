/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import javax.validation.constraints.Size;

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
@ApiModel(description = "Vendor Dto")
@Data
public class VendorDto {

	@ApiModelProperty(position = 1, value = "Vendor Code", name = "vendorCode", example = "QC")
	@Size(min = 1, max = 20, message = "vendor code min length {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20, message = "Invalid vendor code", nullCheck = true)
	private String vendorCode;

	@ApiModelProperty(position = 2, value = "Vendor Type", name = "vendorType", example = "GIFT_CARD")
	@Size(min = 1, max = 20, message = "vendor type min length {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20, message = "Invalid vendor type", nullCheck = true)
	private String vendorType;

	@ApiModelProperty(position = 3, value = "Vendor Name", name = "vendorName", example = "Qwikcilver")
	@Size(min = 1, max = 20, message = "vendor name min length {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20, message = "Invalid vendor name", nullCheck = true)
	private String vendorName;

	@ApiModelProperty(position = 4, value = "Web service type", name = "webServiceType", example = "Rest")
	private String webServiceType;

	@ApiModelProperty(position = 5, value = "port", name = "port", example = "80")
	private String port;

	@ApiModelProperty(position = 6, value = "baseurl", name = "baseurl", example = "baseurl")
	private String baseurl;

	@ApiModelProperty(position = 7, value = "retry count", name = "retryCount", example = "3")
	private Integer retryCount;

	@ApiModelProperty(position = 8, value = "time out seconds", name = "timeOutSeconds", example = "3")
	private Integer timeOutSeconds;

	@ApiModelProperty(position = 9, value = "vendorDetails", name = "vendorDetails")
	private JsonData vendorDetails;

	@ApiModelProperty(position = 10, value = "isActive", name = "isActive", example = "true")
	private Boolean isActive;
}
