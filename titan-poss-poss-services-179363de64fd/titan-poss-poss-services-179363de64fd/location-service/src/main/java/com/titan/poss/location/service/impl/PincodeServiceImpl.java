/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.PincodeDaoExt;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dto.PincodeSyncDtoExt;
import com.titan.poss.location.dto.request.PincodeCreateDto;
import com.titan.poss.location.dto.response.PincodeDto;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.repository.PincodeRepositoryExt;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.PincodeService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("pincodeService")
public class PincodeServiceImpl implements PincodeService {

	private static final String ERR_LOC_022 = "ERR-LOC-022";

	private static final String PINCODE_AND_COUNTRY_CODE_COMBINATION_ALREADY_EXISTS = "Pincode and country code combination already exists";

	private static final String ERR_LOC_019 = "ERR-LOC-019";

	private static final String NO_RECORD_FOUND_FOR_REQUESTED_ID = "Pincode and country code combination already exists";

	private static final String ERR_LOC_023 = "ERR-LOC-023";

	private static final String COUNTRY_CODE_CANNOT_BE_NULL = "Country code cannot be null";

	@Autowired
	private PincodeRepositoryExt pincodeRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private PincodeServiceImpl pincodeService;

	/**
	 * This method will return the list of pincode.
	 * 
	 * @param countryCode
	 * @param pincode
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PincodeDto>>
	 * 
	 */
	@Override
	public PagedRestResponse<List<PincodeDto>> listPincode(String countryCode, String pincode, Boolean isActive,
			Pageable pageable) {
		Example<PincodeDaoExt> criteria = listPincodeCriteria(countryCode, pincode, isActive);
		Page<PincodeDaoExt> pincodeList = pincodeRepository.findAll(criteria, pageable);

		List<PincodeDto> pincodeDtoList = new ArrayList<>();
		for (PincodeDaoExt pincode1 : pincodeList) {
			PincodeDto pincodeDto = (PincodeDto) MapperUtil.getObjectMapping(pincode1, new PincodeDto());
			getPincodeDepends(pincode1, pincodeDto);
			pincodeDtoList.add(pincodeDto);
		}

		return (new PagedRestResponse<>(pincodeDtoList, pincodeList));
	}

	private PincodeDto getPincodeDepends(PincodeDaoExt pincode1, PincodeDto pincodeDto) {
		if (pincode1.getCountry().getCountryCode() == null) {
			throw new ServiceException(COUNTRY_CODE_CANNOT_BE_NULL, ERR_LOC_023);
		}
		pincodeDto.setCountryCode(pincode1.getCountry().getCountryCode());
		return pincodeDto;
	}

	private Example<PincodeDaoExt> listPincodeCriteria(String countryCode, String pincode, Boolean isActive) {
		PincodeDaoExt pincode1 = new PincodeDaoExt();
		CountryDao country = new CountryDao();
		country.setCountryCode(countryCode);
		pincode1.setCountry(country);
		pincode1.setPinCode(pincode);
		pincode1.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(pincode1, matcher);
	}

	/**
	 * This method will return the pincode details.
	 * 
	 * @param id
	 * @return PincodeDto
	 */
	@Override
	public PincodeDto getPincode(String id) {
		PincodeDaoExt pincode = pincodeRepository.findOneById(id);
		if (pincode == null) {
			throw new ServiceException(NO_RECORD_FOUND_FOR_REQUESTED_ID, ERR_LOC_019);
		}
		PincodeDto pincodeDto = (PincodeDto) MapperUtil.getObjectMapping(pincode, new PincodeDto());
		getPincodeDepends(pincode, pincodeDto);
		return pincodeDto;
	}

	/**
	 * This method will save the Pincode details.
	 * 
	 * @param pincodeCreateDto
	 * @return PincodeDto
	 * 
	 */
	@Override
	public PincodeDto addPincode(PincodeCreateDto pincodeCreateDto) {
		PincodeDaoExt pincode = (PincodeDaoExt) MapperUtil.getObjectMapping(pincodeCreateDto, new PincodeDaoExt());
		addPincodeDepends(pincodeCreateDto, pincode);
		if (pincodeRepository.findByPinCodeAndCountry(pincodeCreateDto.getPinCode(), pincode.getCountry()) != null) {
			throw new ServiceException(PINCODE_AND_COUNTRY_CODE_COMBINATION_ALREADY_EXISTS, ERR_LOC_022);
		}
		
		pincode.setSrcSyncId(0);
		pincode.setDestSyncId(0);

		SyncStagingDto data = pincodeService.savePincodeToDB(pincode, LocationOperationCodes.PINCODE_ADD);

		// Publishing to Data Sync Queue
		syncDataService.publishLocationMessagesToQueue(data);

		PincodeDto pincodeDto = (PincodeDto) MapperUtil.getObjectMapping(pincode, new PincodeDto());
		pincodeDto.setCountryCode(pincodeCreateDto.getCountryCode());
		return pincodeDto;
	}

	/**
	 * @param pincode
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto savePincodeToDB(PincodeDaoExt pincode, String operation) {
		// saving pincode
		PincodeDaoExt savedPincode = pincodeRepository.save(pincode);
		// converting to required json string
		List<SyncData> pincodeSyncData = new ArrayList<>();
		PincodeSyncDtoExt pincodeSyncDto = new PincodeSyncDtoExt(savedPincode);
		pincodeSyncData.add(DataSyncUtil.createSyncData(pincodeSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest pincodeMsgRequest = DataSyncUtil.createMessageRequest(pincodeSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(pincodeMsgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(pincodeMsgRequest);
		// saving to staging table
		SyncStaging pincodeStagingMsg = new SyncStaging();
		pincodeStagingMsg.setMessage(requestBody);
		pincodeStagingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		pincodeStagingMsg = locationSyncStagingRepository.save(pincodeStagingMsg);
		syncStagingDto.setId(pincodeStagingMsg.getId());
		return syncStagingDto;
	}


	private PincodeDaoExt addPincodeDepends(PincodeCreateDto pincodeCreateDto, PincodeDaoExt pincode) {
		if (pincodeCreateDto.getCountryCode() == null || pincodeCreateDto.getCountryCode().length() == 0) {
			throw new ServiceException(COUNTRY_CODE_CANNOT_BE_NULL, ERR_LOC_023);
		}
		CountryDao country = new CountryDao();
		country.setCountryCode(pincodeCreateDto.getCountryCode());
		pincode.setCountry(country);
		return pincode;
	}

	/**
	 * This method will update the pincode details.
	 * 
	 * @param pincodeCreateDto
	 * @param id
	 * @return PincodeDto
	 * 
	 */
	@Override
	public PincodeDto updatePincode(String id, PincodeCreateDto pincodeCreateDto) {

		PincodeDaoExt pincode = pincodeRepository.findOneById(id);
		if (pincode == null) {
			throw new ServiceException(NO_RECORD_FOUND_FOR_REQUESTED_ID, ERR_LOC_019);
		}
		pincode = (PincodeDaoExt) MapperUtil.getObjectMapping(pincodeCreateDto, pincode);
		addPincodeDepends(pincodeCreateDto, pincode);
		pincode.setSrcSyncId(pincode.getSrcSyncId() + 1);
		SyncStagingDto data = pincodeService.savePincodeToDB(pincode, LocationOperationCodes.PINCODE_UPDATE);
		// Publishing to Data Sync Queue
		syncDataService.publishLocationMessagesToQueue(data);
		PincodeDto pincodeDto = (PincodeDto) MapperUtil.getObjectMapping(pincode, new PincodeDto());
		getPincodeDepends(pincode, pincodeDto);
		return pincodeDto;

	}

}
