/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.StateDaoExt;
import com.titan.poss.location.dto.StateSyncDtoExt;
import com.titan.poss.location.dto.request.StateCreateDto;
import com.titan.poss.location.dto.request.StateUpdateDto;
import com.titan.poss.location.dto.response.StateDto;
import com.titan.poss.location.dto.response.StateLiteDto;
import com.titan.poss.location.repository.StateRepositoryExt;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.StateService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("stateService")
public class StateServiceImpl implements StateService {

	private static final String ERR_LOC_004 = "ERR-LOC-004";

	private static final String NO_STATE_DETAILS_FOUND_FOR_THE_REQUESTED_STATECODE = "No State details found for the requested stateCode";

	private static final String ERR_LOC_034 = "ERR-LOC-034";

	private static final String DESCRIPTION_ALREADY_EXISTS = "Description already exists";

	@Autowired
	private StateRepositoryExt stateNewRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private StateServiceImpl stateService;

	/**
	 * This method will return the list of State details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StateDto>>
	 */
	@Override
	public PagedRestResponse<List<StateDto>> listState(String countryCode, String stateName, Boolean isActive,
			Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		Page<StateDaoExt> stateList = getStateList(countryCode, stateName, isActive, pageable);
		List<StateDto> stateDtoList = new ArrayList<>();
		stateList.forEach(state -> {
			StateDto stateDto = (StateDto) MapperUtil.getObjectMapping(state, new StateDto());
			stateDto.setCountryCode(state.getCountry().getCountryCode());
			stateDtoList.add(stateDto);
		});
		return (new PagedRestResponse<>(stateDtoList, stateList));
	}

	/**
	 * This method will return the State details based on the stateCode.
	 * 
	 * @param stateCode
	 * @return StateDto
	 */
	@Override
	public StateDto getState(String stateId) {
		StateDaoExt state = stateNewRepository.findOneByStateId(stateId);
		if (state == null) {
			throw new ServiceException(NO_STATE_DETAILS_FOUND_FOR_THE_REQUESTED_STATECODE, ERR_LOC_004);
		}
		StateDto stateDto = (StateDto) MapperUtil.getObjectMapping(state, new StateDto());
		stateDto.setCountryCode(state.getCountry().getCountryCode());
		return stateDto;
	}

	/**
	 * This method will save the State details.
	 * 
	 * @param stateCreateDto
	 * @return StateDto
	 */
	@Override
	public StateDto addState(StateCreateDto stateCreateDto) {
		StateDaoExt state = stateNewRepository.findOneByDescription(stateCreateDto.getDescription());
		if (state != null) {
			throw new ServiceException(DESCRIPTION_ALREADY_EXISTS, ERR_LOC_034);
		}
		state = (StateDaoExt) MapperUtil.getObjectMapping(stateCreateDto, new StateDaoExt());
		CountryDao country = new CountryDao();
		country.setCountryCode(stateCreateDto.getCountryCode());
		state.setCountry(country);

		state.setSrcSyncId(0);
		state.setDestSyncId(0);
		Map<String, SyncStagingDto> data = stateService.saveStateToDB(state, LocationOperationCodes.STATE_ADD, true);

		// Publishing to data sync queue
		syncDataService.publishLocationMessages(data);

		StateDto stateResultDto = (StateDto) MapperUtil.getObjectMapping(state, new StateDto());
		stateResultDto.setCountryCode(state.getCountry().getCountryCode());
		return stateResultDto;
	}

	/**
	 * @param state
	 * @param operation
	 * @param b
	 * @return SyncStaging
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveStateToDB(StateDaoExt state, String operation, boolean isPublishToEGHS) {
		// saving state
		StateDaoExt savedState = stateNewRepository.save(state);
		// converting to required json string
		List<SyncData> stateSyncData = new ArrayList<>();
		StateSyncDtoExt stateSyncDto = new StateSyncDtoExt(savedState);
		stateSyncData.add(DataSyncUtil.createSyncData(stateSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getLocationSyncStagingMap(stateSyncData, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * This method will update the State details.
	 * 
	 * @param stateDto
	 * @return StateDto
	 */
	@Override
	public StateDto updateState(String stateId, StateUpdateDto stateUpdateDto) {
		StateDaoExt state = stateNewRepository.findOneByStateId(stateId);
		if (state == null) {
			throw new ServiceException(NO_STATE_DETAILS_FOUND_FOR_THE_REQUESTED_STATECODE, ERR_LOC_004);
		}
		state = (StateDaoExt) MapperUtil.getObjectMapping(stateUpdateDto, state);
		if (stateUpdateDto.getCountryCode() != null) {
			CountryDao country = new CountryDao();
			country.setCountryCode(stateUpdateDto.getCountryCode());
			state.setCountry(country);
		}

		state.setSrcSyncId(state.getSrcSyncId() + 1);
		Map<String, SyncStagingDto> data = stateService.saveStateToDB(state, LocationOperationCodes.STATE_UPDATE, true);

		// Publishing to data sync queue
		syncDataService.publishLocationMessages(data);

		StateDto stateDto = (StateDto) MapperUtil.getObjectMapping(state, new StateDto());
		stateDto.setCountryCode(state.getCountry().getCountryCode());
		return stateDto;
	}

	private Page<StateDaoExt> getStateList(String countryCode, String stateName, Boolean isActive,
			Pageable pageable) {
		StateDaoExt stateRequest = new StateDaoExt();
		stateRequest.setDescription(stateName);
		stateRequest.setIsActive(isActive);
		CountryDao country = new CountryDao();
		country.setCountryCode(countryCode);
		stateRequest.setCountry(country);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StateDaoExt> criteria = Example.of(stateRequest, matcher);
		return stateNewRepository.findAll(criteria, pageable);
	}

	@Override
	public PagedRestResponse<List<StateLiteDto>> listStateLite(List<String> regionCodes, List<String> countryCodes,
			Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		Page<StateDaoExt> stateList = stateNewRepository.getStateLists(regionCodes, countryCodes, pageable);

		List<StateLiteDto> stateLiteDtoList = new ArrayList<>();

		stateList.forEach(state -> {

			StateLiteDto stateLiteDto = (StateLiteDto) MapperUtil.getObjectMapping(state, new StateLiteDto());

			stateLiteDtoList.add(stateLiteDto);

		});

		return (new PagedRestResponse<>(stateLiteDtoList, stateList));
	}

}
