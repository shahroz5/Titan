package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

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

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.product.ProductBase;
import com.titan.poss.product.dto.StoneTypeDto;
import com.titan.poss.product.dto.request.StoneTypeUpdateDto;

public class StoneTypeControllerTest extends ProductBase {
	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("Commercial", "welcome123"));
	}

	@Test
	void testListStoneType() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stone-types?isPageable=true"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "DU,OK", "$1,BAD_REQUEST" })
	void testGetStoneType(String stoneType, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stone-types/" + stoneType),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "DU,BAD_REQUEST", ",OK", "$,UNPROCESSABLE_ENTITY" })
	void testAddStoneType(String stoneTypeCode, String status) {
		StoneTypeDto stoneTypeDto = new StoneTypeDto();
		stoneTypeDto.setConfigDetails("");
		stoneTypeDto.setDescription("unit testing");
		stoneTypeDto.setIsActive(false);
		if (StringUtils.isBlank(stoneTypeCode))
			stoneTypeDto.setStoneTypeCode(generateString(3));
		else
			stoneTypeDto.setStoneTypeCode(stoneTypeCode);
		HttpEntity<StoneTypeDto> entity = new HttpEntity<>(stoneTypeDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stone-types"), HttpMethod.POST,
				entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$1,BAD_REQUEST", "DU,OK", "$,UNPROCESSABLE_ENTITY" })
	void testUpdateStoneType(String stoneTypeCode, String status) {
		StoneTypeUpdateDto stoneTypeDto = new StoneTypeUpdateDto();
		if (status.equals("UNPROCESSABLE_ENTITY"))
			stoneTypeDto.setDescription(" ");
		else
			stoneTypeDto.setDescription("unit test");
		stoneTypeDto.setIsActive(false);
		HttpEntity<StoneTypeUpdateDto> entity = new HttpEntity<>(stoneTypeDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stone-types/" + stoneTypeCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

}
