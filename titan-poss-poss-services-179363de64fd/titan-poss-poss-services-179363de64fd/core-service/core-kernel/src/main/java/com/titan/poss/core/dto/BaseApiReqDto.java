/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Map;

import javax.validation.constraints.NotNull;

import org.springframework.http.HttpMethod;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public abstract class BaseApiReqDto {
	@NotNull
	HttpMethod httpMethod;

	Map<String, String> requestParams;

	Object reqBody;

}
