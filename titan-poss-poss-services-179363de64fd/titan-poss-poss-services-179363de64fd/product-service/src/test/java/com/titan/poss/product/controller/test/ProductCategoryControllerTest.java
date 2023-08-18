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

import com.titan.poss.core.dto.ProductCategoryDto;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.product.ProductBase;
import com.titan.poss.product.dto.request.ProductCategoryUpdateDto;

public class ProductCategoryControllerTest extends ProductBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("Commercial", "welcome123"));
	}

	@Test
	void testListProductCategory() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("product-categories?isPageable=true"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "C,OK", "$,BAD_REQUEST" })
	void testGetProductCategory(String productCategory, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("product-categories/" + productCategory), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$,,UNPROCESSABLE_ENTITY", ",T,OK" })
	void testaddProductCategory(String productCategoryCode, String orgCode, String status) {
		ProductCategoryDto productCategoryDto = new ProductCategoryDto();
//		productCategoryDto.setConfigDetails("");
		productCategoryDto.setDescription("Unit Test");
		productCategoryDto.setIsActive(false);
		productCategoryDto.setOrgCode(orgCode);
		if (StringUtils.isBlank(productCategoryCode))
			productCategoryDto.setProductCategoryCode(generateString(4));
		else
			productCategoryDto.setProductCategoryCode(productCategoryCode);

		HttpEntity<ProductCategoryDto> entity = new HttpEntity<>(productCategoryDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("product-categories"),
				HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$,BAD_REQUEST", "C,OK", "$,UNPROCESSABLE_ENTITY" })
	void testUpdatePriceGroup(String productCategoryCode, String status) {
		ProductCategoryUpdateDto productCategoryUpdateDto = new ProductCategoryUpdateDto();
		if (status.equals("UNPROCESSABLE_ENTITY"))
			productCategoryUpdateDto.setDescription("");
		productCategoryUpdateDto.setIsActive(true);

		HttpEntity<ProductCategoryUpdateDto> entity = new HttpEntity<>(productCategoryUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("product-categories/" + productCategoryCode), HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
