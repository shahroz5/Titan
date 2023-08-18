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
import com.titan.poss.product.dto.PriceGroupDto;
import com.titan.poss.product.dto.request.PriceGroupUpdateDto;

public class PriceGroupControllerTest extends ProductBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListPriceGroup() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("price-groups?isActive=true"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "Bangalore,OK", "$$,BAD_REQUEST" })
	void testGetPriceGroup(String priceGroup, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("price-groups/" + priceGroup),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$,UNPROCESSABLE_ENTITY", ",OK", "Bangalore,BAD_REQUEST" })
	void testaddPriceGroup(String priceGroup, String status) {

		PriceGroupDto priceGroupDto = new PriceGroupDto();
		priceGroupDto.setDescription("unit testing");
		priceGroupDto.setIsActive(false);

		if (StringUtils.isBlank(priceGroup))
			priceGroupDto.setPriceGroup(generateString(4));
		else
			priceGroupDto.setPriceGroup(priceGroup);

		HttpEntity<PriceGroupDto> entity = new HttpEntity<>(priceGroupDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("price-groups"), HttpMethod.POST,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$$,UNPROCESSABLE_ENTITY", "Bangalore,OK", "$$,BAD_REQUEST" })
	void testUpdatePriceGroup(String priceGroup, String status) {
		PriceGroupUpdateDto priceGroupUpdateDto = new PriceGroupUpdateDto();
		if (status.equals("UNPROCESSABLE_ENTITY"))
			priceGroupUpdateDto.setDescription(generateString(101));
		
		priceGroupUpdateDto.setIsActive(true);

		HttpEntity<PriceGroupUpdateDto> entity = new HttpEntity<>(priceGroupUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("price-groups/" + priceGroup),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

}
