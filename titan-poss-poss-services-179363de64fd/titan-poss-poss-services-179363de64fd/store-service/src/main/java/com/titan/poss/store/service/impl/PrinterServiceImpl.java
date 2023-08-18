/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.titan.poss.store.dao.PrinterConfigDaoExt;
import com.titan.poss.store.dao.SyncStaging;
import com.titan.poss.store.dto.PrinterConfigSyncDtoExt;
import com.titan.poss.store.dto.constants.StoreConstants;
import com.titan.poss.store.dto.request.CreatePrinterConfigDto;
import com.titan.poss.store.dto.request.UpdatePrinterConfigDto;
import com.titan.poss.store.dto.respond.PrinterConfigDto;
import com.titan.poss.store.dto.response.StaggingResponse;
import com.titan.poss.store.repository.PrinterConfigRepositoryExt;
import com.titan.poss.store.repository.StoreSyncStagingRepository;
import com.titan.poss.store.service.PrinterService;
import com.titan.poss.store.service.StoreSyncDataService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("storePrinterService")
public class PrinterServiceImpl implements PrinterService {

	@Autowired
	private PrinterConfigRepositoryExt printerConfigRepo;

	@Autowired
	private PrinterServiceImpl printerServiceImp;

	@Autowired
	private StoreSyncDataService storeSyncDataService;

	@Autowired
	private StoreSyncStagingRepository storeSyncStagingRepository;
	
	@Value("${app.name}")
	private String appName;

	@Override
	public PagedRestResponse<List<PrinterConfigDto>> listPrinterConfigService(String documentType,Pageable pageable,Boolean isActive) {
		PrinterConfigDaoExt printerConfigCriteria = new PrinterConfigDaoExt();
		printerConfigCriteria.setIsActive(isActive);
		printerConfigCriteria.setDocumentType(documentType);
		printerConfigCriteria.setLocationCode(CommonUtil.getLocationCode());
		printerConfigCriteria.setHostname(CommonUtil.getAuthUser().getHostName());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PrinterConfigDaoExt> criteria = Example.of(printerConfigCriteria, matcher);
		Page<PrinterConfigDaoExt> pagedPrinterConfig = printerConfigRepo.findAll(criteria, pageable);
		List<PrinterConfigDto> printerConfigDtoList = new ArrayList<>();
		if (!pagedPrinterConfig.isEmpty()) {
			printerConfigDtoList = pagedPrinterConfig.stream()
					.map(printer -> (PrinterConfigDto) MapperUtil.getObjectMapping(printer, new PrinterConfigDto()))
					.collect(Collectors.toList());
		}
		return new PagedRestResponse<>(printerConfigDtoList, pagedPrinterConfig);
	}

	@Override
	public PrinterConfigDto getPrinterConfigService(String id) {
		Optional<PrinterConfigDaoExt> printerConfig = printerConfigRepo.findById(id);
		if (printerConfig.isPresent()) {
			return (PrinterConfigDto) MapperUtil.getDtoMapping(printerConfig.get(), PrinterConfigDto.class);
		} else {
			throw new ServiceException(StoreConstants.RECORD_NOT_FOUND, StoreConstants.ERR_STORE_001);
		}
	}

	@Override
	public PrinterConfigDto createPrinterConfigService(CreatePrinterConfigDto createDto) {
		PrinterConfigDaoExt checkPrinterConfigDao = printerConfigRepo.findByLocationCodeAndHostnameAndDocumentType(
				CommonUtil.getLocationCode(), CommonUtil.getAuthUser().getHostName(), createDto.getDocumentType());
		if (checkPrinterConfigDao == null) {
			PrinterConfigDaoExt newPrinterConfig = (PrinterConfigDaoExt) MapperUtil.getObjectMapping(createDto,
					new PrinterConfigDaoExt());
			newPrinterConfig.setLocationCode(CommonUtil.getLocationCode());
			newPrinterConfig.setHostname(CommonUtil.getAuthUser().getHostName());
			newPrinterConfig.setIsActive(Boolean.TRUE);
			StaggingResponse response = printerServiceImp.addAndUpdatePrinterStagging(newPrinterConfig,
					StoreOperationCode.PRINTER_CONFIGURATION_ADD);
			
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				storeSyncDataService.publishPaymentMessagesToQueue(response.getStaggingDto());
			return (PrinterConfigDto) MapperUtil.getDtoMapping(response.getPrinterConfigDaoExt(),
					PrinterConfigDto.class);
		} else {
			throw new ServiceException(StoreConstants.PRINTER_ALREADY_EXIST, StoreConstants.ERR_STORE_003);
		}
	}

	@Override
	public PrinterConfigDto updatePrinterConfigService(UpdatePrinterConfigDto updateDto) {
		Optional<PrinterConfigDaoExt> printerConfig = printerConfigRepo.findById(updateDto.getId());
		if (printerConfig.isPresent()) {
			PrinterConfigDaoExt existingPrinterConfig = (PrinterConfigDaoExt) MapperUtil.getObjectMapping(updateDto,
					printerConfig.get());
			existingPrinterConfig.setSrcSyncId(existingPrinterConfig.getSrcSyncId() + 1);
			StaggingResponse response = printerServiceImp.addAndUpdatePrinterStagging(existingPrinterConfig,
					StoreOperationCode.PRINTER_CONFIGURATION_UPDATE);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
				storeSyncDataService.publishPaymentMessagesToQueue(response.getStaggingDto());
			return (PrinterConfigDto) MapperUtil.getObjectMapping(response.getPrinterConfigDaoExt(),
					new PrinterConfigDto());
		} else {
			throw new ServiceException(StoreConstants.RECORD_NOT_FOUND, StoreConstants.ERR_STORE_004);
		}

	}

	/**
	 * @param existingPrinterConfig
	 * @param printerConfigurationUpdate
	 * @return
	 */
	@Transactional
	public StaggingResponse addAndUpdatePrinterStagging(PrinterConfigDaoExt printerConfig, String operation) {
		printerConfig = printerConfigRepo.save(printerConfig);
		SyncStagingDto printerStagingDto = new SyncStagingDto();
		StaggingResponse response = new StaggingResponse();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
		List<SyncData> syncDataList = new ArrayList<>();
		syncDataList.add(DataSyncUtil.createSyncData(new PrinterConfigSyncDtoExt(printerConfig), 0));
		List<String> destinations = new ArrayList<>();
		destinations.add("EPOSS");
		MessageRequest printerMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
		printerStagingDto.setMessageRequest(printerMsgRequest);
		String printerMsg = MapperUtil.getJsonString(printerMsgRequest);
		// saving to staging table
		SyncStaging printerSyncStaging = new SyncStaging();
		printerSyncStaging.setMessage(printerMsg);
		printerSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		printerSyncStaging = storeSyncStagingRepository.save(printerSyncStaging);
		printerStagingDto.setId(printerSyncStaging.getId());
		response.setPrinterConfigDaoExt(printerConfig);
		response.setStaggingDto(printerStagingDto);
		}
		return response;
	}

}
