package com.titan.poss.location.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.location.dto.LovCreateDto;
import com.titan.poss.location.dto.constants.LovTypeEnum;
import com.titan.poss.location.dto.request.LovUpdateDto;
import com.titan.poss.location.test.LocationBase;

class LovControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testGetLovTypes() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lovs/lov-types"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "LOCATIONTYPE", "OWNERTYPE" })
	void testGetLov(LovTypeEnum lovTypeEnum) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lovs/" + lovTypeEnum),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY", "BAD_REQUEST" })
	void testCreateLov(String status) {
		LovCreateDto lovCreateDto = new LovCreateDto();
		lovCreateDto.setLovType(LovTypeEnum.LOCATIONTYPE.name());
		lovCreateDto.setValue(generateString(4));
		if (status.equals("OK")) {
			lovCreateDto.setCode(generateString(3));
		} else if (status.equals("BAD_REQUEST")) {
			lovCreateDto.setCode("L1");
		}
		HttpEntity<LovCreateDto> entity = new HttpEntity<>(lovCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lovs"), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY" })
	void testUpdateLov(String status) {
		LovTypeEnum lovTypeEnum = LovTypeEnum.LOCATIONTYPE;
		LovUpdateDto lovUpdateDto = new LovUpdateDto();

		List<KeyValueDto> values = new ArrayList<>();
		if (status.equals("OK")) {
			KeyValueDto keyValueDto = new KeyValueDto();
			keyValueDto.setCode(generateString(3));
			keyValueDto.setIsActive(false);
			keyValueDto.setValue(generateString(4));
			values.add(keyValueDto);
		}

		lovUpdateDto.setValues(values);
		HttpEntity<LovUpdateDto> entity = new HttpEntity<>(lovUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("lovs/" + lovTypeEnum),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

}
