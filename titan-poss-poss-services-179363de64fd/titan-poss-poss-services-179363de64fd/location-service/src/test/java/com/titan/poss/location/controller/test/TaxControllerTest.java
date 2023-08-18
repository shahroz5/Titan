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
import com.titan.poss.location.dto.TaxDto;
import com.titan.poss.location.dto.request.TaxUpdateDto;
import com.titan.poss.location.test.LocationBase;

public class TaxControllerTest extends LocationBase {

	private static final String URI = "tax";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "tax", "tax?isActive=true" })
	void testListTax(String url) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(url), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "CGST,OK", "$$,BAD_REQUEST" })
	void testGetTax(String taxCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + taxCode), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY" })
	void testAddTax(String status) {
		TaxDto taxDto = new TaxDto();

		taxDto.setTaxCode(generateString(4));
		taxDto.setDescription("Add Tax Unit Testing");
		if (status.equals("UNPROCESSABLE_ENTITY")) {
			taxDto.setDescription("");
		}
		taxDto.setIsActive(false);
		HttpEntity<TaxDto> entity = new HttpEntity<>(taxDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "CGST,OK", "CGST,UNPROCESSABLE_ENTITY", "$$,BAD_REQUEST" })
	void testUpdateTax(String taxCode, String status) {
		TaxUpdateDto taxUpdateDto = new TaxUpdateDto();

		if (status.equals("UNPROCESSABLE_ENTITY"))
			taxUpdateDto.setDescription("");
		else
			taxUpdateDto.setDescription("Central Goods and Service Tax");
		HttpEntity<TaxUpdateDto> entity = new HttpEntity<>(taxUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + taxCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
