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

import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.product.ProductBase;
import com.titan.poss.product.dto.request.ProductGroupUpdateDto;

public class ProductGroupControllerTest extends ProductBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListProductGroup() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("product-groups?isPageable=true"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest

	@CsvSource({ "GV,OK", "A!,BAD_REQUEST" })
	void testGetProductGroup(String productGroup, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("product-groups/" + productGroup),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "GV,,,UNPROCESSABLE_ENTITY", ",J,T,OK", "GV,,,BAD_REQUEST" })
	void testaddProductGroup(String productGroupCode, String itemTypeCode, String orgCode, String status) {
		ProductGroupDto productGroupDto = new ProductGroupDto();
//		productGroupDto.setConfigDetails("");
		if (status.equals("UNPROCESSABLE_ENTITY"))
			productGroupDto.setDescription("A");
		else
			productGroupDto.setDescription("unit test");
		productGroupDto.setIsActive(false);
		productGroupDto.setItemTypeCode(itemTypeCode);
		productGroupDto.setOrgCode(orgCode);
		if (StringUtils.isBlank(productGroupCode))
			productGroupDto.setProductGroupCode(generateInteger(4).toString());
		else
			productGroupDto.setProductGroupCode(productGroupCode);
//		productGroupDto.setProductType("GOLD");
		HttpEntity<ProductGroupDto> entity = new HttpEntity<>(productGroupDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("product-groups"), HttpMethod.POST,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "GV,UNPROCESSABLE_ENTITY", "GV,OK", "A!,BAD_REQUEST" })
	void testUpdateProductGroup(String productGroupCode, String status) {
		ProductGroupUpdateDto productGroupDto = new ProductGroupUpdateDto();
		if (status.equals("UNPROCESSABLE_ENTITY"))
			productGroupDto.setDescription("A");
		productGroupDto.setIsActive(false);

		HttpEntity<ProductGroupUpdateDto> entity = new HttpEntity<>(productGroupDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("product-groups/" + productGroupCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

}
