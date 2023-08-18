/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.StoreOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.store.dao.CatchmentDao;
import com.titan.poss.store.dao.CatchmentId;
import com.titan.poss.store.dao.SyncStaging;
import com.titan.poss.store.dto.CatchmentSyncDto;
import com.titan.poss.store.dto.request.CatchmentAddDto;
import com.titan.poss.store.dto.request.CatchmentUpdateDto;
import com.titan.poss.store.dto.response.CatchmentDto;
import com.titan.poss.store.repository.CatchmentRepositoryExt;
import com.titan.poss.store.repository.StoreSyncStagingRepository;
import com.titan.poss.store.service.CatchmentService;
import com.titan.poss.store.service.StoreSyncDataService;

/**
 * Service class for Catchment.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("storeCatchmentAreaService")
public class CatchmentAreaServiceImpl implements CatchmentService {

	private static final String DESCRIPTION = "description";

	private static final String ERR_STORE_001 = "ERR-STORE-001";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	private static final String ERR_STORE_002 = "ERR-STORE-002";
	private static final String RECORD_ALREADY_EXIST = "Record already exists.";
	
	private static final String ERR_STORE_005 = "ERR-STORE-005";
	private static final String CATCHMENT_NOT_EDITABLE = "Catchment cannot be editable";

	@Autowired
	private CatchmentRepositoryExt catchmentRepository;

	@Autowired
	private StoreSyncDataService storeSyncDataService;

	@Autowired
	private CatchmentAreaServiceImpl catchmentServiceImpl;

	@Autowired
	private StoreSyncStagingRepository storeSyncStagingRepository;

	@Value("${app.name}")
	private String appName;

	private CatchmentDao getCatchmentDetails(String catchmentCode) {
		Optional<CatchmentDao> catchmentOptional = catchmentRepository
				.findById(new CatchmentId(catchmentCode, CommonUtil.getLocationCode()));
		return catchmentOptional.isPresent() ? catchmentOptional.get() : null;
	}

	private CatchmentDao checkIfCatchmentExists(String catchmentCode) {
		CatchmentDao catchmentDao = getCatchmentDetails(catchmentCode);
		if (catchmentDao == null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_STORE_001);
		return catchmentDao;
	}

	/**
	 * This method will return the list of Catchment details based on searchField
	 * for a particular locationCode.
	 * 
	 * @param stateCode
	 * @param pageable
	 * @return PagedRestResponse<List<CatchmentDto>>
	 */
	@Override
	public PagedRestResponse<List<CatchmentDto>> listCatchmentArea(String searchField, Boolean isActive,
			Pageable pageable) {

		Example<CatchmentDao> criteria = listCatchmentCriteria(searchField, isActive);

		Page<CatchmentDao> catchmentList = catchmentRepository.findAll(criteria, pageable);

		List<CatchmentDto> catchmentDtoList = catchmentList.stream()
				.map(catchment -> new CatchmentDto(catchment.getCatchmentId().getCatchmentCode(),
						catchment.getDescription(), catchment.getIsActive(),catchment.getIsEditable()))
				.collect(Collectors.toList());

		return (new PagedRestResponse<List<CatchmentDto>>(catchmentDtoList, catchmentList));
	}

	private Example<CatchmentDao> listCatchmentCriteria(String searchField, Boolean isActive) {
		CatchmentId catchmentId = new CatchmentId();
		catchmentId.setLocationCode(CommonUtil.getLocationCode());
		CatchmentDao catchment = new CatchmentDao();
		catchment.setCatchmentId(catchmentId);
		catchment.setDescription(searchField);
		catchment.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues().withMatcher(DESCRIPTION,
				ExampleMatcher.GenericPropertyMatchers.startsWith().ignoreCase());
		return Example.of(catchment, matcher);
	}

	/**
	 * This method will update the Catchment details.
	 * 
	 * @param catchmentCode
	 * @param catchmentUpdateDto
	 * @return void
	 */
	@Override
	public CatchmentDto updateCatchment(String catchmentCode, CatchmentUpdateDto catchmentUpdateDto) {
		CatchmentDao catchment = getCatchmentDetails(catchmentCode);
		if (catchment == null) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_STORE_001);
		}else if(!catchment.getIsEditable()) {
			throw new ServiceException(CATCHMENT_NOT_EDITABLE, ERR_STORE_005);
		}
		
		if (!StringUtils.isEmpty(catchmentUpdateDto.getDescription())) {
			CatchmentDao catchmentDaoObj = catchmentRepository.findOneByCatchmentIdAndDescription(
					catchment.getCatchmentId(), catchmentUpdateDto.getDescription());
			if (catchmentDaoObj != null
					&& !catchmentCode.equalsIgnoreCase(catchmentDaoObj.getCatchmentId().getCatchmentCode())) {
				throw new ServiceException(RECORD_ALREADY_EXIST, ERR_STORE_002);
			}
		}
		catchment = (CatchmentDao) MapperUtil.getObjectMapping(catchmentUpdateDto, catchment);
		catchment.setSrcSyncId(catchment.getSrcSyncId() + 1);
		SyncStagingDto syncStagingDto = catchmentServiceImpl.addAndUpdateCatchmentStaging(catchment,
				StoreOperationCode.CATCHMENT_UPDATE);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			storeSyncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		CatchmentDto catchmentDto = (CatchmentDto) MapperUtil.getObjectMapping(catchment, new CatchmentDto());
		catchmentDto.setCatchmentCode(catchmentCode);
		return catchmentDto;
	}

	/**
	 * This method will save the Catchment details.
	 * 
	 * @param catchmentAddDto
	 * @return void
	 */
	@Override
	public CatchmentDto addCatchment(CatchmentAddDto catchmentAddDto) {
		CatchmentDao catchmentExist = getCatchmentDetails(catchmentAddDto.getCatchmentCode());
		if (catchmentExist != null) {
			throw new ServiceException(RECORD_ALREADY_EXIST, ERR_STORE_002);
		}
		catchmentExist = catchmentRepository.findOneByCatchmentIdLocationCodeAndDescription(
				CommonUtil.getLocationCode(), catchmentAddDto.getDescription());
		if (catchmentExist != null) {
			throw new ServiceException(RECORD_ALREADY_EXIST, ERR_STORE_002);
		}
		CatchmentId catchmentId = new CatchmentId();
		catchmentId.setCatchmentCode(catchmentAddDto.getCatchmentCode());
		catchmentId.setLocationCode(CommonUtil.getLocationCode());
		CatchmentDao catchment = (CatchmentDao) MapperUtil.getObjectMapping(catchmentAddDto, new CatchmentDao());
		catchment.setCatchmentId(catchmentId);
		catchment.setSrcSyncId(0);
		catchment.setDestSyncId(0);
		catchment.setIsEditable(true);
		SyncStagingDto syncStagingDto = catchmentServiceImpl.addAndUpdateCatchmentStaging(catchment,
				StoreOperationCode.CATCHMENT_ADD);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			storeSyncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		CatchmentDto catchmentDto = (CatchmentDto) MapperUtil.getObjectMapping(catchment, new CatchmentDto());
		catchmentDto.setCatchmentCode(catchment.getCatchmentId().getCatchmentCode());
		return catchmentDto;
	}

	/**
	 * This method will return the Catchment details based on the catchmentCode.
	 * 
	 * @param catchmentCode
	 * @return CatchmentDto
	 */
	@Override
	public CatchmentDto getCatchment(String catchmentCode) {

		CatchmentDao catchment = checkIfCatchmentExists(catchmentCode);

		CatchmentId catchmentId = catchment.getCatchmentId();

		CatchmentDto catchmentDto = new CatchmentDto();
		catchmentDto.setCatchmentCode(catchmentId.getCatchmentCode());
		catchmentDto.setDescription(catchment.getDescription());
		catchmentDto.setIsActive(catchment.getIsActive());
		catchmentDto.setIsEditable(catchment.getIsEditable());

		return catchmentDto;
	}

	@Transactional
	public SyncStagingDto addAndUpdateCatchmentStaging(CatchmentDao catchmentDao, String operation) {
		catchmentDao = catchmentRepository.save(catchmentDao);
		SyncStagingDto catchmentStagingDto = new SyncStagingDto();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<SyncData> syncDataList = new ArrayList<>();
			CatchmentSyncDto syncDto = new CatchmentSyncDto(catchmentDao);
			syncDataList.add(DataSyncUtil.createSyncData(syncDto, 0));
			List<String> destinations = new ArrayList<>();
			destinations.add("EPOSS");
			destinations.add("EGHS");
			MessageRequest catchmentMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation,
					destinations, MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
			catchmentStagingDto.setMessageRequest(catchmentMsgRequest);
			String catchmentMsg = MapperUtil.getJsonString(catchmentMsgRequest);
			// saving to staging table
			SyncStaging catchmentSyncStaging = new SyncStaging();
			catchmentSyncStaging.setMessage(catchmentMsg);
			catchmentSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			catchmentSyncStaging = storeSyncStagingRepository.save(catchmentSyncStaging);
			catchmentStagingDto.setId(catchmentSyncStaging.getId());
		}
		return catchmentStagingDto;
	}
	
	/**
	 * This method will save the Catchment details.
	 * 
	 * @param catchmentAddDto
	 * @return void
	 */
	@Override
	public boolean saveCatchment(String description) {
		//CatchmentDto catchmentDto = null;
		boolean catchmentExist = (catchmentRepository.findOneByCatchmentIdLocationCodeAndDescription(
				CommonUtil.getLocationCode(), description) != null);
		if (!catchmentExist) {
			CatchmentId catchmentId = new CatchmentId();
			 Random r = new Random( System.currentTimeMillis() );
			   // return 10000 + r.nextInt(20000);
			//catchmentId.setCatchmentCode(catchmentAddDto.getCatchmentCode());
			catchmentId.setCatchmentCode(Integer.toString(10000 + r.nextInt(20000)));
			catchmentId.setLocationCode(CommonUtil.getLocationCode());
			CatchmentDao catchment = new CatchmentDao();
			catchment.setCatchmentId(catchmentId);
			catchment.setIsEditable(false);
			catchment.setDescription(description);
			SyncStagingDto syncStagingDto = catchmentServiceImpl.addAndUpdateCatchmentStaging(catchment,
					StoreOperationCode.CATCHMENT_ADD);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				storeSyncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		}
		return catchmentExist;
	}

	
}
