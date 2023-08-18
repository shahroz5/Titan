/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.constant.LovTypeEnum;
import com.titan.poss.product.dao.ProdLovDaoExt;
import com.titan.poss.product.dto.ProdLovSyncDtoExt;
import com.titan.poss.product.dto.request.LovUpdateDto;
import com.titan.poss.product.dto.response.LovCreateDto;
import com.titan.poss.product.dto.response.LovTypesDto;
import com.titan.poss.product.repository.LovRepositoryExt;
import com.titan.poss.product.service.LovService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("ProductLovService")
public class LovServiceImpl implements LovService {

	private static final String ERR_PRO_016 = "ERR-PRO-016";

	private static final String LOVTYPE_AND_CODE_IS_ALREADY_AVAILABLE = "LovType and code is already available";

	@Autowired
	private LovRepositoryExt lovRepository;

	@Autowired
	private LovServiceImpl lovServiceImp;

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;

	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@Override
	public LovTypesDto getProductLovTypes() {
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
	public LovDto getProductLov(String lovType) {
		List<ProdLovDaoExt> prodLovList = lovRepository.findByLovType(lovType);
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!prodLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoList = new ArrayList<>();
			prodLovList.forEach(prodLov -> keyValueDtoList
					.add((KeyValueDto) MapperUtil.getObjectMapping(prodLov, new KeyValueDto())));
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

		ProdLovDaoExt prodLovCriteria = new ProdLovDaoExt();
		prodLovCriteria.setLovType(lovCreateDto.getLovType());
		prodLovCriteria.setCode(lovCreateDto.getCode());

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ProdLovDaoExt> criteria = Example.of(prodLovCriteria, matcher);

		Optional<ProdLovDaoExt> prodLovOpt = lovRepository.findOne(criteria);

		if (!prodLovOpt.isEmpty()) {

			throw new ServiceException(LOVTYPE_AND_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_016);

		}

		ProdLovDaoExt prodLov = (ProdLovDaoExt) MapperUtil.getObjectMapping(lovCreateDto, new ProdLovDaoExt());

		prodLov.setIsActive(true);
		prodLov.setLovType(lovCreateDto.getLovType());
		List<ProdLovDaoExt> prodLovList = new ArrayList<>();
		prodLovList.add(prodLov);
		Map<String, SyncStagingDto> syncStagingDto = lovServiceImp.saveLovAndStaging(prodLovList,
				ProductOperationCodes.PRODUCT_LOV_ADD);

		syncDataService.publishProductMessages(syncStagingDto);

		return lovCreateDto;

	}

	/**
	 * @param prodLovList
	 * @param operation
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveLovAndStaging(List<ProdLovDaoExt> prodLovList, String operation) {
		prodLovList = lovRepository.saveAll(prodLovList);
		List<SyncData> prodLovSyncData = new ArrayList<>();
		ProdLovSyncDtoExt syncDtoExt = new ProdLovSyncDtoExt();
		prodLovSyncData.add(DataSyncUtil.createSyncData(syncDtoExt.getDtoExts(prodLovList), 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getProductSyncStagingMap(prodLovSyncData, operation, destinations, true,
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
		List<ProdLovDaoExt> prodLovList = lovRepository.findByLovType(lovType);
		int size = prodLovList.size();
		List<KeyValueDto> keyValueDtoList = lovUpdateDto.getValues();
		int sizeDto = keyValueDtoList.size();
		for (int i = 0; i < sizeDto; i++) {
			Integer index = null;
			for (int j = 0; j < size; j++) {
				if (prodLovList.get(j).getCode().equalsIgnoreCase(keyValueDtoList.get(i).getCode())) {
					index = j;
					break;
				}
			}
			if (index != null) {
				ProdLovDaoExt prodLov = prodLovList.get(index);
				prodLov.setValue(keyValueDtoList.get(i).getValue());
				prodLov.setIsActive(keyValueDtoList.get(i).getIsActive());
				prodLov.setSrcSyncId(prodLov.getSrcSyncId() + 1);
				prodLovList.set(index, prodLov);
			} else {
				ProdLovDaoExt prodLov = new ProdLovDaoExt();
				prodLov.setId(UUID.randomUUID().toString());
				prodLov.setLovType(lovType);
				prodLov.setCode(keyValueDtoList.get(i).getCode());
				prodLov.setValue(keyValueDtoList.get(i).getValue());
				prodLov.setIsActive(keyValueDtoList.get(i).getIsActive());
				prodLovList.add(prodLov);
			}
		}
		Map<String, SyncStagingDto> syncStagingDto = lovServiceImp.saveLovAndStaging(prodLovList,
				ProductOperationCodes.PRODUCT_LOV_UPDATE);
		syncDataService.publishProductMessages(syncStagingDto);
		LovDto lovDto = new LovDto();
		lovDto.setLovType(lovType);
		if (!prodLovList.isEmpty()) {
			List<KeyValueDto> keyValueDtoResList = new ArrayList<>();
			prodLovList.forEach(prodLov -> keyValueDtoResList
					.add((KeyValueDto) MapperUtil.getObjectMapping(prodLov, new KeyValueDto())));
			lovDto.setResults(keyValueDtoResList);
		} else {
			lovDto.setResults(new ArrayList<KeyValueDto>());
		}
		return lovDto;
	}
}
