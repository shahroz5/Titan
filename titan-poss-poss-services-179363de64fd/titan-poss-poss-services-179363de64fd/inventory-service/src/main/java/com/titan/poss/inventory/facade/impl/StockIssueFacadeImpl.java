
/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.facade.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.apache.commons.lang.BooleanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.EinvoiceDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceItemDetailsDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemsDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationResponseDto;
import com.titan.poss.core.dto.LotDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.service.clients.ProductServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.core.utils.PrintUtil;
import com.titan.poss.core.utils.QRCodeGenerator;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.core.utils.WeightUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.acl.InventoryAccessControls;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.InventoryInvoiceDocumentsDao;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.InventoryChild;
import com.titan.poss.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.inventory.dto.InventoryPrint;
import com.titan.poss.inventory.dto.StockIssuePrintHeader;
import com.titan.poss.inventory.dto.constants.BinCodeEnum;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.L1BinGroupCodeEnum;
import com.titan.poss.inventory.dto.constants.ReturnInvoiceStatus;
import com.titan.poss.inventory.dto.constants.ReturnInvoiceType;
import com.titan.poss.inventory.dto.constants.StockIssueRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.StockIssueTransferTypeEnum;
import com.titan.poss.inventory.dto.constants.StockIssueTransferTypeStatusEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferTypeEnum;
import com.titan.poss.inventory.dto.request.IssueStockItemBulkDto;
import com.titan.poss.inventory.dto.request.IssueStockItemUpdateDto;
import com.titan.poss.inventory.dto.request.RemoveStockItemsDto;
import com.titan.poss.inventory.dto.request.StockIssueCancelDto;
import com.titan.poss.inventory.dto.request.StockIssueItemDto;
import com.titan.poss.inventory.dto.request.StockIssueStockConfirmDto;
import com.titan.poss.inventory.dto.request.StockIssueTransferConfirmDto;
import com.titan.poss.inventory.dto.request.StockItemsDto;
import com.titan.poss.inventory.dto.request.StockTransferCancelDto;
import com.titan.poss.inventory.dto.request.json.CourierData;
import com.titan.poss.inventory.dto.request.json.HandCarryEmployeeData;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.IssueStockDto;
import com.titan.poss.inventory.dto.response.IssueStockItemDto;
import com.titan.poss.inventory.dto.response.QuantityCheckDto;
import com.titan.poss.inventory.dto.response.ReceiveStockDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;
import com.titan.poss.inventory.facade.StockIssueFacade;
import com.titan.poss.inventory.repository.InventoryInvoiceDocumentsRepository;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.repository.StockTransferDetailsRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.InventorySyncDataService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.service.StockRequestService;
import com.titan.poss.inventory.service.StockTransferService;
import com.titan.poss.inventory.service.impl.ProductDataSyncServiceImpl;
import com.titan.poss.inventory.utils.InventoryUtil;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dto.LotStoneDetailsSyncDto;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Slf4j
@Service("stockIssueFacade")
public class StockIssueFacadeImpl implements StockIssueFacade {

	private static final String ERR_INV_029 = "ERR-INV-029";
	private static final String ERR_INV_017 = "ERR-INV-017";
	private static final String RECORD_S_NOT_FOUND = "Record(s) not found";
	private static final String ERR_INV_014 = "ERR-INV-014";
	private static final String ERR_INV_035 = "ERR-INV-035";
	private static final String ERR_INV_013 = "ERR-INV-013";
	private static final Logger LOGGER = LoggerFactory.getLogger(StockIssueFacadeImpl.class);

	private static final String TOTAL_QUANTITY = "totalQuantity";
	private static final String TOTAL_WEIGHT = "totalWeight";
	private static final String TOTAL_VALUE = "totalValue";
	private static final String INVALID_UPDATE = "Invalid Update: Please check the current status or type";
	public static final BigDecimal ONE_HUNDRED = new BigDecimal(100);

	public static final String ADJ = "ADJ";
	public static final String PSV = "PSV";

	public static final String ERR_SALE_443 = "ERR-SALE-443";
	public static final String STOCK_UNDER_ADJ_REQUEST = "The stock (ADJ) request raised with Commercial";

	public static final String ERR_SALE_444 = "ERR-SALE-444";
	public static final String STOCK_UNDER_PSV_REQUEST = "The stock (PSV) request raised with Commercial";
	
	public static final String ERR_INV_065 = "ERR-INV-065";
	public static final String ISSUE_TO_FACTORY_IS_INACTIVE_AT_LOCATION_LEVEL = "Issue to Factory is inactive at location level";
	
	private static final String PRODUCTS_SYNC_STAGING_TABLE = "products.dbo.sync_staging";

	@Autowired
	StockRequestService stockRequestService;

	@Autowired
	private Configuration freemarkerConfig;

	@Autowired
	InventoryDetailsService inventoryDetailsService;

	@Autowired
	StockTransferService stockTransferService;

	@Autowired
	InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	InventoryDetailsService inventoryTransactionService;

	@Autowired
	InventoryCommonFacadeImpl inventoryService;

	@Autowired
	LocationService locationService;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Autowired
	EngineService engineService;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private StockIssueFacadeImpl stockIssueFacadeImp;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	@Autowired
	private StockTransferDetailsRepository stockTransferDetailsRepository;

	@Autowired
	private InventoryInvoiceDocumentsRepository inventoryInvoiceDocumentsRepository;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private ReturnInvoiceFacadeImpl returnInvoiceFacadeImpl;

	@Autowired
	private EngineServiceClient engineClient;
	
	@Autowired
	private ProductServiceClient productService;
	
	@Autowired
	ProductDataSyncServiceImpl syncDataService;

	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	@Value("${docs.file.source.path}")
	String fileBasePath;

	@Override
	public ListResponse<InventoryCountDto> getStockRequestCount() {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<String> statusList = new ArrayList<>();
		List<String> requestTypeList = new ArrayList<>();
		statusList.add(StockRequestStatusEnum.APPROVED.toString());
		if (authUser.getAuthorities().contains(new SimpleGrantedAuthority(InventoryAccessControls.ISSUE_TO_BOUTIQUE))) {
			requestTypeList.add(StockIssueRequestTypeEnum.BTQ.toString());
		}
		if (authUser.getAuthorities().contains(
				new SimpleGrantedAuthority(InventoryAccessControls.ISSUE_TO_FACTORY_FACTORY_INITIATED_REQUEST))) {
			requestTypeList.add(StockIssueRequestTypeEnum.FAC.toString());
		}
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.MERCHENDIZING_INITIATED_STOCK_ISSUE))) {
			requestTypeList.add(StockIssueRequestTypeEnum.MER.toString());
		}
		return new ListResponse<>(
				stockRequestService.getStockRequestCount(authUser.getLocationCode(), requestTypeList, statusList));
	}

	@Override
	public PagedRestResponse<List<IssueStockDto>> listStockRequests(Integer reqDocNo, String requestType,
			Pageable pageable) {
		String locationcode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();

		Pageable sortedByReqNoDesc = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
				Sort.by("reqDocNo").descending());

		Page<StockRequestDao> stockRequestPageLists = stockRequestService.findAllStockRequestsByCriteria(
				generateCriteriaToListStockRequests(reqDocNo, requestType, locationcode), sortedByReqNoDesc);
		LOGGER.debug("Stock Request List Size - {}", stockRequestPageLists.getSize());
		List<IssueStockDto> stockReqDtls = getIssueStockDtoList(stockRequestPageLists);
		LOGGER.debug("Get Some stock request Details - {}", stockReqDtls.size());
		return new PagedRestResponse<>(stockReqDtls, stockRequestPageLists);

	}

	private List<IssueStockDto> getIssueStockDtoList(Page<StockRequestDao> stockRequestPageLists) {
		List<IssueStockDto> stockReqDtls = new ArrayList<>();
		for (StockRequestDao stockRequestList : stockRequestPageLists) {
			IssueStockDto stockReqDtlls = (IssueStockDto) MapperUtil.getDtoMapping(stockRequestList,
					IssueStockDto.class);
			stockReqDtlls.setCarrierDetails(MapperUtil.getJsonFromString(stockRequestList.getCarrierDetails()));
			stockReqDtlls.setOtherDetails(MapperUtil.getJsonFromString(stockRequestList.getOtherDetails()));
			BigDecimal totalApprovedQty = new BigDecimal(stockRequestList.getTotalApprovedQuantity());
			BigDecimal totalRequestedQty = new BigDecimal(stockRequestList.getTotalRequestedQuantity());
			if ((totalApprovedQty != null && totalApprovedQty.compareTo(BigDecimal.ZERO)>0)
					&& (totalRequestedQty != null && totalRequestedQty.compareTo(BigDecimal.ZERO)>0)) {
				stockReqDtlls.setTotalAvailableValue(
						(stockRequestList.getTotalRequestedValue().divide(totalRequestedQty, 2, RoundingMode.HALF_UP))
								.multiply(totalApprovedQty).setScale(2, RoundingMode.HALF_UP));
			} else {

				stockReqDtlls.setTotalAvailableValue(stockRequestList.getTotalRequestedValue());
			}
			stockReqDtlls.setTotalMeasuredQuantity(stockRequestList.getTotalSelectedQuantity() == null ? 0
					: stockRequestList.getTotalSelectedQuantity());
			stockReqDtlls.setTotalMeasuredWeight(stockRequestList.getTotalSelectedWeight() == null ? BigDecimal.ZERO
					: stockRequestList.getTotalSelectedWeight());

			// measured value=issued quantity*
			if (stockRequestList.getTotalIssuedValue() == null) {
				stockReqDtlls.setTotalMeasuredValue(BigDecimal.ZERO);
			} else {
				stockReqDtlls.setTotalMeasuredValue(stockRequestList.getTotalIssuedValue());
			}

			stockReqDtlls.setSrcLocationDescription(
					engineService.getLocationDetail(stockRequestList.getSrcLocationCode()).getDescription());
			stockReqDtlls.setDestLocationDescription(
					engineService.getLocationDetail(stockRequestList.getDestLocationCode()).getDescription());
			// totalApprovedQuantity will be populated while confirming request
			// and will be updated in ApprovalController

			stockReqDtlls.setTotalMeasuredQuantity(stockRequestList.getTotalSelectedQuantity() == null ? 0
					: stockRequestList.getTotalSelectedQuantity());
			stockReqDtlls.setTotalMeasuredWeight(stockRequestList.getTotalSelectedWeight() == null ? BigDecimal.ZERO
					: stockRequestList.getTotalSelectedWeight());

			getTotalAvailableQuantity(stockRequestList, stockReqDtlls);
			getTotalAvailableWeight(stockRequestList, stockReqDtlls);

			stockReqDtls.add(stockReqDtlls);
		}

		return stockReqDtls;
	}

	private void getTotalAvailableWeight(StockRequestDao stockRequestList, IssueStockDto stockReqDtlls) {

		BigDecimal totalRequestQuantity = new BigDecimal(stockRequestList.getTotalRequestedQuantity());
		BigDecimal totalApprovedQuantity = new BigDecimal(stockRequestList.getTotalApprovedQuantity());

		if (stockRequestList.getTotalIssuedWeight() == null
				|| stockRequestList.getTotalSelectedWeight() == BigDecimal.ZERO) {
			if (stockRequestList.getTotalSelectedWeight() == null
					|| stockRequestList.getTotalSelectedWeight() == BigDecimal.ZERO) {
				if((totalRequestQuantity != null && totalRequestQuantity.compareTo(BigDecimal.ZERO)>0) 
						 && (totalApprovedQuantity != null && totalApprovedQuantity.compareTo(BigDecimal.ZERO)>0)) {
				      stockReqDtlls.setTotalAvailableWeight(stockRequestList.getTotalRequestedWeight()
						.divide(totalRequestQuantity, 2, RoundingMode.HALF_UP).multiply(totalApprovedQuantity).setScale(2, RoundingMode.HALF_UP));
				 }  else {
					 stockReqDtlls.setTotalAvailableWeight(
								(stockRequestList.getTotalRequestedWeight().subtract(BigDecimal.ZERO)));
				 }

			} else {
				if ((totalRequestQuantity != null && totalRequestQuantity.compareTo(BigDecimal.ZERO) > 0)) {
					stockReqDtlls.setTotalAvailableWeight(stockRequestList.getTotalRequestedWeight()
							.divide(totalRequestQuantity, 2, RoundingMode.HALF_UP).multiply(totalApprovedQuantity)
							.setScale(2, RoundingMode.HALF_UP));
				}
			}
		} else {
			stockReqDtlls.setTotalAvailableWeight(
					(stockRequestList.getTotalRequestedWeight().subtract(stockRequestList.getTotalIssuedWeight())));
		}

	}

	private void getTotalAvailableQuantity(StockRequestDao stockRequestList, IssueStockDto stockReqDtlls) {
		if (stockRequestList.getTotalIssuedQuantity() == null || stockRequestList.getTotalIssuedQuantity() == 0) {
			if (stockRequestList.getTotalSelectedQuantity() == null
					|| stockRequestList.getTotalSelectedQuantity() == 0) {
				stockReqDtlls.setTotalAvailableQuantity((short) (stockRequestList.getTotalApprovedQuantity() - 0));
			} else {
				stockReqDtlls.setTotalAvailableQuantity(stockRequestList.getTotalApprovedQuantity());
			}
		} else {
			stockReqDtlls.setTotalAvailableQuantity(
					(short) (stockRequestList.getTotalApprovedQuantity() - stockRequestList.getTotalIssuedQuantity()));
		}

	}

	private Example<StockRequestDao> generateCriteriaToListStockRequests(Integer reqDocNo, String requestType,
			String locationcode) {
		StockRequestDao stockRequest = new StockRequestDao();
		stockRequest.setSrcLocationCode(locationcode);
		stockRequest.setStatus(StockRequestStatusEnum.APPROVED.toString());
		stockRequest.setRequestType(requestType);
		stockRequest.setReqDocNo(reqDocNo);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockRequest, matcher);
	}

	@Override
	public IssueStockDto getStockRequest(Integer id, String requestType) {
		StockRequestDao stockRequest = stockRequestService.getStockRequestByIdAndType(id, requestType);
		IssueStockDto isd = (IssueStockDto) MapperUtil.getDtoMapping(stockRequest, IssueStockDto.class);
		isd.setCarrierDetails(MapperUtil.getJsonFromString(stockRequest.getCarrierDetails()));
		isd.setOtherDetails(MapperUtil.getJsonFromString(stockRequest.getOtherDetails()));

		// will be updated in ApprovalController
		BigDecimal totalRequestQuantity = new BigDecimal(stockRequest.getTotalRequestedQuantity());
		BigDecimal totalApprovedQuantity = new BigDecimal(stockRequest.getTotalApprovedQuantity());

		if((totalRequestQuantity != null && totalRequestQuantity.compareTo(BigDecimal.ZERO)>0) 
				 && (totalApprovedQuantity != null && totalApprovedQuantity.compareTo(BigDecimal.ZERO)>0)) {
		  isd.setTotalAvailableValue(
				(stockRequest.getTotalRequestedValue().divide(totalRequestQuantity, 2, RoundingMode.HALF_UP))
						.multiply(totalApprovedQuantity).setScale(2, RoundingMode.HALF_UP));
		} else {
			isd.setTotalAvailableValue(stockRequest.getTotalRequestedValue());
		}
		// will be updated in ApprovalController
		isd.setTotalMeasuredQuantity(
				stockRequest.getTotalSelectedQuantity() == null ? 0 : stockRequest.getTotalSelectedQuantity());
		isd.setTotalMeasuredWeight(stockRequest.getTotalSelectedWeight() == null ? BigDecimal.ZERO
				: stockRequest.getTotalSelectedWeight());

		getTotalAvailableQuantity(stockRequest, isd);
		getTotalAvailableWeight(stockRequest, isd);

		if (stockRequest.getTotalIssuedValue() == null) {
			isd.setTotalMeasuredValue(BigDecimal.ZERO);
		} else {
			isd.setTotalMeasuredValue(stockRequest.getTotalIssuedValue());
		}
		isd.setSrcLocationDescription(
				engineService.getLocationDetail(stockRequest.getSrcLocationCode()).getDescription());
		isd.setDestLocationDescription(
				engineService.getLocationDetail(stockRequest.getDestLocationCode()).getDescription());
		return isd;
	}

	@Override
	public PagedRestResponse<List<IssueStockItemDto>> listStockTransferItems(Integer id, String transferType,
			String itemCode, List<String> filterProductGroupList, List<String> productCategory, String lotNumber,
			List<String> binCode, String binGroupCode, String status,String cfaLocationCode, Pageable pageable) {

		List<IssueStockItemDto> stockRequestDetailsDtos;
		List<String> binGroup = new ArrayList<>();
		Map<String, String> productGroupMap;
		List<String> productGroup = null;
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())) {
			binGroup.add(L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Plain CFA's
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			productGroupMap.keySet().removeIf(k -> (k.equals(ProductGroupCodeEnum.GOLD_COIN.getCode())));
			productGroup = getListProductGroup(productGroupMap);
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())) {
			binGroup.add(L1BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.S.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroup = getListProductGroup(productGroupMap);
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_GOLD_COIN.toString())) {
			binGroup.add(L1BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroupMap.keySet().removeIf(k -> !(k.equals(ProductGroupCodeEnum.GOLD_COIN.getCode())));
			productGroup = getListProductGroup(productGroupMap);
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_CFA.toString())) {
			binGroup.add(BinGroupEnum.DEFECTIVE.toString());
			binGroup.add(BinGroupEnum.DISPUTE.toString());
			binGroup.add(BinGroupEnum.STN.toString());
			binGroup.add(BinGroupEnum.FOC.toString());
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.DEFECTIVE.toString())) {
			binGroup.add(BinGroupEnum.DEFECTIVE.toString());
			binGroup.add(BinGroupEnum.DISPUTE.toString());
			binGroup.add(BinGroupEnum.HALLMARKDISPUTEBIN.toString());
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_BTQ.toString())) {
			binGroup.add(BinGroupEnum.STN.toString());
		}  
		else {
			binGroup.add(transferType);
		}

		StockTransferDao stockTransfer = stockTransferService.getOne(id);
		if (stockTransfer == null) {
			LOGGER.debug("The STN Id doesn't exist ");
			throw new ServiceException("Incorrect STN ID ", ERR_INV_029);
		} else {
			if ((!(stockTransfer.getStatus().equals(StockTransferStatusEnum.OPEN.toString())) || (!stockTransfer
					.getSrcLocationCode().equals(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode())))) {
				LOGGER.debug("The STN Id passed doesn't exist ");
				throw new ServiceException("No Access", ERR_INV_035);
			}

		}

		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		String sortParameter = null;
		Optional<Order> order = pageable.getSort().get().findFirst();
		if (order.isPresent()) {
			sortParameter = order.get().getProperty();
			sortParameter += " " + order.get().getDirection().name();
		}
		List<Object[]> listAvailableItems;
		int total;

		if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.DEFECTIVE.toString())) {
			listAvailableItems = stockTransferService.getJointListForDefective(id, binGroup, productGroup, status,
					itemCode, lotNumber, locationCode, productCategory, sortParameter == null ? "NULL" : sortParameter,
					filterProductGroupList, binCode, businessDayDto.getBusinessDate(),
					pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());

			total = stockTransferService.getPageSizeForDefective(id, binGroup, productGroup, status, itemCode,
					lotNumber, locationCode, productCategory, filterProductGroupList, binCode,
					businessDayDto.getBusinessDate());
		} else {
			listAvailableItems = stockTransferService.getJointList(id, binGroup, productGroup, status, itemCode,
					lotNumber, locationCode, productCategory, sortParameter == null ? "NULL" : sortParameter,
					filterProductGroupList, binCode, businessDayDto.getBusinessDate(),
					pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());

			total = stockTransferService.getPageSize(id, binGroup, productGroup, status, itemCode, lotNumber,
					locationCode, productCategory, filterProductGroupList, binCode, businessDayDto.getBusinessDate());
		}

		// Sets the dto values from response
		stockRequestDetailsDtos = setIssueDtoDetailsFromTransferDetails(listAvailableItems, transferType,cfaLocationCode);
		// stockRequestDetailsDtos.sort(Comparator.comparing(b -> b.getRefDocDate()));
//		Comparator<IssueStockItemDto> comparator = (c1, c2) -> {
//			return Long.valueOf(c1.getRefDocDate().getTime()).compareTo(c2.getRefDocDate().getTime());
//		};
//
//		Collections.sort(stockRequestDetailsDtos, comparator);
		// sort list based on inward date
//		if (sortParameter == null) {
//			Collections.sort(stockRequestDetailsDtos);
//		}
		log.info("List After Sorting Based on " + sortParameter + ".............................."
				+ stockRequestDetailsDtos);
		Page<IssueStockItemDto> pagedData = new PageImpl<>(stockRequestDetailsDtos,
				PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()), total);

		return new PagedRestResponse<>(stockRequestDetailsDtos, pagedData);

	}

	private List<String> getListProductGroup(Map<String, String> productGroupMap) {
		List<String> productGroup = new ArrayList<>();
		for (Map.Entry<String, String> entry : productGroupMap.entrySet()) {
			productGroup.add(entry.getKey());
		}
		return productGroup;
	}

	private List<IssueStockItemDto> setIssueDtoDetailsFromTransferDetails(List<Object[]> listAvailableItems,
			String transferType, String cfaLocationCode) {

		List<IssueStockItemDto> listProductDtls = new ArrayList<>();
		LocationResponseDto locationDetails = engineClient.getBoutiqueLocationDetails();

		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		for (Object[] l : listAvailableItems) {
			IssueStockItemDto is = new IssueStockItemDto();
			is.setInventoryId((String) l[0]);
			is.setId((String) l[1]);
			is.setStatus((String) l[2]);
			is.setItemCode((String) l[3]);
			is.setLotNumber((String) l[4]);
			Short qty = (l[5] == null) ? (short) 0 : (Short) l[5];// totalQuantity
			Short issuedQty = (l[20] == null) ? (short) 0 : (Short) l[20];// totalQuantity

			is.setAvailableQuantity((short) (qty - issuedQty));// total- issued quantity
			is.setMeasuredQuantity((Short) l[6]); // detailsTotalQuantity
			is.setProductCategory((String) l[7]);
			is.setProductGroup((String) l[8]);
			is.setBinCode((String) l[9]);
			is.setBinGroupCode((String) l[10]);
			is.setStdValue((BigDecimal) l[11]);
			is.setStdWeight((BigDecimal) l[12]); // inventory item weight
			is.setCurrencyCode((String) l[13]);
			is.setWeightUnit((String) l[14]);
			is.setMfgDate((Date) l[15]);
			is.setMeasuredWeight((BigDecimal) l[16]); // details measured weight
			is.setAvailableWeight((BigDecimal) l[17]); // inventory details totalweight
			is.setMeasuredValue((BigDecimal) l[18]); // details measured Value
			is.setAvailableValue((BigDecimal) l[19]); // inventory details totalValue
			is.setRefDocType((String) l[21]);
			is.setRefDocNumber((Integer) l[22]);
			is.setRefFiscalYear((Short) l[23]);
			is.setRefDocDate((Date) l[24]);
			is.setKarat((BigDecimal) l[26]);
			is.setProductCategoryDesc(productCategoryList.get(l[7]));
			is.setProductGroupDesc(productGroupList.get(l[8]));
			/*
			 * JsonObject itemDetailsJsonObject = new JsonParser()
			 * .parse(MapperUtil.getStringFromJson((Object) l[25])).getAsJsonObject();
			 * is.setIshallmarking(itemDetailsJsonObject.getAsJsonObject("data").get(
			 * "ishallmarking").getAsBoolean());
			 */

			if (l[25] != null) {
				JsonData jsonData = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(l[25].toString()), JsonData.class);
				Object obj = jsonData != null ? jsonData.getData() : null;
				ObjectMapper obMapper = new ObjectMapper();
				Map<String, Object> map = new HashMap<String, Object>();
				if (obj != null) {
					map = obMapper.convertValue(obj, Map.class);
					if (map != null && !map.isEmpty() && map.get("isHallMarking") != null)
						is.setIshallmarking((Boolean) map.get("isHallMarking"));
				} else {
					is.setIshallmarking(false);
				}
			} else {
				is.setIshallmarking(false);
			}
			if (is.getItemCode() != null) {
				is.setImageURL(new URLUtil().getImageUrlByItemCode(is.getItemCode()));
			}
			if (qty > 0) {
				setissueToFactoryStockTaxDetails(is, (String) l[3], (BigDecimal) l[11], transferType, locationDetails,cfaLocationCode);
				listProductDtls.add(is);
			}
		}
		return listProductDtls;
	}

	private void setissueToFactoryStockTaxDetails(IssueStockItemDto stockDetailDto, String itemCode,
			BigDecimal stdValue, String transferType, LocationResponseDto locationDetails, String cfaLocationCode) {
		TaxCalculationResponseDto taxDetailsResponse = null;
		if ((transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_GOLD_COIN.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.GEP.toString()))
				&& !StringUtils.isEmpty(itemCode)) {

			taxDetailsResponse = engineClient.getTaxDetails(locationDetails.getFactoryDetails().getLocationCode(), 0,
					null, TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE_TEP_GEP.name(), itemCode, false, null);
		} else if ((transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.DEFECTIVE.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_BTQ.toString()))
				&& !StringUtils.isEmpty(itemCode)) {
			taxDetailsResponse = engineClient.getTaxDetails(locationDetails.getFactoryDetails().getLocationCode(), 0,
					null, TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.name(), itemCode, false, null);
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_CFA.toString())
				&& !StringUtils.isEmpty(itemCode)) {
			if (!StringUtils.isEmpty(cfaLocationCode)) {
				taxDetailsResponse = engineClient.getTaxDetails(cfaLocationCode, 0, null,
						TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.name(), itemCode, false, null);
			} else {
				taxDetailsResponse = engineClient.getTaxDetails(locationDetails.getCfaDetails().getLocationCode(), 0,
						null, TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.name(), itemCode, false, null);
			}
		}

		Map<String, BigDecimal> taxDetails = new HashMap<>();
		Map<String, TaxDetailDto> data = new HashMap<>();
		TaxDetailDto sgstDetails = null;
		if (taxDetailsResponse != null) {
			data = taxDetailsResponse.getData();
			if (!CollectionUtils.isEmpty(data)) {
				if (data.get("SGST") != null) {
					sgstDetails = data.get("SGST");
					if (sgstDetails.getTaxPercentage() != null) {
						taxDetails.put("SGSTVal", stdValue.multiply(sgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
								.setScale(2, RoundingMode.HALF_UP));
						taxDetails.put("SGSTPct", sgstDetails.getTaxPercentage());
					}
				} else {
					taxDetails.put("SGSTVal", BigDecimal.ZERO);
					taxDetails.put("SGSTPct", BigDecimal.ZERO);

				}
				if (data.get("UTGST") != null) {
					TaxDetailDto utgstDetails = data.get("UTGST");
					if (utgstDetails != null) {
						if (utgstDetails.getTaxPercentage() != null) {
							taxDetails.put("UTGSTVal",
									stdValue.multiply(utgstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2,
											RoundingMode.HALF_UP));
							taxDetails.put("UTSTPct", utgstDetails.getTaxPercentage());
						}
					}
				} else {
					taxDetails.put("UTGSTVal", BigDecimal.ZERO);
					taxDetails.put("UTSTPct", BigDecimal.ZERO);

				}
				if (data.get("CGST") != null) {
					TaxDetailDto cgstDetails = data.get("CGST");
					if (cgstDetails.getTaxPercentage() != null) {
						taxDetails.put("CGSTVal", stdValue.multiply(cgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
								.setScale(2, RoundingMode.HALF_UP));
						taxDetails.put("CGSTPct", cgstDetails.getTaxPercentage());
					}
				} else {
					taxDetails.put("CGSTVal", BigDecimal.ZERO);
					taxDetails.put("CGSTPct", BigDecimal.ZERO);

				}
				if (data.get("IGST") != null) {
					TaxDetailDto igstDetails = data.get("IGST");
					if (igstDetails != null) {
						if (igstDetails.getTaxPercentage() != null) {
							taxDetails.put("IGSTVal",
									stdValue.multiply(igstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2,
											RoundingMode.HALF_UP));
							taxDetails.put("IGSTPct", igstDetails.getTaxPercentage());
						}
					}
				} else {
					taxDetails.put("IGSTVal", BigDecimal.ZERO);
					taxDetails.put("IGSTPct", BigDecimal.ZERO);

				}
			}
		}

		Map<String, Object> issueStockTaxDetails = new LinkedHashMap<>();
		issueStockTaxDetails.put("type", "TAX_DETAILS");
		issueStockTaxDetails.put("data", taxDetails);
		stockDetailDto.setTaxDetails(MapperUtil.getJsonFromString(MapperUtil.getStringFromJson(issueStockTaxDetails)
				.replace("\\", "").replace("\"[", "[").replace("]\"", "]")));
		JsonObject taxValueDetails = new JsonParser()
				.parse(MapperUtil.getStringFromJson(stockDetailDto.getTaxDetails())).getAsJsonObject();
		BigDecimal finalTax = BigDecimal.ZERO;
		if (taxValueDetails != null && taxValueDetails.getAsJsonObject("data") != null) {
			BigDecimal igstVal = BigDecimal.ZERO;
			BigDecimal cgstVal = BigDecimal.ZERO;
			BigDecimal sgstVal = BigDecimal.ZERO;
			BigDecimal utgstVal = BigDecimal.ZERO;
			if (taxValueDetails.getAsJsonObject("data").get("IGSTVal") != null)
				igstVal = taxValueDetails.getAsJsonObject("data").get("IGSTVal").getAsBigDecimal();
			if (taxValueDetails.getAsJsonObject("data").get("CGSTVal") != null)
				cgstVal = taxValueDetails.getAsJsonObject("data").get("CGSTVal").getAsBigDecimal();
			if (taxValueDetails.getAsJsonObject("data").get("SGSTVal") != null)
				sgstVal = taxValueDetails.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
			if (taxValueDetails.getAsJsonObject("data").get("UTGSTVal") != null)
				utgstVal = taxValueDetails.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();

			finalTax = igstVal.add(cgstVal).add(sgstVal).add(utgstVal);
		}
		stockDetailDto.setTotalTax(finalTax.setScale(2, RoundingMode.HALF_UP));
		finalTax = finalTax.multiply(new BigDecimal(stockDetailDto.getAvailableQuantity()));
		if (stockDetailDto.getAvailableValue() != null) {
			stockDetailDto
					.setFinalValue(stockDetailDto.getAvailableValue().add(finalTax).setScale(2, RoundingMode.HALF_UP));
		}
	}

	@Override
	public RequestStockItemResponseDto getStockRequestItem(String requestType, Integer id, String itemId) {
		return stockRequestService.getStockRequestItemByIdAndItemIdAndRequestType(id, itemId, requestType);
	}

	@Override
	public IssueStockItemDto getStockTransferItem(String transferType, Integer id, String itemId) {
		StockTransferDao st = new StockTransferDao();
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		st.setId(id);
		StockTransferDetailsDao stdetails = stockTransferService
				.findStockTransferDetailsByItemIdAndStockTransfer(itemId, st);
		st.setTransferType(transferType);
		IssueStockItemDto itemDto = (IssueStockItemDto) MapperUtil.getDtoMapping(stdetails, IssueStockItemDto.class);

		itemDto.setProductCategory(stdetails.getProductCategory());
		itemDto.setProductCategoryDesc(productCategoryList.get(stdetails.getProductCategory()));
		itemDto.setProductGroup(stdetails.getProductGroup());
		itemDto.setProductGroupDesc(productGroupList.get(stdetails.getProductGroup()));

		return itemDto;
	}

	@Override
	@Transactional
	public ReceiveStockDto confirmStockRequest(Integer id, String requestType,
			StockIssueStockConfirmDto stockRequestConfirmDto) {
		StockTransferDao stockTransfer = null;
		ReceiveStockDto receiveStockDto = null;
		
		LocationCacheDto locationCacheDto = engineService.getLocationDetail(CommonUtil.getLocationCode());
		Boolean isIssueToFactoryAllowed =locationCacheDto.getInventoryDetails().getIsIssueToFactory();
		
		  
		if(requestType.equals(StockIssueRequestTypeEnum.FAC.toString()) && BooleanUtils.isFalse(isIssueToFactoryAllowed)) {
			throw new ServiceException(ISSUE_TO_FACTORY_IS_INACTIVE_AT_LOCATION_LEVEL, ERR_INV_065);
		}
		else {
			
		StockRequestDao stockRequest = stockRequestService.getStockRequestByIdAndType(id, requestType);		
		
		
		getInvDetailsOfItemsInRequestForRequestFlow(stockRequest);
		confirmStockRequestValidation(id, stockRequestConfirmDto, stockRequest);
		// previousbin-- STN current bin--DEFECTIVE
		stockTransfer = createStockTransfer(requestType, stockRequestConfirmDto, stockRequest);
		stockTransfer = getStockTransferObject(requestType, stockTransfer, stockRequest);
		

		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		List<InventoryDetailsDaoExt> inv = new ArrayList<>();
		// inventory update
		getUpdateInventoryDetailsForStockTransfer(stockTransfer, inv);	

		List<StockTransferDetailsDao> stockTransferDetailsList = stockTransferDetailsRepository
				.findByStockTransfer(stockTransfer);
		
		List<LotDetailsDao> lotStoneList = new ArrayList<>();
		if (!requestType.equals(StockIssueRequestTypeEnum.FAC.toString()) && BooleanUtils.isNotTrue(stockTransfer.getIsDirectTransfer())) {
			lotStoneList = getLotStoneDetails(stockTransferDetailsList);
		}
		
		if (!CollectionUtils.isEmpty(stockTransferDetailsList)) {
			eInvoiceCheck(stockTransfer, stockTransferDetailsList, requestType);	
		}		
		
		if (statusMap.get(ISOFFLINE).booleanValue()) {
			SyncStagingDto stagingDto = stockIssueFacadeImp.getStagingDto(inv, stockTransfer);
			if (stagingDto != null) {
				inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(),
						stagingDto);
			}
			// -----------Sync Data for Lot_Stone_details-------------------------------
			if (!CollectionUtils.isEmpty(lotStoneList)
					&& !(requestType.equals(StockIssueRequestTypeEnum.FAC.toString())) && BooleanUtils.isNotTrue(stockTransfer.getIsDirectTransfer())) {
				SyncStagingDto data = getLotStoneStagingDto(lotStoneList, stockTransfer.getDestLocationCode());
				syncDataService.publishProductMessagesToQueue(data, PRODUCTS_SYNC_STAGING_TABLE);
			}
		} else {
			inventoryTransactionService.removeFromInventoryDetails((inv), stockTransfer.getSrcDocNo(),
					DocTypeEnum.STNISSUE);
		}
		
		receiveStockDto = (ReceiveStockDto) MapperUtil.getDtoMapping(stockTransfer, ReceiveStockDto.class);
		receiveStockDto.setTotalMeasuredQuantity(stockTransfer.getTotalIssuedQuantity());
		receiveStockDto.setTotalMeasuredWeight(stockTransfer.getTotalIssuedWeight());
		receiveStockDto.setTotalMeasuredValue(stockTransfer.getTotalIssuedValue());
		// needed to convert it to string before sending
		receiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransfer.getCarrierDetails()));
		return receiveStockDto;
		}
	}
	
	public List<LotDetailsDao> getLotStoneDetails(List<StockTransferDetailsDao> stockTransferDetailsList) {

		List<LotDto> lotDetailsList = new ArrayList<>();
		List<LotDetailsDao> lotDetailsStoneList = new ArrayList<>();
		LotDto lotDto = new LotDto();

		for (StockTransferDetailsDao stock : stockTransferDetailsList) {
			lotDto.setItemCode(stock.getItemCode());
			lotDto.setLotNumber(stock.getLotNumber());
		}
		lotDetailsList.add(lotDto);
		if (!lotDetailsList.isEmpty()) {

			final int chunkSize = 50;
			final AtomicInteger counter = new AtomicInteger();
			final Collection<List<LotDto>> chunkLists = lotDetailsList.stream()
					.collect(Collectors.groupingBy(data -> counter.getAndIncrement() / chunkSize)).values();
			chunkLists.forEach(chunck -> {
				List<LotDetailsDao> lotStoneList = new ArrayList<>();
				ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
						false);
				Object responseObj = productService.getItemsWithItemCodeAndLotNumber(chunck);
				lotStoneList = mapper.convertValue(responseObj, new TypeReference<List<LotDetailsDao>>() {
				});
				lotDetailsStoneList.addAll(lotStoneList);
			});
		}
		return lotDetailsStoneList;
	}

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
		com.titan.poss.product.dao.SyncStaging lotStoneStaggingMsg = new com.titan.poss.product.dao.SyncStaging();
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
	public void getInvDetailsOfItemsInRequestForRequestFlow(StockRequestDao stockRequest) {
		List<StockRequestDetailsDao> stockRequestDetails = getStockRequestDetails(stockRequest);
		List<String> inventoryIds = new ArrayList<>();
		for (StockRequestDetailsDao item : stockRequestDetails) {
			inventoryIds.add(item.getInventoryId());
		}
		List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
				.getItemsByIdAndLocationCode(inventoryIds);
		// if list is not empty
		if (!CollectionUtils.isEmpty(inventoryDetailsList)) {
			// check if items are in ADJ/PSV Request, then throw error.
			inventoryDetailsList.forEach(inventoryDetail -> {
				Short qty = 0;
				for (int i = 0; i < stockRequestDetails.size(); i++) {
					if ((stockRequestDetails.get(i).getInventoryId()).equals(inventoryDetail.getId())) {
						qty = stockRequestDetails.get(i).getSelectedQuantity();
					}
				}
				checkIfItemsAreInRequestAndPrevent(inventoryDetail, qty);
			});
		}
	}

	@Override
	public void getInvDetailsOfItemsInRequestForTransferFlow(StockTransferDao stockTransfer1) {
		List<StockTransferDetailsDao> stockTransferDetails = stockTransferDetailsRepository
				.findByStockTransfer(stockTransfer1);
		List<String> inventoryIds = new ArrayList<>();
		for (StockTransferDetailsDao item : stockTransferDetails) {
			inventoryIds.add(item.getInventoryId());
		}
		List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
				.getItemsByIdAndLocationCode(inventoryIds);
		// if list is not empty
		if (!CollectionUtils.isEmpty(inventoryDetailsList)) {
			// check if items are in ADJ/PSV Request, then throw error.
			inventoryDetailsList.forEach(inventoryDetail -> {
				Short qty = 0;
				for (int i = 0; i < stockTransferDetails.size(); i++) {
					if ((stockTransferDetails.get(i).getInventoryId()).equals(inventoryDetail.getId())) {
						qty = stockTransferDetails.get(i).getIssuedQuantity();
					}
				}
				checkIfItemsAreInRequestAndPrevent(inventoryDetail, qty);
			});
		}
	}

	@Override
	public void checkIfItemsAreInRequestAndPrevent(InventoryDetailsDaoExt inventoryDetail, Short qty) {
		if (inventoryDetail.getRequestType() != null) {
			if ((inventoryDetail.getRequestType().equals(ADJ)) && inventoryDetail.getRequestQuantity() >= qty) {
				throw new ServiceException(STOCK_UNDER_ADJ_REQUEST, ERR_SALE_443);
			}

			if ((inventoryDetail.getRequestType().equals(PSV)) && inventoryDetail.getRequestQuantity() >= qty) {
				throw new ServiceException(STOCK_UNDER_PSV_REQUEST, ERR_SALE_444);
			}
		}
	}

	private void confirmStockRequestValidation(Integer id, StockIssueStockConfirmDto stockRequestConfirmDto,
			StockRequestDao stockRequest) {
		if (stockRequest == null) {
			throw new ServiceException("No Item available with approved status", ERR_INV_029);
		}
		if (!stockRequest.getStatus().equalsIgnoreCase(StockRequestStatusEnum.APPROVED.toString())) {
			throw new ServiceException("No Item available with approved status", ERR_INV_029);
		}
		// validate JSON format
		validateJson(stockRequestConfirmDto.getCarrierDetails());
		// query to check requested quantity> inventory quantity.
		List<QuantityCheckDto> itemIds = checkQuantityValidation(id);
		if (!itemIds.isEmpty()) {
			throw new ServiceException(
					"Following Id's have requested quantity more than availanble inventory's quantity", ERR_INV_017,
					itemIds);
		}
		// Query to check restricted bins before issue
		List<QuantityCheckDto> items = checkIssueBinValidation(id);
		// if bin-group got change before issue. throw exception
		if (!items.isEmpty()) {
			throw new ServiceException("Following items Bingroup has been changed so couldnot confirm", "ERR-INV-037",
					items);
		}
	}

	// Issue Bin Group Validation...get Data from DB
	private List<QuantityCheckDto> checkIssueBinValidation(Integer id) {
		List<QuantityCheckDto> itemIds = new ArrayList<>();
		List<Object[]> availableItemList = stockRequestService.checkBinValidationWithInventoryStockIssue(id);
		for (Object[] availableItem : availableItemList) {
			QuantityCheckDto item = new QuantityCheckDto();
			item.setItemId((String) availableItem[0]);
			item.setLotNumber((String) availableItem[1]);
			item.setItemCode((String) availableItem[2]);
			item.setCurrentBinGroup((String) availableItem[3]);
			item.setPreviousBinGroup((String) availableItem[4]);
			itemIds.add(item);
		}
		return itemIds;
	}

	private StockTransferDao getStockTransferObject(String requestType, StockTransferDao stockTransfer,
			StockRequestDao stockRequest) {
		List<StockRequestDetailsDao> stockRequestDetails = getStockRequestDetails(stockRequest);
		List<StockTransferDetailsDao> stList = new ArrayList<>();
		short totalIssuedQuantity = 0;
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		for (StockRequestDetailsDao stockRequestDtls : stockRequestDetails) {
			if (stockRequestDtls.getStatus().equals(StockRequestStatusEnum.SELECTED.toString())) {
				updateStockRequestObject(stockTransfer, stList, stockRequestDtls);
				totalIssuedQuantity = (short) (totalIssuedQuantity + stockRequestDtls.getSelectedQuantity());
				totalValue = totalValue.add(stockRequestDtls.getStdValue()
						.multiply(BigDecimal.valueOf(stockRequestDtls.getSelectedQuantity())));
				totalWeight = totalWeight.add(stockRequestDtls.getSelectedWeight());
				stockRequestDtls.setSelectedWeight(BigDecimal.ZERO);
				stockRequestDtls.setSelectedQuantity((short) 0);
				// if approved qty - issued qty is 0 then set status as ISSUED
				// if not 0 then set status as APPROVED
				if ((stockRequestDtls.getApprovedQuantity() - stockRequestDtls.getIssuedQuantity()) == 0) {
					stockRequestDtls.setStatus(StockRequestStatusEnum.ISSUED.name());
				} else {
					stockRequestDtls.setStatus(StockRequestStatusEnum.APPROVED.name());
				}
				stockRequestService.save(stockRequestDtls);
			}
		}
		if (!stList.isEmpty())
			stockTransferService.saveAll(stList);

		if (requestType.equals(StockIssueRequestTypeEnum.BTQ.toString())) {
			stockRequest.setStatus(StockRequestStatusEnum.ISSUED.toString());
		} else {
			long issuedCount = stockRequestDetails.stream()
					.filter(a -> a.getStatus().equals(StockRequestStatusEnum.APPROVED.toString())).count();
			// stockRequest Update
			if (issuedCount == 0) {
				stockRequest.setStatus(StockRequestStatusEnum.ISSUED.toString());
			}
		}
		stockRequest.setTotalIssuedQuantity(stockRequest.getTotalIssuedQuantity() == null ? totalIssuedQuantity
				: (short) (stockRequest.getTotalIssuedQuantity() + totalIssuedQuantity));
		stockRequest.setTotalIssuedWeight(stockRequest.getTotalIssuedWeight() == null ? totalWeight
				: (stockRequest.getTotalIssuedWeight().add(totalWeight)));
		stockRequest.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		stockRequest.setTotalSelectedQuantity((short) 0);
		stockRequest.setTotalSelectedWeight(BigDecimal.ZERO);
		stockRequest.setIssuedDate(businessDayDto.getBusinessDate());
		stockRequestService.save(stockRequest);
		stockTransfer.setTotalIssuedQuantity(totalIssuedQuantity);
		stockTransfer.setTotalIssuedValue(totalValue);
		stockTransfer.setTotalIssuedWeight(totalWeight);
		stockTransfer = stockTransferService.saveOrUpdateStockTransfer(stockTransfer);
		return stockTransfer;
	}

	private void updateStockRequestObject(StockTransferDao stockTransfer, List<StockTransferDetailsDao> stList,
			StockRequestDetailsDao stockRequestDtls) {
		short issuedQuantity = 0;
		short selectedQuantity = 0;
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		// if getIssuedQuantity() is null then set the value as 0
		if (stockRequestDtls.getIssuedQuantity() == null)
			issuedQuantity = 0;
		else
			issuedQuantity = stockRequestDtls.getIssuedQuantity();

		StockTransferDetailsDao stDetail = (StockTransferDetailsDao) MapperUtil.getDtoMapping(stockRequestDtls,
				StockTransferDetailsDao.class);

		// if getSelectedQuantity() is null then set the value as 0
		if (stockRequestDtls.getSelectedQuantity() == null)
			selectedQuantity = 0;
		else
			selectedQuantity = stockRequestDtls.getSelectedQuantity();

		stDetail.setItemDetails(stockRequestDtls.getItemDetails());
		stDetail.setTaxDetails(stockRequestDtls.getTaxDetails());
		stDetail.setStockTransfer(stockTransfer);

		// issued values are setted
		stDetail.setIssuedValue(
				stockRequestDtls.getStdValue().multiply(BigDecimal.valueOf(stockRequestDtls.getSelectedQuantity())));

		stDetail.setIssuedQuantity(stockRequestDtls.getSelectedQuantity());
		stDetail.setIssuedWeight(stockRequestDtls.getSelectedWeight());
		

		// final values and total tax are setted
		JsonObject taxValueDetails = new JsonParser().parse(stockRequestDtls.getTaxDetails()).getAsJsonObject();
		BigDecimal igstVal = taxValueDetails.getAsJsonObject("data").get("IGSTVal").getAsBigDecimal();
		BigDecimal cgstVal = taxValueDetails.getAsJsonObject("data").get("CGSTVal").getAsBigDecimal();
		BigDecimal sgstVal = taxValueDetails.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
		BigDecimal utgstVal = taxValueDetails.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();
		BigDecimal finalTax = igstVal.add(cgstVal).add(sgstVal).add(utgstVal);
		stDetail.setTotalTax(finalTax.multiply(new BigDecimal(stockRequestDtls.getSelectedQuantity())).setScale(2,
				RoundingMode.HALF_UP));
		stDetail.setFinalValue(stDetail.getIssuedValue().add(stDetail.getTotalTax()).setScale(2, RoundingMode.HALF_UP));

		// received values are setted
		stDetail.setReceivedValue(
				stockRequestDtls.getStdValue().multiply(BigDecimal.valueOf(stockRequestDtls.getSelectedQuantity())));
		stDetail.setReceivedQuantity(stockRequestDtls.getSelectedQuantity());
		stDetail.setReceivedWeight(stockRequestDtls.getSelectedWeight());

		stDetail.setStdValue(stockRequestDtls.getStdValue());
		stDetail.setStdWeight(stockRequestDtls.getStdWeight());
		stDetail.setStatus(StockRequestStatusEnum.ISSUED.toString());
		stDetail.setIssuedWeightDetails(stockRequestDtls.getSelectedWeightDetails());
		stDetail.setReceivedWeightDetails(stockRequestDtls.getSelectedWeightDetails());
		if(BinGroupEnum.STN.toString().equals(stDetail.getBinGroupCode())) {
		stDetail.setBinCode(BinCodeEnum.ZEROBIN.toString());
		}
		stList.add(stDetail);
		stockRequestDtls.setIssuedQuantity((short) (issuedQuantity + selectedQuantity));
		stockRequestDtls.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		stockRequestDtls.setIssuedDate(businessDayDto.getBusinessDate());
		if (stockRequestDtls.getSelectedWeight() == null) {
			// this can be cause error as selected weight is newly added
			stockRequestDtls.setSelectedWeight(stockRequestDtls.getRequestedWeight());
		}
		if (stockRequestDtls.getIssuedWeight() == null) {
			stockRequestDtls.setIssuedWeight(BigDecimal.ZERO);
			stockRequestDtls
					.setIssuedWeight((stockRequestDtls.getIssuedWeight().add(stockRequestDtls.getSelectedWeight())));
		} else {
			stockRequestDtls
					.setIssuedWeight((stockRequestDtls.getIssuedWeight().add(stockRequestDtls.getSelectedWeight())));
		}
	}

	private void validateJson(JsonData jsonData) {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		String type = jsonData.getType();
		List<String> str = new ArrayList<>();
		// if type is courier
		if ("courier".equals(type)) {
			CourierData courierData = MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(),
					CourierData.class);
			Set<ConstraintViolation<CourierData>> violationsCourier = validator.validate(courierData);
			violationsCourier.forEach(violation -> str.add(violation.getMessage()));
			if (!violationsCourier.isEmpty()) {
				throw new ServiceException("JSON data format error", "ERR-CORE-013", str);
			}
		} else if ("employee".equals(type)) {
			// if type is employee
			HandCarryEmployeeData handCarryEmployeeData = MapperUtil.getObjectMapperInstance()
					.convertValue(jsonData.getData(), HandCarryEmployeeData.class);
			Set<ConstraintViolation<HandCarryEmployeeData>> violationsHandCarryEmp = validator
					.validate(handCarryEmployeeData);
			violationsHandCarryEmp.forEach(violation -> str.add(violation.getMessage()));
			if (!violationsHandCarryEmp.isEmpty())
				throw new ServiceException("JSON data format error", "ERR-CORE-013", str);

		} else {
			// throw exception
			throw new ServiceException("Invalid Request type & JSON type.JSON type : " + type, ERR_INV_013);
		}
	}

	// for stockIssue
	public void getUpdateInventoryDetailsForStockTransfer(StockTransferDao stockTransfer,
			List<InventoryDetailsDaoExt> inv) {
		List<StockTransferDetailsDao> stds = stockTransferService.findByStockTransferAndStatus(stockTransfer,
				StockTransferStatusEnum.ISSUED.toString());
		List<String> invIds = new ArrayList<>();
		for (StockTransferDetailsDao stransferDetail : stds) {
			InventoryDetailsDaoExt inventoryDetail = (InventoryDetailsDaoExt) MapperUtil.getDtoMapping(stransferDetail,
					InventoryDetailsDaoExt.class);
			inventoryDetail.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			inventoryDetail.setTotalQuantity(stransferDetail.getIssuedQuantity());
			inventoryDetail.setTotalValue(stransferDetail.getIssuedValue());
			inventoryDetail.setTotalWeight(stransferDetail.getIssuedWeight());
			inventoryDetail.setId(stransferDetail.getInventoryId());
			inventoryDetail.setSerialNumber(stransferDetail.getIssuedWeight().toString());
			inventoryDetail.setOrgCode(stockTransfer.getOrgCode());
			inv.add(inventoryDetail);
			invIds.add(stransferDetail.getInventoryId());

		}

		List<InventoryDetailsDaoExt> invList = inventoryTransactionService.getInventoryDetailsByIdList(invIds);
		for (StockTransferDetailsDao stransferDetail : stds) {
			for (InventoryDetailsDaoExt in : invList) {
				if (stransferDetail.getInventoryId().equals(in.getId())) {
					// updating issued quantity alone, before datasync
					in.setIssuedQuantity(
							(short) (in.getIssuedQuantity() + stransferDetail.getIssuedQuantity().shortValue()));
				}
			}

		}
		inventoryTransactionService.updateIssuedQuantity(invList);
	}

	private List<StockRequestDetailsDao> getStockRequestDetails(StockRequestDao stockRequest) {
		StockRequestDao sr = new StockRequestDao();
		sr.setId(stockRequest.getId());
		sr.setRequestType(stockRequest.getRequestType());
		StockRequestDetailsDao stockRequestDetail = new StockRequestDetailsDao();
		stockRequestDetail.setStockRequest(sr);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StockRequestDetailsDao> criteria = Example.of(stockRequestDetail, matcher);
		return stockRequestService.findAllStockRequestItems(criteria);
	}

	private StockTransferDao createStockTransfer(String requestType, StockIssueStockConfirmDto stnIssueConfirmDto,
			StockRequestDao stockRequest) {
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		CountryDetailsDto countryDetailsDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		Object carrierDetails = null;
		ObjectMapper objectMapper = MapperUtil.getObjectMapperInstance();
		if (stnIssueConfirmDto.getCarrierDetails() == null
				|| stnIssueConfirmDto.getCarrierDetails().getData() == null) {
			carrierDetails = MapperUtil.getJsonFromString(stockRequest.getCarrierDetails());
		} else {
			carrierDetails = stnIssueConfirmDto.getCarrierDetails();
		}
		StockTransferDao stockTransfer = (StockTransferDao) MapperUtil.getDtoMapping(stockRequest,
				StockTransferDao.class);
		stockTransfer.setId(null);
		requestTypeValidation(requestType, stockTransfer);
		stockTransfer
				.setCarrierDetails(MapperUtil.getStringFromJson(objectMapper.convertValue(carrierDetails, Map.class)));
		stockTransfer.setStatus(StockRequestStatusEnum.ISSUED.toString());
		stockTransfer.setIssuedRemarks(stnIssueConfirmDto.getRemarks());
		stockTransfer.setOrgCode(CommonConstants.ORG_CODE);
		stockTransfer.setTotalIssuedQuantity((short) 0);
		stockTransfer.setTotalReceivedQuantity((short) 0);
		stockTransfer.setTotalIssuedValue(BigDecimal.ZERO);
		stockTransfer.setPrints((short) 0);
		stockTransfer.setSrcDocNo(inventoryDocMasterService.getDocNumber(countryDetailsDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.STNISSUE.toString()));
		stockTransfer.setSrcDocDate(businessDayDto.getBusinessDate());
		stockTransfer.setSrcFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		stockTransfer.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		// need to check
		stockTransfer.setStockRequestId(stockRequest.getId());
		
		// checking legacy destination location code
		if(stockTransfer.getTransferType().equalsIgnoreCase(StockTransferTypeEnum.MER_BTQ.toString())) {
			LocationCacheDto locationData = engineService.getLocationDetail(stockRequest.getDestLocationCode());
			Boolean isMigratedFromLegacy = locationData.getIsMigratedFromLegacy();
	        if(BooleanUtils.isFalse(isMigratedFromLegacy)) {
	        	stockTransfer.setIsDirectTransfer(true);
	        	stockTransfer.setFilePublished(false);     
	        }
		}
		stockTransfer = stockTransferService.saveOrUpdateStockTransfer(stockTransfer);
		return stockTransfer;
	}

	private void requestTypeValidation(String requestType, StockTransferDao stockTransfer) {
		if (requestType.equals(StockIssueRequestTypeEnum.BTQ.toString())) {
			stockTransfer.setTransferType(StockTransferTypeEnum.BTQ_BTQ.toString());
		}
		if (requestType.equals(StockIssueRequestTypeEnum.FAC.toString())) {
			stockTransfer.setTransferType(StockTransferTypeEnum.BTQ_FAC.toString());
		}
		if (requestType.equals(StockIssueRequestTypeEnum.MER.toString())) {
			stockTransfer.setTransferType(StockTransferTypeEnum.MER_BTQ.toString());
		}
	}

	@Override
	public ReceiveStockDto confirmStockTransfer(Integer id, String transferType,
			StockIssueTransferConfirmDto stockRequestConfirmDto) {
		StockTransferDao stockTransfer = null;
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		BusinessDayDto businessDayDto = getBusinessDay(authUser.getLocationCode());
		Optional<StockTransferDao> stockTransfer1 = stockTransferService.findByIdAndTransferType(id, transferType);
		getInvDetailsOfItemsInRequestForTransferFlow(stockTransfer1.get());

		// throw exception if header level data is not available
		if (!stockTransfer1.isPresent())
			throw new ServiceException(RECORD_S_NOT_FOUND, ERR_INV_029);

		if (!stockTransfer1.get().getStatus().equalsIgnoreCase(StockTransferStatusEnum.OPEN.toString())) {
			throw new ServiceException("This STN Have been already Confirmed", ERR_INV_013);
		}
		Integer openItemCount = stockTransferService.getOpenItemCount(stockTransfer);
		if (openItemCount > 0) {
			throw new ServiceException("Please verify all the items", "ERR-INV-005");
		}

		// validate JSON format
		validateJson(stockRequestConfirmDto.getCarrierDetails());

		// query to check requested quantity> inventory quantity.
		List<QuantityCheckDto> itemIds = checkQuantityValidationForTransfer(id);
		if (!itemIds.isEmpty()) {

			throw new ServiceException(
					"Following Id's have requested quantity more than availanble inventory's quantity", ERR_INV_017,
					itemIds);
		}
		stockTransfer = stockTransfer1.get();
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		String status = null;
		if (statusMap.get(ISOFFLINE).booleanValue()) {
			status = StockTransferStatusEnum.PUBLISHED.name();
		} else {
			status = StockTransferStatusEnum.ISSUED.name();
		}

		LOGGER.debug("stn - {}", stockTransfer1.get());
		stockTransfer.setStatus(status);
        
		if(transferType.equalsIgnoreCase(StockTransferTypeEnum.BTQ_BTQ.toString())){
		    stockTransfer.setIsDirectTransfer(true); 
		}
		
		stockTransfer.setIssuedRemarks(stockRequestConfirmDto.getRemarks());
		stockTransfer.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		stockTransfer.setDestLocationCode(stockRequestConfirmDto.getDestinationLocationCode());

		stockTransfer.setCarrierDetails(MapperUtil.getStringFromJson(stockRequestConfirmDto.getCarrierDetails()));
		CountryDetailsDto countryDetailsDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		stockTransfer.setSrcDocNo(inventoryDocMasterService.getDocNumber(countryDetailsDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.STNISSUE.toString()));
		stockTransfer.setSrcDocDate(businessDayDto.getBusinessDate());
		SyncStagingDto stagingDto = stockIssueFacadeImp.updateStockIssueAndStaging(stockTransfer, id, status);
		if (stagingDto != null)
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(), stagingDto);

		ReceiveStockDto receiveStockDto = (ReceiveStockDto) MapperUtil.getDtoMapping(stockTransfer,
				ReceiveStockDto.class);

		// needed to convert it to string before sending
		receiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransfer.getCarrierDetails()));
		receiveStockDto.setTotalMeasuredQuantity(stockTransfer.getTotalIssuedQuantity());
		receiveStockDto.setTotalMeasuredWeight(stockTransfer.getTotalIssuedWeight());
		receiveStockDto.setTotalMeasuredValue(stockTransfer.getTotalIssuedValue());
		List<StockTransferDetailsDao> stockTransferDetails = stockTransferDetailsRepository
				.findByStockTransfer(stockTransfer);
		try {
			if (!CollectionUtils.isEmpty(stockTransferDetails)
					&& !transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.COIN.name())) {
				eInvoiceCheck(stockTransfer, stockTransferDetails, transferType);
			}
		} catch (Exception e) {
			LOGGER.info("Error in E-invoice generation" + e.getMessage());
		}
		return receiveStockDto;

	}

	private void eInvoiceCheck(StockTransferDao stockTransfer, List<StockTransferDetailsDao> stockTransferDetails,
			String transferType) {
		String integrationTransactionType = getInvoiceTransactionType(transferType);
		LocationCacheDto locationCacheDtoBtq = engineService.getLocationDetail(stockTransfer.getSrcLocationCode());
		StoreDetails storeDetailsSource = locationCacheDtoBtq.getStoreDetails();
		if (BooleanUtils.isTrue(storeDetailsSource.getIsEinvoiceEnabled())) {

			InventoryInvoiceDocumentsDao inventoryInvoiceDocumentsDao = inventoryInvoiceDocumentsRepository
					.findByReferenceIdAndTransactionType(stockTransfer.getId().toString(), integrationTransactionType);
			if (inventoryInvoiceDocumentsDao == null) {
				EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = generateInvoice(stockTransfer,
						stockTransferDetails, integrationTransactionType);
				if (BooleanUtils.isTrue(einvoiceIrnDetailsResponseDto.getStatus())) {
					inventoryInvoiceDocumentsDao = MapperUtil.mapObjToClass(einvoiceIrnDetailsResponseDto,
							InventoryInvoiceDocumentsDao.class);
					inventoryInvoiceDocumentsDao.setReferenceId(stockTransfer.getId().toString());
					inventoryInvoiceDocumentsDao.setTransactionType(integrationTransactionType);
					inventoryInvoiceDocumentsRepository.save(inventoryInvoiceDocumentsDao);
				}
			}
		}

	}

	private String getInvoiceTransactionType(String transferType) {
		if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.name())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.name()))
			return EinvoiceTransactionTypeEnum.TEP_RETURN.name();
		else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.GEP.name()))
			return EinvoiceTransactionTypeEnum.GEP_RETURN.name();
		else
			return EinvoiceTransactionTypeEnum.RETURN_STN.name();
	}

	private EinvoiceIrnDetailsResponseDto generateInvoice(StockTransferDao stockTransfer,
			List<StockTransferDetailsDao> stockTransferDetails, String integrationTransactionType) {
		LocationCacheDto locationCacheDtoBtq = engineService.getLocationDetail(stockTransfer.getSrcLocationCode());
		LocationCacheDto locationCacheDtoFact = engineService.getLocationDetail(stockTransfer.getDestLocationCode());
		EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = new EinvoiceIrnDetailsResponseDto();
		if (!StringUtils.isEmpty(locationCacheDtoBtq.getTaxDetails().getGstRegisterationNo())
				&& !StringUtils.isEmpty(locationCacheDtoFact.getTaxDetails().getGstRegisterationNo())
				&& !locationCacheDtoBtq.getTaxDetails().getGstRegisterationNo()
						.equalsIgnoreCase(locationCacheDtoFact.getTaxDetails().getGstRegisterationNo())) {
			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto = returnInvoiceFacadeImpl.getCustomerDetails(
					stockTransfer.getSrcDocNo().toString(), stockTransfer.getSrcDocDate(), locationCacheDtoBtq,
					locationCacheDtoFact);
			List<EinvoiceItemDetailsDto> einvoiceItemDetailsDtoList = new ArrayList<>();
			einvoiceIrnDetailsDto.setTransactionId(stockTransfer.getId().toString());
			stockTransferDetails.forEach(stockTransferDetail -> {
				EinvoiceItemDetailsDto einvoiceItemDetailsDto = new EinvoiceItemDetailsDto();
				einvoiceItemDetailsDto.setSerialNo(stockTransferDetails.indexOf(stockTransferDetail) + 1);
				List<String> itemCodes = new ArrayList<>();
				itemCodes.add(stockTransferDetail.getItemCode());
				Map<String, ItemDetailsDto> itemsDetailMap = engineService.listItemDetails(itemCodes);
				ItemDetailsDto itemDetailsDto = itemsDetailMap.get(stockTransferDetail.getItemCode());
				if (itemDetailsDto.getHsnCode() != null)
					einvoiceItemDetailsDto.setHsnCode(itemDetailsDto.getHsnCode());
				einvoiceItemDetailsDto.setQuantity(stockTransferDetail.getIssuedQuantity().intValue());
				einvoiceItemDetailsDto.setUnit(stockTransferDetail.getWeightUnit());
				einvoiceItemDetailsDto.setUnitPrice(stockTransferDetail.getStdValue());
				if (!StringUtils.isEmpty(stockTransferDetail.getTaxDetails()))
					einvoiceItemDetailsDto = getTaxDetails(einvoiceItemDetailsDto, stockTransferDetail);
				einvoiceItemDetailsDtoList.add(einvoiceItemDetailsDto);

			});
			einvoiceIrnDetailsDto.setEinvoiceItemDetailsDto(einvoiceItemDetailsDtoList);
			einvoiceIrnDetailsResponseDto = integrationServiceClient.generateIrn(VendorCodeEnum.IRN_ASPTAX.name(),
					integrationTransactionType, einvoiceIrnDetailsDto);
		}
		return einvoiceIrnDetailsResponseDto;
	}

	private EinvoiceItemDetailsDto getTaxDetails(EinvoiceItemDetailsDto einvoiceItemDetailsDto,
			StockTransferDetailsDao stockTransferDetail) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(stockTransferDetail.getTaxDetails()), JsonData.class);
		JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(jsonData.getData())).getAsJsonObject();
		if (jsonObject != null) {
			if (jsonObject.get("SGSTVal") != null)
				einvoiceItemDetailsDto.setSgstAmount(jsonObject.get("SGSTVal").getAsBigDecimal().multiply(new BigDecimal(einvoiceItemDetailsDto.getQuantity())));
			if (jsonObject.get("SGSTPct") != null)
				einvoiceItemDetailsDto.setSgstRate(jsonObject.get("SGSTPct").getAsBigDecimal());
			if (jsonObject.get("UTGSTVal") != null)
				einvoiceItemDetailsDto.setUtgstAmount(jsonObject.get("UTGSTVal").getAsBigDecimal().multiply(new BigDecimal(einvoiceItemDetailsDto.getQuantity())));
			if (jsonObject.get("UTGSTPct") != null)
				einvoiceItemDetailsDto.setUtgstRate(jsonObject.get("UTGSTPct").getAsBigDecimal());
			if (jsonObject.get("CGSTVal") != null)
				einvoiceItemDetailsDto.setCgstAmount(jsonObject.get("CGSTVal").getAsBigDecimal().multiply(new BigDecimal(einvoiceItemDetailsDto.getQuantity())));
			if (jsonObject.get("CGSTPct") != null)
				einvoiceItemDetailsDto.setCgstRate(jsonObject.get("CGSTPct").getAsBigDecimal());
			if (jsonObject.get("IGSTVal") != null)
				einvoiceItemDetailsDto.setIgstAmount(jsonObject.get("IGSTVal").getAsBigDecimal().multiply(new BigDecimal(einvoiceItemDetailsDto.getQuantity())));
			if (jsonObject.get("IGSTPct") != null)
				einvoiceItemDetailsDto.setIgstRate(jsonObject.get("IGSTPct").getAsBigDecimal());
		}
		return einvoiceItemDetailsDto;
	}

	/**
	 * @param stockTransfer
	 * @param id
	 * @param status
	 * @return
	 */
	@Transactional
	public SyncStagingDto updateStockIssueAndStaging(StockTransferDao stockTransfer, Integer id, String status) {
		List<InventoryDetailsDaoExt> inv = new ArrayList<>();
		// dest. doc no , dest. doc date, received remarks will not be generated as
		// there
		// is no receive
		// flow for TEP GEP COINS
		// yet to implement Check with inventory if available quantity< requested
		// Quantity (JOIN QUERY),

		// yet to implement InventoryUpdate API.
		getUpdateInventoryDetails(stockTransfer, inv);
		if (!status.equals(StockRequestStatusEnum.PUBLISHED.name()))
			inventoryTransactionService.removeFromInventoryDetails((inv), stockTransfer.getSrcDocNo(),
					DocTypeEnum.STNISSUE);
		stockTransferService.saveOrUpdateStockTransfer(stockTransfer);
		stockTransferService.changeItemStatus(status, stockTransfer);
		// Inventory update implementation

		// update header
		stockTransferService.updateTotalWeightAndQuantity(id, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		SyncStagingDto stockIssueStagingDto = new SyncStagingDto();
		if (status.equals(StockRequestStatusEnum.PUBLISHED.name())) {
			stockIssueStagingDto = stockIssueFacadeImp.getStagingDto(inv, stockTransfer);
		}
		return stockIssueStagingDto;
	}

	/**
	 * @param inv
	 * @param stockTransfer
	 * @param stockIssueStagingDto
	 * @return SyncStagingDto
	 */
	public SyncStagingDto getStagingDto(List<InventoryDetailsDaoExt> inv, StockTransferDao stockTransfer) {
		InventoryDetailsSyncDtoExt invDetlsSyncDto = new InventoryDetailsSyncDtoExt();
		List<SyncData> syncDatas = new ArrayList<>();
		SyncStagingDto stockIssueStagingDto = new SyncStagingDto();
		if (!inv.isEmpty()) {

			syncDatas
					.add(DataSyncUtil.createSyncData(invDetlsSyncDto.getSyncDtoExtList(inv, stockTransfer.getId()), 0));
			List<String> destinations = new ArrayList<>();
			destinations.add(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			MessageRequest stockIssueRqst = DataSyncUtil.createMessageRequest(syncDatas,
					InventoryOperationCodes.INV_STNISSUE_POSS_ADD, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			stockIssueStagingDto.setMessageRequest(stockIssueRqst);
			String requestBody = MapperUtil.getJsonString(stockIssueRqst);
			// saving to staging table
			SyncStaging stockIssueStaging = new SyncStaging();
			stockIssueStaging.setMessage(requestBody);
			stockIssueStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			stockIssueStaging = inventorySyncStagingRepository.save(stockIssueStaging);
			stockIssueStagingDto.setId(stockIssueStaging.getId());
		}
		return stockIssueStagingDto;
	}

	// selected_quantity<inv_quantity
	private List<QuantityCheckDto> checkQuantityValidation(Integer id) {
		List<QuantityCheckDto> itemIds = new ArrayList<>();
		List<Object[]> availableItemList = stockRequestService.checkAvailableQuantityWithInventory(id);

		for (Object[] availableItem : availableItemList) {
			QuantityCheckDto item = new QuantityCheckDto();
			item.setItemId((String) availableItem[0]);
			item.setLotNumber((String) availableItem[1]);
			item.setItemCode((String) availableItem[2]);
			Integer qty = (int) availableItem[3];
			Integer issuedQty = (int) availableItem[5];
			item.setAvailableQuantity((short) (qty - issuedQty));
			item.setSelectedQuantity((short) availableItem[4]);

			itemIds.add(item);
		}

		return itemIds;

	}

	// isssued_quantity<inv_quantity
	private List<QuantityCheckDto> checkQuantityValidationForTransfer(Integer id) {
		List<QuantityCheckDto> itemIds = new ArrayList<>();
		List<Object[]> availableItemList = stockTransferService.checkAvailableQuantityWithInventory(id);
		for (Object[] availableItem : availableItemList) {
			QuantityCheckDto item = new QuantityCheckDto();
			item.setItemId((String) availableItem[0]);
			item.setLotNumber((String) availableItem[1]);
			item.setItemCode((String) availableItem[2]);
			Integer qty = (int) availableItem[3];
			item.setAvailableQuantity(qty.shortValue());
			item.setSelectedQuantity((short) availableItem[4]);

			itemIds.add(item);
		}

		return itemIds;

	}

	// for TEP,GEP Issue
	private void getUpdateInventoryDetails(StockTransferDao stockTransfer, List<InventoryDetailsDaoExt> inv) {
		List<StockTransferDetailsDao> stds = stockTransferService.findAllStockTransferDetailsWithStatus(stockTransfer,
				StockTransferStatusEnum.SELECTED.toString());
		List<String> invIds = new ArrayList<>();

		if (!stds.isEmpty()) {
			for (StockTransferDetailsDao stransactionDetail : stds) {

				InventoryDetailsDaoExt inventoryDetail = (InventoryDetailsDaoExt) MapperUtil
						.getDtoMapping(stransactionDetail, InventoryDetailsDaoExt.class);

				inventoryDetail.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
				inventoryDetail.setTotalQuantity(stransactionDetail.getIssuedQuantity());
				inventoryDetail.setTotalWeight(stransactionDetail.getIssuedWeight());

				inventoryDetail.setId(stransactionDetail.getInventoryId());
				inventoryDetail.setSerialNumber(stransactionDetail.getIssuedWeight().toString());
				inventoryDetail.setOrgCode(stockTransfer.getOrgCode());
				inventoryDetail.setTotalValue(stransactionDetail.getIssuedValue());
				inv.add(inventoryDetail);

				invIds.add(stransactionDetail.getInventoryId());

			}
			List<InventoryDetailsDaoExt> invList = inventoryTransactionService.getInventoryDetailsByIdList(invIds);
			for (StockTransferDetailsDao stransactionDetail : stds) {
				for (InventoryDetailsDaoExt in : invList) {
					if (stransactionDetail.getInventoryId().equals(in.getId())) {
						// updating issued quantity alone, before datasync
						in.setIssuedQuantity(
								(short) (in.getIssuedQuantity() + stransactionDetail.getIssuedQuantity().shortValue()));
					}
				}

			}
			inventoryTransactionService.updateIssuedQuantity(invList);
		}

	}

	@Override
	public void updateAllStockIssueRequestItems(Integer id, String requestType,
			IssueStockItemBulkDto issueStockItemBulkDto) {
		stockRequestService.updateStockIssueRequestItems(id, requestType, issueStockItemBulkDto);

	}

	@Override
	@Transactional
	public ReceiveStockDto createStockIssue(String transferType) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		CountryDetailsDto countryDto = getCountryDetails(authUser.getLocationCode());
		BusinessDayDto businessDayDto = getBusinessDay(authUser.getLocationCode());
		StockTransferDao stockTransfer = new StockTransferDao();
		// check for any Stn is available in OPEN state if yes then return same..
		List<StockTransferDao> transferList = stockTransferService.findByTransferTypeAndStatusAndSrcLocationCode(
				transferType, StockTransferStatusEnum.OPEN.toString(), authUser.getLocationCode());
		if (transferList.isEmpty()) {
			stockTransfer.setCreatedBy(authUser.getUsername());
			stockTransfer.setCreatedDate(new Date());
			stockTransfer.setCurrencyCode(countryDto.getCurrencyCode());
			stockTransfer.setTransferType(transferType);
			stockTransfer.setOrgCode(CommonConstants.ORG_CODE);
			stockTransfer.setLastModifiedBy(authUser.getUsername());
			stockTransfer.setLastModifiedDate(new Date());
			stockTransfer.setSrcLocationCode(authUser.getLocationCode());
			stockTransfer.setStatus(StockTransferStatusEnum.OPEN.toString());
			stockTransfer.setTotalIssuedQuantity((short) 0);
			stockTransfer.setSrcDocDate(businessDayDto.getBusinessDate());
			stockTransfer.setPrints((short) 0);
			stockTransfer.setSrcFiscalYear(countryDto.getFiscalYear().shortValue());
			stockTransfer.setTotalIssuedValue(new BigDecimal(0));
			stockTransfer.setTotalIssuedWeight(new BigDecimal(0));
			stockTransfer.setWeightUnit(countryDto.getWeightUnit());
			if(transferType.equalsIgnoreCase(StockTransferTypeEnum.BTQ_BTQ.name())) {
				stockTransfer.setFilePublished(false);	
			}
		} else {
			stockTransfer = transferList.get(0);
		}
		StockTransferDao createdStockTransfer = stockTransferService.saveOrUpdateStockTransfer(stockTransfer);
		ReceiveStockDto transferDto = (ReceiveStockDto) MapperUtil.getDtoMapping(createdStockTransfer,
				ReceiveStockDto.class);
		return createTransferDtoResponse(transferDto, createdStockTransfer);
	}

	private ReceiveStockDto createTransferDtoResponse(ReceiveStockDto transferDto, StockTransferDao stockTransfer) {
		transferDto.setTotalAvailableQuantity(stockTransfer.getTotalIssuedQuantity());
		transferDto.setTotalMeasuredQuantity(stockTransfer.getTotalIssuedQuantity());
		transferDto.setTotalAvailableWeight(stockTransfer.getTotalIssuedWeight());
		transferDto.setTotalMeasuredWeight(stockTransfer.getTotalIssuedWeight());
		transferDto.setTotalAvailableValue(stockTransfer.getTotalIssuedValue());
		transferDto.setTotalMeasuredValue(stockTransfer.getTotalIssuedValue());
		return transferDto;
	}

	@Transactional
	@Override
	public void createStockIssueItems(Integer id, String transferType, StockIssueItemDto stockIssueItemDto) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		BigDecimal tax = BigDecimal.ZERO;
		Optional<StockTransferDao> stockTransfers = stockTransferService.findByIdAndTransferType(id, transferType);
		if (!stockTransfers.isPresent()) {
			throw new ServiceException(RECORD_S_NOT_FOUND, ERR_INV_029);
		}
		StockTransferDao stockTransfer = stockTransfers.get();
		if (!stockTransfer.getStatus().equalsIgnoreCase("OPEN")) {
			throw new ServiceException("No items in " + StockIssueTransferTypeStatusEnum.OPEN.toString() + " status",
					ERR_INV_029);
		}
		List<StockTransferDetailsDao> itemsToSave = new ArrayList<>();
		Map<String, BigDecimal> total = new HashMap<>();
		if (!stockIssueItemDto.getStockItems().isEmpty()) {

			List<String> inventortIds = stockIssueItemDto.getStockItems().stream().map(StockItemsDto::getInventoryId)
					.collect(Collectors.toList());
			List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
					.getInventoryDetailsByIdList(inventortIds);
			Map<String, InventoryDetailsDaoExt> inventoryDetailsMap = inventoryDetailsList.stream()
					.collect(Collectors.toMap(InventoryDetailsDaoExt::getId, invDetails -> invDetails));

			total = updateMultiStockIssueItem(stockIssueItemDto, authUser, tax, stockTransfer, itemsToSave,
					inventoryDetailsMap);
		} else if (stockIssueItemDto.getStockItems().isEmpty()) {
			// bulk create items for TEP,GEP and others
			total = updateAllStockIssueItems(id, transferType, authUser, stockTransfer, itemsToSave);
		}
		stockTransferService.saveAll(itemsToSave);
		updateTotalValues(total.get(TOTAL_QUANTITY).shortValue(), total.get(TOTAL_WEIGHT), total.get(TOTAL_VALUE), id);
	}

	// will update isssued and receive
	private void updateTotalValues(Short totalQuantity, BigDecimal totalWeight, BigDecimal totalValue, Integer id) {
		// verification if id is in OPEN state??
		// need to update total issued value,qiuantity,weight
		stockTransferService.updateTotalValues(totalQuantity, totalWeight, totalValue, id);

	}

	private Map<String, BigDecimal> updateMultiStockIssueItem(StockIssueItemDto stockIssueItemDto, AuthUser authUser,
			BigDecimal tax, StockTransferDao stockTransfer, List<StockTransferDetailsDao> itemsToSave,
			Map<String, InventoryDetailsDaoExt> inventoryDetailsMap) {
		LocationResponseDto locationDetails = engineClient.getBoutiqueLocationDetails();
		LOGGER.info("tax {}", tax);
		Integer totalQuantity = 0;
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		List<StockItemsDto> items;
		items = stockIssueItemDto.getStockItems();
		for (StockItemsDto item : items) {
			// if id is there not allow again to add
			InventoryDetailsDaoExt inventoryDetail;
			if (inventoryDetailsMap.containsKey(item.getInventoryId())) {
				inventoryDetail = inventoryDetailsMap.get(item.getInventoryId());
			} else {
				throw new ServiceException("Item Not avaliable any more", ERR_INV_029);
			}

			if (inventoryDetail == null)
				throw new ServiceException("RECORDS_NOT_FOUND", ERR_INV_029);
			if (!inventoryDetail.getLocationCode().equalsIgnoreCase(authUser.getLocationCode())) {
				throw new ServiceException("NO_ITEM_WITH_ID " + item.getInventoryId() + "EXIST", ERR_INV_029);
				// no inventory id
			}

			if (!inventoryDetail.getLocationCode().equalsIgnoreCase(authUser.getLocationCode())) {
				throw new ServiceException("NO_ITEM_WITH_ID " + item.getInventoryId() + "EXIST", ERR_INV_029);
			}
			StockTransferDetailsDao stockTransferDetails = (StockTransferDetailsDao) MapperUtil
					.getDtoMapping(inventoryDetail, StockTransferDetailsDao.class);

			stockTransferDetails.setInventoryId(inventoryDetail.getId());

			stockTransferDetails.setItemDetails(inventoryDetail.getItemDetails());

			stockTransferDetails.setIssuedQuantity(
					(short) (inventoryDetail.getTotalQuantity() - inventoryDetail.getIssuedQuantity()));
			stockTransferDetails.setIssuedValue(inventoryDetail.getTotalValue());
			stockTransferDetails.setIssuedWeight(inventoryDetail.getTotalWeight());

			stockTransferDetails.setCreatedBy(authUser.getUsername());
			stockTransferDetails.setLastModifiedBy(authUser.getUsername());
			stockTransferDetails.setCreatedDate(new Date());
			stockTransferDetails.setLastModifiedDate(new Date());
			stockTransferDetails.setStdWeight(inventoryDetail.getStdWeight());
			stockTransferDetails.setStdValue(inventoryDetail.getStdValue());

			stockTransferDetails.setReceivedQuantity(
					(short) (inventoryDetail.getTotalQuantity() - inventoryDetail.getIssuedQuantity()));
			stockTransferDetails.setReceivedValue(inventoryDetail.getTotalValue());
			stockTransferDetails.setReceivedWeight(inventoryDetail.getTotalWeight());

			stockTransferDetails.setStatus(StockTransferStatusEnum.SELECTED.toString());
			stockTransferDetails.setStockTransfer(stockTransfer);

			// call for weightDetails calculation

			stockTransferDetails.setIssuedWeightDetails(inventoryDetail.getTotalWeightDetails());
			stockTransferDetails.setReceivedWeightDetails(inventoryDetail.getTotalWeightDetails());

			// copy the columns from inventryDetails into stockTransferDetails
			stockTransferDetails.setRefDocDate(inventoryDetail.getStockInwardDate());
			stockTransferDetails.setRefDocNumber(inventoryDetail.getDocNumber());
			stockTransferDetails.setRefDocType(inventoryDetail.getDocType());
			stockTransferDetails.setRefFiscalYear(inventoryDetail.getFiscalYear());
			stockTransferDetails.setKarat(inventoryDetail.getKarat());
			saveTaxDetailsInStockTransfer(stockTransferDetails, inventoryDetail.getItemCode(),
					inventoryDetail.getStdValue(), stockTransfer.getTransferType(), locationDetails);
			itemsToSave.add(stockTransferDetails);

			// update parent
			totalQuantity = totalQuantity + stockTransferDetails.getIssuedQuantity();
			totalWeight = totalWeight.add(stockTransferDetails.getIssuedWeight());
			// updated value including TAX
			totalValue = totalValue.add(stockTransferDetails.getFinalValue());
		}
		Map<String, BigDecimal> data = new HashMap<>();
		data.put(TOTAL_QUANTITY, BigDecimal.valueOf(totalQuantity));
		data.put(TOTAL_WEIGHT, totalWeight);
		data.put(TOTAL_VALUE, totalValue);
		return data;

	}

	private void saveTaxDetailsInStockTransfer(StockTransferDetailsDao stockTransferDetails, String itemCode,
			BigDecimal stdValue, String transferType, LocationResponseDto locationDetails) {
		TaxCalculationResponseDto taxDetailsResponse = null;
		if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_GOLD_COIN.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.GEP.toString())
						&& !StringUtils.isEmpty(itemCode)) {
			taxDetailsResponse = engineClient.getTaxDetails(locationDetails.getFactoryDetails().getLocationCode(), 0,
					null, TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE_TEP_GEP.name(), itemCode, false, null);
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_CFA.toString())
				&& !StringUtils.isEmpty(itemCode)) {
			taxDetailsResponse = engineClient.getTaxDetails(locationDetails.getCfaDetails().getLocationCode(), 0, null,
					TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.name(), itemCode, false, null);
		} else if ((transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.DEFECTIVE.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_BTQ.toString()))
				&& !StringUtils.isEmpty(itemCode)) {
			taxDetailsResponse = engineClient.getTaxDetails(locationDetails.getFactoryDetails().getLocationCode(), 0,
					null, TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.name(), itemCode, false, null);
		}

		Map<String, BigDecimal> taxDetails = new HashMap<>();
		Map<String, TaxDetailDto> data = new HashMap<>();
		TaxDetailDto sgstDetails = null;
		if (taxDetailsResponse != null) {
			data = taxDetailsResponse.getData();
			if (!CollectionUtils.isEmpty(data)) {
				if (data.get("SGST") != null) {
					sgstDetails = data.get("SGST");
					if (sgstDetails.getTaxPercentage() != null) {
						taxDetails.put("SGSTVal", stdValue.multiply(sgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
								.setScale(2, RoundingMode.HALF_UP));
						taxDetails.put("SGSTPct", sgstDetails.getTaxPercentage());
					}
				} else {
					taxDetails.put("SGSTVal", BigDecimal.ZERO);
					taxDetails.put("SGSTPct", BigDecimal.ZERO);

				}
				if (data.get("UTGST") != null) {
					TaxDetailDto utgstDetails = data.get("UTGST");
					if (utgstDetails != null) {
						if (utgstDetails.getTaxPercentage() != null) {
							taxDetails.put("UTGSTVal",
									stdValue.multiply(utgstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2,
											RoundingMode.HALF_UP));
							taxDetails.put("UTSTPct", utgstDetails.getTaxPercentage());
						}
					}
				} else {
					taxDetails.put("UTGSTVal", BigDecimal.ZERO);
					taxDetails.put("UTSTPct", BigDecimal.ZERO);

				}
				if (data.get("CGST") != null) {
					TaxDetailDto cgstDetails = data.get("CGST");
					if (cgstDetails.getTaxPercentage() != null) {
						taxDetails.put("CGSTVal", stdValue.multiply(cgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
								.setScale(2, RoundingMode.HALF_UP));
						taxDetails.put("CGSTPct", cgstDetails.getTaxPercentage());
					}
				} else {
					taxDetails.put("CGSTVal", BigDecimal.ZERO);
					taxDetails.put("CGSTPct", BigDecimal.ZERO);

				}
				if (data.get("IGST") != null) {
					TaxDetailDto igstDetails = data.get("IGST");
					if (igstDetails != null) {
						if (igstDetails.getTaxPercentage() != null) {
							taxDetails.put("IGSTVal",
									stdValue.multiply(igstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2,
											RoundingMode.HALF_UP));
							taxDetails.put("IGSTPct", igstDetails.getTaxPercentage());
						}
					}
				} else {
					taxDetails.put("IGSTVal", BigDecimal.ZERO);
					taxDetails.put("IGSTPct", BigDecimal.ZERO);

				}
			}
		}
		Map<String, Object> issueStockTaxDetails = new LinkedHashMap<>();
		issueStockTaxDetails.put("type", "TAX_DETAILS");
		issueStockTaxDetails.put("data", taxDetails);
		stockTransferDetails.setTaxDetails(MapperUtil.getStringFromJson(issueStockTaxDetails).replace("\\", "")
				.replace("\"[", "[").replace("]\"", "]"));
		JsonObject taxValueDetails = new JsonParser().parse(stockTransferDetails.getTaxDetails()).getAsJsonObject();
		BigDecimal igstVal = taxValueDetails.getAsJsonObject("data").get("IGSTVal").getAsBigDecimal();
		BigDecimal cgstVal = taxValueDetails.getAsJsonObject("data").get("CGSTVal").getAsBigDecimal();
		BigDecimal sgstVal = taxValueDetails.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
		BigDecimal utgstVal = taxValueDetails.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();
		BigDecimal finalTax = igstVal.add(cgstVal).add(sgstVal).add(utgstVal);
		stockTransferDetails.setTotalTax(finalTax.multiply(new BigDecimal(stockTransferDetails.getIssuedQuantity()))
				.setScale(2, RoundingMode.HALF_UP));
		stockTransferDetails.setFinalValue(stockTransferDetails.getIssuedValue().add(stockTransferDetails.getTotalTax())
				.setScale(2, RoundingMode.HALF_UP));
	}

	private Map<String, BigDecimal> updateAllStockIssueItems(Integer id, String transferType, AuthUser authUser,
			StockTransferDao stockTransfer, List<StockTransferDetailsDao> itemsToSave) {
		LocationResponseDto locationDetails = engineClient.getBoutiqueLocationDetails();
		List<String> binGroupCode = new ArrayList<>();
		BigDecimal totalWeight = BigDecimal.ZERO;
		Integer totalQuantity = 0;
		BigDecimal totalValue = BigDecimal.ZERO;
		List<String> productGroup = null;
		Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.unsorted());
		List<InventoryDetailsDaoExt> inventoryList;
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		Map<String, String> productGroupMap;
		if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())) {
			binGroupCode.add(L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Plain CFA's
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			productGroup = getListProductGroup(productGroupMap);

		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())) {
			binGroupCode.add(L1BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.S.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroup = getListProductGroup(productGroupMap);
		} else if (transferType.equalsIgnoreCase(ReturnInvoiceType.BTQ_CFA.toString())) {
			if (productGroup == null)
				productGroup = null;
			binGroupCode = new ArrayList<>();
			binGroupCode.add(BinGroupEnum.DEFECTIVE.toString());
			binGroupCode.add(BinGroupEnum.DISPUTE.toString());
			binGroupCode.add(BinGroupEnum.STN.toString());

		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.DEFECTIVE.toString())) {
			if (productGroup == null)
				productGroup = null;
			binGroupCode = new ArrayList<>();
			binGroupCode.add(BinGroupEnum.DEFECTIVE.toString());
			binGroupCode.add(BinGroupEnum.DISPUTE.toString());
			binGroupCode.add(BinGroupEnum.HALLMARKDISPUTEBIN.toString());
		}else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_BTQ.toString())) {
			if (productGroup == null)
				productGroup = null;
			binGroupCode = new ArrayList<>();
			binGroupCode.add(BinGroupEnum.STN.toString());
		}

		else {
			binGroupCode.add(transferType);
		}

		// items should not be deleted instead other than existing items should be
		// added.
		// to add only those items which are not in SELECTED status
		List<Object[]> listAvailableItems;

		if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.DEFECTIVE.toString())) {
			listAvailableItems = stockTransferService.getJointListForDefective(id, binGroupCode, productGroup,
					ReturnInvoiceStatus.OPEN.toString(), null, null,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), null, null, null, null,
					businessDayDto.getBusinessDate(), pageable.getPageSize() * pageable.getPageNumber(),
					pageable.getPageSize());
		} else {
			listAvailableItems = stockTransferService.getJointList(id, binGroupCode, productGroup,
					ReturnInvoiceStatus.OPEN.toString(), null, null,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), null, null, null, null,
					businessDayDto.getBusinessDate(), pageable.getPageSize() * pageable.getPageNumber(),
					pageable.getPageSize());
		}

		List<String> inventoryIds = getOpenItemInventoryList(listAvailableItems);
		inventoryList = inventoryDetailsService.getInventoryDetailsByIdList(inventoryIds);

		for (InventoryDetailsDaoExt inventoryDetail : inventoryList) {

			StockTransferDetailsDao stockTransferDetails = (StockTransferDetailsDao) MapperUtil
					.getDtoMapping(inventoryDetail, StockTransferDetailsDao.class);
			stockTransferDetails.setInventoryId(inventoryDetail.getId());
			if (inventoryDetail.getTotalQuantity() == null) {
				throw new ServiceException("improper DB", ERR_INV_014);
			} else {
				stockTransferDetails.setIssuedQuantity(
						(short) (inventoryDetail.getTotalQuantity() - inventoryDetail.getIssuedQuantity()));
			}

			// need to implement for net value:
			// totalValue-itemLevel discount
			stockTransferDetails.setItemDetails(inventoryDetail.getItemDetails());
			stockTransferDetails.setCreatedBy(authUser.getUsername());
			stockTransferDetails.setLastModifiedBy(authUser.getUsername());
			stockTransferDetails.setCreatedDate(new Date());
			stockTransferDetails.setLastModifiedDate(new Date());
			stockTransferDetails.setStdWeight(inventoryDetail.getStdWeight());
			stockTransferDetails.setStdValue(inventoryDetail.getStdValue());

			stockTransferDetails.setIssuedQuantity(
					(short) (inventoryDetail.getTotalQuantity() - inventoryDetail.getIssuedQuantity()));
			stockTransferDetails.setIssuedValue(inventoryDetail.getTotalValue());
			stockTransferDetails.setIssuedWeight(inventoryDetail.getTotalWeight());

			stockTransferDetails.setReceivedQuantity(
					(short) (inventoryDetail.getTotalQuantity() - inventoryDetail.getIssuedQuantity()));

			stockTransferDetails.setReceivedValue(inventoryDetail.getTotalValue());
			stockTransferDetails.setReceivedWeight(inventoryDetail.getTotalWeight());

			stockTransferDetails.setStockTransfer(stockTransfer);
			
			// copy the columns from inventryDetails into stockTransferDetails
			stockTransferDetails.setRefDocDate(inventoryDetail.getStockInwardDate());
			stockTransferDetails.setRefDocNumber(inventoryDetail.getDocNumber());
			stockTransferDetails.setRefDocType(inventoryDetail.getDocType());
			stockTransferDetails.setRefFiscalYear(inventoryDetail.getFiscalYear());
			// reduce totalQuantity of inventorydetails
			stockTransferDetails.setStatus(StockTransferStatusEnum.SELECTED.name());
			stockTransferDetails.setIssuedWeightDetails(inventoryDetail.getTotalWeightDetails());
			stockTransferDetails.setKarat(inventoryDetail.getKarat());
			saveTaxDetailsInStockTransfer(stockTransferDetails, inventoryDetail.getItemCode(),
					inventoryDetail.getStdValue(), transferType, locationDetails);
			itemsToSave.add(stockTransferDetails);
			// update parent
			totalQuantity = totalQuantity + stockTransferDetails.getIssuedQuantity();
			totalWeight = totalWeight.add(stockTransferDetails.getStdWeight());
			totalValue = totalValue.add(stockTransferDetails.getFinalValue());
		}
		Map<String, BigDecimal> data = new HashMap<>();
		data.put(TOTAL_QUANTITY, BigDecimal.valueOf(totalQuantity));
		data.put(TOTAL_WEIGHT, totalWeight);
		data.put(TOTAL_VALUE, totalValue);
		return data;
	}

	private List<String> getOpenItemInventoryList(List<Object[]> listAvailableItems) {
		List<String> listProductDtls = new ArrayList<>();
		for (Object[] l : listAvailableItems) {
			listProductDtls.add((String) l[0]);

		}
		return listProductDtls;
	}

	@Override
	@Transactional
	public void removeStockIssue(Integer id, RemoveStockItemsDto removeStockItemDto, String transferType) {
		if (removeStockItemDto.getItemIds().isEmpty()) {
			Optional<StockTransferDao> stockTransfer = stockTransferService.getStockTransferById(id);
			if (stockTransfer.isPresent()) {
				StockTransferDao st = stockTransfer.get();
				List<StockTransferDetailsDao> stockTransferDetailsList = stockTransferService
						.findAllStockTransferDetails(stockTransfer.get());
				stockTransferService.deleteInBatch(stockTransferDetailsList);
				st.setTotalIssuedWeight(BigDecimal.ZERO);
				st.setTotalIssuedValue(BigDecimal.ZERO);
				st.setTotalIssuedQuantity((short) 0);
				stockTransferService.saveOrUpdateStockTransfer(st);
			}
		} else {
			BigDecimal totalWeight = BigDecimal.ZERO;
			BigDecimal totalValue = BigDecimal.ZERO;
			Short totalQuantity = 0;
			// if item id is available
			List<StockTransferDetailsDao> stockTransferDetails = stockTransferService
					.findAllTransferDetailsByItemIds(removeStockItemDto.getItemIds());
			for (StockTransferDetailsDao stocktransferDetail : stockTransferDetails) {
				totalWeight = totalWeight.add(stocktransferDetail.getIssuedWeight());
				totalValue = totalValue.add(new BigDecimal(stocktransferDetail.getFinalValue().toString()));
				totalQuantity = (short) (totalQuantity + stocktransferDetail.getIssuedQuantity());
			}
			stockTransferService.deleteInBatch(stockTransferDetails);
			StockTransferDao st = stockTransferService.getOne(id);
			totalWeight = st.getTotalIssuedWeight().subtract(totalWeight);
			totalValue = st.getTotalIssuedValue().subtract(totalValue);
			totalQuantity = (short) (st.getTotalIssuedQuantity() - totalQuantity);
			st.setTotalIssuedWeight(totalWeight);
			st.setTotalIssuedValue(totalValue);
			st.setTotalIssuedQuantity(totalQuantity);
			stockTransferService.saveOrUpdateStockTransfer(st);
		}
	}

	@Override
	@Transactional
	public RequestStockItemResponseDto updateStockRequestItem(Integer id, String itemId, String requestType,
			IssueStockItemUpdateDto issueStockItemUpdateDto) {
		RequestStockItemResponseDto requestStockItemDto;

		Optional<StockRequestDetailsDao> stockRequestDetails = stockRequestService.findStockRequestDetailsById(itemId);
		if (stockRequestDetails.isPresent()
				&& stockRequestDetails.get().getStatus().equals(StockRequestStatusEnum.SELECTED.toString())) {
			requestStockItemDto = updateStockRequestItem(itemId, issueStockItemUpdateDto, stockRequestDetails);
		} else {
			throw new ServiceException("the followwing item is not in SELECTED status so Weight cannot be edited",
					"the followwing item is not in SELECTED status so Weight cannot be edited");
		}
		return requestStockItemDto;
	}

	private RequestStockItemResponseDto updateStockRequestItem(String itemId,
			IssueStockItemUpdateDto issueStockItemUpdateDto, Optional<StockRequestDetailsDao> stockRequestDetails) {
		RequestStockItemResponseDto requestStockItemDto;
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		ObjectMapper objectMapper = MapperUtil.getObjectMapperInstance();
		validateStockRequestItems(itemId, issueStockItemUpdateDto, stockRequestDetails);
		short minQunatity = validateForMinQuantity(issueStockItemUpdateDto, stockRequestDetails.get());
		// check the available quantity in inventory
		Optional<InventoryDetailsDaoExt> inventoryDetails = inventoryDetailsService
				.findById(issueStockItemUpdateDto.getInventoryId());

		// if quantity is more than inventory quantity then throw exception
		if (inventoryDetails.isPresent() && (short) (inventoryDetails.get().getTotalQuantity()
				- inventoryDetails.get().getIssuedQuantity()) < issueStockItemUpdateDto.getMeasuredQuantity()) {
			throw new ServiceException("Item quantity can not be more than available quantity", ERR_INV_017);
		}
		if (inventoryDetails.isPresent()) {
			// check for weight tolerance
			// if measured weight is greater than weight tolerance then throw exception
			// checkWeightTolerance method will throw exception in case measured weight is
			// greater than weight tolerance
			// params are location code,product group code,available weight/inventory
			// weight,measured
			// weight,available qty/inventory qty & measured qty

			engineService.checkWeightToleranceValue(stockRequestDetails.get().getProductGroup(),
					inventoryDetails.get().getTotalWeight(), issueStockItemUpdateDto.getMeasuredWeight(),
					(short) (inventoryDetails.get().getTotalQuantity() - inventoryDetails.get().getIssuedQuantity()),
					issueStockItemUpdateDto.getMeasuredQuantity());

			// if quantity is more than 0
			if (minQunatity >= 0) {
				updateStockRequest(issueStockItemUpdateDto, stockRequestDetails.get(), inventoryDetails.get());
			}
			requestStockItemDto = getRequestStockItemDto(issueStockItemUpdateDto, stockRequestDetails.get(),
					productGroupList, productCategoryList, objectMapper, inventoryDetails.get());
		} else {
			throw new ServiceException("Cannot find Item in the Inventory", "Cannot find Item in the Inventory");
		}
		return requestStockItemDto;
	}

	private short validateForMinQuantity(IssueStockItemUpdateDto issueStockItemUpdateDto,
			StockRequestDetailsDao stockRequestDetails) {
		short minQunatity = 0;
		minQunatity = (short) (stockRequestDetails.getApprovedQuantity()
				- issueStockItemUpdateDto.getMeasuredQuantity());
		if (minQunatity < 0) {
			throw new ServiceException("Measured quantity cannot be more than available quantity", ERR_INV_017);
		}
		return minQunatity;
	}

	private void updateStockRequest(IssueStockItemUpdateDto issueStockItemUpdateDto,
			StockRequestDetailsDao stockRequestDetails, InventoryDetailsDaoExt inventoryDetailsDaoExt) {
		stockRequestDetails.setSelectedQuantity(issueStockItemUpdateDto.getMeasuredQuantity());
		stockRequestDetails.setSelectedWeight(issueStockItemUpdateDto.getMeasuredWeight());

		// call for weightDetails calculation
		if (stockRequestDetails.getSelectedWeightDetails() != null) {

			stockRequestDetails.setSelectedWeightDetails(WeightUtil.calculateWeightDetails(
					inventoryDetailsDaoExt.getTotalWeight()
							.divide(BigDecimal.valueOf(inventoryDetailsDaoExt.getTotalQuantity())),
					stockRequestDetails.getRequestedWeightDetails(), issueStockItemUpdateDto.getMeasuredWeight()
							.divide(BigDecimal.valueOf(issueStockItemUpdateDto.getMeasuredQuantity()))));
		} else {
			stockRequestDetails.setSelectedWeightDetails(stockRequestDetails.getRequestedWeightDetails());
		}

		// Header level update for Box details calculation:

		// Update Header Level according to the populated minValues.
		// issued value field is not available so not updating.
		stockRequestService.updateHeaderValuesStockIssue(stockRequestDetails.getStockRequest().getId());
	}

	private RequestStockItemResponseDto getRequestStockItemDto(IssueStockItemUpdateDto issueStockItemUpdateDto,
			StockRequestDetailsDao stockRequestDetails, Map<String, String> productGroupList,
			Map<String, String> productCategoryList, ObjectMapper objectMapper,
			InventoryDetailsDaoExt inventoryDetailsDaoExt) {
		RequestStockItemResponseDto requestStockItemDto;
		BigDecimal availableWeight;
		StockRequestDetailsDao stRequestDetails = stockRequestService.save(stockRequestDetails);
		requestStockItemDto = (RequestStockItemResponseDto) MapperUtil.getDtoMapping(stRequestDetails,
				RequestStockItemResponseDto.class);

		requestStockItemDto.setItemDetails(MapperUtil.getStringFromJson(
				objectMapper.convertValue(MapperUtil.getJsonFromString(stRequestDetails.getItemDetails()), Map.class)));

		requestStockItemDto.setImageURL(new URLUtil().getImageUrlByItemCode(stRequestDetails.getItemCode()));

		// min of inv and (apprvd-issued qty)
		requestStockItemDto.setAvailableQuantity((short) Math.min(inventoryDetailsDaoExt.getTotalQuantity(),
				(short) (stRequestDetails.getApprovedQuantity() - stRequestDetails.getIssuedQuantity())));
		short quantity = (short) Math.min(inventoryDetailsDaoExt.getTotalQuantity(),
				(short) (stRequestDetails.getApprovedQuantity() - stRequestDetails.getIssuedQuantity()));

		// min(Inve, appweight((requestWeight/reqqty))-issued)
		// weight and quantity should be initialize with 0
		if (stRequestDetails.getIssuedWeight() == null) {
			// if item is not issued yet.
			// (requested weight/requested qty) * approved qty.
			availableWeight = stRequestDetails.getRequestedWeight()
					.divide(BigDecimal.valueOf(stRequestDetails.getRequestedQuantity()), MathContext.DECIMAL32);
			availableWeight = availableWeight.multiply(BigDecimal.valueOf(stRequestDetails.getApprovedQuantity()));
			requestStockItemDto.setAvailableWeight(availableWeight);
		} else {
			// if issued weight is not null then quantity should be (requested
			// weight/requested quantity) *(approved quantity-issued quantity)
			availableWeight = stRequestDetails.getRequestedWeight()
					.divide(BigDecimal.valueOf(stRequestDetails.getRequestedQuantity()), MathContext.DECIMAL32);
			short availableQty = (short) (stRequestDetails.getApprovedQuantity()
					- stRequestDetails.getIssuedQuantity());
			availableWeight = availableWeight.multiply(BigDecimal.valueOf(availableQty));
			requestStockItemDto.setAvailableWeight(availableWeight);
		}
		requestStockItemDto.setMeasuredQuantity(issueStockItemUpdateDto.getMeasuredQuantity());
		requestStockItemDto.setMeasuredWeight(stRequestDetails.getSelectedWeight());
		requestStockItemDto.setInventoryId(inventoryDetailsDaoExt.getId());
		requestStockItemDto.setItemDetails(MapperUtil.getJsonFromString(stRequestDetails.getItemDetails()));
		requestStockItemDto.setAvailableValue(new BigDecimal(quantity).multiply(inventoryDetailsDaoExt.getStdValue()));
		requestStockItemDto.setMeasuredValue(new BigDecimal(issueStockItemUpdateDto.getMeasuredQuantity())
				.multiply(inventoryDetailsDaoExt.getStdValue()));
		requestStockItemDto.setProductCategory(stRequestDetails.getProductCategory());
		requestStockItemDto.setProductCategoryDesc(productCategoryList.get(stRequestDetails.getProductCategory()));
		requestStockItemDto.setProductGroup(stRequestDetails.getProductGroup());
		requestStockItemDto.setProductGroupDesc(productGroupList.get(stRequestDetails.getProductGroup()));
		return requestStockItemDto;
	}

	private void validateStockRequestItems(String itemId, IssueStockItemUpdateDto issueStockItemUpdateDto,
			Optional<StockRequestDetailsDao> stockRequestDetails) {
		if (!stockRequestDetails.isPresent()) {
			throw new ServiceException("No Item with id " + itemId + " exist", ERR_INV_029);
		}

		// if issued quantity is null then set to 0
		if (stockRequestDetails.get().getIssuedQuantity() == null) {
			stockRequestDetails.get().setIssuedQuantity((short) 0);
		}

		// if measured qty is more than available qty then throw exception
		if (issueStockItemUpdateDto.getMeasuredQuantity() > stockRequestDetails.get().getApprovedQuantity()
				- stockRequestDetails.get().getIssuedQuantity()) {
			throw new ServiceException("Issue item quantity can not be more than available quantity", ERR_INV_017);
		}

		// if status is ISSUED then throw exception
		if (stockRequestDetails.get().getStatus().equalsIgnoreCase(StockTransferStatusEnum.ISSUED.name())) {
			throw new ServiceException("Item is already issued", ERR_INV_013);
		}
	}

	@Override
	public PagedRestResponse<List<RequestStockItemResponseDto>> listStockRequestItems(Integer id, String requestType,
			String itemCode, List<String> productGroup, List<String> productCategory, String lotNumber,
			List<String> binCode, String binGroupCode, String status, Pageable pageable) {

		List<RequestStockItemResponseDto> stockRequestDetailsDtos = new ArrayList<>();

		// get stock request by id,request type & location code
		StockRequestDao stRequest = stockRequestService.findByIdAndRequestTypeAndSrcLocationCode(id, requestType,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		// get pageable object of stock request details and params are stock
		// request,request type,item code,product group,product category,lot
		// number,bincode & bin group code,status
		Page<StockRequestDetailsDao> stRequestDetailsPage = stockRequestService.listStockRequestItems(stRequest,
				requestType, itemCode, productGroup, productCategory, lotNumber, binCode, binGroupCode, status,
				pageable);

		// get list of inventory ids from stock request details
		List<String> inventortIds = stRequestDetailsPage.stream().map(StockRequestDetailsDao::getInventoryId)
				.collect(Collectors.toList());

		// get inventory details by inventory ids
		List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
				.getInventoryDetailsByIdList(inventortIds);

		Map<String, InventoryDetailsDaoExt> inventoryDetailsMap = inventoryDetailsList.stream()
				.collect(Collectors.toMap(InventoryDetailsDaoExt::getId, invDetails -> invDetails));
		LOGGER.debug("listItem - {}", stRequestDetailsPage.getContent());

		generateRequestStockItem(stRequestDetailsPage.getContent(), inventoryDetailsMap, stockRequestDetailsDtos);
		return new PagedRestResponse<>(stockRequestDetailsDtos, stRequestDetailsPage);
	}

	private void generateRequestStockItem(List<StockRequestDetailsDao> stRequestDetailsList,
			Map<String, InventoryDetailsDaoExt> inventoryDetailsMap,
			List<RequestStockItemResponseDto> stockRequestDetailsDtos) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		for (StockRequestDetailsDao stRequestDetails : stRequestDetailsList) {
			// convert stock request details to RequestStockItemResponseDto
			RequestStockItemResponseDto stockRequestDetailDto = (RequestStockItemResponseDto) MapperUtil
					.getDtoMapping(stRequestDetails, RequestStockItemResponseDto.class);
			stockRequestDetailDto.setInventoryId(stRequestDetails.getInventoryId());
			if (inventoryDetailsMap.get(stRequestDetails.getInventoryId()) != null) {

				// if no item is issued till
				stockRequestDetailDto.setAvailableQuantity(getAvailableQuantity(inventoryDetailsMap, stRequestDetails));
				// will be updated in the Approval controller acc. to approved quantity
				stockRequestDetailDto.setAvailableWeight(getAvailableWeight(stRequestDetails));

				// will be updated in the Approval controller acc. to approved quantity
				stockRequestDetailDto.setAvailableValue(stRequestDetails.getRequestedValue());

				stockRequestDetailDto.setAvailableValue(new BigDecimal(stockRequestDetailDto.getAvailableQuantity())
						.multiply(stRequestDetails.getStdValue()));
				if (stRequestDetails.getSelectedQuantity() == null) {
					stockRequestDetailDto.setMeasuredValue(new BigDecimal(stRequestDetails.getApprovedQuantity())
							.multiply(stRequestDetails.getStdValue()));
				} else {
					stockRequestDetailDto.setMeasuredValue(new BigDecimal(stRequestDetails.getSelectedQuantity())
							.multiply(stRequestDetails.getStdValue()));
				}

				stockRequestDetailDto.setMeasuredWeight(stRequestDetails.getSelectedWeight());
				stockRequestDetailDto.setMeasuredQuantity(stRequestDetails.getSelectedQuantity());

			} else {
				stockRequestDetailDto.setAvailableQuantity((short) 0);
			}
			stockRequestDetailDto.setItemDetails(MapperUtil.getJsonFromString(stRequestDetails.getItemDetails()));
			stockRequestDetailDto.setImageURL(new URLUtil().getImageUrlByItemCode(stRequestDetails.getItemCode()));

			stockRequestDetailDto.setProductCategory(stRequestDetails.getProductCategory());
			stockRequestDetailDto
					.setProductCategoryDesc(productCategoryList.get(stRequestDetails.getProductCategory()));
			stockRequestDetailDto.setProductGroup(stRequestDetails.getProductGroup());
			stockRequestDetailDto.setProductGroupDesc(productGroupList.get(stRequestDetails.getProductGroup()));
			setissueStockTaxDetails(stockRequestDetailDto, stRequestDetails); // set tax Details part for IBT
			if (!inventoryDetailsMap.isEmpty() && inventoryDetailsMap.get(stRequestDetails.getInventoryId()) != null) {
				stockRequestDetailDto
						.setIsHallmarked(inventoryDetailsMap.get(stRequestDetails.getInventoryId()).getIsHallmarked());
			}
			stockRequestDetailsDtos.add(stockRequestDetailDto);
		}

	}

	private void setissueStockTaxDetails(RequestStockItemResponseDto stockRequestDetailDto,
			StockRequestDetailsDao stRequestDetails) {

		TaxCalculationResponseDto taxDetailsResponse = engineClient.getTaxDetails(
				stRequestDetails.getStockRequest().getDestLocationCode(), 0, null,
				TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.name(), stRequestDetails.getItemCode(), false, null);

		Map<String, BigDecimal> taxDetails = new HashMap<>();
		Map<String, TaxDetailDto> data = new HashMap<>();
		TaxDetailDto sgstDetails = null;
		if (taxDetailsResponse != null) {
			data = taxDetailsResponse.getData();
			if (!CollectionUtils.isEmpty(data)) {
				if (data.get("SGST") != null) {
					sgstDetails = data.get("SGST");
					if (sgstDetails.getTaxPercentage() != null) {
						taxDetails.put("SGSTVal", stRequestDetails.getStdValue()
								.multiply(sgstDetails.getTaxPercentage().divide(ONE_HUNDRED)));
						taxDetails.put("SGSTPct", sgstDetails.getTaxPercentage());
					}
				} else {
					taxDetails.put("SGSTVal", BigDecimal.ZERO);
					taxDetails.put("SGSTPct", BigDecimal.ZERO);

				}
				if (data.get("UTGST") != null) {
					TaxDetailDto utgstDetails = data.get("UTGST");
					if (utgstDetails != null) {
						if (utgstDetails.getTaxPercentage() != null) {
							taxDetails.put("UTGSTVal", stRequestDetails.getStdValue()
									.multiply(utgstDetails.getTaxPercentage().divide(ONE_HUNDRED)));
							taxDetails.put("UTSTPct", utgstDetails.getTaxPercentage());
						}
					}
				} else {
					taxDetails.put("UTGSTVal", BigDecimal.ZERO);
					taxDetails.put("UTSTPct", BigDecimal.ZERO);

				}
				if (data.get("CGST") != null) {
					TaxDetailDto cgstDetails = data.get("CGST");
					if (cgstDetails.getTaxPercentage() != null) {
						taxDetails.put("CGSTVal", stRequestDetails.getStdValue()
								.multiply(cgstDetails.getTaxPercentage().divide(ONE_HUNDRED)));
						taxDetails.put("CGSTPct", cgstDetails.getTaxPercentage());
					}
				} else {
					taxDetails.put("CGSTVal", BigDecimal.ZERO);
					taxDetails.put("CGSTPct", BigDecimal.ZERO);

				}
				if (data.get("IGST") != null) {
					TaxDetailDto igstDetails = data.get("IGST");
					if (igstDetails != null) {
						if (igstDetails.getTaxPercentage() != null) {
							taxDetails.put("IGSTVal", stRequestDetails.getStdValue()
									.multiply(igstDetails.getTaxPercentage().divide(ONE_HUNDRED)));
							taxDetails.put("IGSTPct", igstDetails.getTaxPercentage());
						}
					}
				} else {
					taxDetails.put("IGSTVal", BigDecimal.ZERO);
					taxDetails.put("IGSTPct", BigDecimal.ZERO);

				}
			}
		}
		Map<String, Object> issueStockTaxDetails = new LinkedHashMap<>();
		issueStockTaxDetails.put("type", "TAX_DETAILS");
		issueStockTaxDetails.put("data", taxDetails);
		stockRequestDetailDto.setTaxDetails(MapperUtil.getJsonFromString(MapperUtil
				.getStringFromJson(issueStockTaxDetails).replace("\\", "").replace("\"[", "[").replace("]\"", "]")));
	}

	private BigDecimal getAvailableWeight(StockRequestDetailsDao stRequestDetails) {
		BigDecimal availableWeight;
		if (stRequestDetails.getIssuedWeight() == null) {
			// if item is not issued yet.
			// (requested weight/requested qty) * approved qty.
			availableWeight = stRequestDetails.getRequestedWeight()
					.divide(BigDecimal.valueOf(stRequestDetails.getRequestedQuantity()), MathContext.DECIMAL32);
			availableWeight = availableWeight.multiply(BigDecimal.valueOf(stRequestDetails.getApprovedQuantity()));
			return availableWeight;
		} else {
			// if issued weight is not null then quantity should be (requested
			// weight/requested quantity) *(approved quantity-issued quantity)
			availableWeight = stRequestDetails.getRequestedWeight()
					.divide(BigDecimal.valueOf(stRequestDetails.getRequestedQuantity()), MathContext.DECIMAL32);
			short availableQty = (short) (stRequestDetails.getApprovedQuantity()
					- stRequestDetails.getIssuedQuantity());
			availableWeight = availableWeight.multiply(BigDecimal.valueOf(availableQty));
			return availableWeight;
		}
	}

	private short getAvailableQuantity(Map<String, InventoryDetailsDaoExt> inventoryDetailsMap,
			StockRequestDetailsDao stRequestDetails) {
		short minQuantity;
		if (stRequestDetails.getIssuedQuantity() == null) {
			short qty = 0;
			minQuantity = (short) Math.min(
					inventoryDetailsMap.get(stRequestDetails.getInventoryId()).getTotalQuantity(),
					(short) (stRequestDetails.getApprovedQuantity() - qty));
		} else {
			// when some quantity is already issued ()
			minQuantity = (short) Math.min(
					inventoryDetailsMap.get(stRequestDetails.getInventoryId()).getTotalQuantity(),
					(short) (stRequestDetails.getApprovedQuantity() - stRequestDetails.getIssuedQuantity()));
		}
		return minQuantity;
	}

	@Override
	public ResponseEntity<Resource> getStockRequestIssuePDF(Integer id, String transferType) {
		List<InventoryChild> inventoryChildList = new ArrayList<>();
		Optional<StockTransferDao> stockTransfers = stockTransferService.findByIdAndTransferType(id, transferType);
		StockTransferDao stockTransfer;
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();

		BrandDto brandDto = engineService.getBrand(authUser.getBrandCode());

		if (stockTransfers.isPresent()) {
			stockTransfer = stockTransfers.get();
		} else {
			throw new ServiceException("improperId passed", "no data available");
		}
		Short printCount = InventoryUtil.checkPrintMaxConfig(brandDto, stockTransfer.getPrints());
		if (stockTransfer.getStatus().equals(StockIssueTransferTypeStatusEnum.ISSUED.toString())) {
			try {
				return getStockRequestIssuePrintContent(printCount, inventoryChildList, stockTransfer);
			} catch (Exception e) {
				throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
			}
		} else {
			throw new ServiceException("cannot print for non issued", "");
		}

	}

	private ResponseEntity<Resource> getStockRequestIssuePrintContent(Short printCount,
			List<InventoryChild> inventoryChildList, StockTransferDao stockTransfer)
			throws IOException, TemplateException {
		StockIssuePrintHeader stockReceiveStockDto;
		BigDecimal totalFinalValue = new BigDecimal(0);
		BigDecimal totalStdValue = new BigDecimal(0);
		BigDecimal totalStdWeight = new BigDecimal(0);
		String html = null;
		try {

			stockReceiveStockDto = (StockIssuePrintHeader) MapperUtil.getDtoMapping(stockTransfer,
					StockIssuePrintHeader.class);

			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("d/M/yyyy");
			stockReceiveStockDto.setSrcDate(simpleDateFormat.format(stockReceiveStockDto.getSrcDocDate()));
			List<StockTransferDetailsDao> stockTransferList = stockTransferService
					.findAllStockTransferDetails(stockTransfer);
			// stockReceiveStockDto.setCourierDetails(stockTransferList.get(0).getStockTransfer().getCarrierDetails());
			stockReceiveStockDto
					.setEinvoice(setEinvoiceByTxnId(stockTransfer.getId().toString(), stockTransfer.getTransferType()));
			stockReceiveStockDto.setTaxHeader("IGST");
			for (StockTransferDetailsDao stockTransferDetail : stockTransferList) {
				InventoryChild inventoryChild;
				inventoryChild = (InventoryChild) MapperUtil.getDtoMapping(stockTransferDetail, InventoryChild.class);
				ItemsDto itemDto = engineClient.getItemDetails(inventoryChild.getItemCode());
				JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(stockTransferDetail.getTaxDetails()), JsonData.class);

				BigDecimal itemTax = new BigDecimal(0);
				inventoryChild.setTaxValue(BigDecimal.ZERO);
				inventoryChild.setTaxPercentage(BigDecimal.ZERO);
				if (jsonData.getData() != null) {
					JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(jsonData.getData()))
							.getAsJsonObject();
					if (jsonObject != null) {
						if (jsonObject.get("SGSTVal") != null) {
							inventoryChild.setSgst(jsonObject.get("SGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							itemTax = itemTax.add(jsonObject.get("SGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							inventoryChild.setSgstPercentage(jsonObject.get("SGSTPct").getAsBigDecimal());

							if (jsonObject.get("SGSTVal").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
								stockReceiveStockDto.setTaxHeader("SGST");
								inventoryChild.setTaxValue(jsonObject.get("SGSTVal").getAsBigDecimal()
										.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
								inventoryChild.setTaxPercentage(jsonObject.get("SGSTPct").getAsBigDecimal());
							}
						} else {
							inventoryChild.setSgst(BigDecimal.ZERO);
							inventoryChild.setSgstPercentage(BigDecimal.ZERO);
						}
						if (jsonObject.get("UTGSTVal") != null) {
							inventoryChild.setUgst(jsonObject.get("UTGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							itemTax = itemTax.add(jsonObject.get("UTGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							if (jsonObject.get("UTGSTPct") != null)
								inventoryChild.setUtgstPercentage(jsonObject.get("UTGSTPct").getAsBigDecimal());
							else
								inventoryChild.setUtgstPercentage(jsonObject.get("UTSTPct").getAsBigDecimal());

							if (jsonObject.get("UTGSTVal").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
								stockReceiveStockDto.setTaxHeader("UTGST");
								inventoryChild.setTaxValue(jsonObject.get("UTGSTVal").getAsBigDecimal()
										.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
								if (jsonObject.get("UTGSTPct") != null)
									inventoryChild.setUtgstPercentage(jsonObject.get("UTGSTPct").getAsBigDecimal());
								else
									inventoryChild.setUtgstPercentage(jsonObject.get("UTSTPct").getAsBigDecimal());
							}
						} else {
							inventoryChild.setUgst(BigDecimal.ZERO);
							inventoryChild.setUtgstPercentage(BigDecimal.ZERO);
						}
						if (jsonObject.get("CGSTVal") != null) {
							inventoryChild.setCgst(jsonObject.get("CGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							itemTax = itemTax.add(jsonObject.get("CGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							inventoryChild.setCgstPercentage(jsonObject.get("CGSTPct").getAsBigDecimal());
						} else {
							inventoryChild.setCgst(BigDecimal.ZERO);
							inventoryChild.setCgstPercentage(BigDecimal.ZERO);
						}
						if (jsonObject.get("IGSTVal") != null) {
							inventoryChild.setIgst(jsonObject.get("IGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							itemTax = itemTax.add(jsonObject.get("IGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							inventoryChild.setIgstPercentage(jsonObject.get("IGSTPct").getAsBigDecimal());

							if (jsonObject.get("IGSTVal").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
								stockReceiveStockDto.setTaxHeader("IGST");
								inventoryChild.setTaxValue(jsonObject.get("IGSTVal").getAsBigDecimal()
										.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
								inventoryChild.setTaxPercentage(jsonObject.get("IGSTPct").getAsBigDecimal());
							}
						} else {
							inventoryChild.setIgst(BigDecimal.ZERO);
							inventoryChild.setIgstPercentage(BigDecimal.ZERO);
						}
						inventoryChild.setItemTax(itemTax);
					}
				} else {
					inventoryChild.setSgst(BigDecimal.ZERO);
					inventoryChild.setUgst(BigDecimal.ZERO);
					inventoryChild.setCgst(BigDecimal.ZERO);
					inventoryChild.setIgst(BigDecimal.ZERO);
					inventoryChild.setItemTax(BigDecimal.ZERO);
					inventoryChild.setIgstPercentage(BigDecimal.ZERO);
				}
				if (itemDto.getProductType() != null) {
					inventoryChild.setProductType(itemDto.getProductType());
				}
				inventoryChild.setHsnCode(itemDto.getHsnSacCode());
				if (inventoryChild.getFinalValue() != null) {
					totalFinalValue = totalFinalValue.add(inventoryChild.getFinalValue());
				} else {
					inventoryChild.setFinalValue(inventoryChild.getStdValue().add(itemTax));
					totalFinalValue = totalFinalValue.add(inventoryChild.getStdValue()).add(itemTax);
				}
				// System.out.println("The std value "+ inventoryChild.getStdValue());
				if (inventoryChild.getStdValue() != null) {
					totalStdValue = totalStdValue.add(inventoryChild.getStdValue());
					// System.out.println("total std value "+ totalStdValue);
				}

				totalStdWeight = totalStdWeight.add(inventoryChild.getStdWeight());

				inventoryChildList.add(inventoryChild);
			}
			totalFinalValue = totalFinalValue.setScale(0, RoundingMode.HALF_UP);
			stockReceiveStockDto.setTotalStdWeight(totalStdWeight);
			stockReceiveStockDto.setTotalFinalValue(totalFinalValue);
			stockReceiveStockDto.setTotalStdValue(totalStdValue);
			String totalPrice = "";
			String remarks = stockTransfer.getIssuedRemarks();
			
			ObjectMapper object = new ObjectMapper();
			String courierDataStr = stockTransfer.getCarrierDetails();
			JsonNode courierDataJsonNode = object.readValue(courierDataStr, JsonNode.class);
			JsonNode courierData = courierDataJsonNode.get("data");
			if ("courier".equalsIgnoreCase(courierDataJsonNode.get("type").asText())) {
				((ObjectNode) courierData).put("type", "courier");
			}

			if ("employee".equalsIgnoreCase(courierDataJsonNode.get("type").asText())) {
				((ObjectNode) courierData).put("type", "employee");
			}

			StringBuilder lockNumber = new StringBuilder();
			StringBuilder boxNumber = new StringBuilder();
			if (courierData.get("numberOfBoxes") != null && courierData.get("numberOfBoxes").asInt() > 0) {
				int numberOfBox = courierData.get("boxDetails").size();
				for (int numberOfBoxCounter = 0; numberOfBoxCounter < numberOfBox; numberOfBoxCounter++) {
					if (numberOfBoxCounter == 0) {
						lockNumber.append(
								courierData.get("boxDetails").get(numberOfBoxCounter).get("lockNumber").toString());
						boxNumber.append(
								courierData.get("boxDetails").get(numberOfBoxCounter).get("boxNumber").toString());
					} else {
						lockNumber.append(", "
								+ courierData.get("boxDetails").get(numberOfBoxCounter).get("lockNumber").toString());
						boxNumber.append(", "
								+ courierData.get("boxDetails").get(numberOfBoxCounter).get("boxNumber").toString());
					}
				}
				((ObjectNode) courierData).put("lockNumber", lockNumber.toString());
				((ObjectNode) courierData).put("boxNumber", boxNumber.toString());
			}

			InventoryPrint inventoryPrint = setInventoryPrintDetails(inventoryChildList, stockReceiveStockDto,
					totalPrice, remarks, courierData,
					lockNumber != null ? lockNumber.toString().replaceAll("\"", "") : "");
			stockReceiveStockDto.setTotalIssuedValueInWords(String.valueOf(totalFinalValue));
			if (stockTransfer.getCurrencyCode().equals(CommonConstants.CURRENCY_CODE))
				inventoryPrint.setCurrency("Rupees");
			switch (stockReceiveStockDto.getTransferType()) {
			case "BTQ_BTQ":
				inventoryPrint.setTxnTypeDetail("InterBotique Transfer");
				break;
			case "BTQ_FAC":
				inventoryPrint.setTxnTypeDetail("Factory to Botique Transfer");
				break;
			case "MER_BTQ":
				inventoryPrint.setTxnTypeDetail("Merchandise Transfer");
				break;
			case "BTQ_CFA":
				inventoryPrint.setTxnTypeDetail("Btq Cfa Transfer");
				break;
			default:
				break;
			}

			if (inventoryPrint.getTxnTypeDetail() != null
					&& inventoryPrint.getTxnTypeDetail().equalsIgnoreCase("Btq Cfa Transfer")) {
				inventoryPrint.setApprovalCode("Approved by Merchandise");
			} else {
				inventoryPrint.setApprovalCode("Approved by Factory ");
			}
			if (printCount > 1) {
				inventoryPrint.setDocument("DUPLICATE");
			} else {
				inventoryPrint.setDocument("ORIGINAL");
			}
			Template t = freemarkerConfig.getTemplate("stockIssue.ftl");
			inventoryService.nullCheckForMandatoryFields(inventoryPrint);
			html = FreeMarkerTemplateUtils.processTemplateIntoString(t, inventoryPrint);

			stockTransferService.updatePrintCountStockIssue(printCount, stockTransfer.getId());
		} catch (Exception i) {
			throw new ServiceException("Issue in PDF generation", "ERR-CORE-045", i.getMessage());
		}
		return generatePdf(html, stockReceiveStockDto.getTransferType(), stockReceiveStockDto.getId());// C:/TITAN/docs/

	}

	public ResponseEntity<Resource> generatePdf(String html, String type, Integer id) {

		String path = new StringBuilder().append("INVENTORY").append("/").append(CommonUtil.getLocationCode())
				.append("/") // CPD/
				.append(type).append("/") // CUSTOMER-MASTER-ID/
				.append(id) // TXN-ID/
				.append(".").append(FileExtensionEnum.PDF.getValue()) // GC_PRINTS.pdf
				.toString();
		return PrintUtil.printPdfAndSave(html, fileBasePath, path);

	}

	private InventoryPrint setInventoryPrintDetails(List<InventoryChild> inventoryChildList,
			StockIssuePrintHeader stockReceiveStockDto, String totalPrice, String remarks, JsonNode courierData,
			String lockNumber) {
		InventoryPrint inventoryPrint = new InventoryPrint();
		inventoryPrint.setStockIssuePrintHeader(stockReceiveStockDto);
		inventoryPrint.setInventoryChildList(inventoryChildList);
		inventoryPrint.setSrcLocationData(
				engineService.getLocationDetailWithTaxCode(stockReceiveStockDto.getSrcLocationCode()));
		inventoryPrint.setDestLocationData(
				engineService.getLocationDetailWithTaxCode(stockReceiveStockDto.getDestLocationCode()));
		inventoryPrint.setRemarks(remarks);
		inventoryPrint.setTotalPrice(totalPrice);
		inventoryPrint.setPriceInWords(InventoryUtil.printAmount(numberToWordsFactory.getPriceInWords(
				inventoryPrint.getStockIssuePrintHeader().getTotalFinalValue().longValue(),
				DomainConstants.ASIAN_PRICE_TYPE)));
		inventoryPrint.setCourierData(courierData);
		inventoryPrint.setLockNumber(lockNumber);
		return inventoryPrint;
	}

	@Override
	public ResponseEntity<Resource> getStockTransferIssuePDF(Integer id, String transferType) {
		List<InventoryChild> inventoryChildList = new ArrayList<>();

		Optional<StockTransferDao> stockTransfers = stockTransferService.findByIdAndTransferType(id, transferType);
		StockTransferDao stockTransfer;
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		if (stockTransfers.isPresent()) {
			stockTransfer = stockTransfers.get();
		} else {
			throw new ServiceException("improperId passed", "no data available");
		}
		BrandDto brandDto = engineService.getBrand(authUser.getBrandCode());
		Short printCount = InventoryUtil.checkPrintMaxConfig(brandDto, stockTransfer.getPrints());

		if (stockTransfer.getStatus().equals(StockIssueTransferTypeStatusEnum.ISSUED.toString())) {
			try {
				return getStockTransferIssuePDFPrintContent(printCount, inventoryChildList, stockTransfer);
			} catch (Exception e) {
				throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
			}
		} else {
			throw new ServiceException("cannot print for non issued", "ERR-CORE-055");
		}

	}

	private ResponseEntity<Resource> getStockTransferIssuePDFPrintContent(Short printCount,
			List<InventoryChild> inventoryChildList, StockTransferDao stockTransfer)
			throws IOException, TemplateException {
		StockIssuePrintHeader stockReceiveStockDto;
		String totalPrice = "";
		BigDecimal totalTax = BigDecimal.ZERO;
		BigDecimal totalFinalValue = BigDecimal.ZERO;
		BigDecimal totalStdValue = BigDecimal.ZERO;
		BigDecimal totalStdWeight = BigDecimal.ZERO;
		BigDecimal totalDiscount = BigDecimal.ZERO;
		BigDecimal totalIssuedValue = BigDecimal.ZERO;
		stockReceiveStockDto = (StockIssuePrintHeader) MapperUtil.getDtoMapping(stockTransfer,
				StockIssuePrintHeader.class);
		stockReceiveStockDto.setTotalIssuedValueInWords(String.valueOf(stockReceiveStockDto.getTotalIssuedValue()));
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("d/M/yyyy");
		stockReceiveStockDto.setSrcDate(simpleDateFormat.format(stockReceiveStockDto.getSrcDocDate()));
		List<StockTransferDetailsDao> stockTransferList = stockTransferService
				.findAllStockTransferDetails(stockTransfer);
		stockReceiveStockDto.setTaxHeader("IGST");
		for (StockTransferDetailsDao stockTransferDetail : stockTransferList) {
			InventoryChild inventoryChild;
			inventoryChild = (InventoryChild) MapperUtil.getDtoMapping(stockTransferDetail, InventoryChild.class);
			ItemsDto itemDto = engineClient.getItemDetails(inventoryChild.getItemCode());
			JsonData jsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(stockTransferDetail.getTaxDetails()), JsonData.class);
			BigDecimal itemTax = new BigDecimal(0);
			inventoryChild.setTaxValue(BigDecimal.ZERO);
			inventoryChild.setTaxPercentage(BigDecimal.ZERO);
			if (jsonData.getData() != null) {
				JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(jsonData.getData()))
						.getAsJsonObject();
				if (jsonObject != null) {
					if (jsonObject.get("SGSTVal") != null) {
						inventoryChild.setSgst(jsonObject.get("SGSTVal").getAsBigDecimal()
								.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
						itemTax = itemTax.add(jsonObject.get("SGSTVal").getAsBigDecimal()
								.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
						inventoryChild.setSgstPercentage(jsonObject.get("SGSTPct").getAsBigDecimal());

						if (jsonObject.get("SGSTVal").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
							stockReceiveStockDto.setTaxHeader("SGST");
							inventoryChild.setTaxValue(jsonObject.get("SGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							inventoryChild.setTaxPercentage(jsonObject.get("SGSTPct").getAsBigDecimal());
						}
					} else {
						inventoryChild.setSgst(BigDecimal.ZERO);
						inventoryChild.setSgstPercentage(BigDecimal.ZERO);
					}
					if (jsonObject.get("UTGSTVal") != null) {
						inventoryChild.setUgst(jsonObject.get("UTGSTVal").getAsBigDecimal()
								.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
						itemTax = itemTax.add(jsonObject.get("UTGSTVal").getAsBigDecimal()
								.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
						if (jsonObject.get("UTGSTPct") != null)
							inventoryChild.setUtgstPercentage(jsonObject.get("UTGSTPct").getAsBigDecimal());
						else
							inventoryChild.setUtgstPercentage(jsonObject.get("UTSTPct").getAsBigDecimal());

						if (jsonObject.get("UTGSTVal").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
							stockReceiveStockDto.setTaxHeader("UTGST");
							inventoryChild.setTaxValue(jsonObject.get("UTGSTVal").getAsBigDecimal()
									.multiply(BigDecimal.valueOf(stockTransferDetail.getIssuedQuantity())));
							if (jsonObject.get("UTGSTPct") != null)
								inventoryChild.setUtgstPercentage(jsonObject.get("UTGSTPct").getAsBigDecimal());
							else
								inventoryChild.setUtgstPercentage(jsonObject.get("UTSTPct").getAsBigDecimal());
						}
					} else {
						inventoryChild.setUgst(BigDecimal.ZERO);
						inventoryChild.setUtgstPercentage(BigDecimal.ZERO);
					}
					if (jsonObject.get("CGSTVal") != null) {
						inventoryChild.setCgst(jsonObject.get("CGSTVal").getAsBigDecimal());
						itemTax = itemTax.add(jsonObject.get("CGSTVal").getAsBigDecimal());
						inventoryChild.setCgstPercentage(jsonObject.get("CGSTPct").getAsBigDecimal());
					} else {
						inventoryChild.setCgst(BigDecimal.ZERO);
						inventoryChild.setCgstPercentage(BigDecimal.ZERO);
					}
					if (jsonObject.get("IGSTVal") != null) {
						inventoryChild.setIgst(jsonObject.get("IGSTVal").getAsBigDecimal());
						itemTax = itemTax.add(jsonObject.get("IGSTVal").getAsBigDecimal());
						inventoryChild.setIgstPercentage(jsonObject.get("IGSTPct").getAsBigDecimal());

						if (jsonObject.get("IGSTVal").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
							stockReceiveStockDto.setTaxHeader("IGST");
							inventoryChild.setTaxValue(jsonObject.get("IGSTVal").getAsBigDecimal());
							inventoryChild.setTaxPercentage(jsonObject.get("IGSTPct").getAsBigDecimal());
						}
					} else {
						inventoryChild.setIgst(BigDecimal.ZERO);
						inventoryChild.setIgstPercentage(BigDecimal.ZERO);
					}
					inventoryChild.setItemTax(itemTax);
					totalTax = totalTax.add(itemTax);
				}
			} else {
				inventoryChild.setSgst(BigDecimal.ZERO);
				inventoryChild.setUgst(BigDecimal.ZERO);
				inventoryChild.setCgst(BigDecimal.ZERO);
				inventoryChild.setIgst(BigDecimal.ZERO);
				inventoryChild.setItemTax(BigDecimal.ZERO);
			}
			if (itemDto.getProductType() != null) {
				inventoryChild.setProductType(itemDto.getProductType());
			}

			inventoryChild.setHsnCode(itemDto.getHsnSacCode());

			if (inventoryChild.getFinalValue() != null) {
				totalFinalValue = totalFinalValue.add(inventoryChild.getFinalValue());
			} else {
				inventoryChild.setFinalValue(inventoryChild.getStdValue().add(itemTax));
				totalFinalValue = totalFinalValue.add(inventoryChild.getStdValue()).add(itemTax);
			}

			if (inventoryChild.getStdValue() != null) {
				totalStdValue = totalStdValue.add(inventoryChild.getStdValue());
			}

			totalStdWeight = totalStdWeight.add(inventoryChild.getStdWeight());

			Optional<InventoryDetailsDaoExt> inventoryDetails = inventoryDetailsService
					.findById(stockTransferDetail.getInventoryId());

			if (!inventoryDetails.isEmpty()) {
				inventoryChild.setDefectTypeDesc(inventoryDetails.get().getDefectTypeDesc());
				inventoryChild.setDefectCodeDesc(inventoryDetails.get().getDefectCodeDesc());

				BigDecimal itemDiscount = inventoryDetails.get().getItemDiscount();
				if (itemDiscount == null) {
					itemDiscount = BigDecimal.ZERO;
				}
				BigDecimal itemTotalDiscount = itemDiscount
						.multiply(new BigDecimal(stockTransferDetail.getIssuedQuantity()));
				inventoryChild.setItemTotalDiscount(itemTotalDiscount);
				totalDiscount = totalDiscount.add(itemTotalDiscount);
			} else {
				inventoryChild.setDefectTypeDesc("");
				inventoryChild.setDefectCodeDesc("");
				inventoryChild.setItemTotalDiscount(BigDecimal.ZERO);
			}

			totalIssuedValue = totalIssuedValue.add(stockTransferDetail.getIssuedValue());
			inventoryChildList.add(inventoryChild);
		}
		// e-invoice set
		stockReceiveStockDto
				.setEinvoice(setEinvoiceByTxnId(stockTransfer.getId().toString(), stockTransfer.getTransferType()));
		totalFinalValue = totalFinalValue.setScale(0, RoundingMode.HALF_UP);
		stockReceiveStockDto.setTotalFinalValue(totalFinalValue);
		stockReceiveStockDto.setTotalStdValue(totalStdValue);
		stockReceiveStockDto.setTotalStdWeight(totalStdWeight);
		stockReceiveStockDto.setTotalTax(totalTax);
		stockReceiveStockDto.setTotalDiscount(totalDiscount);
		stockReceiveStockDto.setTotalIssuedValue(totalIssuedValue);

		stockReceiveStockDto
				.setTotalTaxableAmount((totalFinalValue.subtract(totalTax)).setScale(0, RoundingMode.HALF_UP));

		ObjectMapper object = new ObjectMapper();
		String courierDataStr = stockTransfer.getCarrierDetails();
		JsonNode courierDataJsonNode = object.readValue(courierDataStr, JsonNode.class);
		JsonNode courierData = courierDataJsonNode.get("data");
		if ("courier".equalsIgnoreCase(courierDataJsonNode.get("type").asText())) {
			((ObjectNode) courierData).put("type", "courier");
		}

		if ("employee".equalsIgnoreCase(courierDataJsonNode.get("type").asText())) {
			((ObjectNode) courierData).put("type", "employee");
		}

		String remarks = stockTransfer.getIssuedRemarks();
		StringBuilder lockNumber = new StringBuilder();
		StringBuilder boxNumber = new StringBuilder();
		if (courierData.get("numberOfBoxes") != null && courierData.get("numberOfBoxes").asInt() > 0) {
			int numberOfBox = courierData.get("boxDetails").size();
			for (int numberOfBoxCounter = 0; numberOfBoxCounter < numberOfBox; numberOfBoxCounter++) {
				if (numberOfBoxCounter == 0) {
					lockNumber
							.append(courierData.get("boxDetails").get(numberOfBoxCounter).get("lockNumber").toString());
					boxNumber.append(courierData.get("boxDetails").get(numberOfBoxCounter).get("boxNumber").toString());
				} else {
					lockNumber.append(
							", " + courierData.get("boxDetails").get(numberOfBoxCounter).get("lockNumber").toString());
					boxNumber.append(
							", " + courierData.get("boxDetails").get(numberOfBoxCounter).get("boxNumber").toString());
				}
			}
			((ObjectNode) courierData).put("lockNumber", lockNumber.toString());
			((ObjectNode) courierData).put("boxNumber", boxNumber.toString());
		}
		InventoryPrint inventoryPrint = setInventoryPrintData(inventoryChildList, stockTransfer, stockReceiveStockDto,
				totalPrice, courierData, remarks, lockNumber != null ? lockNumber.toString().replaceAll("\"", "") : "");
		inventoryService.nullCheckForMandatoryFields(inventoryPrint);
		if (printCount > 1) {
			inventoryPrint.setDocument("DUPLICATE");
		} else {
			inventoryPrint.setDocument("ORIGINAL");
		}
		String templateName;
		switch (stockReceiveStockDto.getTransferType()) {
		case "DEFECTIVE":
			templateName = "stockIssue.ftl";
			break;
		case "BTQ_CFA":
			templateName = "stockIssue.ftl";
			break;
		case "BTQ_BTQ":
			templateName = "stockIssue.ftl";
			break;
		default:
			templateName = "stockIssueTransfer.ftl";
			break;
		}

		String html;
		Template t = freemarkerConfig.getTemplate(templateName);
		html = FreeMarkerTemplateUtils.processTemplateIntoString(t, inventoryPrint);

		stockTransferService.updatePrintCountStockIssue(printCount, stockTransfer.getId());
		return generatePdf(html, stockReceiveStockDto.getTransferType(), stockReceiveStockDto.getId());
	}

	protected EinvoiceDto setEinvoiceByTxnId(String txnId, String txnType) {

		InventoryInvoiceDocumentsDao id = null;
		if (txnType.equalsIgnoreCase(StockIssueTransferTypeEnum.GEP.name()))
			id = inventoryInvoiceDocumentsRepository.findByReferenceIdAndTransactionType(txnId,
					EinvoiceTransactionTypeEnum.GEP_RETURN.name());
		else if (txnType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.name())
				|| txnType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.name()))
			id = inventoryInvoiceDocumentsRepository.findByReferenceIdAndTransactionType(txnId,
					EinvoiceTransactionTypeEnum.TEP_RETURN.name());
		else if (txnType.equalsIgnoreCase(StockIssueTransferTypeEnum.COIN.name()))
			id = null;
		else
			id = inventoryInvoiceDocumentsRepository.findByReferenceIdAndTransactionType(txnId,
					EinvoiceTransactionTypeEnum.RETURN_STN.name());
		if (id == null)
			return null;

		EinvoiceDto einvoice = (EinvoiceDto) MapperUtil.getObjectMapping(id, new EinvoiceDto());
		einvoice.setQrCode(QRCodeGenerator.getQrCodeBase64(einvoice.getQrCodeValue(), 1000, 1000));

		return einvoice;
	}

	private InventoryPrint setInventoryPrintData(List<InventoryChild> inventoryChildList,
			StockTransferDao stockTransfer, StockIssuePrintHeader stockReceiveStockDto, String totalPrice,
			JsonNode courierData, String remarks, String lockNumber) {
		InventoryPrint inventoryPrint = new InventoryPrint();
		inventoryPrint.setStockIssuePrintHeader(stockReceiveStockDto);
		inventoryPrint.setInventoryChildList(inventoryChildList);
		inventoryPrint.setSrcLocationData(
				engineService.getLocationDetailWithTaxCode(stockReceiveStockDto.getSrcLocationCode()));
		inventoryPrint.setDestLocationData(
				engineService.getLocationDetailWithTaxCode(stockReceiveStockDto.getDestLocationCode()));

		inventoryPrint.setCourierData(courierData);
		inventoryPrint.setRemarks(remarks);
		inventoryPrint.setTotalPrice(totalPrice);
		inventoryPrint.setPriceInWords(InventoryUtil.printAmount(numberToWordsFactory.getPriceInWords(
				inventoryPrint.getStockIssuePrintHeader().getTotalFinalValue().longValue(),
				DomainConstants.ASIAN_PRICE_TYPE)));
		inventoryPrint.setLockNumber(lockNumber);
		if (stockTransfer.getCurrencyCode().equals(CommonConstants.CURRENCY_CODE))
			inventoryPrint.setCurrency("Rupees");
		switch (stockReceiveStockDto.getTransferType()) {
		case "TEP_PLAIN":
			inventoryPrint.setTxnTypeDetail("TEP PLAIN Transfer");
			break;
		case "TEP_STUDDED":
			inventoryPrint.setTxnTypeDetail("TEP STUDDED Transfer");
			break;
		case "COIN":
			inventoryPrint.setTxnTypeDetail("COIN Transfer");
			break;
		case "GEP":
			inventoryPrint.setTxnTypeDetail("GEP Transfer");
			break;
		case "BTQ_CFA":
			inventoryPrint.setTxnTypeDetail("Btq Cfa Transfer");
			break;
		case "BTQ_BTQ":
			inventoryPrint.setTxnTypeDetail("Btq Btq Transfer");
			break;	
		default:
			break;
		}
		if (inventoryPrint.getTxnTypeDetail() != null
				&& inventoryPrint.getTxnTypeDetail().equalsIgnoreCase("Btq Cfa Transfer")) {
			inventoryPrint.setApprovalCode("Approved by Merchandise");
		} else {
			inventoryPrint.setApprovalCode("Approved by Factory ");
		}
		return inventoryPrint;
	}

	@Override
	@Transactional
	public void updateStockRequest(Integer id, StockIssueCancelDto stockIssueCancelDto, String issueType) {
		StockRequestDao stRequest = stockRequestService.findByIdAndRequestTypeAndSrcLocationCode(id, issueType,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		// if stRequest is null then throw exception
		if (stRequest == null) {
			throw new ServiceException(RECORD_S_NOT_FOUND, ERR_INV_029);
		}
		// if stRequest object is ISSUED/CLOSED then throw exception
		if (StockRequestStatusEnum.ISSUED.toString().equals(stRequest.getStatus())
				|| StockRequestStatusEnum.CLOSED.toString().equals(stRequest.getStatus())) {
			throw new ServiceException(INVALID_UPDATE, ERR_INV_013);
		}
		if (!StockRequestStatusEnum.ISSUE_REJECTED.toString().equals(stockIssueCancelDto.getStatus())) {
			throw new ServiceException(INVALID_UPDATE, ERR_INV_013);
		}
		stRequest.setStatus(stockIssueCancelDto.getStatus());
		stRequest.setRequestRemarks(stockIssueCancelDto.getRemarks());
		stockRequestService.save(stRequest);
	}

	@Override
	@Transactional
	public void updateStockTransfer(Integer id, String transferType, StockTransferCancelDto stockTransferCancelDto) {
		// if from UI,status should come as CNCL_APVL_PENDING. If not then throw
		// exception
		if (!StockTransferStatusEnum.CNCL_APVL_PENDING.toString().equals(stockTransferCancelDto.getStatus())) {
			throw new ServiceException(INVALID_UPDATE, ERR_INV_013);
		}
		StockTransferDao stTransfer = stockTransferService.findStockTransferByIdAndSrcLocationCodeAndTransferType(id,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), transferType);
		// if STN status is RECEIVED then throw exception
		if (StockTransferStatusEnum.RECEIVED.toString().equals(stTransfer.getStatus())) {
			throw new ServiceException(INVALID_UPDATE, ERR_INV_013);
		}
		stTransfer.setReceivedRemarks(stockTransferCancelDto.getRemarks());
		stTransfer.setStatus(stockTransferCancelDto.getStatus());
		stockTransferService.saveOrUpdateStockTransfer(stTransfer);
	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

	@Override
	public ReceiveStockDto getStockIssueDetail(Integer id, String transferType, String status) {

		List<String> binGroup = new ArrayList<>();
		Map<String, String> productGroupMap;
		List<String> productGroup = null;
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())) {
			binGroup.add(L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Plain CFA's
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			productGroupMap.keySet().removeIf(k -> (k.equals(ProductGroupCodeEnum.GOLD_COIN.getCode())));
			productGroup = getListProductGroup(productGroupMap);
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())) {
			binGroup.add(L1BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.S.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroup = getListProductGroup(productGroupMap);
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_GOLD_COIN.toString())) {
			binGroup.add(L1BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroupMap.keySet().removeIf(k -> !(k.equals(ProductGroupCodeEnum.GOLD_COIN.getCode())));
			productGroup = getListProductGroup(productGroupMap);
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_CFA.toString())) {
			binGroup.add(BinGroupEnum.DEFECTIVE.toString());
			binGroup.add(BinGroupEnum.DISPUTE.toString());
			binGroup.add(BinGroupEnum.STN.toString());
			binGroup.add(BinGroupEnum.FOC.toString());
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.DEFECTIVE.toString())) {
			binGroup.add(BinGroupEnum.DEFECTIVE.toString());
			binGroup.add(BinGroupEnum.DISPUTE.toString());
			binGroup.add(BinGroupEnum.HALLMARKDISPUTEBIN.toString());
		} else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_BTQ.toString())) {
			binGroup.add(BinGroupEnum.STN.toString());
		} else {
			binGroup.add(transferType);
		}

		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		List<StockTransferDao> transferList = stockTransferService.findByTransferTypeAndStatusAndSrcLocationCode(
				transferType, StockTransferStatusEnum.OPEN.toString(), locationCode);

		List<Object[]> listAvailableItems;
		if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.DEFECTIVE.toString())) {

			listAvailableItems = stockTransferService.getJointListForDefectiveHeader(id, binGroup, productGroup, status,
					locationCode, businessDayDto.getBusinessDate());
		} else if(transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_BTQ.toString())) {

			listAvailableItems = stockTransferService.getJointListForBtqHeader(id, productGroup, status,
					locationCode, binGroup, businessDayDto.getBusinessDate());
		} else {

			listAvailableItems = stockTransferService.getJointListForHeader(id, binGroup, productGroup, status,
					locationCode, businessDayDto.getBusinessDate());
		}

		return getTransferDetail(listAvailableItems, transferList.get(0));
	}

	private ReceiveStockDto getTransferDetail(List<Object[]> listAvailableItems, StockTransferDao stockTransfer) {

		ReceiveStockDto transferDto = (ReceiveStockDto) MapperUtil.getDtoMapping(stockTransfer, ReceiveStockDto.class);
		Short quantity = 0;
		BigDecimal totalWeight = BigDecimal.ZERO;
		BigDecimal totalValue = BigDecimal.ZERO;
		for (Object[] l : listAvailableItems) {
			Short qty = (l[4] == null) ? (short) 0 : (Short) l[4];
			if (qty > 0) {
				quantity = (short) (quantity + (Short) l[5]);
				totalWeight = totalWeight.add((BigDecimal) l[6]);
				totalValue = totalValue.add((BigDecimal) l[7]);
			}
		}
		transferDto.setTotalAvailableQuantity(quantity);
		transferDto.setTotalMeasuredQuantity(quantity);
		transferDto.setTotalAvailableWeight(totalWeight);
		transferDto.setTotalMeasuredWeight(totalWeight);
		transferDto.setTotalAvailableValue(totalValue);
		transferDto.setTotalMeasuredValue(totalValue);
		return transferDto;
	}



}