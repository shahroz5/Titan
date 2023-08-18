/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.LocationLovDaoExt;
import com.titan.poss.location.dto.LocationLovSyncDtoExt;
import com.titan.poss.location.dto.LovCreateDto;
import com.titan.poss.location.dto.constants.LovTypeEnum;
import com.titan.poss.location.dto.request.LovUpdateDto;
import com.titan.poss.location.dto.response.LovTypesDto;
import com.titan.poss.location.repository.LovRepositoryExt;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.LovService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("LocationLovService")
public class LovServiceImpl implements LovService {

	private static final String ERR_LOC_016 = "ERR-LOC-016";

	private static final String LOVTYPE_AND_CODE_IS_ALREADY_AVAILABLE = "LovType and code is already available";

	@Autowired
	private LovRepositoryExt lovRepository;

	@Autowired
	private LovServiceImpl lovServiceImp;

	@Autowired
	private LocationSyncDataService syncDataService;

	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@Override
	public LovTypesDto getLocationLovTypes() {

		LovTypeEnum[] lovTypeEnumList = LovTypeEnum.values();

		List<String> lovTypes = new ArrayList<>();

		for (LovTypeEnum lovTypeEnum : lovTypeEnumList) {

			lovTypes.add(lovTypeEnum.toString());

		}

		LovTypesDto lovTypesDto = new LovTypesDto();

		lovTypesDto.setLovTypes(lovTypes);

		return lovTypesDto;

	}

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@Override
	public LovDto getLocationLov(String lovType, Boolean isActive) {
		List<LocationLovDaoExt> locationLovList =null;
		if (isActive == null) {
			locationLovList = lovRepository.findByLovType(lovType);
		} else {
			locationLovList = lovRepository.findByLovTypeAndIsActive(lovType, isActive);
		}
		LovDto lovDto = new LovDto();

		lovDto.setLovType(lovType);

		if (!locationLovList.isEmpty()) {

			List<KeyValueDto> keyValueDtoList = new ArrayList<>();

			locationLovList.forEach(locationLov -> keyValueDtoList
					.add((KeyValueDto) MapperUtil.getObjectMapping(locationLov, new KeyValueDto())));

			lovDto.setResults(keyValueDtoList);

		} else {

			lovDto.setResults(new ArrayList<KeyValueDto>());

		}

		return lovDto;
	}

	/**
	 * This method will create the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	@Override
	public LovCreateDto createLov(LovCreateDto lovCreateDto) {

		if (lovCreateDto.getLovType().equalsIgnoreCase(LovTypeEnum.TAXTRANSACTIONTYPE.name())) {
			throw new ServiceException("Cannot create the new data for the lovType", "ERR-LOC-072");
		}

		LocationLovDaoExt locLovCriteria = new LocationLovDaoExt();
		locLovCriteria.setLovType(lovCreateDto.getLovType());
		locLovCriteria.setCode(lovCreateDto.getCode());

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<LocationLovDaoExt> criteria = Example.of(locLovCriteria, matcher);

		Optional<LocationLovDaoExt> locLovOpt = lovRepository.findOne(criteria);

		if (!locLovOpt.isEmpty()) {

			throw new ServiceException(LOVTYPE_AND_CODE_IS_ALREADY_AVAILABLE, ERR_LOC_016);

		}

		LocationLovDaoExt locLov = (LocationLovDaoExt) MapperUtil.getObjectMapping(lovCreateDto,
				new LocationLovDaoExt());

		locLov.setLovType(lovCreateDto.getLovType());
		locLov.setIsActive(true);

		List<LocationLovDaoExt> locLovList = new ArrayList<>();
		locLovList.add(locLov);
		Map<String, SyncStagingDto> syncStagingDto = lovServiceImp.saveLocationLovAndStaging(locLovList,
				LocationOperationCodes.LOCATION_LOV_ADD);

		syncDataService.publishLocationMessages(syncStagingDto);

		return lovCreateDto;

	}

	/**
	 * @param locLovList
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveLocationLovAndStaging(List<LocationLovDaoExt> locLovList, String operation) {
		locLovList = lovRepository.saveAll(locLovList);
		List<SyncData> locLovSyncData = new ArrayList<>();
		LocationLovSyncDtoExt syncDto = new LocationLovSyncDtoExt();
		locLovSyncData.add(DataSyncUtil.createSyncData(syncDto.getDtoExts(locLovList), 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getLocationSyncStagingMap(locLovSyncData, operation, destinations, true,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * This method will update the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	@Override
	public LovDto updateLov(String lovType, LovUpdateDto lovUpdateDto) {

		if (lovType.equalsIgnoreCase(LovTypeEnum.TAXTRANSACTIONTYPE.name())) {
			throw new ServiceException("Cannot create the new data for the lovType", "ERR-LOC-072");
		}

		List<LocationLovDaoExt> locationLovList = lovRepository.findByLovType(lovType);

		int size = locationLovList.size();

		List<KeyValueDto> keyValueDtoList = lovUpdateDto.getValues();

		int sizeDto = keyValueDtoList.size();

		for (int i = 0; i < sizeDto; i++) {

			Integer index = null;

			for (int j = 0; j < size; j++) {

				if (locationLovList.get(j).getCode().equalsIgnoreCase(keyValueDtoList.get(i).getCode())) {

					index = j;
					break;

				}

			}

			if (index != null) {

				LocationLovDaoExt locationLov = locationLovList.get(index);

				locationLov.setValue(keyValueDtoList.get(i).getValue());
				locationLov.setIsActive(keyValueDtoList.get(i).getIsActive());
				locationLov.setSrcSyncId(locationLov.getSrcSyncId() + 1);
				locationLovList.set(index, locationLov);

			} else {

				LocationLovDaoExt locationLov = new LocationLovDaoExt();
				locationLov.setLovType(lovType);
				locationLov.setCode(keyValueDtoList.get(i).getCode());
				locationLov.setValue(keyValueDtoList.get(i).getValue());
				locationLov.setIsActive(keyValueDtoList.get(i).getIsActive());
				locationLovList.add(locationLov);

			}

		}

		Map<String, SyncStagingDto> syncStagingDto = lovServiceImp.saveLocationLovAndStaging(locationLovList,
				LocationOperationCodes.LOCATION_LOV_UPDATE);

		syncDataService.publishLocationMessages(syncStagingDto);
		LovDto lovDto = new LovDto();

		lovDto.setLovType(lovType);

		if (!locationLovList.isEmpty()) {

			List<KeyValueDto> keyValueDtoResList = new ArrayList<>();

			locationLovList.forEach(locationLov -> keyValueDtoResList
					.add((KeyValueDto) MapperUtil.getObjectMapping(locationLov, new KeyValueDto())));

			lovDto.setResults(keyValueDtoResList);

		} else {

			lovDto.setResults(new ArrayList<KeyValueDto>());

		}

		return lovDto;

	}
}
