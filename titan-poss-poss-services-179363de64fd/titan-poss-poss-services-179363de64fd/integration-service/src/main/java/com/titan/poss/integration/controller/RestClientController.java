/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.dto.ThirdPartyApiReqDto;
import com.titan.poss.integration.service.RestClientService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationEpossApiController")
@RequestMapping(value = "integration/v2/rest-client")
public class RestClientController {

	@Autowired
	RestClientService restClientService;

	// @formatter:off
	@ApiOperation(value = "Call EPOSS API", notes = "This API can be used to call EPOSS API From POSS.<br>"
			+ "\"httpResponseCode\" field of this API response contain EPOSS API's http status code"
			+ "<br><br>"
			+ " Example for GET Call :<br>\r\n" + 
			"<pre>" + 
			"{\r\n" + 
			"    \"httpMethod\": \"GET\",\r\n" + 
			"    \"relativeUrl\": \"api/engine/v2/users/profile\"\r\n" + 
			"}\r\n" + 
			"</pre><br><br>"
			+ " Example for POST Call :<br>\r\n" + 
			"<pre>" + 
			"{\r\n" + 
			"    \"httpMethod\": \"POST\",\r\n" + 
			"    \"relativeUrl\": \"api/user/v2/users/forgot-password\",\r\n" + 
			"    \"reqBody\": \r\n" + 
			"    {\r\n" + 
			"    	\"empCode\": \"admin44\"\r\n" + 
			"    }\r\n" + 
			"}\r\n" + 
			"</pre><br>"
			+ "")
	// @formatter:on
	@PostMapping("/eposs")
	@PreAuthorize(IS_STORE_USER)
	public ApiResponseDto runAPIRequest(
			@ApiParam(name = "body", value = "Request details to call EPOSS API", required = true) @RequestBody @Valid EpossApiReqDto epossApiReqDto,
			HttpServletRequest request) {
		return restClientService.runEPOSSAPIRequest(epossApiReqDto, null, request);
	}

	@ApiOperation(value = "Call EPOSS API through API User", notes = "This API can be used to call EPOSS API from API user's token.<br>")
	@PostMapping("/eposs/api-user")
	public ApiResponseDto runAPIRequestAPIUser(@RequestHeader(value = CommonConstants.AUTH_HEADER) String headerToken,
			@ApiParam(name = "body", value = "Request details to call EPOSS API", required = true) @RequestBody @Valid EpossApiReqDto epossApiReqDto) {
		return restClientService.runEPOSSAPIRequest(epossApiReqDto, headerToken, null);
	}

	@PostMapping
	@PreAuthorize(IS_STORE_USER)
	public ApiResponseDto runThirdPartyAPI(
			@ApiParam(name = "body", value = "Request details to call third party", required = true) @RequestBody @Valid ThirdPartyApiReqDto epossApiReqDto) {
		return restClientService.runThirdPartyAPI(epossApiReqDto);
	}

}
