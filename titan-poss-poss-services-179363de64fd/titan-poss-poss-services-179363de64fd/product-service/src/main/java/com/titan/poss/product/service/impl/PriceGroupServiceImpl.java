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
import com.titan.poss.product.dao.PriceGroupDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.PriceGroupDto;
import com.titan.poss.product.dto.request.PriceGroupUpdateDto;
import com.titan.poss.product.dto.response.PriceGroupLiteDto;
import com.titan.poss.product.repository.PriceGroupRepositoryExt;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.service.PriceGroupService;
import com.titan.poss.product.sync.dto.PriceGroupSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("priceGroupService")
public class PriceGroupServiceImpl implements PriceGroupService {

	private static final String ERR_PRO_011 = "ERR-PRO-011";

	private static final String NO_PRICEGROUP_DETAILS_FOUND_FOR_THE_REQUESTED_PRICEGROUP = "No PriceGroup details found for the requested priceGroup";

	private static final String ERR_PRO_029 = "ERR-PRO-029";

	private static final String PRICEGROUP_IS_ALREADY_AVAILABLE = "PriceGroup is already available";
	

	@Autowired
	private PriceGroupRepositoryExt priceGroupRepository;
	
	@Autowired
	private ProductSyncDataServiceImpl syncDataService;
	
	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;
	
	@Autowired
	private PriceGroupServiceImpl priceGroupService;


	/**
	 * This method will return the list of PriceGroup details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PriceGroupDto>>
	 */
	@Override
	public PagedRestResponse<List<PriceGroupDto>> listPriceGroup(Boolean isActive, Boolean isPageable,
			Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		PriceGroupDao priceGroupCriteria = new PriceGroupDao();
		priceGroupCriteria.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PriceGroupDao> criteria = Example.of(priceGroupCriteria, matcher);

		Page<PriceGroupDao> priceGroupList = priceGroupRepository.findAll(criteria, pageable);

		List<PriceGroupDto> priceGroupDtoList = new ArrayList<>();

		priceGroupList.forEach(priceGroup -> priceGroupDtoList
				.add((PriceGroupDto) MapperUtil.getObjectMapping(priceGroup, new PriceGroupDto())));

		return (new PagedRestResponse<>(priceGroupDtoList, priceGroupList));
	}





	/**
	 * This method will return the PriceGroup details based on the priceGroup.
	 * 
	 * @param priceGroup
	 * @return PriceGroupDto
	 */
	@Override
	public PriceGroupDto getPriceGroup(String priceGroup) {

		PriceGroupDao priceGroupObj = priceGroupRepository.findOneByPriceGroup(priceGroup);

		if (priceGroupObj == null) {
			throw new ServiceException(NO_PRICEGROUP_DETAILS_FOUND_FOR_THE_REQUESTED_PRICEGROUP, ERR_PRO_011);
		}

		return (PriceGroupDto) MapperUtil.getObjectMapping(priceGroupObj, new PriceGroupDto());
	}





	/**
	 * This method will save the PriceGroup details.
	 * 
	 * @param priceGroupDto
	 * @return PriceGroupDto
	 */
	@Override
	public PriceGroupDto addPriceGroup(PriceGroupDto priceGroupDto) {

		PriceGroupDao priceGroup = priceGroupRepository.findOneByPriceGroup(priceGroupDto.getPriceGroup());

		if (priceGroup != null) {
			throw new ServiceException(PRICEGROUP_IS_ALREADY_AVAILABLE, ERR_PRO_029);
		}

		priceGroup = (PriceGroupDao) MapperUtil.getObjectMapping(priceGroupDto, new PriceGroupDao());
		priceGroup.setSrcSyncId(0);
		priceGroup.setDestSyncId(0);
		SyncStagingDto data = priceGroupService.savePriceGroupToDB(priceGroup, ProductOperationCodes.PRICE_GROUP_ADD);
		syncDataService.publishProductMessagesToQueue(data);
		
		return priceGroupDto;
	}





	/**
	 * This method will update the PriceGroup details.
	 * 
	 * @param priceGroup
	 * @param priceGroupUpdateDto
	 * @return PriceGroupDto
	 */
	@Override
	public PriceGroupDto updatePriceGroup(String priceGroup, PriceGroupUpdateDto priceGroupUpdateDto) {

		PriceGroupDao priceGroupObj = priceGroupRepository.findOneByPriceGroup(priceGroup);

		if (priceGroupObj == null) {
			throw new ServiceException(NO_PRICEGROUP_DETAILS_FOUND_FOR_THE_REQUESTED_PRICEGROUP, ERR_PRO_011);
		}

		priceGroupObj = (PriceGroupDao) MapperUtil.getObjectMapping(priceGroupUpdateDto, priceGroupObj);
		priceGroupObj.setSrcSyncId(priceGroupObj.getSrcSyncId() + 1);
		SyncStagingDto data = priceGroupService.savePriceGroupToDB(priceGroupObj,
				ProductOperationCodes.PRICE_GROUP_UPDATE);
		syncDataService.publishProductMessagesToQueue(data);
		return (PriceGroupDto) MapperUtil.getObjectMapping(priceGroupObj, new PriceGroupDto());
	}
	
	/**
	 * @param priceGroupDao
	 * @return
	 */
	@Transactional
	public SyncStagingDto savePriceGroupToDB(PriceGroupDao priceGroupDao, String operation) {
		PriceGroupDao savedPriceGroup = priceGroupRepository.save(priceGroupDao);
		List<SyncData> priceGrpSyncData = new ArrayList<>();
		PriceGroupSyncDto priceGroupSyncDto = new PriceGroupSyncDto(savedPriceGroup);
		priceGrpSyncData.add(DataSyncUtil.createSyncData(priceGroupSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest prcGrpMsgRequest = DataSyncUtil.createMessageRequest(priceGrpSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		syncStagingDto.setMessageRequest(prcGrpMsgRequest);
		String requestBody = MapperUtil.getJsonString(prcGrpMsgRequest);
		SyncStaging prcGrpStaggingMsg = new SyncStaging();
		prcGrpStaggingMsg.setMessage(requestBody);
		prcGrpStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		prcGrpStaggingMsg = productSyncStagingRepository.save(prcGrpStaggingMsg);
		syncStagingDto.setId(prcGrpStaggingMsg.getId());
		return syncStagingDto;
	}

	@Override
	public PagedRestResponse<List<PriceGroupLiteDto>> listPriceGroupLite(Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		PriceGroupDao priceGroupDao = new PriceGroupDao();
		priceGroupDao.setIsActive(true);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PriceGroupDao> criteria = Example.of(priceGroupDao, matcher);

		Page<PriceGroupDao> priceGroupDaoList = priceGroupRepository.findAll(criteria, pageable);

		List<PriceGroupLiteDto> priceGroupLite = new ArrayList<>();

		priceGroupDaoList.stream().filter(p -> p.getIsActive().equals(true)).forEach(price -> priceGroupLite
				.add((PriceGroupLiteDto) MapperUtil.getObjectMapping(price, new PriceGroupLiteDto())));

		return (new PagedRestResponse<>(priceGroupLite, priceGroupDaoList));
	}

}
