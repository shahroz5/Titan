package com.titan.poss.location.controller.test;

import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.enums.CustomerTaxTypeEnum;
import com.titan.poss.core.enums.DestLocationTaxTypeEnum;
import com.titan.poss.core.enums.SrcLocationTaxTypeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.location.dto.request.TaxConfigsCreateDto;
import com.titan.poss.location.dto.request.TaxConfigsUpdateDto;
import com.titan.poss.location.test.LocationBase;

class TaxConfigsControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListTaxConfigs() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("tax-configs"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "00,BAD_REQUEST" })
	void testGetTaxConfigs(Integer id, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("tax-configs/" + id), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY" })
	void testAddTaxConfigs(String status) {
		TaxConfigsCreateDto taxConfigsCreateDto = new TaxConfigsCreateDto();
		if (status.equals("OK")) {
			taxConfigsCreateDto.setIsActive(true);
			taxConfigsCreateDto.setApplicableTax("SGST/CGST");
			taxConfigsCreateDto.setCustomerTaxType(CustomerTaxTypeEnum.REGISTERED.toString());
			taxConfigsCreateDto.setDestLocationTaxType(DestLocationTaxTypeEnum.L2.toString());
			taxConfigsCreateDto.setIsSameState(true);
			taxConfigsCreateDto.setSrcLocationTaxType(SrcLocationTaxTypeEnum.L3.toString());
			taxConfigsCreateDto.setSrcTaxApplicable(true);
			taxConfigsCreateDto.setTxnType(TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.toString());
		} else
			taxConfigsCreateDto.setApplicableTax("as");
		HttpEntity<TaxConfigsCreateDto> entity = new HttpEntity<>(taxConfigsCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("tax-configs"), HttpMethod.POST,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "1,UNPROCESSABLE_ENTITY", "00,BAD_REQUEST" })
	void testUpdateTaxConfigs(String id,String status) {
		TaxConfigsUpdateDto taxConfigsUpdateDto = new TaxConfigsUpdateDto();
		taxConfigsUpdateDto.setIsActive(false);
		if (status.equals("UNPROCESSABLE_ENTITY"))
			taxConfigsUpdateDto.setApplicableTax("as");
		HttpEntity<TaxConfigsUpdateDto> entity = new HttpEntity<>(taxConfigsUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("tax-configs/" + id),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
