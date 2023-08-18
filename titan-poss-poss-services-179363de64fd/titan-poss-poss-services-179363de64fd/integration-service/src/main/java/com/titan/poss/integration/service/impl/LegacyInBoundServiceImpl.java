/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.apache.http.HttpStatus;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.CMLegacyResponseDto;
import com.titan.poss.core.dto.CMVariantDto;
import com.titan.poss.core.dto.CashMemoDetailsDto;
import com.titan.poss.core.dto.CashMemoDto;
import com.titan.poss.core.dto.CashPaidDetailsDto;
import com.titan.poss.core.dto.CreditNoteLegacyInboundCustomerDto;
import com.titan.poss.core.dto.CreditNoteLegacyInboundDetailsDto;
import com.titan.poss.core.dto.CreditNoteLegacyInboundRequestDto;
import com.titan.poss.core.dto.CreditNoteRequestDto;
import com.titan.poss.core.dto.CustomerDetailsDto;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.CustomerTcsData;
import com.titan.poss.core.dto.CustomerTcsDetailsDto;
import com.titan.poss.core.dto.GVDetailsReqDto;
import com.titan.poss.core.dto.GVDetailsUpdateReqDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.GVStatusDto;
import com.titan.poss.core.dto.GiftDetailsResponseDto;
import com.titan.poss.core.dto.GiftStatusDto;
import com.titan.poss.core.dto.GiftStatusRequestDto;
import com.titan.poss.core.dto.GiftStatusResponseDto;
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.dto.LotDetailsReqDto;
import com.titan.poss.core.dto.LotDto;
import com.titan.poss.core.dto.LotNumberDetailsDto;
import com.titan.poss.core.dto.LotNumberMasterDto;
import com.titan.poss.core.dto.LoyaltyDetails;
import com.titan.poss.core.dto.MultiMetalDetailsDto;
import com.titan.poss.core.dto.PmlaLegacyResponseDto;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.dto.ThirdPartyApiReqDto;
import com.titan.poss.core.dto.TotalCashPaidDetailsDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.CustomerSearchTypeEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.LegacyGVResponse;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.service.clients.PaymentServiceClient;
import com.titan.poss.core.service.clients.ProductServiceClient;
import com.titan.poss.core.service.clients.SalesServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.response.PossCashPaidDetailsDto;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.LegacyInBoundService;
import com.titan.poss.integration.service.RestClientService;
import com.titan.poss.integration.service.UlpService;
import com.titan.poss.payment.dto.GiftErrorDto;
import com.titan.poss.payment.util.GiftStatusUtil;
import com.titan.poss.product.dto.LotDetailsDto;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.DiscountConfigDetailsDao;
import com.titan.poss.sales.dao.DiscountDetailsDao;
import com.titan.poss.sales.dao.DiscountItemDetailsDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.PaymentItemMappingDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.dto.CashMemoEntity;
import com.titan.poss.sales.dto.GhsLegacyDiscountBonusDetailsDto;
import com.titan.poss.sales.dto.GhsLegacyDiscountVoucherDto;
import com.titan.poss.sales.dto.ReturnableItemsDto;
import com.titan.poss.sales.repository.PaymentDetailsRepository;
import com.titan.poss.sales.repository.PaymentItemMappingRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service
public class LegacyInBoundServiceImpl implements LegacyInBoundService {

	@Autowired
	private PaymentServiceClient paymentService;

	@Autowired
	private SalesServiceClient salesService;

	@Autowired
	private ProductServiceClient productService;

	@Autowired
	private UlpService ulpService;

	@Autowired
	private VendorRepository vendorRepo;
	
	@Autowired
	private RestClientService apiCaller;
	
	@Autowired
	private EngineServiceClient discountApi;
	
	
	

	private static final String DATE_FORMAT = "dd-MM-yyyy-HH-mm-ss";
	private static final String TAX_TYPE = "taxType";
	private static final String DATA = "data";
	private static final String TAX_CODE = "taxCode";
	private static final String TAX_VALUE = "taxValue";
	private static final String CESS = "cess";
	private static final String CESS_VALUE = "cessValue";
	private static final String METAL_PRICE_DETAILS = "metalPriceDetails";
	private static final String METAL_PRICE = "metalPrices";
	private static final String METAL_VALUE = "metalValue";
	private static final String RATE_PER_UNIT = "ratePerUnit";
	private static final String TYPE = "type";
	private static final String MAKING_CHARGE = "makingChargeDetails";
	private static final String PRE_DISCOUNT = "preDiscountValue";
	private static final String METAL_RATE = "metalRates";
	private static final String TAX = "taxes";
	private static final String PURITY = "purity";
	private static final String ADDRESS = "addressLines";
	private static final String GOLD = "J";
	private static final String SILVER = "P";
	private static final String PLATINUM = "L";
	private static final String UTGST = "UTGST";
	private static final String PIN_CODE = "pincode";
	private static final String STATE = "state";
	private static final String BIRTH_DAY = "birthday";
	private static final String SPOUSE_BIRTH_DAY = "spouseBirthday";
	private static final String ANNIVERSARY = "anniversary";
	private static final String CATCHMENT_NAME = "catchmentName";
	private static final String CAN_SEND_SMS = "canSendSMS";
	private static final String IS_HARD_COPY_SUBMITTED = "isHardCopySubmitted";
	private static final String ID_PROOF = "idProof";
	private static final String ID_NUMBER = "idNumber";
	private static final String GET_PMLA_URI = "api/PMLA/GetPMLA";
	private static final String BUSINESS_DATE = "dtBusinessDate";
	private static final String ULP_MEMBERSHIP_ID = "ulpMembershipId";
	private static final String GET_LEGACY_TCS_URI = "api/TCS/GetTCSDataForCustomer";
	private static final String FISCAL_YEAR = "fiscalYear";
	private static final String LOCATION_CODE = "locationCode";
	private static final String SEARCH_TYPE = "searchType";
	private static final String SEARCH_FIELD = "searchField";
	private static final String EMAIL_ID = "emailId";
    private static final String MOBILE_NO = "mobileNo"; 
    private static final String CUSTOMER_NAME = "customerName";
    
    public static final String CUSTOMER_EPOSS_URL = "api/sales/v2/customers/eposs";
	
	
	public static final Map<String, Integer> cmStatus = Map.of("CONFIRMED", 2, "DELETED", 13, "OPEN", 1, "REJECTED", 12,
			"CANCELLED", 3);

	@Override
	public List<LegacyGVResponse> listGiftDetails(GVRequestDto gvDetails) {
		StringBuilder serialNo = new StringBuilder();
		List<BigInteger> serialNoList = new ArrayList<>();
		for (GVDetailsReqDto gvDetail : gvDetails.getGvDetails()) {
			serialNoList.add(gvDetail.getSerialNo());
			serialNo.append(gvDetail.getSerialNo() + ",");
		}
		PagedRestResponse<List<GiftDetailsResponseDto>> pagedRestResponse = paymentService
				.listGiftDetails(serialNo.toString(), null);
		List<LegacyGVResponse> napResponse = new ArrayList<>();
		pagedRestResponse.getResults().forEach(gvDao -> {
			serialNoList.remove(gvDao.getSerialNo());
			napResponse.add(getMappedResponse(gvDao));
		});
		serialNoList.forEach(serial -> {
			LegacyGVResponse gv = new LegacyGVResponse();
			gv.setSerialNo(serial);
			gv.setStatus(-1);
			gv.setRemark("GV not found");
			napResponse.add(gv);
		});
		return napResponse;
	}

	@Override
	public List<GVStatusDto> updateGiftStatus(GVRequestUpdateDto giftStatusUpdate) {
		Map<BigInteger, GVDetailsUpdateReqDto> requestMap = new HashMap<>();
		List<GiftStatusDto> giftVoucherStatus = new ArrayList<>();
		giftStatusUpdate.getGiftVoucherStatus().forEach(gv -> {
			requestMap.put(gv.getSerialNo(), gv);
			giftVoucherStatus.add((GiftStatusDto) MapperUtil.getObjectMapping(gv, new GiftStatusDto()));
		});
		GiftStatusRequestDto giftStatus = new GiftStatusRequestDto();
		giftStatus.setGiftVoucherStatus(giftVoucherStatus);
		ListResponse<GiftStatusResponseDto> responseDtoListResponse = null;
		List<GVStatusDto> gVStatus = new ArrayList<>();
		try {
			responseDtoListResponse = paymentService.updateGiftStatus(giftStatus);
			// Feign SUCCESS
			responseDtoListResponse.getResults().forEach(responseDto -> {
				GVStatusDto gvstatus = new GVStatusDto();
				gvstatus.setResult("SUCCESS");
				gvstatus.setMessage("GV status updated to " + responseDto.getStatus());
				gvstatus.setSerialNo(responseDto.getSerialNo());
				gvstatus.setItemcode(requestMap.get(responseDto.getSerialNo()).getItemCode());
				gvstatus.setTimestamp(CalendarUtils.formatDateToString(new Date(), DATE_FORMAT));
				gVStatus.add(gvstatus);
			});
		} catch (ServiceException e) {
			if ("ERR-PAY-019".equals(e.getErrorCode())) {
				ObjectMapper mapper = new ObjectMapper();
				List<GiftErrorDto> errorResponse = mapper.convertValue(e.getErrorDetails(),
						new TypeReference<List<GiftErrorDto>>() {
						});
				errorResponse.forEach(error -> {
					GVStatusDto gvstatus = new GVStatusDto();
					gvstatus.setItemcode(requestMap.get(error.getSerialNo()).getItemCode());
					gvstatus.setMessage("GV status not updated from " + error.getStatus() + " to "
							+ requestMap.get(error.getSerialNo()).getStatus());
					gvstatus.setResult("FAILED");
					gvstatus.setSerialNo(error.getSerialNo());
					gvstatus.setTimestamp(CalendarUtils.formatDateToString(new Date(), DATE_FORMAT));
					requestMap.remove(error.getSerialNo());
					gVStatus.add(gvstatus);
				});
				for (Map.Entry<BigInteger, GVDetailsUpdateReqDto> entry : requestMap.entrySet()) {
					GVStatusDto gvstatus = new GVStatusDto();
					gvstatus.setResult("SUCCESS");
					gvstatus.setMessage("GV status updated to " + entry.getValue().getStatus());
					gvstatus.setSerialNo(entry.getKey());
					gvstatus.setItemcode(entry.getValue().getItemCode());
					gvstatus.setTimestamp(CalendarUtils.formatDateToString(new Date(), DATE_FORMAT));
					gVStatus.add(gvstatus);
				}
			} else {
				throw e;
			}
		}
		return gVStatus;
	}

	private LegacyGVResponse getMappedResponse(GiftDetailsResponseDto gvDao) {
		LegacyGVResponse gv = new LegacyGVResponse();
		MapperUtil.beanMapping(gvDao, gv);
		gv.setItemCode(gvDao.getGiftCode());
		gv.setRegion(gvDao.getRegionCode());
		if (gvDao.getGiftDetails() != null) {
			gv.setIssuedTo(gvDao.getGiftDetails().getIssuedTo());
			gv.setCustomerName(gvDao.getGiftDetails().getCustomerName());
			gv.setCustomerType(gvDao.getGiftDetails().getCustomerType());
			if (gvDao.getGiftDetails().getDiscount() != null)
				gv.setDiscount(gvDao.getGiftDetails().getDiscount());
			if (gvDao.getGiftDetails().getDiscountPercentage() != null)
				gv.setDiscountPercentage(gvDao.getGiftDetails().getDiscountPercentage());
		}
		if (gvDao.getGiftVoucherRedeemDetails() != null) {
			gv.setRedeemedOn(gvDao.getGiftVoucherRedeemDetails().getRedeemedDate());
			gv.setRedeemedAt(gvDao.getGiftVoucherRedeemDetails().getLocationCode());
			gv.setLocationCode(gvDao.getGiftVoucherRedeemDetails().getLocationCode());
			gv.setDocType(gvDao.getGiftVoucherRedeemDetails().getDocType());
		}
		if (gvDao.getStatus() != null) {
			Optional<Integer> statusCode = GiftStatusUtil.getStatusdetails().entrySet().stream()
					.filter(entry -> gvDao.getStatus().equals(entry.getValue().toString())).map(Map.Entry::getKey)
					.findFirst();
			if (statusCode.isPresent()) {
				gv.setStatus(statusCode.get());
			}
		} else {
			gv.setStatus(null);
		}
		gv.setLoginId(gvDao.getCreatedBy());
		gv.setDenomination(gvDao.getDenomination());
		gv.setValue(gvDao.getTotalValue());
		gv.setLastModifiedDate(gvDao.getLastModifiedDate());
		gv.setCreatedDate(gvDao.getCreatedDate());
		gv.setRemark(gvDao.getRemarks());
		if (gvDao.getExcludes() != null) {
			String excludes = String.join("|", gvDao.getExcludes());
			gv.setExcludes(excludes);
		}
		gv.setLastModifiedId(gvDao.getLastModifiedId());
		if (gvDao.getLocationCode() != null)
			gv.setLocationCode(gvDao.getLocationCode());
		return gv;
	}

	@Override
	public CMLegacyResponseDto getCashMemoDetailsService(String locationCode, Short fiscalYear, Integer refDocNo) {
		Object responseObject = salesService.getEpossCashMemoDetails(locationCode, refDocNo, fiscalYear);
		CashMemoEntities cashMemoEntities = new CashMemoEntities();
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		if (responseObject != null) {
			cashMemoEntities = mapper.convertValue(responseObject, new TypeReference<CashMemoEntities>() {
			});
		}
		if(StringUtils.isEmpty(cashMemoEntities.getOriginalTxn())) {
			return new CMLegacyResponseDto();
		}
		CashMemoEntity cashMemoEntity = cashMemoEntities.getOriginalTxn();
		
		return mapperToLegacyResponse(cashMemoEntity.getCashMemo().getSalesTxnDao(), cashMemoEntity.getCashMemo(),
				cashMemoEntity.getCashMemoDetails(), cashMemoEntity.getPaymentDetails(),
				cashMemoEntity.getCustomerTxn(),cashMemoEntity.getDiscountConfigDetails(),cashMemoEntity.getDiscountDetails(),
				cashMemoEntity.getDiscountItemDetails(),cashMemoEntity.getDiscountDetailAndConfigMap(),cashMemoEntity.getDiscountItemAndDetailsMap(),cashMemoEntity.getPaymentDetailsMap(),cashMemoEntity.getDiscountDetailsAndTypeMap(),cashMemoEntity.getTcsApplicableAmount(),cashMemoEntity.getTcsPercentage(),cashMemoEntity.getPaymentItemMappingDaoDetails());
	}

	private CMLegacyResponseDto mapperToLegacyResponse(SalesTxnDao salesTxn, CashMemoDao cashMemo,
			List<CashMemoDetailsDao> cashMemoDetailsList, List<PaymentDetailsDao> paymentDetailsList,
			CustomerTxnDao customerTxn,List<DiscountConfigDetailsDao> discountConfigDetails,List<DiscountDetailsDao> discountDetails,
			 List<DiscountItemDetailsDao> discountItemDetails,Map<String, String> discountDetailAndConfigMap ,Map<String, String> discountItemAndDetailMap,Map<String,BigDecimal> paymentDetailsMap,Map<String,String> discountDetailsAndTypeMap,BigDecimal tcsApplicableAmount,BigDecimal tcsPercentage, List<PaymentItemMappingDao> paymentItemMappingDaoDetails ) {
		CashMemoDto cashMemoDto = cashMemoMapping(salesTxn, cashMemo);
		cashMemoDto.setTcsApplicableAmount(tcsApplicableAmount);
		cashMemoDto.setTcsPercentage(tcsPercentage);
		List<CashMemoDetailsDto> cmVariantList = cashMemoDetailsMapping(salesTxn, cashMemoDetailsList, cashMemoDto,discountConfigDetails,discountDetails,discountItemDetails,discountDetailAndConfigMap,discountItemAndDetailMap, paymentDetailsMap,discountDetailsAndTypeMap,paymentItemMappingDaoDetails);
		Integer sizeOfcmVariantList=cmVariantList.size();
		BigDecimal totalGHSDiscount = BigDecimal.ZERO;
		BigDecimal totalGHSVoucherDiscount = BigDecimal.ZERO;
		BigDecimal totalHMCharges = BigDecimal.ZERO;
		Integer totalHMQty = 0;
		BigDecimal totalHMGST = BigDecimal.ZERO;
		BigDecimal totalCash=BigDecimal.ZERO;
		
		if (paymentDetailsList!=null) {
			for (PaymentDetailsDao paymentDao : paymentDetailsList) {
				if (paymentDao.getPaymentCode()!=null && PaymentCodeEnum.CASH.getPaymentcode().equalsIgnoreCase(paymentDao.getPaymentCode())) {
					totalCash=totalCash.add(paymentDao.getCashCollected());				
				}
			}
		}
		log.info("total cash collected{}",totalCash);
		BigDecimal summedUpCash = BigDecimal.ZERO;
		
		for(int i=0;i<sizeOfcmVariantList;i++) {
			if(cmVariantList.get(i).getCmVariantDetail().getGhsDiscount()!=null) {
				totalGHSDiscount = totalGHSDiscount.add(cmVariantList.get(i).getCmVariantDetail().getGhsDiscount());
			}
			if(cmVariantList.get(i).getCmVariantDetail().getGhsVoucherDiscount()!=null) {
				totalGHSVoucherDiscount = totalGHSVoucherDiscount.add(cmVariantList.get(i).getCmVariantDetail().getGhsVoucherDiscount());
			}
			if(cmVariantList.get(i).getCmVariantDetail().getHmCharges()!=null) {
				totalHMCharges = totalHMCharges.add(cmVariantList.get(i).getCmVariantDetail().getHmCharges());
			}
			if(cmVariantList.get(i).getCmVariantDetail().getHmgst()!=null) {
				totalHMGST = totalHMGST.add(cmVariantList.get(i).getCmVariantDetail().getHmgst());
			}
			if(cmVariantList.get(i).getCmVariantDetail().getHmQuantity()!=null) {
				totalHMQty = totalHMQty+(cmVariantList.get(i).getCmVariantDetail().getHmQuantity());
			}
			
					if (totalCash.compareTo(BigDecimal.ZERO) >0){
						BigDecimal cash = BigDecimal.ZERO;
						if(i<sizeOfcmVariantList-1) {
						 cash = totalCash.divide(BigDecimal.valueOf(sizeOfcmVariantList), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
						}else {
							cash = totalCash.subtract(summedUpCash);
						}
						summedUpCash = summedUpCash.add(cash);
						cmVariantList.get(i).getCmVariantDetail().setPaymentByCash(cash);
					}
			
		}


		
		CustomerDetailsDto customerDetails = customerDetailsMapping(customerTxn);
		cashMemoDto.setTotalGHSDiscount(totalGHSDiscount);
		cashMemoDto.setTotalGHSVoucherDiscount(totalGHSVoucherDiscount);
		cashMemoDto.setTotalHMCharges(totalHMCharges);
		cashMemoDto.setTotalHMGST(totalHMGST);
		cashMemoDto.setTotalHMQty(totalHMQty);		
		customerDetails.setMobileNumber(CryptoUtil.decrypt(customerDetails.getMobileNumber(),MOBILE_NO,false));
		customerDetails.setEmailId(CryptoUtil.decrypt(customerDetails.getEmailId(),EMAIL_ID,false));
		customerDetails.setCustomerName(CryptoUtil.decrypt(customerDetails.getCustomerName(),CUSTOMER_NAME,false));			
		CMLegacyResponseDto legacyResponse = new CMLegacyResponseDto();
		legacyResponse.setCashMemo(cashMemoDto);
		legacyResponse.setCmVariant(cmVariantList);
		legacyResponse.setCustomerDetails(customerDetails);
		paymentDetailsList.clear();
		return legacyResponse;
	}

	private List<MultiMetalDetailsDto> metarialDetailsMapping(LotDetailsDto lotDetails) {
		List<MultiMetalDetailsDto> multiMetalDetailsList = new ArrayList<>();
		if (lotDetails.getLotMaterialList() != null && !lotDetails.getLotMaterialList().isEmpty()) {
			lotDetails.getLotMaterialList().forEach(material -> {
				MultiMetalDetailsDto materialDto = (MultiMetalDetailsDto) MapperUtil.getObjectMapping(material,
						new MultiMetalDetailsDto());
				materialDto.setItemCode(material.getLotDetailsId().getItem().getItemCode());
				materialDto.setLotNumber(material.getLotDetailsId().getLotNumber());
				materialDto.setLineItemNo(material.getLotDetailsId().getLineItemNo());
				materialDto.setMultiMetalCode(material.getMaterial().getMaterialCode());

				multiMetalDetailsList.add(materialDto);
			});
		}
		return multiMetalDetailsList;
	}

	private List<LotNumberDetailsDto> stoneDetailsMapping(LotDetailsDto lotDetails) {
		List<LotNumberDetailsDto> lotNumberDetailsList = new ArrayList<>();
		if (lotDetails.getLotStoneList() != null && !lotDetails.getLotStoneList().isEmpty()) {
			lotDetails.getLotStoneList().forEach(stone -> {
				LotNumberDetailsDto stoneDto = (LotNumberDetailsDto) MapperUtil.getObjectMapping(stone,
						new LotNumberDetailsDto());
				stoneDto.setItemCode(stone.getLotDetailsId().getItem().getItemCode());
				stoneDto.setLotNumber(stone.getLotDetailsId().getLotNumber());
				stoneDto.setLineItemNo(stone.getLotDetailsId().getLineItemNo());
				stoneDto.setStoneCode(stone.getStone().getStoneCode());
				lotNumberDetailsList.add(stoneDto);
			});
		}
		return lotNumberDetailsList;
	}

	private List<CashMemoDetailsDto> cashMemoDetailsMapping(SalesTxnDao salesTxn,
			List<CashMemoDetailsDao> cashMemoDetailsList, CashMemoDto cashMemoDto,List<DiscountConfigDetailsDao> discountConfigDetails,List<DiscountDetailsDao> discountDetails,
	 List<DiscountItemDetailsDao> discountItemDetails,Map<String, String> discountDetailAndConfigMap ,Map<String, String> discountItemAndDetailMap,Map<String,BigDecimal> paymentDetailsMap,Map<String,String> discountDetailsAndTypeMap,List<PaymentItemMappingDao> paymentItemMappingList) {
		List<CashMemoDetailsDto> cashMemoDetails = new ArrayList<>();
		cashMemoDetailsList.forEach(cmDetails -> {
			CMVariantDto cmVariant = (CMVariantDto) MapperUtil.getObjectMapping(salesTxn, new CMVariantDto());
			cmVariant = (CMVariantDto) MapperUtil.getObjectMapping(cmDetails, cmVariant);
			JsonObject jsonObject = new JsonParser().parse(cmDetails.getTaxDetails()).getAsJsonObject();
			List<LotDto> lotDetailsList = new ArrayList<>();
			LotDto lotDto = new LotDto();
			lotDto.setItemCode(cmDetails.getItemCode());
			lotDto.setLotNumber(cmDetails.getLotNumber());
			lotDetailsList.add(lotDto);
			if (!jsonObject.get(TAX_TYPE).isJsonNull()
					&& jsonObject.get(TAX_TYPE).getAsString().equalsIgnoreCase("ITEMCHARGES")) {
				if (!jsonObject.getAsJsonObject().get(DATA).isJsonNull()) {
					if (jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("SGST") != null
							&& !jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("SGST").isJsonNull()) {
						cmVariant.setTaxType1(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("SGST")
								.getAsJsonObject().get(TAX_CODE).getAsString());
						cmVariant.setTax1(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("SGST")
								.getAsJsonObject().get(TAX_VALUE).getAsDouble());
					}
					if (jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("IGST") != null
							&& !jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("IGST").isJsonNull()) {
						cmVariant.setTaxType1(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("SGST")
								.getAsJsonObject().get(TAX_CODE).getAsString());
						cmVariant.setTax1(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("SGST")
								.getAsJsonObject().get(TAX_VALUE).getAsDouble());
					}
					if (jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get(UTGST) != null
							&& !jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get(UTGST).isJsonNull()) {
						cmVariant.setTaxType1(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get(UTGST)
								.getAsJsonObject().get(TAX_CODE).getAsString());
						cmVariant.setTax1(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get(UTGST)
								.getAsJsonObject().get(TAX_VALUE).getAsDouble());
					}
					if (jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("UGST") != null
							&& !jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("UGST").isJsonNull()) {
						cmVariant.setTaxType1(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("UGST")
								.getAsJsonObject().get(TAX_CODE).getAsString());
						cmVariant.setTax1(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("UGST")
								.getAsJsonObject().get(TAX_VALUE).getAsDouble());
					}
					if (jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("CGST") != null
							&& !jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("CGST").isJsonNull()) {
						cmVariant.setTaxType2(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("CGST")
								.getAsJsonObject().get(TAX_CODE).getAsString());
						cmVariant.setTax2(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("CGST")
								.getAsJsonObject().get(TAX_VALUE).getAsDouble());
					}
					if (jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("HMGST") != null
							&& !jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("HMGST").isJsonNull()) {
						cmVariant.setHmgst(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("HMGST")
								.getAsJsonObject().get(TAX_VALUE).getAsBigDecimal());
					}
				}
//				if (!jsonObject.getAsJsonArray(CESS).isJsonNull() && jsonObject.getAsJsonArray(CESS).size() != 0) {
//					if (!jsonObject.getAsJsonArray(CESS).get(0).getAsJsonObject().get(CESS_VALUE).isJsonNull())
//						cmVariant.setCessValue(
//								jsonObject.getAsJsonArray(CESS).get(0).getAsJsonObject().get(CESS_VALUE).getAsDouble());
//					if (!jsonObject.getAsJsonArray(CESS).get(0).getAsJsonObject().get("cessPercentage").isJsonNull())
//						cmVariant.setCessPercentage(jsonObject.getAsJsonArray(CESS).get(0).getAsJsonObject()
//								.get("cessPercentage").getAsFloat());
//				}
			}
			jsonObject = new JsonParser().parse(cmDetails.getPriceDetails()).getAsJsonObject();
			if (!jsonObject.get(METAL_PRICE_DETAILS).isJsonNull()
					&& !jsonObject.get(METAL_PRICE_DETAILS).getAsJsonObject().getAsJsonArray(METAL_PRICE).isJsonNull()
					&& jsonObject.get(METAL_PRICE_DETAILS).getAsJsonObject().getAsJsonArray(METAL_PRICE).size() != 0) {
				for (JsonElement jsonElement : jsonObject.get(METAL_PRICE_DETAILS).getAsJsonObject()
						.getAsJsonArray(METAL_PRICE)) {
					if (jsonElement.getAsJsonObject().get(TYPE).getAsString().equalsIgnoreCase("gold")) {
						if (!jsonElement.getAsJsonObject().get(METAL_VALUE).isJsonNull())
							cmVariant.setGoldPrice(jsonElement.getAsJsonObject().get(METAL_VALUE).getAsDouble());
						if (!jsonElement.getAsJsonObject().get(RATE_PER_UNIT).isJsonNull())
							cmVariant.setGoldRate(jsonElement.getAsJsonObject().get(RATE_PER_UNIT).getAsDouble());
						if (!jsonElement.getAsJsonObject().get("karat").isJsonNull())
							cashMemoDto.setBaseKaratage(jsonElement.getAsJsonObject().get("karat").getAsDouble());
					} else if (jsonElement.getAsJsonObject().get(TYPE).getAsString().equalsIgnoreCase("silver")) {
						if (!jsonElement.getAsJsonObject().get(METAL_VALUE).isJsonNull())
							cmVariant.setSilverPrice(jsonElement.getAsJsonObject().get(METAL_VALUE).getAsDouble());
						if (!jsonElement.getAsJsonObject().get(RATE_PER_UNIT).isJsonNull())
							cmVariant.setSilverRate(jsonElement.getAsJsonObject().get(RATE_PER_UNIT).getAsDouble());
					} else if (jsonElement.getAsJsonObject().get(TYPE).getAsString().equalsIgnoreCase("platinum")) {
						if (!jsonElement.getAsJsonObject().get(METAL_VALUE).isJsonNull())
							cmVariant.setPlatinumPrice(jsonElement.getAsJsonObject().get(METAL_VALUE).getAsDouble());
						if (!jsonElement.getAsJsonObject().get(RATE_PER_UNIT).isJsonNull())
							cmVariant.setPlatinumRate(jsonElement.getAsJsonObject().get(RATE_PER_UNIT).getAsDouble());
					}
				}
				if (!jsonObject.get(MAKING_CHARGE).isJsonNull()
						&& !jsonObject.get(MAKING_CHARGE).getAsJsonObject().get(PRE_DISCOUNT).isJsonNull()) {
					cmVariant.setGoldMakingCharges(
							jsonObject.get(MAKING_CHARGE).getAsJsonObject().get(PRE_DISCOUNT).getAsDouble());
					cmVariant.setSilverMakingCharges(
							jsonObject.get(MAKING_CHARGE).getAsJsonObject().get(PRE_DISCOUNT).getAsDouble());
					cmVariant.setPlatinumMakingCharges(
							jsonObject.get(MAKING_CHARGE).getAsJsonObject().get(PRE_DISCOUNT).getAsDouble());
					cmVariant.setMakingCharges(
							jsonObject.get(MAKING_CHARGE).getAsJsonObject().get(PRE_DISCOUNT).getAsBigDecimal());
				}
			}
			if( jsonObject.get("itemHallmarkDetails")!=null && !jsonObject.get("itemHallmarkDetails").isJsonNull()) {
				if (!jsonObject.get("itemHallmarkDetails").getAsJsonObject().get("isHallmarked").isJsonNull()) {
					cmVariant.setIsHallMarking(jsonObject.get("itemHallmarkDetails").getAsJsonObject().get("isHallmarked").getAsBoolean());
				}
				if(!jsonObject.get("itemHallmarkDetails").getAsJsonObject().get("hmQuantity").isJsonNull()) {
					cmVariant.setHmQuantity(jsonObject.get("itemHallmarkDetails").getAsJsonObject().get("hmQuantity").getAsInt());
				}

			}

			jsonObject = new JsonParser().parse(cmDetails.getMeasuredWeightDetails()).getAsJsonObject();
			BigDecimal diamondWeight = null;
			if (!jsonObject.get(DATA).isJsonNull()) {
				if (!jsonObject.get(DATA).getAsJsonObject().get("goldWeight").isJsonNull())
					cmVariant.setGoldWeight(jsonObject.get(DATA).getAsJsonObject().get("goldWeight").getAsBigDecimal());
				if (!jsonObject.get(DATA).getAsJsonObject().get("platinumWeight").isJsonNull())
					cmVariant.setPlatinumWeight(
							jsonObject.get(DATA).getAsJsonObject().get("platinumWeight").getAsBigDecimal());
				if (!jsonObject.get(DATA).getAsJsonObject().get("silverWeight").isJsonNull())
					cmVariant.setSilverWeight(
							jsonObject.get(DATA).getAsJsonObject().get("silverWeight").getAsBigDecimal());
				if (!jsonObject.get(DATA).getAsJsonObject().get("stoneWeight").isJsonNull())
					cmVariant.setStoneWeight(
							jsonObject.get(DATA).getAsJsonObject().get("stoneWeight").getAsBigDecimal());
				if (!jsonObject.get(DATA).getAsJsonObject().get("materialWeight").isJsonNull())
					cmVariant.setOtherMaterialWeight(
							jsonObject.get(DATA).getAsJsonObject().get("materialWeight").getAsBigDecimal());
				if (!jsonObject.get(DATA).getAsJsonObject().get("diamondWeight").isJsonNull())
					diamondWeight = jsonObject.get(DATA).getAsJsonObject().get("diamondWeight").getAsBigDecimal();
			}
			cmVariant.setIsTEPDiscountRecoveryAllowed(cmDetails.getLegacyTepDiscountRecovered());
			cmVariant.setTotalValue(cmDetails.getFinalValue());
			cmVariant.setNoOfItemsReturned(salesService.getTotalReturnedItems(cmDetails.getId()));
			if (cmDetails.getHallmarkCharges() != null && cmDetails.getHallmarkDiscount() != null) {
				cmVariant.setHmCharges(cmDetails.getHallmarkCharges().subtract(cmDetails.getHallmarkDiscount()));
			}
			CashMemoDetailsDto cmDetailsDto = new CashMemoDetailsDto();	
			
			BigDecimal ghsVoucherDiscount = BigDecimal.ZERO;
			BigDecimal ghsDiscount = BigDecimal.ZERO;
			if(discountItemDetails!=null) {
				for (DiscountItemDetailsDao discount : discountItemDetails) {
					if (discount.getItemId().equalsIgnoreCase(cmDetails.getId())) {
						if(discountItemAndDetailMap!=null) {
							if(discountDetailsAndTypeMap.containsKey(discountItemAndDetailMap.get(discount.getId()))){
								if(discountDetailsAndTypeMap.get(discountItemAndDetailMap.get(discount.getId())).equalsIgnoreCase(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name())) {
								ghsDiscount = (discount.getDiscountValue()).add(ghsDiscount);
								log.info("GHS Discount : ",ghsDiscount);
								cmVariant.setGhsDiscount(ghsDiscount);
							}
							if(discountDetailsAndTypeMap.get(discountItemAndDetailMap.get(discount.getId())).equalsIgnoreCase(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name())) {
								ghsVoucherDiscount = (discount.getDiscountValue()).add(ghsVoucherDiscount);
								log.info("GHS Discount : ",ghsVoucherDiscount);
								cmVariant.setGhsVoucherDiscount(ghsVoucherDiscount);
							}
							}
						}
						log.info("The discount details is {}",
								discountDetailAndConfigMap.get(discountItemAndDetailMap.get(discount.getId())));
					for (DiscountConfigDetailsDao discounts : discountConfigDetails) {
							
							if (discounts.getId().equalsIgnoreCase(
									discountDetailAndConfigMap.get(discountItemAndDetailMap.get(discount.getId())))) {
								JsonObject jsonObjects = new JsonParser().parse(discounts.getBasicCriteriaDetails())
										.getAsJsonObject();

								if (!jsonObjects.get(DATA).getAsJsonObject().get("isFullValueTepDiscountRecovery")
										.isJsonNull())
									cmVariant.setIsFullValueTEPDiscountRecoveryAllowed(jsonObjects.get(DATA)
											.getAsJsonObject().get("isFullValueTepDiscountRecovery").getAsBoolean());	
							}
							break;
						}
					}
				
				}	
			}
//			if(paymentDetailsMap!=null) {
//				if(paymentDetailsMap.containsKey(salesTxn.getId())) {
//					cmVariant.setEncirclePoints(Integer.valueOf(paymentDetailsMap.get(salesTxn.getId()).intValue()));
//				}
//			}
//			
			BigDecimal encriclePointValue = BigDecimal.ZERO;
//			List<PaymentItemMappingDao> paymentItemMappingList = paymentItemMappingRepository
//					.getByTxnIdAndLocationCodeAndStatusIn(salesTxn.getId(), salesTxn.getLocationCode(),
//							List.of("COMPLETED"), null);
			log.info("paymentItemMappingDaoDetails  {}",paymentItemMappingList);	
			if (!CollectionUtil.isEmpty(paymentItemMappingList)) {

				for (PaymentItemMappingDao paymentItemMappingDaoExt : paymentItemMappingList) {
					if(paymentItemMappingDaoExt.getItemId().equalsIgnoreCase(cmDetails.getId())) {
						if (PaymentCodeEnum.ENCIRCLE.getPaymentcode()
								.equals(paymentItemMappingDaoExt.getPaymentDetailsDao().getPaymentCode()) &&
								paymentItemMappingDaoExt.getPaymentDetailsDao().getStatus().equals("COMPLETED")) {
							List<ReturnableItemsDto> returnableItemsDtoList = new ArrayList<>();
							
							if(paymentItemMappingDaoExt.getPaymentDetailsDao().getReference1()!=null)
								cashMemoDto.setRrNo(paymentItemMappingDaoExt.getPaymentDetailsDao().getReference1());
							
							cashMemoDetailsList.stream().forEach(grn->{
								ReturnableItemsDto returnableItemsDto =new ReturnableItemsDto();
								 returnableItemsDto.setCashMemoDetailsId(grn.getId());
								 returnableItemsDto.setTotalQuantity(grn.getTotalQuantity());
								 returnableItemsDtoList.add(returnableItemsDto);		
								 });
							for (ReturnableItemsDto returnableItemsDto : returnableItemsDtoList) {
								if (paymentItemMappingDaoExt.getItemId()
										.equals(returnableItemsDto.getCashMemoDetailsId())) {
										encriclePointValue = paymentItemMappingDaoExt.getAmount();
								}
							}
					}
					}
					cmVariant.setEncirclePoints(encriclePointValue.intValueExact());
				}
			}
			
			//digi gold bonus fron nap to legacy
			if (salesTxn.getDiscountTxnDetails() != null) {
				jsonObject = new JsonParser().parse(salesTxn.getDiscountTxnDetails()).getAsJsonObject();
				if (jsonObject != null && !jsonObject.get(TYPE).isJsonNull()
						&& jsonObject.get(TYPE).getAsString().equalsIgnoreCase("DISCOUNT_TXN_DETAILS")) {
					if (jsonObject.getAsJsonObject(DATA) != null
							&& !jsonObject.getAsJsonObject().get(DATA).isJsonNull()) {
						if (jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("digiGoldDetails") != null
								&& !jsonObject.getAsJsonObject().get(DATA).getAsJsonObject().get("digiGoldDetails")
										.isJsonNull()) {
							cmVariant.setDigiGoldDiscount(jsonObject.getAsJsonObject().get(DATA).getAsJsonObject()
									.get("digiGoldDetails").getAsJsonObject().get("discountValue").getAsBigDecimal());
						}

					}

				}
			}
			
		//	cmVariant.setEncirclePoints(encriclePointValue.intValueExact());
			cmDetailsDto.setCmVariantDetail(cmVariant);
			List<LotNumberDetailsDto> lotNumberDetailsList = new ArrayList<>();
			List<MultiMetalDetailsDto> multiMetalDetailsList = new ArrayList<>();
			List<LotNumberMasterDto> lotNumberMasterList = new ArrayList<>();	
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			if (!lotDetailsList.isEmpty()) {
				LotDetailsReqDto reqDto = new LotDetailsReqDto();
				reqDto.setLotDetailsList(lotDetailsList);
				Object responseObj = productService.getLotDetails(reqDto);
				LotDetailsDto lotDetails = mapper.convertValue(responseObj, new TypeReference<LotDetailsDto>() {
				});
				lotNumberDetailsList = stoneDetailsMapping(lotDetails);
				multiMetalDetailsList = metarialDetailsMapping(lotDetails);
				if(lotDetails.getItemStoneMapping()!=null)
					cmDetailsDto.setItemStoneMappingList(lotDetails.getItemStoneMapping());
			}
			for (LotNumberDetailsDto stone : lotNumberDetailsList) {
				LotNumberMasterDto lotMasterDto = new LotNumberMasterDto();
				lotMasterDto.setLotNumber(stone.getLotNumber());
				lotMasterDto.setItemCode(stone.getItemCode());
				lotMasterDto.setLocationCode(cmVariant.getLocationCode());
				lotMasterDto.setDiamondWeight(diamondWeight);
				lotMasterDto.setStoneWeight(cmVariant.getStoneWeight());
				lotMasterDto.setCreatedDate(cmDetails.getCreatedDate());
				lotMasterDto.setLastModifiedDate(cmDetails.getLastModifiedDate());
				lotMasterDto.setLastModifiedId(cmDetails.getLastModifiedBy());
				lotMasterDto.setLoginId(cmDetails.getCreatedBy());
				lotNumberMasterList.add(lotMasterDto);
			}
			for (MultiMetalDetailsDto material : multiMetalDetailsList) {
				LotNumberMasterDto lotMasterDto = new LotNumberMasterDto();
				lotMasterDto.setLotNumber(material.getLotNumber());
				lotMasterDto.setItemCode(material.getItemCode());
				lotMasterDto.setLocationCode(cmVariant.getLocationCode());
				lotMasterDto.setDiamondWeight(diamondWeight);
				lotMasterDto.setStoneWeight(cmVariant.getStoneWeight());
				lotMasterDto.setCreatedDate(cmDetails.getCreatedDate());
				lotMasterDto.setLastModifiedDate(cmDetails.getLastModifiedDate());
				lotMasterDto.setLastModifiedId(cmDetails.getLastModifiedBy());
				lotMasterDto.setLoginId(cmDetails.getCreatedBy());
				lotNumberMasterList.add(lotMasterDto);
			}
			if (!lotNumberMasterList.isEmpty())
				cmDetailsDto.setLotNumberMaster(lotNumberMasterList.get(0));
			cmDetailsDto.setLotNumberDetailsList(lotNumberDetailsList);
			cmDetailsDto.setMultiMetalDetailsList(multiMetalDetailsList);
			cashMemoDetails.add(cmDetailsDto);	
		});
		return cashMemoDetails;
	}

	private CashMemoDto cashMemoMapping(SalesTxnDao salesTxn, CashMemoDao cashMemo) {
		CashMemoDto cashMemoDto = (CashMemoDto) MapperUtil.getObjectMapping(salesTxn, new CashMemoDto());
		cashMemoDto = (CashMemoDto) MapperUtil.getObjectMapping(cashMemo, cashMemoDto);
		try {
			JsonObject jsonObject = new JsonParser().parse(cashMemo.getTaxDetails()).getAsJsonObject();

			if (!jsonObject.getAsJsonArray(TAX).isJsonNull() && jsonObject.getAsJsonArray(TAX).size() != 0) {
				for (JsonElement jsonElement : jsonObject.getAsJsonArray(TAX)) {
					if (jsonElement.getAsJsonObject().get(TAX_TYPE).getAsString().equalsIgnoreCase("ITEMCHARGES")) {
						if (!jsonElement.getAsJsonObject().get(DATA).isJsonNull()) {
							if (jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get("SGST") != null
									&& !jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get("SGST")
											.isJsonNull())
								cashMemoDto.setTotalTax1(jsonElement.getAsJsonObject().get(DATA).getAsJsonObject()
										.get("SGST").getAsJsonObject().get(TAX_VALUE).getAsDouble());
							if (jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get("IGST") != null
									&& !jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get("IGST")
											.isJsonNull())
								cashMemoDto.setTotalTax1(jsonElement.getAsJsonObject().get(DATA).getAsJsonObject()
										.get("IGST").getAsJsonObject().get(TAX_VALUE).getAsDouble());
							if (jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get(UTGST) != null
									&& !jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get(UTGST)
											.isJsonNull())
								cashMemoDto.setTotalTax1(jsonElement.getAsJsonObject().get(DATA).getAsJsonObject()
										.get(UTGST).getAsJsonObject().get(TAX_VALUE).getAsDouble());
							if (jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get("UGST") != null
									&& !jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get("UGST")
											.isJsonNull())
								cashMemoDto.setTotalTax1(jsonElement.getAsJsonObject().get(DATA).getAsJsonObject()
										.get("UGST").getAsJsonObject().get(TAX_VALUE).getAsDouble());
							if (jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get("CGST") != null
									&& !jsonElement.getAsJsonObject().get(DATA).getAsJsonObject().get("CGST")
											.isJsonNull())
								cashMemoDto.setTotalTax2(jsonElement.getAsJsonObject().get(DATA).getAsJsonObject()
										.get("CGST").getAsJsonObject().get(TAX_VALUE).getAsDouble());
						}

//					if (!jsonElement.getAsJsonObject().getAsJsonArray(CESS).isJsonNull()
//							&& jsonElement.getAsJsonObject().getAsJsonArray(CESS).size() != 0) {
//						if (!jsonElement.getAsJsonObject().getAsJsonArray(CESS).get(0).getAsJsonObject().get("cessCode")
//								.isJsonNull())
//							cashMemoDto.setCessName(jsonElement.getAsJsonObject().getAsJsonArray(CESS).get(0)
//									.getAsJsonObject().get("cessCode").getAsString());
//						if (!jsonElement.getAsJsonObject().getAsJsonArray(CESS).get(0).getAsJsonObject().get(CESS_VALUE)
//								.isJsonNull())
//							cashMemoDto.setTotalCess(jsonElement.getAsJsonObject().getAsJsonArray(CESS).get(0)
//									.getAsJsonObject().get(CESS_VALUE).getAsDouble());
//					}
					} else if (jsonElement.getAsJsonObject().get(TAX_TYPE).getAsString()
							.equalsIgnoreCase("OTHERCHARGES")) {
						if (!jsonElement.getAsJsonObject().getAsJsonArray(DATA).get(0).isJsonNull()) {
							cashMemoDto.setOtherChargesTaxType1(jsonElement.getAsJsonObject().getAsJsonArray(DATA)
									.get(0).getAsJsonObject().get(TAX_CODE).getAsString());
							cashMemoDto.setOtherChargesTax1(jsonElement.getAsJsonObject().getAsJsonArray(DATA).get(0)
									.getAsJsonObject().get(TAX_VALUE).getAsDouble());
						}
						if (!jsonElement.getAsJsonObject().getAsJsonArray(DATA).get(1).isJsonNull()) {
							cashMemoDto.setOtherChargesTaxType2(jsonElement.getAsJsonObject().getAsJsonArray(DATA)
									.get(1).getAsJsonObject().get(TAX_CODE).getAsString());
							cashMemoDto.setOtherChargesTax2(jsonElement.getAsJsonObject().getAsJsonArray(DATA).get(1)
									.getAsJsonObject().get(TAX_VALUE).getAsDouble());
						}
						if ((!jsonElement.getAsJsonObject().get(CESS).isJsonNull()
								&& jsonElement.getAsJsonObject().getAsJsonArray(CESS).size() != 0)
								&& !jsonElement.getAsJsonObject().getAsJsonArray(CESS).isJsonNull()) {
							cashMemoDto.setCessOnOtherCharges(jsonElement.getAsJsonObject().getAsJsonArray(CESS).get(0)
									.getAsJsonObject().get(CESS_VALUE).getAsDouble());
						}
					}
				}
			}

			jsonObject = new JsonParser().parse(salesTxn.getMetalRateDetails()).getAsJsonObject();
			if (!jsonObject.get(METAL_RATE).isJsonNull()) {
				if (!jsonObject.get(METAL_RATE).getAsJsonObject().get(GOLD).isJsonNull()) {
					if (!jsonObject.get(METAL_RATE).getAsJsonObject().get(GOLD).getAsJsonObject().get(RATE_PER_UNIT)
							.isJsonNull())
						cashMemoDto.setGoldRate(jsonObject.get(METAL_RATE).getAsJsonObject().get(GOLD).getAsJsonObject()
								.get(RATE_PER_UNIT).getAsDouble());
				} else if (!jsonObject.get(METAL_RATE).getAsJsonObject().get(PLATINUM).isJsonNull()) {
					if (!jsonObject.get(METAL_RATE).getAsJsonObject().get(PLATINUM).getAsJsonObject().get(RATE_PER_UNIT)
							.isJsonNull())
						cashMemoDto.setPlatinumRate(jsonObject.get(METAL_RATE).getAsJsonObject().get(PLATINUM)
								.getAsJsonObject().get(RATE_PER_UNIT).getAsDouble());
					if (!jsonObject.get(METAL_RATE).getAsJsonObject().get(PLATINUM).getAsJsonObject().get(PURITY)
							.isJsonNull())
						cashMemoDto.setBasePlatinumPurity(jsonObject.get(METAL_RATE).getAsJsonObject().get(PLATINUM)
								.getAsJsonObject().get(PURITY).getAsDouble());
				} else if (!jsonObject.get(METAL_RATE).getAsJsonObject().get(SILVER).isJsonNull()) {
					if (!jsonObject.get(METAL_RATE).getAsJsonObject().get(SILVER).getAsJsonObject().get(RATE_PER_UNIT)
							.isJsonNull())
						cashMemoDto.setPlatinumRate(jsonObject.get(METAL_RATE).getAsJsonObject().get(SILVER)
								.getAsJsonObject().get(RATE_PER_UNIT).getAsDouble());
					if (!jsonObject.get(METAL_RATE).getAsJsonObject().get(SILVER).getAsJsonObject().get(PURITY)
							.isJsonNull())
						cashMemoDto.setBaseSilverPurity(jsonObject.get(METAL_RATE).getAsJsonObject().get(SILVER)
								.getAsJsonObject().get(PURITY).getAsDouble());
				}
			}
		} catch (Exception e) {
			log.info("error in parsing" + e.getMessage());
		}
		if (salesTxn.getSubTxnType().equalsIgnoreCase("NEW_CM"))
			cashMemoDto.setIsNewCM(Boolean.TRUE);
		cashMemoDto.setStatus(cmStatus.get(salesTxn.getStatus()));
		return cashMemoDto;
	}

	private CustomerDetailsDto customerDetailsMapping(CustomerTxnDao customerTxn) {
		CustomerDetailsDto customer = (CustomerDetailsDto) MapperUtil.getObjectMapping(customerTxn,
				new CustomerDetailsDto());
		JsonObject jsonObject = new JsonParser().parse(customerTxn.getCustomerDetails()).getAsJsonObject();
		if (jsonObject.getAsJsonObject(DATA) != null) {
			try {
				if (!jsonObject.getAsJsonObject(DATA).get(PIN_CODE).isJsonNull())
					customer.setPinCode(jsonObject.getAsJsonObject(DATA).get(PIN_CODE).getAsInt());
			} catch (Exception e) {
				log.info("error in parsing" + e.getMessage());
			}
			
			
			if (jsonObject.getAsJsonObject(DATA).get("city") != null
					&& !jsonObject.getAsJsonObject(DATA).get("city").isJsonNull())
				customer.setTownCode(jsonObject.getAsJsonObject(DATA).get("city").getAsString());
			if (jsonObject.getAsJsonObject(DATA).get(STATE) != null
					&& !jsonObject.getAsJsonObject(DATA).get(STATE).isJsonNull())
				customer.setStateCode(jsonObject.getAsJsonObject(DATA).get(STATE).getAsString());
			if (jsonObject.getAsJsonObject(DATA).get(BIRTH_DAY) != null
					&& !jsonObject.getAsJsonObject(DATA).get(BIRTH_DAY).isJsonNull()
					&& CalendarUtils.isValidDate(jsonObject.getAsJsonObject(DATA).get(BIRTH_DAY).getAsString(),
							CalendarUtils.SQL_DATE_FORMAT)) {
				customer.setBirthday(CalendarUtils.convertStringToDate(
						jsonObject.getAsJsonObject(DATA).get(BIRTH_DAY).getAsString(), CalendarUtils.SQL_DATE_FORMAT));
			}
			if (jsonObject.getAsJsonObject(DATA).get(SPOUSE_BIRTH_DAY) != null
					&& !jsonObject.getAsJsonObject(DATA).get(SPOUSE_BIRTH_DAY).isJsonNull()
					&& CalendarUtils.isValidDate(jsonObject.getAsJsonObject(DATA).get(SPOUSE_BIRTH_DAY).getAsString(),
							CalendarUtils.SQL_DATE_FORMAT)) {
				customer.setSpouseBirthday(CalendarUtils.convertStringToDate(
						jsonObject.getAsJsonObject(DATA).get(SPOUSE_BIRTH_DAY).getAsString(),
						CalendarUtils.SQL_DATE_FORMAT));
			}
			if (jsonObject.getAsJsonObject(DATA).get(ANNIVERSARY) != null
					&& !jsonObject.getAsJsonObject(DATA).get(ANNIVERSARY).isJsonNull()
					&& CalendarUtils.isValidDate(jsonObject.getAsJsonObject(DATA).get(ANNIVERSARY).getAsString(),
							CalendarUtils.SQL_DATE_FORMAT)) {
				customer.setAnniversary(CalendarUtils.convertStringToDate(
						jsonObject.getAsJsonObject(DATA).get(ANNIVERSARY).getAsString(),
						CalendarUtils.SQL_DATE_FORMAT));
			}
			if (jsonObject.getAsJsonObject(DATA).get(CATCHMENT_NAME) != null
					&& !jsonObject.getAsJsonObject(DATA).get(CATCHMENT_NAME).isJsonNull())
				customer.setCatchmentArea(jsonObject.getAsJsonObject(DATA).get(CATCHMENT_NAME).getAsString());
			if (jsonObject.getAsJsonObject(DATA) != null
					&& jsonObject.getAsJsonObject(DATA).getAsJsonArray(ADDRESS) != null
					&& !jsonObject.getAsJsonObject(DATA).getAsJsonArray(ADDRESS).isJsonNull()
					&& jsonObject.getAsJsonObject(DATA).getAsJsonArray(ADDRESS).size() != 0) {
				if (!jsonObject.getAsJsonObject(DATA).getAsJsonArray(ADDRESS).get(0).isJsonNull())
					customer.setAddress1(jsonObject.getAsJsonObject(DATA).getAsJsonArray(ADDRESS).get(0).getAsString());
				if (!jsonObject.getAsJsonObject(DATA).getAsJsonArray(ADDRESS).get(1).isJsonNull())
					customer.setAddress2(jsonObject.getAsJsonObject(DATA).getAsJsonArray(ADDRESS).get(1).getAsString());
				if (jsonObject.getAsJsonObject(DATA) != null
						&& jsonObject.getAsJsonObject(DATA).get(CAN_SEND_SMS) != null
						&& !jsonObject.getAsJsonObject(DATA).get(CAN_SEND_SMS).isJsonNull())
					customer.setCanSendSMS(jsonObject.getAsJsonObject(DATA).get(CAN_SEND_SMS).getAsBoolean());
				if (jsonObject.getAsJsonObject(DATA) != null
						&& jsonObject.getAsJsonObject(DATA).get(IS_HARD_COPY_SUBMITTED) != null
						&& !jsonObject.getAsJsonObject(DATA).get(IS_HARD_COPY_SUBMITTED).isJsonNull())
					customer.setIsHardCopySubmitted(
							jsonObject.getAsJsonObject(DATA).get(IS_HARD_COPY_SUBMITTED).getAsBoolean());
				if (jsonObject.getAsJsonObject(DATA) != null && jsonObject.getAsJsonObject(DATA).get(ID_PROOF) != null
						&& !jsonObject.getAsJsonObject(DATA).get(ID_PROOF).isJsonNull())
					customer.setIdProof(jsonObject.getAsJsonObject(DATA).get(ID_PROOF).getAsString());
				if (jsonObject.getAsJsonObject(DATA) != null && jsonObject.getAsJsonObject(DATA).get(ID_NUMBER) != null
						&& !jsonObject.getAsJsonObject(DATA).get(ID_NUMBER).isJsonNull())
					customer.setIdNumber(jsonObject.getAsJsonObject(DATA).get(ID_NUMBER).getAsString());
			}
		}
		return customer;
	}

	@Override
	public CreditNoteLegacyInboundRequestDto transferCreditNote(
			CreditNoteLegacyInboundRequestDto cnTransferLegacyRequestDto) {
		if (!cnTransferLegacyRequestDto.getCreditNote().getCustomerNo().toString()
				.equalsIgnoreCase(cnTransferLegacyRequestDto.getCustomer().getCustomerNo().toString())
				|| !cnTransferLegacyRequestDto.getCreditNote().getLocationCode()
						.equalsIgnoreCase(cnTransferLegacyRequestDto.getCustomer().getLocationCode())) {
			throw new ServiceException("Please provide the creditNote information with correct customer mapping",
					"ERR-INT-081");
		}
		CreditNoteRequestDto cnRequestDto = getCNRequestData(cnTransferLegacyRequestDto.getCreditNote());
		getCNCustomerData(cnTransferLegacyRequestDto.getCustomer(), cnRequestDto);
		log.info("cnTransferLegacyRequestDto details.....{}", cnTransferLegacyRequestDto);
		salesService.transferCNToEPOSS(cnRequestDto);
		return cnTransferLegacyRequestDto;
	}

	private void getCNCustomerData(CreditNoteLegacyInboundCustomerDto customer,
			CreditNoteRequestDto creditNoteRequestDto) {
		creditNoteRequestDto.setUlpId(customer.getUlpMembershipId());
		creditNoteRequestDto.setMobileNumber(customer.getMobileNo());
		JSONObject customerObject = new JSONObject();
		if (customer.getGstRegNo() == null) {
			creditNoteRequestDto.setCustomerType(CustomerTypeEnum.REGULAR.name());
			customerObject.put("type", CustomerTypeEnum.REGULAR.name());
		} else {
			creditNoteRequestDto.setCustomerType(CustomerTypeEnum.INSTITUTIONAL.name());
			customerObject.put("type", CustomerTypeEnum.INSTITUTIONAL.name());
		}
		creditNoteRequestDto.setTitle(customer.getTitle());
		creditNoteRequestDto.setCustomerName(customer.getName());
		creditNoteRequestDto.setEmailId(customer.getMailId());
		creditNoteRequestDto.setInstiTaxNo(customer.getGstRegNo());
		creditNoteRequestDto.setCustTaxNo(customer.getPanCardNo());
		JSONObject customerJson = new JSONObject();
		customerJson.put(BIRTH_DAY, customer.getBirthday());
		customerJson.put(ANNIVERSARY, customer.getAnniversary());
		customerJson.put(PIN_CODE, customer.getPinCode());
		customerJson.put(SPOUSE_BIRTH_DAY, customer.getSpouseBirthday());
		customerJson.put(CAN_SEND_SMS, customer.getCanSendSms());
		customerJson.put(CATCHMENT_NAME, customer.getCatchmentArea());
		customerJson.put(IS_HARD_COPY_SUBMITTED, customer.getIsHardCopySubmitted());
		customerJson.put(ID_PROOF, customer.getIdProofType());
		customerJson.put(ID_NUMBER, customer.getIdProofNumber());
		customerJson.put("city", customer.getUlpCity());
		customerJson.put(STATE, customer.getUlpState());
		List<String> address = new ArrayList<>();
		address.add(customer.getAddress1());
		address.add(customer.getAddress2());
		address.add(customer.getAddress3());
		customerJson.put(ADDRESS, address);
		customerObject.put("data", customerJson);
		creditNoteRequestDto.setCustomerDetails(customerObject.toString());
		JSONObject emailJson = new JSONObject();
		emailJson.put("type", "EMAIL_VALIDATION");
		JSONObject emaildata = new JSONObject();
		JSONObject emailValidationData = new JSONObject();
		emailValidationData.put("emailId", customer.getMailId());
		emailValidationData.put("validationstatus", customer.getIsEmailValidationSuccess());
		emaildata.put("apiResponse", emailValidationData);
		emailJson.put("data", emaildata);
		creditNoteRequestDto.setEmailValidationDetails(emailJson.toString());
		VendorDao vendor = vendorRepo.findByVendorCode(VendorCodeEnum.ULP_NETCARROTS.name());
		CustomerDto customerDto = null;
		if (customer.getUlpMembershipId() != null)
			customerDto = ulpService.searchLoyaltyCustomer(vendor, CustomerSearchTypeEnum.ULP_ID.name(),
					customer.getLocationCode(), customer.getUlpMembershipId());
		else {
			customerDto = ulpService.searchLoyaltyCustomer(vendor, CustomerSearchTypeEnum.MOBILE_NO.name(),
					customer.getLocationCode(), customer.getMobileNo());
		}
		if (customerDto.getUlpId() != null) {
			creditNoteRequestDto.setPointBalance(customerDto.getPointBalance());
			creditNoteRequestDto.setCurrentTier(customerDto.getCurrentTier());
			creditNoteRequestDto.setEnrollmentDate(customerDto.getEnrollmentDate());
			creditNoteRequestDto.setIsMemberBlocked(customerDto.getIsMemberBlocked());
			creditNoteRequestDto.setIsPulseCustomer(Boolean.FALSE);
			creditNoteRequestDto.setIsUlpCustomer(Boolean.TRUE);
			LoyaltyDetails loyalty = new LoyaltyDetails();
			loyalty.setAnniversary(customerDto.getAnniversary());
			loyalty.setAnniversaryDiscount(customerDto.getAnniversaryDiscount());
			loyalty.setAnniversaryValidityPeriod(customerDto.getAnniversaryValidityPeriod());
			loyalty.setBirthday(customerDto.getBirthday());
			loyalty.setBirthdayDiscount(customerDto.getBirthdayDiscount());
			loyalty.setBirthdayValdityPeriod(customerDto.getBirthdayValdityPeriod());
			loyalty.setChild1BirthdayDiscount(customerDto.getChild1BirthdayDiscount());
			loyalty.setChild1BirthdayValidityPeriod(customerDto.getChild1BirthdayValidityPeriod());
			loyalty.setChild2BirthdayDiscount(customerDto.getChild2BirthdayDiscount());
			loyalty.setChild2BirthdayValidityPeriod(customerDto.getChild2BirthdayValidityPeriod());
			loyalty.setSpouseBirthday(customerDto.getSpouseBirthday());
			loyalty.setSpouseBirthdayDiscount(customerDto.getSpouseBirthdayDiscount());
			loyalty.setBirthdayValdityPeriod(customerDto.getSpouseBirthdayValidityPeriod());
			JsonData json = new JsonData();
			json.setType("LOYALTY");
			json.setData(loyalty);
			creditNoteRequestDto.setLoyaltyDetails(MapperUtil.getJsonString(json));
		} else {
			creditNoteRequestDto.setIsUlpCustomer(Boolean.FALSE);
		}
	}

	private CreditNoteRequestDto getCNRequestData(CreditNoteLegacyInboundDetailsDto creditNote) {

		CreditNoteRequestDto creditNoteRequestDto = new CreditNoteRequestDto();

		//Set Legacy creditNoteType Name To NAP creditNoteType Name
		if(creditNote.getCreditNoteType()!=null && creditNote.getCreditNoteType().equalsIgnoreCase("Advance"))
		{
			creditNoteRequestDto.setCreditNoteType(CNType.ADV.toString());
			
		}
		else if(creditNote.getCreditNoteType()!=null && creditNote.getCreditNoteType().equalsIgnoreCase("BillCancellation"))
		{
			creditNoteRequestDto.setCreditNoteType(CNType.BILL_CANCELLATION.toString());
		}
		else if(creditNote.getCreditNoteType()!=null && creditNote.getCreditNoteType().equalsIgnoreCase("CNIntBTQ"))
		{
			creditNoteRequestDto.setCreditNoteType(CNType.CN_IBT.toString());
		}
		else if(creditNote.getCreditNoteType()!=null && creditNote.getCreditNoteType().equalsIgnoreCase("Digi Gold Tanishq"))
		{
			creditNoteRequestDto.setCreditNoteType(CNType.DIGI_GOLD_TANISHQ.toString());
		}
		else if(creditNote.getCreditNoteType()!=null && creditNote.getCreditNoteType().equalsIgnoreCase("Digi Gold NonTanishq"))
		{
			creditNoteRequestDto.setCreditNoteType(CNType.DIGI_GOLD_NON_TANISHQ.toString());
		}
		else {
			creditNoteRequestDto.setCreditNoteType(creditNote.getCreditNoteType());
		}
		creditNoteRequestDto.setSrcLocationCode(creditNote.getLocationCode());
		creditNoteRequestDto.setDestLocationCode(creditNote.getDestBtqCode());
		creditNoteRequestDto.setFiscalYear(creditNote.getFiscalYear().shortValue());
		creditNoteRequestDto.setDocNo(creditNote.getDocNo());
		creditNoteRequestDto.setDocDate(creditNote.getDocDate());
		creditNoteRequestDto.setCustomerId(creditNote.getCustomerNo());
		creditNoteRequestDto.setAmount(creditNote.getAmount());
		creditNoteRequestDto.setUtilisedAmount(creditNote.getAmount());
		creditNoteRequestDto.setTotalTax(creditNote.getTotalTax());
		creditNoteRequestDto.setRemarks(creditNote.getRemarks());
		creditNoteRequestDto.setStatus(CNStatus.OPEN.name());
		creditNoteRequestDto.setCashCollected(creditNote.getTotalCashCollected());
		creditNoteRequestDto.setPrints(creditNote.getNoOfTimesPrinted());
		creditNoteRequestDto.setDiscountDetails(legacyToNapDiscountDetails(creditNote));
		return creditNoteRequestDto;
	}

	private String legacyToNapDiscountDetails(CreditNoteLegacyInboundDetailsDto creditNote) {
		
		List<String> discountTypeList = new ArrayList<String>();

		// legacy ghs dicsount voucher
		DiscountBillLevelRequestDto discountBillLevelRequest = new DiscountBillLevelRequestDto();
		discountBillLevelRequest.setDiscountType(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name());
		
		log.info("discountBillLevelRequest......{}",discountBillLevelRequest);

		GhsLegacyDiscountVoucherDto ghsLegacyDiscountVoucher = new GhsLegacyDiscountVoucherDto();
		if (creditNote.getGhsVoucherDiscount() != null
				&& creditNote.getGhsVoucherDiscount().compareTo(BigDecimal.ZERO) > 0) {
			DiscountBillLevelResponseDto discountResponse = discountApi
					.getDiscountsAtBillLevel(discountBillLevelRequest);
			discountTypeList.add(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name());
			for (DiscountBillLevelItemDetailsDto discountBillLevelItemDetailsDto : discountResponse
					.getDiscountDetails()) {
				ghsLegacyDiscountVoucher.setDiscountId(discountBillLevelItemDetailsDto.getDiscountId());
				ghsLegacyDiscountVoucher.setDiscountCode(discountBillLevelItemDetailsDto.getDiscountCode());
				ghsLegacyDiscountVoucher.setDiscountType(discountBillLevelItemDetailsDto.getDiscountType());

			}
			ghsLegacyDiscountVoucher.setDiscountValue(creditNote.getGhsVoucherDiscount());
			log.info("ghsDiscountVoucher........{}", ghsLegacyDiscountVoucher);
		}

		// for legacy ghs discount bonus
		DiscountBillLevelRequestDto discountBillLevelBonusRequest = new DiscountBillLevelRequestDto();
		discountBillLevelBonusRequest.setDiscountType(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name());
		log.info("discountBillLevelBonusRequest......{}",discountBillLevelBonusRequest);

		GhsLegacyDiscountBonusDetailsDto ghsLegacyDiscountBonus = new GhsLegacyDiscountBonusDetailsDto();
		if (creditNote.getGhsBonus() != null && creditNote.getGhsBonus().compareTo(BigDecimal.ZERO) > 0) {
			DiscountBillLevelResponseDto discountBonusResponse = discountApi
					.getDiscountsAtBillLevel(discountBillLevelBonusRequest);
			discountTypeList.add(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name());
			if(discountBonusResponse.getDiscountDetails() != null) {
			ghsLegacyDiscountBonus.setDiscountId(discountBonusResponse.getDiscountDetails().get(0).getDiscountId());
			ghsLegacyDiscountBonus.setDiscountType(discountBonusResponse.getDiscountDetails().get(0).getDiscountType());
			ghsLegacyDiscountBonus.setDiscountCode(discountBonusResponse.getDiscountDetails().get(0).getDiscountCode());
			}
			ghsLegacyDiscountBonus.setDiscountValue(creditNote.getGhsBonus());
			ghsLegacyDiscountBonus.setDiscountMcPct(BigDecimal.ZERO.intValue());
			ghsLegacyDiscountBonus.setDiscountUcpPct(BigDecimal.ZERO.intValue());

			log.info("ghsDiscountBonusVoucher.......{}", ghsLegacyDiscountBonus);

		}

		Map<String, Object> cnDetailsMap = new HashMap<String, Object>();
		for (String discountType : discountTypeList) {
			if (DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name().equals(discountType)) {
				cnDetailsMap.put("systemDiscountDv", ghsLegacyDiscountVoucher);
			}
			if (DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name().equals(discountType)) {
				cnDetailsMap.put("ghsAccountDiscount", ghsLegacyDiscountBonus);
			}
		}

		String discountDetails = null;
		if(!cnDetailsMap.isEmpty())
		{
			JsonData json = new JsonData();
			json.setType("CN_DISCOUNT_DETAILS");
			json.setData(cnDetailsMap);
			log.info("data....{}", cnDetailsMap);

			discountDetails = MapperUtil.getStringFromJson(json);

			log.info("discount details....{}", discountDetails);
		}
		

		return discountDetails;
	}

	@Override
	public void updateGrnItemsLegacyService(GrnLegacyUpdateDto updatedGrnDto) {
		salesService.updateLegacyGrnDetails(updatedGrnDto);

	}

	@Override
	public void updateTepItemsLegacyService(TepLegacyUpdateDto updatedTepDto) {
		salesService.updateLegacyTepDetails(updatedTepDto);

	}

	@Override
	public PossCashPaidDetailsDto getCashCollectedAtPOSS(String searchType, String searchValue, String businessDate,
			String locationCode) {
		return (PossCashPaidDetailsDto) MapperUtil.getObjectMapping(
				salesService.getTotalCashPaid(searchType, searchValue, businessDate, locationCode),
				new PossCashPaidDetailsDto());
	}
	
	@Override
	public PmlaLegacyResponseDto getPmlaNapService(String dtBusinessDate, String ulpMembershipId) {
		PmlaLegacyResponseDto pmlaLegacyResponseDto=new PmlaLegacyResponseDto();
		TotalCashPaidDetailsDto totalCashPaidDetailsDto=salesService.getPmlaOfCustomer(ulpMembershipId,dtBusinessDate);
		pmlaLegacyResponseDto.setTotalTransactedAmount(totalCashPaidDetailsDto.getTotalCashPaid());
		pmlaLegacyResponseDto.setBusinessDate(dtBusinessDate);
		pmlaLegacyResponseDto.setUlpMembershipID(ulpMembershipId);
		pmlaLegacyResponseDto.setFiscalYear((short) CalendarUtils.getYearOfDate(CalendarUtils.formatDetfaultToDateStr(dtBusinessDate)));
		pmlaLegacyResponseDto.setCustomerMobileNo(totalCashPaidDetailsDto.getMobileNumber());
		return pmlaLegacyResponseDto;
	}

	/**
	 * This method will get the Base URI to Legacy Nap API's
	 * 
	 * @param uriCode
	 * @return uri
	 */
	private String getNapURI() {
		VendorDao vendorDao = vendorRepo.findByVendorCode(VendorCodeEnum.LEGACY_API.name());
		return vendorDao.getBaseurl();
	}
	
	/**
	 *
	 */
	@Override
	public List<CustomerTcsDetailsDto> retrieveLegacyTcsPaymentDetails(SearchTypeEnum searchTypeEnum, String searchField, Short fiscalYear, String locationCode){
		ThirdPartyApiReqDto apiRequest = new ThirdPartyApiReqDto();
		String uri = getNapURI();
		uri = uri + GET_LEGACY_TCS_URI;
		apiRequest.setUrl(uri);
		apiRequest.setReqBody(null);
		apiRequest.setHttpMethod(HttpMethod.GET);
		Map<String, String> requestParams = new HashMap<>();

		requestParams.put(FISCAL_YEAR, fiscalYear.toString());
		requestParams.put(LOCATION_CODE, locationCode);
		requestParams.put(SEARCH_TYPE, searchTypeEnum.toString());
		requestParams.put(SEARCH_FIELD, searchField);

		apiRequest.setRequestParams(requestParams);
		ApiResponseDto apiResponse = null;
		try {
			apiResponse = apiCaller.runThirdPartyAPI(apiRequest);
		} catch (Exception e) {

			return new ArrayList<CustomerTcsDetailsDto>();
		}
		if (ObjectUtils.isEmpty(apiResponse.getResponse()) || apiResponse.getHttpResponseCode() != HttpStatus.SC_OK) {
			return new ArrayList<CustomerTcsDetailsDto>();
		}

		List<CustomerTcsDetailsDto> customerTcsDetailsDtos = MapperUtil.jsonStrToList(MapperUtil.getJsonString(apiResponse),
				CustomerTcsDetailsDto.class);
		
		return customerTcsDetailsDtos;
	}
	@Override
	public CustomerTcsData retrieveTcsData(String customerMobileNo, Short fiscalYear, String btqPanCard) {
		return salesService.retrieveTcsData(customerMobileNo, fiscalYear, btqPanCard);
	}
	

}