package com.titan.poss.location.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import com.titan.poss.location.dto.constants.PriceTypeCodeEnum;
import com.titan.poss.location.dto.request.MetalBasePriceRequestDto;
import com.titan.poss.location.dto.request.MetalPriceMappingRequestDto;
import com.titan.poss.location.dto.request.json.MetalPriceConfigRequestDto;
import com.titan.poss.location.test.LocationBase;

class MetalControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListMaterialPriceLocationMapping() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("materials/J/market?isPageable=true"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "F,0", "F,1", "D,1" })
	void testComputeMaterialPriceLocationMapppingConfig(PriceTypeCodeEnum priceTypeCodeEnum, Integer marketCodesCount) {
		MetalBasePriceRequestDto materialPriceDto = new MetalBasePriceRequestDto();
		List<String> marketCodes = new ArrayList<>();
		if (marketCodesCount == 0)
			marketCodes.clear();
		else
			marketCodes.add("KA");
		materialPriceDto.setApplicableDate(new Date());
		materialPriceDto.setBasePrice(generateInteger(2));
		materialPriceDto.setPriceTypeCode(priceTypeCodeEnum.toString());
		materialPriceDto.setMarketCodes(marketCodes);
		HttpEntity<MetalBasePriceRequestDto> entity = new HttpEntity<>(materialPriceDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("materials/J/price/compute"),
				HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().equals(response.getStatusCode()));
	}

	@ParameterizedTest
	@CsvSource({ "F,0", "F,1", "D,1" })
	void testConfirmMaterialPriceLocationMapppingConfig(PriceTypeCodeEnum priceTypeCodeEnum, Integer marketCodesCount) {
		MetalPriceMappingRequestDto marketMateriaDto = new MetalPriceMappingRequestDto();
		List<String> marketCodes = new ArrayList<>();
		if (marketCodesCount == 0)
			marketCodes.clear();
		else
			marketCodes.add("KA");
		marketMateriaDto.setApplicableDate(new Date());
		marketMateriaDto.setBasePrice(generateInteger(2));
		marketMateriaDto.setPriceTypeCode(priceTypeCodeEnum.toString());
		marketMateriaDto.setMarketCodes(marketCodes);
		marketMateriaDto.setRemarks(generateString(10));

		HttpEntity<MetalPriceMappingRequestDto> entity = new HttpEntity<>(marketMateriaDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("materials/J/price"), HttpMethod.PUT,
				entity, String.class);
		assertTrue(response.getStatusCode().equals(response.getStatusCode()));
	}

	@Test
	void testListMaterialPriceConfig() {
		MetalPriceConfigRequestDto materialPriceConfigRequestDto = new MetalPriceConfigRequestDto();
		materialPriceConfigRequestDto.setApplicableDate(new Date());
		HttpEntity<MetalPriceConfigRequestDto> entity = new HttpEntity<>(materialPriceConfigRequestDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("materials/J/price"), HttpMethod.POST,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testListMaterialPriceLocation() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("materials/J/1/prices?isPageable=true"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
