package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
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
import com.titan.poss.product.dto.ComplexityDto;
import com.titan.poss.product.dto.request.ComplexityUpdateDto;

public class ComplexityControllerTest extends ProductBase {

	private static final String URI = "complexities";

	private static HttpHeaders headers = new HttpHeaders();


	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@DisplayName("testAddComplexity")
	@ParameterizedTest
	@CsvSource({ "$,UNPROCESSABLE_ENTITY", ",OK", "PA,BAD_REQUEST" })
	void a(String complexityCode, String status) {

		ComplexityDto complexityDto = new ComplexityDto();

		if (StringUtils.isBlank(complexityCode)) {
			complexityDto.setComplexityCode(generateString(2));
		} else {
			complexityDto.setComplexityCode(complexityCode);
		}

		complexityDto.setDescription(generateString(10));
		complexityDto.setIsActive(false);
		HttpEntity<ComplexityDto> entity = new HttpEntity<>(complexityDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testListComplexity")
	@Test
	void b() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("complexities?isActive=true&isPageable=true"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@DisplayName("testGetComplexity")
	@ParameterizedTest
	@CsvSource({ "PA,OK", "A$$$,BAD_REQUEST" })
	void c(String complexityCode, String status) {

		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + complexityCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testUpdateComplexity")
	@ParameterizedTest
	@CsvSource({ "PA,UNPROCESSABLE_ENTITY", "PA,OK", "A$$$,BAD_REQUEST" })
	void d(String complexityCode, String status) {

		ComplexityUpdateDto complexityUpdateDto = new ComplexityUpdateDto();

		if (status.equals("UNPROCESSABLE_ENTITY")) {
			complexityUpdateDto.setDescription(" ");
		}
		complexityUpdateDto.setIsActive(false);
		HttpEntity<ComplexityUpdateDto> entity = new HttpEntity<>(complexityUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + complexityCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
