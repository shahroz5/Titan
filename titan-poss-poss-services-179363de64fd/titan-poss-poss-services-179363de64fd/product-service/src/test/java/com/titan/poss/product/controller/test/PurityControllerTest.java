package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;

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
import com.titan.poss.product.dto.request.PurityCreateDto;

public class PurityControllerTest extends ProductBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("Commercial", "welcome123"));
	}

	@DisplayName("testListPurity")
	@Test
	void a() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("purities"), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@DisplayName("testaddPurity")
	@ParameterizedTest
	@CsvSource({ "101,UNPROCESSABLE_ENTITY", "20,OK", "10,BAD_REQUEST" })
	void testaddPurity(BigDecimal purity, String status) {
		PurityCreateDto purityCreateDto = new PurityCreateDto();
		purityCreateDto.setDescription("testing");
		purityCreateDto.setIsActive(false);
		purityCreateDto.setKarat(BigDecimal.valueOf(21));
		purityCreateDto.setItemTypeCode("J");
		purityCreateDto.setOffset(BigDecimal.valueOf(1.0909));
		purityCreateDto.setPurity(purity);
		HttpEntity<PurityCreateDto> entity = new HttpEntity<>(purityCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("purities"), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "UNPROCESSABLE_ENTITY", "OK", "BAD_REQUEST" })
	void testUpdatePurity(String status) {
		PurityCreateDto purityCreateDto = new PurityCreateDto();
		purityCreateDto.setDescription("Platinium");
		purityCreateDto.setIsActive(true);
		purityCreateDto.setKarat(BigDecimal.valueOf(22));
		purityCreateDto.setItemTypeCode("J");
		purityCreateDto.setOffset(BigDecimal.valueOf(1));
		if (status.equals("UNPROCESSABLE_ENTITY"))
			purityCreateDto.setPurity(new BigDecimal(101));
		else if (status.equals("OK"))
			purityCreateDto.setPurity(new BigDecimal(10));
		else
			purityCreateDto.setPurity(new BigDecimal(5));
		HttpEntity<PurityCreateDto> entity = new HttpEntity<>(purityCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("purities"), HttpMethod.PUT, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));

	}

}
