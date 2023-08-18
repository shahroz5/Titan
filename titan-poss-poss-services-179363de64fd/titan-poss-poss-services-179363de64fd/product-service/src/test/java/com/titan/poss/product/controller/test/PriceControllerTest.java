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
import com.titan.poss.product.dto.PriceDto;

public class PriceControllerTest extends ProductBase {

	private static HttpHeaders headers = new HttpHeaders();

	private static final String URI = "prices";

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("COMMERCIAL", "welcome123"));
	}

	@DisplayName("addPrice")
	@ParameterizedTest
	@CsvSource({ "$,$,BAD_REQUEST", "100ABEA0981,Bangalore,OK", "100ABEA098,Bangalore,BAD_REQUEST",
			",,UNPROCESSABLE_ENTITY" })
	void a(String itemCode, String priceGroup, String status) {
		PriceDto priceDto = new PriceDto();
		priceDto.setItemCode(itemCode);
		priceDto.setPriceGroup(priceGroup);
		priceDto.setMakingCharge(new BigDecimal(2000));
		priceDto.setIsActive(true);
		HttpEntity<PriceDto> entity = new HttpEntity<>(priceDto, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testListPrice")
	@Test
	void b() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "100ABEA098,Bangalore,OK", "$,$,BAD_REQUEST", ",,UNPROCESSABLE_ENTITY" })
	@DisplayName("testUpdatePrice")
	void c(String itemCode, String priceGroup, String status) {
		PriceDto priceDto = new PriceDto();
		priceDto.setItemCode(itemCode);
		priceDto.setPriceGroup(priceGroup);
		priceDto.setIsActive(false);
		priceDto.setMakingCharge(new BigDecimal(2000));
		HttpEntity<PriceDto> entity = new HttpEntity<>(priceDto, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.PUT, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

}
