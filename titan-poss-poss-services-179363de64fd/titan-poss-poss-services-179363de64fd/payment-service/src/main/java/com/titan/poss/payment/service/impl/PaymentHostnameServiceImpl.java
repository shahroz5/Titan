/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.PaymentHostnameMappingDao;
import com.titan.poss.payment.dto.PaymentHostnameUpdateDto;
import com.titan.poss.payment.dto.response.PaymentHostnameResponseDto;
import com.titan.poss.payment.repository.PaymentHostnameMappingRepository;
import com.titan.poss.payment.service.PaymentHostnameService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(PaymentConstants.PAYMENT_HOSTNAME_SERVICE_IMPL)
public class PaymentHostnameServiceImpl implements PaymentHostnameService {

	@Autowired
	private PaymentHostnameMappingRepository paymentHostnameMappingRepository;

	@Override
	public PagedRestResponse<List<PaymentHostnameResponseDto>> listPaymentHostnames(String paymentCode,
			String locationCode,Boolean isActive, Pageable pageable) {
		List<PaymentHostnameResponseDto> paymentHostnameDtoList = new ArrayList<>();
		/*
		 * PaymentHostnameMappingDao payment = new PaymentHostnameMappingDao();
		 * payment.setPaymentCode(paymentCode); payment.setLocationCode(locationCode);
		 * ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		 * Example<PaymentHostnameMappingDao> criteria = Example.of(payment, matcher);
		 */
		Page<PaymentHostnameMappingDao> paymentHostnamePage = paymentHostnameMappingRepository.findLocation(paymentCode,
				locationCode,isActive,pageable);
		paymentHostnamePage.forEach(record -> {
			PaymentHostnameResponseDto paymentHostnameResponseDto = (PaymentHostnameResponseDto) MapperUtil
					.getDtoMapping(record, PaymentHostnameResponseDto.class);
			paymentHostnameResponseDto.setIsActive(record.getIsActive());
			paymentHostnameDtoList.add(paymentHostnameResponseDto);
		});
		return new PagedRestResponse<>(paymentHostnameDtoList, paymentHostnamePage);
	}

	@Override
	@Transactional
	public PaymentHostnameUpdateDto updatePaymentHostname(PaymentHostnameUpdateDto paymentHostnameUpdateDto) {
		List<PaymentHostnameMappingDao> paymentHostnameMappingList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(paymentHostnameUpdateDto.getPaymentHostnamesDetails())) {
			paymentHostnameUpdateDto.getPaymentHostnamesDetails().forEach(records -> {
				PaymentHostnameMappingDao paymentHostNameMappingDao = paymentHostnameMappingRepository
						.findById(records.getId())
						.orElseThrow(() -> new ServiceException(
								PaymentConstants.NO_PAYMENT_HOSTNAME_FOUND_FOR_REQUESTED_ID + ": " + records.getId(),
								PaymentConstants.ERR_PAY_015));
				paymentHostNameMappingDao.setIsActive(records.getIsActive());
				paymentHostNameMappingDao.setDeviceId(records.getDeviceId());
				paymentHostnameMappingList.add(paymentHostNameMappingDao);
			});
			paymentHostnameMappingRepository.saveAll(paymentHostnameMappingList);
		}
		return paymentHostnameUpdateDto;
	}
}
