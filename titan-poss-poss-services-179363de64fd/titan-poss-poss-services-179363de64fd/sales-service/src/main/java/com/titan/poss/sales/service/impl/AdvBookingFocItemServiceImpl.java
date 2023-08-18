/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.FocSchemeIndividualDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.FocSchemesDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.FocDetailAbDto;
import com.titan.poss.sales.dto.FocDetailAbRequestDto;
import com.titan.poss.sales.dto.FocSchemeDetailsJsonDto;
import com.titan.poss.sales.dto.FocSchemesAbCreateDto;
import com.titan.poss.sales.dto.constants.FocStatusEnum;
import com.titan.poss.sales.repository.FocDetailsRepositoryExt;
import com.titan.poss.sales.repository.FocSchemesRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.AdvBookingFocItemService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.EngineService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class AdvBookingFocItemServiceImpl implements AdvBookingFocItemService {

	private static final String RECORD_NOT_FOUND = "Record(s) Not found";
	private static final String ERR_CORE_039 = "ERR-CORE-039";

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	SalesTxnRepositoryExt salesTxnRepositoryExt;

	@Autowired
	private FocSchemesRepositoryExt focSchemesRepository;

	@Autowired
	private FocDetailsRepositoryExt focDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Override
	@Transactional
	public List<FocSchemesAbCreateDto> addFocDetails(String id, String txnType, String subTxnType,
			FocDetailAbDto focDetails) {

		SalesTxnDaoExt salesTxnDao = salesTxnRepositoryExt.findByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(salesTxnDao.getStatus());

		List<FocSchemesDaoExt> focSchemeDaoList = new ArrayList<>();
		for (FocDetailAbRequestDto focDetail : focDetails.getFocScheme()) {

			FocSchemesDaoExt focSchemeDao = new FocSchemesDaoExt();
			// Map FOC scheme details
			focSchemeDao = mapFocSchemeDetails(salesTxnDao, focDetail);
			focSchemeDao.setStatus(FocStatusEnum.ISSUED.toString());
			focSchemesRepository.save(focSchemeDao);
			focSchemeDaoList.add(focSchemeDao);

		}

		List<FocSchemesAbCreateDto> focSchemesAbCreateDtos = new ArrayList<>();
		focSchemeDaoList.forEach(dao -> focSchemesAbCreateDtos.add(getResponse(dao)));

		return focSchemesAbCreateDtos;
	}

	/**
	 * @param focSchemeDao
	 * @return
	 */
	private FocSchemesAbCreateDto getResponse(FocSchemesDaoExt focSchemeDao) {
		FocSchemesAbCreateDto abCreateDto = (FocSchemesAbCreateDto) MapperUtil.getObjectMapping(focSchemeDao,
				new FocSchemesAbCreateDto());
		abCreateDto.setPurchaseItemDetails(MapperUtil.mapObjToClass(focSchemeDao.getPurchaseItems(), JsonData.class));

		abCreateDto.setSchemeDetails(MapperUtil.mapObjToClass(focSchemeDao.getSchemeDetails(), JsonData.class));
		abCreateDto.setFocItemDetails(MapperUtil.mapObjToClass(focSchemeDao.getFocItemDetails(), JsonData.class));
		abCreateDto.setHeaderConfigDetails(
				MapperUtil.mapObjToClass(focSchemeDao.getHeaderConfigDetails(), JsonData.class));
		abCreateDto.setRowConfigDetails(MapperUtil.mapObjToClass(focSchemeDao.getRowConfigDetails(), JsonData.class));
		abCreateDto.setProductGroupDetails(
				MapperUtil.mapObjToClass(focSchemeDao.getProductGroupDetails(), JsonData.class));

		abCreateDto.setSalesTxnId(focSchemeDao.getSalesTxn().getId());
		return abCreateDto;
	}

	public FocSchemesDaoExt mapFocSchemeDetails(SalesTxnDaoExt salesTxnDao, FocDetailAbRequestDto focDetail) {
		FocSchemesDaoExt focSchemesDao = (FocSchemesDaoExt) MapperUtil.getObjectMapping(focDetail,
				new FocSchemesDaoExt());
		focSchemesDao.setSalesTxn(salesTxnDao);
		focSchemesDao.setPurchaseItems(MapperUtil.getStringFromJson(focDetail.getPurchaseItemDetails()));

		// Fetch & store scheme Details based on scheme Id & scheme details Id
		FocSchemeDetailsJsonDto focSchemeDetailsJsonDto = MapperUtil.getObjectMapperInstance().convertValue(focDetail,
				FocSchemeDetailsJsonDto.class);
		JsonData jsonData = new JsonData("FOC_SCHEME_DETAILS", focSchemeDetailsJsonDto);
		focSchemesDao.setSchemeDetails(MapperUtil.getStringFromJson(jsonData));

		// @formatter:off
		// Fetch FOC config details and save for future use in GRN
		
	//	log.info("Get FOC config details by config id Request param - {}", focSchemeDetailsJsonDto.getSchemeId());
		
		FocSchemeIndividualDto focSchemeConfigDetails = engineService
				.getFocSchemeConfigById(focSchemeDetailsJsonDto.getSchemeId());
		
   //		log.info("Get FOC config details by config id Response DTO - {}", MapperUtil.getJsonString(focSchemeConfigDetails));
		
		focSchemesDao.setHeaderConfigDetails(new JsonData("HeaderConfigDetails", focSchemeConfigDetails.getScheme()).toString());
		focSchemesDao.setRowConfigDetails(new JsonData("RowConfigDetails", focSchemeConfigDetails.getSchemeDetails()).toString());
		focSchemesDao
				.setProductGroupDetails(new JsonData("ProductGroupDetails", focSchemeConfigDetails.getSchemeProductMapping()).toString());
		focSchemesDao.setFocItemDetails(new JsonData("FocItemDetails", focSchemeConfigDetails.getSchemeItemMapping()).toString());
		// @formatter:on

		return focSchemesDao;
	}

	@Override
	@Transactional
	public ListResponse<FocSchemesAbCreateDto> getFocDetails(String id, String txnType, String subTxnType) {

		List<FocSchemesDaoExt> focSchemesDaoList = focSchemesRepository.findBySalesTxnId(id);
		SalesTxnDaoExt salesTxnDao = salesTxnRepositoryExt.findByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
		// txnType, subTxnType);
		if (focSchemesDaoList.isEmpty()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039);
		}
		if (salesTxnDao == null) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039);
		}
		List<FocSchemesAbCreateDto> responseDtos = new ArrayList<>();
		focSchemesDaoList.forEach(focSchemeDao -> responseDtos.add(getResponse(focSchemeDao)));

		return new ListResponse<>(responseDtos);
	}

	@Transactional
	@Override
	public void deleteFocItemFromCM(String id, List<String> focSchemeId, String txnType, String subTxnType) {

		if (id != null) {
			focDetailsRepository.deleteAllBySalesTxnId(id);
			focDetailsRepository.flush();
			focSchemesRepository.deleteAllBySalesTxnId(id);
			focSchemesRepository.flush();
		} else {
			focDetailsRepository.deleteAllByFocSchemeId(focSchemeId);
			focDetailsRepository.flush();
			focSchemesRepository.deleteAllById(focSchemeId);

		}
	}

}
