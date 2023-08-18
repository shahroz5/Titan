/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.controller.test;

import static org.junit.Assert.assertTrue;

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

import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.payment.PaymentBase;
import com.titan.poss.payment.dto.response.PaymentDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@DisplayName("PaymentControllerTest")
@ExtendWith(SpringExtension.class)
public class PaymentControllerTest extends PaymentBase {

	private static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("Commercial", "welcome123"));
	}

	@Test
	void testListPayment() {

		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("payment-mode"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "CASH,OK", "$#,BAD_REQUEST" })
	void testGetPayment(String paymentCode, String status) {

		HttpEntity<String> entity = new HttpEntity<>(null, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("payment-code/" + paymentCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "CASHPAYMENT,OK", ",UNPROCESSABLE_ENTITY", ",BAD_REQUEST" })
	void testaddPayment(String paymentCode, String status) {

		PaymentDto paymentDto = new PaymentDto();
		paymentDto.setPaymentCode(generateString(4).toUpperCase());
		paymentDto.setDescription(generateString(4));
		paymentDto.setIsActive(true);

		HttpEntity<PaymentDto> entity = new HttpEntity<>(paymentDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("payment-code?paymentGroup=" + PaymentGroupEnum.REGULAR), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$#,BAD_REQUEST", "CASH,OK" })
	void testUpdatepayment(String payment, String status) {

		PaymentDto paymentDto = new PaymentDto();
		paymentDto.setDescription(generateString(4).toUpperCase());
		paymentDto.setIsActive(true);

		HttpEntity<PaymentDto> entity = new HttpEntity<>(paymentDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("payment-code/" + payment + "?paymentGroup=" + PaymentGroupEnum.REGULAR),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}
}
