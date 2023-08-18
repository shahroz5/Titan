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
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.dao.MaterialTypeDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.MaterialDto;
import com.titan.poss.product.dto.request.MaterialUpdateDto;
import com.titan.poss.product.repository.MaterialRepositoryExt;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.service.MaterialService;
import com.titan.poss.product.sync.dto.MaterialSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("materialService")
public class MaterialServiceImpl implements MaterialService {

	private static final String ERR_PRO_006 = "ERR-PRO-006";

	private static final String NO_MATERIAL_DETAILS_FOUND_FOR_THE_REQUESTED_MATERIALCODE = "No Material details found for the requested materialCode";

	private static final String ERR_PRO_021 = "ERR-PRO-021";

	private static final String MATERIAL_CODE_IS_ALREADY_AVAILABLE = "MaterialCode is already available";

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;

	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;

	@Autowired
	private MaterialRepositoryExt materialRepository;

	@Autowired
	private MaterialServiceImpl materialService;

	@Override
	public PagedRestResponse<List<MaterialDto>> listMaterial(String materialTypeCode, Boolean isActive,
			Pageable pageable) {
		MaterialDao materialCriteria = new MaterialDao();
		MaterialTypeDao materialTypeDao = new MaterialTypeDao();
		materialTypeDao.setMaterialTypeCode(materialTypeCode);
		materialCriteria.setMaterialType(materialTypeDao);
		materialCriteria.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<MaterialDao> criteria = Example.of(materialCriteria, matcher);
		Page<MaterialDao> materialList = materialRepository.findAll(criteria, pageable);
		List<MaterialDto> materialDtoList = new ArrayList<>();
		for (MaterialDao materialDao : materialList) {
			MaterialDto materialDto = (MaterialDto) MapperUtil.getObjectMapping(materialDao, new MaterialDto());
			materialDto.setMaterialTypeCode(materialDao.getMaterialType().getMaterialTypeCode());
			materialDtoList.add(materialDto);
		}
		return (new PagedRestResponse<>(materialDtoList, materialList));
	}

	@Override
	public MaterialDto getMaterial(String materialCode) {
		MaterialDao material = materialRepository.findOneByMaterialCode(materialCode);
		if (material == null) {
			throw new ServiceException(NO_MATERIAL_DETAILS_FOUND_FOR_THE_REQUESTED_MATERIALCODE, ERR_PRO_006);
		}
		MaterialDto materialDto = (MaterialDto) MapperUtil.getObjectMapping(material, new MaterialDto());
		materialDto.setMaterialTypeCode(material.getMaterialType().getMaterialTypeCode());
		return materialDto;
	}

	@Override
	public MaterialDto addMaterial(MaterialDto materialDto) {
		MaterialDao material = materialRepository.findOneByMaterialCode(materialDto.getMaterialCode());
		if (material != null) {
			throw new ServiceException(MATERIAL_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_021);
		}
		material = (MaterialDao) MapperUtil.getObjectMapping(materialDto, new MaterialDao());
		MaterialTypeDao materialTypeDao = new MaterialTypeDao();
		materialTypeDao.setMaterialTypeCode(materialDto.getMaterialTypeCode());
		material.setMaterialType(materialTypeDao);
		material.setSrcSyncId(0);
		material.setDestSyncId(0);
		SyncStagingDto data = materialService.saveMaterialToDB(material, ProductOperationCodes.MATERIAL_ADD);
		syncDataService.publishProductMessagesToQueue(data);
		return materialDto;
	}

	@Override
	public MaterialDto updateMaterial(String materialCode, MaterialUpdateDto materialUpdateDto) {
		MaterialDao material = materialRepository.findOneByMaterialCode(materialCode);
		if (material == null) {
			throw new ServiceException(NO_MATERIAL_DETAILS_FOUND_FOR_THE_REQUESTED_MATERIALCODE, ERR_PRO_006);
		}
		material = (MaterialDao) MapperUtil.getObjectMapping(materialUpdateDto, material);
		MaterialTypeDao materialTypeDao = new MaterialTypeDao();
		materialTypeDao.setMaterialTypeCode(materialUpdateDto.getMaterialTypeCode());
		material.setMaterialType(materialTypeDao);
		material.setSrcSyncId(material.getSrcSyncId() + 1);
		SyncStagingDto data = materialService.saveMaterialToDB(material, ProductOperationCodes.MATERIAL_UPDATE);
		syncDataService.publishProductMessagesToQueue(data);
		MaterialDto materialDto = (MaterialDto) MapperUtil.getObjectMapping(material, new MaterialDto());
		materialDto.setMaterialTypeCode(material.getMaterialType().getMaterialTypeCode());
		return materialDto;
	}

	/**
	 * @param materialTypeDao
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveMaterialToDB(MaterialDao materialDao, String operation) {
		MaterialDao savedMaterialType = materialRepository.save(materialDao);
		List<SyncData> syncDataList = new ArrayList<>();
		MaterialSyncDto materialSyncDto = new MaterialSyncDto(savedMaterialType);
		syncDataList.add(DataSyncUtil.createSyncData(materialSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest materialMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(materialMsgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(materialMsgRequest);
		SyncStaging materialStaggingMsg = new SyncStaging();
		materialStaggingMsg.setMessage(requestBody);
		materialStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		materialStaggingMsg = productSyncStagingRepository.save(materialStaggingMsg);
		syncStagingDto.setId(materialStaggingMsg.getId());
		return syncStagingDto;
	}

}
