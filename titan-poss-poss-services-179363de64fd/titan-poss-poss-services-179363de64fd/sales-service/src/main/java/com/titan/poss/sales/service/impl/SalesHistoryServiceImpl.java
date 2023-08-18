/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.sales.service.impl;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.TransactionActionTypeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.CreditNoteTransferDto;
import com.titan.poss.core.dto.CustomerDocumentsRequestDto;
import com.titan.poss.core.dto.InvoiceDocumentsDetailsDto;
import com.titan.poss.core.enums.CustomerSearchTypeEnum;
import com.titan.poss.core.enums.HistorySearchTypeEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.CashMemoHistoryReqDto;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.AdvanceBookingHistoryDto;
import com.titan.poss.sales.dto.response.AdvanceHistoryDto;
import com.titan.poss.sales.dto.response.BillCancellationHistoryDto;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CashMemoHistoryResponse;
import com.titan.poss.sales.dto.response.GoodsExchangeDto;
import com.titan.poss.sales.dto.response.GrnHistoryResponse;
import com.titan.poss.sales.repository.AdvanceRepositoryExt;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.GoodsExchangeRepositoryExt;
import com.titan.poss.sales.repository.GrnRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.repository.StockTransactionRepositoryExt;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.SalesHistoryService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesHistoryValidator;
import com.titan.poss.sales.utils.SalesUtil;

import feign.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * Service class for sales History.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesHistoryServiceImpl")
public class SalesHistoryServiceImpl implements SalesHistoryService {

	@Autowired
	private CashMemoRepositoryExt cashMemoRepo;

	@Autowired
	private OrderRepositoryExt orderRepoExt;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepoExt;

	@Autowired
	private IntegrationService intgService;

	@Autowired
	private CancellationRepositoryExt cancellationRepoExt;

	@Autowired
	GoodsExchangeRepositoryExt exchangeRepositoryExt;

	@Autowired
	private GrnRepositoryExt grnRepoExt;

	@Autowired
	private AdvanceRepositoryExt advanceRepo;
	
	@Autowired
	private EpossCallServiceImpl legacyCallServiceImpl;
	
	@Autowired
	private SalesTxnRepository salesTxnRepo;
	
	@Autowired
	private StockTransactionRepositoryExt stockTransactionRepo;

	private static final Logger LOGGER = LoggerFactory.getLogger(SalesHistoryServiceImpl.class);

	private static final String ERR_CORE_013 = "ERR-CORE-013";
	private static final String JSON_DATA_FORMAT_ERROR = "JSON data format error";

	private static final String ERR_CORE_046 = "ERR-CORE-046";
	private static final String EPOSS_FAILED = "Request to EPOSS credit note transfer history API failed";
	
	private static final String ERR_INT_097 = "ERR-INT-097";
	private static final String INVALID_CASHMEMO = "CashMemo - {docNo} {locationCode} {fiscalYear} has already been cancelled. Hence not available in CM history";
    private static final String MOBILE_NO = "mobileNo";
    private static final String CUSTOMER_NAME ="customerName";
    private static final String ULP_ID ="ULP_ID";
    private static final String GST_NO ="GST_NO";
    private static final String PAN_NO ="PAN_NO";
    private static final String EMAIL_ID ="EMAIL_ID";
    private static final String ONE_TIME ="CUSTOMER_NAME";
    private static final String REGULAR = "MOBILE_NO";
   

    

	@Override
	public PagedRestResponse<List<CashMemoHistoryResponse>> getCashMemoHistoryService(String searchField,
			String searchType, String subTxnType, String txnType, CashMemoHistoryReqDto cashMemoHistoryDto,
			Pageable pageable) {
		List<String> statusList = List.of(TransactionStatusEnum.CONFIRMED.name(),TransactionStatusEnum.CANCELLED.name(),TransactionStatusEnum.APPROVAL_PENDING.name());
		if (SubTxnTypeEnum.GIFT_SALE.name().equals(subTxnType)) {
			cashMemoHistoryDto.setToNetAmount(null);
			cashMemoHistoryDto.setFromNetAmount(null);
			
		}
		SalesHistoryValidator.filterValidation(searchField, searchType, cashMemoHistoryDto, null, null, null, null);
		if(searchType!=null) {
			switch(searchType) {
			case REGULAR:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.MOBILE_NO.name());
				break;
			case GST_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.GST_NO.name());
				break;
			case PAN_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.PAN_NO.name());
				break;
			case EMAIL_ID:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.EMAIL_ID.name());
				break;
			case ONE_TIME:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.CUSTOMER_NAME.name());
			}
		}
	
		Page<CashMemoHistoryResponse> cashMemoHistory = cashMemoRepo.listCmHistory(cashMemoHistoryDto, searchField,
				searchType, CommonUtil.getLocationCode(), statusList, subTxnType, txnType, pageable);
		//if cashmemo history is empty and cashmemo doc no is not null then we need to check if cash memo was cancelled
		for(int i=0; i < cashMemoHistory.getSize();i++){
      		try {
      			cashMemoHistory.getContent().get(i).setCustomerName(CryptoUtil.decrypt(cashMemoHistory.getContent().get(i).getCustomerName(),CUSTOMER_NAME,false));
			} catch (Exception e) {
				e.printStackTrace();
			}   
      	}
		if(cashMemoHistory.isEmpty() && cashMemoHistoryDto.getDocNo()!=null && cashMemoHistoryDto.getFiscalYear()!=null) {
		SalesTxnDao dao = salesTxnRepo.getByDocNoFiscalCodeAndLocationCode(cashMemoHistoryDto.getFiscalYear().toString(),
				cashMemoHistoryDto.getDocNo().toString(), CommonUtil.getLocationCode(), txnType, TransactionStatusEnum.CANCELLED.name());
		if(!ObjectUtils.isEmpty(dao)) {
			throw new ServiceException(INVALID_CASHMEMO, ERR_INT_097,
					Map.of("docNo", "" + cashMemoHistoryDto.getDocNo(), "locationCode", 
							CommonUtil.getLocationCode(), "fiscalYear", "" + cashMemoHistoryDto.getFiscalYear()));
		}
		CashMemoEntities cashMemoEntities=legacyCallServiceImpl.callLegacyCashMemo(CommonUtil.getLocationCode(), cashMemoHistoryDto.getDocNo(), cashMemoHistoryDto.getFiscalYear(),false);
			if (cashMemoEntities.getOriginalTxn() != null) {
				CashMemoHistoryResponse cmLegacy=getCashMemoResponse(cashMemoEntities);
				List<CashMemoHistoryResponse> cmList=List.of(cmLegacy);
				Page<CashMemoHistoryResponse> cmPageable=new PageImpl<>(cmList);
				return new PagedRestResponse<>(cmPageable);
			}
		}
		return new PagedRestResponse<>(cashMemoHistory);
	}

	private CashMemoHistoryResponse getCashMemoResponse(CashMemoEntities cashEntities) {
		CashMemoHistoryResponse cmHistory=(CashMemoHistoryResponse)MapperUtil.getObjectMapping(cashEntities.getOriginalTxn().getCashMemo(), new CashMemoHistoryResponse());
		cmHistory=(CashMemoHistoryResponse)MapperUtil.getObjectMapping(cashEntities.getOriginalTxn().getCashMemo().getSalesTxnDao(),cmHistory);
		cmHistory.setNetAmount(cashEntities.getOriginalTxn().getCashMemo().getFinalValue());
		cmHistory.setCustomerName(CryptoUtil.decrypt(cashEntities.getOriginalTxn().getCustomerTxn().getCustomerName(),CUSTOMER_NAME,false));

		return cmHistory;
	}

	@Override
	public PagedRestResponse<List<AdvanceHistoryDto>> getAdvanceHistoryService(String searchField, String searchType,
			String status, String subTxnType, String txnType, SalesHistoryReqDtoExt advanceHistoryDto,
			Pageable pageable) {
		log.info("EPOCH {}     DATE STRING {}",advanceHistoryDto.getFromDocDate(),advanceHistoryDto.getToDocDate());
		SalesHistoryValidator.filterValidation(searchField, searchType, advanceHistoryDto, status,
				advanceHistoryDto.getRefDocNo(), null, null);
		if(searchType!=null) {
			switch(searchType) {
			case REGULAR:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.MOBILE_NO.name());
				break;
			case GST_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.GST_NO.name());
				break;
			case PAN_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.PAN_NO.name());
				break;
			case EMAIL_ID:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.EMAIL_ID.name());
				break;
			case ONE_TIME:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.CUSTOMER_NAME.name());
			}
		}
		
		Page<AdvanceHistoryDto> advanceHistory = advanceRepo.listAdvanceHistory(advanceHistoryDto, status, searchType,
				searchField, txnType, CommonUtil.getLocationCode(), subTxnType, pageable);
        for(int i=0; i < advanceHistory.getSize();i++){
            try {
            	advanceHistory.getContent().get(i).setCustomerName(CryptoUtil.decrypt(advanceHistory.getContent().get(i).getCustomerName(),CUSTOMER_NAME,false));
          } catch (Exception e) {
              e.printStackTrace();
          }   
        }
		return new PagedRestResponse<>(advanceHistory);
	}

	@Override
	public PagedRestResponse<List<BillCancellationHistoryDto>> getCancelHistoryService(String searchField,
			String searchType, String subTxnType, String txnType, SalesHistoryReqDtoExt cancelHistoryDto,
			Pageable pageable) {
		SalesHistoryValidator.filterValidation(searchField, searchType, cancelHistoryDto, null,
				cancelHistoryDto.getRefDocNo(), null, null);
		cancelHistoryDto.setToNetAmount(null);
		cancelHistoryDto.setFromNetAmount(null);
		if(searchType!=null) {
			switch(searchType) {
			case REGULAR:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.MOBILE_NO.name());
				break;
			case GST_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.GST_NO.name());
				break;
			case PAN_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.PAN_NO.name());
				break;
			case EMAIL_ID:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.EMAIL_ID.name());
				break;
			case ONE_TIME:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.CUSTOMER_NAME.name());
			}
		}
		
		Page<BillCancellationHistoryDto> cancelDtoList = cancellationRepoExt.billCancellationHistory(searchField,
				searchType, subTxnType, txnType, CommonUtil.getLocationCode(), cancelHistoryDto,
				TransactionStatusEnum.CONFIRMED.name(), pageable);
        for(int i=0; i < cancelDtoList.getSize();i++){
            try {
            	cancelDtoList.getContent().get(i).setCustomerName(CryptoUtil.decrypt(cancelDtoList.getContent().get(i).getCustomerName(),CUSTOMER_NAME,false));
          } catch (Exception e) {
              e.printStackTrace();
          }   
        }
		return new PagedRestResponse<>(cancelDtoList);
	}

	@Override
	public PagedRestResponse<List<AdvanceBookingHistoryDto>> getOrderHistoryService(String searchField,
			String searchType, String actionType, String txnType, String subTxnType, String employeeCode,
			SalesHistoryReqDtoExt orderHistoryDto, Pageable pageable) {
		orderHistoryDto.setToNetAmount(null);
		orderHistoryDto.setFromNetAmount(null);
		SalesHistoryValidator.filterValidation(searchField, searchType, orderHistoryDto, actionType,
				orderHistoryDto.getRefDocNo(), null, employeeCode);
		String status = null;
		Boolean isFrozenRate = null;
		if (!StringUtils.isEmpty(actionType)) {
			if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.RATE_FREEZE.name())) {
				status = TransactionStatusEnum.CONFIRMED.name();
				isFrozenRate = false;
			} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.CANCEL.name())) {
				status = TransactionStatusEnum.CONFIRMED.name();
			} else if (actionType.equalsIgnoreCase(TransactionActionTypeEnum.ACTIVATE.name())) {
				status = TransactionStatusEnum.SUSPENDED.name();
			}
		}
		if(searchType!=null) {
			switch(searchType) {
			case REGULAR:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.MOBILE_NO.name());
				break;
			case GST_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.GST_NO.name());
				break;
			case PAN_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.PAN_NO.name());
				break;
			case EMAIL_ID:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.EMAIL_ID.name());
				break;
			case ONE_TIME:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.CUSTOMER_NAME.name());
			}
		}
	
		Page<AdvanceBookingHistoryDto> orderList = orderRepoExt.orderHistory(searchField, searchType, status, txnType,
				subTxnType, employeeCode, CommonUtil.getLocationCode(), isFrozenRate, orderHistoryDto, pageable);
		return new PagedRestResponse<>(orderList);
	}

	@Override
	public PagedRestResponse<List<CNResponseDto>> getCreditNoteHistoryService(String searchField, String searchType,
			String status, String cnType, SalesHistoryReqDtoExt creditNoteHistoryDto, Pageable pageable) {
		creditNoteHistoryDto.setFromNetAmount(null);
		creditNoteHistoryDto.setToNetAmount(null);
		SalesHistoryValidator.filterValidation(searchField, searchType, creditNoteHistoryDto, status,
				creditNoteHistoryDto.getRefDocNo(), null, null);
		Page<CNResponseDto> cnResponseList = creditNoteRepoExt.creditNoteHistory(searchField, searchType, status,
				CommonUtil.getLocationCode(), cnType, creditNoteHistoryDto, pageable);
		return new PagedRestResponse<>(cnResponseList);
	}

	@Override
	public PagedRestResponse<List<CreditNoteTransferDto>> getCreditNoteTransferHistoryService(String searchField,
			String searchType, String status, String cnType, String destLocation,
			SalesHistoryReqDtoExt creditNoteHistoryDto, Pageable pageable) {
		creditNoteHistoryDto.setFromNetAmount(null);
		creditNoteHistoryDto.setToNetAmount(null);
		SalesHistoryValidator.filterValidation(searchField, searchType, creditNoteHistoryDto, status,
				creditNoteHistoryDto.getRefDocNo(), destLocation, null);
		Response response = callEPOSSCreditNoteTransferAPI(searchField, searchType, status, cnType, destLocation,
				creditNoteHistoryDto, CommonUtil.getLocationCode(), pageable);
		int epossHTTPStatus = response.status();
		JsonNode jsonNode = convertToJsonNode(response);
		ApiResponseDto epossApiResponseDto = new ApiResponseDto();
		// Successful EPOSS API call (200 as per HTTP client)
		epossApiResponseDto = mapJsonNodeToEpossAPIResponse(epossHTTPStatus, jsonNode, epossApiResponseDto);
		epossHTTPStatus = getHttpStatusFromJsonNodeResponse(jsonNode);
		if (epossHTTPStatus == HttpStatus.OK.value()) {
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			return mapper.convertValue(epossApiResponseDto.getResponse(),
					new TypeReference<PagedRestResponse<List<CreditNoteTransferDto>>>() {
					});
		} else {
			String errCode = jsonNode.get("response").get(CommonConstants.CODE).asText();
			LOGGER.error("EPOSS CN history API Response : {}", errCode);
			throw new ServiceException(EPOSS_FAILED, errCode == null ? ERR_CORE_046 : errCode);
		}
	}

	private int getHttpStatusFromJsonNodeResponse(JsonNode jsonNode) {
		int epossHTTPStatus;
		JsonNode httpStatusCode = jsonNode.get("httpResponseCode");
		if (httpStatusCode == null)
			epossHTTPStatus = 500;
		else
			epossHTTPStatus = jsonNode.get("httpResponseCode").asInt();

		LOGGER.debug("EPOSS API Response status: {}, data: {}", epossHTTPStatus, jsonNode);
		return epossHTTPStatus;
	}

	private ApiResponseDto mapJsonNodeToEpossAPIResponse(int httpStatus, JsonNode jsonNode,
			ApiResponseDto apiResponseDto) {

		if (httpStatus == HttpStatus.OK.value()) {
			LOGGER.debug("EPOSS Feign Response status: {}", httpStatus);
			try {
				apiResponseDto = MapperUtil.getObjectMapperInstance().convertValue(jsonNode, ApiResponseDto.class);

			} catch (Exception e) {
				throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013, e);
			}
		}
		return apiResponseDto;
	}

	private JsonNode convertToJsonNode(Response response) {

		JsonNode jsonNode = null;
		try {
			jsonNode = new ObjectMapper().readTree(
					IOUtils.toString(response.body().asInputStream(), String.valueOf(StandardCharsets.UTF_8)));
		} catch (IOException e) {
			throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013, e);
		}
		return jsonNode;
	}

	private Response callEPOSSCreditNoteTransferAPI(String searchField, String searchType, String status, String cnType,
			String destLocation, SalesHistoryReqDtoExt creditNoteHistoryDto, String srcLocation, Pageable pageable) {
		Map<String, String> reqParams = new HashMap<>();
		if (searchField != null)
			reqParams.put("searchField", searchField);
		if (searchType != null)
			reqParams.put("searchType", searchType);
		if (cnType != null)
			reqParams.put("cnType", cnType);
		if (srcLocation != null)
			reqParams.put("srcLocation", srcLocation);
		if (destLocation != null)
			reqParams.put("destLocation", destLocation);
		if (status != null)
			reqParams.put("status", status);

		reqParams.put("page", String.valueOf(pageable.getPageNumber()));
		reqParams.put("size", String.valueOf(pageable.getPageSize()));
		pageable.getSort().forEach(sort -> reqParams.put("sort", sort.toString().replace(": ", ",")));

		return intgService.callEpossAPIWoError(HttpMethod.POST, SalesUtil.GET_CN_TRANSFER_URL, reqParams,
				creditNoteHistoryDto);
	}

	@Override
	public PagedRestResponse<List<GrnHistoryResponse>> getGoodsReturnService(String searchField, String searchType,
			String subTxnType, String txnType, String cmLocation, SalesHistoryReqDtoExt goodReturnHistoryDto,
			Pageable pageable) {
		goodReturnHistoryDto.setToNetAmount(null);
		goodReturnHistoryDto.setFromNetAmount(null);
		SalesHistoryValidator.filterValidation(searchField, searchType, goodReturnHistoryDto, null,
				goodReturnHistoryDto.getRefDocNo(), cmLocation, null);
		if(searchType!=null) {
			switch(searchType) {
			case REGULAR:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.MOBILE_NO.name());
				break;
			case GST_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.GST_NO.name());
				break;
			case PAN_NO:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.PAN_NO.name());
				break;
			case EMAIL_ID:
				searchField = CryptoUtil.encrypt(searchField, HistorySearchTypeEnum.EMAIL_ID.name());
			}
		}
		
		Page<GrnHistoryResponse> grnList = grnRepoExt.grnHistory(searchField, searchType, subTxnType, txnType,
				cmLocation, CommonUtil.getLocationCode(), goodReturnHistoryDto, pageable);
		
        for(int i=0; i < grnList.getSize();i++){
            try {
            	grnList.getContent().get(i).setCustomerName(CryptoUtil.decrypt(grnList.getContent().get(i).getCustomerName(),CUSTOMER_NAME,false));
          } catch (Exception e) {
              e.printStackTrace();
          }   
        }
		return new PagedRestResponse<>(grnList);
	}

	@Override
	public PagedRestResponse<List<GoodsExchangeDto>> getTepHistory(String searchField, String searchType,
			String subTxnType, String txnType, SalesHistoryReqDtoExt goodReturnHistoryDto, String status,
			Pageable pageable) {
		Page<GoodsExchangeDto> goodsExchangeList=null;
		if(!SubTxnTypeEnum.CUT_PIECE_TEP.name().equals(subTxnType)) {
			SalesHistoryValidator.filterValidation(searchField, searchType, goodReturnHistoryDto, status,
					goodReturnHistoryDto.getRefDocNo(), null, null);
			List<String> statusList= "ALL".equals(status)?List.of(TransactionStatusEnum.CONFIRMED.name(),TransactionStatusEnum.CANCELLED.name(),TransactionStatusEnum.APPROVAL_PENDING.name()):List.of(status);
			goodsExchangeList = exchangeRepositoryExt.goodsExchangeHistory(searchField, searchType,
					subTxnType, txnType, CommonUtil.getLocationCode(),statusList, goodReturnHistoryDto, pageable);
	        for(int i=0; i < goodsExchangeList.getSize();i++){
	            try {
	            	goodsExchangeList.getContent().get(i).setCustomerName(CryptoUtil.decrypt(goodsExchangeList.getContent().get(i).getCustomerName(),CUSTOMER_NAME,false));
	          } catch (Exception e) {
	              e.printStackTrace();
	          }   
	        }
		}else {
			SalesHistoryValidator.filterValidation(null, null, goodReturnHistoryDto, status,
					null, null, null);
			List<String> statusList= "ALL".equals(status)?List.of(TransactionStatusEnum.CONFIRMED.name(),TransactionStatusEnum.DELETED.name()):List.of(status);
			goodsExchangeList=stockTransactionRepo.listTransactionHistory(subTxnType, CommonUtil.getLocationCode(),statusList, goodReturnHistoryDto, pageable);
			 for(int i=0; i < goodsExchangeList.getSize();i++){
		            try {
		            	goodsExchangeList.getContent().get(i).setCustomerName(CryptoUtil.decrypt(goodsExchangeList.getContent().get(i).getCustomerName(),CUSTOMER_NAME,false));
		          } catch (Exception e) {
		              e.printStackTrace();
		          }   
		        }
		}
		return new PagedRestResponse<>(goodsExchangeList);
		
	}

	@Override
	public PagedRestResponse<List<BillCancellationHistoryDto>> getCancelGoodsExchangeHistoryService(String searchField,
			String searchType, String subTxnType, String txnType, SalesHistoryReqDtoExt cancelHistoryDto,
			Integer refTepNo, Pageable pageable) {
		SalesHistoryValidator.filterValidation(searchField, searchType, cancelHistoryDto, null,
				cancelHistoryDto.getRefDocNo(), null, null);
//		Page<BillCancellationHistoryDto> cancelDtoList = cancellationRepoExt.goodsExchangeCancellationHistory(
//				searchField, searchType, subTxnType, txnType, CommonUtil.getLocationCode(), cancelHistoryDto, refTepNo,
//				pageable);
		return null;
	}

	@Override
	public PagedRestResponse<List<InvoiceDocumentsDetailsDto>> listInvoiceDocuments(String txnType,
			CustomerDocumentsRequestDto customerDocuments, Pageable pageable) {
		
		String subTxnType = null;
		if(txnType.equalsIgnoreCase("GC")) {
			subTxnType = "GIFT_SALE";
			txnType = "CM";
		} else if(txnType.equalsIgnoreCase("ADV")) {
			subTxnType = "NON_FROZEN_RATES";
		}else if(txnType.equalsIgnoreCase("GRF")) {
			subTxnType = "FROZEN_RATES";
			txnType = "ADV";
		}
		
		Page<InvoiceDocumentsDetailsDto> orderInvoiceDetails = salesTxnRepo.getInvoiceDocumentsDetails(
				txnType, customerDocuments, pageable,true,subTxnType);
		
		return new PagedRestResponse<>(orderInvoiceDetails);
	}
}
