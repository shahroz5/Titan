/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

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
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.MaterialTypeDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.MaterialTypeDto;
import com.titan.poss.product.dto.request.MaterialTypeUpdateDto;
import com.titan.poss.product.dto.response.MaterialLiteDto;
import com.titan.poss.product.repository.MaterialTypeRepositoryExt;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.service.MaterialTypeService;
import com.titan.poss.product.sync.dto.MaterialTypeSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("materialTypeService")
public class MaterialTypeServiceImpl implements MaterialTypeService {

	private static final String ERR_PRO_006 = "ERR-PRO-006";

	private static final String NO_MATERIAL_TYPE_DETAILS_FOUND_FOR_THE_REQUESTED_MATERIALCODE = "No Material type details found for the requested materialCode";

	private static final String ERR_PRO_021 = "ERR-PRO-021";

	private static final String MATERIAL_TYPE_CODE_IS_ALREADY_AVAILABLE = "MaterialTypeCode is already available";

	@Autowired
	private MaterialTypeRepositoryExt materialTypeRepository;

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;

	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;

	@Autowired
	private MaterialTypeServiceImpl materialTypeService;

	/**
	 * This method will return the list of Material type details based on the
	 * materialType and isActive.
	 * 
	 * @param materialGroup
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MaterialTypeDto>>
	 */
	@Override
	public PagedRestResponse<List<MaterialTypeDto>> listMaterial(Boolean isActive, Pageable pageable) {

		MaterialTypeDao materialCriteria = new MaterialTypeDao();
		materialCriteria.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<MaterialTypeDao> criteria = Example.of(materialCriteria, matcher);

		Page<MaterialTypeDao> materialList = materialTypeRepository.findAll(criteria, pageable);

		List<MaterialTypeDto> materialDtoList = new ArrayList<>();

		materialList.forEach(material -> materialDtoList
				.add((MaterialTypeDto) MapperUtil.getObjectMapping(material, new MaterialTypeDto())));

		return (new PagedRestResponse<>(materialDtoList, materialList));
	}

	/**
	 * This method will return the list of Material details based on the
	 * materialType and isPageable.
	 * 
	 * @param materialType
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<MaterialLiteDto>>
	 */
	@Override
	public PagedRestResponse<List<MaterialLiteDto>> listMaterialLite(Boolean isPageable, Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		MaterialTypeDao materialCriteria = new MaterialTypeDao();
		materialCriteria.setIsActive(true);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<MaterialTypeDao> criteria = Example.of(materialCriteria, matcher);

		Page<MaterialTypeDao> materialList = materialTypeRepository.findAll(criteria, pageable);

		List<MaterialLiteDto> materials = new ArrayList<>();

		materialList.forEach(material -> materials
				.add((MaterialLiteDto) MapperUtil.getObjectMapping(material, new MaterialLiteDto())));

		return (new PagedRestResponse<>(materials, materialList));

	}

	/**
	 * This method will return the Material Type details based on the
	 * materialTypeCode.
	 * 
	 * @param materialTypeCode
	 * @return MaterialTypeDto
	 */
	@Override
	public MaterialTypeDto getMaterial(String materialTypeCode) {

		MaterialTypeDao material = materialTypeRepository.findOneByMaterialTypeCode(materialTypeCode);

		if (material == null) {
			throw new ServiceException(NO_MATERIAL_TYPE_DETAILS_FOUND_FOR_THE_REQUESTED_MATERIALCODE, ERR_PRO_006);

		}

		return (MaterialTypeDto) MapperUtil.getObjectMapping(material, new MaterialTypeDto());
	}

	/**
	 * This method will save the Material type details.
	 * 
	 * @param materialTypeDto
	 * @return MaterialTypeDto
	 */
	@Override
	public MaterialTypeDto addMaterial(MaterialTypeDto materialTypeDto) {

		MaterialTypeDao material = materialTypeRepository
				.findOneByMaterialTypeCode(materialTypeDto.getMaterialTypeCode());

		if (material != null) {
			throw new ServiceException(MATERIAL_TYPE_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_021);

		}

		material = (MaterialTypeDao) MapperUtil.getObjectMapping(materialTypeDto, new MaterialTypeDao());
		material.setSrcSyncId(0);
		material.setDestSyncId(0);
		SyncStagingDto data = materialTypeService.saveMaterialToDB(material, ProductOperationCodes.MATERIAL_TYPE_ADD);
		syncDataService.publishProductMessagesToQueue(data);
		return materialTypeDto;
	}

	/**
	 * This method will update the Material type details.
	 * 
	 * @param materialTypeCode
	 * @param materialUpdateDto
	 * @return MaterialTypeDto
	 */
	@Override
	public MaterialTypeDto updateMaterial(String materialTypeCode, MaterialTypeUpdateDto materialUpdateDto) {

		MaterialTypeDao material = materialTypeRepository.findOneByMaterialTypeCode(materialTypeCode);

		if (material == null) {
			throw new ServiceException(NO_MATERIAL_TYPE_DETAILS_FOUND_FOR_THE_REQUESTED_MATERIALCODE, ERR_PRO_006);
		}

		material = (MaterialTypeDao) MapperUtil.getObjectMapping(materialUpdateDto, material);
		material.setSrcSyncId(material.getSrcSyncId() + 1);
		SyncStagingDto data = materialTypeService.saveMaterialToDB(material,
				ProductOperationCodes.MATERIAL_TYPE_UPDATE);
		syncDataService.publishProductMessagesToQueue(data);
		return (MaterialTypeDto) MapperUtil.getObjectMapping(material, new MaterialTypeDto());
	}

	/**
	 * @param materialTypeDao
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveMaterialToDB(MaterialTypeDao materialTypeDao, String operation) {
		MaterialTypeDao savedMaterialType = materialTypeRepository.save(materialTypeDao);
		List<SyncData> syncDataList = new ArrayList<>();
		MaterialTypeSyncDto materialTypeSyncDto = new MaterialTypeSyncDto(savedMaterialType);
		syncDataList.add(DataSyncUtil.createSyncData(materialTypeSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest materialTypeMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(materialTypeMsgRequest);
		syncStagingDto.setMessageRequest(materialTypeMsgRequest);
		SyncStaging materialTypeStaggingMsg = new SyncStaging();
		materialTypeStaggingMsg.setMessage(requestBody);
		materialTypeStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		materialTypeStaggingMsg = productSyncStagingRepository.save(materialTypeStaggingMsg);
		syncStagingDto.setId(materialTypeStaggingMsg.getId());
		return syncStagingDto;
	}

}
