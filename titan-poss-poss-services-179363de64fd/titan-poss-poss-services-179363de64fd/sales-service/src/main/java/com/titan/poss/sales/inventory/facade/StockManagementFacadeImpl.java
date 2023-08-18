/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.inventory.facade;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.TepTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CutPieceTepPriceResponseDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.LocationAdvanceBookingDetailsDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LotDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.enums.BinStageItemStatusEnum;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.InventoryServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.constant.InventoryDetailsActionEnum;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.constant.StockTransactionStatus;
import com.titan.poss.inventory.constant.StockTransactionType;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.dto.InventoryItemDetailsDto;
import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.BinListEnum;
import com.titan.poss.inventory.dto.constants.BinRequestType;
import com.titan.poss.inventory.dto.constants.InventorySearchCategoryEnum;
import com.titan.poss.inventory.dto.request.BinItemDto;
import com.titan.poss.inventory.dto.request.BinUpdateBulkDto;
import com.titan.poss.inventory.dto.request.InventoryBinUpdateDto;
import com.titan.poss.inventory.dto.request.InventoryStageBinUpdateDto;
import com.titan.poss.inventory.dto.request.ListInventoryItemsDto;
import com.titan.poss.inventory.dto.request.StageBinItemDto;
import com.titan.poss.inventory.dto.request.StockTransactionAddItemDto;
import com.titan.poss.inventory.dto.request.StockTransactionConfirmDto;
import com.titan.poss.inventory.dto.request.StockTransactionUpdateDto;
import com.titan.poss.inventory.dto.request.StockTransactionUpdateItemDto;
import com.titan.poss.inventory.dto.response.BinToBinFileStageDto;
import com.titan.poss.inventory.dto.response.FileItemStageDto;
import com.titan.poss.inventory.dto.response.InventoryBinDto;
import com.titan.poss.inventory.dto.response.InventoryBinToBinItemsDtoList;
import com.titan.poss.inventory.dto.response.InventoryItemDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoExt;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.StockTransactionDocNoDto;
import com.titan.poss.inventory.dto.response.StockTransactionDto;
import com.titan.poss.inventory.dto.response.StockTransactionItemDto;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotDetailsIdDao;
import com.titan.poss.product.repository.LotDetailsRepository;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.BinToBinFileItemsStageDao;
import com.titan.poss.sales.dao.BinToBinFileStageDao;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dao.StockTransactionDetailsDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.BinToBinFileUploadDto;
import com.titan.poss.sales.dto.CutPieceDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.OrderDetailsSyncDtoExt;
import com.titan.poss.sales.dto.StockTransactionDetailsSyncDtoExt;
import com.titan.poss.sales.dto.StockTransactionSyncDtoExt;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.StockManagementStatusEnum;
import com.titan.poss.sales.dto.response.BaseTransactionDetailsDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.StockTransactionStatusCountDto;
import com.titan.poss.sales.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.sales.inventory.service.BinService;
import com.titan.poss.sales.inventory.service.InventoryEngineService;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.inventory.service.StockTransactionService;
import com.titan.poss.sales.repository.BinToBinFileItemsStageRepository;
import com.titan.poss.sales.repository.BinToBinFileStageRepository;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.repository.StockTransactionRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.SalesDocService;
import com.titan.poss.sales.service.SalesJobService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.service.impl.OrderServiceImpl;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Slf4j
@Service
public class StockManagementFacadeImpl implements StockManagementFacade {

	private static final Logger LOGGER = LoggerFactory.getLogger(StockManagementFacadeImpl.class);
	private static final String INVALID_RECEIVING_BIN_CODE = "Invalid receiving Bin Code";
	private static final String INVALID_QUANTITY = "Provided Quantity cannot be zero or more than available quantity";
	private static final String ERR_INV_010 = "ERR-INV-010";

	private static final String CONFIRMED_TXN = "This transaction is already confirmed";

	private static final String ERR_SALE_022 = "ERR-SALE-022";

	private static final String ERR_INV_017 = "ERR-INV-017";

	private static final String STATUS = "status :";

	private static final String ERR_INV_060 = "ERR-INV-060";
	
	private static final String ERR_INV_067 = "ERR-INV-067";

	@Autowired
	private InventoryService inventoryService;

	@Autowired
	InventoryEngineService inventoryEngineService;

	@Autowired
	SalesJobService salesJobService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	EngineServiceClient engineServiceClient;

	@Autowired
	InventoryServiceClient inventoryServiceClient;

	@Autowired
	SalesDocService salesDocService;

	@Autowired
	StockTransactionRepositoryExt stockTransactionRepository;

	@Autowired
	SalesSyncStagingRepository salesSyncStagingRepository;

	// private static final String STOCK_TRANSACTION_DOC_NO = "BINTOBIN";

	@Value("${app.name}")
	private String appType;

	@Autowired
	private BinService binService;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private StockTransactionService stockTransactionService;

	@Autowired
	private StockManagementFacadeImpl stockManagementFacadeImp;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepository;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private OrderServiceImpl orderService;

	@Autowired
	private LotDetailsRepository lotDetailsRepository;

	@Autowired
	private BinToBinFileStageRepository binToBinFileStageRepository;

	@Autowired
	private BinToBinFileItemsStageRepository binToBinFileItemsStageRepository;
	
	@Autowired
	private IntegrationService integrationService;

	@Override
	// Moved to sales
	public PagedRestResponse<List<InventoryBinDto>> listBins(String binCode, String binType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable) {
		return inventoryService.listBins(binCode, binType, inventorySearchCategory, pageable);

	}

	// moved to sales
	@Override
	public PagedRestResponse<List<InventoryBinDto>> listProductCategory(String productCategory, String filterType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable) {
		return inventoryService.listBins(productCategory, filterType, inventorySearchCategory, pageable);
	}

	// moved to sales
	@Override
	public PagedRestResponse<List<InventoryBinDto>> listProductGroup(String productGroup, String filterType,
			InventorySearchCategoryEnum inventorySearchCategory, Pageable pageable) {
		return inventoryService.listBins(productGroup, filterType, inventorySearchCategory, pageable);
	}

	@Override
	public PagedRestResponse<InventoryItemDtoList> listInventoryItems(List<String> binCode, String itemCode,
			List<String> productCategory, List<String> productGroup, String binGroupCode, String lotNumber,
			String binType, Boolean isPageable, Pageable pageable) {
		Map<String, String> productGroupList = inventoryEngineService.getProductGroups(null);
		Map<String, String> productCategoryList = inventoryEngineService.getProductCategories();
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		ListInventoryItemsDto listInventoryItemsDto = new ListInventoryItemsDto();
		listInventoryItemsDto.setBinCode(binCode);
		listInventoryItemsDto.setItemCode(itemCode);
		listInventoryItemsDto.setProductCategory(productCategory);
		listInventoryItemsDto.setProductGroup(productGroup);
		listInventoryItemsDto.setBinGroupCode(binGroupCode);
		listInventoryItemsDto.setLotNumber(lotNumber);

		Page<InventoryDetailsDao> inventoryDetailPageLists = inventoryService.listInventoryItems(listInventoryItemsDto,
				binType, pageable);

		InventoryItemDtoList itemDtoCount = inventoryService.listInventoryItemsCount(listInventoryItemsDto, binType);
		InventoryItemDtoList binToBinAllowedItemDtoCount = inventoryService
				.listBintoBinAllowedItemsCount(listInventoryItemsDto, binType);

		List<InventoryItemDto> binToBinTransferList = new ArrayList<>();
		InventoryItemDtoList itemsList = new InventoryItemDtoList();
		List<String> binGroups = new ArrayList<>();
		binGroups.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));
		if (!inventoryDetailPageLists.isEmpty()) {
			for (InventoryDetailsDao inventoryDetailList : inventoryDetailPageLists) {
				InventoryItemDto binToBinTransferItemDetails = (InventoryItemDto) MapperUtil
						.getDtoMapping(inventoryDetailList, InventoryItemDto.class);
				if (binGroups.contains(inventoryDetailList.getBinGroupCode())) {
					binToBinTransferItemDetails.setIsBinToBinAllowed(true);
				} else {
					binToBinTransferItemDetails.setIsBinToBinAllowed(false);
				}
				binToBinTransferItemDetails
						.setItemDetails(MapperUtil.getJsonFromString(inventoryDetailList.getItemDetails()));
				binToBinTransferItemDetails
						.setImageURL(new URLUtil().getImageUrlByItemCode(inventoryDetailList.getItemCode()));
				binToBinTransferItemDetails.setAvailableQuantity(inventoryDetailList.getTotalQuantity());
				binToBinTransferItemDetails.setAvailableValue(inventoryDetailList.getTotalValue());
				binToBinTransferItemDetails.setAvailableWeight(inventoryDetailList.getTotalWeight());

				binToBinTransferItemDetails.setProductCategory(inventoryDetailList.getProductCategory());
				binToBinTransferItemDetails
						.setProductCategoryDesc(productCategoryList.get(inventoryDetailList.getProductCategory()));
				binToBinTransferItemDetails.setProductGroup(inventoryDetailList.getProductGroup());
				binToBinTransferItemDetails
						.setProductGroupDesc(productGroupList.get(inventoryDetailList.getProductGroup()));
				binToBinTransferItemDetails.setItemCode(inventoryDetailList.getItemCode().trim());
				binToBinTransferList.add(binToBinTransferItemDetails);

			}
		}

		itemsList.setItems(binToBinTransferList);
		itemsList.setTotalQuantity(itemDtoCount.getTotalQuantity());
		itemsList.setTotalValue(itemDtoCount.getTotalValue());
		itemsList.setBinToBinAllowedtotalQuantity(binToBinAllowedItemDtoCount.getTotalQuantity());
		itemsList.setBinToBinAllowedtotalValue(binToBinAllowedItemDtoCount.getTotalValue());
		itemsList.setBinToBinAllowedtotalItems(binToBinAllowedItemDtoCount.getBinToBinAllowedtotalItems());
		return new PagedRestResponse<>(itemsList, inventoryDetailPageLists);

	}

	@Override
	public StockTransactionDocNoDto updateAllInventoryItemsByBinCode(String srcBincode, String destinationBincode,
			String destinationBinGroup, InventorySearchCategoryEnum inventorySearchCategory) {
		ListInventoryItemsDto listInventoryItemsDto = new ListInventoryItemsDto();
		List<String> value = new ArrayList<>();
		value.add(srcBincode);
		listInventoryItemsDto.setBinCode(value);

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> resMap = stockManagementFacadeImp
				.binToBinInventoryUpdate(listInventoryItemsDto, destinationBincode, destinationBinGroup);
		Map.Entry<StockTransactionDocNoDto, List<SyncStagingDto>> resMapEntry = resMap.entrySet().iterator().next();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType) && !resMap.isEmpty()) {
			for (SyncStagingDto syncStagingDto : resMapEntry.getValue()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}
		return resMapEntry.getKey();
	}

	/**
	 * @param listInventoryItemsDto
	 * @param destinationBincode
	 * @param destinationBinGroup
	 * @return
	 */
	@Transactional
	public Map<StockTransactionDocNoDto, List<SyncStagingDto>> binToBinInventoryUpdate(
			ListInventoryItemsDto listInventoryItemsDto, String destinationBincode, String destinationBinGroup) {
		List<StockTransactionDetailsDao> stockTransactionDetailsList = new ArrayList<>();
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		short totalQuantity = 0;
		Pageable pageable = null;
		StockTransactionDocNoDto stockTransactionDocNoDto = new StockTransactionDocNoDto();
		StockTransactionDao stockTransaction = null;
		// CALL EPOSS
		if (appType.equals(AppTypeEnum.POSS.toString())) {
			stockTransaction = epossCallService.callEposs(HttpMethod.GET, SalesUtil.INVENTORY_GET_DOCNUMBER_URL, null,
					null, StockTransactionDao.class);
		} else {
			stockTransaction = stockTransactionService.addBinStockTransaction(
					StockTransactionStatus.COMPLETED.toString(), StockTransactionType.BIN_TO_BIN.toString());
		}

		Page<InventoryDetailsDao> inventoryDetailPageLists = inventoryService.listInventoryItems(listInventoryItemsDto,
				BinListEnum.BIN_BIN.toString(), pageable);

		List<InventoryDetailsDao> invs = new ArrayList<>();
		String correlationId = UUID.randomUUID().toString();
		for (InventoryDetailsDao i : inventoryDetailPageLists.getContent()) {
			InventoryDetailsDao in = (InventoryDetailsDao) MapperUtil.getDtoMapping(i, InventoryDetailsDao.class);
			in.setCorrelationId(correlationId);
			invs.add(in);
		}
		for (InventoryDetailsDao inventoryDetails : invs) {
			if (!inventoryService.isValidForUpdate(destinationBinGroup, inventoryDetails)) {
				throw new com.titan.poss.core.exception.ServiceException(INVALID_RECEIVING_BIN_CODE, ERR_INV_010);
			}
			if (binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType)
					.contains(inventoryDetails.getBinGroupCode())) {

				setStockTransactionDetails(destinationBincode, stockTransactionDetailsList, stockTransaction,
						inventoryDetails, null, null);
				totalQuantity = (short) (totalQuantity + inventoryDetails.getTotalQuantity());
				totalValue = totalValue.add(inventoryDetails.getTotalValue());
				totalWeight = totalWeight.add(inventoryDetails.getTotalWeight());
				String binCode = inventoryDetails.getBinCode();
				String binGroup = inventoryDetails.getBinGroupCode();
				InventoryDetailsDao invExists = inventoryDetailsRepository
						.findByLocationCodeAndItemCodeAndLotNumberAndBinCodeAndBinGroupCode(authUser.getLocationCode(),
								inventoryDetails.getItemCode(), inventoryDetails.getLotNumber(), destinationBincode,
								destinationBinGroup);
				if (invExists != null) {
					invExists.setTotalQuantity(
							(short) (invExists.getTotalQuantity() + inventoryDetails.getTotalQuantity()));
					invExists.setTotalWeight(
							invExists.getStdWeight().multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
					invExists.setTotalValue(
							invExists.getStdValue().multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
					inventoryDetails.setTotalQuantity((short) 0);
					inventoryDetails.setTotalValue(BigDecimal.ZERO);
					inventoryDetails.setTotalWeight(BigDecimal.ZERO);
					invExists.setDocType(DocTypeEnum.BINTOBIN.toString());
					invExists.setBinModifiedDate(new Date());
					invExists.setSrcSyncId(inventoryDetails.getSrcSyncId() + 1);
					invExists.setDocNumber(stockTransaction.getIssuedDocNo());
					invExists.setCorrelationId(correlationId);
					invs.add(invExists);
				} else {
					inventoryDetails.setBinCode(destinationBincode);
					inventoryDetails.setBinGroupCode(destinationBinGroup);
					inventoryDetails.setPreviousBinCode(binCode);
					inventoryDetails.setPreviousBinGroupCode(binGroup);
					inventoryDetails.setDocType(DocTypeEnum.BINTOBIN.toString());
					inventoryDetails.setBinModifiedDate(new Date());
					inventoryDetails.setDocNumber(stockTransaction.getIssuedDocNo());
					inventoryDetails.setSrcSyncId(inventoryDetails.getSrcSyncId() + 1);

				}

			}
		}
		stockTransactionDocNoDto.setDocNo(stockTransaction.getIssuedDocNo());

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> responseMap = new HashMap<>();
		List<SyncStagingDto> stagingDtos = inventoryService.updateInventoryAndSaveToStaging(invs,
				stockTransaction.getId());
		if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appType)) {
			stockTransactionService.addStockTransactionDetails(stockTransactionDetailsList);
			setStockTransaction(totalValue, totalQuantity, totalWeight, stockTransaction);
			stockTransactionService.updateStockTransaction(stockTransaction);
		}
		responseMap.put(stockTransactionDocNoDto, stagingDtos);
		return responseMap;
	}

	private void setStockTransaction(BigDecimal totalValue, short totalQuantity, BigDecimal totalWeight,
			StockTransactionDao stockTransaction) {
		stockTransaction.setTotalIssuedQuantity(totalQuantity);
		stockTransaction.setTotalReceivedQuantity(totalQuantity);
		stockTransaction.setTotalIssuedValue(totalValue);
		stockTransaction.setTotalReceivedValue(totalValue);
		stockTransaction.setTotalIssuedWeight(totalWeight);
		stockTransaction.setTotalReceivedWeight(totalWeight);
	}

	@Override
	public StockTransactionDocNoDto updateAllInventoryItemsByProductCategory(String productCategory,
			String destinationBincode, String destinationBinGroup,
			InventorySearchCategoryEnum inventorySearchCategory) {
		ListInventoryItemsDto listInventoryItemsDto = new ListInventoryItemsDto();
		List<String> value = new ArrayList<>();
		value.add(productCategory);
		listInventoryItemsDto.setProductCategory(value);

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> resMap = stockManagementFacadeImp
				.binToBinInventoryUpdate(listInventoryItemsDto, destinationBincode, destinationBinGroup);
		Map.Entry<StockTransactionDocNoDto, List<SyncStagingDto>> resMapEntry = resMap.entrySet().iterator().next();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType) && !resMap.isEmpty()) {
			for (SyncStagingDto syncStagingDto : resMapEntry.getValue()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}
		return resMapEntry.getKey();
	}

	@Override
	@Transactional
	public SchedulerResponseDto updateFromReserveBin(String locationCode) {
		Date docDate = businessDayService.getBodBusinessDay().getBusinessDate();
		if (appType.equalsIgnoreCase("POSS")) {
			// CountryDetailsDto countryDetailsDto =
			// engineServiceClient.getCountryDetails(locationCode);
			// Integer docNo =
			// salesJobService.getDocNumber(countryDetailsDto.getFiscalYear().shortValue(),
			// locationCode,
			// STOCK_TRANSACTION_DOC_NO);

			StockTransactionDao stockTransaction = null;
			// CALL EPOSS
			if (appType.equals(AppTypeEnum.POSS.toString())) {
				stockTransaction = epossCallService.callEposs(HttpMethod.GET, SalesUtil.INVENTORY_GET_DOCNUMBER_URL,
						null, null, StockTransactionDao.class);
			} else {
				stockTransaction = stockTransactionService.addBinStockTransaction(
						StockTransactionStatus.COMPLETED.toString(), StockTransactionType.BIN_TO_BIN.toString());
			}
			Integer docNo = stockTransaction.getIssuedDocNo();
			if (appType.equals(AppTypeEnum.POSS.toString())) {
				List<InventoryDetailsDao> inventoryDetails = salesJobService
						.getInventoryItems(BinGroupEnum.RESERVEBIN.name(), locationCode, docDate);
				inventoryDetails.forEach(inventory -> {
					inventory.setActionType("ADD");
					inventory.setBinCode(inventory.getPreviousBinCode());
					inventory.setBinGroupCode(inventory.getBinGroupCode());
					inventory.setDocNumber(docNo);
					inventory.setDocType(DocTypeEnum.BINTOBIN.name());
					inventory.setLastModifiedDate(new Date());
				});

				// salesJobService.updateInventoryDetails(inventoryDetails, docNo,
				// DocTypeEnum.BINTOBIN.name());

				List<String> invIds = new ArrayList<>();
				for (InventoryDetailsDao invDetailsDao : inventoryDetails) {
					invIds.add(invDetailsDao.getId());
				}

				List<OrderDetailsDaoExt> salesOrderList = orderDetailsRepository.findAllByInventoryIds(invIds);
				for (OrderDetailsDaoExt orderDaoExt : salesOrderList) {
					orderDaoExt.setStatus(TransactionStatusEnum.RELEASED.name());
				}
				orderService.syncStagging(null, null, salesOrderList, inventoryDetails, null, locationCode);

			} else {
				List<StockTransactionDetailsDao> stockTransactionDetailsList = new ArrayList<>();
				List<InventoryDetailsDao> inventoryDetails = salesJobService
						.getInventoryItems(BinGroupEnum.RESERVEBIN.name(), locationCode, docDate);
				BigDecimal totalValue = BigDecimal.ZERO;
				short totalQuantity = 0;
				StockTransactionDao stockTransactionDao = salesJobService.addStockTransaction("COMPLETED",
						BinListEnum.BIN_BIN.name(), locationCode);
				for (InventoryDetailsDao invDetails : inventoryDetails) {

					setStockTransactionDetails(invDetails.getPreviousBinCode(), stockTransactionDetailsList,
							stockTransactionDao, invDetails, null, null);
					totalQuantity = (short) (totalQuantity + invDetails.getTotalQuantity());
					totalValue = totalValue.add(invDetails.getTotalValue());
				}
				List<String> invIds = new ArrayList<>();
				for (InventoryDetailsDao invDetailsDao : inventoryDetails) {
					invIds.add(invDetailsDao.getId());
				}

				List<OrderDetailsDaoExt> salesOrderList = orderDetailsRepository.findAllByInventoryIds(invIds);
				for (OrderDetailsDaoExt orderDaoExt : salesOrderList) {
					orderDaoExt.setStatus(TransactionStatusEnum.RELEASED.name());
				}
				orderDetailsRepository.saveAll(salesOrderList);

				setStockTransaction(totalValue, totalQuantity, stockTransactionDao);
				salesJobService.updateStockTransaction(stockTransactionDao);
				salesJobService.addStockTransactionDetails(stockTransactionDetailsList);
				salesJobService.updateInventoryDetails(inventoryDetails, stockTransactionDao.getIssuedDocNo(),
						DocTypeEnum.BINTOBIN.name());
			}

		}
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.SALES_REMOVE_FROM_RESERVEBIN.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;

	}

	private void setStockTransactionDetails(String destinationBincode,
			List<StockTransactionDetailsDao> stockTransactionDetailsList, StockTransactionDao stockTransactionDao,
			InventoryDetailsDao inventoryDetails, String defectCodeDesc, String defectTypeDesc) {
		StockTransactionDetailsDao stockTransactionDetails;

		stockTransactionDetails = (StockTransactionDetailsDao) MapperUtil.getDtoMapping(inventoryDetails,
				StockTransactionDetailsDao.class);
		stockTransactionDetails.setIssuedBinCode(inventoryDetails.getPreviousBinCode());
		stockTransactionDetails.setReceivedBinCode(destinationBincode);
		stockTransactionDetails.setStatus(StockTransactionStatus.COMPLETED.toString());
		stockTransactionDetails.setStockTransaction(stockTransactionDao);
		stockTransactionDetails.setInventoryId(inventoryDetails.getId());
		stockTransactionDetails.setIssuedQuantity(inventoryDetails.getTotalQuantity());
		stockTransactionDetails.setIssuedWeight(inventoryDetails.getTotalWeight());
		stockTransactionDetails.setIssuedValue(inventoryDetails.getTotalValue());
		stockTransactionDetails.setReceivedQuantity(inventoryDetails.getTotalQuantity());
		stockTransactionDetails.setReceivedWeight(inventoryDetails.getTotalWeight());
		stockTransactionDetails.setReceivedValue(inventoryDetails.getTotalValue());
		stockTransactionDetails.setDefectCodeDesc(defectCodeDesc);
		stockTransactionDetails.setDefectTypeDesc(defectTypeDesc);
		stockTransactionDetailsList.add(stockTransactionDetails);
	}

	private void setStockTransactionDetailsCoin(String destinationBincode,
			List<StockTransactionDetailsDao> stockTransactionDetailsList, StockTransactionDao stockTransactionDao,
			InventoryDetailsDao inventoryDetails, BinItemDto binItem) {
		log.info("set once");
		StockTransactionDetailsDao stockTransactionDetails;
		stockTransactionDetails = (StockTransactionDetailsDao) MapperUtil.getDtoMapping(inventoryDetails,
				StockTransactionDetailsDao.class);
		stockTransactionDetails.setIssuedBinCode(inventoryDetails.getPreviousBinCode());
		stockTransactionDetails.setReceivedBinCode(destinationBincode);
		stockTransactionDetails.setStatus(StockTransactionStatus.COMPLETED.toString());
		stockTransactionDetails.setStockTransaction(stockTransactionDao);
		stockTransactionDetails.setInventoryId(inventoryDetails.getId());
		stockTransactionDetails.setIssuedQuantity(binItem.getQuantity());
		stockTransactionDetails.setIssuedWeight(
				inventoryDetails.getTotalWeight().multiply(new BigDecimal((short) binItem.getQuantity())));
		stockTransactionDetails.setIssuedValue(
				inventoryDetails.getTotalValue().multiply(new BigDecimal((short) binItem.getQuantity())));
		stockTransactionDetails.setReceivedQuantity(binItem.getQuantity());
		stockTransactionDetails.setReceivedWeight(
				inventoryDetails.getTotalWeight().multiply(new BigDecimal((short) binItem.getQuantity())));
		stockTransactionDetails.setReceivedValue(
				inventoryDetails.getTotalValue().multiply(new BigDecimal((short) binItem.getQuantity())));
		log.info("stockTransacionDetails " + stockTransactionDetails.toString());
		stockTransactionDetailsList.add(stockTransactionDetails);
	}

	private void setStockTransaction(BigDecimal totalValue, short totalQuantity,
			StockTransactionDao stockTransactionDao) {
		stockTransactionDao.setTotalIssuedQuantity(totalQuantity);
		stockTransactionDao.setTotalReceivedQuantity(totalQuantity);
		stockTransactionDao.setTotalIssuedValue(totalValue);
		stockTransactionDao.setTotalReceivedValue(totalValue);
	}

	@Override
	public StockTransactionDocNoDto updateAllInventoryItemsByProductGroup(String productGroup,
			String destinationBincode, String destinationBinGroup,
			InventorySearchCategoryEnum inventorySearchCategory) {
		ListInventoryItemsDto listInventoryItemsDto = new ListInventoryItemsDto();
		List<String> value = new ArrayList<>();
		value.add(productGroup);
		listInventoryItemsDto.setProductGroup(value);

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> resMap = stockManagementFacadeImp
				.binToBinInventoryUpdate(listInventoryItemsDto, destinationBincode, destinationBinGroup);
		Map.Entry<StockTransactionDocNoDto, List<SyncStagingDto>> resMapEntry = resMap.entrySet().iterator().next();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType) && !resMap.isEmpty()) {
			for (SyncStagingDto syncStagingDto : resMapEntry.getValue()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}
		return resMapEntry.getKey();
	}

	@Override
	public StockTransactionDocNoDto updateInventoryItems(Integer id, InventoryBinUpdateDto binTransferItems) {

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> resMap = stockManagementFacadeImp
				.binToBinUpdateInventoryItems(id, binTransferItems);

		Map.Entry<StockTransactionDocNoDto, List<SyncStagingDto>> resMapEntry = resMap.entrySet().iterator().next();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType) && !resMap.isEmpty()) {
			for (SyncStagingDto syncStagingDto : resMapEntry.getValue()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}
		return resMapEntry.getKey();

	}

	/**
	 * @param binTransferItems
	 * @return
	 */
	@Transactional
	public Map<StockTransactionDocNoDto, List<SyncStagingDto>> binToBinUpdateInventoryItems(Integer fileId,
			InventoryBinUpdateDto binTransferItems) {
		CountryDetailsDto countryDetailsDto = engineServiceClient.getCountryDetails(CommonUtil.getLocationCode());
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		short totalQuantity = 0;
		List<StockTransactionDetailsDao> stockTransactionDetailsList = new ArrayList<>();
		List<InventoryDetailsDao> detailsList = new ArrayList<>();
		StockTransactionDocNoDto stockTransactionDocNoDto = new StockTransactionDocNoDto();
		// adding inventory ID's to a list for fetching the item data
		for (BinItemDto binItems : binTransferItems.getBinItems()) {
			// idList.add(binItems.getInventoryId());
			InventoryDetailsDao itemInv = inventoryService.getItemByIdAndLocationCode(binItems.getInventoryId());
			itemInv = (InventoryDetailsDao) MapperUtil.getDtoMapping(itemInv, InventoryDetailsDao.class);
			detailsList.add(itemInv);
		}
		// passing the list of id's to get the items
//		List<InventoryDetailsDao> inventoryDetailsList = inventoryService.getItemsByIdAndLocationCode(idList);
//
//		for (InventoryDetailsDao i : inventoryDetailsList) {
//
//			InventoryDetailsDao in = (InventoryDetailsDao) MapperUtil.getDtoMapping(i, InventoryDetailsDao.class);
//			detailsList.add(in);
//		}

		StockTransactionDao stockTransaction = new StockTransactionDao();

//		 CALL EPOSS to create stock transaction
		if (appType.equals(AppTypeEnum.POSS.toString())) {
			log.info("In 681");
			stockTransaction = epossCallService.callEposs(HttpMethod.GET, SalesUtil.INVENTORY_GET_DOCNUMBER_URL, null,
					null, StockTransactionDao.class);
		} else {
			log.info("in Else 685");
			stockTransaction = stockTransactionService.addBinStockTransaction(
					StockTransactionStatus.COMPLETED.toString(), StockTransactionType.BIN_TO_BIN.toString());
		}

		// iterating the inventory item list and setting stock transaction details
		List<InventoryDetailsDao> detailsSyncList = new ArrayList<>();
		int detailsListSize = detailsList.size();
		for (int count = 0; count < detailsListSize; count++) {
			if (!inventoryService.isValidForUpdate(binTransferItems.getBinItems().get(count).getBinGroupCode(),
					detailsList.get(count))) {
				throw new com.titan.poss.core.exception.ServiceException(INVALID_RECEIVING_BIN_CODE, ERR_INV_010);
			}

			String binCode = detailsList.get(count).getBinCode();
			String binGroup = detailsList.get(count).getBinGroupCode();
			// Check if Item is Coin
			if (!detailsList.get(count).getProductGroup().equals(ProductGroupCodeEnum.GOLD_COIN.getCode())) {
				log.info("not in 73");
				setStockTransactionDetails(binTransferItems.getBinItems().get(count).getBinCode(),
						stockTransactionDetailsList, stockTransaction, detailsList.get(count),
						binTransferItems.getBinItems().get(count).getDefectCodeDesc(),
						binTransferItems.getBinItems().get(count).getDefectTypeDesc());
				totalQuantity = (short) (totalQuantity + detailsList.get(count).getTotalQuantity());
				totalValue = totalValue.add(detailsList.get(count).getTotalValue());
				totalWeight = totalWeight.add(detailsList.get(count).getTotalWeight());
				detailsList.get(count).setBinCode(binTransferItems.getBinItems().get(count).getBinCode());
				detailsList.get(count).setBinGroupCode(binTransferItems.getBinItems().get(count).getBinGroupCode());
				detailsList.get(count).setPreviousBinCode(binCode);
				detailsList.get(count).setPreviousBinGroupCode(binGroup);
				detailsList.get(count).setBinModifiedDate(new Date());
				detailsList.get(count).setDocType(DocTypeEnum.BINTOBIN.toString());
				detailsList.get(count).setDocNumber(stockTransaction.getIssuedDocNo());
				detailsList.get(count).setActionType(InventoryDetailsActionEnum.ADD.name());
				detailsSyncList.add(detailsList.get(count));
			} else {
				InventoryDetailsDao invExists = inventoryDetailsRepository
						.findByLocationCodeAndItemCodeAndLotNumberAndBinCodeAndBinGroupCode(authUser.getLocationCode(),
								detailsList.get(count).getItemCode(), detailsList.get(count).getLotNumber(),
								binTransferItems.getBinItems().get(count).getBinCode(),
								binTransferItems.getBinItems().get(count).getBinGroupCode());
				setStockTransactionDetailsCoin(binTransferItems.getBinItems().get(count).getBinCode(),
						stockTransactionDetailsList, stockTransaction, detailsList.get(count),
						binTransferItems.getBinItems().get(count));
				totalQuantity = (short) (totalQuantity + binTransferItems.getBinItems().get(count).getQuantity());
				totalValue = totalValue.add(detailsList.get(count).getTotalValue()
						.multiply(new BigDecimal((short) binTransferItems.getBinItems().get(count).getQuantity())));
				totalWeight = totalWeight.add(detailsList.get(count).getTotalWeight()
						.multiply(new BigDecimal((short) binTransferItems.getBinItems().get(count).getQuantity())));
				// We are setting actionType as ADD/Null
				// for every operation
				// , based on actionType while datasync we will show in items in history.
				// If transfering full qty for Coins
				if (detailsList.get(count).getTotalQuantity()
						.equals(binTransferItems.getBinItems().get(count).getQuantity())) {
					// checking if similar item available with binGroup or not
					if (invExists != null) {
						invExists.setTotalQuantity(
								(short) (invExists.getTotalQuantity() + detailsList.get(count).getTotalQuantity()));
						invExists.setTotalWeight(invExists.getStdWeight()
								.multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
						invExists.setTotalValue(invExists.getStdValue()
								.multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
						detailsList.get(count).setTotalQuantity((short) 0);
						detailsList.get(count).setTotalValue(BigDecimal.ZERO);
						detailsList.get(count).setTotalWeight(BigDecimal.ZERO);
						invExists.setActionType(InventoryDetailsActionEnum.ADD.name());
						detailsList.get(count).setActionType(null);
						// invExists.setIssuedQuantity(detailsList.get(count).getTotalQuantity());
						detailsSyncList.add(detailsList.get(count));
						detailsSyncList.add(invExists);

					} else {
						detailsList.get(count).setBinCode(binTransferItems.getBinItems().get(count).getBinCode());
						detailsList.get(count)
								.setBinGroupCode(binTransferItems.getBinItems().get(count).getBinGroupCode());
						detailsList.get(count).setPreviousBinCode(binCode);
						detailsList.get(count).setPreviousBinGroupCode(binGroup);
						detailsList.get(count).setBinModifiedDate(new Date());
						// detailsList.get(count)
						// .setIssuedQuantity(binTransferItems.getBinItems().get(count).getQuantity());
						detailsList.get(count).setDocType(DocTypeEnum.BINTOBIN.toString());
						detailsList.get(count).setDocNumber(stockTransaction.getIssuedDocNo());
						detailsList.get(count)
								.setDefectCodeDesc(binTransferItems.getBinItems().get(count).getDefectCodeDesc());
						detailsList.get(count)
								.setDefectTypeDesc(binTransferItems.getBinItems().get(count).getDefectTypeDesc());
						detailsList.get(count).setActionType(InventoryDetailsActionEnum.ADD.name());
						detailsSyncList.add(detailsList.get(count));
					}
				} else if (!detailsList.get(count).getTotalQuantity()
						.equals(binTransferItems.getBinItems().get(count).getQuantity())) {
					// If transferred qty is less than totalQty

					// validation check for QTY only.
					if (binTransferItems.getBinItems().get(count).getQuantity() == null
							|| binTransferItems.getBinItems().get(count).getQuantity() == 0 || detailsList.get(count)
									.getTotalQuantity() < binTransferItems.getBinItems().get(count).getQuantity()) {

						throw new ServiceException(INVALID_QUANTITY, ERR_INV_017);
					}

					// subtracting from the original item and increasing qty for the similar item
					// exists
					detailsList.get(count).setTotalQuantity((short) (detailsList.get(count).getTotalQuantity()
							- binTransferItems.getBinItems().get(count).getQuantity()));

					detailsList.get(count).setTotalWeight(detailsList.get(count).getStdWeight()
							.multiply(new BigDecimal((short) (detailsList.get(count).getTotalQuantity()))));

					detailsList.get(count).setTotalValue(detailsList.get(count).getStdValue()
							.multiply(new BigDecimal((short) (detailsList.get(count).getTotalQuantity()))));

					detailsList.get(count).setBinModifiedDate(new Date());
					detailsList.get(count).setDocType(DocTypeEnum.BINTOBIN.toString());
					detailsList.get(count).setDocNumber(stockTransaction.getIssuedDocNo());
					detailsList.get(count).setActionType(null);
					detailsSyncList.add(detailsList.get(count));
					// subtracting from the original item and increasing qty for the similar item
					// exists

					if (invExists != null) {
						invExists.setTotalQuantity((short) (invExists.getTotalQuantity()
								+ binTransferItems.getBinItems().get(count).getQuantity()));
						invExists.setTotalWeight(invExists.getStdWeight()
								.multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
						invExists.setTotalValue(invExists.getStdValue()
								.multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
						invExists.setActionType(InventoryDetailsActionEnum.ADD.name());
						// invExists.setIssuedQuantity(binTransferItems.getBinItems().get(count).getQuantity());
						invExists.setDocType(DocTypeEnum.BINTOBIN.toString());
						invExists.setBinModifiedDate(new Date());
						invExists.setPreviousBinCode(detailsList.get(count).getBinCode());
						invExists.setPreviousBinGroupCode(detailsList.get(count).getPreviousBinGroupCode());
						detailsSyncList.add(invExists);

						// detailsList.add(invExists);
					} else {
						InventoryDetailsDao invDetailsPartialQty = new InventoryDetailsDao();
						invDetailsPartialQty.setId(UUID.randomUUID().toString());
						invDetailsPartialQty.setStdValue(detailsList.get(count).getStdValue());
						invDetailsPartialQty.setStdWeight(detailsList.get(count).getStdWeight());
						invDetailsPartialQty.setItemDetails(detailsList.get(count).getItemDetails());
						invDetailsPartialQty.setTotalWeightDetails(detailsList.get(count).getTotalWeightDetails());
						invDetailsPartialQty
								.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
						invDetailsPartialQty.setSerialNumber(detailsList.get(count).getStdWeight().toString());
						invDetailsPartialQty.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
						invDetailsPartialQty.setCreatedDate(new Date());
						invDetailsPartialQty
								.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
						invDetailsPartialQty.setLastModifiedDate(new Date());
						invDetailsPartialQty.setItemCode(detailsList.get(count).getItemCode());
						invDetailsPartialQty.setLotNumber(detailsList.get(count).getLotNumber());
						invDetailsPartialQty
								.setDefectCodeDesc(binTransferItems.getBinItems().get(count).getDefectCodeDesc());
						invDetailsPartialQty
								.setDefectTypeDesc(binTransferItems.getBinItems().get(count).getDefectTypeDesc());
						invDetailsPartialQty.setBinCode(binTransferItems.getBinItems().get(count).getBinCode());
						invDetailsPartialQty.setPreviousBinCode(binCode);
						invDetailsPartialQty.setPreviousBinGroupCode(binGroup);
						invDetailsPartialQty
								.setBinGroupCode(binTransferItems.getBinItems().get(count).getBinGroupCode());
						invDetailsPartialQty.setTotalQuantity(binTransferItems.getBinItems().get(count).getQuantity());
						invDetailsPartialQty.setTotalValue(detailsList.get(count).getStdValue()
								.multiply(new BigDecimal(binTransferItems.getBinItems().get(count).getQuantity())));
						invDetailsPartialQty.setTotalWeight(detailsList.get(count).getStdWeight()
								.multiply(new BigDecimal(binTransferItems.getBinItems().get(count).getQuantity())));
						invDetailsPartialQty.setOrgCode(detailsList.get(count).getOrgCode());
						invDetailsPartialQty.setBinModifiedDate(new Date());
						invDetailsPartialQty.setStockInwardDate(new Date());
						invDetailsPartialQty.setCurrencyCode(countryDetailsDto.getCurrencyCode());
						invDetailsPartialQty.setMfgDate(new Date());
						invDetailsPartialQty.setWeightUnit(countryDetailsDto.getWeightUnit());
						invDetailsPartialQty.setDocNumber(stockTransaction.getIssuedDocNo());
						invDetailsPartialQty.setDocType(DocTypeEnum.BINTOBIN.toString());
						invDetailsPartialQty.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
						invDetailsPartialQty.setActionType(InventoryDetailsActionEnum.ADD.name());
						invDetailsPartialQty.setCorrelationId(detailsList.get(count).getCorrelationId());
						// invDetailsPartialQty.setIssuedQuantity(binTransferItems.getBinItems().get(count).getQuantity());
						invDetailsPartialQty.setProductGroup(detailsList.get(count).getProductGroup());
						invDetailsPartialQty.setProductCategory(detailsList.get(count).getProductCategory());
						// retrieve isHallmarked from itemDetails JSON and set to isHallmarked.
						invDetailsPartialQty.setIsHallmarked(getHallmarkedFromItemDetails(detailsList.get(count)));
						// detailsList.add(invDetailsPartialQty);
						detailsSyncList.add(invDetailsPartialQty);
					}
				} else {
					detailsList.get(count).setBinCode(binTransferItems.getBinItems().get(count).getBinCode());
					detailsList.get(count).setBinGroupCode(binTransferItems.getBinItems().get(count).getBinGroupCode());
					detailsList.get(count).setPreviousBinCode(binCode);
					detailsList.get(count).setPreviousBinGroupCode(binGroup);
					detailsList.get(count).setBinModifiedDate(new Date());
					detailsList.get(count).setDocType(DocTypeEnum.BINTOBIN.toString());
					detailsList.get(count).setDocNumber(stockTransaction.getIssuedDocNo());
					detailsList.get(count)
							.setDefectCodeDesc(binTransferItems.getBinItems().get(count).getDefectCodeDesc());
					detailsList.get(count)
							.setDefectTypeDesc(binTransferItems.getBinItems().get(count).getDefectTypeDesc());

				}
			}
		}

		stockTransactionDocNoDto.setDocNo(stockTransaction.getIssuedDocNo());
		if (fileId != null && fileId > 0) {
			List<String> invIdList = binTransferItems.getBinItems().stream().map(inv -> inv.getInventoryId())
					.collect(Collectors.toList());
			binToBinFileItemsStageRepository.deleteByInventoryId(fileId, invIdList);
			Optional<BinToBinFileStageDao> binToBinStage = binToBinFileStageRepository.findById(fileId);
			if (binToBinStage.isPresent()) {
				List<BinToBinFileItemsStageDao> binToBinStageitemsList = binToBinFileItemsStageRepository
						.findAllByBinToBinFileStage(binToBinStage.get());
				if (CollectionUtil.isEmpty(binToBinStageitemsList)) {
					binToBinFileStageRepository.deleteById(fileId);
				}
			}
		}
		Map<StockTransactionDocNoDto, List<SyncStagingDto>> responseMap = new HashMap<>();
		List<SyncStagingDto> stagingDtos = inventoryService.updateInventoryAndSaveToStaging(detailsSyncList,
				stockTransaction.getId());
		log.info("in eposs app type : list data size" + stockTransactionDetailsList.size());
		stockTransactionDetailsList.stream().forEach(s -> log.info(s.toString()));
		if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appType)) {
			log.info("in eposs app type : list size" + stockTransactionDetailsList.size());
			stockTransactionService.addStockTransactionDetails(stockTransactionDetailsList);
			setStockTransaction(totalValue, totalQuantity, totalWeight, stockTransaction);
			stockTransactionService.updateStockTransaction(stockTransaction);
		}
		responseMap.put(stockTransactionDocNoDto, stagingDtos);
		return responseMap;

	}

	@Override
	public StockTransactionDocNoDto updateAllItems(BinUpdateBulkDto binUpdateBulkDto) {

		ListInventoryItemsDto listInventoryItemsDto = new ListInventoryItemsDto();
		List<String> bincodes = new ArrayList<>();
		List<String> productCategory = new ArrayList<>();
		List<String> productGroup = new ArrayList<>();
		bincodes.addAll(binUpdateBulkDto.getSrcBincode());
		productCategory.addAll(binUpdateBulkDto.getSrcProductCategory());
		productGroup.addAll(binUpdateBulkDto.getSrcProductGroup());
		listInventoryItemsDto.setBinCode(bincodes);
		listInventoryItemsDto.setProductCategory(productCategory);
		listInventoryItemsDto.setProductGroup(productGroup);
		listInventoryItemsDto.setItemCode(binUpdateBulkDto.getItemCode());
		listInventoryItemsDto.setLotNumber(binUpdateBulkDto.getLotNumber());

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> resMap = stockManagementFacadeImp.binToBinInventoryUpdate(
				listInventoryItemsDto, binUpdateBulkDto.getDestBinCode(), binUpdateBulkDto.getDestBinGroup());
		Map.Entry<StockTransactionDocNoDto, List<SyncStagingDto>> resMapEntry = resMap.entrySet().iterator().next();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType) && !resMap.isEmpty()) {
			for (SyncStagingDto syncStagingDto : resMapEntry.getValue()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}
		return resMapEntry.getKey();

	}

	@Override
	public SchedulerResponseDto moveItemsFromReserveBin(String locationCode, Integer numberOfDays) {
		List<String> invIdsInOrderDetails = new ArrayList<>();
		Map<StockTransactionDocNoDto, List<SyncStagingDto>> resMap = stockManagementFacadeImp
				.moveItemsFromReserveBinToPreviousBin(locationCode, numberOfDays, invIdsInOrderDetails);
		Map.Entry<StockTransactionDocNoDto, List<SyncStagingDto>> resMapEntry = resMap.entrySet().iterator().next();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType) && !resMap.isEmpty()) {
			for (SyncStagingDto syncStagingDto : resMapEntry.getValue()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.SALES_REMOVE_FROM_RESERVEBIN.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;
	}

	@Override
	public SchedulerResponseDto moveItemsFromReserveBin(String locationCode) {
		LocationCacheDto locationCacheDto = engineServiceClient.getStoreLocation(locationCode);
		LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto = MapperUtil.getObjectMapperInstance()
				.convertValue(locationCacheDto.getAbDetails(), LocationAdvanceBookingDetailsDto.class);
		log.info("locationAdvanceBookingDetailsDto :{}", locationAdvanceBookingDetailsDto);
		List<String> invIdsInOrderDetails = new ArrayList<>();

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> resMap = stockManagementFacadeImp
				.moveItemsFromReserveBinToPreviousBin(locationCode,
						locationAdvanceBookingDetailsDto.getValidityDaysforReleaseInvInAdvancebooking(),
						invIdsInOrderDetails);
		log.info("resMap: {}", resMap);
		Map.Entry<StockTransactionDocNoDto, List<SyncStagingDto>> resMapEntry = resMap.entrySet().iterator().next();

		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType) && !resMap.isEmpty()) {
			for (SyncStagingDto syncStagingDto : resMapEntry.getValue()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}
		// Publishing
		if (!invIdsInOrderDetails.isEmpty()) {
			List<SyncStagingDto> syncStagingResponse = updateSalesOrderDetails(invIdsInOrderDetails);
			if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType)) {
				for (SyncStagingDto syncStagingDto : syncStagingResponse) {
					salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
				}
			}
		}

		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.SALES_REMOVE_FROM_RESERVEBIN.toString());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return schedulerResponseDto;
	}

	public List<SyncStagingDto> updateSalesOrderDetails(List<String> invIds) {

		List<OrderDetailsDaoExt> salesOrderList = orderDetailsRepository.findAllByInventoryIds(invIds);
		for (OrderDetailsDaoExt orderDaoExt : salesOrderList) {
			orderDaoExt.setStatus(TransactionStatusEnum.RELEASED.name());
			orderDaoExt.setSrcSyncId(orderDaoExt.getSrcSyncId() + 1);
		}
		orderDetailsRepository.saveAll(salesOrderList);
		return updateSalesOrderDetailsAndSaveToStaging(salesOrderList);
	}

	public List<SyncStagingDto> updateSalesOrderDetailsAndSaveToStaging(List<OrderDetailsDaoExt> orderDetailsDaos) {
		// inventoryDetailsDaos = inventoryDetailsRepository.saveAll(orderDetailsDaos);
		List<SyncStagingDto> syncStagingDtoList = new ArrayList<>();
		List<SyncStaging> stagingMessageList = new ArrayList<>();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType)) {

			final int chunkSize = 10;
			final AtomicInteger counter = new AtomicInteger();
			final Collection<List<OrderDetailsDaoExt>> chunkLists = orderDetailsDaos.stream()
					.collect(Collectors.groupingBy(data -> counter.getAndIncrement() / chunkSize)).values();
			chunkLists.forEach(chunck -> {
				SyncStagingDto syncStagingDto = new SyncStagingDto();
				OrderDetailsSyncDtoExt orderDetailsSyncDto = new OrderDetailsSyncDtoExt();
				List<SyncData> syncDatas = new ArrayList<>();
				syncDatas.add(DataSyncUtil.createSyncData(orderDetailsSyncDto.getSyncDtoExtList(chunck), 2));
				List<String> destinations = new ArrayList<>();
				destinations.add("EPOSS");
				MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDatas,
						SalesOperationCode.ORDER_CONFIRM, destinations, MessageType.FIFO.toString(),
						DestinationType.SELECTIVE.toString());
				syncStagingDto.setMessageRequest(messageRequest);
				String requestBody = MapperUtil.getJsonString(messageRequest);
				SyncStaging stagingMessage = new SyncStaging();
				stagingMessage.setMessage(requestBody);
				stagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
				stagingMessageList.add(stagingMessage);
				syncStagingDto.setId(stagingMessage.getId());
				syncStagingDtoList.add(syncStagingDto);
			});
			salesSyncStagingRepository.saveAll(stagingMessageList);
		}

		return syncStagingDtoList;
	}

	/**
	 * @param listInventoryItemsDto
	 * @param numberOfDays
	 * @param numberOfDays2
	 * @return
	 */
	@Transactional
	public Map<StockTransactionDocNoDto, List<SyncStagingDto>> moveItemsFromReserveBinToPreviousBin(String locationCode,
			Integer numberOfDays, List<String> invIdsOrderDetails) {
		List<StockTransactionDetailsDao> stockTransactionDetailsList = new ArrayList<>();
		Map<StockTransactionDocNoDto, List<SyncStagingDto>> responseMap = new HashMap<>();
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		short totalQuantity = 0;
		StockTransactionDocNoDto stockTransactionDocNoDto = new StockTransactionDocNoDto();
		StockTransactionDao stockTransaction = null;
		Date businessDate = businessDayService.getBodBusinessDay().getBusinessDate();
		// CALL EPOSS
		if (appType.equals(AppTypeEnum.POSS.toString())) {
			stockTransaction = epossCallService.callEposs(HttpMethod.GET, SalesUtil.INVENTORY_GET_DOCNUMBER_URL, null,
					null, StockTransactionDao.class);
		} else {
			stockTransaction = stockTransactionService.addBinStockTransaction(
					StockTransactionStatus.COMPLETED.toString(), StockTransactionType.BIN_TO_BIN.toString());
		}

		List<InventoryDetailsDao> invs = new ArrayList<>();
		List<SalesTxnDao> salesTransactionList = salesTxnRepository.findByTxnTypeInAndStatusAndLocationCode(
				Arrays.asList(TransactionTypeEnum.AB.name()), TransactionStatusEnum.CONFIRMED.name(), locationCode);
		List<String> orderstList = new ArrayList<>();
		if (!CollectionUtil.isEmpty(salesTransactionList)) {
			for (SalesTxnDao salesTransaction : salesTransactionList) {
				if (salesTransaction.getDocDate() != null
						&& CalendarUtils.getDayDiff(salesTransaction.getDocDate(), businessDate) >= numberOfDays) {
					orderstList.add(salesTransaction.getId());
				}
			}
		}
		if (!CollectionUtils.isEmpty(orderstList)) {
			List<OrderDetailsDaoExt> getListOfInventory = orderDetailsRepository.findAllByOrderIds(orderstList);
			if (!CollectionUtils.isEmpty(getListOfInventory)) {
				for (OrderDetailsDaoExt orderDetailsInvIds : getListOfInventory) {
					if (!orderDetailsInvIds.getStatus().equals(TransactionStatusEnum.RELEASED.name()))
						invIdsOrderDetails.add(orderDetailsInvIds.getInventoryId());
				}
			}
		}
		log.info("Current INVs :" + invIdsOrderDetails);
		if (!CollectionUtils.isEmpty(invIdsOrderDetails)) {
			List<InventoryDetailsDao> inventoryDetailList = inventoryService.getInventoryDetails(invIdsOrderDetails);

			String correlationId = UUID.randomUUID().toString();
			for (InventoryDetailsDao i : inventoryDetailList) {
				InventoryDetailsDao in = (InventoryDetailsDao) MapperUtil.getDtoMapping(i, InventoryDetailsDao.class);
				in.setCorrelationId(correlationId);
				invs.add(in);
			}
			for (InventoryDetailsDao inventoryDetails : invs) {

				setStockTransactionDetails(inventoryDetails.getPreviousBinCode(), stockTransactionDetailsList,
						stockTransaction, inventoryDetails, null, null);
				log.info("Total Qty " + inventoryDetails.getTotalQuantity());
				totalQuantity = (short) (totalQuantity + inventoryDetails.getTotalQuantity());
				totalValue = totalValue.add(inventoryDetails.getTotalValue());
				totalWeight = totalWeight.add(inventoryDetails.getTotalWeight());
				String binCode = inventoryDetails.getBinCode();
				String binGroup = inventoryDetails.getBinGroupCode();
				inventoryDetails.setBinCode(inventoryDetails.getPreviousBinCode());
				inventoryDetails.setBinGroupCode(inventoryDetails.getPreviousBinGroupCode());
				inventoryDetails.setPreviousBinCode(binCode);
				inventoryDetails.setPreviousBinGroupCode(binGroup);
				inventoryDetails.setDocType(DocTypeEnum.BINTOBIN.toString());
				inventoryDetails.setBinModifiedDate(new Date());
				inventoryDetails.setDocNumber(stockTransaction.getIssuedDocNo());
			}
			stockTransactionDocNoDto.setDocNo(stockTransaction.getIssuedDocNo());
			List<SyncStagingDto> stagingDtos = inventoryService.updateInventoryAndSaveToStaging(invs,
					stockTransaction.getId());
			if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appType)) {
				stockTransactionService.addStockTransactionDetails(stockTransactionDetailsList);
				setStockTransaction(totalValue, totalQuantity, totalWeight, stockTransaction);
				stockTransactionService.updateStockTransaction(stockTransaction);
			}
			responseMap.put(stockTransactionDocNoDto, stagingDtos);
		}
		return responseMap;

	}

	@Override
	@Transactional
	public StockTransactionDto createStockManagements(String transactionType) {
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		CountryDetailsDto countryDetailsDto = engineServiceClient.getCountryDetails(null);
		Integer docNo = salesDocService.getDocNumber(SalesDocTypeEnum.CUT_PIECE_OPEN,
				countryDetailsDto.getFiscalYear().shortValue());
		Short fiscalYear = countryDetailsDto.getFiscalYear().shortValue();
		StockTransactionDaoExt stockTransaction = new StockTransactionDaoExt();
		stockTransaction.setDocDate(businessDate);
		stockTransaction.setDocNo(docNo);
		stockTransaction.setFiscalYear(fiscalYear);
		stockTransaction.setTransactionType(transactionType);
		stockTransaction.setTotalQuantity((short) 0);
		stockTransaction.setTotalValue(BigDecimal.ZERO);
		stockTransaction.setTotalWeight(BigDecimal.ZERO);
		stockTransaction.setLocationCode(CommonUtil.getLocationCode());
		stockTransaction.setStatus(StockManagementStatusEnum.OPEN.toString());
		stockTransaction.setCurrencyCode("INR");
		stockTransaction.setWeightUnit("gms");
		stockTransaction = stockTransactionService.saveSalesStockTransaction(stockTransaction);
		return (StockTransactionDto) MapperUtil.getDtoMapping(stockTransaction, StockTransactionDto.class);
	}

	@Override
	public StockTransactionDto getStockManagements(String id, String transactionType) {
		StockTransactionDaoExt stockTransaction = getStockTransaction(id, transactionType);
		StockTransactionDto stockTxnDto = (StockTransactionDto) MapperUtil.getDtoMapping(stockTransaction,
				StockTransactionDto.class);
		List<StockTransactionDetailsDaoExt> stockTxnList = stockTransactionService
				.getSalesListStockTransaction(stockTransaction);
		List<String> itemIds = stockTxnList.stream().map(StockTransactionDetailsDaoExt::getId)
				.collect(Collectors.toList());
		log.debug("id {}", itemIds);
		stockTxnDto.setItemIds(itemIds);
		return stockTxnDto;
	}

	private StockTransactionDaoExt getStockTransaction(String id, String transactionType) {
		StockTransactionDaoExt stockTransaction = stockTransactionService.getSalesStockTransaction(id, transactionType,
				CommonUtil.getLocationCode());
		if (stockTransaction == null) {
			throw new ServiceException("Records not found", "ERR-SALE-070");
		}
		return stockTransaction;
	}

	@Override
	@Transactional
	public StockTransactionItemDto addItems(String id, String transactionType,
			StockTransactionAddItemDto stockTransactionAddItemDto) {
		StockTransactionDaoExt stockTxn = getStockTransaction(id, transactionType);
		if (StockManagementStatusEnum.CONFIRMED.toString().equals(stockTxn.getStatus())) {
			throw new ServiceException(CONFIRMED_TXN, ERR_SALE_022, STATUS + stockTxn.getStatus());
		}
		ItemDto itemDto = getItemCode(stockTransactionAddItemDto.getItemCode());
		com.titan.poss.core.dto.InventoryItemDto inventoryItemDto = engineServiceClient
				.validateInventoryItem(stockTransactionAddItemDto.getInventoryId(), null);

		validateCutPieceTep(stockTransactionAddItemDto, itemDto, inventoryItemDto, stockTxn);

		StockTransactionDetailsDaoExt stockTransactionDetailsDaoExt = saveItem(stockTransactionAddItemDto, stockTxn,
				itemDto, inventoryItemDto);
		updateHeader(stockTxn);
		return getItemDetailsResponse(stockTransactionDetailsDaoExt, inventoryItemDto);
	}

	/**
	 * @param stockTransactionDetailsDaoExt
	 * @return
	 */
	private StockTransactionItemDto getItemDetailsResponse(StockTransactionDetailsDaoExt stockTransactionDetailsDaoExt,
			com.titan.poss.core.dto.InventoryItemDto inventoryItemDto) {
		StockTransactionItemDto stockTransactionItemDto = (StockTransactionItemDto) MapperUtil
				.getDtoMapping(stockTransactionDetailsDaoExt, StockTransactionItemDto.class);

		JsonData itemDetails = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(stockTransactionDetailsDaoExt.getItemDetails()), JsonData.class);
		if (inventoryItemDto != null) {
			stockTransactionItemDto.setIsHallmarking(inventoryItemDto.getIsHallmarked());
		}
//		if(stockTransactionItemDto.getIsHallmarking()!=null && stockTransactionItemDto.getIsHallmarking().equals(Boolean.FALSE)) {
//			throw new ServiceException(" The variant is not hallmarked and hence have been moved to HM dispute bin.","ERR-SALE-420");
//		}
		stockTransactionItemDto.setItemDetails(itemDetails);
		stockTransactionItemDto.setStockTransactionId(stockTransactionDetailsDaoExt.getStockTransaction().getId());

		return stockTransactionItemDto;
	}

	private Map<String, Object> getItemDetailsJson(com.titan.poss.core.dto.InventoryItemDto inventoryItemDto) {
		Map<String, Object> itemDetails = new HashMap<>();
		CutPieceDto cutPieceDto = (CutPieceDto) MapperUtil.getDtoMapping(inventoryItemDto, CutPieceDto.class);
		cutPieceDto.setGrossWeight(inventoryItemDto.getStdWeight());
		cutPieceDto.setTotalValue(inventoryItemDto.getStdValue());
		JsonData totalWeightDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(inventoryItemDto.getTotalWeightDetails(), JsonData.class);
		WeightDetailsDto weightDto = MapperUtil.mapObjToClass(totalWeightDetails.getData(), WeightDetailsDto.class);
		JsonData metalData = new JsonData();
		metalData.setType("WEIGHT_DETAILS");
		metalData.setData(weightDto);
		cutPieceDto.setMetalWeight(metalData);
		itemDetails.put("ORIGINAL_ITEM", cutPieceDto);
		return itemDetails;
	}

	private StockTransactionDaoExt updateHeader(StockTransactionDaoExt stockTxn) {
		List<StockTransactionDetailsDaoExt> stockDetailsList = stockTransactionService
				.getSalesListStockTransaction(stockTxn);
		BigDecimal totalWeight = BigDecimal.ZERO;
		BigDecimal totalValue = BigDecimal.ZERO;
		Short totalQty = 0;
		for (StockTransactionDetailsDaoExt stockDaoExt : stockDetailsList) {
			totalWeight = totalWeight.add(stockDaoExt.getStdWeight());
			totalValue = totalValue.add(stockDaoExt.getStdValue());
			totalQty = (short) (totalQty + stockDaoExt.getQuantity());
		}
		stockTxn.setTotalQuantity(totalQty);
		stockTxn.setTotalValue(totalValue);
		stockTxn.setTotalWeight(totalWeight);
		return stockTransactionService.saveSalesStockTransaction(stockTxn);
	}

	private StockTransactionDetailsDaoExt saveItem(StockTransactionAddItemDto stockTransactionAddItemDto,
			StockTransactionDaoExt stockTxn, ItemDto itemDto,
			com.titan.poss.core.dto.InventoryItemDto inventoryItemDto) {
		StockTransactionDetailsDaoExt stockTransactionDetailsDao = new StockTransactionDetailsDaoExt();
		stockTransactionDetailsDao.setBinCode("CUTPIECE");
		stockTransactionDetailsDao.setBinGroupCode(CommonConstants.TEP_BIN_CODE);
		stockTransactionDetailsDao.setCurrencyCode("INR");
		stockTransactionDetailsDao.setItemCode(stockTransactionAddItemDto.getItemCode());
		stockTransactionDetailsDao.setKarat(itemDto.getKarat());
		stockTransactionDetailsDao.setLotNumber(stockTransactionAddItemDto.getLotNumber() + "CP");
		stockTransactionDetailsDao.setQuantity((short) 1);
		stockTransactionDetailsDao.setStockTransaction(stockTxn);
		stockTransactionDetailsDao.setStdValue(BigDecimal.ZERO);

		stockTransactionDetailsDao.setStdWeight(BigDecimal.ZERO);
		stockTransactionDetailsDao.setWeightUnit("gms");
		Map<String, Object> itemDetails = getItemDetailsJson(inventoryItemDto);
		JsonData itemJson = new JsonData();
		itemJson.setType("ITEM_DETAILS");
		itemJson.setData(itemDetails);
		stockTransactionDetailsDao.setItemDetails(MapperUtil.getStringFromJson(itemJson));
		return stockTransactionService.saveSalesStockTransactionDetails(stockTransactionDetailsDao);
	}

	private void validateCutPieceTep(StockTransactionAddItemDto stockTransactionAddItemDto, ItemDto itemDto,
			com.titan.poss.core.dto.InventoryItemDto inventoryItemDto, StockTransactionDaoExt stockTxn) {
		// if lot number contain CP then throw exception
		log.debug("lot number {}", stockTransactionAddItemDto.getLotNumber()
				.substring(stockTransactionAddItemDto.getLotNumber().length() - 2));
		if (inventoryItemDto.getLotNumber().substring(stockTransactionAddItemDto.getLotNumber().length() - 2)
				.equals("CP")) {
			throw new ServiceException("Cut piece is already done for the item code", "ERR-SALE-282",
					"item code : " + stockTransactionAddItemDto.getItemCode() + " & lot number : "
							+ stockTransactionAddItemDto.getLotNumber());
		}
		inventoryItemDto.setIsHallmarked(checkItemHallmark(inventoryItemDto));
		if (inventoryItemDto.getIsHallmarked().equals(false)) {
			throw new ServiceException("CUT-PIECE TEP not allowed for non hallmarked items", "ERR-SALE-477");
		}

		validateCutPieceCode(itemDto.getKarat(), stockTransactionAddItemDto.getItemCode());
		validateInventoryItemForCutPiece(inventoryItemDto.getInventoryId());
		long totalItem = stockTransactionService.getCountOfTotalQuantity(stockTxn);
		if (totalItem > 0) {
			throw new ServiceException("Only one item can be added", "ERR-SALE-260");
		}
	}

	private Boolean checkItemHallmark(com.titan.poss.core.dto.InventoryItemDto inventoryDetail) {
		Boolean isHallMarking = Boolean.FALSE;
		if (inventoryDetail.getItemDetails() != null) {
			JsonObject jsonObj = new JsonParser().parse(inventoryDetail.getItemDetails().toString()).getAsJsonObject();
			if (jsonObj != null && jsonObj.getAsJsonObject("data") != null
					&& jsonObj.getAsJsonObject("data").get("isHallMarking") != null) {
				JsonElement checkhallmarkElement = jsonObj.getAsJsonObject("data").get("isHallMarking");
				if (!JsonNull.INSTANCE.equals(checkhallmarkElement)) {
					isHallMarking = jsonObj.getAsJsonObject("data").get("isHallMarking").getAsBoolean();
				} else {
					isHallMarking = Boolean.FALSE; // if null set false

				}
			}
		}
		return isHallMarking;

	}

	private void validateCutPieceCode(BigDecimal karat, String cutPieceItemCode) {
		if (karat != null) {
			// if karat is 14 then cutPieceCode should be 11GOHYM007
			// if karat is 18 then cutPieceCode should be 11GOLYM009
			// if karat is 22 then cutPieceCode should be 11GOPYM008
			if (karat.compareTo(new BigDecimal(14)) == 0 && "11GOHYM007".equals(cutPieceItemCode)) {
				// do nothing
			} else if (karat.compareTo(new BigDecimal(18)) == 0 && "11GOLYM009".equals(cutPieceItemCode)) {
				// do nothing
			} else if (karat.compareTo(new BigDecimal(22)) == 0 && "11GOPYM008".equals(cutPieceItemCode)) {
				// do nothing
			} else {
				throw new ServiceException("Please provide valid cutPieceCode", "ERR-SALE-280");
			}
		}
	}

	private ItemDto getItemCode(String itemCode) {
		ItemSearchRequestDto itemsearch = new ItemSearchRequestDto();
		itemsearch.setItemCode(itemCode);
		PagedRestResponse<List<ItemDto>> itemList = engineServiceClient.getItems(itemsearch);
		if (CollectionUtils.isEmpty(itemList.getResults())) {
			throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
					"itemCode : " + itemCode);
		}
		return itemList.getResults().get(0);
	}

	private void checkCutPieceTepWeightTolerance(BigDecimal itemWeight, BigDecimal cutPieceWeight,
			BigDecimal weightTolerancePercent) {
		BigDecimal limit = weightTolerancePercent.divide(BigDecimal.valueOf(100)).multiply(itemWeight)
				.setScale(DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE);
		if (cutPieceWeight.compareTo(limit) > 0) {
			throw new ServiceException("Cut piece weight is exceeding than weight tolerance limit", "ERR-SALE-281",
					"cut piece weight : " + cutPieceWeight + " & limit : " + limit);
		}
	}

	private void validateInventoryItemForCutPiece(String inventoryId) {
		com.titan.poss.core.dto.InventoryItemDto inventoryItemDto = engineServiceClient
				.validateInventoryItem(inventoryId, null);
		if (inventoryItemDto == null) {
			throw new ServiceException("This item is not available in the inventory", "ERR-SALE-279");
		}
		// if the store is an L3 boutique then bin group code should be PURCFA
		// if the store is an L1,L2 boutique then bin group code should be STN
		if (Boolean.TRUE.equals(CustomSecurityPrincipal.getSecurityPrincipal().isAnL3StoreUser())) {
			if (!BinGroupEnum.PURCFA.toString().equals(inventoryItemDto.getBinGroupCode())) {
				throw new ServiceException(
						"This item is not in PURCFA bin group and the item is not available for sale", "ERR-SALE-316",
						"bin group code : " + inventoryItemDto.getBinGroupCode());
			}
		} else {
			if (BinGroupEnum.RESERVEBIN.toString().equals(inventoryItemDto.getBinGroupCode())) {
				throw new ServiceException("This product is in Reserve bin, Cut piece tep is not allowed for this Item",
						"ERR-SALE-412", "bin group code : " + inventoryItemDto.getBinGroupCode());
			}

			if (!BinGroupEnum.STN.toString().equals(inventoryItemDto.getBinGroupCode())) {
				throw new ServiceException("This item is not in STN bin group and the item is not available for sale",
						"ERR-SALE-285", "bin group code : " + inventoryItemDto.getBinGroupCode());
			}
		}
		if (inventoryItemDto.getTotalQuantity() == 0) {
			throw new ServiceException("This item is not available in the inventory", "ERR-SALE-279",
					"total quantity : " + inventoryItemDto.getTotalQuantity());
		}
		if (inventoryItemDto.getLotNumber().substring(inventoryItemDto.getLotNumber().length() - 2).equals("CP")) {
			throw new ServiceException("Cut piece is already done for the item code", "ERR-SALE-282");
		}
	}

	private StandardPriceResponseDto getGoldPrice(MetalRateListDto metalRateListDto) {
		StandardPriceResponseDto priceResponse = metalRateListDto.getMetalRates().get(MetalTypeCodeEnum.J.getCode());
		if (priceResponse == null) {
			throw new ServiceException("Gold price is not available", "ERR-SALE-277");
		}
		return priceResponse;
	}

	@Override
	public StockTransactionItemDto getItems(String id, String transactionType, String itemId) {
		StockTransactionDaoExt stockTxn = getStockTransaction(id, transactionType);
		StockTransactionDetailsDaoExt stockTxnDetails = getStockTransactionItemDetails(itemId, stockTxn);
		StockTransactionItemDto stockTransactionItemDto = (StockTransactionItemDto) MapperUtil
				.getDtoMapping(stockTxnDetails, StockTransactionItemDto.class);
		JsonData itemDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(stockTxnDetails.getItemDetails()), JsonData.class);
		JsonNode itemDetail = getItemData(stockTxnDetails.getItemDetails());

		String inventoryId = itemDetail.path("inventoryId").asText();
		stockTransactionItemDto.setItemDetails(itemDetails);
		stockTransactionItemDto.setFinalValue(stockTxnDetails.getStdValue());
		stockTransactionItemDto.setTotalWeight(stockTxnDetails.getStdWeight());
		stockTransactionItemDto.setMeasuredWeight(stockTxnDetails.getStdWeight());
		InventoryDetailsDao inventoryDetailsDao = inventoryDetailsRepository.findById(inventoryId).get();
		stockTransactionItemDto.setIsHallmarking(inventoryDetailsDao.getIsHallmarked());
		stockTransactionItemDto.setStockTransactionId(stockTxnDetails.getStockTransaction().getId());
		return stockTransactionItemDto;
	}

	private StockTransactionDetailsDaoExt getStockTransactionItemDetails(String itemId,
			StockTransactionDaoExt stockTxn) {
		StockTransactionDetailsDaoExt stockTxnDetails = stockTransactionService
				.getSalesStockTransactionDetails(stockTxn, itemId);
		if (stockTxnDetails == null) {
			throw new ServiceException("Records not found", "ERR-SALE-070");
		}
		return stockTxnDetails;
	}

	@Override
	@Transactional
	public StockTransactionItemDto updateItems(String id, String transactionType, String itemId,
			StockTransactionUpdateItemDto stockTransactionUpdateItemDto) {
		StockTransactionDaoExt stockTxn = getStockTransaction(id, transactionType);
		if (StockManagementStatusEnum.CONFIRMED.toString().equals(stockTxn.getStatus())) {
			throw new ServiceException(CONFIRMED_TXN, ERR_SALE_022, STATUS + stockTxn.getStatus());
		}
		StockTransactionDetailsDaoExt stockTxnDetails = getStockTransactionItemDetails(itemId, stockTxn);
		JsonNode itemDetails = getItemData(stockTxnDetails.getItemDetails());
		String itemCode = itemDetails.path("itemCode").asText();
		BigDecimal itemGrossWeight = new BigDecimal(itemDetails.path("grossWeight").asText());
		TepItemResponseDto tepItem = engineServiceClient.getTepItem(itemCode, null, transactionType);
		checkCutPieceTepWeightTolerance(itemGrossWeight, stockTransactionUpdateItemDto.getMeasuredWeight(),
				tepItem.getTepCutPieceConfig().getWeightTolerancePercent());
		MetalRateListDto metalRateList = commonTransactionService.getMetalRate();
		StandardPriceResponseDto standardPriceResp = getGoldPrice(metalRateList);
		JsonNode itemDetail = getItemData(stockTxnDetails.getItemDetails());

		String inventoryId = itemDetail.path("inventoryId").asText();
		com.titan.poss.core.dto.InventoryItemDto inventoryItemDto = engineServiceClient
				.validateInventoryItem(inventoryId, null);
		TepPriceRequest tepPriceRequest = new TepPriceRequest();
		tepPriceRequest.setItemCode(itemCode);
		tepPriceRequest
				.setLotNumber(stockTxnDetails.getLotNumber().substring(0, stockTxnDetails.getLotNumber().length() - 2));
		tepPriceRequest.setMeasuredQuantity((short) 1);
		tepPriceRequest.setMeasuredWeight(stockTransactionUpdateItemDto.getMeasuredWeight());
		tepPriceRequest.setTepType(TepTypeEnum.TEP_CUT_PIECE_TOT.name());
		CutPieceTepPriceResponseDto cutPieceTepPriceResponse = engineServiceClient
				.getCutPieceTepPriceDetails(tepPriceRequest);

		stockTxnDetails.setStdValue(cutPieceTepPriceResponse.getCutPieceValue());
		stockTxnDetails.setStdWeight(cutPieceTepPriceResponse.getCutPieceWeight());
		stockTxnDetails = stockTransactionService.saveSalesStockTransactionDetails(stockTxnDetails);
		updateHeader(stockTxn);

		return getItemDetailsResponse(stockTxnDetails, inventoryItemDto);
	}

	private JsonNode getItemData(String itemDetails) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(MapperUtil.getJsonFromString(itemDetails),
				JsonData.class);
		JsonNode itemData = null;
		try {
			JsonNode root = MapperUtil.getObjectMapperInstance()
					.readTree(MapperUtil.getStringFromJson(jsonData.getData()));
			itemData = root.path("ORIGINAL_ITEM");
		} catch (IOException e) {
			throw new ServiceException("Unable to parse Json Data", "ERR-CORE-003");
		}
		return itemData;
	}

	@Override
	@Transactional
	public StockTransactionDto updateStockTransaction(String id, String transactionType,
			StockTransactionUpdateDto stockTransactionUpdateDto) {
		StockTransactionDaoExt stockTxn = getStockTransaction(id, transactionType);
		stockTxn.setEmployeeCode(stockTransactionUpdateDto.getEmployeeCode());
		stockTransactionService.saveSalesStockTransaction(stockTxn);
		return (StockTransactionDto) MapperUtil.getDtoMapping(stockTxn, StockTransactionDto.class);
	}

	@Override
	public StockTransactionDto confirmStockTransaction(String id, String transactionType,
			StockTransactionConfirmDto stockTransactionConfirmDto) {
		PublishResponse stockTxnResponse = stockManagementFacadeImp.confirmStockTransactional(id, transactionType,
				stockTransactionConfirmDto);

		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType)) {
			for (SyncStagingDto syncStagingDto : stockTxnResponse.getSyncStagingDtoList()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}

		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(stockTxnResponse.getApiResponse(), new TypeReference<StockTransactionDto>() {
		});
	}

	@Transactional(value = "chainedTransaction")
	public PublishResponse confirmStockTransactional(String id, String transactionType,
			StockTransactionConfirmDto stockTransactionConfirmDto) {
		StockTransactionDaoExt stockTxn = getStockTransaction(id, transactionType);
		List<StockTransactionDetailsDaoExt> itemList = stockTransactionService.getSalesListStockTransaction(stockTxn);
		JsonNode itemDetailsJson = getItemData(itemList.get(0).getItemDetails());
		String inventoryId = itemDetailsJson.path("inventoryId").asText();
		validateConfirmStockTransaction(inventoryId, stockTransactionConfirmDto, stockTxn);
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();
		CountryDetailsDto countryDetailsDto = engineServiceClient.getCountryDetails(null);
		Integer docNo = salesDocService.getDocNumber(SalesDocTypeEnum.CUT_PIECE_OPEN,
				countryDetailsDto.getFiscalYear().shortValue());
		stockTxn.setDocDate(businessDate);
		stockTxn.setDocNo(docNo);
		stockTxn.setStatus(StockManagementStatusEnum.CONFIRMED.toString());
		stockTxn.setEmployeeCode(stockTransactionConfirmDto.getEmployeeCode());
		stockTxn.setRemarks(stockTransactionConfirmDto.getRemarks());
		stockTransactionService.saveSalesStockTransaction(stockTxn);

		InventoryDetailsDao inventoryDetailsDao = inventoryDetailsRepository.findById(inventoryId).get();
		Map<String, StandardPriceResponseDto> goldRate = engineServiceClient.getStandardMetalRate();

		TepPriceRequest tepPriceRequest = new TepPriceRequest();
		tepPriceRequest.setItemCode(inventoryDetailsDao.getItemCode());
		tepPriceRequest.setLotNumber(inventoryDetailsDao.getLotNumber());
		if (inventoryDetailsDao.getTotalQuantity() > 1) {
			tepPriceRequest.setMeasuredQuantity((short) 1);
		} else {
			tepPriceRequest.setMeasuredQuantity(inventoryDetailsDao.getTotalQuantity());
		}

		tepPriceRequest.setCustomerMobileNo(null);
		tepPriceRequest.setCashMemoDetailsId(inventoryDetailsDao.getId());
		tepPriceRequest.setTepType(TepTypeEnum.TEP_CUT_PIECE_TOT.name());
		tepPriceRequest.setStandardPrice(goldRate);
		tepPriceRequest.setMeasuredWeight(stockTransactionConfirmDto.getTotalWeight());

		CutPieceTepPriceResponseDto cutPieceTepPriceResponse = engineServiceClient
				.getCutPieceTepPriceDetails(tepPriceRequest);

		List<InventoryDetailsDao> inventoryDetailsList = inventoryService.updateInventoryCutPeice(inventoryDetailsDao,
				docNo, inventoryId, goldRate, cutPieceTepPriceResponse, transactionType, itemList.get(0));

		StockTransactionDto stockTxnDto = (StockTransactionDto) MapperUtil.getDtoMapping(stockTxn,
				StockTransactionDto.class);

		if (appType.equals(AppTypeEnum.POSS.toString())) {
			LotDto lotNumberDetailReqDto = new LotDto();
			lotNumberDetailReqDto.setItemCode(inventoryDetailsDao.getItemCode());
			lotNumberDetailReqDto.setLotNumber(
					inventoryDetailsDao.getLotNumber().substring(0, inventoryDetailsDao.getLotNumber().length() - 2));
			log.debug("lot request details--->" + lotNumberDetailReqDto);
			epossCallService.callEposs(HttpMethod.PUT, SalesUtil.INVENTORY_UPDATE_CUTPIECE_URL, null,
					lotNumberDetailReqDto, null);
		}

		saveLotStoneDetails(inventoryDetailsDao.getItemCode(),
				inventoryDetailsDao.getLotNumber().substring(0, inventoryDetailsDao.getLotNumber().length() - 2));

		List<SyncStagingDto> syncStagingDtoList = new ArrayList<>();
		List<SyncStaging> stagingMessageList = new ArrayList<>();
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType)) {
			StockTransactionDetailsSyncDtoExt stockTransactionDetailsSyncDtoExt = new StockTransactionDetailsSyncDtoExt();
			InventoryDetailsSyncDtoExt inventorySyncDto = new InventoryDetailsSyncDtoExt();
			List<SyncData> syncDatas = new ArrayList<>();
			syncDatas.add(DataSyncUtil.createSyncData(new StockTransactionSyncDtoExt(stockTxn), 2)); // stock
																										// transaction
																										// table
			syncDatas.add(DataSyncUtil
					.createSyncData(stockTransactionDetailsSyncDtoExt.getStockTransactionDetailsDtoList(itemList), 3)); // //stock
																														// transaction
																														// detail
			syncDatas.add(
					DataSyncUtil.createSyncData(inventorySyncDto.getSyncDtoExtList(inventoryDetailsList, null), 0)); // inventory
																														// details

			List<String> destinations = new ArrayList<>();
			destinations.add("EPOSS");
			MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDatas,
					InventoryOperationCodes.CUTPIECE_CONFIRM, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			syncStagingDto.setMessageRequest(messageRequest);
			String requestBody = MapperUtil.getJsonString(messageRequest);
			SyncStaging stagingMessage = new SyncStaging();
			stagingMessage.setMessage(requestBody);
			stagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			stagingMessageList.add(stagingMessage);
			syncStagingDto.setId(stagingMessage.getId());
			syncStagingDtoList.add(syncStagingDto);

			salesSyncStagingRepository.saveAll(stagingMessageList);

		}

		PublishResponse stckResponse = new PublishResponse();
		stckResponse.setApiResponse(stockTxnDto);
		stckResponse.setSyncStagingDto(syncStagingDto);
		stckResponse.setSyncStagingDtoList(syncStagingDtoList);
		if (!inventoryDetailsDao.getIsHallmarked()) {
			throw new ServiceException("Item is not hallmarked hence cutpeice TEP not allowed", "ERR_SALE_420");
		}
		return stckResponse;
	}

	private List<LotDetailsDao> saveLotStoneDetails(String itemCode, String lotNumber) {

		List<LotDetailsDao> lotDetailsDaoList = lotDetailsRepository
				.findByLotDetailsIdItemItemCodeAndLotDetailsIdLotNumber(itemCode, lotNumber);
		log.debug("lot stone details--->" + lotDetailsDaoList);
		List<LotDetailsDao> templLotnumberDetailsList = new ArrayList<>();
		if (lotDetailsDaoList != null && !lotDetailsDaoList.isEmpty()) {
			for (LotDetailsDao lotDetailsDao : lotDetailsDaoList) {
				LotDetailsDao lotDetailsDao1 = (LotDetailsDao) MapperUtil.getObjectMapping(lotDetailsDao,
						new LotDetailsDao(), "lotDetailsId");
				LotDetailsIdDao lotDetailsId = new LotDetailsIdDao();
				lotDetailsId.setItem(lotDetailsDao.getLotDetailsId().getItem());
				lotDetailsId.setLineItemNo(lotDetailsDao.getLotDetailsId().getLineItemNo());
				lotDetailsId.setLotNumber(lotDetailsDao.getLotDetailsId().getLotNumber() + "CP");
				lotDetailsDao1.setLotDetailsId(lotDetailsId);
				templLotnumberDetailsList.add(lotDetailsDao1);
			}
		}

		if (!templLotnumberDetailsList.isEmpty()) {
			log.debug("new lot stone details--->" + templLotnumberDetailsList);
			templLotnumberDetailsList = lotDetailsRepository.saveAll(templLotnumberDetailsList);
		}
		return templLotnumberDetailsList;
	}

	private Map<String, Object> updatedItemDetailsJson(JsonNode itemDetailsJson, StockTransactionDaoExt stockTxn) {
		Map<String, Object> itemDetails = new HashMap<>();
		CutPieceDto originalItem = MapperUtil.mapObjToClass(itemDetailsJson, CutPieceDto.class);
		itemDetails.put("ORIGINAL_ITEM", originalItem);
		CutPieceDto updateItem = (CutPieceDto) MapperUtil.getDtoMapping(originalItem, CutPieceDto.class);
		updateItem.setGrossWeight(originalItem.getGrossWeight().subtract(stockTxn.getTotalWeight()));
//		updateItem.set
		return null;
	}

	private void validateConfirmStockTransaction(String inventoryId,
			StockTransactionConfirmDto stockTransactionConfirmDto, StockTransactionDaoExt stockTxn) {
		validateInventoryItemForCutPiece(inventoryId);
		validateInput(stockTransactionConfirmDto, stockTxn);
	}

	private void validateInput(StockTransactionConfirmDto stockTransactionConfirmDto, StockTransactionDaoExt stockTxn) {
		if (!stockTxn.getTotalQuantity().equals(stockTransactionConfirmDto.getTotalQuantity())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"DB total quantity : " + stockTxn.getTotalQuantity() + " and UI total quantity : "
							+ stockTransactionConfirmDto.getTotalQuantity());
		}
		if (stockTxn.getTotalValue().compareTo(stockTransactionConfirmDto.getTotalValue()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048, "DB total value : "
					+ stockTxn.getTotalValue() + " and UI total value : " + stockTransactionConfirmDto.getTotalValue());
		}
		if (stockTxn.getTotalWeight().compareTo(stockTransactionConfirmDto.getTotalWeight()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"DB total weight : " + stockTxn.getTotalWeight() + " and UI total weight : "
							+ stockTransactionConfirmDto.getTotalWeight());
		}
	}

	private List<InventoryDetailsDao> removeItemFromInventory(Integer docNo, String inventoryId) {
		UpdateInventoryDto updateInventory = new UpdateInventoryDto();
		updateInventory.setId(inventoryId);
		updateInventory.setTotalQuantity((short) 1);
		List<UpdateInventoryDto> updateInvList = List.of(updateInventory);
		return inventoryService.removeFromInventoryDetails(updateInvList, docNo, SalesDocTypeEnum.TEP);
	}

	@Override
	@Transactional
	public StockTransactionDto deleteStockTransactionItem(String id, String transactionType, String itemId) {
		StockTransactionDaoExt stockTxn = getStockTransaction(id, transactionType);
		if (StockManagementStatusEnum.CONFIRMED.toString().equals(stockTxn.getStatus())) {
			throw new ServiceException(CONFIRMED_TXN, ERR_SALE_022, STATUS + stockTxn.getStatus());
		}
		StockTransactionDetailsDaoExt stockTxnDetails = getStockTransactionItemDetails(itemId, stockTxn);
		stockTransactionService.deleteStockTxnItems(stockTxnDetails);
		stockTxn = updateHeader(stockTxn);
		return (StockTransactionDto) MapperUtil.getDtoMapping(stockTxn, StockTransactionDto.class);
	}

	@Override
	@Transactional
	public void deleteStockTransaction(String id, String transactionType) {
		StockTransactionDaoExt stockTxn = getStockTransaction(id, transactionType);
		if (StockManagementStatusEnum.CONFIRMED.toString().equals(stockTxn.getStatus())) {
			throw new ServiceException(CONFIRMED_TXN, ERR_SALE_022, STATUS + stockTxn.getStatus());
		}
		stockTxn.setStatus(StockManagementStatusEnum.DELETED.toString());
		stockTransactionService.saveSalesStockTransaction(stockTxn);
	}

	@Override
	public PagedRestResponse<List<BaseTransactionDetailsDto>> getTransactionDetails(String transactionType,
			Integer docNo, Short fiscalYear, String status, Pageable pageable) {
		Page<BaseTransactionDetailsDto> transactionDetailsDtoList = stockTransactionRepository
				.listTxnDetails(transactionType, docNo, fiscalYear, status, CommonUtil.getStoreCode(), pageable);

		return new PagedRestResponse<>(transactionDetailsDtoList.getContent(), transactionDetailsDtoList);
	}

	@Override
	public ListResponse<StockTransactionStatusCountDto> getStockManagementsCount(String transactionType, String status,
			Pageable pageable) {

		return new ListResponse<>(
				stockTransactionRepository.listTransactioncount(transactionType, status, CommonUtil.getLocationCode()));

	}

	@Override
	public InventoryItemDtoList uploadFile(MultipartFile file) {
		// TODO Auto-generated method stub
		log.info("Till here reached...");
		InventoryItemDtoList itemsList = new InventoryItemDtoList();
		List<InventoryDetailsDao> existingItems = new ArrayList<>();
		List<String> outOfStock = new ArrayList<>();
		List<String> invalidBinItems = new ArrayList<>();
		List<InventoryItemDto> binToBinTransferList = new ArrayList<>();
		LocationCacheDto locationCacheDtoBtq = inventoryEngineService.getLocationDetail(CommonUtil.getLocationCode());
		log.info("Till here reaching...");
		if (SalesUtil.hasExcelFormat(file)) {
			try {
				List<BinToBinFileUploadDto> binValues = new ArrayList<>();
				List<String[]> getCsvData = new ArrayList<>();
				getCsvData = FileUtil.readCSVFile(file, ' ');
				for (String[] a : getCsvData) {
					BinToBinFileUploadDto uploadedItems = new BinToBinFileUploadDto();
					for (String ab : a) {
						String[] values = ab.split(",");
						uploadedItems.setItemCode(values[0]);
						uploadedItems.setLotNumber(values[1]);
						binValues.add(uploadedItems);
					}
				}

				AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
				UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
				List<String> binGroups = new ArrayList<>();
				List<String> binGroupsCheck = new ArrayList<>();
				binGroupsCheck.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));
				binGroups.add(null);
				for (BinToBinFileUploadDto entry : binValues) {
					existingItems = inventoryDetailsRepository.getInventoryItemsFileUpload(entry.getItemCode(),
							entry.getLotNumber(), locationCacheDtoBtq.getLocationCode(), binGroups);

					if (!existingItems.isEmpty()) {
						for (InventoryDetailsDao inventoryDetailList : existingItems) {
							if (!inventoryDetailList.getBinGroupCode().equals(BinGroupEnum.CUSTOMERORDERBIN.name())) {
								InventoryItemDto binToBinTransferItemDetails = (InventoryItemDto) MapperUtil
										.getDtoMapping(inventoryDetailList, InventoryItemDto.class);
								if (binGroupsCheck.contains(inventoryDetailList.getBinGroupCode())) {
									binToBinTransferItemDetails.setIsBinToBinAllowed(true);
								} else {
									binToBinTransferItemDetails.setIsBinToBinAllowed(false);
								}
								// binGroup code in Valid list : add item to response, else to invalidItems
								// list)
								binToBinTransferItemDetails.setBinCode(inventoryDetailList.getBinCode());
								binToBinTransferItemDetails.setBinGroupCode(inventoryDetailList.getBinGroupCode());
								binToBinTransferItemDetails.setItemDetails(
										MapperUtil.getJsonFromString(inventoryDetailList.getItemDetails()));
								binToBinTransferItemDetails.setImageURL(
										new URLUtil().getImageUrlByItemCode(inventoryDetailList.getItemCode()));
								binToBinTransferItemDetails
										.setAvailableQuantity(inventoryDetailList.getTotalQuantity());
								binToBinTransferItemDetails.setAvailableValue(inventoryDetailList.getTotalValue());
								binToBinTransferItemDetails.setAvailableWeight(inventoryDetailList.getTotalWeight());

								binToBinTransferItemDetails
										.setProductCategory(inventoryDetailList.getProductCategory());
								// binToBinTransferItemDetails
								// .setProductCategoryDesc(productCategoryList.get(inventoryDetailList.getProductCategory()));
								binToBinTransferItemDetails.setProductGroup(inventoryDetailList.getProductGroup());
								// binToBinTransferItemDetails
								// .setProductGroupDesc(productGroupList.get(inventoryDetailList.getProductGroup()));
								binToBinTransferItemDetails.setItemCode(inventoryDetailList.getItemCode().trim());
								binToBinTransferList.add(binToBinTransferItemDetails);

							} else {
								invalidBinItems.add(inventoryDetailList.getItemCode());
							}
						}
						itemsList.setItems(binToBinTransferList);
					} else {
						outOfStock.add(entry.getItemCode()); // Add out of stock items seprately to show.
					}
				}

			} catch (Exception e) {
				throw new RuntimeException("fail to parse Excel file ");
			}
		} else {
			throw new RuntimeException("Invalid file type");
		}
		itemsList.setNotInStock(outOfStock);
		itemsList.setInvalidItems(invalidBinItems);
		itemsList.setItems(binToBinTransferList);
		return itemsList;
	}

	@Override
	@Transactional
	public FileItemStageDto uploadFileBinToBinTransfer(MultipartFile file) {

		List<BinToBinFileItemsStageDao> binToBinFileItemsStageList = new ArrayList<>();
		FileItemStageDto fileItemRes = new FileItemStageDto();

		if (SalesUtil.hasExcelFormat(file)) {
			try {
				List<BinToBinFileUploadDto> binValues = new ArrayList<>();
				List<String[]> getCsvData = new ArrayList<>();
				getCsvData = FileUtil.readCSVFile(file, ' ');
				for (String[] a : getCsvData) {
					BinToBinFileUploadDto uploadedItems = new BinToBinFileUploadDto();
					for (String ab : a) {
						String[] values = ab.split(",");
						uploadedItems.setItemCode(values[0]);
						uploadedItems.setLotNumber(values[1]);
						if (!binValues.contains(uploadedItems)) {
							binValues.add(uploadedItems);
						}

					}
				}
				AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
				UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
				List<String> binGroupsCheck = new ArrayList<>();
				binGroupsCheck.addAll(binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType));

				BinToBinFileStageDao binToBinFileStage = new BinToBinFileStageDao();
				binToBinFileStage.setFileName(file.getOriginalFilename());
				binToBinFileStage.setLocationCode(CommonUtil.getLocationCode());
				binToBinFileStage.setUserId(authUser.getUsername());
				binToBinFileStage.setStatus("OPEN");
				binToBinFileStage = binToBinFileStageRepository.save(binToBinFileStage);
				fileItemRes.setFileId(binToBinFileStage.getId());
				for (BinToBinFileUploadDto entry : binValues) {
					List<InventoryDetailsDao> existingItems = inventoryDetailsRepository
							.findByItemCodeAndLotNumberAndLocationCode(entry.getItemCode(), entry.getLotNumber(),
									CommonUtil.getLocationCode());

					if (!CollectionUtil.isEmpty(existingItems)) {
						for (InventoryDetailsDao inventoryDetail : existingItems) {
							if (inventoryDetail.getTotalQuantity() - inventoryDetail.getIssuedQuantity() > 0
									&& binGroupsCheck.contains(inventoryDetail.getBinGroupCode())) {
								BinToBinFileItemsStageDao binToBinFileItemsStage = new BinToBinFileItemsStageDao();
								binToBinFileItemsStage.setItemCode(inventoryDetail.getItemCode());
								binToBinFileItemsStage.setLotNumber(inventoryDetail.getLotNumber());
								binToBinFileItemsStage.setQuantity(inventoryDetail.getTotalQuantity());
								binToBinFileItemsStage.setInventoryId(inventoryDetail.getId());
								binToBinFileItemsStage.setBinToBinFileStage(binToBinFileStage);
								binToBinFileItemsStage.setItemStatus(BinStageItemStatusEnum.VALID_ITEM.toString());
								binToBinFileItemsStage.setStatus("OPEN");
								binToBinFileItemsStageList.add(binToBinFileItemsStage);

							} else {
								BinToBinFileItemsStageDao binToBinFileItemsStage = new BinToBinFileItemsStageDao();
								binToBinFileItemsStage.setItemCode(inventoryDetail.getItemCode());
								binToBinFileItemsStage.setLotNumber(inventoryDetail.getLotNumber());
								binToBinFileItemsStage.setQuantity(inventoryDetail.getTotalQuantity());
								binToBinFileItemsStage.setInventoryId(inventoryDetail.getId());
								binToBinFileItemsStage.setBinToBinFileStage(binToBinFileStage);
								binToBinFileItemsStage.setItemStatus(BinStageItemStatusEnum.INVALID_ITEM.toString());
								binToBinFileItemsStage.setStatus("OPEN");
								binToBinFileItemsStageList.add(binToBinFileItemsStage);

							}
						}

					} else {
						BinToBinFileItemsStageDao binToBinFileItemsStage = new BinToBinFileItemsStageDao();
						binToBinFileItemsStage.setItemCode(entry.getItemCode());
						binToBinFileItemsStage.setLotNumber(entry.getLotNumber());
						binToBinFileItemsStage.setBinToBinFileStage(binToBinFileStage);
						binToBinFileItemsStage.setItemStatus(BinStageItemStatusEnum.NON_STOCK.toString());
						binToBinFileItemsStage.setStatus("OPEN");
						binToBinFileItemsStageList.add(binToBinFileItemsStage);
					}
				}

			} catch (Exception e) {

				throw new RuntimeException("fail to parse Excel file ");
			}
		} else {
			throw new RuntimeException("Invalid file type");
		}
		if (!CollectionUtils.isEmpty(binToBinFileItemsStageList)) {
			binToBinFileItemsStageRepository.saveAll(binToBinFileItemsStageList);
		}

		return fileItemRes;

	}

	@Override
	@Transactional
	public InventoryBinToBinItemsDtoList getBinsTransferItems(Integer id, Pageable pageable) {

		BinToBinFileStageDao binToBinFileStage = binToBinFileStageRepository.findById(id).orElseThrow(
				() -> new ServiceException("No details found for uploaded file requested id", ERR_INV_060, "id" + id));
		InventoryBinToBinItemsDtoList itemsList = new InventoryBinToBinItemsDtoList();

		getInvalidItems(itemsList, binToBinFileStage);

		Page<BinToBinFileItemsStageDao> binToBinFileItemsPageList = binToBinFileItemsStageRepository
				.findAll(generateCriteria(binToBinFileStage), pageable);

		List<InventoryItemDtoExt> binToBinTransferList = new ArrayList<>();

		for (BinToBinFileItemsStageDao binToBinFileItemsStage : binToBinFileItemsPageList.getContent()) {
			Optional<InventoryDetailsDao> existingItems = inventoryDetailsRepository
					.findByIdAndItemCodeAndLotNumberAndLocationCode(binToBinFileItemsStage.getInventoryId(),
							binToBinFileItemsStage.getItemCode(), binToBinFileItemsStage.getLotNumber(),
							CommonUtil.getLocationCode());
			if (existingItems.isPresent()) {
				InventoryDetailsDao inventoryDetail = existingItems.get();
				InventoryItemDtoExt binToBinTransferItemDetails = (InventoryItemDtoExt) MapperUtil
						.getDtoMapping(inventoryDetail, InventoryItemDtoExt.class);
				binToBinTransferItemDetails.setIsBinToBinAllowed(true);
				binToBinTransferItemDetails.setBinCode(inventoryDetail.getBinCode());
				binToBinTransferItemDetails.setBinGroupCode(inventoryDetail.getBinGroupCode());
				binToBinTransferItemDetails
						.setItemDetails(MapperUtil.getJsonFromString(inventoryDetail.getItemDetails()));
				binToBinTransferItemDetails
						.setImageURL(new URLUtil().getImageUrlByItemCode(inventoryDetail.getItemCode()));
				binToBinTransferItemDetails.setAvailableQuantity(inventoryDetail.getTotalQuantity());
				binToBinTransferItemDetails.setAvailableValue(inventoryDetail.getTotalValue());
				binToBinTransferItemDetails.setAvailableWeight(inventoryDetail.getTotalWeight());
				binToBinTransferItemDetails.setProductCategory(inventoryDetail.getProductCategory());
				binToBinTransferItemDetails.setProductGroup(inventoryDetail.getProductGroup());
				binToBinTransferItemDetails.setItemCode(inventoryDetail.getItemCode().trim());
				binToBinTransferItemDetails.setFileId(id);
				binToBinTransferList.add(binToBinTransferItemDetails);
			}
		}

		itemsList.setItems(new PagedRestResponse<>(binToBinTransferList, binToBinFileItemsPageList));
		return itemsList;
	}

	private void getInvalidItems(InventoryBinToBinItemsDtoList itemsList, BinToBinFileStageDao binToBinFileStage) {

		List<BinToBinFileItemsStageDao> invalidFileItemList = binToBinFileItemsStageRepository
				.findByBinToBinFileStageAndItemStatus(binToBinFileStage,
						BinStageItemStatusEnum.INVALID_ITEM.toString());
		List<BinToBinFileItemsStageDao> nonStockFileItemList = binToBinFileItemsStageRepository
				.findByBinToBinFileStageAndItemStatus(binToBinFileStage, BinStageItemStatusEnum.NON_STOCK.toString());
		List<String> invalidItems = new ArrayList<>();
		List<String> nonStockItems = new ArrayList<>();
		List<String> listTobeDeleted = new ArrayList<>();
		if (!CollectionUtil.isEmpty(invalidFileItemList)) {
			invalidItems = invalidFileItemList.stream().map(item -> item.getItemCode()).distinct()
					.collect(Collectors.toList());
			listTobeDeleted.addAll(invalidFileItemList.stream().map(item -> item.getId()).collect(Collectors.toList()));
		}
		if (!CollectionUtil.isEmpty(nonStockFileItemList)) {
			nonStockItems = nonStockFileItemList.stream().map(item -> item.getItemCode()).distinct()
					.collect(Collectors.toList());
			listTobeDeleted
					.addAll(nonStockFileItemList.stream().map(item -> item.getId()).collect(Collectors.toList()));
		}
		itemsList.setInvalidItems(invalidItems);
		itemsList.setNotInStock(nonStockItems);
		if (!CollectionUtil.isEmpty(listTobeDeleted)) {
			binToBinFileItemsStageRepository.deleteAllByIdIn(listTobeDeleted);
		}
	}

	private Example<BinToBinFileItemsStageDao> generateCriteria(BinToBinFileStageDao binToBinFileStage) {

		BinToBinFileItemsStageDao binToBinFileItemsStageDao = new BinToBinFileItemsStageDao();
		binToBinFileItemsStageDao.setBinToBinFileStage(binToBinFileStage);
		binToBinFileItemsStageDao.setItemStatus(BinStageItemStatusEnum.VALID_ITEM.toString());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(binToBinFileItemsStageDao, matcher);
	}

	@Override
	public StockTransactionDocNoDto updateAllUploadedInventoryItemsByBinCode(Integer id, String destinationBincode,
			String destinationBinGroup) {

		BinToBinFileStageDao binToBinFileStage = binToBinFileStageRepository.findById(id).orElseThrow(
				() -> new ServiceException("No details found for uploaded file requested id", ERR_INV_060, "id" + id));
		List<BinToBinFileItemsStageDao> binToBinFileItems = binToBinFileItemsStageRepository
				.findAllByBinToBinFileStage(binToBinFileStage);

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> resMap = stockManagementFacadeImp
				.binToBinBulkInventoryUpdate(binToBinFileStage, destinationBincode, destinationBinGroup,
						binToBinFileItems);

		Map.Entry<StockTransactionDocNoDto, List<SyncStagingDto>> resMapEntry = resMap.entrySet().iterator().next();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType) && !resMap.isEmpty()) {
			for (SyncStagingDto syncStagingDto : resMapEntry.getValue()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}
		return resMapEntry.getKey();
	}

	@Transactional
	public Map<StockTransactionDocNoDto, List<SyncStagingDto>> binToBinBulkInventoryUpdate(
			BinToBinFileStageDao binToBinFileStage, String destinationBincode, String destinationBinGroup,
			List<BinToBinFileItemsStageDao> binToBinFileItems) {
		List<StockTransactionDetailsDao> stockTransactionDetailsList = new ArrayList<>();
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		short totalQuantity = 0;
		StockTransactionDocNoDto stockTransactionDocNoDto = new StockTransactionDocNoDto();
		StockTransactionDao stockTransaction = null;
		// CALL EPOSS
		if (appType.equals(AppTypeEnum.POSS.toString())) {
			stockTransaction = epossCallService.callEposs(HttpMethod.GET, SalesUtil.INVENTORY_GET_DOCNUMBER_URL, null,
					null, StockTransactionDao.class);
		} else {
			stockTransaction = stockTransactionService.addBinStockTransaction(
					StockTransactionStatus.COMPLETED.toString(), StockTransactionType.BIN_TO_BIN.toString());
		}

		List<String> invIds = binToBinFileItems.stream().map(binStage -> binStage.getInventoryId())
				.collect(Collectors.toList());
		List<InventoryDetailsDao> inventoryDetailsList = inventoryDetailsRepository.findAllById(invIds);
		List<InventoryDetailsDao> invs = new ArrayList<>();
		String correlationId = UUID.randomUUID().toString();

		for (InventoryDetailsDao i : inventoryDetailsList) {
			InventoryDetailsDao in = (InventoryDetailsDao) MapperUtil.getDtoMapping(i, InventoryDetailsDao.class);
			in.setCorrelationId(correlationId);
			invs.add(in);
		}

		log.info(" before transfer total invsdetails size {}", invs.size());

		for (InventoryDetailsDao inventoryDetails : invs) {
			if (!inventoryService.isValidForUpdate(destinationBinGroup, inventoryDetails)) {
				throw new com.titan.poss.core.exception.ServiceException(INVALID_RECEIVING_BIN_CODE, ERR_INV_010);
			}

			if (binService.getBinGroupList(BinRequestType.ISSUE_BIN.toString(), userType)
					.contains(inventoryDetails.getBinGroupCode())) {

				setStockTransactionDetails(destinationBincode, stockTransactionDetailsList, stockTransaction,
						inventoryDetails, null, null);
				totalQuantity = (short) (totalQuantity + inventoryDetails.getTotalQuantity());
				totalValue = totalValue.add(inventoryDetails.getTotalValue());
				totalWeight = totalWeight.add(inventoryDetails.getTotalWeight());
				String binCode = inventoryDetails.getBinCode();
				String binGroup = inventoryDetails.getBinGroupCode();
				InventoryDetailsDao invExists = inventoryDetailsRepository
						.findByLocationCodeAndItemCodeAndLotNumberAndBinCodeAndBinGroupCode(authUser.getLocationCode(),
								inventoryDetails.getItemCode(), inventoryDetails.getLotNumber(), destinationBincode,
								destinationBinGroup);
				if (invExists != null) {
					invExists.setTotalQuantity(
							(short) (invExists.getTotalQuantity() + inventoryDetails.getTotalQuantity()));
					invExists.setTotalWeight(
							invExists.getStdWeight().multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
					invExists.setTotalValue(
							invExists.getStdValue().multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
					inventoryDetails.setTotalQuantity((short) 0);
					inventoryDetails.setTotalValue(BigDecimal.ZERO);
					inventoryDetails.setTotalWeight(BigDecimal.ZERO);
					invExists.setDocType(DocTypeEnum.BINTOBIN.toString());
					invExists.setBinModifiedDate(new Date());
					invExists.setSrcSyncId(inventoryDetails.getSrcSyncId() + 1);
					invExists.setDocNumber(stockTransaction.getIssuedDocNo());
					invExists.setCorrelationId(correlationId);
					invs.add(invExists);
				} else {
					inventoryDetails.setBinCode(destinationBincode);
					inventoryDetails.setBinGroupCode(destinationBinGroup);
					inventoryDetails.setPreviousBinCode(binCode);
					inventoryDetails.setPreviousBinGroupCode(binGroup);
					inventoryDetails.setDocType(DocTypeEnum.BINTOBIN.toString());
					inventoryDetails.setBinModifiedDate(new Date());
					inventoryDetails.setDocNumber(stockTransaction.getIssuedDocNo());
					inventoryDetails.setSrcSyncId(inventoryDetails.getSrcSyncId() + 1);

				}

			}
		}
		log.info(" after transfer total invs size {}", invs.size());
		log.info("after transfer total stockTransactionDetailsList  {}", stockTransactionDetailsList.size());
		stockTransactionDocNoDto.setDocNo(stockTransaction.getIssuedDocNo());

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> responseMap = new HashMap<>();

		// Deleting data from staging table
		binToBinFileItemsStageRepository.deleteAll(binToBinFileItems);
		binToBinFileStageRepository.deleteById(binToBinFileStage.getId());
		;

		List<SyncStagingDto> stagingDtos = inventoryService.updateInventoryAndSaveToStaging(invs,
				stockTransaction.getId());
		if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appType)) {
			stockTransactionService.addStockTransactionDetails(stockTransactionDetailsList);
			setStockTransaction(totalValue, totalQuantity, totalWeight, stockTransaction);
			stockTransactionService.updateStockTransaction(stockTransaction);
		}

		responseMap.put(stockTransactionDocNoDto, stagingDtos);
		return responseMap;
	}

	@Override
	public PagedRestResponse<List<BinToBinFileStageDto>> listBinToBinStageData(Pageable pageable) {

		Page<BinToBinFileStageDao> binToBinListPageList = binToBinFileStageRepository
				.findAll(generateCriteriaForBinStage(CommonUtil.getLocationCode()), pageable);

		List<BinToBinFileStageDto> binToBinFileStageList = new ArrayList<>();

		for (BinToBinFileStageDao binDetail : binToBinListPageList) {
			BinToBinFileStageDto binToBinFileStage = (BinToBinFileStageDto) MapperUtil.getDtoMapping(binDetail,
					BinToBinFileStageDto.class);
			binToBinFileStageList.add(binToBinFileStage);
		}
		return new PagedRestResponse<>(binToBinFileStageList, binToBinListPageList);
	}

	private Example<BinToBinFileStageDao> generateCriteriaForBinStage(String locationCode) {
		BinToBinFileStageDao binToBinFileStage = new BinToBinFileStageDao();
		binToBinFileStage.setLocationCode(locationCode);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(binToBinFileStage, matcher);
	}

	@Override
	public StockTransactionDocNoDto updateInventoryStageItems(Integer id,
			InventoryStageBinUpdateDto stageBinTransferItems) {

		Map<StockTransactionDocNoDto, List<SyncStagingDto>> resMap = stockManagementFacadeImp
				.stageBinToBinUpdateInventoryItems(id, stageBinTransferItems);
		Map.Entry<StockTransactionDocNoDto, List<SyncStagingDto>> resMapEntry = resMap.entrySet().iterator().next();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appType) && !resMap.isEmpty()) {
			for (SyncStagingDto syncStagingDto : resMapEntry.getValue()) {
				salesSyncDataService.publishSalesMessagesToQueue(syncStagingDto);
			}
		}
		return resMapEntry.getKey();
	}

	/**
	 * @param stageBinTransferItems
	 * @return
	 */
	@Transactional
	public Map<StockTransactionDocNoDto, List<SyncStagingDto>> stageBinToBinUpdateInventoryItems(Integer id,
			InventoryStageBinUpdateDto stageBinTransferItems) {
		CountryDetailsDto countryDetailsDto = engineServiceClient.getCountryDetails(CommonUtil.getLocationCode());
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		short totalQuantity = 0;
		List<StockTransactionDetailsDao> stockTransactionDetailsList = new ArrayList<>();
		List<InventoryDetailsDao> detailsList = new ArrayList<>();
		StockTransactionDocNoDto stockTransactionDocNoDto = new StockTransactionDocNoDto();
		// adding inventory ID's to a list for fetching the item data
		for (StageBinItemDto stageBinItems : stageBinTransferItems.getStageBinItems()) {
			Optional<InventoryDetailsDao> itemInventoryDetails = inventoryDetailsRepository
					.findById(stageBinItems.getInventoryId());
			if (itemInventoryDetails.isPresent()) {
				InventoryDetailsDao itemInv = (InventoryDetailsDao) MapperUtil.getDtoMapping(itemInventoryDetails.get(),
						InventoryDetailsDao.class);
				detailsList.add(itemInv);
			}

		}

		StockTransactionDao stockTransaction = new StockTransactionDao();

//		 CALL EPOSS to create stock transaction
		if (appType.equals(AppTypeEnum.POSS.toString())) {
			log.info("In 681");
			stockTransaction = epossCallService.callEposs(HttpMethod.GET, SalesUtil.INVENTORY_GET_DOCNUMBER_URL, null,
					null, StockTransactionDao.class);
		} else {
			log.info("in Else 685");
			stockTransaction = stockTransactionService.addBinStockTransaction(
					StockTransactionStatus.COMPLETED.toString(), StockTransactionType.BIN_TO_BIN.toString());
		}

		// iterating the inventory item list and setting stock transaction details
		List<InventoryDetailsDao> detailsSyncList = new ArrayList<>();
		int detailsListSize = detailsList.size();
		for (int count = 0; count < detailsListSize; count++) {
			if (!inventoryService.isValidForUpdate(
					stageBinTransferItems.getStageBinItems().get(count).getBinGroupCode(), detailsList.get(count))) {
				throw new com.titan.poss.core.exception.ServiceException(INVALID_RECEIVING_BIN_CODE, ERR_INV_010);
			}

			String binCode = detailsList.get(count).getBinCode();
			String binGroup = detailsList.get(count).getBinGroupCode();
			// Check if Item is Coin
			if (!detailsList.get(count).getProductGroup().equals(ProductGroupCodeEnum.GOLD_COIN.getCode())) {
				log.info("not in 73");
				setStockTransactionDetails(stageBinTransferItems.getStageBinItems().get(count).getBinCode(),
						stockTransactionDetailsList, stockTransaction, detailsList.get(count),
						stageBinTransferItems.getStageBinItems().get(count).getDefectCodeDesc(),
						stageBinTransferItems.getStageBinItems().get(count).getDefectTypeDesc());
				totalQuantity = (short) (totalQuantity + detailsList.get(count).getTotalQuantity());
				totalValue = totalValue.add(detailsList.get(count).getTotalValue());
				totalWeight = totalWeight.add(detailsList.get(count).getTotalWeight());
				detailsList.get(count).setBinCode(stageBinTransferItems.getStageBinItems().get(count).getBinCode());
				detailsList.get(count)
						.setBinGroupCode(stageBinTransferItems.getStageBinItems().get(count).getBinGroupCode());
				detailsList.get(count).setPreviousBinCode(binCode);
				detailsList.get(count).setPreviousBinGroupCode(binGroup);
				detailsList.get(count).setBinModifiedDate(new Date());
				detailsList.get(count).setDocType(DocTypeEnum.BINTOBIN.toString());
				detailsList.get(count).setDocNumber(stockTransaction.getIssuedDocNo());
				detailsList.get(count).setActionType(InventoryDetailsActionEnum.ADD.name());
				detailsSyncList.add(detailsList.get(count));
			} else {
				InventoryDetailsDao invExists = inventoryDetailsRepository
						.findByLocationCodeAndItemCodeAndLotNumberAndBinCodeAndBinGroupCode(authUser.getLocationCode(),
								detailsList.get(count).getItemCode(), detailsList.get(count).getLotNumber(),
								stageBinTransferItems.getStageBinItems().get(count).getBinCode(),
								stageBinTransferItems.getStageBinItems().get(count).getBinGroupCode());
				setStockTransactionDetailsCoinForBin(stageBinTransferItems.getStageBinItems().get(count).getBinCode(),
						stockTransactionDetailsList, stockTransaction, detailsList.get(count),
						stageBinTransferItems.getStageBinItems().get(count));

				totalQuantity = (short) (totalQuantity
						+ stageBinTransferItems.getStageBinItems().get(count).getQuantity());
				totalValue = totalValue.add(detailsList.get(count).getTotalValue().multiply(
						new BigDecimal((short) stageBinTransferItems.getStageBinItems().get(count).getQuantity())));
				totalWeight = totalWeight.add(detailsList.get(count).getTotalWeight().multiply(
						new BigDecimal((short) stageBinTransferItems.getStageBinItems().get(count).getQuantity())));
				// We are setting actionType as ADD/Null
				// for every operation
				// , based on actionType while datasync we will show in items in history.
				// If transfering full qty for Coins
				if (detailsList.get(count).getTotalQuantity()
						.equals(stageBinTransferItems.getStageBinItems().get(count).getQuantity())) {
					// checking if similar item available with binGroup or not
					if (invExists != null) {
						invExists.setTotalQuantity(
								(short) (invExists.getTotalQuantity() + detailsList.get(count).getTotalQuantity()));
						invExists.setTotalWeight(invExists.getStdWeight()
								.multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
						invExists.setTotalValue(invExists.getStdValue()
								.multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
						detailsList.get(count).setTotalQuantity((short) 0);
						detailsList.get(count).setTotalValue(BigDecimal.ZERO);
						detailsList.get(count).setTotalWeight(BigDecimal.ZERO);
						invExists.setActionType(InventoryDetailsActionEnum.ADD.name());
						detailsList.get(count).setActionType(null);
						// invExists.setIssuedQuantity(detailsList.get(count).getTotalQuantity());
						detailsSyncList.add(detailsList.get(count));
						detailsSyncList.add(invExists);

					} else {
						detailsList.get(count)
								.setBinCode(stageBinTransferItems.getStageBinItems().get(count).getBinCode());
						detailsList.get(count)
								.setBinGroupCode(stageBinTransferItems.getStageBinItems().get(count).getBinGroupCode());
						detailsList.get(count).setPreviousBinCode(binCode);
						detailsList.get(count).setPreviousBinGroupCode(binGroup);
						detailsList.get(count).setBinModifiedDate(new Date());
						// detailsList.get(count)
						// .setIssuedQuantity(binTransferItems.getBinItems().get(count).getQuantity());
						detailsList.get(count).setDocType(DocTypeEnum.BINTOBIN.toString());
						detailsList.get(count).setDocNumber(stockTransaction.getIssuedDocNo());
						detailsList.get(count).setDefectCodeDesc(
								stageBinTransferItems.getStageBinItems().get(count).getDefectCodeDesc());
						detailsList.get(count).setDefectTypeDesc(
								stageBinTransferItems.getStageBinItems().get(count).getDefectTypeDesc());
						detailsList.get(count).setActionType(InventoryDetailsActionEnum.ADD.name());
						detailsSyncList.add(detailsList.get(count));
					}
				} else if (!detailsList.get(count).getTotalQuantity()
						.equals(stageBinTransferItems.getStageBinItems().get(count).getQuantity())) {
					// If transferred qty is less than totalQty

					// validation check for QTY only.
					if (stageBinTransferItems.getStageBinItems().get(count).getQuantity() == null
							|| stageBinTransferItems.getStageBinItems().get(count).getQuantity() == 0
							|| detailsList.get(count).getTotalQuantity() < stageBinTransferItems.getStageBinItems()
									.get(count).getQuantity()) {

						throw new ServiceException(INVALID_QUANTITY, ERR_INV_017);
					}

					// subtracting from the original item and increasing qty for the similar item
					// exists
					detailsList.get(count).setTotalQuantity((short) (detailsList.get(count).getTotalQuantity()
							- stageBinTransferItems.getStageBinItems().get(count).getQuantity()));

					detailsList.get(count).setTotalWeight(detailsList.get(count).getStdWeight()
							.multiply(new BigDecimal((short) (detailsList.get(count).getTotalQuantity()))));

					detailsList.get(count).setTotalValue(detailsList.get(count).getStdValue()
							.multiply(new BigDecimal((short) (detailsList.get(count).getTotalQuantity()))));

					detailsList.get(count).setBinModifiedDate(new Date());
					detailsList.get(count).setDocType(DocTypeEnum.BINTOBIN.toString());
					detailsList.get(count).setDocNumber(stockTransaction.getIssuedDocNo());
					detailsList.get(count).setActionType(null);
					detailsSyncList.add(detailsList.get(count));
					// subtracting from the original item and increasing qty for the similar item
					// exists

					if (invExists != null) {
						invExists.setTotalQuantity((short) (invExists.getTotalQuantity()
								+ stageBinTransferItems.getStageBinItems().get(count).getQuantity()));
						invExists.setTotalWeight(invExists.getStdWeight()
								.multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
						invExists.setTotalValue(invExists.getStdValue()
								.multiply(new BigDecimal((short) (invExists.getTotalQuantity()))));
						invExists.setActionType(InventoryDetailsActionEnum.ADD.name());
						// invExists.setIssuedQuantity(binTransferItems.getBinItems().get(count).getQuantity());
						invExists.setDocType(DocTypeEnum.BINTOBIN.toString());
						invExists.setBinModifiedDate(new Date());
						invExists.setPreviousBinCode(detailsList.get(count).getBinCode());
						invExists.setPreviousBinGroupCode(detailsList.get(count).getPreviousBinGroupCode());
						detailsSyncList.add(invExists);

						// detailsList.add(invExists);
					} else {
						InventoryDetailsDao invDetailsPartialQty = new InventoryDetailsDao();
						invDetailsPartialQty.setId(UUID.randomUUID().toString());
						invDetailsPartialQty.setStdValue(detailsList.get(count).getStdValue());
						invDetailsPartialQty.setStdWeight(detailsList.get(count).getStdWeight());
						invDetailsPartialQty.setItemDetails(detailsList.get(count).getItemDetails());
						invDetailsPartialQty.setTotalWeightDetails(detailsList.get(count).getTotalWeightDetails());
						invDetailsPartialQty
								.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
						invDetailsPartialQty.setSerialNumber(detailsList.get(count).getStdWeight().toString());
						invDetailsPartialQty.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
						invDetailsPartialQty.setCreatedDate(new Date());
						invDetailsPartialQty
								.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
						invDetailsPartialQty.setLastModifiedDate(new Date());
						invDetailsPartialQty.setItemCode(detailsList.get(count).getItemCode());
						invDetailsPartialQty.setLotNumber(detailsList.get(count).getLotNumber());
						invDetailsPartialQty.setDefectCodeDesc(
								stageBinTransferItems.getStageBinItems().get(count).getDefectCodeDesc());
						invDetailsPartialQty.setDefectTypeDesc(
								stageBinTransferItems.getStageBinItems().get(count).getDefectTypeDesc());
						invDetailsPartialQty
								.setBinCode(stageBinTransferItems.getStageBinItems().get(count).getBinCode());
						invDetailsPartialQty.setPreviousBinCode(binCode);
						invDetailsPartialQty.setPreviousBinGroupCode(binGroup);
						invDetailsPartialQty
								.setBinGroupCode(stageBinTransferItems.getStageBinItems().get(count).getBinGroupCode());
						invDetailsPartialQty
								.setTotalQuantity(stageBinTransferItems.getStageBinItems().get(count).getQuantity());
						invDetailsPartialQty.setTotalValue(detailsList.get(count).getStdValue().multiply(
								new BigDecimal(stageBinTransferItems.getStageBinItems().get(count).getQuantity())));
						invDetailsPartialQty.setTotalWeight(detailsList.get(count).getStdWeight().multiply(
								new BigDecimal(stageBinTransferItems.getStageBinItems().get(count).getQuantity())));
						invDetailsPartialQty.setOrgCode(detailsList.get(count).getOrgCode());
						invDetailsPartialQty.setBinModifiedDate(new Date());
						invDetailsPartialQty.setStockInwardDate(new Date());
						invDetailsPartialQty.setCurrencyCode(countryDetailsDto.getCurrencyCode());
						invDetailsPartialQty.setMfgDate(new Date());
						invDetailsPartialQty.setWeightUnit(countryDetailsDto.getWeightUnit());
						invDetailsPartialQty.setDocNumber(stockTransaction.getIssuedDocNo());
						invDetailsPartialQty.setDocType(DocTypeEnum.BINTOBIN.toString());
						invDetailsPartialQty.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
						invDetailsPartialQty.setActionType(InventoryDetailsActionEnum.ADD.name());
						invDetailsPartialQty.setCorrelationId(detailsList.get(count).getCorrelationId());
						// invDetailsPartialQty.setIssuedQuantity(binTransferItems.getBinItems().get(count).getQuantity());
						invDetailsPartialQty.setProductGroup(detailsList.get(count).getProductGroup());
						invDetailsPartialQty.setProductCategory(detailsList.get(count).getProductCategory());
						// retrieve isHallmarked from itemDetails JSON and set to isHallmarked.
						invDetailsPartialQty.setIsHallmarked(getHallmarkedFromItemDetails(detailsList.get(count)));
						// detailsList.add(invDetailsPartialQty);
						detailsSyncList.add(invDetailsPartialQty);
					}
				} else {
					detailsList.get(count).setBinCode(stageBinTransferItems.getStageBinItems().get(count).getBinCode());
					detailsList.get(count)
							.setBinGroupCode(stageBinTransferItems.getStageBinItems().get(count).getBinGroupCode());
					detailsList.get(count).setPreviousBinCode(binCode);
					detailsList.get(count).setPreviousBinGroupCode(binGroup);
					detailsList.get(count).setBinModifiedDate(new Date());
					detailsList.get(count).setDocType(DocTypeEnum.BINTOBIN.toString());
					detailsList.get(count).setDocNumber(stockTransaction.getIssuedDocNo());
					detailsList.get(count)
							.setDefectCodeDesc(stageBinTransferItems.getStageBinItems().get(count).getDefectCodeDesc());
					detailsList.get(count)
							.setDefectTypeDesc(stageBinTransferItems.getStageBinItems().get(count).getDefectTypeDesc());

				}
			}
		}

		stockTransactionDocNoDto.setDocNo(stockTransaction.getIssuedDocNo());
		List<String> invIdList = stageBinTransferItems.getStageBinItems().stream().map(inv -> inv.getInventoryId())
				.collect(Collectors.toList());
		binToBinFileItemsStageRepository.deleteByInventoryId(id, invIdList);
		Optional<BinToBinFileStageDao> binToBinStage = binToBinFileStageRepository.findById(id);
		if (binToBinStage.isPresent()) {
			List<BinToBinFileItemsStageDao> binToBinStageitemsList = binToBinFileItemsStageRepository
					.findAllByBinToBinFileStage(binToBinStage.get());
			if (CollectionUtil.isEmpty(binToBinStageitemsList)) {
				binToBinFileStageRepository.deleteById(id);
			}
		}
		Map<StockTransactionDocNoDto, List<SyncStagingDto>> responseMap = new HashMap<>();
		List<SyncStagingDto> stagingDtos = inventoryService.updateInventoryAndSaveToStaging(detailsSyncList,
				stockTransaction.getId());
		log.info("in eposs app type : list data size" + stockTransactionDetailsList.size());
		stockTransactionDetailsList.stream().forEach(s -> log.info(s.toString()));
		if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appType)) {
			log.info("in eposs app type : list size" + stockTransactionDetailsList.size());
			stockTransactionService.addStockTransactionDetails(stockTransactionDetailsList);
			setStockTransaction(totalValue, totalQuantity, totalWeight, stockTransaction);
			stockTransactionService.updateStockTransaction(stockTransaction);
		}
		responseMap.put(stockTransactionDocNoDto, stagingDtos);
		return responseMap;

	}

	private void setStockTransactionDetailsCoinForBin(String destinationBincode,
			List<StockTransactionDetailsDao> stockTransactionDetailsList, StockTransactionDao stockTransactionDao,
			InventoryDetailsDao inventoryDetails, StageBinItemDto stageBinItemDto) {
		log.info("set once");
		StockTransactionDetailsDao stockTransactionDetails;
		stockTransactionDetails = (StockTransactionDetailsDao) MapperUtil.getDtoMapping(inventoryDetails,
				StockTransactionDetailsDao.class);
		stockTransactionDetails.setIssuedBinCode(inventoryDetails.getPreviousBinCode());
		stockTransactionDetails.setReceivedBinCode(destinationBincode);
		stockTransactionDetails.setStatus(StockTransactionStatus.COMPLETED.toString());
		stockTransactionDetails.setStockTransaction(stockTransactionDao);
		stockTransactionDetails.setInventoryId(inventoryDetails.getId());
		stockTransactionDetails.setIssuedQuantity(stageBinItemDto.getQuantity());
		stockTransactionDetails.setIssuedWeight(
				inventoryDetails.getTotalWeight().multiply(new BigDecimal((short) stageBinItemDto.getQuantity())));
		stockTransactionDetails.setIssuedValue(
				inventoryDetails.getTotalValue().multiply(new BigDecimal((short) stageBinItemDto.getQuantity())));
		stockTransactionDetails.setReceivedQuantity(stageBinItemDto.getQuantity());
		stockTransactionDetails.setReceivedWeight(
				inventoryDetails.getTotalWeight().multiply(new BigDecimal((short) stageBinItemDto.getQuantity())));
		stockTransactionDetails.setReceivedValue(
				inventoryDetails.getTotalValue().multiply(new BigDecimal((short) stageBinItemDto.getQuantity())));
		log.info("stockTransacionDetails " + stockTransactionDetails.toString());
		stockTransactionDetailsList.add(stockTransactionDetails);
	}

	private Boolean getHallmarkedFromItemDetails(InventoryDetailsDao invDetails) {
		AtomicReference<Boolean> isHallmarkingReference = new AtomicReference<>();
		isHallmarkingReference.set(Boolean.FALSE);
		try {
			JsonNode itemDetailsEligibleNode = MapperUtil.getObjectMapperInstance()
					.readTree(invDetails.getItemDetails());
			JsonNode itemDetailsDataEligible = itemDetailsEligibleNode.get("data");
			if (itemDetailsDataEligible.has("isHallmarkEligible")) {
				Boolean check = itemDetailsDataEligible.get("isHallmarkEligible").asBoolean();
				if (!check) {
					LOGGER.info("Attr isHallmarkEligible is false");
					isHallmarkingReference.set(Boolean.TRUE);
					return isHallmarkingReference.get();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		Optional.ofNullable(invDetails.getItemDetails()).ifPresent(itemDetails -> {
			JsonNode itemDetailsNode;
			try {
				itemDetailsNode = MapperUtil.getObjectMapperInstance().readTree(invDetails.getItemDetails());
				Optional.ofNullable(itemDetailsNode).ifPresent(itemDetailsJson -> {
					JsonNode itemDetailsData = itemDetailsJson.get("data");
					Optional.ofNullable(itemDetailsData).ifPresent(itemDetailsDataJson -> {
						JsonNode isHallmarkingNode = itemDetailsDataJson.get("isHallMarking");
						Optional.ofNullable(isHallmarkingNode)
								.ifPresent(isHallmarking -> isHallmarkingReference.set(isHallmarking.asBoolean()));
					});
				});
			} catch (IOException e) {
				LOGGER.error("Unable to parse json data", e.getMessage());
			}
		});

		return isHallmarkingReference.get();
	}
	
	@Override
	public ResponseEntity<Resource> getInventoryItemLotDetails(String itemCode, String lotNumber,
			Boolean isHallmarking) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();

		List<String> binGroupCodeList = new ArrayList<>(Arrays.asList(BinGroupEnum.STN.toString(),
				(BinGroupEnum.HALLMARKDISPUTEBIN.toString()), (BinGroupEnum.CUSTOMERORDERBIN.toString())));
		
		List<InventoryDetailsDao> inventoryItemList = inventoryDetailsRepository
				.findAllByLocationCodeAndItemCodeAndLotNumberAndBinGroupCodeIn(authUser.getLocationCode(), itemCode,
						lotNumber, binGroupCodeList);
		InventoryDetailsDao inventoryDetail = new InventoryDetailsDao();

		if (authUser.getLocationCode() != null) {
			boolean isOffLine = false;
			if ((authUser.getIsOffline() != null)) {
				isOffLine = authUser.getIsOffline();
				if (appType.equals(AppTypeEnum.POSS.toString()) && isOffLine) {
					ApiResponseDto apiResponseDto = integrationService.callEpossAPI(HttpMethod.PATCH,
							SalesUtil.INVENTORY_UPDATE_HALLMARK_FLAG + "/" + itemCode + "/" + lotNumber + "/"
									+ isHallmarking, null, null);
					LOGGER.info("Response : " + apiResponseDto);
					LOGGER.info("Response code : " + apiResponseDto.getHttpResponseCode());
					LOGGER.info("Response value: " + apiResponseDto.getResponse());

					// if 200, then save to POSS
					if (apiResponseDto.getHttpResponseCode() == HttpStatus.OK.value()) {
						List<InventoryDetailsDao> invs = new ArrayList<>();
						invs = updateHallmarkFlag(inventoryDetail, inventoryItemList, isHallmarking);
						inventoryDetailsRepository.saveAll(invs);
					} else {
						throw new ServiceException(
								JsonUtils.getValueFromJsonString(apiResponseDto.getResponse(), CommonConstants.MESSAGE),
								JsonUtils.getValueFromJsonString(apiResponseDto.getResponse(), CommonConstants.CODE),
								apiResponseDto.getResponse());
					}
				}
			}
		} else {
			List<InventoryDetailsDao> invs = new ArrayList<>();
			invs = updateHallmarkFlag(inventoryDetail, inventoryItemList, isHallmarking);
			inventoryDetailsRepository.saveAll(invs);
		}
		return new ResponseEntity<>(new HttpHeaders(), HttpStatus.OK);
	}

	public static List<InventoryDetailsDao> updateHallmarkFlag(InventoryDetailsDao inventoryDetail,
			List<InventoryDetailsDao> inventoryItemList, Boolean isHallmarking) {
		List<InventoryDetailsDao> invs = new ArrayList<>();
		if (!CollectionUtils.isEmpty(inventoryItemList)) {
			for (InventoryDetailsDao i : inventoryItemList) {
				inventoryDetail = (InventoryDetailsDao) MapperUtil.getDtoMapping(i, InventoryDetailsDao.class);

				if (null != inventoryDetail.getBinGroupCode()
						&& (CommonConstants.HALLMARK_DISPUTE_BIN.equalsIgnoreCase(inventoryDetail.getBinGroupCode())
								|| CommonConstants.STN.equalsIgnoreCase(inventoryDetail.getBinGroupCode()))) {
					inventoryDetail.setBinCode("ZEROBIN");
					inventoryDetail.setBinGroupCode("STN");

					inventoryDetail.setIsHallmarked(isHallmarking);

					inventoryDetail = updateItemDetailsHallmarkFlag(inventoryDetail.getItemDetails(), inventoryDetail,
							isHallmarking);
				} else if (null != inventoryDetail.getBinGroupCode()
						&& CommonConstants.CUSTOM_ORDER_BIN.equalsIgnoreCase(inventoryDetail.getBinGroupCode())) {
					inventoryDetail.setIsHallmarked(isHallmarking);

					inventoryDetail = updateItemDetailsHallmarkFlag(inventoryDetail.getItemDetails(), inventoryDetail,
							isHallmarking);
				}
				invs.add(inventoryDetail);
			}
		} else {
			throw new ServiceException("Items with bin code : HALLMARKDISPUTEBIN/STN can only be Hallmarked",
					ERR_INV_067);
		}
		return invs;
	}

	public static InventoryDetailsDao updateItemDetailsHallmarkFlag(String itemDetails, InventoryDetailsDao invDetails,
			Boolean hallmarkingFlag) {

		JsonNode root;
		JsonNode dataNode = null;
		InventoryItemDetailsDto itemDetailsImp = null;
		try {
			if (itemDetails != null) {
				root = MapperUtil.getObjectMapperInstance().readTree(itemDetails);
				dataNode = root.path("data");
				itemDetailsImp = MapperUtil.getObjectMapperInstance().convertValue(dataNode,
						InventoryItemDetailsDto.class);
				if (itemDetailsImp != null) {
					itemDetailsImp.setIsHallMarking(hallmarkingFlag);
					JsonData itemDetailsImprt = new JsonData("ITEM_DETAILS", itemDetailsImp);
					invDetails.setItemDetails(MapperUtil.getStringFromJson(itemDetailsImprt));
				} else {
					Map<String, Boolean> item = new HashMap<>();
					item.put("isHallMarking", hallmarkingFlag);
					JsonData itemDetailsImprt = new JsonData("ITEM_DETAILS", item);
					invDetails.setItemDetails(MapperUtil.getStringFromJson(itemDetailsImprt));
				}
			} else {
				Map<String, Boolean> item = new HashMap<>();
				item.put("isHallMarking", hallmarkingFlag);
				JsonData itemDetailsImprt = new JsonData("ITEM_DETAILS", item);
				invDetails.setItemDetails(MapperUtil.getStringFromJson(itemDetailsImprt));
			}
		} catch (Exception e) {
			throw new ServiceException("Unable to parse json data", e.getMessage());
		}
		return invDetails;
	}
	
}
