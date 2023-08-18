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
import org.springframework.data.domain.PageRequest;
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
import com.titan.poss.location.dao.StateDaoExt;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dao.TownDaoExt;
import com.titan.poss.location.dto.TownSyncDtoExt;
import com.titan.poss.location.dto.request.TownCreateDto;
import com.titan.poss.location.dto.request.TownUpdateDto;
import com.titan.poss.location.dto.response.TownDto;
import com.titan.poss.location.dto.response.TownLiteDto;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.repository.TownRepositoryExt;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.TownService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("townService")
public class TownServiceImpl implements TownService {

	private static final String ERR_LOC_008 = "ERR-LOC-008";

	private static final String ERR_LOC_018 = "ERR-LOC-018";

	private static final String NO_TOWN_DETAILS_FOUND_FOR_THE_REQUESTED_TOWNCODE = "No Town details found for the requested townCode";

	private static final String DETAILS_ALREADY_EXISTS = "Description already exists with same value";

	@Autowired
	private TownRepositoryExt townNewRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private TownServiceImpl townService;

	/**
	 * This method will return the list of Town details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<TownDto>>
	 */
	@Override
	public PagedRestResponse<List<TownDto>> listTown(String stateId, String townName, Boolean isActive, Pageable pageable) {
		Page<TownDaoExt> townList = getTownList(stateId,townName, isActive, pageable);
		List<TownDto> townDtoList = new ArrayList<>();
		townList.forEach(town -> {
			TownDto townDto = getTownDtoMapping(town);
			townDtoList.add(townDto);
		});
		return (new PagedRestResponse<>(townDtoList, townList));
	}

	/**
	 * This method will return the list of Town details based on the stateId and
	 * isPageable.
	 * 
	 * @param stateId
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<TownLiteDto>>
	 */
	@Override
	public PagedRestResponse<List<TownLiteDto>> listTownLite(String stateId, Boolean isPageable, Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		Page<TownDaoExt> townList = getTownList(stateId,null, true, pageable);

		List<TownLiteDto> townLiteDtoList = new ArrayList<>();

		for (TownDaoExt town : townList) {
			TownLiteDto townLiteDto = (TownLiteDto) MapperUtil.getObjectMapping(town, new TownLiteDto());
			townLiteDto.setStateId(town.getState().getStateId());
			townLiteDtoList.add(townLiteDto);
		}

		return (new PagedRestResponse<>(townLiteDtoList, townList));

	}

	private Page<TownDaoExt> getTownList(String stateId, String townName, Boolean isActive, Pageable pageable) {
		Page<TownDaoExt> townList;
		TownDaoExt townRequest = new TownDaoExt();
		townRequest.setIsActive(isActive);
		
		StateDaoExt state = new StateDaoExt();
		state.setStateId(stateId);
		townRequest.setState(state);
		townRequest.setDescription(townName);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<TownDaoExt> criteria = Example.of(townRequest, matcher);
		townList = townNewRepository.findAll(criteria, pageable);
		return townList;
	}

	private TownDto getTownDtoMapping(TownDaoExt town) {
		TownDto townDto = new TownDto();
		townDto = (TownDto) MapperUtil.getObjectMapping(town, townDto);
		if (town.getState() != null && town.getState().getStateId() != null) {
			townDto.setStateId(town.getState().getStateId());
			townDto.setStateName(town.getState().getDescription());
		}
		return townDto;
	}

	/**
	 * This method will return the Town details based on the townCode.
	 * 
	 * @param townCode
	 * @return TownDto
	 */
	@Override
	public TownDto getTown(String townCode) {
		TownDaoExt town = townNewRepository.findOneByTownId(townCode);
		if (town == null) {
			throw new ServiceException(NO_TOWN_DETAILS_FOUND_FOR_THE_REQUESTED_TOWNCODE, ERR_LOC_008);
		}
		return getTownDtoMapping(town);
	}

	/**
	 * This method will save the Town details.
	 * 
	 * @param townDto
	 * @return TownDto
	 */
	@Override
	public TownDto addTown(TownCreateDto townCreateDto) {
		TownDaoExt town = townNewRepository.findByStateIdAndDescription(townCreateDto.getStateId(),
				townCreateDto.getDescription());
		if (town != null) {
			throw new ServiceException(DETAILS_ALREADY_EXISTS, ERR_LOC_018);
		}
		town = (TownDaoExt) MapperUtil.getDtoMapping(townCreateDto, TownDaoExt.class);
		StateDaoExt state = new StateDaoExt();
		state.setStateId(townCreateDto.getStateId());
		town.setState(state);
		town.setSrcSyncId(0);
		town.setDestSyncId(0);
		SyncStagingDto data = townService.saveTownToDB(town, LocationOperationCodes.TOWN_ADD);
		// Publishing to Data Sync Queue
		syncDataService.publishLocationMessagesToQueue(data);
		TownDto townDtoResult = (TownDto) MapperUtil.getObjectMapping(town, new TownDto());
		townDtoResult.setStateId(town.getState().getStateId());
		townDtoResult.setStateName(town.getState().getDescription());
		return townDtoResult;
	}

	/**
	 * This method will update the Town details.
	 * 
	 * @param townDto
	 * @return TownDto
	 */
	@Override
	public TownDto updateTown(String townCode, TownUpdateDto townUpdateDto) {
		TownDaoExt town = townNewRepository.findOneByTownId(townCode);
		if (town == null) {
			throw new ServiceException(NO_TOWN_DETAILS_FOUND_FOR_THE_REQUESTED_TOWNCODE, ERR_LOC_008);
		}
		town = (TownDaoExt) MapperUtil.getObjectMapping(townUpdateDto, town);
		if (townUpdateDto.getStateId() != null) {
			StateDaoExt state = new StateDaoExt();
			state.setStateId(townUpdateDto.getStateId());
		}
		town.setSrcSyncId(town.getSrcSyncId() + 1);
		SyncStagingDto data = townService.saveTownToDB(town, LocationOperationCodes.TOWN_UPDATE);
		// Publishing to Data Sync Queue
		syncDataService.publishLocationMessagesToQueue(data);
		TownDto townDto = (TownDto) MapperUtil.getObjectMapping(town, new TownDto());
		if (town.getState() != null && town.getState().getStateId() != null) {
			townDto.setStateId(town.getState().getStateId());
			townDto.setStateName(town.getState().getDescription());
		}
		return townDto;
	}

	@Override
	public PagedRestResponse<List<TownLiteDto>> getTownLite(String townName, Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		Example<TownDaoExt> criteria = listTownCriteria(townName, true);
		Page<TownDaoExt> townList = townNewRepository.findAll(criteria, pageable);
		List<TownLiteDto> townLiteList = new ArrayList<>();
		for (TownDaoExt town : townList) {
			TownLiteDto townLiteDto = (TownLiteDto) MapperUtil.getObjectMapping(town, new TownLiteDto());
			townLiteDto.setStateId(town.getState().getStateId());
			townLiteList.add(townLiteDto);
		}
		return (new PagedRestResponse<>(townLiteList, townList));
	}

	private Example<TownDaoExt> listTownCriteria(String townName, Boolean isActive) {
		TownDaoExt town = new TownDaoExt();
		town.setDescription(townName);
		town.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(town, matcher);
	}

	/**
	 * @param town
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveTownToDB(TownDaoExt town, String operation) {
		// saving town
		TownDaoExt savedTown = townNewRepository.save(town);
		// converting to required json string
		List<SyncData> townSyncData = new ArrayList<>();
		TownSyncDtoExt townSyncDto = new TownSyncDtoExt(savedTown);
		townSyncData.add(DataSyncUtil.createSyncData(townSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest townMsgRequest = DataSyncUtil.createMessageRequest(townSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(townMsgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(townMsgRequest);
		// saving to staging table
		SyncStaging townStagingMsg = new SyncStaging();
		townStagingMsg.setMessage(requestBody);
		townStagingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		townStagingMsg = locationSyncStagingRepository.save(townStagingMsg);
		syncStagingDto.setId(townStagingMsg.getId());
		return syncStagingDto;
	}

}
