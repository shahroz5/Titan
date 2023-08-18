/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.PaymentDao;
import com.titan.poss.payment.dto.PaymentSyncDto;
import com.titan.poss.payment.dto.request.PaymentAddDto;
import com.titan.poss.payment.dto.request.PaymentUpdateDto;
import com.titan.poss.payment.dto.response.PaymentDto;
import com.titan.poss.payment.dto.response.PaymentLiteDto;
import com.titan.poss.payment.repository.PaymentRepository;
import com.titan.poss.payment.service.PaymentCommonService;
import com.titan.poss.payment.service.PaymentService;
import com.titan.poss.payment.util.PaymentCommonUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYMENT_SERVICE_IMPL)
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	PaymentCommonService paymentUtilService;

	@Autowired
	private PaymentSyncDataServiceImpl syncDataService;

	@Autowired
	private PaymentServiceImpl paymentService;

	@Autowired
	private PaymentCommonUtil commonUtil;

	/**
	 * This method will return the list of Payment modes based on the isActive.
	 *
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List < PaymentDto>>
	 */
	@Override
	public PagedRestResponse<List<PaymentDto>> listPayment(Boolean isActive, Pageable pageable) {

		PaymentDao paymentCriteria = new PaymentDao();
		paymentCriteria.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PaymentDao> criteria = Example.of(paymentCriteria, matcher);

		Page<PaymentDao> paymentList = paymentRepository.findAll(criteria, pageable);

		List<PaymentDto> paymentDtoList = new ArrayList<>();

		paymentList.forEach(payment -> {
			PaymentDto paymentDto = (PaymentDto) MapperUtil.getObjectMapping(payment, new PaymentDto());
			if (payment.getFieldDetails() != null)
				paymentDto.setFields(commonUtil.getFieldDetails(payment.getFieldDetails()));
			paymentDtoList.add(paymentDto);
		});

		return (new PagedRestResponse<>(paymentDtoList, paymentList));
	}

	/**
	 * This method will return the Payment Code based on the paymentCode.
	 *
	 * @param paymentCode
	 * @return PaymentDto
	 */
	@Override
	public PaymentDto getPayment(String paymentCode) {

		PaymentDao paymentDao = paymentRepository.findOneByPaymentCode(paymentCode);

		if (paymentDao == null)
			throw new ServiceException(PaymentConstants.NO_PAYMENT_FOUND_FOR_THE_REQUESTED_PAYMENT_CODE,
					PaymentConstants.ERR_PAY_001);

		PaymentDto paymentDto = (PaymentDto) MapperUtil.getObjectMapping(paymentDao, new PaymentDto());

		if (paymentDao.getFieldDetails() != null)
			paymentDto.setFields(commonUtil.getFieldDetails(paymentDao.getFieldDetails()));

		return paymentDto;
	}

	/**
	 * This method will save the Item details.
	 *
	 * @param paymentDto
	 * @param paymentGroup
	 * @return PaymentDto
	 */
	@Override
	public PaymentDto addPayment(PaymentAddDto paymentDto, String paymentGroup) {

		PaymentDao paymentDao = paymentRepository.findOneByPaymentCode(paymentDto.getPaymentCode());

		if (paymentDao != null)
			throw new ServiceException(PaymentConstants.PAYMENT_CODE_IS_ALREADY_AVAILABLE,
					PaymentConstants.ERR_PAY_002);

		paymentDao = (PaymentDao) MapperUtil.getObjectMapping(paymentDto, new PaymentDao());
		paymentDao.setPaymentGroup(paymentGroup);
		paymentDao.setFieldDetails(MapperUtil.getJsonString(paymentDto.getFieldDetails()));
		paymentDao.setSrcSyncId(0);
		paymentDao.setDestSyncId(0);
		paymentDao.setIsEditable(Boolean.TRUE);

		// set oracle mapping - for this all whitespace should be removed.
		paymentDao.setOracleMapping(paymentDto.getPaymentCode().replaceAll("\\s", ""));

		Map<String, SyncStagingDto> syncStagingDto = paymentService.savePayment(paymentDao,
				PaymentOperationCodes.PAYMENT_ADD, true);
		syncDataService.publishPaymentMessages(syncStagingDto);
		PaymentDto paymentResponseDto = (PaymentDto) MapperUtil.getObjectMapping(paymentDao, new PaymentDto());
		if (paymentDao.getFieldDetails() != null)
			paymentResponseDto.setFields(commonUtil.getFieldDetails(paymentDao.getFieldDetails()));

		return paymentResponseDto;
	}

	/**
	 * @param paymentDao
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public Map<String, SyncStagingDto> savePayment(PaymentDao paymentDao, String operation, boolean isPublishToEGHS) {
		paymentDao = paymentRepository.save(paymentDao);
		PaymentSyncDto paymentSyncDto = new PaymentSyncDto(paymentDao);
		List<SyncData> syncDataList = new ArrayList<>();
		syncDataList.add(DataSyncUtil.createSyncData(paymentSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getPaymentSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * This method will update the Payment modes.
	 *
	 * @param paymentCode
	 * @param paymentUpdateDto
	 * @param paymentGroup
	 * @return PaymentDto
	 */
	@Override
	public PaymentDto updatePayment(String paymentCode, PaymentUpdateDto paymentUpdateDto, String paymentGroup) {

		PaymentDao paymentDao = paymentRepository.findOneByPaymentCode(paymentCode);

		if (paymentDao == null)
			throw new ServiceException(PaymentConstants.NO_PAYMENT_FOUND_FOR_THE_REQUESTED_PAYMENT_CODE,
					PaymentConstants.ERR_PAY_001);

		if (!BooleanUtils.isTrue(paymentDao.getIsEditable())) {
			throw new ServiceException("This Type of Payment Code is not Editable", "ERR-PAY-026");
		}

		if (paymentUpdateDto.getFieldDetails() != null) {
			String fieldDetails = MapperUtil.getJsonString(paymentUpdateDto.getFieldDetails());
			paymentDao.setFieldDetails(fieldDetails);
		}

		paymentDao = (PaymentDao) MapperUtil.getObjectMapping(paymentUpdateDto, paymentDao);
		paymentDao.setPaymentGroup(paymentGroup);
		paymentDao.setSrcSyncId(paymentDao.getSrcSyncId() + 1);
		Map<String, SyncStagingDto> syncStagingDto = paymentService.savePayment(paymentDao,
				PaymentOperationCodes.PAYMENT_UPDATE, true);
		syncDataService.publishPaymentMessages(syncStagingDto);
		PaymentDto paymentDto = (PaymentDto) MapperUtil.getObjectMapping(paymentDao, new PaymentDto());
		if (paymentDao.getFieldDetails() != null)
			paymentDto.setFields(commonUtil.getFieldDetails(paymentDao.getFieldDetails()));

		return paymentDto;
	}

	/**
	 * @param paymentCode
	 * @param isPageable
	 * @param pageable
	 * @return {@link PaymentLiteDto}
	 */
	@Override
	public PagedRestResponse<List<PaymentLiteDto>> listPaymentCode(String paymentCode, Boolean isPageable,
			Pageable pageable) {

		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}

		PaymentDao paymentCriteria = new PaymentDao();
		paymentCriteria.setIsActive(Boolean.TRUE);
		paymentCriteria.setPaymentCode(paymentCode);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PaymentDao> criteria = Example.of(paymentCriteria, matcher);

		Page<PaymentDao> paymentList = paymentRepository.findAll(criteria, pageable);

		List<PaymentLiteDto> paymentDtoList = new ArrayList<>();

		for (PaymentDao payment : paymentList) {
			PaymentLiteDto paymentLiteDto = (PaymentLiteDto) MapperUtil.getObjectMapping(payment, new PaymentLiteDto());
			paymentDtoList.add(paymentLiteDto);
		}

		return (new PagedRestResponse<>(paymentDtoList, paymentList));
	}

}
