package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

import java.math.BigDecimal;

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
import com.titan.poss.product.dto.StoneDto;

public class StoneControllerTest extends ProductBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("Commercial", "welcome123"));
	}

	@Test
	void testListStone() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stones"), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "20DIRHPTG002,OK", "$,BAD_REQUEST" })
	void testGetStone(String stone, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stones/" + stone), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "20DIRHPTG002,BAD_REQUEST", ",UNPROCESSABLE_ENTITY", ",OK" })
	void testaddStone(String stone, String status) {
		StoneDto stoneDto = new StoneDto();
		stoneDto.setColor("dark red");
//		stoneDto.setConfigDetails("");
		stoneDto.setIsActive(false);
		stoneDto.setQuality("testing");
		stoneDto.setRatePerCarat(BigDecimal.valueOf(0));
		stoneDto.setShape("unit");
		stoneDto.setStdValue(BigDecimal.valueOf(0));
		stoneDto.setStdWeight(BigDecimal.valueOf(0));
		if (StringUtils.isBlank(stone) && status.equals("OK"))
			stoneDto.setStoneCode(generateInteger(4).toString());
		else
			stoneDto.setStoneCode(stone);
		stoneDto.setStoneTypeCode("DU");
		HttpEntity<StoneDto> entity = new HttpEntity<>(stoneDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stones"), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$1,BAD_REQUEST", "20DIRHPTG002,OK" })
	void testUpdateStone(String stone, String status) {
		StoneDto stoneDto = new StoneDto();
		stoneDto.setColor("blue");
		stoneDto.setIsActive(false);
		stoneDto.setQuality("test");
		stoneDto.setShape("Button");
		stoneDto.setStdValue(BigDecimal.valueOf(98765));
		stoneDto.setStdWeight(BigDecimal.valueOf(25));
		stoneDto.setStoneTypeCode("DU");

		HttpEntity<StoneDto> entity = new HttpEntity<>(stoneDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("stones/" + stone), HttpMethod.PUT,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

}
