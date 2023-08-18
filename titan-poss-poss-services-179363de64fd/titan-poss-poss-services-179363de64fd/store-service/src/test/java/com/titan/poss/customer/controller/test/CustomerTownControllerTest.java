/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.customer.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.UUID;

import org.apache.commons.lang.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.customer.CustomerBase;
import com.titan.poss.store.dto.request.CustomerTownAddDto;
import com.titan.poss.store.dto.request.CustomerTownUpdateDto;

/**
 * CustomerTownController test class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
class CustomerTownControllerTest extends CustomerBase {

	public static final String URI = "towns";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));
	}

	@ParameterizedTest
	@ValueSource(strings = { "Karnataka", "Kerala" })
	void testListTown(String stateName) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "?stateName=" + stateName),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "999,BAD_REQUEST" })
	void testGetTown(Integer townCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + townCode), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testAddTown")
	@ParameterizedTest
	@CsvSource({ ",,OK", "Mysore,,BAD_REQUEST" })
	void testAdd(String description, String stateCode, String status) {
		CustomerTownAddDto customerTownAddDto = new CustomerTownAddDto();

		if (StringUtils.isEmpty(description)) {
			customerTownAddDto.setDescription(RandomStringUtils.random(5, characters).toUpperCase());
		} else {
			customerTownAddDto.setDescription(description);
		}
		customerTownAddDto.setStateCode(UUID.randomUUID().toString());
//		if (StringUtils.isEmpty(stateCode)) {
//			customerTownAddDto.setStateCode(Karnataka);
//		} else {
//			customerTownAddDto.setStateCode(stateCode);
//		}

		HttpEntity<CustomerTownAddDto> entity = new HttpEntity<>(customerTownAddDto, headers);

		ResponseEntity<JsonNode> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				JsonNode.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "1,Karnataka,OK", "100,,BAD_REQUEST" })
	void testUpdateTown(Integer townCode, String stateCode, String status) {

		CustomerTownUpdateDto customerTownUpdateDto = new CustomerTownUpdateDto();
		customerTownUpdateDto.setIsActive(true);

		customerTownUpdateDto.setStateCode(UUID.randomUUID().toString());

		HttpEntity<CustomerTownUpdateDto> entity = new HttpEntity<>(customerTownUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + townCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
