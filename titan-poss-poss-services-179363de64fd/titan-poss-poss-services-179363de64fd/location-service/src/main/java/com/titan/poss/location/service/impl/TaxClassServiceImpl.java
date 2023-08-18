/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dao.TaxClassDao;
import com.titan.poss.location.dto.TaxClassDto;
import com.titan.poss.location.dto.TaxClassSyncDto;
import com.titan.poss.location.dto.request.TaxClassUpdateDto;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.repository.TaxClassRepositoryExt;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.TaxClassService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("taxClassService")
public class TaxClassServiceImpl implements TaxClassService {

	private static final String ERR_LOC_006 = "ERR-LOC-006";

	private static final String NO_TAXCLASS_DETAILS_FOUND_FOR_THE_REQUESTED_TAXCLASSCODE = "No TaxClass details found for the requested taxClassCode";

	@Autowired
	private TaxClassRepositoryExt taxClassRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private TaxClassServiceImpl taxClassService;

	/**
	 * This method will return the list of TaxClass details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<TaxClassDto>>
	 */
	@Override
	public PagedRestResponse<List<TaxClassDto>> listTaxClass(Boolean isActive, Pageable pageable, Boolean isPageable) {
		Page<TaxClassDao> taxClassList;
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		if (isActive == null) {
			taxClassList = taxClassRepository.findAll(pageable);
		} else {
			taxClassList = taxClassRepository.findByIsActive(isActive, pageable);
		}
		List<TaxClassDto> taxClassDtoList = new ArrayList<>();
		taxClassList.forEach(
				taxClass -> taxClassDtoList.add((TaxClassDto) MapperUtil.getDtoMapping(taxClass, TaxClassDto.class)));
		return (new PagedRestResponse<>(taxClassDtoList, taxClassList));
	}
	
	/**
	 * This method will return the TaxClass details based on the taxClassCode.
	 * 
	 * @param taxClassCode
	 * @return TaxClassDto
	 */
	@Override
	public TaxClassDto getTaxClass(String taxClassCode) {
		TaxClassDao taxClass = taxClassRepository.findOneByTaxClassCode(taxClassCode);
		if (taxClass == null) {
			throw new ServiceException(NO_TAXCLASS_DETAILS_FOUND_FOR_THE_REQUESTED_TAXCLASSCODE, ERR_LOC_006);
		}
		return (TaxClassDto) MapperUtil.getDtoMapping(taxClass, TaxClassDto.class);
	}

	/**
	 * This method will save the TaxClass details.
	 * 
	 * @param taxClassDto
	 * @return TaxClassDto
	 */
	@Override
	public TaxClassDto addTaxClass(TaxClassDto taxClassDto) {
		TaxClassDao taxClass = (TaxClassDao) MapperUtil.getDtoMapping(taxClassDto, TaxClassDao.class);
		taxClass.setSrcSyncId(0);
		taxClass.setDestSyncId(0);

		SyncStagingDto data = taxClassService.saveTaxClassToDB(taxClass, LocationOperationCodes.TAXCLASS_ADD);

		// Publishing to data sync queue
		syncDataService.publishLocationMessagesToQueue(data);

		return taxClassDto;
	}

	/**
	 * @param taxClass
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveTaxClassToDB(TaxClassDao taxClass, String operation) {
		// saving taxClass
		TaxClassDao savedTaxClass = taxClassRepository.save(taxClass);
		// converting to required json string
		List<SyncData> taxClsSyncData = new ArrayList<>();
		TaxClassSyncDto taxClassSyncDto = new TaxClassSyncDto(savedTaxClass);
		taxClsSyncData.add(DataSyncUtil.createSyncData(taxClassSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest taxClsMsgRequest = DataSyncUtil.createMessageRequest(taxClsSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(taxClsMsgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(taxClsMsgRequest);
		// saving to staging table
		SyncStaging taxClsStagingMsg = new SyncStaging();
		taxClsStagingMsg.setMessage(requestBody);
		taxClsStagingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		taxClsStagingMsg = locationSyncStagingRepository.save(taxClsStagingMsg);
		syncStagingDto.setId(taxClsStagingMsg.getId());
		return syncStagingDto;
	}

	/**
	 * This method will update the TaxClass details.
	 * 
	 * @param taxClassDto
	 * @return TaxClassDto
	 */
	@Override
	public TaxClassDto updateTaxClass(String taxClassCode, TaxClassUpdateDto taxClassUpdateDto) {
		TaxClassDao taxClass = taxClassRepository.findOneByTaxClassCode(taxClassCode);
		if (taxClass == null) {
			throw new ServiceException(NO_TAXCLASS_DETAILS_FOUND_FOR_THE_REQUESTED_TAXCLASSCODE, ERR_LOC_006);
		}
		taxClass = (TaxClassDao) MapperUtil.getObjectMapping(taxClassUpdateDto, taxClass);
		taxClass.setSrcSyncId(taxClass.getSrcSyncId() + 1);
		SyncStagingDto data = taxClassService.saveTaxClassToDB(taxClass, LocationOperationCodes.TAXCLASS_UPDATE);
		// Publishing to data sync queue
		syncDataService.publishLocationMessagesToQueue(data);

		return (TaxClassDto) MapperUtil.getObjectMapping(taxClass, new TaxClassDto());
	}
}
