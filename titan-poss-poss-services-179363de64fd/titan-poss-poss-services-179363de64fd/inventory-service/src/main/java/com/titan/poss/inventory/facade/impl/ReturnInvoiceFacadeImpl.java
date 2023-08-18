/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade.impl;

import java.io.IOException;
import java.io.StringReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.time.Year;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
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
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.dto.TaxDetails;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.core.utils.PrintUtil;
import com.titan.poss.core.utils.QRCodeGenerator;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.constant.InventoryDetailsActionEnum;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.constant.StockTransactionType;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.InventoryInvoiceDocumentsDao;
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockInvoiceDetailsDao;
import com.titan.poss.inventory.dao.StoreRevenueDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.InventoryChild;
import com.titan.poss.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.inventory.dto.InventoryPrint;
import com.titan.poss.inventory.dto.IsacDetailsDto;
import com.titan.poss.inventory.dto.ItemsParamListDto;
import com.titan.poss.inventory.dto.ReturnInvoicePrintHeader;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.L1BinGroupCodeEnum;
import com.titan.poss.inventory.dto.constants.L3BinGroupCodeEnum;
import com.titan.poss.inventory.dto.constants.ReturnInvoiceStatus;
import com.titan.poss.inventory.dto.constants.ReturnInvoiceType;
import com.titan.poss.inventory.dto.constants.StockIssueTransferTypeEnum;
import com.titan.poss.inventory.dto.constants.StockIssueTransferTypeStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;
import com.titan.poss.inventory.dto.request.InvoiceItem;
import com.titan.poss.inventory.dto.request.RemoveStockItemsDto;
import com.titan.poss.inventory.dto.request.ReturnInvoiceConFirmDto;
import com.titan.poss.inventory.dto.request.ReturnInvoiceCreateItemsDto;
import com.titan.poss.inventory.dto.request.json.CourierData;
import com.titan.poss.inventory.dto.request.json.HandCarryEmployeeData;
import com.titan.poss.inventory.dto.response.QuantityCheckDto;
import com.titan.poss.inventory.dto.response.ReturnInvoiceDto;
import com.titan.poss.inventory.dto.response.ReturnInvoiceItemDto;
import com.titan.poss.inventory.facade.ReturnInvoiceFacade;
import com.titan.poss.inventory.repository.InventoryDetailsRepositoryExt;
import com.titan.poss.inventory.repository.InventoryInvoiceDocumentsRepository;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.repository.StoreRevenueRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.FileService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.InventorySyncDataService;
import com.titan.poss.inventory.service.InvoiceService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.utils.InventoryUtil;

import freemarker.template.Configuration;
import freemarker.template.Template;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Slf4j
@Service("returnInvoiceFacadeService")
public class ReturnInvoiceFacadeImpl implements ReturnInvoiceFacade {
	private static final Logger LOGGER = LoggerFactory.getLogger(ReturnInvoiceFacadeImpl.class);
	private static final String ERR_INV_035 = "ERR-INV-035";
	private static final String ERR_INV_029 = "ERR-INV-029";
	private static final String RECORDS_NOT_FOUND = "Records not found";

	private static final String TOTAL_QUANTITY = "totalQuantity";
	private static final String TOTAL_WEIGHT = "totalWeight";
	private static final String TOTAL_VALUE = "totalValue";
	private static final String TOTAL_DISCOUNT = "totalDiscount";
	private static final String ERR_INV_014 = "ERR-INV-014";
	private static final String ERR_INV_013 = "ERR-INV-013";
	private static final String ERR_CORE_013 = "ERR-CORE-013";
	private static final String ERR_INV_062 = "ERR-INV-062";
	public static final BigDecimal ONE_HUNDRED = new BigDecimal(100);

	@Autowired
	private InvoiceService stockInvoiceService;

	@Autowired
	private InventoryDetailsService inventoryDetailsService;

	@Autowired
	private Configuration freemarkerConfig;

	@Autowired
	private InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	private StoreRevenueRepository storeRevenueRepository;

	@Autowired
	LocationService locationService;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Autowired
	EngineService engineService;

	@Autowired
	InventoryCommonFacadeImpl inventoryService;

	@Value("${returnInvoice.percentage}")
	private String returnInvoicePercent;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private ReturnInvoiceFacadeImpl returnInvoiceFacadeImp;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	@Autowired
	private FileService fileService;

	@Autowired
	private InventoryInvoiceDocumentsRepository inventoryInvoiceDocumentsRepository;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private InventoryDetailsRepositoryExt inventoryDetailsRepository;

	@Autowired
	private EngineServiceClient engineClient;

	@Value("${docs.file.source.path}")
	String fileBasePath;

	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	private boolean isAnL3User(AuthUser user) {
		if (!user.isAnL3StoreUser()) {
			throw new ServiceException("Not an L3 User: Improper Credential", ERR_INV_029);
		}
		return user.isAnL3StoreUser();

	}

	@Override
	public ReturnInvoiceDto getReturnInvoiceById(Integer id, String invoiceType, String invoiceStatus) {
		isAnL3User(CustomSecurityPrincipal.getSecurityPrincipal());
		StockInvoiceDao stockInvoice = getInvoiceById(id,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), null, invoiceType, invoiceStatus);

		return createInvoiceDtoResponse(stockInvoice);
	}

	private StockInvoiceDao getInvoiceById(Integer id, String srcLocationcode, String destlocationcode,
			String invoiceType, String invoiceStatus) {
		Example<StockInvoiceDao> criteria = listInvoiceByIdCriteria(id, srcLocationcode, destlocationcode, invoiceType,
				invoiceStatus);
		Optional<StockInvoiceDao> invoiceList = stockInvoiceService.getInvoiceById(criteria);
		if (!invoiceList.isPresent()) {
			throw new ServiceException(RECORDS_NOT_FOUND, ERR_INV_029);
		}
		return invoiceList.get();
	}

	private Example<StockInvoiceDao> listInvoiceByIdCriteria(Integer id, String srcLocationCode,
			String destLocationCode, String invoiceType, String invoiceStatus) {
		StockInvoiceDao stockInvoiceCriteria = StockInvoiceDao.builder().id(id).invoiceType(invoiceType)
				.srcLocationCode(srcLocationCode).destLocationCode(destLocationCode).status(invoiceStatus).build();

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockInvoiceCriteria, matcher);
	}

	@Override
	public PagedRestResponse<List<ReturnInvoiceItemDto>> listReturnInvoiceItems(Integer invoiceId, String itemCode,
			String lotNumber, List<String> binCode, String binGroupCode, String status, String invoiceType,
			List<String> productGroupList, List<String> productCategory, Pageable pageable) {
		isAnL3User(CustomSecurityPrincipal.getSecurityPrincipal());
		// LocationResponseDto locationData = engineClient.getBoutiqueLocationDetails();
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		String sortParameter = null;
		List<ReturnInvoiceItemDto> listProductDtls;
		List<String> binGroupList = null;
		Map<String, String> productGroupMap;
		List<String> productGroup = null;
		if (invoiceType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(L3BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Plain CFA's
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L3BinGroupCodeEnum.TEP.toString());
			productGroup = getListProductGroup(productGroupMap);

		} else if (invoiceType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(L3BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.S.toString(),
					L3BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroup = getListProductGroup(productGroupMap);
		} else if (invoiceType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_GOLD_COIN.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(L3BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroupMap.keySet().removeIf(k -> !(k.equals(ProductGroupCodeEnum.GOLD_COIN.getCode())));
			productGroup = getListProductGroup(productGroupMap);
		} else if (invoiceType.equalsIgnoreCase(ReturnInvoiceType.BTQ_CFA.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(BinGroupEnum.DEFECTIVE.toString());
			binGroupList.add(BinGroupEnum.DISPUTE.toString());
			binGroupList.add(L3BinGroupCodeEnum.PURCFA.toString());
			binGroupList.add(BinGroupEnum.CUSTOMERORDERBIN.toString());
			binGroupList.add(BinGroupEnum.FOC.toString());

		} else {
			binGroupList = new ArrayList<>();
			binGroupList.add(invoiceType);
		}
		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		sortParameter = setSortParam(invoiceId, pageable, sortParameter);

		List<Object[]> listAvailableItems;
		int total;

		if (invoiceType.equalsIgnoreCase(ReturnInvoiceType.BTQ_CFA.toString())) {
			listAvailableItems = stockInvoiceService.getJointListForBtqCfa(invoiceId, productGroup, status, itemCode,
					lotNumber, locationCode, productCategory, sortParameter == null ? "NULL" : sortParameter,
					productGroupList, binCode, binGroupList, binGroupCode, businessDayDto.getBusinessDate(),
					pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());

			total = stockInvoiceService.getPageSizeBtqCfa(invoiceId, productGroup, status, itemCode, lotNumber,
					locationCode, productCategory, productGroupList, binCode, binGroupList, binGroupCode,
					businessDayDto.getBusinessDate());
		} else {
			listAvailableItems = stockInvoiceService.getJointList(invoiceId, productGroup, status, itemCode, lotNumber,
					locationCode, productCategory, sortParameter == null ? "NULL" : sortParameter, productGroupList,
					binCode, binGroupList, binGroupCode, businessDayDto.getBusinessDate(),
					pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());

			total = stockInvoiceService.getPageSize(invoiceId, productGroup, status, itemCode, lotNumber, locationCode,
					productCategory, productGroupList, binCode, binGroupList, binGroupCode,
					businessDayDto.getBusinessDate());

		}

		listProductDtls = setReturnInvoiceItemDtoFromInvoiceDetails(listAvailableItems, invoiceType);

		Page<ReturnInvoiceItemDto> pagedData = new PageImpl<>(listProductDtls,
				PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()), total);
//		//sort list based on inward date
//		if(sortParameter == null)
//		{
//			Collections.sort(listProductDtls);
//		}
		log.info("List After Sorting Based on " + sortParameter + ".............................." + listProductDtls);
		return new PagedRestResponse<>(listProductDtls, pagedData);
	}

	private String setSortParam(Integer invoiceId, Pageable pageable, String sortParameter) {
		Optional<Order> order = pageable.getSort().get().findFirst();
		StockInvoiceDao stockInvoice = stockInvoiceService.getOne(invoiceId);
		if (stockInvoice == null) {
			LOGGER.debug("The Invoice Id passed improper ");
			throw new ServiceException("Inccorrect invoice ID ", ERR_INV_029);
		} else {
			if (!stockInvoice.getSrcLocationCode()
					.equals(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode())) {
				LOGGER.debug(" improper Invoice Id is passed");
				throw new ServiceException("No Access", ERR_INV_035);
			}
		}
		if (order.isPresent()) {
			sortParameter = order.get().getProperty();
			sortParameter += " " + order.get().getDirection().name();
		}
		return sortParameter;
	}

	private List<String> getListProductGroup(Map<String, String> productGroupMap) {
		List<String> productGroup = new ArrayList<>();
		for (Map.Entry<String, String> entry : productGroupMap.entrySet()) {
			productGroup.add(entry.getKey());
		}
		return productGroup;
	}

	private List<ReturnInvoiceItemDto> setReturnInvoiceItemDtoFromInvoiceDetails(List<Object[]> listAvailableItems,
			String transferType) {
		List<ReturnInvoiceItemDto> listProductDtls = new ArrayList<>();
		LocationResponseDto locationDetails = engineClient.getBoutiqueLocationDetails();
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		for (Object[] l : listAvailableItems) {
			ReturnInvoiceItemDto is = new ReturnInvoiceItemDto();
			is.setInventoryId((String) l[0]);
			is.setId((String) l[1]);
			is.setStatus((String) l[2]);
			is.setItemCode((String) l[3]);
			is.setLotNumber((String) l[4]);

			Short qty = (l[5] == null) ? (short) 0 : (Short) l[5];// totalQuantity
			Short issuedQty = (l[20] == null) ? (short) 0 : (Short) l[20];
			is.setAvailableQuantity((short) (qty - issuedQty));// total- issued quantity
			is.setMeasuredQuantity((Short) l[6]); // detailsTotalQuantity == details issued quantity
			is.setProductCategory((String) l[7]);
			is.setProductGroup((String) l[8]);
			is.setBinCode((String) l[9]);
			is.setBinGroupCode((String) l[10]);
			is.setStdValue((BigDecimal) l[11]); // inventory item value == inventory std value
			is.setStdWeight((BigDecimal) l[12]); // inventory item weight == inventory std weight
			is.setCurrencyCode((String) l[13]);
			is.setWeightUnit((String) l[14]);
			is.setMfgDate((Date) l[15]);
			is.setMeasuredWeight((BigDecimal) l[16]); // details measuredWeight == details issued quantity
			is.setAvailableWeight((BigDecimal) l[17]); // details totalweight == inventory total weight
			is.setMeasuredValue((BigDecimal) l[18]); // details measured Value
			is.setAvailableValue((BigDecimal) l[19]); // inventory details totalValue
			is.setProductCategoryDesc(productCategoryList.get(l[7]));
			is.setProductGroupDesc(productGroupList.get(l[8]));
			is.setRefDocType((String) l[21]);
			LOGGER.info("doc type " + is.getRefDocType());
			if (!StringUtils.isEmpty(is.getRefDocType())) {
				if (is.getRefDocType().equals(StockTransactionType.CONV.name()))
					throw new ServiceException("Converted Items not allowed for Issue to CFA", ERR_INV_062);
			}
			is.setRefDocNumber((Integer) l[22]);
			is.setRefFiscalYear((Short) l[23]);
			is.setRefDocDate((Date) l[24]);
			is.setKarat((BigDecimal) l[26]);
			is.setItemDetails(MapperUtil.getJsonFromString((String) l[25])); // item_details setting
			is.setIsacDetails(MapperUtil.getJsonFromString((String) l[27])); // isac_details setting
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

			if (!transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_CFA.toString())) {
				setissueToFactoryStockTaxDetails(is, (String) l[3], (BigDecimal) l[11], transferType, locationDetails);
			}
			if (qty > 0) {
				if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_CFA.toString())) {

					BigDecimal itemLevelDiscount = BigDecimal.ZERO;
					BigDecimal preTaxValue = BigDecimal.ZERO;
					BigDecimal totalTax = BigDecimal.ZERO;
					List<IsacDetailsDto> isacDetailList = new ArrayList<>();

					if (l[27] != null) {
						JsonReader reader = new JsonReader(
								new StringReader(MapperUtil.getStringFromJson(is.getIsacDetails())));
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
									} else if (isacDetail.get("glKey") != null
											&& isacDetail.get("glKey").getAsString() != null
											&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("DBTR")) {
										preTaxValue = isacDetail.get("amount").getAsBigDecimal();
									} else if (isacDetail.get("glKey") != null
											&& isacDetail.get("glKey").getAsString() != null
											&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("SALES")) {

									} else if (isacDetail.get("glKey") != null
											&& isacDetail.get("glKey").getAsString() != null
											&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("CGST")) {
										totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
										getTaxDetailsForBtqCfa(isacDetail,isacDetailList,is.getAvailableQuantity());
									} else if (isacDetail.get("glKey") != null
											&& isacDetail.get("glKey").getAsString() != null
											&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("SGST")) {
										totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
										getTaxDetailsForBtqCfa(isacDetail,isacDetailList,is.getAvailableQuantity());
									} else if (isacDetail.get("glKey") != null
											&& isacDetail.get("glKey").getAsString() != null
											&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("IGST")) {
										totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
										getTaxDetailsForBtqCfa(isacDetail,isacDetailList,is.getAvailableQuantity());
									}
								}
							}
						}
					}
					is.setItemLevelDiscount(itemLevelDiscount);
					is.setPreTaxValue(preTaxValue);
					is.setTotalTax(totalTax);
					is.setFinalValue(is.getPreTaxValue().add(totalTax).setScale(0, RoundingMode.HALF_UP));
					is.setPricePerUnit(is.getStdValue());
					is.setValue(is.getStdValue().add(totalTax));
					Map<String,List<IsacDetailsDto>> isacDetailsObj=new HashMap<>();
					isacDetailsObj.put("IsacDetails", isacDetailList);
					JsonData data=new JsonData();
					data.setType("ISAC_DETAILS");
					data.setData(isacDetailsObj);	
                    is.setIsacDetails(data);
				}
				listProductDtls.add(is);
			}

		}

		return listProductDtls;
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
 
	private void setissueToFactoryStockTaxDetails(ReturnInvoiceItemDto stockDetailDto, String itemCode,
			BigDecimal stdValue, String transferType, LocationResponseDto locationDetails) {

		TaxCalculationResponseDto taxDetailsResponse = null;
		if ((transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_GOLD_COIN.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.GEP.toString()))
				&& !StringUtils.isEmpty(itemCode)) {
			taxDetailsResponse = engineClient.getTaxDetails(locationDetails.getFactoryDetails().getLocationCode(), 0,
					null, TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE_TEP_GEP.name(), itemCode, false, null);
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
			if (taxValueDetails.getAsJsonObject("data").get("CGSTVal") != null)
				sgstVal = taxValueDetails.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
			if (taxValueDetails.getAsJsonObject("data").get("CGSTVal") != null)
				utgstVal = taxValueDetails.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();

			finalTax = igstVal.add(cgstVal).add(sgstVal).add(utgstVal);
		}

		stockDetailDto.setTotalTax(finalTax.multiply(new BigDecimal(stockDetailDto.getAvailableQuantity())).setScale(2,
				RoundingMode.HALF_UP));
		if (stockDetailDto.getAvailableValue() != null) {
			stockDetailDto.setFinalValue(stockDetailDto.getAvailableValue().add(stockDetailDto.getTotalTax())
					.setScale(2, RoundingMode.HALF_UP));
		}
		stockDetailDto.setPricePerUnit(stockDetailDto.getStdValue());

	}

	@Override
	@Transactional
	public ReturnInvoiceDto addReturnInvoice(String invoiceType) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		CountryDetailsDto countryDetailsDto = getCountryDetails(authUser.getLocationCode());
		BusinessDayDto businessDayDto = getBusinessDay(authUser.getLocationCode());
		isAnL3User(authUser);
		StockInvoiceDao stockInvoice = new StockInvoiceDao();
		StockInvoiceDao createInvoice = null;
		List<StockInvoiceDao> stockInvoiceList;
		// check for any Stn is available in OPEN state if yes then return same..
		stockInvoiceList = stockInvoiceService.findByInvoiceTypeAndStatusAndSrcLocationCode(invoiceType,
				ReturnInvoiceStatus.OPEN.toString(), authUser.getLocationCode());
		if (stockInvoiceList.isEmpty()) {
			stockInvoice.setCreatedBy(authUser.getUsername());
			stockInvoice.setCreatedDate(new Date());
			stockInvoice.setCurrencyCode(countryDetailsDto.getCurrencyCode());
			stockInvoice.setInvoiceType(invoiceType);
			stockInvoice.setOrgCode(CommonConstants.ORG_CODE);
			stockInvoice.setLastModifiedBy(authUser.getUsername());
			stockInvoice.setLastModifiedDate(new Date());
			stockInvoice.setSrcLocationCode(authUser.getLocationCode());
			stockInvoice.setStatus(ReturnInvoiceStatus.OPEN.name());
			stockInvoice.setTotalIssuedQuantity((short) 0);
			stockInvoice.setSrcDocDate(businessDayDto.getBusinessDate());
			stockInvoice.setSrcFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
			stockInvoice.setTotalIssuedValue(new BigDecimal(0));
			stockInvoice.setTotalIssuedWeight(new BigDecimal(0));
			stockInvoice.setWeightUnit(countryDetailsDto.getWeightUnit());
			stockInvoice.setFilePublished(false);
			stockInvoice.setTotalDiscount(new BigDecimal(0));
			createInvoice = stockInvoiceService.createStockInvoice(stockInvoice);
		} else {
			createInvoice = stockInvoiceList.get(0);
		}
		return createInvoiceDtoResponse(createInvoice);
	}

	@Override
	@Transactional
	public void addReturnInvoiceItems(Integer invoiceId, String invoiceType,
			ReturnInvoiceCreateItemsDto returnInvoiceItemDto) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		isAnL3User(authUser);
		StockInvoiceDao stockInvoice;
		List<String> productGroup = null;

		stockInvoice = getInvoiceById(invoiceId, authUser.getLocationCode(), null, invoiceType,
				ReturnInvoiceStatus.OPEN.name());
		if (stockInvoice == null) {
			throw new ServiceException("RECORD_S_NOT_FOUND", ERR_INV_029);
		}
		if (!stockInvoice.getStatus().equalsIgnoreCase(ReturnInvoiceStatus.OPEN.toString())) {
			throw new ServiceException("No items in " + ReturnInvoiceStatus.OPEN.toString() + " status", ERR_INV_029);
		}

		List<StockInvoiceDetailsDao> itemsToSave = new ArrayList<>();
		Map<String, BigDecimal> total;
		if (!returnInvoiceItemDto.getInvoiceItems().isEmpty()) {

			List<String> inventortIds = returnInvoiceItemDto.getInvoiceItems().stream().map(InvoiceItem::getInventoryId)
					.collect(Collectors.toList());
			List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
					.getInventoryDetailsByIdList(inventortIds);
			Map<String, InventoryDetailsDaoExt> inventoryDetailsMap = inventoryDetailsList.stream()
					.collect(Collectors.toMap(InventoryDetailsDaoExt::getId, invDetails -> invDetails));

			total = createMultiStockInvoiceItem(returnInvoiceItemDto, authUser, stockInvoice, itemsToSave,
					inventoryDetailsMap);

		} else {
			// bulk create items for TEP,GEP and others
			total = createAllStockInvoiceItems(invoiceId, invoiceType, authUser, productGroup, stockInvoice,
					itemsToSave);

		}
		stockInvoiceService.saveAllListItemsToInvoice(itemsToSave);
		updateTotalValues(total.get(TOTAL_QUANTITY).shortValue(), total.get(TOTAL_WEIGHT), total.get(TOTAL_VALUE),
				invoiceId, total.get(TOTAL_DISCOUNT));

	}

	private Map<String, BigDecimal> createAllStockInvoiceItems(Integer invoiceId, String invoiceType, AuthUser authUser,
			List<String> productGroup, StockInvoiceDao stockInvoice, List<StockInvoiceDetailsDao> itemsToSave) {
		BigDecimal totalWeight = BigDecimal.ZERO;
		LocationResponseDto locationDetails = engineClient.getBoutiqueLocationDetails();
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		Integer totalQuantity = 0;
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalDiscount=BigDecimal.ZERO;
		Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.unsorted());
		List<InventoryDetailsDaoExt> inventoryList;
		Map<String, String> productGroupMap;
		List<String> binGroupList = null;
		if (invoiceType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(L3BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Plain CFA's
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L3BinGroupCodeEnum.TEP.toString());
			productGroup = getListProductGroup(productGroupMap);

		} else if (invoiceType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(L3BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.S.toString(),
					L3BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroup = getListProductGroup(productGroupMap);
		} else if (invoiceType.equalsIgnoreCase(ReturnInvoiceType.BTQ_CFA.toString())) {
			if (productGroup == null)
				productGroup = null;
			binGroupList = new ArrayList<>();
			binGroupList.add(BinGroupEnum.DEFECTIVE.toString());
			binGroupList.add(BinGroupEnum.DISPUTE.toString());
			binGroupList.add(L3BinGroupCodeEnum.PURCFA.toString());
		} else {
			// GEP
			binGroupList = new ArrayList<>();
			binGroupList.add(invoiceType);
		}

		// items should not be deleted instead other than existing items should be
		// added.
		// to add only those items which are not in SELECTED status
		ItemsParamListDto params = createParamForJointList(null, invoiceId, invoiceType, null, null, null, productGroup,
				ReturnInvoiceStatus.OPEN.toString(), CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				null, null, null, binGroupList, businessDayDto.getBusinessDate());

		List<Object[]> listAvailableItems = stockInvoiceService.listInvoiceReturnItems(params, pageable);

		List<String> inventoryIds = getOpenItemInventoryList(listAvailableItems);
		inventoryList = inventoryDetailsService.getInventoryDetailsByIdList(inventoryIds);

		for (InventoryDetailsDaoExt inventoryDetail : inventoryList) {

			StockInvoiceDetailsDao stockInvoiceDetails = (StockInvoiceDetailsDao) MapperUtil
					.getDtoMapping(inventoryDetail, StockInvoiceDetailsDao.class);
			stockInvoiceDetails.setInventoryId(inventoryDetail.getId());
			if (inventoryDetail.getTotalQuantity() == null) {
				throw new ServiceException("improper DB", ERR_INV_014);
			} else {
				stockInvoiceDetails.setIssuedQuantity(inventoryDetail.getTotalQuantity());
			}

			// need to implement for net value:
			// totalValue-itemLevel discount

			stockInvoiceDetails.setCreatedBy(authUser.getUsername());
			stockInvoiceDetails.setLastModifiedBy(authUser.getUsername());
			stockInvoiceDetails.setCreatedDate(new Date());
			stockInvoiceDetails.setLastModifiedDate(new Date());
			stockInvoiceDetails.setStdWeight(inventoryDetail.getStdWeight());
			stockInvoiceDetails.setStdValue(inventoryDetail.getStdValue());

			stockInvoiceDetails.setIssuedQuantity(inventoryDetail.getTotalQuantity());
			stockInvoiceDetails.setIssuedValue(inventoryDetail.getTotalValue());
			stockInvoiceDetails.setIssuedWeight(inventoryDetail.getTotalWeight());
			stockInvoiceDetails.setItemLevelDiscount(inventoryDetail.getItemDiscount());

			stockInvoiceDetails.setReceivedQuantity(inventoryDetail.getTotalQuantity());
			stockInvoiceDetails.setReceivedValue(inventoryDetail.getTotalValue());
			stockInvoiceDetails.setReceivedWeight(inventoryDetail.getTotalWeight());
			stockInvoiceDetails.setNetValue(inventoryDetail.getStdValue()
					.multiply(BigDecimal.valueOf(stockInvoiceDetails.getIssuedQuantity())));
			stockInvoiceDetails.setKarat(inventoryDetail.getKarat());
			stockInvoiceDetails.setStockInvoice(stockInvoice);
			stockInvoiceDetails.setRefDocDate(inventoryDetail.getStockInwardDate());
			stockInvoiceDetails.setRefDocNumber(inventoryDetail.getDocNumber());
			stockInvoiceDetails.setRefDocType(inventoryDetail.getDocType());
			stockInvoiceDetails.setRefFiscalYear(inventoryDetail.getFiscalYear());
			stockInvoiceDetails.setStatus(StockTransferStatusEnum.SELECTED.name());
			saveTaxDetailsInReturnInvoice(stockInvoiceDetails, inventoryDetail.getItemCode(),
					inventoryDetail.getStdValue(), stockInvoice.getInvoiceType(), locationDetails);
			itemsToSave.add(stockInvoiceDetails);
			// update parent
			totalQuantity = totalQuantity + stockInvoiceDetails.getIssuedQuantity();
			totalWeight = totalWeight.add(stockInvoiceDetails.getStdWeight());
			totalValue = totalValue.add(stockInvoiceDetails.getFinalValue());
			totalDiscount= totalDiscount.add(stockInvoiceDetails.getItemLevelDiscount() != null ? stockInvoiceDetails.getItemLevelDiscount() : BigDecimal.ZERO);
		}
		Map<String, BigDecimal> data = new HashMap<>();
		data.put(TOTAL_QUANTITY, BigDecimal.valueOf(totalQuantity));
		data.put(TOTAL_WEIGHT, totalWeight);
		data.put(TOTAL_VALUE, totalValue);
		data.put(TOTAL_DISCOUNT, totalDiscount);
		return data;
	}

	private Map<String, BigDecimal> createMultiStockInvoiceItem(ReturnInvoiceCreateItemsDto returnInvoiceItemDto,
			AuthUser authUser, StockInvoiceDao stockInvoice, List<StockInvoiceDetailsDao> itemsToSave,
			Map<String, InventoryDetailsDaoExt> inventoryDetailsMap) {
		LocationResponseDto locationDetails = engineClient.getBoutiqueLocationDetails();
		Integer totalQuantity = 0;
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;
		BigDecimal totalDiscount = BigDecimal.ZERO;
		List<InvoiceItem> items;
		items = returnInvoiceItemDto.getInvoiceItems();
		for (InvoiceItem item : items) {
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
			StockInvoiceDetailsDao stockInvoiceDetails = (StockInvoiceDetailsDao) MapperUtil
					.getDtoMapping(inventoryDetail, StockInvoiceDetailsDao.class);

			stockInvoiceDetails.setInventoryId(inventoryDetail.getId());

			stockInvoiceDetails.setIssuedQuantity(inventoryDetail.getTotalQuantity());
			stockInvoiceDetails.setIssuedValue(inventoryDetail.getTotalValue());
			stockInvoiceDetails.setIssuedWeight(inventoryDetail.getTotalWeight());
			stockInvoiceDetails.setIssuedWeightDetails(inventoryDetail.getTotalWeightDetails());
			stockInvoiceDetails.setItemLevelDiscount(inventoryDetail.getItemDiscount());

			stockInvoiceDetails.setReceivedValue(inventoryDetail.getTotalValue());
			stockInvoiceDetails.setReceivedQuantity(inventoryDetail.getTotalQuantity());
			stockInvoiceDetails.setReceivedWeight(inventoryDetail.getTotalWeight());

			stockInvoiceDetails.setCreatedBy(authUser.getUsername());
			stockInvoiceDetails.setLastModifiedBy(authUser.getUsername());
			stockInvoiceDetails.setCreatedDate(new Date());
			stockInvoiceDetails.setLastModifiedDate(new Date());
			stockInvoiceDetails.setStdWeight(inventoryDetail.getStdWeight());
			stockInvoiceDetails.setStdValue(inventoryDetail.getStdValue());
			stockInvoiceDetails.setNetValue(inventoryDetail.getStdValue()
					.multiply(BigDecimal.valueOf(stockInvoiceDetails.getIssuedQuantity())));
			stockInvoiceDetails.setKarat(inventoryDetail.getKarat());
			stockInvoiceDetails.setStatus(StockTransferStatusEnum.SELECTED.toString());
			stockInvoiceDetails.setStockInvoice(stockInvoice);
			stockInvoiceDetails.setRefDocDate(inventoryDetail.getStockInwardDate());
			stockInvoiceDetails.setRefDocNumber(inventoryDetail.getDocNumber());
			stockInvoiceDetails.setRefDocType(inventoryDetail.getDocType());
			stockInvoiceDetails.setRefFiscalYear(inventoryDetail.getFiscalYear());

			if (stockInvoice.getInvoiceType().equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_CFA.toString())) {
				// saving tax and final value for BTQ_CFA only
				saveTaxDetailForBTQCFA(stockInvoiceDetails);
			}else {
			   saveTaxDetailsInReturnInvoice(stockInvoiceDetails, inventoryDetail.getItemCode(),
					inventoryDetail.getStdValue(), stockInvoice.getInvoiceType(), locationDetails);
			}
			itemsToSave.add(stockInvoiceDetails);

			// update parent
			totalQuantity = totalQuantity + stockInvoiceDetails.getIssuedQuantity();
			totalWeight = totalWeight.add(stockInvoiceDetails.getIssuedWeight());
			totalValue = totalValue.add(stockInvoiceDetails.getFinalValue()); // update value including tax
			totalDiscount= totalDiscount.add(stockInvoiceDetails.getItemLevelDiscount() != null ? stockInvoiceDetails.getItemLevelDiscount() : BigDecimal.ZERO);
		}
		Map<String, BigDecimal> data = new HashMap<>();
		data.put(TOTAL_QUANTITY, BigDecimal.valueOf(totalQuantity));
		data.put(TOTAL_WEIGHT, totalWeight);
		data.put(TOTAL_VALUE, totalValue);
		data.put(TOTAL_DISCOUNT, totalDiscount);
		return data;

	}
	
	private void saveTaxDetailForBTQCFA(StockInvoiceDetailsDao stockInvoiceDetails) {
		BigDecimal totalTax = BigDecimal.ZERO;
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
								&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("CGST")) {
							totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
						} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
								&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("SGST")) {
							totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
						} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
								&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("IGST")) {
							totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
						}
					}
				}
			}
		}
		stockInvoiceDetails.setTotalTax(totalTax.setScale(2, RoundingMode.HALF_UP));
		stockInvoiceDetails
				.setFinalValue(stockInvoiceDetails.getIssuedValue().add(totalTax)
						.subtract(stockInvoiceDetails.getItemLevelDiscount() != null
								? stockInvoiceDetails.getItemLevelDiscount()
								: BigDecimal.ZERO)
						.setScale(2, RoundingMode.HALF_UP));

	}
       


	private void saveTaxDetailsInReturnInvoice(StockInvoiceDetailsDao stockInvoiceDetails, String itemCode,
			BigDecimal stdValue, String transferType, LocationResponseDto locationDetails) {
		TaxCalculationResponseDto taxDetailsResponse = null;
		if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_GOLD_COIN.toString())
				|| transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.GEP.toString())
						&& !StringUtils.isEmpty(itemCode)) {
			taxDetailsResponse = engineClient.getTaxDetails(locationDetails.getFactoryDetails().getLocationCode(), 0,
					null, TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE_TEP_GEP.name(), itemCode, false, null);
		} 
//		else if (transferType.equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_CFA.toString())
//				&& !StringUtils.isEmpty(itemCode)) {
//			taxDetailsResponse = engineClient.getTaxDetails(locationDetails.getCfaDetails().getLocationCode(), 0, null,
//					TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.name(), itemCode, false, null);
//		}

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
		stockInvoiceDetails.setTaxDetails(MapperUtil.getStringFromJson(issueStockTaxDetails).replace("\\", "")
				.replace("\"[", "[").replace("]\"", "]"));
		JsonObject taxValueDetails = new JsonParser().parse(stockInvoiceDetails.getTaxDetails()).getAsJsonObject();
		BigDecimal igstVal = taxValueDetails.getAsJsonObject("data").get("IGSTVal").getAsBigDecimal();
		BigDecimal cgstVal = taxValueDetails.getAsJsonObject("data").get("CGSTVal").getAsBigDecimal();
		BigDecimal sgstVal = taxValueDetails.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
		BigDecimal utgstVal = taxValueDetails.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();
		BigDecimal finalTax = igstVal.add(cgstVal).add(sgstVal).add(utgstVal);
		stockInvoiceDetails.setTotalTax(finalTax.setScale(2, RoundingMode.HALF_UP));
		stockInvoiceDetails
				.setFinalValue(stockInvoiceDetails.getIssuedValue().add(finalTax).setScale(2, RoundingMode.HALF_UP));
	}

	private ItemsParamListDto createParamForJointList(String binGroup, Integer invoiceId, String invoiceType,
			String itemCode, String lotNumber, List<String> productCategory, List<String> productGroup, String status,
			String locationCode, String sortParameter, List<String> productGroupList, List<String> binCodeList,
			List<String> binGroupList, Date businessDate) {
		ItemsParamListDto params = new ItemsParamListDto();
		params.setBinGroupCode(binGroup);
		params.setHeaderId(invoiceId);
		params.setType(invoiceType);
		params.setItemCode(itemCode);
		params.setLotNumber(lotNumber);
		params.setProductCategory(productCategory);
		params.setProductGroups(productGroup);
		params.setStatus(status);
		params.setLocationCode(locationCode);
		params.setSortParameter(sortParameter);
		params.setProductGroupList(productGroupList);
		params.setBinCodeList(binCodeList);
		params.setBinGroupList(binGroupList);
		params.setBusinessDate(businessDate);
		return params;
	}

	private List<String> getOpenItemInventoryList(List<Object[]> listAvailableItems) {

		List<String> listProductDtls = new ArrayList<>();
		for (Object[] l : listAvailableItems) {
			listProductDtls.add((String) l[0]);

		}
		return listProductDtls;

	}

	public void updateTotalValues(Short totalQuantity, BigDecimal totalWeight, BigDecimal totalValue,
			Integer invoiceId, BigDecimal totalDiscount) {
		// verification if id is in OPEN state??
		stockInvoiceService.updateTotalValues(totalQuantity, totalWeight, totalValue, invoiceId,totalDiscount);
	}

	@Override
	@Transactional
	public void removeReturnInvoiceItems(Integer invoiceId, RemoveStockItemsDto removeStockItemsDto,
			String returnInvoiceType) {
		isAnL3User(CustomSecurityPrincipal.getSecurityPrincipal());
		BigDecimal totalWeight = BigDecimal.ZERO;
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalDiscount = BigDecimal.ZERO;
		Short totalQuantity = 0;
		// if items id is empty then do bulk delete
		if (removeStockItemsDto.getItemIds().isEmpty()) {
			StockInvoiceDao stockInvoice = stockInvoiceService.getOne(invoiceId);
			List<StockInvoiceDetailsDao> stockInvoiceDetailsList = stockInvoiceService.findByStockInvoice(stockInvoice);
			stockInvoiceService.deleteInBatch(stockInvoiceDetailsList);
			stockInvoice.setTotalIssuedWeight(totalWeight);
			stockInvoice.setTotalIssuedValue(totalValue);
			stockInvoice.setTotalIssuedQuantity(totalQuantity);
			stockInvoice.setTotalDiscount(totalDiscount);
			stockInvoiceService.saveInvoice(stockInvoice);
		} else {
			// if item id is available
			List<StockInvoiceDetailsDao> stockInvoiceDetails = stockInvoiceService
					.findAllById(removeStockItemsDto.getItemIds());
			for (StockInvoiceDetailsDao stockInvoiceDetail : stockInvoiceDetails) {
				totalWeight = totalWeight.add(stockInvoiceDetail.getIssuedWeight());
				totalValue = totalValue.add(stockInvoiceDetail.getFinalValue());
				totalQuantity = (short) (totalQuantity + stockInvoiceDetail.getIssuedQuantity());
				totalDiscount= totalDiscount.add(stockInvoiceDetail.getItemLevelDiscount() !=null?stockInvoiceDetail.getItemLevelDiscount():BigDecimal.ZERO);
			}
			stockInvoiceService.deleteInBatch(stockInvoiceDetails);
			StockInvoiceDao stockInvoice = stockInvoiceService.getOne(invoiceId);
			totalWeight = stockInvoice.getTotalIssuedWeight().subtract(totalWeight);
			totalValue = stockInvoice.getTotalIssuedValue().subtract(totalValue);
			totalQuantity = (short) (stockInvoice.getTotalIssuedQuantity() - totalQuantity);
			totalDiscount = stockInvoice.getTotalDiscount().subtract(totalDiscount);
			stockInvoice.setTotalIssuedWeight(totalWeight);
			stockInvoice.setTotalIssuedValue(totalValue);
			stockInvoice.setTotalIssuedQuantity(totalQuantity);
			stockInvoice.setTotalDiscount(totalDiscount);
			stockInvoiceService.saveInvoice(stockInvoice);
		}

	}

	@Override
	public ReturnInvoiceDto updateReturnInvoice(Integer invoiceId, ReturnInvoiceConFirmDto invoiceConfirmDto,
			String returnInvoiceType) {
		// only for L3 user
		isAnL3User(CustomSecurityPrincipal.getSecurityPrincipal());
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		CountryDetailsDto countryDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		StockInvoiceDao stockInvoice = stockInvoiceService.findById(invoiceId);
		// if the status is not OPEN then throw exception
		if (!stockInvoice.getStatus().equalsIgnoreCase(ReturnInvoiceStatus.OPEN.name()))
			throw new ServiceException("Stock Invoice is already ISSUED", ERR_INV_013);
		// validate JSON format
		validateJson(invoiceConfirmDto.getCarrierDetails());
//		List<StockInvoiceDetailsDao> stockInvoiceDetailsList = getInvoiceDetailsCriteria(invoiceId, returnInvoiceType);
		List<StockInvoiceDetailsDao> stockInvoiceDetailsList = stockInvoiceService.findAllStockInvoiceDetails(invoiceId,
				ReturnInvoiceStatus.SELECTED.toString());
		List<String> stockInvoiceIds = stockInvoiceDetailsList.stream().map(invDetail -> invDetail.getId())
				.collect(Collectors.toList());
		LOGGER.info("stockInvoiceIds - {}", stockInvoiceIds);
		BigDecimal totalIssuedValue = BigDecimal.ZERO;
		for (StockInvoiceDetailsDao stockInvoiceDetails : stockInvoiceDetailsList) {
			if (stockInvoiceDetails.getBinGroupCode().contains(BinGroupEnum.PURCFA.toString())) {
				totalIssuedValue = totalIssuedValue.add(stockInvoiceDetails.getIssuedValue());
			}
		}
		LOGGER.info("total issue value - {}", totalIssuedValue);

		validationForFivePercentCheck(totalIssuedValue);
		checkForIssuedQuantityInInventory(invoiceId);
		checkForRestrictedBins(invoiceId);

		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);

		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		List<InventoryDetailsDaoExt> invList = new ArrayList<>();
		// get remove items from inventory
		getRemoveItemsFromInventory(stockInvoice, invList, countryDto);
		if (statusMap.get(ISOFFLINE).booleanValue()) {
			SyncStagingDto stagingDto = returnInvoiceFacadeImp.updateReturnInvoiceAndStaging(invoiceId, stockInvoice,
					invList, ReturnInvoiceStatus.PUBLISHED.name(), invoiceConfirmDto, businessDayDto, countryDto,
					stockInvoiceIds);
			if (stagingDto != null) {
				inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(),
						stagingDto);
			}

		} else {
			returnInvoiceFacadeImp.updateReturnInvoiceAndStaging(invoiceId, stockInvoice, invList,
					ReturnInvoiceStatus.ISSUED.name(), invoiceConfirmDto, businessDayDto, countryDto, stockInvoiceIds);
			inventoryDetailsService.removeFromInventoryDetails(invList, stockInvoice.getSrcDocNo(), DocTypeEnum.RINV);
		}

		// asynchronously placing the return invoice file in the sftp server
		fileService.runReturnInvoiceJob(invoiceId, getBearerToken(CommonConstants.AUTH_HEADER),
				getBearerToken(CommonConstants.COOKIE_HEADER));
		try {
			if (!CollectionUtils.isEmpty(stockInvoiceDetailsList))
				eInvoiceCheck(stockInvoice, stockInvoiceDetailsList);
		} catch (Exception e) {
			LOGGER.info("Error in E-invoice generation" + e.getMessage());
		}
		return createInvoiceDtoResponse(stockInvoice);
	}

	@Override
	public ReturnInvoiceDto updateReturnInvoiceFilePublish(Integer invoiceId) {
		// only for L3 user
		isAnL3User(CustomSecurityPrincipal.getSecurityPrincipal());
		StockInvoiceDao stockInvoice = stockInvoiceService.findById(invoiceId);

		checkForIssuedQuantityInInventory(invoiceId);

		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);

		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		if (statusMap.get(ISOFFLINE).booleanValue()) {
			SyncStagingDto stagingDto = returnInvoiceFacadeImp.updateReturnInvoiceAndStagingFilePublish(invoiceId,
					stockInvoice);
			if (stagingDto != null) {
				inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(),
						stagingDto);
			}

		} else {
			returnInvoiceFacadeImp.updateReturnInvoiceAndStagingFilePublish(invoiceId, stockInvoice);
		}

		// asynchronously placing the return invoice file in the sftp server
		fileService.runReturnInvoiceJob(invoiceId, getBearerToken(CommonConstants.AUTH_HEADER),
				getBearerToken(CommonConstants.COOKIE_HEADER));
		return createInvoiceDtoResponse(stockInvoice);
	}

	private void eInvoiceCheck(StockInvoiceDao stockInvoice, List<StockInvoiceDetailsDao> stockInvoiceDetailsList) {
		LocationCacheDto locationCacheDtoBtq = engineService.getLocationDetail(stockInvoice.getSrcLocationCode());
		StoreDetails storeDetailsSource = locationCacheDtoBtq.getStoreDetails();
		if (BooleanUtils.isTrue(storeDetailsSource.getIsEinvoiceEnabled())
				&& !StringUtils.isEmpty(locationCacheDtoBtq.getTaxDetails().getGstRegisterationNo())) {
			InventoryInvoiceDocumentsDao inventoryInvoiceDocumentsDao = inventoryInvoiceDocumentsRepository
					.findByReferenceIdAndTransactionType(stockInvoice.getId().toString(),
							EinvoiceTransactionTypeEnum.RETURN_INVOICE.name());
			if (inventoryInvoiceDocumentsDao == null) {
				EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = generateInvoice(stockInvoice,
						stockInvoiceDetailsList);
				if (BooleanUtils.isTrue(einvoiceIrnDetailsResponseDto.getStatus())) {
					inventoryInvoiceDocumentsDao = MapperUtil.mapObjToClass(einvoiceIrnDetailsResponseDto,
							InventoryInvoiceDocumentsDao.class);
					inventoryInvoiceDocumentsDao.setReferenceId(stockInvoice.getId().toString());
					inventoryInvoiceDocumentsDao.setTransactionType(EinvoiceTransactionTypeEnum.RETURN_INVOICE.name());
					inventoryInvoiceDocumentsRepository.save(inventoryInvoiceDocumentsDao);
				}
			}
		}
	}

	private EinvoiceIrnDetailsResponseDto generateInvoice(StockInvoiceDao stockInvoice,
			List<StockInvoiceDetailsDao> stockInvoiceDetailsList) {
		LocationCacheDto locationCacheDtoBtq = engineService.getLocationDetail(stockInvoice.getSrcLocationCode());
		LocationCacheDto locationCacheDtoFact = engineService.getLocationDetail(stockInvoice.getDestLocationCode());
		EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = new EinvoiceIrnDetailsResponseDto();
		if (!StringUtils.isEmpty(locationCacheDtoBtq.getTaxDetails().getGstRegisterationNo())
				&& !StringUtils.isEmpty(locationCacheDtoFact.getTaxDetails().getGstRegisterationNo())
				&& !locationCacheDtoBtq.getTaxDetails().getGstRegisterationNo()
						.equalsIgnoreCase(locationCacheDtoFact.getTaxDetails().getGstRegisterationNo())) {

			EinvoiceIrnDetailsDto einvoiceIrnDetailsDto = getCustomerDetails(stockInvoice.getSrcDocNo().toString(),
					stockInvoice.getSrcDocDate(), locationCacheDtoBtq, locationCacheDtoFact);
			List<EinvoiceItemDetailsDto> einvoiceItemDetailsDtoList = new ArrayList<>();
			einvoiceIrnDetailsDto.setTransactionId(stockInvoice.getId().toString());
			stockInvoiceDetailsList.forEach(stockInvoiceDetails -> {
				EinvoiceItemDetailsDto einvoiceItemDetailsDto = new EinvoiceItemDetailsDto();
				einvoiceItemDetailsDto.setSerialNo(stockInvoiceDetailsList.indexOf(stockInvoiceDetails) + 1);
				List<String> itemCodes = new ArrayList<>();
				itemCodes.add(stockInvoiceDetails.getItemCode());
				Map<String, ItemDetailsDto> itemsDetailMap = engineService.listItemDetails(itemCodes);
				ItemDetailsDto itemDetailsDto = itemsDetailMap.get(stockInvoiceDetails.getItemCode());
				if (itemDetailsDto.getHsnCode() != null)
					einvoiceItemDetailsDto.setHsnCode(itemDetailsDto.getHsnCode());
				einvoiceItemDetailsDto.setQuantity(stockInvoiceDetails.getIssuedQuantity().intValue());
				einvoiceItemDetailsDto.setUnit(stockInvoiceDetails.getWeightUnit());
				einvoiceItemDetailsDto.setUnitPrice(stockInvoiceDetails.getStdValue());
				einvoiceItemDetailsDtoList.add(einvoiceItemDetailsDto);

			});
			einvoiceIrnDetailsDto.setEinvoiceItemDetailsDto(einvoiceItemDetailsDtoList);
			einvoiceIrnDetailsResponseDto = integrationServiceClient.generateIrn(VendorCodeEnum.IRN_ASPTAX.name(),
					EinvoiceTransactionTypeEnum.RETURN_INVOICE.name(), einvoiceIrnDetailsDto);
		}
		return einvoiceIrnDetailsResponseDto;
	}

	public EinvoiceIrnDetailsDto getCustomerDetails(String docNo, Date docDate, LocationCacheDto locationCacheDtoBtq,
			LocationCacheDto locationCacheDtoFact) {
		EinvoiceIrnDetailsDto einvoiceIrnDetailsDto = new EinvoiceIrnDetailsDto();
		einvoiceIrnDetailsDto.setDocNo(docNo);
		einvoiceIrnDetailsDto.setDocDate(docDate);
		StoreDetails storeDetailsBtq = locationCacheDtoBtq.getStoreDetails();
		TaxDetails taxDetailsBtq = locationCacheDtoBtq.getTaxDetails();
		if (taxDetailsBtq.getGstRegisterationNo() != null)
			einvoiceIrnDetailsDto.setSellerGstn(taxDetailsBtq.getGstRegisterationNo());
		einvoiceIrnDetailsDto.setSellerName(storeDetailsBtq.getCompanyName());
		einvoiceIrnDetailsDto.setSellerPinCode(Integer.parseInt(storeDetailsBtq.getPincode()));
		List<String> addressDetailsBtq = storeDetailsBtq.getAddressLines();
		if (!CollectionUtils.isEmpty(addressDetailsBtq)) {
			String btqAaddress1 = null;
			String btqAddress2 = null;
			Integer size = addressDetailsBtq.size();
			if (size >= 1 && !StringUtils.isEmpty(addressDetailsBtq.get(0)))
				btqAaddress1 = addressDetailsBtq.get(0);
			if (size >= 2 && !StringUtils.isEmpty(addressDetailsBtq.get(1)))
				btqAaddress1 = btqAaddress1 + ", " + addressDetailsBtq.get(1);
			einvoiceIrnDetailsDto.setSellerAddress1(btqAaddress1);
			if (size >= 3 && !StringUtils.isEmpty(addressDetailsBtq.get(2)))
				btqAddress2 = addressDetailsBtq.get(2);
			if (size >= 4 && !StringUtils.isEmpty(addressDetailsBtq.get(3)))
				btqAddress2 = btqAddress2 + ", " + addressDetailsBtq.get(3);
			einvoiceIrnDetailsDto.setSellerAddress2(btqAddress2);
		}
		einvoiceIrnDetailsDto.setSellerlocation(locationCacheDtoBtq.getLocationCode());
		StoreDetails storeDetailsFact = locationCacheDtoFact.getStoreDetails();
		TaxDetails taxDetailsFact = locationCacheDtoFact.getTaxDetails();
		if (taxDetailsFact.getGstRegisterationNo() != null)
			einvoiceIrnDetailsDto.setBuyerGstn(taxDetailsFact.getGstRegisterationNo());
		einvoiceIrnDetailsDto.setBuyerName(storeDetailsFact.getCompanyName());
		einvoiceIrnDetailsDto.setBuyerPinCode(Integer.parseInt(storeDetailsFact.getPincode()));
		List<String> addressDetailsFact = storeDetailsFact.getAddressLines();
		if (!CollectionUtils.isEmpty(addressDetailsFact)) {
			String factAaddress1 = null;
			String factAddress2 = null;
			Integer size = addressDetailsFact.size();
			if (size >= 1 && !StringUtils.isEmpty(addressDetailsFact.get(0)))
				factAaddress1 = addressDetailsFact.get(0);
			if (size >= 2 && !StringUtils.isEmpty(addressDetailsFact.get(1)))
				factAaddress1 = factAaddress1 + ", " + addressDetailsFact.get(1);
			einvoiceIrnDetailsDto.setBuyerAddress1(factAaddress1);
			if (size >= 3 && !StringUtils.isEmpty(addressDetailsFact.get(2)))
				factAddress2 = addressDetailsFact.get(2);
			if (size >= 4 && !StringUtils.isEmpty(addressDetailsFact.get(3)))
				factAddress2 = factAddress2 + ", " + addressDetailsFact.get(3);
			einvoiceIrnDetailsDto.setBuyerAddress2(factAddress2);
		}
		einvoiceIrnDetailsDto.setBuyerlocation(locationCacheDtoFact.getLocationCode());

		return einvoiceIrnDetailsDto;
	}

	/**
	 * @param invoiceId
	 * @param stockInvoice
	 * @param invList
	 * @param name
	 * @param countryDto
	 * @param businessDayDto
	 * @param invoiceConfirmDto
	 * @param stockInvoiceIds
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto updateReturnInvoiceAndStaging(Integer invoiceId, StockInvoiceDao stockInvoice,
			List<InventoryDetailsDaoExt> invList, String status, ReturnInvoiceConFirmDto invoiceConfirmDto,
			BusinessDayDto businessDayDto, CountryDetailsDto countryDto, List<String> stockInvoiceIds) {
		saveInvoiceAndChangeItemDetailStatus(invoiceConfirmDto, stockInvoice, businessDayDto, countryDto, status);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		if (status.equals(StockTransferStatusEnum.PUBLISHED.name())) {
			syncStagingDto = returnInvoiceFacadeImp.getStagingDto(invList, stockInvoice);
		}
		LOGGER.info("stockInvoiceIds - {}", stockInvoiceIds);
		// update header tablem
//		stockInvoiceService.updateTotalWeightAndQuantity(invoiceId, new Date(),
//				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());

		stockInvoiceService.updateTotalWeightAndQuantityData(invoiceId, stockInvoiceIds, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		return syncStagingDto;
	}

	/**
	 * @param invoiceId
	 * @param stockInvoice
	 * @param invList
	 * @param name
	 * @param countryDto
	 * @param businessDayDto
	 * @param invoiceConfirmDto
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto updateReturnInvoiceAndStagingFilePublish(Integer invoiceId, StockInvoiceDao stockInvoice) {
		saveInvoiceAndChangeItemDetailStatusFilePublish(stockInvoice);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		// update header table
		stockInvoiceService.updateTotalWeightAndQuantity(invoiceId, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		return syncStagingDto;
	}

	/**
	 * @param invList
	 * @param stockInvoice
	 * @return SyncStagingDto
	 */
	public SyncStagingDto getStagingDto(List<InventoryDetailsDaoExt> invList, StockInvoiceDao stockInvoice) {
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		InventoryDetailsSyncDtoExt returnInvoiceSyncDto = new InventoryDetailsSyncDtoExt();
		List<SyncData> invReturnSyncDatas = new ArrayList<>();
		if (!invList.isEmpty()) {
			invReturnSyncDatas.add(DataSyncUtil
					.createSyncData(returnInvoiceSyncDto.getSyncDtoExtList(invList, stockInvoice.getId()), 0));
			List<String> destinations = new ArrayList<>();
			destinations.add(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			MessageRequest messageRequest = DataSyncUtil.createMessageRequest(invReturnSyncDatas,
					InventoryOperationCodes.INV_RINV_POSS_ADD, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			syncStagingDto.setMessageRequest(messageRequest);
			String requestBody = MapperUtil.getJsonString(messageRequest);
			// saving to staging table
			SyncStaging invoiceReturnStaging = new SyncStaging();
			invoiceReturnStaging.setMessage(requestBody);
			invoiceReturnStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			invoiceReturnStaging = inventorySyncStagingRepository.save(invoiceReturnStaging);
			syncStagingDto.setId(invoiceReturnStaging.getId());
		}
		return syncStagingDto;
	}

	private void saveInvoiceAndChangeItemDetailStatus(ReturnInvoiceConFirmDto invoiceConfirmDto,
			StockInvoiceDao stockInvoice, BusinessDayDto businessDayDto, CountryDetailsDto countryDto, String status) {
		stockInvoice.setCarrierDetails(MapperUtil.getStringFromJson(invoiceConfirmDto.getCarrierDetails()));
		stockInvoice.setStatus(status);
		stockInvoice.setIssuedRemarks(invoiceConfirmDto.getRemarks());
		stockInvoice.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		stockInvoice.setDestLocationCode(invoiceConfirmDto.getCfaLocationCode());
		stockInvoice.setSrcDocNo(inventoryDocMasterService.getDocNumber(countryDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.RINV.toString()));
		stockInvoice.setSrcDocDate(businessDayDto.getBusinessDate());
		stockInvoice.setSrcFiscalYear(countryDto.getFiscalYear().shortValue());
		stockInvoiceService.saveInvoice(stockInvoice);
		stockInvoiceService.changeItemDetailStatus(status, stockInvoice);
	}

	private void saveInvoiceAndChangeItemDetailStatusFilePublish(StockInvoiceDao stockInvoice) {
		// stockInvoice.setStatus(status);
		stockInvoice.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		stockInvoice.setFilePublished(false);
		stockInvoiceService.saveInvoice(stockInvoice);

	}

	private void checkForRestrictedBins(Integer invoiceId) {
		// Query to check restricted bins before issue
		List<QuantityCheckDto> items = checkIssueBinValidation(invoiceId);

		// if bin-group got change before issue. throw exception
		if (!items.isEmpty()) {
			throw new ServiceException("Following items Bingroup has been changed so couldnot confirm" + items,
					"ERR-INV-037", items);
		}
	}

	private void checkForIssuedQuantityInInventory(Integer invoiceId) {
		// query to check issued quantity> inventory quantity.
		List<QuantityCheckDto> itemIds = checkQuantityValidation(invoiceId);
		if (!itemIds.isEmpty()) {
			throw new ServiceException(
					"Following Id's have requested quantity more than availanble inventory's quantity" + itemIds,
					"ERR-INV-017", itemIds);
		}
	}

	private void validationForFivePercentCheck(BigDecimal totalIssuedValue) {
		// getting previous year
		Short previousYear = (short) (Year.now().getValue() - 1);
		Optional<StoreRevenueDao> storeRevenue = storeRevenueRepository.findByFiscalYearAndLocationCode(previousYear,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		// check 5% return invoice logic
		// if total return value exceeds previous year's 5% return value then throw
		// exception
		if (storeRevenue.isPresent() && !checkFivePercentReturnInvoice(totalIssuedValue, storeRevenue.get(),
				(short) Year.now().getValue())) {
			throw new ServiceException(
					"Return invoice amount should not be more than 5% of previous year return amount", "ERR-INV-020");
		}
	}

	// Issue Bin Group Validation...get Data from DB
	private List<QuantityCheckDto> checkIssueBinValidation(Integer id) {
		List<QuantityCheckDto> itemIds = new ArrayList<>();
		List<Object[]> availableItemList = stockInvoiceService.checkBinValidationWithInventory(id);

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
			if (!violationsCourier.isEmpty())
				throw new ServiceException("JSON data format error", ERR_CORE_013, str);

		} else if ("employee".equals(type)) {
			// if type is employee
			HandCarryEmployeeData handCarryEmployeeData = MapperUtil.getObjectMapperInstance()
					.convertValue(jsonData.getData(), HandCarryEmployeeData.class);
			Set<ConstraintViolation<HandCarryEmployeeData>> violationsHandCarryEmp = validator
					.validate(handCarryEmployeeData);
			violationsHandCarryEmp.forEach(violation -> str.add(violation.getMessage()));
			if (!violationsHandCarryEmp.isEmpty())
				throw new ServiceException("JSON data format error", ERR_CORE_013, str);

		} else {
			// throw exception
			throw new ServiceException("Invalid Request type & JSON type.JSON type : " + type, ERR_CORE_013);
		}
	}

	private List<StockInvoiceDetailsDao> getInvoiceDetailsCriteria(Integer invoiceId, String returnInvoiceType) {
		StockInvoiceDao stInvoice = new StockInvoiceDao();
		stInvoice.setId(invoiceId);
		stInvoice.setSrcLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		stInvoice.setInvoiceType(returnInvoiceType);
		stInvoice.setStatus(ReturnInvoiceStatus.OPEN.toString());
		StockInvoiceDetailsDao stInvoiceDetails = new StockInvoiceDetailsDao();
		stInvoiceDetails.setStockInvoice(stInvoice);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StockInvoiceDetailsDao> stInvDetailsExample = Example.of(stInvoiceDetails, matcher);
		return stockInvoiceService.getInvoiceItem(stInvDetailsExample);
	}

	// Inventory update implementation while ISSUE

	private void getRemoveItemsFromInventory(StockInvoiceDao stockInvoice, List<InventoryDetailsDaoExt> invList,
			CountryDetailsDto countryDto) {

//		List<StockInvoiceDetailsDao> stockInvoiceDetailsList = stockInvoiceService
//				.findByStockInvoiceAndStatus(stockInvoice, ReturnInvoiceStatus.SELECTED.toString());	
		List<StockInvoiceDetailsDao> stockInvoiceDetailsList = stockInvoiceService
				.findAllStockInvoiceDetails(stockInvoice.getId(), ReturnInvoiceStatus.SELECTED.toString());
		LOGGER.info("in getRemoveItemsFromInventory stockInvoiceDetailsList - {}", stockInvoiceDetailsList);
		String correlationId = UUID.randomUUID().toString();
		List<String> invIds = new ArrayList<>();
		for (StockInvoiceDetailsDao stockInvoiceDetails : stockInvoiceDetailsList) {

			InventoryDetailsDaoExt inventoryDetail = (InventoryDetailsDaoExt) MapperUtil
					.getDtoMapping(stockInvoiceDetails, InventoryDetailsDaoExt.class);
			inventoryDetail.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			inventoryDetail.setTotalQuantity(stockInvoiceDetails.getIssuedQuantity());
			inventoryDetail.setTotalWeight(stockInvoiceDetails.getIssuedWeight());
			inventoryDetail.setTotalValue(stockInvoiceDetails.getIssuedValue());
			inventoryDetail.setId(stockInvoiceDetails.getInventoryId());
			inventoryDetail.setSerialNumber(String.valueOf(stockInvoiceDetails.getStdWeight()));
			inventoryDetail.setOrgCode(stockInvoice.getOrgCode());
			inventoryDetail.setActionType(InventoryDetailsActionEnum.REMOVE.name());
			inventoryDetail.setDocNumber(stockInvoice.getSrcDocNo());
			inventoryDetail.setDocType(DocTypeEnum.RINV.name());
			inventoryDetail.setFiscalYear(countryDto.getFiscalYear().shortValue());
			inventoryDetail.setCorrelationId(correlationId);
			invList.add(inventoryDetail);
			invIds.add(stockInvoiceDetails.getInventoryId());

		}

		List<InventoryDetailsDaoExt> invUpdatedList = inventoryDetailsRepository.findAllByIdIn(invIds);
		for (StockInvoiceDetailsDao stockInvoiceDetails : stockInvoiceDetailsList) {
			for (InventoryDetailsDaoExt in : invUpdatedList) {
				if (stockInvoiceDetails.getInventoryId().equals(in.getId())) {
					// updating issued quantity alone, before datasync
					in.setIssuedQuantity(
							(short) (in.getIssuedQuantity() + stockInvoiceDetails.getIssuedQuantity().shortValue()));
				}
			}

		}
		inventoryDetailsRepository.saveAll(invUpdatedList);
	}

	private List<QuantityCheckDto> checkQuantityValidation(Integer id) {
		List<QuantityCheckDto> itemIds = new ArrayList<>();
		List<Object[]> availableItemList = stockInvoiceService.checkAvailableQuantityWithInventory(id);
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

	private boolean checkFivePercentReturnInvoice(BigDecimal stnAmount, StoreRevenueDao storeRevenue,
			Short currentYear) {
		boolean isValid = true;
		BigDecimal previousYearReturnAmtAllowed = storeRevenue.getYearRevenue()
				.multiply(new BigDecimal(returnInvoicePercent));
		previousYearReturnAmtAllowed = previousYearReturnAmtAllowed.divide(new BigDecimal(100));
		Optional<StoreRevenueDao> storeRevenueCurrentFiscalYear = storeRevenueRepository
				.findByFiscalYearAndLocationCode(currentYear,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		if (!storeRevenueCurrentFiscalYear.isPresent())
			throw new ServiceException(RECORDS_NOT_FOUND, ERR_INV_029);

		if (storeRevenueCurrentFiscalYear.get().getReturnValue() == null)
			storeRevenueCurrentFiscalYear.get().setReturnValue(BigDecimal.ZERO);

		BigDecimal currentYearReturnAmt = stnAmount.add(storeRevenueCurrentFiscalYear.get().getReturnValue());

		if (currentYearReturnAmt.compareTo(previousYearReturnAmtAllowed) > 0) {
			isValid = false;
		} else {
			storeRevenueCurrentFiscalYear.get().setReturnValue(currentYearReturnAmt);
			storeRevenueRepository.save(storeRevenueCurrentFiscalYear.get());
		}

		return isValid;

	}

	private ReturnInvoiceDto createInvoiceDtoResponse(StockInvoiceDao stockInvoice) {
		ReturnInvoiceDto returnInvoiceDto = (ReturnInvoiceDto) MapperUtil.getDtoMapping(stockInvoice,
				ReturnInvoiceDto.class);
		returnInvoiceDto.setTotalAvailableQuantity(stockInvoice.getTotalReceivedQuantity());
		returnInvoiceDto.setTotalMeasuredQuantity(stockInvoice.getTotalIssuedQuantity());
		returnInvoiceDto.setTotalAvailableWeight(stockInvoice.getTotalReceivedWeight());
		returnInvoiceDto.setTotalMeasuredWeight(stockInvoice.getTotalIssuedWeight());
		returnInvoiceDto.setTotalAvailableValue(stockInvoice.getTotalReceivedValue());
		returnInvoiceDto.setTotalMeasuredValue(stockInvoice.getTotalIssuedValue());
		returnInvoiceDto.setDestLocationCode(stockInvoice.getDestLocationCode());
		return returnInvoiceDto;
	}

	@Override
	public ResponseEntity<Resource> getStockReturnInvoicePDF(Integer id, String invoiceType) {
		isAnL3User(CustomSecurityPrincipal.getSecurityPrincipal());

		String invoiceType_grn = invoiceType;
		if (invoiceType_grn.equals("BTQ_CFA_GRN")) {
			invoiceType = "BTQ_CFA";
		}

		List<InventoryChild> inventoryChildList = new ArrayList<>();
		ReturnInvoicePrintHeader stockReceiveStockDto;
		Optional<StockInvoiceDao> stockInvoices = stockInvoiceService.findByIdAndInvoiceType(id, invoiceType);
		BigDecimal totalFinalValue = new BigDecimal(0);
		BigDecimal totalStdValue = new BigDecimal(0);
		BigDecimal totalTax = new BigDecimal(0);
		BigDecimal totalDiscount = BigDecimal.ZERO;
		StockInvoiceDao stockInvoice;
		if (stockInvoices.isPresent()) {
			stockInvoice = stockInvoices.get();
		} else {
			throw new ServiceException("improperId passed", "no data available");
		}

		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();

		BrandDto brandDto = engineService.getBrand(authUser.getBrandCode());

		if (stockInvoice.getStatus().equals(StockIssueTransferTypeStatusEnum.ISSUED.toString())) {
			stockReceiveStockDto = (ReturnInvoicePrintHeader) MapperUtil.getDtoMapping(stockInvoice,
					ReturnInvoicePrintHeader.class);
			Short printCount = InventoryUtil.checkPrintMaxConfig(brandDto, stockInvoice.getPrints());
			stockReceiveStockDto.setTotalIssuedValueInWords(String.valueOf(stockReceiveStockDto.getTotalIssuedValue()));
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
			stockReceiveStockDto.setSrcDate(simpleDateFormat.format(stockReceiveStockDto.getSrcDocDate()));
			List<StockInvoiceDetailsDao> stockInvoiceList = stockInvoiceService.findByStockInvoice(stockInvoice);
			for (StockInvoiceDetailsDao stockInvoiceDetail : stockInvoiceList) {
				InventoryChild inventoryChild;
				inventoryChild = (InventoryChild) MapperUtil.getDtoMapping(stockInvoiceDetail, InventoryChild.class);
				ItemsDto itemDto = engineClient.getItemDetails(inventoryChild.getItemCode());
				JsonData jsonData = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(stockInvoiceDetail.getTaxDetails()), JsonData.class);

				BigDecimal itemTax = new BigDecimal(0);

				if (stockInvoice.getInvoiceType().equalsIgnoreCase(StockIssueTransferTypeEnum.BTQ_CFA.name())) {
					JsonData isacDetailsJson = MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(stockInvoiceDetail.getIsacDetails()), JsonData.class);
					if (isacDetailsJson.getData() != null) {
						JsonObject jsonObject = new JsonParser()
								.parse(MapperUtil.getJsonString(isacDetailsJson.getData())).getAsJsonObject();
						if (jsonObject != null) {
							JsonArray isacDetails = jsonObject.get("IsacDetails").getAsJsonArray();
							for (int i = 0; i < isacDetails.size(); i++) {
								JsonObject isacDetail = isacDetails.get(i).getAsJsonObject();
								if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
										&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("CGST")) {
									inventoryChild.setCgst(isacDetail.get("amount").getAsBigDecimal());
									itemTax = itemTax.add(isacDetail.get("amount").getAsBigDecimal());
									inventoryChild.setCgstPercentage(isacDetail.get("percentage").getAsBigDecimal());
								}
								if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
										&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("SGST")) {
									inventoryChild.setSgst(isacDetail.get("amount").getAsBigDecimal());
									itemTax = itemTax.add(isacDetail.get("amount").getAsBigDecimal());
									inventoryChild.setSgstPercentage(isacDetail.get("percentage").getAsBigDecimal());

									if (isacDetail.get("amount").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
										stockReceiveStockDto.setTaxHeader("SGST");
										inventoryChild.setTaxValue(isacDetail.get("amount").getAsBigDecimal());
										inventoryChild.setTaxPercentage(isacDetail.get("percentage").getAsBigDecimal());
									}
								}
								if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
										&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("IGST")) {
									inventoryChild.setIgst(isacDetail.get("amount").getAsBigDecimal());
									itemTax = itemTax.add(isacDetail.get("amount").getAsBigDecimal());
									inventoryChild.setIgstPercentage(isacDetail.get("percentage").getAsBigDecimal());

									if (isacDetail.get("amount").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
										stockReceiveStockDto.setTaxHeader("IGST");
										inventoryChild.setTaxValue(isacDetail.get("amount").getAsBigDecimal());
										inventoryChild.setTaxPercentage(isacDetail.get("percentage").getAsBigDecimal());
									}
								}
								inventoryChild.setUgst(BigDecimal.ZERO);
								inventoryChild.setUtgstPercentage(BigDecimal.ZERO);
							}
							inventoryChild.setItemTax(itemTax);
							totalTax = totalTax.add(itemTax);
						}
					}
				} else {
					if (jsonData.getData() != null) {
						JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(jsonData.getData()))
								.getAsJsonObject();
						if (jsonObject != null) {
							if (jsonObject.get("SGSTVal") != null) {
								inventoryChild.setSgst(jsonObject.get("SGSTVal").getAsBigDecimal());
								itemTax = itemTax.add(jsonObject.get("SGSTVal").getAsBigDecimal());
								inventoryChild.setSgstPercentage(jsonObject.get("SGSTPct").getAsBigDecimal());

								if (jsonObject.get("SGSTVal").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
									stockReceiveStockDto.setTaxHeader("SGST");
									inventoryChild.setTaxValue(jsonObject.get("SGSTVal").getAsBigDecimal());
									inventoryChild.setTaxPercentage(jsonObject.get("SGSTPct").getAsBigDecimal());
								}
							} else {
								inventoryChild.setSgst(BigDecimal.ZERO);
								inventoryChild.setSgstPercentage(BigDecimal.ZERO);
							}
							if (jsonObject.get("UTGSTVal") != null) {
								inventoryChild.setUgst(jsonObject.get("UTGSTVal").getAsBigDecimal());
								itemTax = itemTax.add(jsonObject.get("UTGSTVal").getAsBigDecimal());
								if (jsonObject.get("UTGSTPct") != null)
									inventoryChild.setUtgstPercentage(jsonObject.get("UTGSTPct").getAsBigDecimal());
								else
									inventoryChild.setUtgstPercentage(jsonObject.get("UTSTPct").getAsBigDecimal());

								if (jsonObject.get("UTGSTVal").getAsBigDecimal().compareTo(BigDecimal.ZERO) != 0) {
									stockReceiveStockDto.setTaxHeader("UTGST");
									inventoryChild.setTaxValue(jsonObject.get("UTGSTVal").getAsBigDecimal());
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
					}
				}
				if (itemDto.getProductType() != null) {
					inventoryChild.setProductType(itemDto.getProductType());
				}

				inventoryChild.setHsnCode(itemDto.getHsnSacCode());
				if (inventoryChild.getFinalValue() != null) {
					totalFinalValue = totalFinalValue.add(inventoryChild.getFinalValue());
				} else {
					inventoryChild.setFinalValue(inventoryChild.getStdValue().add(itemTax)
							.multiply(new BigDecimal(inventoryChild.getIssuedQuantity())));
					totalFinalValue = totalFinalValue.add(inventoryChild.getFinalValue());
				}
				// System.out.println("The std value "+ inventoryChild.getStdValue());
				if (inventoryChild.getStdValue() != null) {
					totalStdValue = totalStdValue.add(inventoryChild.getStdValue());
					// System.out.println("total std value "+ totalStdValue);
				}

				if (inventoryChild.getItemLevelDiscount() == null) {
					inventoryChild.setItemLevelDiscount(BigDecimal.ZERO);
				}
				totalDiscount = totalDiscount.add(inventoryChild.getItemLevelDiscount());

				inventoryChildList.add(inventoryChild);
			}
			String totalPrice = "";
			String remarks = stockInvoice.getIssuedRemarks();
			InventoryPrint inventoryPrint = new InventoryPrint();
			stockReceiveStockDto.setTotalTax(totalTax);
			inventoryPrint.setReturnInvoicePrintHeader(stockReceiveStockDto);
			inventoryPrint.setInventoryChildList(inventoryChildList);
			inventoryPrint.setSrcLocationData(
					engineService.getLocationDetailWithTaxCode(stockReceiveStockDto.getSrcLocationCode()));
			inventoryPrint.setDestLocationData(
					engineService.getLocationDetailWithTaxCode(stockReceiveStockDto.getDestLocationCode()));
			inventoryPrint.setRemarks(remarks);
			inventoryPrint.setTotalPrice(totalPrice);

			totalFinalValue = totalFinalValue.setScale(0, RoundingMode.HALF_UP);
			stockReceiveStockDto.setTotalFinalValue(totalFinalValue);
			inventoryPrint.setPriceInWords(numberToWordsFactory.getPriceInWords(totalFinalValue.longValue(),
					DomainConstants.ASIAN_PRICE_TYPE));
			stockReceiveStockDto.setTotalStdValue(totalStdValue);
			stockReceiveStockDto.setTotalDiscount(totalDiscount);
			stockReceiveStockDto
					.setTotalTaxableAmount((totalFinalValue.subtract(totalTax)).setScale(0, RoundingMode.HALF_UP));

			ObjectMapper object = new ObjectMapper();
			String courierDataStr = stockInvoice.getCarrierDetails();
			JsonNode courierDataJsonNode = null;
			try {
				courierDataJsonNode = object.readValue(courierDataStr, JsonNode.class);
			} catch (IOException e) {
				e.printStackTrace();
			}
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

			inventoryPrint.getReturnInvoicePrintHeader().setEinvoice(getEinvoice(id));
			inventoryService.nullCheckForMandatoryFields(inventoryPrint);
			if (stockInvoice.getCurrencyCode().equals(CommonConstants.CURRENCY_CODE))
				inventoryPrint.setCurrency("Rupees");
			inventoryPrint.setCourierData(courierData);
			inventoryPrint.setLockNumber(lockNumber.toString().replaceAll("\"", ""));

			if (invoiceType_grn.equals("BTQ_CFA_GRN")) {
				printCount--;
			}
			
			if (printCount > 1) {
				inventoryPrint.setDocument("DUPLICATE");
			} else {
				inventoryPrint.setDocument("ORIGINAL");
			}

			String templateName = "returnInvoice.ftl";
			switch (stockReceiveStockDto.getInvoiceType()) {
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
				inventoryPrint.setTxnTypeDetail("Botique to CFA ");
				templateName = "returnInvoiceCFA_A.ftl";
				break;
			default:
				break;
			}

			if (invoiceType_grn.equals("BTQ_CFA_GRN")) {
				templateName = "returnInvoiceCFA_B.ftl";
			}

			if (inventoryPrint.getTxnTypeDetail() != null
					&& inventoryPrint.getTxnTypeDetail().equalsIgnoreCase("Botique to CFA")) {
				inventoryPrint.setApprovalCode("Approved by Merchandise");
			} else {
				inventoryPrint.setApprovalCode("Approved by Factory ");
			}
			String html;
			try {
				Template t = freemarkerConfig.getTemplate(templateName);
				html = FreeMarkerTemplateUtils.processTemplateIntoString(t, inventoryPrint);
				if (!invoiceType_grn.equals("BTQ_CFA_GRN")) {
					stockInvoiceService.updatePrintCountStockIssue(printCount, stockInvoice.getId());
				}
			} catch (Exception e) {
				throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
			}
			return generatePdf(html, stockReceiveStockDto.getInvoiceType(), stockReceiveStockDto.getId());
		} else {
			throw new ServiceException("cannot print for non issued", "");
		}
	}

	/**
	 * @param id
	 * @return
	 */
	private EinvoiceDto getEinvoice(Integer txnId) {
		InventoryInvoiceDocumentsDao id = inventoryInvoiceDocumentsRepository.findByReferenceIdAndTransactionType(
				txnId.toString(), EinvoiceTransactionTypeEnum.RETURN_INVOICE.name());
		if (id == null)
			return null;

		EinvoiceDto einvoice = (EinvoiceDto) MapperUtil.getObjectMapping(id, new EinvoiceDto());
		einvoice.setQrCode(QRCodeGenerator.getQrCodeBase64(einvoice.getQrCodeValue(), 1000, 1000));

		return einvoice;
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

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

	private String getBearerToken(String tokenType) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		HttpServletRequest request = null;
		if (authentication != null) {
			request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		}
		if (request != null) {
			return request.getHeader(tokenType);
		} else {
			return null;
		}
	}

	@Override
	public ReturnInvoiceDto getReturnInvoiceDetail(Integer invoiceId, String invoiceType, String status) {
		isAnL3User(CustomSecurityPrincipal.getSecurityPrincipal());

		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		List<String> binGroupList = null;
		Map<String, String> productGroupMap;
		List<String> productGroup = null;
		if (invoiceType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_PLAIN.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(L3BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Plain CFA's
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L3BinGroupCodeEnum.TEP.toString());
			productGroup = getListProductGroup(productGroupMap);

		} else if (invoiceType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_STUDDED.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(L3BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.S.toString(),
					L3BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroup = getListProductGroup(productGroupMap);
		} else if (invoiceType.equalsIgnoreCase(StockIssueTransferTypeEnum.TEP_GOLD_COIN.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(L3BinGroupCodeEnum.TEP.toString());
			productGroupMap = engineService.getProductGroups(PlainStuddedEnum.P.toString(),
					L1BinGroupCodeEnum.TEP.toString());
			// call Product LiteController for list of Studded CFA's
			productGroupMap.keySet().removeIf(k -> !(k.equals(ProductGroupCodeEnum.GOLD_COIN.getCode())));
			productGroup = getListProductGroup(productGroupMap);
		} else if (invoiceType.equalsIgnoreCase(ReturnInvoiceType.BTQ_CFA.toString())) {
			binGroupList = new ArrayList<>();
			binGroupList.add(BinGroupEnum.DEFECTIVE.toString());
			binGroupList.add(BinGroupEnum.DISPUTE.toString());
			binGroupList.add(L3BinGroupCodeEnum.PURCFA.toString());
			binGroupList.add(BinGroupEnum.CUSTOMERORDERBIN.toString());
			binGroupList.add(BinGroupEnum.FOC.toString());

		} else {
			binGroupList = new ArrayList<>();
			binGroupList.add(invoiceType);
		}
		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		List<StockInvoiceDao> stockInvoiceList = stockInvoiceService.findByInvoiceTypeAndStatusAndSrcLocationCode(
				invoiceType, ReturnInvoiceStatus.OPEN.toString(), locationCode);

		List<Object[]> listAvailableItems;

		if (invoiceType.equalsIgnoreCase(ReturnInvoiceType.BTQ_CFA.toString())) {
			listAvailableItems = stockInvoiceService.getJointBtqCfaListDetail(invoiceId, productGroup, status,
					locationCode, binGroupList, businessDayDto.getBusinessDate());
		} else {
			listAvailableItems = stockInvoiceService.getJointListDetail(invoiceId, productGroup, status, locationCode,
					binGroupList, businessDayDto.getBusinessDate());

		}

		return getInvoiceDetail(listAvailableItems, stockInvoiceList.get(0));
	}

	private ReturnInvoiceDto getInvoiceDetail(List<Object[]> listAvailableItems, StockInvoiceDao stockInvoice) {

		ReturnInvoiceDto returnInvoiceDto = (ReturnInvoiceDto) MapperUtil.getDtoMapping(stockInvoice,
				ReturnInvoiceDto.class);
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
		returnInvoiceDto.setTotalMeasuredQuantity(quantity);
		returnInvoiceDto.setTotalMeasuredWeight(totalWeight);
		returnInvoiceDto.setTotalMeasuredValue(totalValue);
		return returnInvoiceDto;
	}

}
