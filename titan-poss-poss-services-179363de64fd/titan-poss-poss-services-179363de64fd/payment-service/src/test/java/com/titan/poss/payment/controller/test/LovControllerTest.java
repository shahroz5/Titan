/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.payment.PaymentBase;
import com.titan.poss.payment.constants.LovTypeEnum;
import com.titan.poss.payment.dto.KeyValueDto;
import com.titan.poss.payment.dto.LovCreateDto;
import com.titan.poss.payment.dto.request.LovUpdateDto;
import com.titan.poss.payment.dto.response.LovDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@DisplayName("LovControllerTest")
@ExtendWith(SpringExtension.class)
public class LovControllerTest extends PaymentBase {

	private static HttpHeaders headers = new HttpHeaders();
	
	private static final String LOVS = "lovs/";
	

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	private LovDto getLovDetails(LovTypeEnum lovType) {

		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType.toString());

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(LovControllerTest.LOVS + lovType), HttpMethod.GET,
				entity, JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("values").iterator();

		List<KeyValueDto> values = new ArrayList<>();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			KeyValueDto keyValueDto = new KeyValueDto();
			keyValueDto.setCode(data.get("code").asText());
			keyValueDto.setValue(data.get("value").asText());
			keyValueDto.setIsActive(data.get("isActive").asBoolean());

			values.add(keyValueDto);

		}

		lovDto.setResults(values);
		return lovDto;

	}

	@Test
	void testGetLovTypes() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lovs/lov-types"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "TRANSACTION_TYPE" })
	void testGetLov(LovTypeEnum lovTypeEnum) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(LovControllerTest.LOVS + "TRANSACTION_TYPE"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY", "BAD_REQUEST" })
	void testCreateLov(String status) {
		LovCreateDto lovCreateDto = new LovCreateDto();
		lovCreateDto.setLovType(LovTypeEnum.PAYMENT_GROUP.toString());
		lovCreateDto.setValue(generateString(4));
		if (status.equals("OK")) {
			lovCreateDto.setCode(generateString(3).toUpperCase());
		} else if (status.equals("BAD_REQUEST")) {
			lovCreateDto.setCode("L1 2");
		}
		HttpEntity<LovCreateDto> entity = new HttpEntity<>(lovCreateDto, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lovs"), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void testUpdateLov() {
		LovDto lovDto = getLovDetails(LovTypeEnum.PAYMENT_GROUP);

		LovUpdateDto lovUpdateDto = new LovUpdateDto();
		lovUpdateDto.setValues(List.of(lovDto.getResults().get(0)));

		HttpEntity<LovUpdateDto> entity = new HttpEntity<>(lovUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(LovControllerTest.LOVS + lovDto.getLovType()),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}
}
