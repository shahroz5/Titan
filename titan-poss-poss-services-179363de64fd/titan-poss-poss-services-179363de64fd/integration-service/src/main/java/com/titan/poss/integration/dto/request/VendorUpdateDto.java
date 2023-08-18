/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request;

import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Vendor Update Dto")
@Data
public class VendorUpdateDto {

	@ApiModelProperty(position = 1, value = "Vendor Type", name = "vendorType", example = "GIFT_CARD")
	@Size(min = 1, max = 20, message = "vendor type min length {min} and max length is {max}")
	private String vendorType;
	
	@ApiModelProperty(position = 2, value = "Vendor Name", name = "vendorName", example = "Qwikcilver")
	@Size(min = 1, max = 30, message = "vendor name min length {min} and max length is {max}")
	private String vendorName;
	
	@ApiModelProperty(position = 3, value = "Web service type", name = "webServiceType", example = "Rest")
	private String webServiceType;
	
	@ApiModelProperty(position = 4, value = "port", name = "port", example = "80")
	private String port;
	
	@ApiModelProperty(position = 5, value = "baseurl", name = "baseurl", example = "baseurl")
	private String baseurl;
	
	@ApiModelProperty(position = 6, value = "retry count", name = "retryCount", example = "3")
	private Integer retryCount;
	
	@ApiModelProperty(position = 7, value = "time out seconds", name = "timeOutSeconds", example = "3")
	private Integer timeOutSeconds;
	
	@ApiModelProperty(position = 8, value = "vendorDetails", name = "vendorDetails", example = "")
	private Object vendorDetails;
	
	@ApiModelProperty(position = 9, value = "isActive", name = "isActive", example = "true")
	private Boolean isActive;
}
