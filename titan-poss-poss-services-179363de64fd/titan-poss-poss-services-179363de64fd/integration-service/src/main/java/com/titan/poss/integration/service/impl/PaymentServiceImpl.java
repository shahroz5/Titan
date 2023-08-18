/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.PaymentService;
import com.titan.poss.integration.service.factory.PaymentFactory;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Service("IntegrationPaymentService")
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private PaymentFactory paymentfactory;

	@Override
	public PaymentCreateResponseDto createPayment(String vendorCode, String paymentId,
			PaymentRequestDto airpayCreateRequestDto) {
		validateVendor(vendorCode);
		PaymentService paymentService = paymentfactory.getPaymentService(vendorCode);
		return paymentService.createPayment(vendorCode, paymentId, airpayCreateRequestDto);
	}

	@Override
	public PaymentVerifyResponseDto verifyPaymentStatus(String vendorCode, String transactionId) {
		validateVendor(vendorCode);
		PaymentService paymentService = paymentfactory.getPaymentService(vendorCode);
		return paymentService.verifyPaymentStatus(vendorCode, transactionId);
	}

	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		boolean isActive = vendor.getIsActive();
		if (!isActive) {
			throw new ServiceException("Vendor is not active", "ERR-INT-017");
		}
		return vendor;
	}

	@Override
	public boolean resendPaymentRequest(String vendorCode, String transactionId, String notifyBy) {
		validateVendor(vendorCode);
		PaymentService paymentService = paymentfactory.getPaymentService(vendorCode);
		return paymentService.resendPaymentRequest(vendorCode, transactionId, notifyBy);
	}
}
