/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dao.TaxConfigsDao;
import com.titan.poss.location.dao.TaxConfigsDaoExt;
import com.titan.poss.location.dto.TaxConfigsSyncDtoExt;
import com.titan.poss.location.dto.request.TaxConfigsCreateDto;
import com.titan.poss.location.dto.request.TaxConfigsUpdateDto;
import com.titan.poss.location.dto.response.TaxConfigsDto;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.repository.TaxConfigsRepositoryExt;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.TaxConfigsService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("taxConfigsService")
public class TaxConfigsServiceImpl implements TaxConfigsService {

	@Autowired
	private TaxConfigsRepositoryExt taxConfigsRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private TaxConfigsServiceImpl taxConfigsService;

	@Override
	public PagedRestResponse<List<TaxConfigsDto>> listTaxConfigs(Boolean isActive, String srcLocationTaxType,
			String destLocationTaxType, String customerTaxType, String txnType, Pageable pageable) {

		List<TaxConfigsDto> taxConfigsDtoList = new ArrayList<>();

		Page<TaxConfigsDao> taxConfigsPage = taxConfigsRepository.getConfiguration(isActive, srcLocationTaxType,
				destLocationTaxType, customerTaxType, txnType, pageable);

		taxConfigsPage.forEach(taxConfig -> {
			TaxConfigsDto taxConfigsDto = (TaxConfigsDto) MapperUtil.getObjectMapping(taxConfig, new TaxConfigsDto());
			taxConfigsDtoList.add(taxConfigsDto);
		});

		return new PagedRestResponse<>(taxConfigsDtoList, taxConfigsPage);
	}

	@Override
	public TaxConfigsDto getTaxConfigs(String id) {

		Optional<TaxConfigsDaoExt> taxConfigsOpt = taxConfigsRepository.findById(id);
		if (!taxConfigsOpt.isPresent())
			throw new ServiceException("No Tax configs details found for the requested taxConfig id", "ERR-LOC-021");

		TaxConfigsDaoExt taxConfigs = taxConfigsOpt.get();
		return (TaxConfigsDto) MapperUtil.getObjectMapping(taxConfigs, new TaxConfigsDto());
	}

	@Override
	public TaxConfigsDto addTaxConfigs(TaxConfigsCreateDto taxConfigsCreateDto) {
		TaxConfigsDaoExt taxConfigs = new TaxConfigsDaoExt();
		createTaxConfig(taxConfigs, taxConfigsCreateDto);
		return (TaxConfigsDto) MapperUtil.getObjectMapping(taxConfigs, new TaxConfigsDto());
	}

	public TaxConfigsDaoExt createTaxConfig(TaxConfigsDaoExt taxConfigs, TaxConfigsCreateDto taxConfigsCreateDto) {
		taxConfigs.setIsActive(taxConfigsCreateDto.getIsActive());
		taxConfigs.setIsSameState(taxConfigsCreateDto.getIsSameState());
		taxConfigs.setCustomerTaxType(taxConfigsCreateDto.getCustomerTaxType());
		taxConfigs.setSrcLocationTaxType(taxConfigsCreateDto.getSrcLocationTaxType());
		taxConfigs.setDestLocationTaxType(taxConfigsCreateDto.getDestLocationTaxType());
		taxConfigs.setTxnType(TxnTaxTypeEnum.valueOfEnum(taxConfigsCreateDto.getTxnType()));
		taxConfigs.setSrcLocationApplicableTax(taxConfigsCreateDto.getSrcLocationApplicableTax());
		taxConfigs.setDestLocationApplicableTax(taxConfigsCreateDto.getDestLocationApplicableTax());
		taxConfigs.setSrcTaxApplicable(taxConfigsCreateDto.getSrcTaxApplicable());
		taxConfigs.setApplicableTax(taxConfigsCreateDto.getApplicableTax());

		taxConfigs.setSrcSyncId(0);
		taxConfigs.setDestSyncId(0);

		SyncStagingDto data = taxConfigsService.saveTaxConfigsToDB(taxConfigs, LocationOperationCodes.TAXCONFIGS_ADD);

		// Publishing to data sync queue
		syncDataService.publishLocationMessagesToQueue(data);

		return taxConfigs;
	}

	/**
	 * @param taxConfigs
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveTaxConfigsToDB(TaxConfigsDaoExt taxConfigs, String operation) {
		// saving taxConfigs
		taxConfigs = taxConfigsRepository.save(taxConfigs);
		// converting to required json string
		List<SyncData> syncDataList = new ArrayList<>();
		TaxConfigsSyncDtoExt taxConfigsSyncDto = new TaxConfigsSyncDtoExt(taxConfigs);
		syncDataList.add(DataSyncUtil.createSyncData(taxConfigsSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest taxConfigMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(taxConfigMsgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(taxConfigMsgRequest);
		// saving to staging table
		SyncStaging taxConfigStagingMsg = new SyncStaging();
		taxConfigStagingMsg.setMessage(requestBody);
		taxConfigStagingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		taxConfigStagingMsg = locationSyncStagingRepository.save(taxConfigStagingMsg);
		syncStagingDto.setId(taxConfigStagingMsg.getId());
		return syncStagingDto;
	}

	@Override
	public TaxConfigsDto updateTaxConfigs(String id, TaxConfigsUpdateDto taxConfigsUpdateDto) {
		Optional<TaxConfigsDaoExt> taxConfigsOpt = taxConfigsRepository.findById(id);
		if (!taxConfigsOpt.isPresent())
			throw new ServiceException("No Tax configs details found for the requested taxConfig id", "ERR-LOC-021");
		TaxConfigsDaoExt taxConfigs = (TaxConfigsDaoExt) MapperUtil.getObjectMapping(taxConfigsUpdateDto,
				taxConfigsOpt.get());
		if (taxConfigsUpdateDto.getTxnType() != null) {
			taxConfigs.setTxnType(TxnTaxTypeEnum.valueOfEnum(taxConfigsUpdateDto.getTxnType()));
		}
		// explicitly set
		taxConfigs.setSrcLocationTaxType(taxConfigsUpdateDto.getSrcLocationTaxType());
		taxConfigs.setCustomerTaxType(taxConfigsUpdateDto.getCustomerTaxType());   
		taxConfigs.setDestLocationTaxType(taxConfigsUpdateDto.getDestLocationTaxType());
		// explicitly set
		taxConfigs.setSrcSyncId(taxConfigs.getSrcSyncId() + 1);
		SyncStagingDto data = taxConfigsService.saveTaxConfigsToDB(taxConfigs,
				LocationOperationCodes.TAXCONFIGS_UPDATE);

		// Publishing to data sync queue
		syncDataService.publishLocationMessagesToQueue(data);

		return (TaxConfigsDto) MapperUtil.getObjectMapping(taxConfigs, new TaxConfigsDto());
	}

}
