/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.InvoiceResponseDto;
import com.titan.poss.core.dto.ItemsDto;
import com.titan.poss.core.dto.MaterialDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.StnResponseDto;
import com.titan.poss.core.dto.StoneDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TaxDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.file.dto.InvoiceIsacDetailsDto;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.file.service.StnAndInvoiceService;
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockInvoiceDetailsDao;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.repository.StockInvoiceDetailsRepository;
import com.titan.poss.inventory.repository.StockInvoiceRepository;
import com.titan.poss.inventory.repository.StockTransferDetailsRepository;
import com.titan.poss.inventory.repository.StockTransferRepository;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dto.constants.LocationTypeEnum;
import com.titan.poss.product.constant.PricingTypeEnum;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotDetailsIdDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsIdDao;
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.dao.SyncStaging;
import com.titan.poss.product.dto.LotMaterialDetailsSyncDto;
import com.titan.poss.product.dto.LotStoneDetailsSyncDto;
import com.titan.poss.product.repository.LotDetailsRepository;
import com.titan.poss.product.repository.LotMaterialDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class StnAndInvoiceServiceImpl implements StnAndInvoiceService {

	@Autowired
	private CommonValidationService commonValidationService;

	@Autowired
	private StockTransferRepository stockTransferRepository;

	@Autowired
	private FileService fileService;

	@Autowired
	private StockTransferDetailsRepository stockTransferDetailsRepository;

	@Autowired
	private StockInvoiceRepository stockInvoiceRepository;

	@Autowired
	private StockInvoiceDetailsRepository stockInvoiceDetailsRepository;

	@Autowired
	private LotMaterialDetailsRepository lotMaterialDetailsRepository;

	@Autowired
	private LotDetailsRepository lotDetailsRepository;

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@Autowired
	private StnAndInvoiceService stnAndInvoiceService;

	private static final String LOCATION_CODE = "Location code: ";

	private static final String INACTIVE_ERR_MSG = " is not active/present.";

	private static final String PRODUCTS_SYNC_STAGING_TABLE = "products.dbo.sync_staging";

	@Transactional(value = "chainedTransaction")
	@Override
	public void runStnJob(StnResponseDto stnResponse) {

		// validate fiscal year
		//FiscalYear validation removed
//		if (!commonValidationService.validateFiscalYear(null, stnResponse.getStn().getLocation(), null,
//				stnResponse.getStn().getFiscalYear(), null, null)) {
//			throw new ServiceException("Invalid fiscal year: " + stnResponse.getStn().getFiscalYear(), "");
//		}
		// validate location codes
		LocationDao factoryLocation = commonValidationService.validateLocationCode(
				stnResponse.getStn().getFactoryCode(), null, null, null, LocationTypeEnum.FAC.toString(), null);
		if (factoryLocation == null) {
			throw new ServiceException(LOCATION_CODE + stnResponse.getStn().getFactoryCode() + INACTIVE_ERR_MSG, "");
		}
		LocationDao btqLocation = commonValidationService.validateLocationCode(stnResponse.getStn().getLocation(), null,
				null, null, LocationTypeEnum.BTQ.toString(), null);
		if (btqLocation == null) {
			throw new ServiceException(LOCATION_CODE + stnResponse.getStn().getLocation() + INACTIVE_ERR_MSG, "");
		}
		// validate Source doc date
		if (!commonValidationService.validateSrcDocDate(null, null, null, null, null,
				stnResponse.getStn().getStmDate())) {
			throw new ServiceException("Invalid stmDate: " + stnResponse.getStn().getStmDate()
					+ ".Source Doc Date should not be greater than current date.", "");
		}

		stnResponse.getItems().stream().forEach(stn -> {
			List<ItemDao> itemDaos = commonValidationService.getActiveItemDaos(stn.getProductCode(), true);
			if (!commonValidationService.validateItemCode(itemDaos, null, null, stn.getProductCode(), null)) {
				throw new ServiceException("Invalid item code: " + stn.getProductCode(), "");
			}
			boolean isFocItem = itemDaos.get(0).getIsFocItem();
			if (isFocItem) {
				stn.setBinCode("FOC");
				stn.setBinGroupCode("FOC");
			} else if (stn.getCustPoNo().equalsIgnoreCase("P")) {
				stn.setBinCode(FileIntegrationConstants.CUSTOMER_ORDER_BIN);
				stn.setBinGroupCode(FileIntegrationConstants.CUSTOMER_ORDER_BIN);
			} else {
				stn.setBinCode("ZEROBIN");
				stn.setBinGroupCode("STN");
			}
			stn.setProductCategory(itemDaos.get(0).getProductCategory().getProductCategoryCode());
		});

		// validate stone code
		if (stnResponse.getStones() != null) {
			stnResponse.getStones().stream().forEach(stone -> validateStoneCode(stone.getStoneCode()));
		}

		// validate material code
		if (stnResponse.getMaterials() != null) {
			stnResponse.getMaterials().stream().forEach(material -> validateMaterialCode(material.getMaterialCode()));
		}

		// if all validations pass, then saving in stock transfer and details table
		saveStnData(stnResponse);

	}

	@Override
	public void runInvoiceJob(InvoiceResponseDto invoiceResponse) {
		// validate fiscal year
		// fiscal year validation removed
//		if (!commonValidationService.validateFiscalYear(null, invoiceResponse.getInvoice().getL3BtqCode(), null,
//				invoiceResponse.getInvoice().getFiscalYear() - 1, null, null)) {
//			throw new ServiceException("Invalid fiscal year: " + invoiceResponse.getInvoice().getFiscalYear(), "");
//		}
		// validate location codes
		LocationDao factoryLocation = commonValidationService.validateLocationCode(
				invoiceResponse.getInvoice().getToSubInv(), null, null, null, LocationTypeEnum.CFA.toString(), null);
		if (factoryLocation == null) {
			throw new ServiceException(LOCATION_CODE + invoiceResponse.getInvoice().getToSubInv() + INACTIVE_ERR_MSG,
					"");
		}
		LocationDao btqLocation = commonValidationService.validateLocationCode(
				invoiceResponse.getInvoice().getL3BtqCode(), null, null, null, LocationTypeEnum.BTQ.toString(), null);
		if (btqLocation == null) {
			throw new ServiceException(LOCATION_CODE + invoiceResponse.getInvoice().getL3BtqCode() + INACTIVE_ERR_MSG,
					"");
		}
		// validate Source doc date
		if (!commonValidationService.validateSrcDocDate(null, null, null, null, null,
				invoiceResponse.getInvoice().getInvoiceDate())) {
			throw new ServiceException("Invalid invoice date: " + invoiceResponse.getInvoice().getInvoiceDate()
					+ ".Source Doc Date should not be greater than current date.", "");
		}

		invoiceResponse.getItems().stream().forEach(inv -> {
			List<ItemDao> itemDaos = commonValidationService.getActiveItemDaos(inv.getProductCode(), true);
			if (!commonValidationService.validateItemCode(itemDaos, null, null, inv.getProductCode(), null)) {
				throw new ServiceException("Invalid item code: " + inv.getProductCode(), "");
			}
			boolean isFocItem = itemDaos.get(0).getIsFocItem();

			if (isFocItem) {
				inv.setBinCode("FOC");
				inv.setBinGroupCode("FOC");
			} else if (inv.getCustPoNo().equalsIgnoreCase("P")) {
				inv.setBinCode(FileIntegrationConstants.CUSTOMER_ORDER_BIN);
				inv.setBinGroupCode(FileIntegrationConstants.CUSTOMER_ORDER_BIN);
			} else {
				inv.setBinCode("ZEROBIN");
				inv.setBinGroupCode("PURCFA");
			}
			inv.setProductCategory(itemDaos.get(0).getProductCategory().getProductCategoryCode());
		});

		// validate stone code
		if (invoiceResponse.getStones() != null) {
			invoiceResponse.getStones().stream().forEach(stone -> validateStoneCode(stone.getStoneCode()));
		}

		// validate material code
		if (invoiceResponse.getMdtl() != null) {
			invoiceResponse.getMdtl().stream().forEach(material -> validateMaterialCode(material.getMaterialCode()));
		}

		// if all validations pass, then saving in stock transfer and details table
		saveInvoiceData(invoiceResponse);

	}

	private void saveStnData(StnResponseDto stnResponse) {
		CountryDao countryData = fileService.getCountryData();
		String currencyCode = countryData.getCurrency().getCurrencyCode();
		String weightUnit = countryData.getWeightUnit();
		String stoneWeightUnit = countryData.getStoneWeightUnit();

		// save stock transfer
		StockTransferDao stockTransfer = saveStockTransfer(stnResponse, currencyCode, weightUnit);

		// save stocktransfer details
		saveStockTransferDetails(stnResponse, weightUnit, currencyCode, stockTransfer);

		// save lot stone details
		long syncTime = CalendarUtils.getCurrentDate().getTime();
		saveLotStoneDetails(stnResponse.getItems(), stnResponse.getStones(), syncTime, stoneWeightUnit,
				stnResponse.getStn().getCreatedBy(), stnResponse.getStn().getCreatedDate(),
				stnResponse.getStn().getLocation());

		// save lot material details
		saveLotMaterialDetails(stnResponse.getItems(), stnResponse.getMaterials(), syncTime, stoneWeightUnit,
				stnResponse.getStn().getCreatedBy(), stnResponse.getStn().getCreatedDate(),
				stnResponse.getStn().getLocation());
	}

	void saveInvoiceData(InvoiceResponseDto invoiceResponse) {
		CountryDao countryData = fileService.getCountryData();
		String currencyCode = countryData.getCurrency().getCurrencyCode();
		String weightUnit = countryData.getWeightUnit();
		String stoneWeightUnit = countryData.getStoneWeightUnit();

		// save stock invoice
		StockInvoiceDao stockInvoice = saveStockInvoiceDao(invoiceResponse, currencyCode, weightUnit);

		// save invoice details
		saveStockInvoiceDetails(invoiceResponse, stoneWeightUnit, currencyCode, stockInvoice);

		// save lot stone details
		long syncTime = CalendarUtils.getCurrentDate().getTime();
		saveLotStoneDetails(invoiceResponse.getItems(), invoiceResponse.getStones(), syncTime, stoneWeightUnit,
				FileIntegrationConstants.ERP_USER, CalendarUtils.getCurrentDate(), null);

		// save lot material details
		saveLotMaterialDetails(invoiceResponse.getItems(), invoiceResponse.getMdtl(), syncTime, stoneWeightUnit,
				FileIntegrationConstants.ERP_USER, CalendarUtils.getCurrentDate(), null);
	}

	/**
	 * @param stnResponse
	 */
	private void saveLotStoneDetails(List<ItemsDto> items, List<StoneDto> stones, long syncTime, String stoneWtUnit,
			String createdBy, Date createdDate, String locationCode) {
		List<LotDetailsDao> lotDetails = new ArrayList<>();
		if (stones != null && !stones.isEmpty()) {
			stones.stream().forEach(stone -> lotDetails
					.add(mapLotDetailsDao(stone, items, syncTime, stoneWtUnit, createdBy, createdDate)));
			List<LotDetailsDao> savedLotDetails = lotDetailsRepository.saveAll(lotDetails);
			SyncStagingDto data = getLotStoneStagingDto(savedLotDetails, locationCode);
			syncDataService.publishProductMessagesToQueue(data, PRODUCTS_SYNC_STAGING_TABLE);
		}
	}

	/**
	 * @param stnResponse
	 */
	private void saveLotMaterialDetails(List<ItemsDto> items, List<MaterialDto> materials, long syncTime,
			String stoneWtUnit, String createdBy, Date createdDate, String locationCode) {
		List<LotMaterialDetailsDao> lotMaterials = new ArrayList<>();
		if (materials != null && !materials.isEmpty()) {
			materials.stream().forEach(stone -> lotMaterials
					.add(mapLotMaterialsDao(stone, items, syncTime, stoneWtUnit, createdBy, createdDate)));
			List<LotMaterialDetailsDao> savedLotMaterials = lotMaterialDetailsRepository.saveAll(lotMaterials);
			SyncStagingDto data = getLotMaterialsStagingDto(savedLotMaterials, locationCode);
			syncDataService.publishProductMessagesToQueue(data, PRODUCTS_SYNC_STAGING_TABLE);
		}
	}

	private StockInvoiceDao saveStockInvoiceDao(InvoiceResponseDto invoiceResponse, String currencyCode,
			String weightUnit) {

		StockInvoiceDao stockInvoiceDao = new StockInvoiceDao();
		stockInvoiceDao.setCreatedBy(FileIntegrationConstants.ERP_USER);
		stockInvoiceDao.setCreatedDate(new Date());
		stockInvoiceDao.setInvoiceType(FileIntegrationConstants.TRANSFER_TYPE_CFA_BTQ);
		stockInvoiceDao.setLastModifiedBy(FileIntegrationConstants.ERP_USER);
		stockInvoiceDao.setLastModifiedDate(new Date());
		stockInvoiceDao.setOrgCode(CommonConstants.ORG_CODE);
		stockInvoiceDao.setSrcDocDate(invoiceResponse.getInvoice().getInvoiceDate());
		stockInvoiceDao.setSrcFiscalYear(invoiceResponse.getInvoice().getFiscalYear().shortValue());
		stockInvoiceDao.setSrcDocNo(Integer.parseInt(
				invoiceResponse.getInvoice().getInvoiceNumber().replace("\\", "").replace("/", "").substring(9)));
		stockInvoiceDao.setSrcLocationCode(invoiceResponse.getInvoice().getToSubInv());
		stockInvoiceDao.setStatus(FileIntegrationConstants.ISSUED);
		stockInvoiceDao.setTotalIssuedQuantity(invoiceResponse.getInvoice().getShipQty().shortValue());
		stockInvoiceDao.setTotalIssuedValue(invoiceResponse.getInvoice().getInvoiceValue());
		stockInvoiceDao.setTotalIssuedWeight(invoiceResponse.getInvoice().getShipWt());
		stockInvoiceDao.setOrderType(getOrderTypes(invoiceResponse.getItems()));
		stockInvoiceDao.setDestLocationCode(invoiceResponse.getInvoice().getL3BtqCode());
		stockInvoiceDao.setCurrencyCode(currencyCode);
		stockInvoiceDao.setWeightUnit(weightUnit);
		stockInvoiceDao.setFilePublished(false);
		return stockInvoiceRepository.save(stockInvoiceDao);

	}

	private String getOrderTypes(List<ItemsDto> items) {
		// setting order types
		Set<String> orderTypes = new HashSet<>();

		for (ItemsDto item : items) {
			if (item.getCustPoNo().equalsIgnoreCase("P")) {
				orderTypes.add("P");
			} else {
				orderTypes.add("R");
			}
		}
		return orderTypes.toString().replace("[", "").replace("]", "");
	}

	public StockTransferDao saveStockTransfer(StnResponseDto stnResponse, String currencyCode, String weightUnit) {
		StockTransferDao stockTransferDao = new StockTransferDao();
		stockTransferDao.setCarrierDetails(getCarrierDetails(stnResponse));
		stockTransferDao.setCreatedBy(stnResponse.getStn().getCreatedBy());
		stockTransferDao.setCreatedDate(stnResponse.getStn().getCreatedDate());
		stockTransferDao.setLastModifiedBy(stnResponse.getStn().getCreatedBy());
		stockTransferDao.setLastModifiedDate(stnResponse.getStn().getCreatedDate());
		stockTransferDao.setCurrencyCode(currencyCode);
		stockTransferDao.setDestLocationCode(stnResponse.getStn().getLocation());
		stockTransferDao.setOrgCode(CommonConstants.ORG_CODE);
		stockTransferDao.setSrcDocDate(stnResponse.getStn().getStmDate());
		stockTransferDao.setSrcDocNo(stnResponse.getStn().getStnNo());
		stockTransferDao.setSrcFiscalYear(stnResponse.getStn().getFiscalYear().shortValue());
		stockTransferDao.setSrcLocationCode(stnResponse.getStn().getFactoryCode());
		stockTransferDao.setStatus("ISSUED");
		stockTransferDao.setTransferType(FileIntegrationConstants.TRANSFER_TYPE_FAC_BTQ);
		stockTransferDao.setWeightUnit(weightUnit);

		stockTransferDao.setTotalIssuedQuantity(stnResponse.getStn().getShipQty().shortValue());
		stockTransferDao.setTotalIssuedValue(stnResponse.getStn().getStmValue());
		stockTransferDao.setTotalIssuedWeight(stnResponse.getStn().getShipQty2());
		stockTransferDao.setOrderType(getOrderTypes(stnResponse.getItems()));
		stockTransferDao.setIssuedBy(stnResponse.getStn().getCreatedBy());

		return stockTransferRepository.save(stockTransferDao);
	}

	private String getCarrierDetails(StnResponseDto stnResponse) {
		Map<String, String> carrierDetails = new HashMap<>();
		carrierDetails.put("docketNumber",
				stnResponse.getStn().getDocketNo() == null ? "" : stnResponse.getStn().getDocketNo().toString());
		carrierDetails.put("courierCompany", stnResponse.getStn().getCarrierName());
		carrierDetails.put("lockNumber", "");
		carrierDetails.put("roadPermitNumber", "");
		Map<String, Object> stockTransferCarrierDetails = new LinkedHashMap<>();
		stockTransferCarrierDetails.put("type", "courier");
		stockTransferCarrierDetails.put("data", carrierDetails);
		return MapperUtil.getStringFromJson(stockTransferCarrierDetails);
	}

	public void saveStockTransferDetails(StnResponseDto stnResponse, String weightUnit, String currencyCode,
			StockTransferDao stockTransfer) {
		List<StockTransferDetailsDao> stockTransferDetails = new ArrayList<>();
		stnResponse.getItems().stream().forEach(item -> stockTransferDetails
				.add(mapStocktransferDetails(stnResponse, item, weightUnit, currencyCode, stockTransfer)));
		stockTransferDetailsRepository.saveAll(stockTransferDetails);
	}

	private StockTransferDetailsDao mapStocktransferDetails(StnResponseDto stnResponse, ItemsDto item,
			String weightUnit, String currencyCode, StockTransferDao stockTransfer) {
		StockTransferDetailsDao stockTransferDetails = new StockTransferDetailsDao();
		stockTransferDetails.setStockTransfer(stockTransfer);
		stockTransferDetails.setItemCode(item.getProductCode());
		stockTransferDetails.setLotNumber(item.getLotNumber());
		stockTransferDetails.setMfgDate(stnResponse.getStn().getStmDate());
		stockTransferDetails.setIssuedQuantity(item.getProductQty().shortValue());
		stockTransferDetails.setIssuedValue(item.getTotalValue());
		stockTransferDetails.setIssuedWeight(item.getProductWt());
		calcuateRequiredWeights(item);
		String weightDetails = getWeightDetails(item);
		stockTransferDetails.setIssuedWeightDetails(weightDetails);
		stockTransferDetails.setStdValue(item.getProductValue());
		stockTransferDetails.setStdWeight(item.getProductWt().divide(new BigDecimal(item.getProductQty().toString())));
		stockTransferDetails.setBinCode(item.getBinCode());
		stockTransferDetails.setBinGroupCode(item.getBinGroupCode());
		stockTransferDetails.setProductGroup(item.getProductGroup());
		stockTransferDetails.setProductCategory(item.getProductCategory());
		stockTransferDetails.setReceivedQuantity(item.getProductQty().shortValue());
		stockTransferDetails.setReceivedWeight(item.getProductWt());
		stockTransferDetails.setReceivedWeightDetails(weightDetails);
		stockTransferDetails.setReceivedValue(item.getTotalValue());
		stockTransferDetails.setOrderType(item.getCustPoNo().equalsIgnoreCase("P") ? "P" : "R");
		stockTransferDetails.setReferenceNo(item.getOrderRef());
		stockTransferDetails.setInventoryId(UUID.randomUUID().toString());
		stockTransferDetails.setItemDetails(stnAndInvoiceService.setItemDetails(item.getActualF1().toString(),
				item.getIsHallMarking(), item.getHallMarkingCode(), item.getHallMarkingCentreName(),
				item.getHallMarkedDate(), item.getHallMarkRemarks(), item.getHallMarkRemarks1()));
		stockTransferDetails.setTaxDetails(getTaxDetails(item));
		stockTransferDetails.setWeightUnit(weightUnit);
		stockTransferDetails.setCurrencyCode(currencyCode);
		stockTransferDetails.setStatus(FileIntegrationConstants.ISSUED);
		stockTransferDetails.setCreatedBy(stnResponse.getStn().getCreatedBy());
		stockTransferDetails.setCreatedDate(stnResponse.getStn().getCreatedDate());
		stockTransferDetails.setLastModifiedBy(stnResponse.getStn().getCreatedBy());
		stockTransferDetails.setLastModifiedDate(stnResponse.getStn().getCreatedDate());

		return stockTransferDetails;
	}

	private void saveStockInvoiceDetails(InvoiceResponseDto invoiceResponse, String weightUnit, String currencyCode,
			StockInvoiceDao stockInvoice) {
		List<StockInvoiceDetailsDao> stockInoivceDetails = new ArrayList<>();
		invoiceResponse.getItems().stream().forEach(item -> stockInoivceDetails
				.add(mapStockInvoiceDetailsDao(invoiceResponse, item, weightUnit, currencyCode, stockInvoice)));
		stockInvoiceDetailsRepository.saveAll(stockInoivceDetails);
	}

	private StockInvoiceDetailsDao mapStockInvoiceDetailsDao(InvoiceResponseDto invoiceResponse, ItemsDto item,
			String weightUnit, String currencyCode, StockInvoiceDao stockInvoice) {

		StockInvoiceDetailsDao stockInvoiceDetails = new StockInvoiceDetailsDao();
		stockInvoiceDetails.setStockInvoice(stockInvoice);
		stockInvoiceDetails.setItemCode(item.getProductCode());
		stockInvoiceDetails.setLotNumber(item.getLotNumber());
		stockInvoiceDetails.setIssuedQuantity(item.getProductQty().shortValue());
		stockInvoiceDetails.setIssuedWeight(item.getProductWt());
		stockInvoiceDetails.setIssuedWeightDetails(getWeightDetails(item));
		stockInvoiceDetails.setIssuedValue(item.getTotalValue());
		stockInvoiceDetails.setNetValue(item.getTotalValue());
		stockInvoiceDetails.setStdValue(item.getProductValue());
		stockInvoiceDetails.setStdWeight(item.getProductWt());
		stockInvoiceDetails.setBinCode(item.getBinCode());
		stockInvoiceDetails.setBinGroupCode(item.getBinGroupCode());
		stockInvoiceDetails.setProductGroup(item.getProductGroup());
		stockInvoiceDetails.setProductCategory(item.getProductCategory());
		stockInvoiceDetails.setOrderType(item.getCustPoNo().equalsIgnoreCase("P") ? "P" : "R");
		stockInvoiceDetails.setReceivedQuantity(item.getProductQty().shortValue());
		stockInvoiceDetails.setReceivedWeight(item.getProductWt());
		stockInvoiceDetails.setReceivedValue(item.getTotalValue());
		stockInvoiceDetails.setReferenceNo(item.getOrderRef());
		stockInvoiceDetails.setInventoryId(UUID.randomUUID().toString());
		stockInvoiceDetails.setIsacDetails(getIsacDetails(invoiceResponse.getTax().stream()
				.filter(tax -> tax.getItemSerialNo().compareTo(item.getSerialNo()) == 0).collect(Collectors.toList())));
		stockInvoiceDetails.setItemDetails(stnAndInvoiceService.setItemDetails(item.getActualF1().toString(),
				item.getIsHallMarking(), item.getHallMarkingCode(), item.getHallMarkingCentreName(),
				item.getHallMarkedDate(), item.getHallMarkRemarks(), item.getHallMarkRemarks1()));
		stockInvoiceDetails.setWeightUnit(weightUnit);
		stockInvoiceDetails.setCurrencyCode(currencyCode);
		stockInvoiceDetails.setStatus(FileIntegrationConstants.ISSUED);

		return stockInvoiceDetails;
	}

	private String getIsacDetails(List<TaxDto> tax) {
		List<InvoiceIsacDetailsDto> isacList = new ArrayList<>();
		for (int i = 0; i < tax.size(); i++) {
			InvoiceIsacDetailsDto isacDto = new InvoiceIsacDetailsDto();
			isacDto.setLineDtlCount(tax.get(i).getTaxLineSno());
			isacDto.setGlKey(tax.get(i).getTaxType());
			isacDto.setDcInd(tax.get(i).getIndent());
			isacDto.setPercentage(tax.get(i).getTaxPerc());
			isacDto.setAmount(tax.get(i).getTaxAmt());
			isacList.add(isacDto);
		}
		Map<String, String> isacDetails = new HashMap<>();
		isacDetails.put("IsacDetails", MapperUtil.getJsonString(isacList));

		Map<String, Object> isac = new LinkedHashMap<>();
		isac.put("type", "ISAC_DETAILS");
		isac.put("data", isacDetails);
		return MapperUtil.getStringFromJson(isac).replace("\\", "").replace("\"[", "[").replace("]\"", "]");
	}

	private LotDetailsDao mapLotDetailsDao(StoneDto stoneDto, List<ItemsDto> items, long syncTime, String stoneWtUnit,
			String createdBy, Date createdDate) {
		LotDetailsDao lotDetails = new LotDetailsDao();
		LotDetailsIdDao id = new LotDetailsIdDao();
		ItemDao item = new ItemDao();
		item.setItemCode(getItemCode(items, stoneDto.getItemSerialNo()));
		id.setItem(item);
		id.setLotNumber(getLotNumber(items, stoneDto.getItemSerialNo()));
		id.setLineItemNo(stoneDto.getStoneLineNo().shortValue());
		lotDetails.setLotDetailsId(id);
		StoneDao stone = new StoneDao();
		stone.setStoneCode(stoneDto.getStoneCode());
		lotDetails.setStone(stone);
		lotDetails.setNoOfStones(stoneDto.getStnQty().shortValue());
		lotDetails.setStoneWeight(stoneDto.getStnWt());
		lotDetails.setWeightUnit(stoneWtUnit);
		lotDetails.setCreatedBy(createdBy);
		lotDetails.setCreatedDate(createdDate);
		lotDetails.setLastModifiedBy(createdBy);
		lotDetails.setLastModifiedDate(createdDate);
		lotDetails.setSyncTime(syncTime);
		return lotDetails;
	}

	private LotMaterialDetailsDao mapLotMaterialsDao(MaterialDto materialDto, List<ItemsDto> items, long syncTime,
			String stoneWtUnit, String createdBy, Date createdDate) {
		LotMaterialDetailsDao lotMaterialDetails = new LotMaterialDetailsDao();
		LotMaterialDetailsIdDao id = new LotMaterialDetailsIdDao();
		ItemDao item = new ItemDao();
		item.setItemCode(getItemCode(items, materialDto.getItemSerialNo()));
		id.setItem(item);
		id.setLotNumber(getLotNumber(items, materialDto.getItemSerialNo()));
		id.setLineItemNo(materialDto.getMaterialLineNo().intValue());
		lotMaterialDetails.setLotDetailsId(id);
		MaterialDao material = new MaterialDao();
		material.setMaterialCode(materialDto.getMaterialCode());
		lotMaterialDetails.setMaterial(material);
		lotMaterialDetails.setNoOfMaterials(materialDto.getMaterialQty());
		lotMaterialDetails.setWeightUnit(stoneWtUnit);
		lotMaterialDetails.setCreatedBy(createdBy);
		lotMaterialDetails.setCreatedDate(createdDate);
		lotMaterialDetails.setLastModifiedBy(createdBy);
		lotMaterialDetails.setLastModifiedDate(createdDate);
		lotMaterialDetails.setSyncTime(syncTime);
		return lotMaterialDetails;
	}

	private String getLotNumber(List<ItemsDto> items, BigInteger itemSerialNo) {
		List<ItemsDto> item = items.stream().filter(it -> it.getSerialNo().compareTo(itemSerialNo) == 0)
				.collect(Collectors.toList());
		return item.get(0).getLotNumber();
	}

	private String getItemCode(List<ItemsDto> items, BigInteger itemSerialNo) {
		List<ItemsDto> item = items.stream().filter(it -> it.getSerialNo().compareTo(itemSerialNo) == 0)
				.collect(Collectors.toList());
		return item.get(0).getProductCode();
	}

	private String getTaxDetails(ItemsDto item) {
		Map<String, String> taxDetails = new HashMap<>();
		taxDetails.put("CGSTVal", item.getCgstVal().toString());
		taxDetails.put("CGSTPct", item.getCgstPerc().toString());
		taxDetails.put("SGSTVal", item.getSgstVal().toString());
		taxDetails.put("SGSTPct", item.getSgstPerc().toString());
		taxDetails.put("IGSTVal", item.getIgstVal().toString());
		taxDetails.put("IGSTPct", item.getIgstPerc().toString());
		taxDetails.put("UTGSTVal", item.getUtgstVal().toString());
		taxDetails.put("UTGSTPct", item.getUtgstPerc().toString());
		Map<String, Object> stockTransferDetailsTaxDetails = new LinkedHashMap<>();
		stockTransferDetailsTaxDetails.put("type", "TAX_DETAILS");
		stockTransferDetailsTaxDetails.put("data", taxDetails);
		return MapperUtil.getStringFromJson(stockTransferDetailsTaxDetails);
	}

	private void validateStoneCode(String stoneCode) {
		if (!commonValidationService.validateStoneCode(stoneCode, true, null, null, null)) {
			throw new ServiceException("Stone code: " + stoneCode + " not present/active.", "");
		}
	}

	private void validateMaterialCode(String materialCode) {
		if (!commonValidationService.validateMaterialCode(materialCode, true, null, null, null)) {
			throw new ServiceException("Material code: " + materialCode + " not present/active.", "");
		}
	}

	@Override
	public SyncStagingDto getLotStoneStagingDto(List<LotDetailsDao> lotStoneList, String locationCode) {

		List<SyncData> lotStoneSyncData = getLotStoneSyncDataList(lotStoneList);
		List<String> destinations = new ArrayList<>();
		destinations.add(locationCode);
		MessageRequest lotStoneMsgeRequest = DataSyncUtil.createMessageRequest(lotStoneSyncData,
				ProductOperationCodes.LOT_STONE_DETAILS_ADD, destinations, MessageType.GENERAL.toString(),
				DestinationType.SELECTIVE.toString());
		String requestBody = MapperUtil.getJsonString(lotStoneMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(lotStoneMsgeRequest);
		SyncStaging lotStoneStaggingMsg = new SyncStaging();
		lotStoneStaggingMsg.setMessage(requestBody);
		lotStoneStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(lotStoneStaggingMsg, PRODUCTS_SYNC_STAGING_TABLE);
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getLotStoneSyncDataList(List<LotDetailsDao> lotStoneList) {
		List<LotStoneDetailsSyncDto> lotStoneDetailsSyncDtoSyncDataList = new ArrayList<>();
		List<SyncData> lotStoneSyncDataList = new ArrayList<>();
		lotStoneList.stream().forEach(lotStone -> {
			LotStoneDetailsSyncDto lotStoneDetailsSyncDto = new LotStoneDetailsSyncDto(lotStone);
			lotStoneDetailsSyncDtoSyncDataList.add(lotStoneDetailsSyncDto);
		});
		lotStoneSyncDataList.add(DataSyncUtil.createSyncData(lotStoneDetailsSyncDtoSyncDataList, 0));
		return lotStoneSyncDataList;
	}

	@Override
	public SyncStagingDto getLotMaterialsStagingDto(List<LotMaterialDetailsDao> lotMaterialList, String locationCode) {

		List<SyncData> lotMaterialSyncData = getLotMaterialsSyncDataList(lotMaterialList);
		List<String> destinations = new ArrayList<>();
		destinations.add(locationCode);
		MessageRequest lotMaterialMsgeRequest = DataSyncUtil.createMessageRequest(lotMaterialSyncData,
				ProductOperationCodes.LOT_MATERIAL_DETAILS_ADD, destinations, MessageType.GENERAL.toString(),
				DestinationType.SELECTIVE.toString());
		String requestBody = MapperUtil.getJsonString(lotMaterialMsgeRequest);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		syncStagingDto.setMessageRequest(lotMaterialMsgeRequest);
		SyncStaging lotMaterialStaggingMsg = new SyncStaging();
		lotMaterialStaggingMsg.setMessage(requestBody);
		lotMaterialStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		String id = syncDataService.saveSyncStaging(lotMaterialStaggingMsg, PRODUCTS_SYNC_STAGING_TABLE);
		syncStagingDto.setId(id);
		return syncStagingDto;
	}

	private List<SyncData> getLotMaterialsSyncDataList(List<LotMaterialDetailsDao> lotMaterialList) {
		List<LotMaterialDetailsSyncDto> lotMaterialDetailsSyncDtoSyncDataList = new ArrayList<>();
		List<SyncData> lotMaterialSyncDataList = new ArrayList<>();
		lotMaterialList.stream().forEach(lotMaterial -> {
			LotMaterialDetailsSyncDto lotMaterialDetailsSyncDto = new LotMaterialDetailsSyncDto(lotMaterial);
			lotMaterialDetailsSyncDtoSyncDataList.add(lotMaterialDetailsSyncDto);
		});
		lotMaterialSyncDataList.add(DataSyncUtil.createSyncData(lotMaterialDetailsSyncDtoSyncDataList, 0));
		return lotMaterialSyncDataList;
	}

	@Override
	public String setItemDetails(String actualF1Value, String isHallMarking, String hallMarkingCode,
			String hallMarkingCentreName, String hallMarkedDate, String hallMarkRemarks, String hallMarkRemarks1) {
		Map<String, Object> itemDetails = new HashMap<>();
		boolean isHallMarkingString = StringUtils.isEmpty(isHallMarking) || isHallMarking.equalsIgnoreCase("0") ? false
				: true;
		Date hallMarkDate = StringUtils.isEmpty(hallMarkedDate) ? null
				: CalendarUtils.convertStringToDate(hallMarkedDate, "yyyyMMdd");
		String hallMarkDateString = hallMarkDate == null ? null
				: CalendarUtils.formatDateToString(hallMarkDate, "yyyy-MM-dd");
		itemDetails.put("stoneValue", actualF1Value);
		itemDetails.put("isHallMarking", isHallMarkingString);
		itemDetails.put("hallMarkingCode", hallMarkingCode);
		itemDetails.put("hallMarkingCentreName", hallMarkingCentreName);
		itemDetails.put("hallMarkedDate", hallMarkDateString);
		itemDetails.put("hallMarkRemarks", hallMarkRemarks);
		itemDetails.put("hallMarkRemarks1", hallMarkRemarks1);
		itemDetails.put("isHallmarkEligible", true);

		Map<String, Object> stockTransferDetailsItemDetails = new LinkedHashMap<>();
		stockTransferDetailsItemDetails.put("type", "ITEM_DETAILS");
		stockTransferDetailsItemDetails.put("data", itemDetails);
		return MapperUtil.getStringFromJson(stockTransferDetailsItemDetails);
	}

	private String getWeightDetails(ItemsDto item) {
		Map<String, String> weightDetails = new HashMap<>();
		weightDetails.put("silverWeight",
				commonValidationService.roundWeights(item.getSiNetWet().toString(), item.getProductQty().toString()));
		weightDetails.put("goldWeight",
				commonValidationService.roundWeights(item.getGoNetWt().toString(), item.getProductQty().toString()));
		weightDetails.put("platinumWeight",
				commonValidationService.roundWeights(item.getPtNetWt().toString(), item.getProductQty().toString()));
		weightDetails.put("stoneWeight",
				commonValidationService.roundWeights(item.getOthStnWt().toString(), item.getProductQty().toString()));
		weightDetails.put("diamondWeight",
				commonValidationService.roundWeights(item.getDiamondWt().toString(), item.getProductQty().toString()));
		weightDetails.put("materialWeight",
				commonValidationService.roundWeights(item.getOtherNetWt().toString(), item.getProductQty().toString()));

		Map<String, Object> stockTransferDetailsWeightDetails = new LinkedHashMap<>();
		stockTransferDetailsWeightDetails.put("type", "WEIGHT_DETAILS");
		stockTransferDetailsWeightDetails.put("data", weightDetails);
		return MapperUtil.getStringFromJson(stockTransferDetailsWeightDetails);
	}

	private void calcuateRequiredWeights(ItemsDto item) {
		setDefaultWeights(item);
		ProductGroupDao productGroup = commonValidationService.getProductGroup(item.getProductGroup(), true);
		if (productGroup == null) {
			throw new ServiceException("Product group: " + item.getProductGroup() + " not found/active. ", "",
					"Product group: " + item.getProductGroup() + " not found/active. ");
		} else {
			if (productGroup.getPlainStudded().equalsIgnoreCase(PlainStuddedEnum.P.toString())) {
				handlePlainItems(item, productGroup);
			} else if (productGroup.getPlainStudded().equalsIgnoreCase(PlainStuddedEnum.S.toString())) {
				handleStuddedItems(item, productGroup);
			}
		}
	}

	private void setDefaultWeights(ItemsDto item) {
		if (item.getGoNetWt() == null) {
			item.setGoNetWt(new BigDecimal("0"));
		}
		if (item.getPtNetWt() == null) {
			item.setPtNetWt(new BigDecimal("0"));
		}
		if (item.getSiNetWet() == null) {
			item.setSiNetWet(new BigDecimal("0"));
		}
		if (item.getOthStnWt() == null) {
			item.setOthStnWt(new BigDecimal("0"));
		}
		if (item.getOtherNetWt() == null) {
			item.setOtherNetWt(new BigDecimal("0"));
		}
		if (item.getDiamondWt() == null) {
			item.setDiamondWt(new BigDecimal("0"));
		}
	}

	private void handlePlainItems(ItemsDto item, ProductGroupDao productGroup) {
		if (productGroup.getPricingType().equalsIgnoreCase(PricingTypeEnum.PJWS.toString())) {
			item.setOthStnWt(item.getOthStnWt().multiply(new BigDecimal(".2")));
			item.setDiamondWt(item.getDiamondWt().multiply(new BigDecimal(".2")));
		}
		if (productGroup.getItemType() != null) {
			if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.J.getCode())) {
				item.setGoNetWt(commonValidationService.calculatePlainWt(item.getProductWt().toString(),
						item.getOtherNetWt().toString()));
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.L.getCode())) {
				item.setPtNetWt(commonValidationService.calculatePlainWt(item.getProductWt().toString(),
						item.getOtherNetWt().toString()));
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.P.getCode())) {
				item.setSiNetWet(commonValidationService.calculatePlainWt(item.getProductWt().toString(),
						item.getOtherNetWt().toString()));
			}
		}
	}

	private void handleStuddedItems(ItemsDto item, ProductGroupDao productGroup) {
		item.setOthStnWt(item.getOthStnWt().multiply(new BigDecimal(".2")));
		item.setDiamondWt(item.getDiamondWt().multiply(new BigDecimal(".2")));
		if (productGroup.getItemType() != null) {
			if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.J.getCode())) {
				item.setGoNetWt(commonValidationService.calculateStuddedWt(item.getProductWt().toString(),
						item.getOthStnWt().toString(), item.getDiamondWt().toString(),
						item.getOtherNetWt().toString()));
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.L.getCode())) {
				item.setPtNetWt(commonValidationService.calculateStuddedWt(item.getProductWt().toString(),
						item.getOthStnWt().toString(), item.getDiamondWt().toString(),
						item.getOtherNetWt().toString()));
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.P.getCode())) {
				item.setSiNetWet(commonValidationService.calculateStuddedWt(item.getProductWt().toString(),
						item.getOthStnWt().toString(), item.getDiamondWt().toString(),
						item.getOtherNetWt().toString()));
			}
		}
	}
}
