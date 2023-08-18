/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade.impl;

import java.io.IOException;
import java.io.StringReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.core.utils.WeightUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.constant.InventoryDetailsActionEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockInvoiceDetailsDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.inventory.dto.IsacDetailsDto;
import com.titan.poss.inventory.dto.ReceivedWeightDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.PurchaseInvoiceStatus;
import com.titan.poss.inventory.dto.constants.PurchaseInvoiceType;
import com.titan.poss.inventory.dto.request.PurchaseInvoiceConfirmDto;
import com.titan.poss.inventory.dto.request.PurchaseInvoiceItemUpdateDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemBulkDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.PurchaseInvoiceDto;
import com.titan.poss.inventory.dto.response.PurchaseInvoiceItemDto;
import com.titan.poss.inventory.facade.PurchaseInvoiceFacade;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.IntegrationService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.InventorySyncDataService;
import com.titan.poss.inventory.service.InvoiceService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.utils.InventoryUtil;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Service
public class PurchaseInvoiceFacadeImpl implements PurchaseInvoiceFacade {
	private static final Logger LOGGER = LoggerFactory.getLogger(PurchaseInvoiceFacadeImpl.class);
	private static final String VERIFIED_ALREADY = "This Invoice has been already verified";
	private static final String RECORDS_NOT_FOUND = "Records not found";
	private static final String ERR_INV_013 = "ERR-INV-013";
	private static final String ERR_INV_029 = "ERR-INV-029";

	@Autowired
	InvoiceService stockInvoiceService;

	@Autowired
	public InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	private InventoryDetailsService inventoryDetailsService;

	@Autowired
	LocationService locationService;

	@Autowired
	EngineService engineService;

	@Autowired
	PurchaseInvoiceFacadeImpl purchaseInvoiceFacade;

	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	@Autowired
	private IntegrationService integrationService;

	@Override
	public ListResponse<InventoryCountDto> getPurchaseInvoiceCount(String invoiceType, String status) {
		return new ListResponse<>(stockInvoiceService.getPurchaseInvoiceCount(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), status, invoiceType));
	}

	@Override
	public PagedRestResponse<List<PurchaseInvoiceDto>> listPurchaseInvoices(Integer srcdocno,
			String purchaseInvoiceType, Pageable pageable, String purchaseInvoiceStatus) {

		Example<StockInvoiceDao> criteria;
		criteria = listPurchaseInvoiceCriteria(null, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				srcdocno, purchaseInvoiceType, purchaseInvoiceStatus);
		List<PurchaseInvoiceDto> purchaseInvoiceList = new ArrayList<>();
		Page<StockInvoiceDao> invoiceList = stockInvoiceService.listInvoices(criteria, pageable);
		if (invoiceList.isEmpty())
			return new PagedRestResponse<>(Collections.emptyList(), invoiceList);

		for (StockInvoiceDao stockInvoice : invoiceList) {
			PurchaseInvoiceDto returnInvoiceDto = (PurchaseInvoiceDto) MapperUtil.getDtoMapping(stockInvoice,
					PurchaseInvoiceDto.class);
			returnInvoiceDto.setCarrierDetails(stockInvoice.getCarrierDetails());
			returnInvoiceDto.setSrcLocationDescription(
					engineService.getLocationDetail(stockInvoice.getSrcLocationCode()).getDescription());
			returnInvoiceDto.setDestLocationDescription(
					engineService.getLocationDetail(stockInvoice.getSrcLocationCode()).getDescription());
			purchaseInvoiceList.add(createInvoiceDtoResponse(returnInvoiceDto, stockInvoice));
		}
		LOGGER.debug("Get Some Invoice Details - {}", purchaseInvoiceList.size());
		return new PagedRestResponse<>(purchaseInvoiceList, invoiceList);

	}

	private Example<StockInvoiceDao> listPurchaseInvoiceCriteria(String srcLocationCode, String destLocationCode,
			Integer sourceDocNo, String invoiceType, String invoiceStatus) {
		StockInvoiceDao stockInvoiceCriteria = StockInvoiceDao.builder().invoiceType(invoiceType).srcDocNo(sourceDocNo)
				.srcLocationCode(srcLocationCode).destLocationCode(destLocationCode).status(invoiceStatus).build();

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockInvoiceCriteria, matcher);

	}

	@Override
	public PurchaseInvoiceDto getPurchaseInvoiceById(Integer id, String invoiceType, String invoiceStatus) {
		// yet to implement added for History check for check of invoice type as
		// received

		StockInvoiceDao stockInvoice = getInvoiceById(id, null,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), invoiceType, invoiceStatus);
		PurchaseInvoiceDto returnInvoiceDto = (PurchaseInvoiceDto) MapperUtil.getDtoMapping(stockInvoice,
				PurchaseInvoiceDto.class);
		returnInvoiceDto.setSrcLocationDescription(
				engineService.getLocationDetail(stockInvoice.getSrcLocationCode()).getDescription());
		returnInvoiceDto.setDestLocationDescription(
				engineService.getLocationDetail(stockInvoice.getSrcLocationCode()).getDescription());
		return createInvoiceDtoResponse(returnInvoiceDto, stockInvoice);
	}

	private PurchaseInvoiceDto createInvoiceDtoResponse(PurchaseInvoiceDto returnInvoiceDto,
			StockInvoiceDao stockInvoice) {
		returnInvoiceDto.setTotalAvailableQuantity(stockInvoice.getTotalIssuedQuantity());
		returnInvoiceDto.setTotalMeasuredQuantity(stockInvoice.getTotalReceivedQuantity());
		returnInvoiceDto.setTotalAvailableWeight(stockInvoice.getTotalIssuedWeight());
		returnInvoiceDto.setTotalMeasuredWeight(stockInvoice.getTotalReceivedWeight());
		returnInvoiceDto.setTotalAvailableValue(stockInvoice.getTotalIssuedValue());
		returnInvoiceDto.setTotalMeasuredValue(stockInvoice.getTotalReceivedValue());
		if (stockInvoice.getTotalTax() != null) {
			returnInvoiceDto.setTotalValue((stockInvoice.getTotalIssuedValue().subtract(stockInvoice.getTotalDiscount())
					.add(stockInvoice.getTotalTax())).setScale(0, RoundingMode.HALF_UP));
		} else {
			//if totaltax column is null in stockInvoice, check.
			returnInvoiceDto
					.setTotalValue((stockInvoice.getTotalIssuedValue().subtract(stockInvoice.getTotalDiscount()))
							.setScale(0, RoundingMode.HALF_UP));
		}
		return returnInvoiceDto;
	}

	private Example<StockInvoiceDao> listInvoiceByIdCriteria(Integer id, String srcLocationCode,
			String destLocationCode, String invoiceType, String invoiceStatus) {
		StockInvoiceDao stockInvoiceCriteria = StockInvoiceDao.builder().id(id).invoiceType(invoiceType)
				.srcLocationCode(srcLocationCode).destLocationCode(destLocationCode).status(invoiceStatus).build();

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockInvoiceCriteria, matcher);
	}

	@Override
	public PurchaseInvoiceItemDto getPurchaseInvoiceItemById(Integer invoiceId, String itemId, String invoiceType) {
		StockInvoiceDao stockInvoice;

		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		stockInvoice = StockInvoiceDao.builder().id(invoiceId).invoiceType(invoiceType)
				.destLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode()).build();
		StockInvoiceDetailsDao stockInvoiceDetails = getInvoiceItemByIdCommon(stockInvoice, itemId);
		return stockInvoiceDetailsToDto(stockInvoiceDetails, productGroupList, productCategoryList);
	}

	private StockInvoiceDetailsDao getInvoiceItemByIdCommon(StockInvoiceDao stockInvoice, String itemId) {
		Example<StockInvoiceDetailsDao> criteria = listInvoiceItemByIdCriteria(stockInvoice, itemId);
		Optional<StockInvoiceDetailsDao> stockInvoiceDetails = stockInvoiceService.getInvoiceItemById(criteria);
		if (!stockInvoiceDetails.isPresent()) {
			throw new ServiceException(RECORDS_NOT_FOUND, ERR_INV_029);
		}
		return stockInvoiceDetails.get();
	}

	private Example<StockInvoiceDetailsDao> listInvoiceItemByIdCriteria(StockInvoiceDao stockInvoice, String itemId) {
		StockInvoiceDetailsDao stockInvoiceDetailCriteria = StockInvoiceDetailsDao.builder().stockInvoice(stockInvoice)
				.id(itemId).build();
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockInvoiceDetailCriteria, matcher);
	}

	@Override
	public PagedRestResponse<List<PurchaseInvoiceItemDto>> listPurchaseInvoiceItems(Integer invoiceId, String itemCode,
			String lotNumber, String binGroupCode, String status, String invoiceType, List<String> binCodes,
			List<String> productGroups, List<String> productCategories, Pageable pageable) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		List<PurchaseInvoiceItemDto> listProductDtls = new ArrayList<>();
		Page<StockInvoiceDetailsDao> listItems = null;

		StockInvoiceDao stockInvoice = stockInvoiceService.getOne(invoiceId);

		if (stockInvoice != null) {
			listItems = stockInvoiceService.listInvoiceItems(stockInvoice, itemCode, productGroups, productCategories,
					lotNumber, binCodes, binGroupCode, status, pageable);

			for (StockInvoiceDetailsDao invoiceDetails : listItems) {
				listProductDtls.add(stockInvoiceDetailsToDto(invoiceDetails, productGroupList, productCategoryList));
			}

			return new PagedRestResponse<>(listProductDtls, listItems);

		} else {
			throw new ServiceException("Record not Found", "ERR_INV_029");
		}

	}

	@Override
	public ReceivedWeightDto getTotalReceivedWeight(Integer invoiceId, String itemCode, String lotNumber,
			String binGroupCode, String status, String invoiceType, List<String> binCodes, List<String> productGroups,
			List<String> productCategories) {
		// get stock invoice data by id
		// StockInvoiceDao stockInvoice =
		// stockInvoiceService.findStockTransferByIdAndDestLocationCodeAndTransferType(
		// id, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
		// stockReceiveType);
		StockInvoiceDao stockInvoice = stockInvoiceService.getOne(invoiceId);
		BigDecimal totalWeight = new BigDecimal(0.00);
		ReceivedWeightDto receivedWeight = new ReceivedWeightDto();
		receivedWeight.setTotalWeight(totalWeight);
		if (stockInvoiceService.listInvoiceItemsWeightSum(stockInvoice, itemCode, productGroups, productCategories,
				lotNumber, binCodes, binGroupCode, status) != null) {
			receivedWeight.setTotalWeight(stockInvoiceService.listInvoiceItemsWeightSum(stockInvoice, itemCode,
					productGroups, productCategories, lotNumber, binCodes, binGroupCode, status));
		}
		return receivedWeight;
	}

	public PurchaseInvoiceItemDto stockInvoiceDetailsToDto(StockInvoiceDetailsDao stockInvoiceDetails,
			Map<String, String> productGroupList, Map<String, String> productCategoryList) {

		PurchaseInvoiceItemDto invoiceItemDto = (PurchaseInvoiceItemDto) MapperUtil.getDtoMapping(stockInvoiceDetails,
				PurchaseInvoiceItemDto.class);
		BigDecimal itemLevelDiscount = BigDecimal.ZERO;
		BigDecimal preTaxValue = BigDecimal.ZERO;
		BigDecimal totalTax = BigDecimal.ZERO;
		List<IsacDetailsDto> isacDetailList = new ArrayList<>();
		if (stockInvoiceDetails.getIsacDetails() != null) {
			JsonReader reader = new JsonReader(new StringReader(stockInvoiceDetails.getIsacDetails()));
			reader.setLenient(true);
			JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();

			if (jsonObject != null && jsonObject.get("data") != null) {
				JsonObject jsonData = jsonObject.get("data").getAsJsonObject();

				if (jsonData != null && jsonData.get("IsacDetails") != null) {
					JsonArray isacDetails = jsonData.get("IsacDetails").getAsJsonArray();

					for (int i = 0; i < isacDetails.size(); i++) {
						JsonObject isacDetail = isacDetails.get(i).getAsJsonObject();
						if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
								&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("TRADE")) {
							itemLevelDiscount = isacDetail.get("amount").getAsBigDecimal();
						} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
								&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("DBTR")) {
							preTaxValue = isacDetail.get("amount").getAsBigDecimal();
						} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
								&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("SALES")) {

						} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
								&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("CGST")) {
							totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
							getTaxDetailsForBtqCfa(isacDetail,isacDetailList,stockInvoiceDetails.getReceivedQuantity());
						} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
								&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("SGST")) {
							totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
							getTaxDetailsForBtqCfa(isacDetail,isacDetailList,stockInvoiceDetails.getReceivedQuantity());
						} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
								&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("IGST")) {
							totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
							getTaxDetailsForBtqCfa(isacDetail,isacDetailList,stockInvoiceDetails.getReceivedQuantity());
						}
					}
				}
			}
		}
		Map<String,List<IsacDetailsDto>> isacDetailsObj=new HashMap<>();
		isacDetailsObj.put("IsacDetails", isacDetailList);
		JsonData isacTaxdetails=new JsonData();
		isacTaxdetails.setType("ISAC_DETAILS");
		isacTaxdetails.setData(isacDetailsObj);	
		invoiceItemDto.setImageURL(new URLUtil().getImageUrlByItemCode(stockInvoiceDetails.getItemCode()));
		invoiceItemDto.setItemDetails(MapperUtil.getJsonFromString(stockInvoiceDetails.getItemDetails()));
		invoiceItemDto.setMeasuredWeight(stockInvoiceDetails.getReceivedWeight());
		invoiceItemDto.setMeasuredQuantity(stockInvoiceDetails.getReceivedQuantity());
		invoiceItemDto.setMeasuredValue(stockInvoiceDetails.getReceivedValue());
		invoiceItemDto.setAvailableQuantity(stockInvoiceDetails.getIssuedQuantity());
		invoiceItemDto.setAvailableValue(stockInvoiceDetails.getIssuedValue());
		invoiceItemDto.setAvailableWeight(stockInvoiceDetails.getIssuedWeight());
		invoiceItemDto.setProductCategory(stockInvoiceDetails.getProductCategory());
		invoiceItemDto.setProductCategoryDesc(productCategoryList.get(stockInvoiceDetails.getProductCategory()));
		invoiceItemDto.setProductGroup(stockInvoiceDetails.getProductGroup());
		invoiceItemDto.setProductGroupDesc(productGroupList.get(stockInvoiceDetails.getProductGroup()));
		invoiceItemDto.setIsacDetails(isacTaxdetails);
		// while inwarding, setting srcDocDate as mfgDate from Header
		invoiceItemDto.setMfgDate(stockInvoiceDetails.getStockInvoice().getSrcDocDate());
		invoiceItemDto.setPricePerUnit(stockInvoiceDetails.getStdValue());
		invoiceItemDto.setValue(stockInvoiceDetails.getNetValue());
		invoiceItemDto.setItemLevelDiscount(itemLevelDiscount);
		invoiceItemDto.setFinalValue(invoiceItemDto.getValue().subtract(itemLevelDiscount));
		invoiceItemDto.setPreTaxValue(preTaxValue);
		invoiceItemDto.setTotalTax(totalTax);
		return invoiceItemDto;
	}
	
	private void getTaxDetailsForBtqCfa(JsonObject isacDetail, List<IsacDetailsDto> isacDetailList, Short issuedQuantity) {
		IsacDetailsDto taxDetail=new IsacDetailsDto();
		taxDetail.setLineDtlCount(isacDetail.get("lineDtlCount")!=null ?isacDetail.get("lineDtlCount").getAsInt():null);
		taxDetail.setGlKey(isacDetail.get("glKey")!=null? isacDetail.get("glKey").getAsString():null);
		taxDetail.setDcInd(isacDetail.get("dcInd")!=null? isacDetail.get("dcInd").getAsString():null);
		taxDetail.setPercentage(isacDetail.get("percentage")!=null? isacDetail.get("percentage").getAsBigDecimal():BigDecimal.ZERO);
		if(isacDetail.get("amount")!= null && isacDetail.get("amount").getAsBigDecimal().compareTo(BigDecimal.ZERO)>0) {
			 BigDecimal amount = isacDetail.get("amount").getAsBigDecimal();
			 BigDecimal totalQty = new BigDecimal(issuedQuantity);
			 taxDetail.setAmount(amount.divide(totalQty, 2, RoundingMode.HALF_UP));
		} else {
			taxDetail.setAmount(BigDecimal.ZERO);
		}
		isacDetailList.add(taxDetail);
		
		
	}

	@Override
	@Transactional
	public PurchaseInvoiceItemDto updatePurchaseInvoiceItem(Integer invoiceId, String itemId, String invoiceType,
			PurchaseInvoiceItemUpdateDto invoiceItemVerifyDto) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		StockInvoiceDao stockInvoice = StockInvoiceDao.builder().id(invoiceId)
				.invoiceType(PurchaseInvoiceType.CFA_BTQ.toString()).destLocationCode(authUser.getLocationCode())
				.status(PurchaseInvoiceStatus.ISSUED.toString()).build();
		StockInvoiceDetailsDao invoiceDetailNew = getInvoiceItemByIdCommon(stockInvoice, itemId);
		exceptonCheck(invoiceItemVerifyDto, invoiceDetailNew);
		// check for weight tolerance
		// if measured weight is greater than weight tolerance then throw exception
		// checkWeightTolerance method will throw exception in case measured weight is
		// greater than weight tolerance
		// params are location code,product group code,available weight/issue
		// weight,measured
		// weight,available qty/issue qty & measured qty
		if (BinGroupEnum.PURCFA.toString().equals(invoiceItemVerifyDto.getBinGroupCode())) {
			engineService.checkWeightToleranceValue(invoiceDetailNew.getProductGroup(),
					invoiceDetailNew.getIssuedWeight(), invoiceItemVerifyDto.getMeasuredWeight(),
					invoiceDetailNew.getIssuedQuantity(), invoiceDetailNew.getIssuedQuantity());

		}
		saveInvoiceDetail(invoiceItemVerifyDto, authUser, invoiceDetailNew);
		// need to update the StockInvoice. with total weight.
		return stockInvoiceDetailsToDto(invoiceDetailNew, productGroupList, productCategoryList);
	}

	private void saveInvoiceDetail(PurchaseInvoiceItemUpdateDto invoiceItemVerifyDto, AuthUser authUser,
			StockInvoiceDetailsDao invoiceDetailNew) {
		invoiceDetailNew.setReceivedWeight(invoiceItemVerifyDto.getMeasuredWeight());
		if (invoiceDetailNew.getIssuedWeightDetails() != null) {
			invoiceDetailNew.setReceivedWeightDetails(WeightUtil.calculateWeightDetails(
					invoiceDetailNew.getIssuedWeight().divide(BigDecimal.valueOf(invoiceDetailNew.getIssuedQuantity())),
					invoiceDetailNew.getIssuedWeightDetails(), invoiceItemVerifyDto.getMeasuredWeight()
							.divide(BigDecimal.valueOf(invoiceDetailNew.getIssuedQuantity()))));
		} else {
			invoiceDetailNew.setReceivedWeightDetails(invoiceDetailNew.getIssuedWeightDetails());
		}
		invoiceDetailNew.setStatus(PurchaseInvoiceStatus.VERIFIED.name());
		invoiceDetailNew.setBinCode(invoiceItemVerifyDto.getBinCode());
		invoiceDetailNew.setBinGroupCode(invoiceItemVerifyDto.getBinGroupCode());
		invoiceDetailNew.setRemarks(invoiceItemVerifyDto.getRemarks());
		invoiceDetailNew.setLastModifiedBy(authUser.getUsername());
		invoiceDetailNew.setLastModifiedDate(new Date());
		stockInvoiceService.saveItemLevelInvoice(invoiceDetailNew);
	}

	private void exceptonCheck(PurchaseInvoiceItemUpdateDto invoiceItemVerifyDto,
			StockInvoiceDetailsDao invoiceDetailNew) {
		if (invoiceDetailNew.getStatus().equalsIgnoreCase(PurchaseInvoiceStatus.RECEIVED.name())) {
			throw new ServiceException("Item has been already received", ERR_INV_013);
		}

		if (invoiceItemVerifyDto.getBinGroupCode().equals(BinGroupEnum.PURCFA.toString())
				&& !invoiceDetailNew.getOrderType().equals("R")) {
			throw new ServiceException("Only regular items can be moved to PURCFA Bin/Bingroup ", ERR_INV_013);
		}
		if (invoiceItemVerifyDto.getBinGroupCode().equals(BinGroupEnum.CUSTOMERORDERBIN.toString())
				&& !invoiceDetailNew.getOrderType().equals("P")) {
			throw new ServiceException("Only cutomer order items can be moved to CUSTOMERORDERBIN Bin/Bingroup ",
					ERR_INV_013);
		}
		if (invoiceItemVerifyDto.getBinGroupCode().equals(BinGroupEnum.SPARE.toString())
				&& !invoiceDetailNew.getOrderType().equals("S")) {
			throw new ServiceException("Only spare items can be moved to SPARE Bin/Bingroup ", ERR_INV_013);
		}
		if (invoiceItemVerifyDto.getBinGroupCode().equals(BinGroupEnum.DEFECTIVE.toString())
				&& !invoiceDetailNew.getOrderType().equals("R")) {
			throw new ServiceException("Only regular items can be moved to DEFECTIVEBIN Bin/Bingroup ", ERR_INV_013);
		}
	}

	@Override
	public void updateAllPurchaseInvoiceItems(Integer invoiceId, String invoiceType,
			ReceiveStockItemBulkDto receiveStockItemBulkDto) {
		StockInvoiceDao stockInvoice = StockInvoiceDao.builder().id(invoiceId).build();
		getInvoiceById(invoiceId, null, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				PurchaseInvoiceType.CFA_BTQ.name(), PurchaseInvoiceStatus.ISSUED.name());
		if (receiveStockItemBulkDto.getId().isEmpty()) {
			if (receiveStockItemBulkDto.getBinCode() == null || receiveStockItemBulkDto.getBinCode().isEmpty()) {
				stockInvoiceService.verifyAllItems(PurchaseInvoiceStatus.VERIFIED.name(), stockInvoice);
				// need to update modified Date
			} else {
				stockInvoiceService.updateAllStockTransferDetails(stockInvoice, receiveStockItemBulkDto.getBinCode(),
						PurchaseInvoiceStatus.VERIFIED.name());
			}
		}
	}

	@Override
	public PurchaseInvoiceDto updatePurchaseInvoice(Integer invoiceId, String purchaseInvoicetype,
			PurchaseInvoiceConfirmDto invoiceConfirmDto) {

		List<InventoryDetailsDaoExt> invDetailsList = new ArrayList<>();
		StockInvoiceDao stockInvoice = getInvoiceById(invoiceId, null,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), PurchaseInvoiceType.CFA_BTQ.name(),
				null);

		// if header level status is ISSUED then throw exception
		if (!stockInvoice.getStatus().equalsIgnoreCase(PurchaseInvoiceStatus.ISSUED.toString()))
			throw new ServiceException(VERIFIED_ALREADY, ERR_INV_013);

		// if OPEN status is available in details level then throw exception
		Integer issuedItemCount = stockInvoiceService.getOpenItemCount(stockInvoice);
		if (issuedItemCount > 0) {
			throw new ServiceException("Please verify all the items", "ERR-INV-005");
		}

		// if unassigned bin is available in details level then throw exception
		Integer unassignedBin = stockInvoiceService.getUnassignedBinCount(stockInvoice);
		if (unassignedBin > 0) {
			throw new ServiceException("Please assign bin to all the items", "ERR-INV-009");
		}
		CountryDetailsDto countryDetailsDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		stockInvoice.setReceivedRemarks(invoiceConfirmDto.getRemarks());
		stockInvoice.setDestDocNo(inventoryDocMasterService.getDocNumber(countryDetailsDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.PURINV.toString()));
		stockInvoice.setDestDocDate(invoiceConfirmDto.getReceivedDate());
		stockInvoice.setDestFiscalYear(countryDetailsDto.getFiscalYear().shortValue());

		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);

		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		if (statusMap.get(ISOFFLINE).booleanValue()) {
			stockInvoice.setStatus(PurchaseInvoiceStatus.PUBLISHED.toString());
			SyncStagingDto stagingDto = purchaseInvoiceFacade.updateStockTransferAndStaging(invoiceId, stockInvoice,
					invDetailsList, PurchaseInvoiceStatus.PUBLISHED.name());
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(), stagingDto);
		} else {
			stockInvoice.setStatus(PurchaseInvoiceStatus.RECEIVED.toString());
			purchaseInvoiceFacade.updateStockTransferAndStaging(invoiceId, stockInvoice, invDetailsList,
					PurchaseInvoiceStatus.RECEIVED.name());

		}

		// convert stock invoice to PurchaseInvoiceDto
		return createPurchaseInvoiceDto(stockInvoice);

	}

	/**
	 * @param invoiceId
	 * @param stockInvoice
	 * @param invDetailsList
	 * @param name
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto updateStockTransferAndStaging(Integer invoiceId, StockInvoiceDao stockInvoice,
			List<InventoryDetailsDaoExt> invDetailsList, String status) {

		stockInvoice = stockInvoiceService.saveInvoice(stockInvoice);

		List<StockInvoiceDetailsDao> stockInvoiceDetailsList = stockInvoiceService.findByStockInvoice(stockInvoice);

		stockInvoiceService.changeItemStatus(status, stockInvoice);

		getUpdateInventoryDetails(stockInvoiceDetailsList, invDetailsList, stockInvoice);

		// update header table
		stockInvoiceService.updatePurchaseTotalWeightAndQuantity(invoiceId, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		if (status.equals(PurchaseInvoiceStatus.PUBLISHED.name())) {
			InventoryDetailsSyncDtoExt invDetlsSyncDto = new InventoryDetailsSyncDtoExt();
			List<SyncData> syncDatas = new ArrayList<>();
			syncDatas.add(DataSyncUtil
					.createSyncData(invDetlsSyncDto.getSyncDtoExtList(invDetailsList, stockInvoice.getId()), 0));
			List<String> destinations = new ArrayList<>();
			destinations.add(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			MessageRequest invMsgRequest = DataSyncUtil.createMessageRequest(syncDatas,
					InventoryOperationCodes.INV_CFA_POSS_ADD, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			syncStagingDto.setMessageRequest(invMsgRequest);
			String requestBody = MapperUtil.getJsonString(invMsgRequest);
			// saving to staging table
			SyncStaging invoiceStaging = new SyncStaging();
			invoiceStaging.setMessage(requestBody);
			invoiceStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			invoiceStaging = inventorySyncStagingRepository.save(invoiceStaging);
			syncStagingDto.setId(invoiceStaging.getId());
		} else {
			// update inventory
			inventoryDetailsService.addInventoryDetails(invDetailsList, stockInvoice.getDestDocNo(),
					DocTypeEnum.PURINV);
		}
		return syncStagingDto;
	}

	private PurchaseInvoiceDto createPurchaseInvoiceDto(StockInvoiceDao stInvoice) {
		PurchaseInvoiceDto purchaseInvoiceDto = (PurchaseInvoiceDto) MapperUtil.getDtoMapping(stInvoice,
				PurchaseInvoiceDto.class);
		purchaseInvoiceDto.setTotalAvailableQuantity(stInvoice.getTotalIssuedQuantity());
		purchaseInvoiceDto.setTotalAvailableValue(stInvoice.getTotalIssuedValue());
		purchaseInvoiceDto.setTotalAvailableWeight(stInvoice.getTotalIssuedWeight());
		purchaseInvoiceDto.setTotalMeasuredQuantity(stInvoice.getTotalReceivedQuantity());
		purchaseInvoiceDto.setTotalMeasuredValue(stInvoice.getTotalReceivedValue());
		purchaseInvoiceDto.setTotalMeasuredWeight(stInvoice.getTotalReceivedWeight());
		return purchaseInvoiceDto;
	}

	private void getUpdateInventoryDetails(List<StockInvoiceDetailsDao> stockInvoiceDetailsList,
			List<InventoryDetailsDaoExt> invDetailsList, StockInvoiceDao stockInvoice) {
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
		String correlationId = UUID.randomUUID().toString();
		for (StockInvoiceDetailsDao stockInvoiceDetails : stockInvoiceDetailsList) {
			InventoryDetailsDaoExt invDetails = new InventoryDetailsDaoExt();
			BeanUtils.copyProperties(stockInvoiceDetails, invDetails, "id");
			invDetails.setId(UUID.randomUUID().toString());
			invDetails.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			invDetails.setSerialNumber(stockInvoiceDetails.getStdWeight().toString());
			invDetails.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDetails.setCreatedDate(new Date());
			invDetails.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDetails.setLastModifiedDate(new Date());
			invDetails.setTotalQuantity(stockInvoiceDetails.getReceivedQuantity());
			invDetails.setTotalValue(stockInvoiceDetails.getReceivedValue());
			invDetails.setTotalWeight(stockInvoiceDetails.getReceivedWeight());
			invDetails.setTotalWeightDetails(stockInvoiceDetails.getReceivedWeightDetails());
			invDetails.setOrgCode(stockInvoice.getOrgCode());
			// invDetails.setBinModifiedDate(new Date());
			// invDetails.setStockInwardDate(new Date());
			invDetails.setBinModifiedDate(CalendarUtils.getStartOfDay(businessDayDto.getBusinessDate()));
			invDetails.setStockInwardDate(CalendarUtils.getStartOfDay(businessDayDto.getBusinessDate()));
			invDetails.setCurrencyCode(countryDetailsDto.getCurrencyCode());
			invDetails.setWeightUnit(countryDetailsDto.getWeightUnit());
			invDetails.setDocNumber(stockInvoice.getDestDocNo());
			invDetails.setDocType(DocTypeEnum.STNRECPT.name());
			invDetails.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
			invDetails.setActionType(InventoryDetailsActionEnum.ADD.name());
			invDetails.setCorrelationId(correlationId);
			invDetails.setIssuedQuantity((short) 0);
			invDetails.setIsacDetails(stockInvoiceDetails.getIsacDetails());
			invDetails.setItemDiscount(stockInvoiceDetails.getItemLevelDiscount());
			// retrieve isHallmarked from itemDetails JSON and set to isHallmarked.
			invDetails.setIsHallmarked(getHallmarkedFromItemDetails(stockInvoiceDetails));
			// set item details add doc number and doc date
			InventoryUtil.createAndUpdateItemDetails(stockInvoiceDetails.getItemDetails(), invDetails,
					stockInvoice.getDestDocNo(), stockInvoice.getDestDocDate());
			invDetailsList.add(invDetails);
		}

	}

	/**
	 * Method to retrieve hallmarked value from ItemDetails JSON
	 * 
	 * @param sInvoiceDetails
	 * @return
	 */
	private Boolean getHallmarkedFromItemDetails(StockInvoiceDetailsDao sInvoiceDetails) {
		AtomicReference<Boolean> isHallmarkingReference = new AtomicReference<>();
		isHallmarkingReference.set(Boolean.FALSE);
		Optional.ofNullable(sInvoiceDetails.getItemDetails()).ifPresent(itemDetails -> {
			JsonNode itemDetailsNode;
			try {
				itemDetailsNode = MapperUtil.getObjectMapperInstance().readTree(sInvoiceDetails.getItemDetails());
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

	private StockInvoiceDao getInvoiceById(Integer id, String srcLocationcode, String destlocationcode,
			String invoiceType, String invoiceStatus) {
		Example<StockInvoiceDao> criteria = listInvoiceByIdCriteria(id, srcLocationcode, destlocationcode, invoiceType,
				invoiceStatus);
		Optional<StockInvoiceDao> invoiceList = stockInvoiceService.getInvoiceById(criteria);
		if (!invoiceList.isPresent())
			throw new ServiceException(RECORDS_NOT_FOUND, ERR_INV_029);
		return invoiceList.get();
	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	@Override
	public PagedRestResponse<List<PurchaseInvoiceDto>> getInvoiceFromErp(String srcdocno, String transferType) {
		// first searching in the db
		Integer invoiceNumber = Integer.parseInt(srcdocno.replaceAll("[^\\d]", " ").trim().substring(4));
		PagedRestResponse<List<PurchaseInvoiceDto>> listPurchaseInvoices = listPurchaseInvoices(invoiceNumber,
				transferType, Pageable.unpaged(), PurchaseInvoiceStatus.ISSUED.toString());

		if (listPurchaseInvoices.getResults().isEmpty()) {
			// if it is not present, getting invoice data from ERP
			integrationService.getInvoiceService(srcdocno);
			return listPurchaseInvoices(invoiceNumber, transferType, Pageable.unpaged(),
					PurchaseInvoiceStatus.ISSUED.toString());
		} else {
			// validating the src location code (cfa code)
			String srcLocationCode = srcdocno.substring(0, 3);
			if (!srcLocationCode.equalsIgnoreCase(listPurchaseInvoices.getResults().get(0).getSrcLocationCode())) {
				throw new ServiceException(
						"CFA code mismatch. Invoice no: " + srcdocno + " is not for location: "
								+ CommonUtil.getLocationCode(),
						"ERR-INT-075", "CFA code mismatch. Invoice no: " + srcdocno + " is not for location: "
								+ CommonUtil.getLocationCode());
			}
			return listPurchaseInvoices;
		}
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

}
