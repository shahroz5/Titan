/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Airpay config proerties dto")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AirpayConfigPropertiesDto extends BaseFieldsValidator{

	private String locationCode;
	
	@JsonProperty("MerchantId")
	private String merchantId;
	
	@JsonProperty("Username")
	private String username;

	@JsonIgnore()
	@JsonProperty("Password")
	private String password;
	
	@JsonIgnore()
	@JsonProperty("SecretKey")
	private String secretKey;
	
	@JsonIgnore()
	@JsonProperty("SecretToken")
	private String secretToken;

}
