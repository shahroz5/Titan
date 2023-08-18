package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
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
import com.titan.poss.product.ProductBase;
import com.titan.poss.product.constant.LovTypeEnum;
import com.titan.poss.product.dto.request.LovUpdateDto;
import com.titan.poss.product.dto.response.LovCreateDto;

public class LovControllerTest extends ProductBase {

	private static final String URI = "lovs";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testGetLovTypes() {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/lov-types"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testGetLov() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		String lovType = LovTypeEnum.PRODUCTTYPE.name();
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + lovType), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ ",OK", "STUDDED,BAD_REQUEST", ",UNPROCESSABLE_ENTITY" })
	void testCreateLov(String code, String status) {

		LovCreateDto lovCreateDto = new LovCreateDto();
		if (StringUtils.isBlank(code))
			lovCreateDto.setCode(generateString(5));
		else
			lovCreateDto.setCode(code);
		lovCreateDto.setLovType(LovTypeEnum.PRODUCTTYPE.toString());
		if (status.equals("UNPROCESSABLE_ENTITY"))
			lovCreateDto.setValue(null);
		else
			lovCreateDto.setValue(generateString(4));

		HttpEntity<LovCreateDto> entity = new HttpEntity<>(lovCreateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY" })
	void testUpdateLov(String status) {

		String lovType = LovTypeEnum.PRODUCTTYPE.name();
		LovUpdateDto lovUpdateDto = new LovUpdateDto();
		List<KeyValueDto> listKeyValueDto = new ArrayList<>();
		KeyValueDto keyValueDto = new KeyValueDto();

		keyValueDto.setCode(generateString(4));
		keyValueDto.setValue(generateString(4));

		keyValueDto.setIsActive(false);
		listKeyValueDto.add(keyValueDto);
		if (status.equals("OK"))
			lovUpdateDto.setValues(listKeyValueDto);
		else {
			listKeyValueDto.clear();
			lovUpdateDto.setValues(listKeyValueDto);
		}

		HttpEntity<LovUpdateDto> entity = new HttpEntity<>(lovUpdateDto, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + lovType),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}
}
