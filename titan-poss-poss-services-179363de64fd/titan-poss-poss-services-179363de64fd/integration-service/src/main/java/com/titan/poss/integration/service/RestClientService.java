/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import javax.servlet.http.HttpServletRequest;

import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.dto.ThirdPartyApiReqDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface RestClientService {

	ApiResponseDto runEPOSSAPIRequest(EpossApiReqDto epossApiReqDto, String headerToken, HttpServletRequest request);

	ApiResponseDto runThirdPartyAPI(ThirdPartyApiReqDto apiReqDto);

	ApiResponseDto callLegacyAPI(ThirdPartyApiReqDto apiReqDto, String uriCode);

}
