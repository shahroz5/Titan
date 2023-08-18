/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.controller.test;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
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
import com.titan.poss.config.dto.request.RangeRequestDto;
import com.titan.poss.core.utils.test.AuthUtil;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@ExtendWith(SpringExtension.class)
public class RangeControllerTest extends ConfigBase {

	private static final String URI = "ranges";

	private static final String SEPARATOR = "/";

	private static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "Welcome123"));
	}

	@Test
	void testListRange() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "?rangeType=GEP_PURITY&isPageable=true"), HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testAddRange() {
		RangeRequestDto rangeRequestDto = new RangeRequestDto();
//		rangeRequestDto.setFromRange(new BigDecimal(0));
//		rangeRequestDto.setToRange(new BigDecimal(50));
//		rangeRequestDto.setIsActive(true);
		HttpEntity<RangeRequestDto> entity = new HttpEntity<>(rangeRequestDto, headers);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "?rangeType=GEP_PURITY"),
				HttpMethod.POST, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "54830379-C479-4167-89E0-0DD9EAA16F4B,OK", "54830379-C479-4167-89E0-0DD9EAA16F4P,BAD_REQUEST" })
	void testGetRange(String id) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + SEPARATOR + id + "?rangeType=GEP_PURITY"), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "54830379-C479-4167-89E0-0DD9EAA16F4B,OK", "54830379-C479-4167-89E0-0DD9EAA16F4P,BAD_REQUEST" })
	void testUpdateRange(String id) {
		RangeRequestDto rangeRequestDto = new RangeRequestDto();
//		rangeRequestDto.setFromRange(new BigDecimal(0));
//		rangeRequestDto.setToRange(new BigDecimal(55));
//		rangeRequestDto.setIsActive(false);
		HttpEntity<RangeRequestDto> entity = new HttpEntity<>(rangeRequestDto, headers);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + SEPARATOR + id + "?rangeType=GEP_PURITY"), HttpMethod.PATCH, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
