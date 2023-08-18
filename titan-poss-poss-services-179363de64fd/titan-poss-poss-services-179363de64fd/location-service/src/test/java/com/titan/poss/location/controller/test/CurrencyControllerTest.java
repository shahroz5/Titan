package com.titan.poss.location.controller.test;

import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.location.dto.CurrencyDto;
import com.titan.poss.location.dto.request.CurrencyUpdateDto;
import com.titan.poss.location.test.LocationBase;

class CurrencyControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "currencies", "currencies?isActive=true&isPageable=true" })
	void testListCurrency(String url) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(url), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "INR,OK", "$$,BAD_REQUEST" })
	void testGetCurrency(String currencyCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("currencies/" + currencyCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY", "BAD_REQUEST" })
	void testAddCurrency(String status) {
		CurrencyDto currencyDto = new CurrencyDto();
		currencyDto.setCurrencyCode(generateString(3));
		if (status.equals("UNPROCESSABLE_ENTITY")) {
			currencyDto.setDescription(generateString(1));
		} else if (status.equals("OK")) {
			currencyDto.setDescription(generateString(10));
		} else if (status.equals("BAD_REQUEST")) {
			currencyDto.setDescription("Indian Rupee");
		}
		currencyDto.setCurrencySymbol(generateString(3));
		currencyDto.setIsActive(false);

		HttpEntity<CurrencyDto> entity = new HttpEntity<>(currencyDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("currencies"), HttpMethod.POST,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "INR,OK", "INR,UNPROCESSABLE_ENTITY", "$$$,BAD_REQUEST" })
	void testUpdateCurrency(String currencyCode, String status) {
		CurrencyUpdateDto currencyUpdateDto = new CurrencyUpdateDto();
		currencyUpdateDto.setIsActive(true);
		if (status.equals("UNPROCESSABLE_ENTITY"))
			currencyUpdateDto.setDescription(generateString(1));
		HttpEntity<CurrencyUpdateDto> entity = new HttpEntity<>(currencyUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("currencies/" + currencyCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
