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
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.FocSchemeIndividualDto;
import com.titan.poss.core.dto.ManualFocSchemeItemDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.FocSchemesDaoExt;
import com.titan.poss.sales.dto.EligibleFocItemListDto;
import com.titan.poss.sales.dto.FocSchemeDetailsJsonDto;
import com.titan.poss.sales.dto.FocSchemeDto;
import com.titan.poss.sales.dto.PurchaseItemListDto;
import com.titan.poss.sales.dto.constants.FocStatusEnum;
import com.titan.poss.sales.dto.request.FocPendingRequestDto;
import com.titan.poss.sales.dto.response.FocPendingResponseDto;
import com.titan.poss.sales.dto.response.FocSchemeListResponseDto;
import com.titan.poss.sales.dto.response.FocSchemeResponseDto;
import com.titan.poss.sales.repository.FocDetailsRepositoryExt;
import com.titan.poss.sales.repository.FocSchemesRepositoryExt;
import com.titan.poss.sales.service.CashMemoFocSchemeService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service Implementation class w.r.t FOC schemes of cash memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesCashMemoFocSchemeServiceImpl")
public class CashMemoFocSchemeServiceImpl implements CashMemoFocSchemeService {

	private static final String RECORD_NOT_FOUND = "Record(s) Not found";
	private static final String ERR_CORE_039 = "ERR-CORE-039";

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private FocSchemesRepositoryExt focSchemesRepository;

	@Autowired
	private FocDetailsRepositoryExt focDetailsRepository;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private EngineService engineService;

	@Override
	@Transactional
	public FocPendingResponseDto createPendingFocForCM(String id, String txnType, String subTxnType,
			FocPendingRequestDto focSchemes) {

		// only cash memo on hold or open?
		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, txnType, subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(cashMemoDao.getSalesTxnDao(), "FOC not allowed when GHS DV is added.",
				null);

		List<FocSchemesDaoExt> focSchemesDaoList = new ArrayList<>();

		// Delete existing FOC schemes & items before adding FOC to Cash memo each
		// time
		focDetailsRepository.deleteAllBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());
		focSchemesRepository.deleteAllBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());

		focSchemes.getFocSchemes().forEach(focScheme -> {
			FocSchemesDaoExt focSchemesDao = mapFocSchemeDetails(cashMemoDao, focScheme, null);
			focSchemesDao.setStatus(FocStatusEnum.PENDING.toString());
			focSchemesDaoList.add(focSchemesDao);
		});

		focSchemesRepository.saveAll(focSchemesDaoList);

		List<String> focSchemeIdList = new ArrayList<>();

		focSchemesDaoList.forEach(focSchemesDao -> focSchemeIdList.add(focSchemesDao.getId()));

		FocPendingResponseDto focPendingResponseDto = new FocPendingResponseDto();
		focPendingResponseDto.setFocSchemeIds(focSchemeIdList);

		return focPendingResponseDto;
	}

	// Method to map FOC scheme Details
	@Override
	public FocSchemesDaoExt mapFocSchemeDetails(CashMemoDaoExt cashMemoDao, FocSchemeDto focScheme,
			ManualFocSchemeItemDto manualFocSchemeItemDto) {
		FocSchemesDaoExt focSchemesDao = (FocSchemesDaoExt) MapperUtil.getObjectMapping(focScheme,
				new FocSchemesDaoExt());
		focSchemesDao.setSalesTxn(cashMemoDao.getSalesTxnDao());
		focSchemesDao.setPurchaseItems(MapperUtil.getStringFromJson(focScheme.getPurchaseItemDetails()));
		focSchemesDao.setEligibleFocItems(MapperUtil.getStringFromJson(focScheme.getEligibleFocItemDetails()));
		// Fetch eligible weight from first index item, applicable only in case of coins
		if (!StringUtils.isEmpty(focScheme.getEligibleFocItemDetails().getFocItems().get(0).getWeight())) {
			focSchemesDao.setEligibleWeight(focScheme.getEligibleFocItemDetails().getFocItems().get(0).getWeight());
		}
		// Fetch eligible quantity from first index item, applicable only in case of
		// Diamond
		if (!StringUtils.isEmpty(focScheme.getEligibleFocItemDetails().getFocItems().get(0).getQuantity())) {
			focSchemesDao.setEligibleQuantity(focScheme.getEligibleFocItemDetails().getFocItems().get(0).getQuantity());
		}
		// Fetch & store scheme Details based on scheme Id & scheme details Id
		FocSchemeDetailsJsonDto focSchemeDetailsJsonDto = MapperUtil.getObjectMapperInstance().convertValue(focScheme,
				FocSchemeDetailsJsonDto.class);
		JsonData jsonData = new JsonData("FOC_SCHEME_DETAILS", focSchemeDetailsJsonDto);
		focSchemesDao.setSchemeDetails(MapperUtil.getStringFromJson(jsonData));

		// @formatter:off
		// Fetch FOC config details and save for future use in GRN

		log.info("Get FOC config details by config id Request param - {}", focSchemeDetailsJsonDto.getSchemeId());

//		if (manualFocSchemeItemDto == null) {
//
//			List<FocSchemeIndividualDto> listfoc = new ArrayList<>();
//			focScheme.getPurchaseItemDetails().getPurchaseItems().forEach(item -> {
//				FocSchemeIndividualDto focSchemeConfigDetails = engineService
//						.getFocSchemeDetails(focScheme.getSchemeId(), item.getProductGroupCode());
//				listfoc.add(focSchemeConfigDetails);
//				log.info("Get FOC config details by config id Response DTO - {}",
//						MapperUtil.getJsonString(focSchemeConfigDetails));
//			});
//
//			focSchemesDao
//					.setHeaderConfigDetails(new JsonData("HeaderConfigDetails", listfoc.get(0).getScheme()).toString());
//			focSchemesDao.setRowConfigDetails(
//					new JsonData("RowConfigDetails", listfoc.get(0).getSchemeDetails()).toString());
//			focSchemesDao.setProductGroupDetails(
//					new JsonData("ProductGroupDetails", listfoc.get(0).getSchemeProductMapping()).toString());
//			focSchemesDao.setFocItemDetails(
//					new JsonData("FocItemDetails", listfoc.get(0).getSchemeItemMapping()).toString());
//
//		}
//
//		else {
			FocSchemeIndividualDto focSchemeConfigDetails = engineService
					.getFocSchemeConfigById(focSchemeDetailsJsonDto.getSchemeId());

			log.info("Get FOC config details by config id Response DTO - {}",
					MapperUtil.getJsonString(focSchemeConfigDetails));

			focSchemesDao.setHeaderConfigDetails(
					new JsonData("HeaderConfigDetails", focSchemeConfigDetails.getScheme()).toString());
			focSchemesDao.setRowConfigDetails(
					new JsonData("RowConfigDetails", focSchemeConfigDetails.getSchemeDetails()).toString());
			focSchemesDao.setProductGroupDetails(
					new JsonData("ProductGroupDetails", focSchemeConfigDetails.getSchemeProductMapping()).toString());
			focSchemesDao.setFocItemDetails(
					new JsonData("FocItemDetails", focSchemeConfigDetails.getSchemeItemMapping()).toString());

			focSchemesDao
					.setManualFocItemDetails(new JsonData("ManualFocItemDetails", manualFocSchemeItemDto).toString());
//		}
//
//		// @formatter:on

		return focSchemesDao;
	}

	@Override
	public FocSchemeListResponseDto listFocSchemesOfCM(String id, String txnType, String subTxnType) {

		commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, txnType, subTxnType);

		List<FocSchemesDaoExt> focSchemesDaoList = focSchemesRepository.findAllBySalesTxnId(id);

		if (focSchemesDaoList.isEmpty()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039);
		}

		List<FocSchemeResponseDto> focSchemeDtoList = new ArrayList<>();

		focSchemesDaoList.forEach(focSchemeDao -> {
			FocSchemeResponseDto focSchemeDto = (FocSchemeResponseDto) MapperUtil.getObjectMapping(focSchemeDao,
					new FocSchemeResponseDto());
			focSchemeDto.setSalesTxnId(focSchemeDao.getSalesTxn().getId());
			focSchemeDto.setPurchaseItemDetails(MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(focSchemeDao.getPurchaseItems()), PurchaseItemListDto.class));
			focSchemeDto.setEligibleFocItemDetails(MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(focSchemeDao.getEligibleFocItems()), EligibleFocItemListDto.class));
			focSchemeDto.setSchemeDetails(MapperUtil.mapObjToClass(focSchemeDao.getSchemeDetails(), JsonData.class));
			focSchemeDtoList.add(focSchemeDto);
		});

		return new FocSchemeListResponseDto(focSchemeDtoList);
	}

}
