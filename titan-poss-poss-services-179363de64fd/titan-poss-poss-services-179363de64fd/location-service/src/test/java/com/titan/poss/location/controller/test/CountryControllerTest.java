package com.titan.poss.location.controller.test;

import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.location.dto.request.CountryUpdateDto;
import com.titan.poss.location.test.LocationBase;

class CountryControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListCountry() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("countries?isActive=true&isPageable=true"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "IND,OK", "$$,BAD_REQUEST" })
	void testGetCountry(String countryCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("countries/" + countryCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "ABC,BAD_REQUEST", ",UNPROCESSABLE_ENTITY", "INR,OK" })
	void testAddCountry(String currencyCode, String status) {
		CountryDto countryDto = new CountryDto();
		countryDto.setCurrencyCode(currencyCode);
		countryDto.setDateFormat("YYYY-MM-DD");
		countryDto.setDescription(generateString(10));
		if (status.equals("BAD_REQUEST")) {
			countryDto.setCountryCode("IND");
		} else {
			countryDto.setCountryCode(generateString(3));
		}
		countryDto.setIsActive(false);
		countryDto.setIsdCode("+911");
		countryDto.setLocale(generateString(3));
		countryDto.setPhoneLength(10);
		countryDto.setTimeFormat("HH:MM:SS");
		HttpEntity<CountryDto> entity = new HttpEntity<>(countryDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("countries"), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "IND,OK", "IND,UNPROCESSABLE_ENTITY", "$$,BAD_REQUEST" })
	void testUpdateCountry(String countryCode, String status) {
		CountryUpdateDto countryUpdateDto = new CountryUpdateDto();
		countryUpdateDto.setIsActive(true);
		if (status.equals("UNPROCESSABLE_ENTITY"))
			countryUpdateDto.setDescription("");
		HttpEntity<CountryUpdateDto> entity = new HttpEntity<>(countryUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("countries/" + countryCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
