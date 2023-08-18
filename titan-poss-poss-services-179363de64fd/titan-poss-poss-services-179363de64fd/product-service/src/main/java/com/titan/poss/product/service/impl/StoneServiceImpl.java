/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service.impl;

import java.math.BigDecimal;
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
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.dao.StoneTypeDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.StoneDto;
import com.titan.poss.product.dto.request.StoneUpdateDto;
import com.titan.poss.product.repository.ProductSyncStagingRepository;
import com.titan.poss.product.repository.StoneRepositoryExt;
import com.titan.poss.product.service.StoneService;
import com.titan.poss.product.sync.dto.StoneSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("stoneService")
public class StoneServiceImpl implements StoneService {

	private static final String ERR_PRO_008 = "ERR-PRO-008";

	private static final String NO_STONE_DETAILS_FOUND_FOR_THE_REQUESTED_STONECODE = "No Stone details found for the requested stoneCode";

	private static final String ERR_PRO_019 = "ERR-PRO-019";

	private static final String STONE_CODE_IS_ALREADY_AVAILABLE = "StoneCode is already available";

	@Autowired
	private StoneRepositoryExt stoneRepository;

	@Autowired
	private ProductSyncDataServiceImpl syncDataService;

	@Autowired
	private ProductSyncStagingRepository productSyncStagingRepository;

	@Autowired
	private StoneServiceImpl stoneService;

	/**
	 * This method will return the list of Stone details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<StoneDto>>
	 */
	@Override
	public PagedRestResponse<List<StoneDto>> listStone(Boolean isActive, Pageable pageable) {
		StoneDao stoneCriteria = new StoneDao();
		stoneCriteria.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StoneDao> criteria = Example.of(stoneCriteria, matcher);
		Page<StoneDao> stoneList = stoneRepository.findAll(criteria, pageable);
		List<StoneDto> stoneDtoList = new ArrayList<>();
		stoneList.forEach(stone -> {
			StoneDto stoneDto = (StoneDto) MapperUtil.getObjectMapping(stone, new StoneDto());
			stoneDtoList.add(getStoneDepends(stone, stoneDto));
		});
		return (new PagedRestResponse<>(stoneDtoList, stoneList));
	}

	/**
	 * This method will return the Stone details based on the stoneCode.
	 * 
	 * @param stoneCode
	 * @return StoneDto
	 */
	@Override
	public StoneDto getStone(String stoneCode) {
		StoneDao stone = stoneRepository.findOneByStoneCode(stoneCode);
		if (stone == null) {
			throw new ServiceException(NO_STONE_DETAILS_FOUND_FOR_THE_REQUESTED_STONECODE, ERR_PRO_008);
		}
		StoneDto stoneDto = (StoneDto) MapperUtil.getObjectMapping(stone, new StoneDto());
		return getStoneDepends(stone, stoneDto);
	}

	/**
	 * This method will add the Stone depends to the StoneDto from the Stone and
	 * returns StoneDto.
	 * 
	 * @param stone
	 * @param stoneDto
	 * @return StoneDto
	 */
	private StoneDto getStoneDepends(StoneDao stone, StoneDto stoneDto) {

		stoneDto.setStoneTypeCode(stone.getStoneType().getStoneTypeCode());
		return stoneDto;

	}

	/**
	 * This method will save the Stone details.
	 * 
	 * @param stoneDto
	 * @return StoneDto
	 */
	@Override
	public StoneDto addStone(StoneDto stoneDto) {
		StoneDao stone = stoneRepository.findOneByStoneCode(stoneDto.getStoneCode());
		if (stone != null) {
			throw new ServiceException(STONE_CODE_IS_ALREADY_AVAILABLE, ERR_PRO_019);
		}
		stone = (StoneDao) MapperUtil.getObjectMapping(stoneDto, new StoneDao());
		stone.setSrcSyncId(0);
		stone.setDestSyncId(0);
		stone.setRatePerCarat(BigDecimal.TEN);
		SyncStagingDto data = stoneService.saveStoneToDB(addStoneDepends(stone, stoneDto), stoneDto,
				ProductOperationCodes.STONE_ADD);
		syncDataService.publishProductMessagesToQueue(data);
		return stoneDto;
	}

	/**
	 * This method will add the Stone depends to the Stone from the StoneDto and
	 * returns Stone.
	 * 
	 * @param stone
	 * @param stoneDto
	 * @return Stone
	 */
	private StoneDao addStoneDepends(StoneDao stone, StoneDto stoneDto) {

		String stoneTypeCode = stoneDto.getStoneTypeCode();

		StoneTypeDao stoneType = new StoneTypeDao();
		stoneType.setStoneTypeCode(stoneTypeCode);

		stone.setStoneType(stoneType);

		return stone;

	}

	/**
	 * This method will update the Stone details.
	 * 
	 * @param stoneCode
	 * @param stoneUpdateDto
	 * @return StoneDto
	 */
	@Override
	public StoneDto updateStone(String stoneCode, StoneUpdateDto stoneUpdateDto) {
		StoneDao stone = stoneRepository.findOneByStoneCode(stoneCode);
		if (stone == null) {
			throw new ServiceException(NO_STONE_DETAILS_FOUND_FOR_THE_REQUESTED_STONECODE, ERR_PRO_008);
		}
		stone = (StoneDao) MapperUtil.getObjectMapping(stoneUpdateDto, stone);
		StoneDto stoneDto = (StoneDto) MapperUtil.getObjectMapping(stoneUpdateDto, new StoneDto());
		stone.setSrcSyncId(stone.getSrcSyncId() + 1);
		SyncStagingDto data = stoneService.saveStoneToDB(stone, stoneDto, ProductOperationCodes.STONE_UPDATE);
		syncDataService.publishProductMessagesToQueue(data);
		stoneDto = (StoneDto) MapperUtil.getObjectMapping(stone, new StoneDto());
		return getStoneDepends(stone, stoneDto);
	}

	/**
	 * @param stoneDto
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveStoneToDB(StoneDao stoneDao, StoneDto stoneDto, String operation) {
		StoneDao savedStone = stoneRepository.save(stoneDao);
		List<SyncData> stoneSyncData = new ArrayList<>();
		StoneSyncDto stoneSyncDto = new StoneSyncDto(savedStone);
		stoneSyncData.add(DataSyncUtil.createSyncData(stoneSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		MessageRequest stoneMsgRequest = DataSyncUtil.createMessageRequest(stoneSyncData, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		String requestBody = MapperUtil.getJsonString(stoneMsgRequest);
		syncStagingDto.setMessageRequest(stoneMsgRequest);
		SyncStaging stoneStaggingMsg = new SyncStaging();
		stoneStaggingMsg.setMessage(requestBody);
		stoneStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		stoneStaggingMsg = productSyncStagingRepository.save(stoneStaggingMsg);
		syncStagingDto.setId(stoneStaggingMsg.getId());
		return syncStagingDto;
	}

	@Override
	public StoneDao getStoneDao(String stoneCode) {
		return stoneRepository.findOneByStoneCode(stoneCode);
	}

}
