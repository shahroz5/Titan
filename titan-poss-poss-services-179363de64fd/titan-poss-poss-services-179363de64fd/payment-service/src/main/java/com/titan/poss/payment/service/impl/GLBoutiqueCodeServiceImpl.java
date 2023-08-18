/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_GL_CODE_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.GLBoutiqueCodeDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.GLBoutiqueCodeDao;
import com.titan.poss.payment.dao.GLBoutiqueCodeMappingDao;
import com.titan.poss.payment.dao.PaymentDao;
import com.titan.poss.payment.dto.AddGLBoutiqueCode;
import com.titan.poss.payment.dto.UpdateGLBoutiqueCode;
import com.titan.poss.payment.dto.request.GLBoutiqueCodeMappingRequestDto;
import com.titan.poss.payment.dto.request.GLBoutiqueCodeUpdateDto;
import com.titan.poss.payment.dto.response.GLBoutiqueCodeMappingDto;
import com.titan.poss.payment.repository.GLBoutiqueCodeMappingRepository;
import com.titan.poss.payment.repository.GLBoutiqueCodeRepository;
import com.titan.poss.payment.service.GLBoutiqueCodeService;
import com.titan.poss.payment.service.PaymentCommonService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(PAYMENT_GL_CODE_SERVICE_IMPL)
public class GLBoutiqueCodeServiceImpl implements GLBoutiqueCodeService {

	@Autowired
	private GLBoutiqueCodeMappingRepository glCodeMappingRepository;

	@Autowired
	private GLBoutiqueCodeRepository glCodeRepository;

	@Autowired
	private PaymentCommonService paymentUtilService;

	/**
	 * This method will return the list of all gl_btq_codess based on the isActive.
	 *
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List < GLCodeDto>>
	 */
	@Override
	public PagedRestResponse<List<GLBoutiqueCodeDto>> listGLCodes(String locationCode, Boolean isActive, Pageable pageable) {

		/*
		 * GLBoutiqueCodeDao glCodeDao = new GLBoutiqueCodeDao();
		 * glCodeDao.setIsActive(isActive);
		 * 
		 * ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		 * Example<GLBoutiqueCodeDao> criteria = Example.of(glCodeDao, matcher);
		 */

		Page<GLBoutiqueCodeDao> glCodeDaoList = glCodeRepository.getResults(locationCode, isActive, pageable);
		List<GLBoutiqueCodeDto> glCodeDtoList = glCodeDaoList.stream().map(GLBoutiqueCodeServiceImpl::apply)
				.collect(Collectors.toList());

		return (new PagedRestResponse<>(glCodeDtoList, glCodeDaoList));
	}

	/**
	 * This method will return the GL Code based on the locationCode.
	 *
	 * @param locationCode
	 * @return GLCodeDto
	 */
	@Override
	public GLBoutiqueCodeDto getGLCode(String locationCode) {
		GLBoutiqueCodeDao glCodeDao = glCodeRepository.findByLocationCode(locationCode);

		if (glCodeDao == null)
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_LOCATION,
					PaymentConstants.ERR_PAY_011);

		return apply(glCodeDao);
	}

	/**
	 * This method will save the GLCode.
	 *
	 * @param glCodeDto
	 * @return GLCodeDto
	 */
	@Override
	@Transactional
	public GLBoutiqueCodeDto addGLCode(GLBoutiqueCodeDto glCodeDto) {

		GLBoutiqueCodeDao glCodeDao = glCodeRepository.findByLocationCode(glCodeDto.getLocationCode());

		if (glCodeDao != null)
			throw new ServiceException(PaymentConstants.CONFIGURATION_IS_ALREADY_PRESENT, PaymentConstants.ERR_PAY_012);

		glCodeDao = (GLBoutiqueCodeDao) MapperUtil.getObjectMapping(glCodeDto, new GLBoutiqueCodeDao());

		glCodeDao = glCodeRepository.save(glCodeDao);

		return apply(glCodeDao);
	}

	/**
	 * This method will update the GL Code.
	 *
	 * @param locationCode
	 * @param glCodeUpdateDto
	 * @return GLCodeDto
	 */
	@Override
	@Transactional
	public GLBoutiqueCodeDto updateGLCode(String locationCode, GLBoutiqueCodeUpdateDto glCodeUpdateDto) {

		GLBoutiqueCodeDao glCodeDao = glCodeRepository.findByLocationCode(locationCode);

		if (glCodeDao == null)
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_LOCATION,
					PaymentConstants.ERR_PAY_011);

		glCodeDao = (GLBoutiqueCodeDao) MapperUtil.getObjectMapping(glCodeUpdateDto, glCodeDao);

		glCodeDao = glCodeRepository.save(glCodeDao);

		return apply(glCodeDao);
	}

	public static GLBoutiqueCodeDto apply(GLBoutiqueCodeDao glCode) {
		return (GLBoutiqueCodeDto) MapperUtil.getObjectMapping(glCode, new GLBoutiqueCodeDto());
	}

	/**
	 * This method will get the list of gl_code for based on location Code and
	 * PaymentCode.
	 *
	 * @param locationCode
	 * @return ListResponse<GLCodeMappingDto>
	 */
	@Override
	public PagedRestResponse<List<GLBoutiqueCodeMappingDto>> getPaymentLocationMapping(List<String> locationCode,
			Pageable pageable) {

		List<GLBoutiqueCodeMappingDto> gLCodeMappingDtoList = new ArrayList<>();

		Page<GLBoutiqueCodeMappingDao> glCodeDaoList = null;

		if (locationCode == null || locationCode.isEmpty()) {
			glCodeDaoList = glCodeMappingRepository.findAll(pageable);
		} else {
			glCodeDaoList = glCodeMappingRepository.findByLocationCodeIn(locationCode, pageable);
		}

		glCodeDaoList.forEach(glCodeMappingDao -> {
			GLBoutiqueCodeMappingDto glCodeMappingDto = (GLBoutiqueCodeMappingDto) MapperUtil
					.getObjectMapping(glCodeMappingDao, new GLBoutiqueCodeMappingDto());
			glCodeMappingDto.setPaymentCode(glCodeMappingDao.getPayment().getPaymentCode());
			gLCodeMappingDtoList.add(glCodeMappingDto);
		});

		return (new PagedRestResponse<>(gLCodeMappingDtoList, glCodeDaoList));
	}

	/**
	 * This method will mapped the glCodes for multiple paymentCodes in multiple
	 * locations.
	 *
	 * @param glCodeMappingRequestDto
	 * @return ListResponse<GLCodeMappingRequestDto>
	 */
	@Override
	@Transactional
	public ListResponse<GLBoutiqueCodeMappingDto> updatePaymentLocationMapping(
			@Valid GLBoutiqueCodeMappingRequestDto glCodeMappingRequestDto) {

		List<GLBoutiqueCodeMappingDao> glCodeDaoMappingList = new ArrayList<>();
		List<GLBoutiqueCodeMappingDao> glCodeDaoMappingData = new ArrayList<>();
		List<GLBoutiqueCodeMappingDao> removeMappingList = new ArrayList<>();

		if (!glCodeMappingRequestDto.getRemoveLocations().isEmpty()) {
			List<GLBoutiqueCodeMappingDao> removeLocationMapping = glCodeMappingRepository
					.findByLocationCodeIn(glCodeMappingRequestDto.getRemoveLocations());
			removeMappingList.addAll(removeLocationMapping);
		}

		if (!glCodeMappingRequestDto.getRemovePaymentCodes().isEmpty()
				&& !glCodeMappingRequestDto.getAddLocations().isEmpty()) {
			List<GLBoutiqueCodeMappingDao> removePaymentCodes = glCodeMappingRepository
					.findByPaymentPaymentCodeInAndLocationCodeIn(glCodeMappingRequestDto.getRemovePaymentCodes(),
							glCodeMappingRequestDto.getAddLocations());
			removeMappingList.addAll(removePaymentCodes);
		}

		if (!glCodeMappingRequestDto.getUpdatePaymentCodes().isEmpty()) {

			List<String> idList = glCodeMappingRequestDto.getUpdatePaymentCodes().stream()
					.map(UpdateGLBoutiqueCode::getId).collect(Collectors.toList());

			List<GLBoutiqueCodeMappingDao> updateLocationMapping = glCodeMappingRepository.findByIdIn(idList);

			Map<String, GLBoutiqueCodeMappingDao> glCodeMappingUpdateMap = new HashMap<>();

			for (GLBoutiqueCodeMappingDao glCodeMappingDao : updateLocationMapping)
				glCodeMappingUpdateMap.put(glCodeMappingDao.getId(), glCodeMappingDao);

			glCodeMappingRequestDto.getUpdatePaymentCodes().forEach(updatePaymentCode -> {
				if (glCodeMappingUpdateMap.containsKey(updatePaymentCode.getId())) {
					GLBoutiqueCodeMappingDao glCodeMappingDao = glCodeMappingUpdateMap.get(updatePaymentCode.getId());
					if (updatePaymentCode.getGlCode() != null)
						glCodeMappingDao.setGlCode(updatePaymentCode.getGlCode());
					if (updatePaymentCode.getPaymentCode() != null) {
						PaymentDao payment = new PaymentDao();
						payment.setPaymentCode(updatePaymentCode.getPaymentCode());
						glCodeMappingDao.setPayment(payment);
					}
					glCodeDaoMappingList.add(glCodeMappingDao);
				}
			});
		}

		if (!glCodeMappingRequestDto.getAddPaymentCodes().isEmpty()
				&& !glCodeMappingRequestDto.getAddLocations().isEmpty()) {
			List<String> paymentCodesData = glCodeMappingRequestDto.getAddPaymentCodes().stream()
					.map(AddGLBoutiqueCode::getPaymentCode).collect(Collectors.toList());

			List<GLBoutiqueCodeMappingDao> updateGlCodeMapping = glCodeMappingRepository
					.findByPaymentPaymentCodeInAndLocationCodeIn(paymentCodesData,
							glCodeMappingRequestDto.getAddLocations());
			Map<String, GLBoutiqueCodeMappingDao> glCodeMappingMap = new HashMap<>();
			for (GLBoutiqueCodeMappingDao glCodeMappingDao : updateGlCodeMapping)
				glCodeMappingMap.put(glCodeMappingDao.getLocationCode().concat(PaymentConstants.PIPE)
						.concat(glCodeMappingDao.getPayment().getPaymentCode()), glCodeMappingDao);
			glCodeMappingRequestDto.getAddLocations().forEach(addLocation -> glCodeMappingRequestDto
					.getAddPaymentCodes().forEach(paymentCodes -> glCodeDaoMappingList
							.add(paymentUtilService.getGLCodeDaoMapping(addLocation, paymentCodes, glCodeMappingMap))));
		}

		if (!removeMappingList.isEmpty())
			glCodeMappingRepository.deleteAll(removeMappingList);
		if (!glCodeDaoMappingList.isEmpty())
			glCodeDaoMappingData = glCodeMappingRepository.saveAll(glCodeDaoMappingList);

		return new ListResponse<>(paymentUtilService.getGLDtoMapping(glCodeDaoMappingData));
	}
}