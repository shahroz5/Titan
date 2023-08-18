package com.titan.poss.location.controller.test;

import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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

import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.location.dto.request.MarketMarkupFactors;
import com.titan.poss.location.dto.request.MarketMarkupMappingRequestDto;
import com.titan.poss.location.dto.request.MarketUpdateDto;
import com.titan.poss.location.test.LocationBase;

class MarketControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@DisplayName("testListMarket")
	@ParameterizedTest
	@CsvSource({ "markets?isActive=true&isPageable=true", "markets?isActive=true" })
	void a(String url) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(url), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@DisplayName("testGetMarket")
	@ParameterizedTest
	@CsvSource({ "KA,OK", "$$$,BAD_REQUEST" })
	void c(String marketCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("markets/" + marketCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testAddMarket")
	@ParameterizedTest
	@CsvSource({ "UNPROCESSABLE_ENTITY", "OK" })
	void b(String status) {
		MarketDto marketDto = new MarketDto();
		marketDto.setDescription(generateString(10));
		marketDto.setIsActive(false);
		if (status.equals("OK")) {
			marketDto.setMarketCode(generateString(4));
		}
		HttpEntity<MarketDto> entity = new HttpEntity<>(marketDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("markets"), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testUpdateMarket")
	@ParameterizedTest
	@CsvSource({ "KA,OK", "$$,BAD_REQUEST", ",UNPROCESSABLE_ENTITY", "KA,BAD_REQUEST" })
	void d(String marketCode, String status) {
		MarketUpdateDto marketUpdateDto = new MarketUpdateDto();
		if (status.equals("UNPROCESSABLE_ENTITY"))
			marketUpdateDto.setDescription("");
		else if (status.equals("BAD_REQUEST") && marketCode.equals("KA"))
			marketUpdateDto.setDescription("Karnataka Market");
		marketUpdateDto.setIsActive(true);
		HttpEntity<MarketUpdateDto> entity = new HttpEntity<>(marketUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("markets/" + marketCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testAddMarketMaterialMapppingConfig")
	@ParameterizedTest
	@CsvSource({ "KA1,OK", "$$$,BAD_REQUEST" })
	void e(String mrktCode, String status) {
		List<MarketMarkupFactors> materialList = new ArrayList<>();
		MarketMarkupMappingRequestDto marketMaterialDto = new MarketMarkupMappingRequestDto();
		String materialCodes = null;
		if (status.equals("OK")) {
			materialCodes = "JPL";
		} else {
			materialCodes = "ABC";
		}
		for (int i = 0; i < 3; i++) {
			MarketMarkupFactors marketMaterialFactors = new MarketMarkupFactors();
			marketMaterialFactors.setAddAmount(BigDecimal.valueOf(generateInteger(2)));
			marketMaterialFactors.setDeductAmount(BigDecimal.valueOf(generateInteger(2)));
			marketMaterialFactors.setMarkupFactor(BigDecimal.valueOf(generateInteger(2)));
			marketMaterialFactors.setMetalTypeCode(String.valueOf(materialCodes.charAt(i)));
			materialList.add(marketMaterialFactors);
		}
		marketMaterialDto.setMarketMarkupFactors(materialList);
		HttpEntity<MarketMarkupMappingRequestDto> entity = new HttpEntity<>(marketMaterialDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("markets/" + mrktCode + "/materials"),
				HttpMethod.POST, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testUpdateMarketMaterialMappingConfig")
	@ParameterizedTest
	@CsvSource({ "KA,OK", "$$,BAD_REQUEST" })
	void f(String marketCode, String status) {
		MarketMarkupMappingRequestDto marketUpdateDto = new MarketMarkupMappingRequestDto();
		List<MarketMarkupFactors> materialList = new ArrayList<>();
		MarketMarkupFactors marketMaterialFactors = new MarketMarkupFactors();
		marketMaterialFactors.setAddAmount(BigDecimal.valueOf(generateInteger(2)));
		marketMaterialFactors.setDeductAmount(BigDecimal.valueOf(generateInteger(2)));
		marketMaterialFactors.setMarkupFactor(BigDecimal.valueOf(generateInteger(2)));
		marketMaterialFactors.setMetalTypeCode(generateString(4));
		materialList.add(marketMaterialFactors);

		marketUpdateDto.setMarketMarkupFactors(materialList);
		HttpEntity<MarketMarkupMappingRequestDto> entity = new HttpEntity<>(marketUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("markets/" + marketCode + "/materials"), HttpMethod.PUT, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testListMarketMaterialMapping")
	@Test
	void g() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("markets/materials?isActive=true&isPageable=true"), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@DisplayName("testGetMarketMaterialMapping")
	@Test
	void h() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("markets/KA/materials"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
