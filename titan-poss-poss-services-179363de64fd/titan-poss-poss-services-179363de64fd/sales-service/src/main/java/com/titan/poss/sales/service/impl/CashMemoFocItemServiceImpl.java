/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;



import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.auth0.jwt.impl.PublicClaims;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.config.dto.FocItemDto;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.FocProductDetailsJsonDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ManualFocSchemeDetailsDto;
import com.titan.poss.core.dto.ManualFocSchemeItemDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.FocDetailsDaoExt;
import com.titan.poss.sales.dao.FocSchemesDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.FocDetailDto;
import com.titan.poss.sales.dto.FocItemDetailsDto;
import com.titan.poss.sales.dto.constants.FocStatusEnum;
import com.titan.poss.sales.dto.request.FocDetailRequestDto;
import com.titan.poss.sales.dto.response.FocItemResponseDto;
import com.titan.poss.sales.repository.FocDetailsRepositoryExt;
import com.titan.poss.sales.repository.FocSchemesRepositoryExt;
import com.titan.poss.sales.service.CashMemoFocItemService;
import com.titan.poss.sales.service.CashMemoFocSchemeService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service Implementation class for FOC items of Cash Memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesCashMemoFocItemServiceImpl")
public class CashMemoFocItemServiceImpl implements CashMemoFocItemService {

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
	private EngineService engineService;

	@Autowired
	private CommonCashMemoServiceImpl commonCashMemoServiceImpl;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private CashMemoFocSchemeService cashMemoFocSchemeService;

	@Autowired
	private CommonPaymentService commonPaymentService;

	private static final String FOC_BIN = "FOC";

	private static final String ERR_SALE_051 = "ERR-SALE-051";
	private static final String INVALID_ITEM = "Invalid item.";
	public static final String ERR_SALE_436 = "ERR-SALE-436";

	@Override
	@Transactional
	public ListResponse<FocItemResponseDto> addFOCItemToCM(String id, String txnType, String subTxnType,
			FocDetailRequestDto focDetails) {

		List<FocItemResponseDto> focItemResponseDtoList = new ArrayList<>();
		
		validatefocquantitywithoffer(focDetails);

		// only cash memo on hold or open?
		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, txnType, subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(cashMemoDao.getSalesTxnDao(), "FOC not allowed when GHS DV is added.",
				null);

		discountUtilService.checkIfDiscountApplied(cashMemoDao.getSalesTxnDao());

		// Delete existing FOC schemes & items before adding FOC items to Cash memo each
		// time
		focDetailsRepository.deleteAllBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());
		focSchemesRepository.deleteAllBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());

		// Iterate over array of foc slab & respective foc items selected
		for (FocDetailDto focDetail : focDetails.getFocDetails()) {

			// Map FOC scheme details
			FocSchemesDaoExt focSchemeDao = cashMemoFocSchemeService.mapFocSchemeDetails(cashMemoDao,
					focDetail.getFocScheme(), null);
			focSchemeDao.setStatus(FocStatusEnum.ISSUED.toString());

			focSchemesRepository.save(focSchemeDao);

			List<FocDetailsDaoExt> focDetailsDaoList = new ArrayList<>();

			short rowId = 1;

			// Iterate over a array of foc items selected against a foc scheme
			for (FocItemDetailsDto focItem : focDetail.getFocItemDetails()) {

				// Map Foc item details
				FocDetailsDaoExt focDetailsDao = mapFocItemDetails(cashMemoDao, focSchemeDao, rowId, focItem);
				rowId++;
				focDetailsDaoList.add(focDetailsDao);
			}
			BigDecimal totalIssuedWeight = focDetailsDaoList.stream().map(FocDetailsDaoExt::getTotalWeight)
					.reduce(BigDecimal.ZERO, BigDecimal::add);

			Integer totalIssuedQuantity = focDetailsDaoList.stream().mapToInt(FocDetailsDaoExt::getTotalQuantity).sum();

			// Total Issued Weight should not be more than Eligible Weight in case of coins
			if (!StringUtils.isEmpty(focSchemeDao.getEligibleWeight())
					&& totalIssuedWeight.compareTo(focSchemeDao.getEligibleWeight()) > 0) {
				throw new ServiceException("Total Issued Weight is more than Eligible Weight", "ERR-SALE-133",
						focSchemeDao.getId());
			}

			// Total Issued Quantity should not be more than Eligible Quantity in case of
			// diamond
			if (!StringUtils.isEmpty(focSchemeDao.getEligibleQuantity())
					&& totalIssuedQuantity.compareTo((int) focSchemeDao.getEligibleQuantity()) > 0) {
				throw new ServiceException("Total Issued Quantity is more than Eligible Quantity", "ERR-SALE-102",
						focSchemeDao.getId());
			}
			focDetailsRepository.saveAll(focDetailsDaoList);

			focDetailsDaoList.forEach(focDetailsDao -> {
				FocItemResponseDto focItemResponseDto = (FocItemResponseDto) MapperUtil.getObjectMapping(focDetailsDao,
						new FocItemResponseDto());

				JsonData productGroupDetails = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(focDetailsDao.getFocScheme().getProductGroupDetails()),
						JsonData.class);

				List<FocProductDetailsJsonDto> focProcuctDetails = MapperUtil.jsonStrToList(
						MapperUtil.getJsonString(productGroupDetails.getData()), FocProductDetailsJsonDto.class);

				JsonObject jsonObject = new JsonParser().parse(focDetailsDao.getFocScheme().getPurchaseItems())
						.getAsJsonObject();
				JsonArray jsonArrayResponse = jsonObject.get("purchaseItems").getAsJsonArray();

				List<String> productGroups = new ArrayList<>();
				focProcuctDetails.forEach(item -> productGroups.add(item.getProductGroupCode()));
				List<String> purchaseProductGroups = new ArrayList<>();

				if (jsonArrayResponse != null) {
					jsonArrayResponse.forEach(item -> {
						JsonObject jsonItem = item.getAsJsonObject();
						purchaseProductGroups.add(jsonItem.get("productGroupCode").getAsString());
					});
					productGroups.retainAll(purchaseProductGroups);
					focItemResponseDto.setProductGroupList(productGroups);
				}
				focItemResponseDto.setFocSchemeId(focDetailsDao.getFocScheme().getId());
				focItemResponseDto.setSalesTxnId(focDetailsDao.getSalesTxn().getId());
				focItemResponseDto.setSchemeDetails(
						MapperUtil.mapObjToClass(focDetailsDao.getFocScheme().getSchemeDetails(), JsonData.class));
				focItemResponseDtoList.add(focItemResponseDto);
			});
		}

		return new ListResponse<>(focItemResponseDtoList);
	}

	private void validatefocquantitywithoffer(FocDetailRequestDto focDetails) {
		// TODO Auto-generated method stub
		List<FocItemDetailsDto> focItemDetailsDtoList = new ArrayList<>();	
		focDetails.getFocDetails().stream().forEach(foc -> {  
			focItemDetailsDtoList.addAll(foc.getFocItemDetails());
		});
		Map<String ,FocItemDetailsDto> itemCodeMap=new HashMap<>();
		List<String> exceededItemList=new ArrayList<>();
		for(FocItemDetailsDto foc :focItemDetailsDtoList ) {
			if(!itemCodeMap.isEmpty()) {
			FocItemDetailsDto focItem = itemCodeMap.get(foc.getItemCode()+foc.getLotNumber());
			  if(focItem !=null && focItem.getLotNumber().equalsIgnoreCase(foc.getLotNumber())) {
				  int totalRequestedFoc = foc.getTotalQuantity().intValue()+focItem.getTotalQuantity().intValue();
				  int actualQt=focItem.getActualQuantity().intValue();
				  if(totalRequestedFoc>actualQt) {
					  exceededItemList.add(" itemcode:"+foc.getItemCode()+", lotnumber:"+foc.getLotNumber());				  
				  }
				  
			  }
			}
			if(foc.getTotalQuantity()>foc.getActualQuantity()) {
				exceededItemList.add(" item code:"+foc.getItemCode()+" lot number:"+foc.getLotNumber());
			}else {
				itemCodeMap.put(foc.getItemCode()+foc.getLotNumber(),foc);
			}
		}
		if(!exceededItemList.isEmpty()) {
				
			throw new ServiceException(SalesConstants.QTY_EXCEEDS_FOR_SELECTED_FOC +"{exceededItemList}",
											 SalesConstants.ERR_SALE_436,
											Map.of("exceededItemList", exceededItemList.toString()));
		}
		
		
		
	}

	// Method to map Foc item details
	private FocDetailsDaoExt mapFocItemDetails(CashMemoDaoExt cashMemoDao, FocSchemesDaoExt focSchemeDao, short rowId,
			FocItemDetailsDto focItem) {
		FocDetailsDaoExt focDetailsDao = (FocDetailsDaoExt) MapperUtil.getObjectMapping(focItem,
				new FocDetailsDaoExt());
		focDetailsDao.setSalesTxn(cashMemoDao.getSalesTxnDao());
		focDetailsDao.setFocScheme(focSchemeDao);
		// Status to be updated to ISSUED after Confirm CM
		focDetailsDao.setStatus(FocStatusEnum.OPEN.toString());
		// TO DO: Change datatype to Integer in DB
		focDetailsDao.setRowId(rowId);
		focDetailsDao.setSrcSyncId(0);
		focDetailsDao.setDestSyncId(0);

		validateInventoryDetails(focItem, focDetailsDao);

		calculateFOCItemPrice(focDetailsDao, cashMemoDao.getSalesTxnDao());

		return focDetailsDao;
	}

	@Override
	public ListResponse<FocItemResponseDto> listFocItemsOfCM(String id, String txnType, String subTxnType) {

		List<FocItemResponseDto> focItemResponseDtoList = new ArrayList<>();

		List<FocDetailsDaoExt> focDetailsDaoList = getCashMemoFocItemsWoError(id, txnType, subTxnType);
		if (focDetailsDaoList.isEmpty()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039);
		}

		focDetailsDaoList.forEach(focDetailsDao -> {
			JsonData schemeDetailsJson = MapperUtil.mapObjToClass(focDetailsDao.getFocScheme().getSchemeDetails(),
					JsonData.class);
			FocItemResponseDto focItemResponseDto = (FocItemResponseDto) MapperUtil.getObjectMapping(focDetailsDao,
					new FocItemResponseDto());
			focItemResponseDto.setFocSchemeId(focDetailsDao.getFocScheme().getId());
			focItemResponseDto.setSalesTxnId(focDetailsDao.getSalesTxn().getId());
			focItemResponseDto.setSchemeDetails(schemeDetailsJson);
			JsonData productGroupDetails = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(focDetailsDao.getFocScheme().getProductGroupDetails()),
					JsonData.class);

			List<FocProductDetailsJsonDto> focProcuctDetails = MapperUtil.jsonStrToList(
					MapperUtil.getJsonString(productGroupDetails.getData()), FocProductDetailsJsonDto.class);

			JsonObject jsonObject = new JsonParser().parse(focDetailsDao.getFocScheme().getPurchaseItems())
					.getAsJsonObject();
			JsonArray jsonArrayResponse = jsonObject.get("purchaseItems").getAsJsonArray();

			List<String> productGroups = new ArrayList<>();
			focProcuctDetails.forEach(item -> productGroups.add(item.getProductGroupCode()));
			List<String> purchaseProductGroups = new ArrayList<>();

			if (jsonArrayResponse != null) {
				jsonArrayResponse.forEach(item -> {
					JsonObject jsonItem = item.getAsJsonObject();
					purchaseProductGroups.add(jsonItem.get("productGroupCode").getAsString());
				});
				productGroups.retainAll(purchaseProductGroups);
				focItemResponseDto.setProductGroupList(productGroups);
			}
			ManualFocSchemeDetailsDto schemeJson = MapperUtil.mapObjToClass(schemeDetailsJson.getData(),
					ManualFocSchemeDetailsDto.class);
			if (!schemeJson.getSchemeName().contains("FOC_BLOCKING_FOR")) {
				focItemResponseDto.setIsManualFOC(false);
				focItemResponseDtoList.add(focItemResponseDto);
			}

		});

		return new ListResponse<>(focItemResponseDtoList);
	}

	@Override
	public ListResponse<FocItemResponseDto> listManualFocItemsOfCM(String id, String txnType, String subTxnType) {

		List<FocItemResponseDto> focItemResponseDtoList = new ArrayList<>();

		List<FocDetailsDaoExt> focDetailsDaoList = getCashMemoFocItemsWoError(id, txnType, subTxnType);
		if (focDetailsDaoList.isEmpty()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_CORE_039);
		}

		focDetailsDaoList.forEach(focDetailsDao -> {
			JsonData schemeDetailsJson = MapperUtil.mapObjToClass(focDetailsDao.getFocScheme().getSchemeDetails(),
					JsonData.class);
			FocItemResponseDto focItemResponseDto = (FocItemResponseDto) MapperUtil.getObjectMapping(focDetailsDao,
					new FocItemResponseDto());
			focItemResponseDto.setFocSchemeId(focDetailsDao.getFocScheme().getId());
			focItemResponseDto.setSalesTxnId(focDetailsDao.getSalesTxn().getId());
			focItemResponseDto.setSchemeDetails(schemeDetailsJson);
			focItemResponseDto.setManualFocSchemeDetails(
					MapperUtil.mapObjToClass(focDetailsDao.getFocScheme().getManualFocItemDetails(), JsonData.class));
			ManualFocSchemeDetailsDto schemeJson = MapperUtil.mapObjToClass(schemeDetailsJson.getData(),
					ManualFocSchemeDetailsDto.class);
			if (schemeJson.getSchemeName().contains("FOC_BLOCKING_FOR_STORE")
					|| schemeJson.getSchemeName().contains("FOC_BLOCKING_FOR_CUSTOMER")) {
				focItemResponseDto.setIsManualFOC(true);

				focItemResponseDtoList.add(focItemResponseDto);
			}
		});

		return new ListResponse<>(focItemResponseDtoList);
	}

	@Override
	@Transactional
	public void deleteFocItemFromCM(String id, String txnType, String subTxnType) {
		// only cash memo on hold or open?
		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, txnType, subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		// Delete FOC items added to cash memo
		focDetailsRepository.deleteAllBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());

		// Delete FOc schemes applied on Cash Memo
		focSchemesRepository.deleteAllBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());
	}

	// To validate inventory details
	public void validateInventoryDetails(FocItemDetailsDto focItem, FocDetailsDaoExt focDetailsDao) {

		// Validate inevntory details
		InventoryItemDto validInventoryItem = commonTransactionService.getInvetoryItemDetailsByItemCodeAndLotNumber(
				focItem.getInventoryId(), focItem.getUnitWeight(), focItem.getTotalQuantity(), focItem.getItemCode(),
				focItem.getLotNumber());

		if (!validInventoryItem.getBinGroupCode().equalsIgnoreCase(FOC_BIN)) {
			throw new ServiceException(INVALID_ITEM, ERR_SALE_051,
					"Item should be in FOC BIN Group" + validInventoryItem.getInventoryId());
		}

		focDetailsDao.setBinCode(validInventoryItem.getBinCode());

//		JsonData jsonData = new JsonData("INVENTORY_DETAILS", validInventoryItem);
//
//		focDetailsDao.setInventoryDetails(MapperUtil.getStringFromJson(jsonData));

	}

	@Override
	public List<FocDetailsDaoExt> getCashMemoFocItemsWoError(String id, String txnType, String subTxnType) {
		// only cash memo on hold or open?
		commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, txnType, subTxnType);

		return focDetailsRepository.findAllBySalesTxnId(id);
	}

	/**
	 * @param focDetailsDao
	 */
	public void calculateFOCItemPrice(FocDetailsDaoExt focDetailsDao, SalesTxnDaoExt salesTxn) {

		Boolean isAvoidMetalRateCheck = false;

		// In case new CM for pending FOC item, consider the metal price of parent CM
		if (!StringUtils.isEmpty(salesTxn.getRefTxnId()) && !StringUtils.isEmpty(salesTxn.getRefTxnType())
				&& salesTxn.getRefTxnType().equalsIgnoreCase(TransactionTypeEnum.CM.name())) {
			// Metal rate of parent CM should be considered for pending FOC item price
			// calculation
			isAvoidMetalRateCheck = true;
		} else {
			// If Pre-order is of Frozen rate, Item price should be calculated as per Frozen
			// rate
			isAvoidMetalRateCheck = commonCashMemoServiceImpl.checkIfFrozenRatePreOrder(focDetailsDao.getSalesTxn());
		}

		// hold time - pick from location

		OrderDaoExt orderDao = commonCashMemoServiceImpl.checkIfPreOrderExistsByRefTxn(salesTxn.getRefTxnId());
		// get best rate if exists
		Set<String> metalToBeIgnoredForRateCheck = commonCashMemoServiceImpl.getBestRate(salesTxn, orderDao, false,
				false);
		// if rateFreeze CN is added, then rate check is not required.
		if (commonPaymentService.getMetalRateProtectedCNIfExists(salesTxn) != null) {
			isAvoidMetalRateCheck = true;
		}

		commonTransactionService.checkMetalRate(focDetailsDao.getSalesTxn(), null,
				TransactionStatusEnum.valueOf(focDetailsDao.getSalesTxn().getStatus()), false,
				commonCashMemoServiceImpl.getHoldTimeInMinutesForCm(), isAvoidMetalRateCheck,
				metalToBeIgnoredForRateCheck);

		OrdersPriceRequest ordersPriceRequest = new OrdersPriceRequest();
		ordersPriceRequest.setCheckInventory(true);
		ordersPriceRequest.setItemCode(focDetailsDao.getItemCode());
		ordersPriceRequest.setLotNumber(focDetailsDao.getLotNumber());
		ordersPriceRequest.setMeasuredQuantity(focDetailsDao.getTotalQuantity());
		ordersPriceRequest.setMeasuredWeight(focDetailsDao.getTotalWeight());
		ordersPriceRequest.setStandardPrice(
				commonTransactionService.mapMetalRateJsonToDto(salesTxn.getMetalRateDetails()).getMetalRates());

		PriceResponseDto priceResponseDto = engineService.getPriceDetails(ordersPriceRequest);

		log.info("FOC item price details - {}", priceResponseDto);

		focDetailsDao.setTotalValue(priceResponseDto.getFinalValue());

	}

	@Override
	@Transactional
	public ListResponse<FocItemResponseDto> addManualFOCItemToCM(String id, String txnType, String subTxnType,
			FocDetailRequestDto focDetails, String manualFocStartDate, String manualFocEndDate, String approvedBy) {

		List<FocItemResponseDto> focItemResponseDtoList = new ArrayList<>();

		// only cash memo on hold or open?
		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, txnType, subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(cashMemoDao.getSalesTxnDao(), "FOC not allowed when GHS DV is added.",
				null); // ask rachit

		// Delete existing FOC schemes & items before adding FOC items to Cash memo each
		// time
		focDetailsRepository.deleteAllBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());
		focSchemesRepository.deleteAllBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());

		// Iterate over array of foc slab & respective foc items selected
		for (FocDetailDto focDetail : focDetails.getFocDetails()) {

			ManualFocSchemeItemDto manualFocSchemeItemDto = null;
			for (FocItemDetailsDto focItemDetails : focDetail.getFocItemDetails()) {
				manualFocSchemeItemDto = new ManualFocSchemeItemDto();
				manualFocSchemeItemDto.setInventoryId(focItemDetails.getInventoryId());
				manualFocSchemeItemDto.setItemCode(focItemDetails.getItemCode());
				manualFocSchemeItemDto.setLotNumber(focItemDetails.getLotNumber());
				manualFocSchemeItemDto.setManualFocEndDate(manualFocEndDate);
				manualFocSchemeItemDto.setManualFocStartDate(manualFocStartDate);
				manualFocSchemeItemDto.setApprovedBy(approvedBy);
				manualFocSchemeItemDto.setTotalQuantity(focItemDetails.getTotalQuantity());
				manualFocSchemeItemDto.setTotalWeight(focItemDetails.getTotalWeight());
				manualFocSchemeItemDto.setUnitWeight(focItemDetails.getUnitWeight());
			}

			// Map FOC scheme details
			FocSchemesDaoExt focSchemeDao = cashMemoFocSchemeService.mapFocSchemeDetails(cashMemoDao,
					focDetail.getFocScheme(), manualFocSchemeItemDto);
			focSchemeDao.setStatus(FocStatusEnum.ISSUED.toString());

			focSchemesRepository.save(focSchemeDao);

			List<FocDetailsDaoExt> focDetailsDaoList = new ArrayList<>();

			short rowId = 1;

			// Iterate over a array of foc items selected against a foc scheme
			for (FocItemDetailsDto focItem : focDetail.getFocItemDetails()) {

				// Map Foc item details
				FocDetailsDaoExt focDetailsDao = mapFocItemDetails(cashMemoDao, focSchemeDao, rowId, focItem);
				rowId++;
				focDetailsDaoList.add(focDetailsDao);
			}
//			BigDecimal totalIssuedWeight = focDetailsDaoList.stream().map(FocDetailsDaoExt::getTotalWeight)
//					.reduce(BigDecimal.ZERO, BigDecimal::add);

			Integer totalIssuedQuantity = focDetailsDaoList.stream().mapToInt(FocDetailsDaoExt::getTotalQuantity).sum();

			// Total Issued Weight should not be more than Eligible Weight in case of coins
//			if (!StringUtils.isEmpty(focSchemeDao.getEligibleWeight())
//					&& totalIssuedWeight.compareTo(focSchemeDao.getEligibleWeight()) > 0) {
//				throw new ServiceException("Total Issued Weight is more than Eligible Weight", "ERR-SALE-133",
//						focSchemeDao.getId());
//			}

			// Total Issued Quantity should not be more than Eligible Quantity in case of
			// diamond
			if (!StringUtils.isEmpty(focSchemeDao.getEligibleQuantity())
					&& totalIssuedQuantity.compareTo((int) focSchemeDao.getEligibleQuantity()) > 0) {
				throw new ServiceException("Total Issued Quantity is more than Eligible Quantity", "ERR-SALE-102",
						focSchemeDao.getId());
			}
			focDetailsRepository.saveAll(focDetailsDaoList);

			focDetailsDaoList.forEach(focDetailsDao -> {
				FocItemResponseDto focItemResponseDto = (FocItemResponseDto) MapperUtil.getObjectMapping(focDetailsDao,
						new FocItemResponseDto());
				focItemResponseDto.setFocSchemeId(focDetailsDao.getFocScheme().getId());
				focItemResponseDto.setSalesTxnId(focDetailsDao.getSalesTxn().getId());
				focItemResponseDto.setSchemeDetails(
						MapperUtil.mapObjToClass(focDetailsDao.getFocScheme().getSchemeDetails(), JsonData.class));
				focItemResponseDto.setIsManualFOC(true);
				focItemResponseDto.setManualFocSchemeDetails(MapperUtil
						.mapObjToClass(focDetailsDao.getFocScheme().getManualFocItemDetails(), JsonData.class));
				focItemResponseDtoList.add(focItemResponseDto);
			});
		}
		return new ListResponse<>(focItemResponseDtoList);
	}

}
