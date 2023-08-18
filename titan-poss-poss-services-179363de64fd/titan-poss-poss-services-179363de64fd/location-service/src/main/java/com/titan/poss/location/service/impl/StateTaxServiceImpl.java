/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.StateDao;
import com.titan.poss.location.dao.StateTaxDetailsDaoExt;
import com.titan.poss.location.dao.StateTaxMappingDao;
import com.titan.poss.location.dao.StateTaxMappingDaoExt;
import com.titan.poss.location.dao.TaxClassDao;
import com.titan.poss.location.dto.StateTaxDetailsDto;
import com.titan.poss.location.dto.StateTaxDetailsSyncDtoExt;
import com.titan.poss.location.dto.StateTaxMappingSyncDtoExt;
import com.titan.poss.location.dto.UpdateStateTaxDetailsDto;
import com.titan.poss.location.dto.request.StateTaxMappingCreateDto;
import com.titan.poss.location.dto.request.StateTaxMappingUpdateDto;
import com.titan.poss.location.dto.response.StateTaxMappingDto;
import com.titan.poss.location.dto.response.TaxDetailsDto;
import com.titan.poss.location.repository.StateRepository;
import com.titan.poss.location.repository.StateTaxMappingRepositoryExt;
import com.titan.poss.location.repository.StatetTaxDetailsRepositoryExt;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.StateTaxService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("stateTaxService")
public class StateTaxServiceImpl implements StateTaxService {

	private static final String ERR_LOC_004 = "ERR-LOC-004";

	private static final String NO_STATE_DETAILS_FOUND_FOR_THE_REQUESTED_STATECODE = "No State details found for the requested stateCode";

	private static final String ERR_LOC_005 = "ERR-LOC-005";

	private static final String NO_STATE_TAX_DETAILS_FOUND_FOR_THE_REQUESTED_ID = "No StateTax details found for the requested id";

	@Autowired
	private StateTaxMappingRepositoryExt stateTaxMappingRepository;

	@Autowired
	private StateRepository stateRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private StateTaxServiceImpl stateTaxService;

	@Autowired
	private StatetTaxDetailsRepositoryExt stateTaxDetailsRepository;

	/**
	 * This method will return the list of StateTaxMapping details based on the
	 * isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StateTaxMappingDto>>
	 */
	@Override
	public PagedRestResponse<List<StateTaxMappingDto>> listStateTax(Boolean isActive, String stateName,
			Pageable pageable) {
		Page<StateTaxMappingDaoExt> stateTaxMappingList;
//		Example<StateTaxMappingDaoExt> criteria = listStateTaxMappingCriteria(stateName, isActive);
		stateTaxMappingList = stateTaxMappingRepository.findAllStates(stateName, isActive, pageable);

		List<StateTaxMappingDto> stateTaxMappingDtoList = new ArrayList<>();
		stateTaxMappingList.forEach(stateTax -> {
			StateTaxMappingDto stateTaxMappingDto = new StateTaxMappingDto();
			stateTaxMappingDto = (StateTaxMappingDto) MapperUtil.getObjectMapping(stateTax, stateTaxMappingDto);
			stateTaxMappingDto.setStateId(stateTax.getState().getStateId());
			stateTaxMappingDto.setStateName(stateTax.getState().getDescription());
			stateTaxMappingDto.setStateCode(stateTax.getState().getStateCode());
			stateTaxMappingDto.setTaxComponent(MapperUtil.getJsonFromString(stateTax.getTaxComponent()));
			stateTaxMappingDtoList.add(stateTaxMappingDto);
		});

		return (new PagedRestResponse<>(stateTaxMappingDtoList, stateTaxMappingList));
	}

	private Example<StateTaxMappingDaoExt> listStateTaxMappingCriteria(String stateName, Boolean isActive) {
		StateTaxMappingDaoExt stateTaxMapping = new StateTaxMappingDaoExt();
		if (stateName != null) {
			StateDao stateDao = stateRepository.findByDescription(stateName);
			if (stateDao == null)
				throw new ServiceException(NO_STATE_DETAILS_FOUND_FOR_THE_REQUESTED_STATECODE, ERR_LOC_004);
			StateDao state = new StateDao();
			state.setStateId(stateDao.getStateId());
			stateTaxMapping.setState(state);

		}
		stateTaxMapping.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stateTaxMapping, matcher);
	}

	/**
	 * This method will return the StateTaxMapping details based on the id.
	 * 
	 * @param id
	 * @return StateTaxMappingDto
	 */
	@Override
	public StateTaxMappingDto getStateTax(String id) {
		StateTaxMappingDaoExt stateTaxMapping = stateTaxMappingRepository.findOneById(id);
		if (stateTaxMapping == null)
			throw new ServiceException(NO_STATE_TAX_DETAILS_FOUND_FOR_THE_REQUESTED_ID, ERR_LOC_005);

		StateTaxMappingDto stateTaxMappingDto = new StateTaxMappingDto();
		stateTaxMappingDto = (StateTaxMappingDto) MapperUtil.getObjectMapping(stateTaxMapping, stateTaxMappingDto);
		stateTaxMappingDto.setStateId(stateTaxMapping.getState().getStateId());
		stateTaxMappingDto.setStateName(stateTaxMapping.getState().getDescription());
		stateTaxMappingDto.setStateCode(stateTaxMapping.getState().getStateCode());
		stateTaxMappingDto.setTaxComponent(MapperUtil.getJsonFromString(stateTaxMapping.getTaxComponent()));
		return stateTaxMappingDto;
	}

	/**
	 * This method will save the StateTaxMapping details.
	 * 
	 * @param stateTaxMappingCreateDto
	 * @return StateTaxMappingDto
	 */
	@Override
	public StateTaxMappingDto addStateTax(StateTaxMappingCreateDto stateTaxMappingCreateDto) {
		StateTaxMappingDaoExt stateTaxMapping = (StateTaxMappingDaoExt) MapperUtil
				.getDtoMapping(stateTaxMappingCreateDto, StateTaxMappingDaoExt.class);
		StateDao state = stateRepository.findByDescriptionAndStateCode(stateTaxMappingCreateDto.getStateName(),
				stateTaxMappingCreateDto.getStateCode());
		stateTaxMapping.setState(state);
		stateTaxMapping.setTaxComponent(MapperUtil.getStringFromJson(stateTaxMappingCreateDto.getTaxComponent()));
		stateTaxMapping.setSrcSyncId(0);
		stateTaxMapping.setDestSyncId(0);
		Map<String, SyncStagingDto> data = stateTaxService.saveStateTaxMappingToDB(stateTaxMapping,
				LocationOperationCodes.STATETAX_ADD, true);

		// Publishing to data sync queue
		syncDataService.publishLocationMessages(data);

		StateTaxMappingDto stateTaxMappingDto = (StateTaxMappingDto) MapperUtil.getObjectMapping(stateTaxMapping,
				new StateTaxMappingDto());
		stateTaxMappingDto.setStateId(state.getStateId());
		stateTaxMappingDto.setStateName(state.getDescription());
		stateTaxMappingDto.setStateCode(state.getStateCode());
		stateTaxMappingDto.setTaxComponent(MapperUtil.getJsonFromString(stateTaxMapping.getTaxComponent()));
		return stateTaxMappingDto;
	}

	/**
	 * @param stateTaxMapping
	 * @param operation
	 * @return Map<String, SyncStagingDto>
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveStateTaxMappingToDB(StateTaxMappingDaoExt stateTaxMapping, String operation,
			boolean isPublishToEGHS) {
		// saving stateTaxMapping
		StateTaxMappingDaoExt savedStateTaxMapping = stateTaxMappingRepository.save(stateTaxMapping);
		// converting to required json string
		List<SyncData> stateTaxSyncData = new ArrayList<>();
		StateTaxMappingSyncDtoExt stateTaxMappingSyncDto = new StateTaxMappingSyncDtoExt(savedStateTaxMapping);
		stateTaxSyncData.add(DataSyncUtil.createSyncData(stateTaxMappingSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getLocationSyncStagingMap(stateTaxSyncData, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * This method will update the StateTaxMapping details.
	 * 
	 * @param stateTaxMappingUpdateDto
	 * @return StateTaxMappingDto
	 */
	@Override
	public StateTaxMappingDto updateStateTax(String id, StateTaxMappingUpdateDto stateTaxMappingUpdateDto) {
		StateTaxMappingDaoExt stateTaxMapping = stateTaxMappingRepository.findOneById(id);
		if (stateTaxMapping == null) {
			throw new ServiceException(NO_STATE_TAX_DETAILS_FOUND_FOR_THE_REQUESTED_ID, ERR_LOC_005);
		}

		StateDao state = stateRepository.findByDescriptionAndStateCode(stateTaxMappingUpdateDto.getStateName(),
				stateTaxMappingUpdateDto.getStateCode());

		stateTaxMapping = (StateTaxMappingDaoExt) MapperUtil.getObjectMapping(stateTaxMappingUpdateDto,
				stateTaxMapping);

		if (stateTaxMappingUpdateDto.getTaxComponent() != null
				&& !stateTaxMappingUpdateDto.getTaxComponent().equals("{}")) {
			stateTaxMapping.setTaxComponent(MapperUtil.getStringFromJson(stateTaxMappingUpdateDto.getTaxComponent()));
		}
		stateTaxMapping.setState(state);
		stateTaxMapping.setSrcSyncId(stateTaxMapping.getSrcSyncId() + 1);
		Map<String, SyncStagingDto> data = stateTaxService.saveStateTaxMappingToDB(stateTaxMapping,
				LocationOperationCodes.STATETAX_UPDATE, true);
		// Publishing to data sync queue
		syncDataService.publishLocationMessages(data);

		StateTaxMappingDto stateTaxMappingDto = (StateTaxMappingDto) MapperUtil.getObjectMapping(stateTaxMapping,
				new StateTaxMappingDto());
		stateTaxMappingDto.setStateId(stateTaxMapping.getState().getStateId());
		stateTaxMappingDto.setTaxComponent(MapperUtil.getJsonFromString(stateTaxMapping.getTaxComponent()));
		stateTaxMappingDto.setStateName(state.getDescription());
		stateTaxMappingDto.setStateCode(state.getStateCode());
		return stateTaxMappingDto;
	}

	@Override
	public ListResponse<TaxDetailsDto> getTaxDetails(String stateTaxMappingId) {

		List<TaxDetailsDto> taxDetailsDtoList = new ArrayList<>();
		StateTaxMappingDao stateTaxMappingDao = new StateTaxMappingDao();
		stateTaxMappingDao.setId(stateTaxMappingId);

		List<StateTaxDetailsDaoExt> stateTaxDetailsDao = stateTaxDetailsRepository
				.findByStateTaxMappingId(stateTaxMappingDao);

		stateTaxDetailsDao.forEach(stateTaxDetails -> {

			TaxDetailsDto taxDetailsDto = new TaxDetailsDto();
			taxDetailsDto.setTaxClassCode(stateTaxDetails.getTaxClassCode().getTaxClassCode());
			taxDetailsDto.setId(stateTaxDetails.getId());
			taxDetailsDto.setTaxDetails(MapperUtil.getJsonFromString(stateTaxDetails.getTaxDetails()));
			taxDetailsDtoList.add(taxDetailsDto);

		});

		return new ListResponse<>(taxDetailsDtoList);
	}

	@Override
	public StateTaxDetailsDto updateStateTaxDetails(String stateTaxMappingId, StateTaxDetailsDto stateTaxDetailsDto) {

		List<StateTaxDetailsDaoExt> stateTaxDetailsDaoList = new ArrayList<>();

		if (!stateTaxDetailsDto.getUpdateStateTaxDetails().isEmpty()) {

			List<String> idList = stateTaxDetailsDto.getUpdateStateTaxDetails().stream()
					.map(UpdateStateTaxDetailsDto::getId).collect(Collectors.toList());
			List<StateTaxDetailsDaoExt> updateTaxDetails = stateTaxDetailsRepository.findByIdIn(idList);
			Map<String, StateTaxDetailsDaoExt> stateTaxDetailsMap = new HashMap<>();
			for (StateTaxDetailsDaoExt taxDetailsDao : updateTaxDetails) {
				stateTaxDetailsMap.put(taxDetailsDao.getId(), taxDetailsDao);
			}

			stateTaxDetailsDto.getUpdateStateTaxDetails().forEach(updateTaxDetail -> {
				StateTaxDetailsDaoExt stateTaxDetailsDao = stateTaxDetailsMap.get(updateTaxDetail.getId());
				TaxClassDao taxClassDao = new TaxClassDao();
				taxClassDao.setTaxClassCode(updateTaxDetail.getTaxClassCode());
				stateTaxDetailsDao.setTaxClassCode(taxClassDao);
				stateTaxDetailsDao.setTaxDetails(MapperUtil.getStringFromJson(updateTaxDetail.getTaxDetails()));
				stateTaxDetailsDao.setSrcSyncId(stateTaxDetailsDao.getSrcSyncId() + 1);
				stateTaxDetailsDaoList.add(stateTaxDetailsDao);
			});

		}

		if (!stateTaxDetailsDto.getAddStateTaxDetails().isEmpty()) {

			stateTaxDetailsDto.getAddStateTaxDetails().forEach(addTaxDetails -> {
				StateTaxDetailsDaoExt stateTaxDetailsDao = new StateTaxDetailsDaoExt();
				StateTaxMappingDao stateTaxMappingDao = new StateTaxMappingDao();
				stateTaxMappingDao.setId(stateTaxMappingId);
				stateTaxDetailsDao.setStateTaxMappingId(stateTaxMappingDao);
				TaxClassDao taxClassDao = new TaxClassDao();
				taxClassDao.setTaxClassCode(addTaxDetails.getTaxClassCode());
				stateTaxDetailsDao.setTaxClassCode(taxClassDao);
				stateTaxDetailsDao.setTaxDetails(MapperUtil.getStringFromJson(addTaxDetails.getTaxDetails()));
				stateTaxDetailsDao.setSrcSyncId(0);
				stateTaxDetailsDao.setDestSyncId(0);
				stateTaxDetailsDaoList.add(stateTaxDetailsDao);
			});

		}

		Map<String, SyncStagingDto> data = stateTaxService.saveStateTaxDetailsAndStaging(stateTaxDetailsDaoList,
				LocationOperationCodes.STATETAXDETAILS_UPDATE, false);

		// Publishing to data sync queue
		syncDataService.publishLocationMessages(data);

		return stateTaxDetailsDto;
	}

	/**
	 * @param stateTaxDetailsDaoList
	 * @param operation
	 * @param isPublishToEGHS
	 * @return Map<String, SyncStagingDto>
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveStateTaxDetailsAndStaging(List<StateTaxDetailsDaoExt> stateTaxDetailsDaoList,
			String operation, boolean isPublishToEGHS) {

		stateTaxDetailsDaoList = stateTaxDetailsRepository.saveAll(stateTaxDetailsDaoList);
		List<SyncData> syncList = new ArrayList<>();
		StateTaxDetailsSyncDtoExt stateTaxMappingSyncDto = new StateTaxDetailsSyncDtoExt();
		syncList.add(DataSyncUtil.createSyncData(stateTaxMappingSyncDto.getSyncDtoList(stateTaxDetailsDaoList), 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getLocationSyncStagingMap(syncList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}
}
