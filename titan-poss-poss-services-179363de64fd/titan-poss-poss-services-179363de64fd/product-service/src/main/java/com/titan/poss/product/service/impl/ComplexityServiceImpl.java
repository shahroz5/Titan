/*  
s * Copyright 2019. Titan Company Limited
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
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.ComplexityDto;
import com.titan.poss.product.dto.request.ComplexityUpdateDto;
import com.titan.poss.product.dto.response.ComplexityLiteDto;
import com.titan.poss.product.repository.ComplexityRepositoryExt;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.service.ComplexityService;
import com.titan.poss.product.sync.dto.ComplexitySyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("complexityService")
public class ComplexityServiceImpl implements ComplexityService {

	private static final String ERR_PRO_003 = "ERR-PRO-003";

	private static final String NO_COMPLEXITY_DETAILS_FOUND_FOR_THE_REQUESTED_COMPLEXITYCODE = "No Complexity details found for the requested complexityCode";

	private static final String ERR_PRO_025 = "ERR-PRO-025";

	private static final String COMPLEXITY_CODE_IS_ALREADY_AVAILABLE = "ComplexityCode is already available";


	@Autowired
	private ComplexityRepositoryExt complexityDaoRepository;

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;
	
	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;
	
	@Autowired
	private ComplexityServiceImpl complexityService;


	/**
	 * This method will return the list of Complexity details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ComplexityDto>>
	 */
	@Override
	public PagedRestResponse<List<ComplexityDto>> listComplexity(Boolean isActive, Pageable pageable) {

		ComplexityDao complexityCriteria = new ComplexityDao();
		complexityCriteria.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ComplexityDao> criteria = Example.of(complexityCriteria, matcher);

		Page<ComplexityDao> complexityList = complexityDaoRepository.findAll(criteria, pageable);

		List<ComplexityDto> complexityDtoList = new ArrayList<>();

		complexityList.forEach(complexity -> complexityDtoList
				.add((ComplexityDto) MapperUtil.getObjectMapping(complexity, new ComplexityDto())));

		return (new PagedRestResponse<>(complexityDtoList, complexityList));
	}





	/**
	 * This method will return the list of Complexity details based on isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<ComplexityLiteDto>>
	 */
	@Override
	public PagedRestResponse<List<ComplexityLiteDto>> listComplexityLite(Boolean isPageable, Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		ComplexityDao complexityCriteria = new ComplexityDao();
		complexityCriteria.setIsActive(true);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ComplexityDao> criteria = Example.of(complexityCriteria, matcher);

		Page<ComplexityDao> complexityList = complexityDaoRepository.findAll(criteria, pageable);

		List<ComplexityLiteDto> complexities = new ArrayList<>();

		complexityList.stream().filter(c -> c.getIsActive().equals(true)).forEach(complexity -> complexities
				.add((ComplexityLiteDto) MapperUtil.getObjectMapping(complexity, new ComplexityLiteDto())));

		return (new PagedRestResponse<>(complexities, complexityList));


	}





	/**
	 * This method will return the Complexity details based on the complexityCode.
	 * 
	 * @param complexityCode
	 * @return ComplexityDto
	 */
	@Override
	public ComplexityDto getComplexity(String complexityCode) {
		ComplexityDao complexity = complexityDaoRepository.findOneByComplexityCode(complexityCode);

		if (complexity == null) {
			throw new ServiceException(NO_COMPLEXITY_DETAILS_FOUND_FOR_THE_REQUESTED_COMPLEXITYCODE, ERR_PRO_003);
		}

		return (ComplexityDto) MapperUtil.getObjectMapping(complexity, new ComplexityDto());
	}





	/**
	 * This method will save the Complexity details.
	 * 
	 * @param complexityDto
	 * @return ComplexityDto
	 */
	@Override
	public ComplexityDto addComplexity(ComplexityDto complexityDto) {
		ComplexityDao complexity = complexityDaoRepository.findOneByComplexityCode(complexityDto.getComplexityCode());

		if (complexity != null) {
			throw new ServiceException(COMPLEXITY_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_025);
		}

		complexity = (ComplexityDao) MapperUtil.getObjectMapping(complexityDto, new ComplexityDao());
		complexity.setSrcSyncId(0);
		complexity.setDestSyncId(0);
		SyncStagingDto data = complexityService.saveComplexityToDB(complexity, ProductOperationCodes.COMPLEXITY_ADD);

		// Publishing to data sync queue
		syncDataService.publishProductMessagesToQueue(data);
		return complexityDto;
	}





	/**
	 * This method will update the Complexity details.
	 * 
	 * @param complexityCode
	 * @param complexityUpdateDto
	 * @return ComplexityDto
	 */
	@Override
	public ComplexityDto updateComplexity(String complexityCode, ComplexityUpdateDto complexityUpdateDto) {
		ComplexityDao complexity = complexityDaoRepository.findOneByComplexityCode(complexityCode);

		if (complexity == null) {
			throw new ServiceException(NO_COMPLEXITY_DETAILS_FOUND_FOR_THE_REQUESTED_COMPLEXITYCODE, ERR_PRO_003);
		}

		complexity = (ComplexityDao) MapperUtil.getObjectMapping(complexityUpdateDto, complexity);
		complexity.setSrcSyncId(complexity.getSrcSyncId() + 1);
		SyncStagingDto data = complexityService.saveComplexityToDB(complexity, ProductOperationCodes.COMPLEXITY_UPDATE);

		// Publishing to data sync queue
		syncDataService.publishProductMessagesToQueue(data);
		return (ComplexityDto) MapperUtil.getObjectMapping(complexity, new ComplexityDto());
	}
	
	/**
	 * @param complexityDto
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveComplexityToDB(ComplexityDao complexityDao, String operation) {
		ComplexityDao savedComplexity = complexityDaoRepository.save(complexityDao);
		List<SyncData> complexitySyncData = new ArrayList<>();
		ComplexitySyncDto complexitySyncDto = new ComplexitySyncDto(savedComplexity);
		complexitySyncData.add(DataSyncUtil.createSyncData(complexitySyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest complexityMsgRequest = DataSyncUtil.createMessageRequest(complexitySyncData, operation,
				destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(complexityMsgRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(complexityMsgRequest);
		// saving to staging table
		SyncStaging complexityStaggingMsg = new SyncStaging();
		complexityStaggingMsg.setMessage(requestBody);
		complexityStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		complexityStaggingMsg = productSyncStagingRepository.save(complexityStaggingMsg);
		syncStagingDto.setId(complexityStaggingMsg.getId());
		return syncStagingDto;
	}


	@Override
	public ComplexityDao getComplexityDao(String complexityCode) {
		return complexityDaoRepository.findOneByComplexityCode(complexityCode);
	}

}
