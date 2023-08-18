/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.ContextTypeEnum;
import com.titan.poss.core.dto.GhsOfflineEODRequestDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.PasswordHashUtil;
import com.titan.poss.sales.dao.StorePasswordsDao;
import com.titan.poss.sales.dto.request.StorePasswordRequestDto;
import com.titan.poss.sales.dto.response.StorePasswordResponseDto;
import com.titan.poss.sales.repository.StorePasswordsRepository;
import com.titan.poss.sales.service.StorePasswordService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class StorePasswordServiceImpl implements StorePasswordService {

	@Autowired
	private StorePasswordsRepository storePasswordRepo;

	@Autowired
	private BusinessDayServiceImpl businessDayService;

	/**
	 * @param storePasswordDto
	 * @return StorePasswordResponseDto
	 */
	@Override
	public StorePasswordResponseDto generateStorePassword(StorePasswordRequestDto storePasswordDto) {

		businessDayService.validateBODBusinessDay(storePasswordDto.getBusinessDate());

		String locationCode = CommonUtil.getLocationCode();

		StorePasswordsDao storePasswordDao = storePasswordRepo.findByPasswordDateAndLocationCodeAndContextType(
				storePasswordDto.getBusinessDate(), locationCode, ContextTypeEnum.GHS_OFFLINE_BOD.name());

		if (storePasswordDao != null)
			throw new ServiceException("Password already generated for the business date","ERR-SALE-245");

		String password = PasswordHashUtil.getGhsOfflinePasswordBod(CommonUtil.getLocationCode(), storePasswordDto.getBusinessDate(),
				storePasswordDto.getGoldRate());

		StorePasswordsDao storePassword = new StorePasswordsDao();
		storePassword.setContextType(ContextTypeEnum.GHS_OFFLINE_BOD.name());
		storePassword.setFiscalYear(businessDayService.getFiscalYear(locationCode).shortValue());
		storePassword.setLocationCode(locationCode);
		storePassword.setPassword(password);
		storePassword.setPasswordDate(storePasswordDto.getBusinessDate());
		storePassword.setPasswordDetails(
				MapperUtil.getJsonString(new JsonData(ContextTypeEnum.GHS_OFFLINE_BOD.name(), storePasswordDto)));

		storePassword = storePasswordRepo.save(storePassword);

		StorePasswordResponseDto storeResponse = (StorePasswordResponseDto) MapperUtil.getObjectMapping(storePassword,
				new StorePasswordResponseDto());
		storeResponse.setGoldRate(storePasswordDto.getGoldRate());

		businessDayService.updateGHSFlag(storePasswordDto.getBusinessDate());

		return storeResponse;
	}

	/**
	 * 
	 * @param password
	 * @param ghsOfflineEOD
	 */
	public void savePasswordForGHSOfflineEOD(String password, GhsOfflineEODRequestDto ghsOfflineEOD) {

		StorePasswordsDao storePassword = new StorePasswordsDao();

		storePassword.setContextType(ContextTypeEnum.GHS_OFFLINE_EOD.name());
		storePassword.setFiscalYear(businessDayService.getFiscalYear(ghsOfflineEOD.getLocationCode()).shortValue());
		storePassword.setLocationCode(ghsOfflineEOD.getLocationCode());
		storePassword.setPassword(password);
		storePassword.setPasswordDate(ghsOfflineEOD.getBusinessDate());
		storePassword.setPasswordDetails(
				MapperUtil.getJsonString(new JsonData(ContextTypeEnum.GHS_OFFLINE_EOD.name(), ghsOfflineEOD)));

		storePasswordRepo.save(storePassword);

	}

	/**
	 * @param contextType
	 * @param businessDate
	 * @param pageable
	 * @param isPageable
	 * @return PagedRestResponse<List<StorePasswordResponseDto>>
	 * 
	 */
	@Override
	public PagedRestResponse<List<StorePasswordResponseDto>> listStorePassword(String contextType, Date businessDate,
			Pageable pageable, Boolean isPageable) {

		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}

		StorePasswordsDao storePasswordsDao = new StorePasswordsDao();
		storePasswordsDao.setContextType(contextType);
		storePasswordsDao.setPasswordDate(businessDate);
		storePasswordsDao.setLocationCode(CommonUtil.getLocationCode());

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StorePasswordsDao> criteria = Example.of(storePasswordsDao, matcher);

		Page<StorePasswordsDao> storePasswordList = storePasswordRepo.findAll(criteria, pageable);

		List<StorePasswordResponseDto> storePasswordDtoList = new ArrayList<>();

		storePasswordList.forEach(storePassword -> {

			StorePasswordResponseDto storeResponse = (StorePasswordResponseDto) MapperUtil
					.getObjectMapping(storePassword, new StorePasswordResponseDto());

			if (storePassword.getPasswordDetails() != null)
				storeResponse.setGoldRate(getGoldRate(storePassword.getPasswordDetails()));

			storePasswordDtoList.add(storeResponse);
		});

		return (new PagedRestResponse<>(storePasswordDtoList, storePasswordList));
	}

	/**
	 * 
	 * @param passwordDetails
	 * @return BigDecimal
	 */
	private BigDecimal getGoldRate(String passwordDetails) {

		return MapperUtil.mapObjToClass(MapperUtil.mapObjToClass(passwordDetails, JsonData.class).getData(),
				StorePasswordRequestDto.class).getGoldRate();
	}

}
