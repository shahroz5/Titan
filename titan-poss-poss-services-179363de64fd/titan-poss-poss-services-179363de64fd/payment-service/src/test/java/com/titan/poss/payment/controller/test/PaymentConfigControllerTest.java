
package com.titan.poss.payment.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.payment.PaymentBase;
import com.titan.poss.payment.dto.ConfigDetailDto;
import com.titan.poss.payment.dto.UpdateConfigDto;
import com.titan.poss.payment.dto.request.ConfigDetailsUpdate;
import com.titan.poss.payment.dto.request.ConfigRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@DisplayName("PaymentConfigControllerTest")
@ExtendWith(SpringExtension.class)
public class PaymentConfigControllerTest extends PaymentBase {

	private static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("Commercial", "welcome123"));
	}

	@Test
	void testListPayment() {

		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("payment-configs"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "1,OK", ",BAD_REQUEST" })
	void testGetPayment(Integer configId, String status) {

		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("payment-configs/" + configId),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void testaddPayment() {

		ConfigRequestDto configDto = new ConfigRequestDto();
		configDto.setDescription(generateString(4));
		configDto.setIsActive(true);

		HttpEntity<ConfigRequestDto> entity = new HttpEntity<>(configDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("payment-configs"), HttpMethod.POST,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK" })
	void testUpdatepayment(Integer configId, String status) {

		ConfigRequestDto paymentDto = new ConfigRequestDto();
		paymentDto.setDescription("Cash Payment");
		paymentDto.setIsActive(true);

		HttpEntity<ConfigRequestDto> entity = new HttpEntity<>(paymentDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("payment-configs/" + configId),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@Test
	void testListPaymentConfig() {

		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("payment-configs/1/details"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@Test
	void testUpdatepaymentConfig(Integer configId, String status) {

		ConfigDetailsUpdate configDetailsUpdate = new ConfigDetailsUpdate();

		Set<ConfigDetailDto> addConfigsList = new HashSet<>();
		ConfigDetailDto addConfigsDto = new ConfigDetailDto();

		addConfigsDto.setConfigDetails("");
		addConfigsDto.setPaymentCode(generateString(4));
		addConfigsDto.setTransactionType(generateString(2));
		addConfigsList.add(addConfigsDto);

		Set<UpdateConfigDto> updateConfigsList = new HashSet<>();
		UpdateConfigDto updateConfigsDto = new UpdateConfigDto();

		updateConfigsDto.setConfigDetailId("7EBDE549-BA29-47C1-9DAD-87C47FD95F46");
		updateConfigsDto.setConfigsDto(addConfigsDto);
		updateConfigsList.add(updateConfigsDto);

		Set<String> removeConfigsList = new HashSet<>();
		removeConfigsList.add("7EBDE549-BA29-47C1-9DAD-87C47FD95F45");

		configDetailsUpdate.setAddConfigs(addConfigsList);
		configDetailsUpdate.setRemoveConfigs(removeConfigsList);
		configDetailsUpdate.setUpdateConfigs(updateConfigsList);

		HttpEntity<ConfigDetailsUpdate> entity = new HttpEntity<>(configDetailsUpdate, headers);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("payment-configs/1/details" + configId), HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@Test
	void getMappedLocation() {

		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("payment-configs/locations"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@Test
	void getLocationCodes() {

		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("payment-configs/1/locations"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}



}
