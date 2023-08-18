/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.controller.test;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestTemplate;

import com.titan.poss.config.ConfigBase;
import com.titan.poss.config.dto.request.FocSchemeAddDto;
import com.titan.poss.core.utils.test.AuthUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@ExtendWith(SpringExtension.class)
public class FocControllerTest extends ConfigBase {

	private static final String URI = "foc-schemes";

	private static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "Welcome@123"));
	}

	@ParameterizedTest
	@CsvSource({ "scheme99, OK" })
	void testCreateScheme() {
		FocSchemeAddDto focSchemeAddDto = new FocSchemeAddDto();
		HttpEntity<FocSchemeAddDto> entity = new HttpEntity<>(focSchemeAddDto, headers);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

//	@ParameterizedTest
//	@CsvSource({ "86276A13-9CC9-4DA7-AC42-3108DD1C4D35,OK", "421F47BD-95D9-4E31-ACD9-FA140735CD76,BAD_REQUEST" })
//	void testUpdateScheme(String id) {
//		FocSchemeResponseDto focSchemeResponseDto = new FocSchemeResponseDto();
//		Set<String> addProductGroup = new HashSet<>();
//		Set<AddRangeDto> addRangeSet = new HashSet<>();
//		addProductGroup.add("75");
//		gepConfigProductGroupMappingRequestDto.setAddProductGroups(addProductGroup);
//		AddRangeDto addRange = new AddRangeDto();
//		addRange.setPercentValue(new BigDecimal(45));
//		addRange.setRangeId("54830379-C479-4167-89E0-0DD9EAA16F4B");
//		addRangeSet.add(addRange);
//		gepConfigProductGroupMappingRequestDto.setAddRanges(addRangeSet);
//		HttpEntity<GepConfigProductGroupMappingRequestDto> entity = new HttpEntity<>(
//				gepConfigProductGroupMappingRequestDto, headers);
//		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//		RestTemplate restTemplate = new RestTemplate(requestFactory);
//		ResponseEntity<String> response = restTemplate.exchange(
//				createURLWithPort(URI + SEPARATOR + id ), HttpMethod.PATCH, entity,
//				String.class);
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}

}
