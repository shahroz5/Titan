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
import com.titan.poss.location.dto.TaxClassDto;
import com.titan.poss.location.dto.request.TaxClassUpdateDto;
import com.titan.poss.location.test.LocationBase;

public class TaxClassTest extends LocationBase {

	private static final String URI = "tax-classes";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "tax-classes", "tax-classes?isActive=true" })
	void testListTaxClass(String url) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(url), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "TC1,OK", "$$,BAD_REQUEST" })
	void testGetTaxClass(String taxClassCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + taxClassCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY" })
	void testAddTaxClass(String status) {
		TaxClassDto taxClassDto = new TaxClassDto();
		if (status.equals("OK")) {
			taxClassDto.setDescription(generateString(5));
		} else {
			taxClassDto.setDescription(generateString(1));
		}
		taxClassDto.setTaxClassCode(generateString(5));
		taxClassDto.setIsActive(false);

		HttpEntity<TaxClassDto> entity = new HttpEntity<>(taxClassDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "TC1,OK", "TC1,UNPROCESSABLE_ENTITY", "$$,BAD_REQUEST" })
	void testUpdateClass(String taxClassCode, String status) {
		TaxClassUpdateDto taxClassUpdateDto = new TaxClassUpdateDto();
		if (status.equals("UNPROCESSABLE_ENTITY"))
			taxClassUpdateDto.setDescription("");
		else
			taxClassUpdateDto.setDescription("Titan Watch");
		HttpEntity<TaxClassUpdateDto> entity = new HttpEntity<>(taxClassUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + taxClassCode),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));

	}

}
