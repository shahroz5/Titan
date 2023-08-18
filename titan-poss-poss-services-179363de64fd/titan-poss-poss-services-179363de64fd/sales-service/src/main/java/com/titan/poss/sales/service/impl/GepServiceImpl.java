/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.EinvoiceTransactionTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.GepPriceRequest;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.ExchangeDetailsConfigDto;
import com.titan.poss.sales.dto.GoodsExhangeDaoDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.GepConfirmOrHoldDto;
import com.titan.poss.sales.dto.request.GepUpdateDto;
import com.titan.poss.sales.dto.response.GoodExchangeDiscountDetailsDto;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.GepConfigDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesInvoiceDocumentsRepository;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.GepService;
import com.titan.poss.sales.service.SalesInvoiceDocService;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Slf4j
@Service("gepService")
public class GepServiceImpl extends BaseGoodsServiceImpl implements GepService {

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CustomerTxnRepositoryExt cusTxnDetailsRepository;

	@Autowired
	private SalesInvoiceDocumentsRepository salesInvoiceDocumentsRepository;

	@Autowired
	private GepConfigDetailsRepositoryExt gepConfigDetailsRepositoryExt;
	
	@Autowired
	private SalesInvoiceDocService salesInvoiceDocService;
	
	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String MOBILE_NO = "mobileNo";
	private static final String EMAIL_ID =  "emailId";
	private static final String CUSTOMER_NAME ="customerName";
	private static final String INSTI_TAX_NO = "instiTaxNo";
	private static final String PASSPORT_ID = "passportId";
	private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	private void validationForPreDeclarationForm(String status, GepConfirmOrHoldDto gepConfirmOrHoldDto,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList) {
		long count = goodsExchangeDetailsList.stream().filter(data -> (!StringUtils.isEmpty(data.getPreMeltingDetails())
				&& !"{}".equals(data.getPreMeltingDetails()))).count();
		JsonData exchangeDetailsJson = MapperUtil.getObjectMapperInstance()
				.convertValue(gepConfirmOrHoldDto.getExchangeDetails(), JsonData.class);
		if (!StringUtils.isEmpty(exchangeDetailsJson)) {
			ExchangeDetailsConfigDto exchangeDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(exchangeDetailsJson.getData(), ExchangeDetailsConfigDto.class);
			if (BooleanUtils.isFalse(exchangeDetails.getIsDeclarationFormSubmitted())
					&& TransactionStatusEnum.CONFIRMED.toString().equals(status) && count > 0) {
				throw new ServiceException(SalesConstants.CLICK_PRE_DECLARATION_FORM, SalesConstants.ERR_SALE_081);
			}
			if (BooleanUtils.isTrue(exchangeDetails.getIsDeclarationFormSubmitted())
					&& TransactionStatusEnum.CONFIRMED.toString().equals(status) && count == 0) {
				throw new ServiceException(SalesConstants.SUBMIT_PRE_DECLARATION_FORM, SalesConstants.ERR_SALE_086);
			}
		}
	}

	@Override
	public SalesTxnDaoExt createOpenGep(String txnType, String subTxnType, TransactionCreateDto transactionCreateDto) {
		SalesTxnDaoExt salesDao = super.createGoodsExchange(null, txnType, subTxnType, SalesDocTypeEnum.GEP_OPEN,
				TransactionStatusEnum.OPEN);
		if (SubTxnTypeEnum.MANUAL_GEP.toString().equals(subTxnType)) {
			commonTransactionService.validateManualBillDetails(transactionCreateDto, salesDao);
		}
		salesDao.setSrcSyncId(0);
		salesDao.setDestSyncId(0);
		saveGoodsExchangeObject(salesDao);
		return super.saveSalesObject(salesDao);
	}

	private GoodsExchangeDaoExt saveGoodsExchangeObject(SalesTxnDaoExt salesTxnDao) {
		GoodsExchangeDaoExt goodsExchangeDao = new GoodsExchangeDaoExt();
		goodsExchangeDao.setSalesTxn(salesTxnDao);
		goodsExchangeDao.setTotalQuantity((short) 0);
		goodsExchangeDao.setTotalTax(BigDecimal.ZERO);
		goodsExchangeDao.setTotalValue(BigDecimal.ZERO);
		goodsExchangeDao.setTotalWeight(BigDecimal.ZERO);
		goodsExchangeDao.setFinalValue(BigDecimal.ZERO);
		goodsExchangeDao.setSrcSyncId(0);
		goodsExchangeDao.setDestSyncId(0);
		goodsExchangeDao.setRoundingVariance(BigDecimal.ZERO);
		return super.saveGoodsExchangeObject(goodsExchangeDao);
	}

	@Override
	public GoodsExchangeDaoExt getGoodsExchangeByIdAndTxnTypeAndSubTxnType(String id, String txnType,
			String subTxnType) {
		return super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType, subTxnType);
	}

	@Override
	public List<GoodsExchangeDetailsDaoExt> getGoodsExchangeDetails(GoodsExchangeDaoExt goodsExchangeDaoExt) {
		return super.findGoodsExchangeDetailsByGoodsExchange(goodsExchangeDaoExt);
	}

	@Override
	public GoodsExchangeDaoExt updateGoodsExchange(String id, String txnType, String subTxnType,
			GepUpdateDto gepUpdateDto) {
//		boolean isValid = commonTransactionService.validateCustomerFields(gepUpdateDto.getCustomerId());
//		if(!isValid) {
//			throw new ServiceException(SalesConstants.MANDATORY_FIELDS_OF_CUSTOMER_DETAILS_ARE_MISSING, SalesConstants.ERR_CUST_001,
//					"Mandatory fields of customer details are missing ");
//		}
		GoodsExchangeDaoExt goodsExchangeDao = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		// if status is CONFIRMED/CANCELLED then GEP cannot be updated
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchangeDao.getSalesTxn().getStatus());
		if (!StringUtils.isEmpty(gepUpdateDto.getCustomerId())) {
			commonTransactionService.updateCustomerDetails(gepUpdateDto.getCustomerId(),
					goodsExchangeDao.getSalesTxn());

			// update tax
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
					goodsExchangeDao);
			updatePriceOrTax(goodsExchangeDao, goodsExchangeDetailsList, null);
			updateGoodsExchangeHeader(goodsExchangeDao);
		}
		if (!StringUtils.isEmpty(gepUpdateDto.getEmployeeCode())) {
			goodsExchangeDao.getSalesTxn().setEmployeeCode(gepUpdateDto.getEmployeeCode());
		}
		
		if (gepUpdateDto.getExchangeDetails() != null) {
			validateExchangeConfigJson(gepUpdateDto.getExchangeDetails());
			goodsExchangeDao.setExchangeDetails(MapperUtil.getStringFromJson(gepUpdateDto.getExchangeDetails()));
		}
		goodsExchangeDao.setSrcSyncId(goodsExchangeDao.getSrcSyncId() + 1);
		return super.saveGoodsExchangeObject(goodsExchangeDao);
	}

	private void validateExchangeConfigJson(JsonData exchangeDetails) {
		if (!StringUtils.isEmpty(exchangeDetails)) {
			if (!"EXCHANGE_DETAILS_CONFIG".equals(exchangeDetails.getType())) {
				throw new ServiceException("JSON type mismatch", "ERR-CORE-014",
						"input type : " + exchangeDetails.getType() + " & expected type : EXCHANGE_DETAILS_CONFIG");
			}
			ExchangeDetailsConfigDto exchangeDetailsDto = new ExchangeDetailsConfigDto();
			exchangeDetailsDto.validate(exchangeDetails.getData());
		}
	}

	@Override
	@Transactional(value = "chainedTransaction")
	public GoodsExhangeDaoDto confirmGep(String id, String status, String txnType, String subTxnType,
			GepConfirmOrHoldDto gepConfirmOrHoldDto) {
		GoodsExhangeDaoDto goodsExhangeDaoDto = new GoodsExhangeDaoDto();
		GoodsExchangeDaoExt goodsExchangeDaoExt = super.getGoodsExchangeObjectByIdAndTxnTypeAndSubTxnType(id, txnType,
				subTxnType);
		validateGepConfirm(status, gepConfirmOrHoldDto, goodsExchangeDaoExt);
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchangeDaoExt);
		validationForPreDeclarationForm(status, gepConfirmOrHoldDto, goodsExchangeDetailsList);

		// doc no generation for HOLD and CONFIRMED status
		if (TransactionStatusEnum.HOLD.toString().equals(status)) {
			// UAT 3130: if within hold time then return
			if (TransactionStatusEnum.HOLD.name().equals(goodsExchangeDaoExt.getSalesTxn().getStatus())
					&& commonTransactionService.holdTimeCheck(goodsExchangeDaoExt.getSalesTxn(),
							super.getHoldTimeInMinutesForGep(goodsExchangeDaoExt.getSalesTxn().getLocationCode()))) {
				goodsExhangeDaoDto.setGoodsExchange(goodsExchangeDaoExt);
				return goodsExhangeDaoDto;
			}

			commonTransactionService.setHoldTime(goodsExchangeDaoExt.getSalesTxn());
			super.docNoGeneration(status, txnType, subTxnType, goodsExchangeDaoExt, SalesDocTypeEnum.GEP_HOLD);
		} else if (TransactionStatusEnum.CONFIRMED.name().equals(status)) {
			if (SubTxnTypeEnum.MANUAL_GEP.toString().equals(subTxnType)) {
				validateManualGepWeight(goodsExchangeDaoExt);
			}

			// if final Value above configured amount in Brand details, then PAN check(based
			// on configuration)
			commonTransactionService.customerDetailsCheckForFinalValue(goodsExchangeDaoExt.getFinalValue(),
					goodsExchangeDaoExt.getSalesTxn());

			// get applicable discounts
			GoodExchangeDiscountDetailsDto discountDetails = super.getApplicableDiscounts(goodsExchangeDaoExt,
					goodsExchangeDetailsList);

			JsonData discountJsonData = getValidDiscountOffer(gepConfirmOrHoldDto, discountDetails);

			if (discountDetails.getGepConfigDetailsDaoExt() != null) {
				gepConfigDetailsRepositoryExt.save(discountDetails.getGepConfigDetailsDaoExt());
			}
			// doc no generation for HOLD status
			super.docNoGeneration(status, txnType, subTxnType, goodsExchangeDaoExt, SalesDocTypeEnum.GEP);
			goodsExchangeDaoExt.getSalesTxn().setConfirmedTime(CalendarUtils.getCurrentDate());

			log.info("doc no in GepServiceImpl ---- {}", goodsExchangeDaoExt.getSalesTxn().getDocNo());
			List<InventoryDetailsDao> inventoryDetails = addItemDetailsInInventory(goodsExchangeDaoExt,
					goodsExchangeDetailsList);

			Integer cnDocNo = super.generateCN(CNType.GEP.toString(), goodsExchangeDaoExt,
					gepConfirmOrHoldDto.getRemarks(), discountJsonData, discountDetails.getGepConfigDetailsDaoExt());
			goodsExhangeDaoDto.setCnDocNo(cnDocNo);
			goodsExhangeDaoDto.setInventoryList(inventoryDetails);
		}
		goodsExchangeDaoExt.setSrcSyncId(goodsExchangeDaoExt.getSrcSyncId() + 1);
		goodsExchangeDaoExt.getSalesTxn().setRemarks(gepConfirmOrHoldDto.getRemarks());
		goodsExchangeDaoExt.getSalesTxn().setSrcSyncId(goodsExchangeDaoExt.getSalesTxn().getSrcSyncId() + 1);
		if (TransactionStatusEnum.CONFIRMED.name().equals(status))
			eInvoiceCheck(txnType, goodsExchangeDaoExt, goodsExchangeDetailsList, goodsExchangeDaoExt.getSalesTxn());
		goodsExchangeDaoExt.setPaymentType(gepConfirmOrHoldDto.getPaymentType());
		super.saveSalesObject(goodsExchangeDaoExt.getSalesTxn());
		goodsExhangeDaoDto.setGoodsExchange(super.saveGoodsExchangeObject(goodsExchangeDaoExt));
		return goodsExhangeDaoDto;
	}

	private JsonData getValidDiscountOffer(GepConfirmOrHoldDto gepConfirmOrHoldDto,
			GoodExchangeDiscountDetailsDto discountDetails) {
		JsonData discountJsonData = new JsonData();

		if (discountDetails.getDiscountObj().isEmpty()) {
			return null;// have to return null if not applicable
		}
		super.checkDiscount(gepConfirmOrHoldDto.getDiscountTypeSelected(), discountDetails);

		Map<String, Object> discounts = new HashMap<>();
		discountJsonData.setType("CN_DISCOUNT_DETAILS");
		for (Map.Entry<String, Object> mapObj : discountDetails.getDiscountObj().entrySet()) {
			if ((gepConfirmOrHoldDto.getDiscountTypeSelected() != null
					&& gepConfirmOrHoldDto.getDiscountTypeSelected().equals(mapObj.getKey()))
					|| (gepConfirmOrHoldDto.getDiscountTypeSelected() == null)) {
				if (DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name().equals(mapObj.getKey())) {
					discounts.put("gepPurityDiscount", mapObj.getValue());
				} else if (DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name().equals(mapObj.getKey())) {
					discounts.put("karatageExchangeDiscount", mapObj.getValue());
				}

				if (gepConfirmOrHoldDto.getDiscountTypeSelected() != null)
					break;
			}

		}
		discountJsonData.setData(discounts);

		return discountJsonData;
	}

	private void eInvoiceCheck(String txnType, GoodsExchangeDaoExt goodsExchangeDaoExt,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, SalesTxnDaoExt salesTxn) {
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(salesTxn.getLocationCode());
		StoreDetails storeDetails = locationCacheDto.getStoreDetails();
		if (BooleanUtils.isTrue(storeDetails.getIsEinvoiceEnabled())) {
			CustomerTxnDaoExt customerTxnDaoExt = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxn.getId());
			customerTxnDaoExt.setMobileNumber(CryptoUtil.decrypt(customerTxnDaoExt.getMobileNumber(),MOBILE_NO,false));
			customerTxnDaoExt.setEmailId(CryptoUtil.decrypt(customerTxnDaoExt.getEmailId(),EMAIL_ID,false));
			customerTxnDaoExt.setCustomerName(CryptoUtil.decrypt(customerTxnDaoExt.getCustomerName(),CUSTOMER_NAME,false));
			customerTxnDaoExt.setCustTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNo(),CUST_TAX_NO,false));
			customerTxnDaoExt.setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDaoExt.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
			customerTxnDaoExt.setInstiTaxNo(CryptoUtil.decrypt(customerTxnDaoExt.getInstiTaxNo(),INSTI_TAX_NO,false));
			customerTxnDaoExt.setPassportId(CryptoUtil.decrypt(customerTxnDaoExt.getPassportId(),PASSPORT_ID,false));
			SalesInvoiceDocumentsDao salesInvoiceDocumentsDao = salesInvoiceDocumentsRepository
					.findByReferenceIdAndTransactionType(salesTxn.getId(), EinvoiceTransactionTypeEnum.GEP.name());
			if (salesInvoiceDocumentsDao == null) {
				EinvoiceIrnDetailsResponseDto einvoiceIrnDetailsResponseDto = commonTransactionService.generateInvoice(
						txnType, goodsExchangeDetailsList, salesTxn, goodsExchangeDaoExt, customerTxnDaoExt);
				if (BooleanUtils.isTrue(einvoiceIrnDetailsResponseDto.getStatus())) {
					salesInvoiceDocumentsDao = MapperUtil.mapObjToClass(einvoiceIrnDetailsResponseDto,
							SalesInvoiceDocumentsDao.class);
					salesInvoiceDocumentsDao.setReferenceId(salesTxn.getId());
					salesInvoiceDocumentsDao.setTransactionType(EinvoiceTransactionTypeEnum.GEP.name());
					salesInvoiceDocService.syncDataInvoiceDocs(salesInvoiceDocumentsDao);
				}
			}
			if ((!StringUtils.isEmpty(customerTxnDaoExt.getMobileNumber()) && (customerTxnDaoExt.getMobileNumber().length() ==10)))
				customerTxnDaoExt
						.setMobileNumber(CryptoUtil.encrypt(customerTxnDaoExt.getMobileNumber(), MOBILE_NO));
				if ((!StringUtils.isEmpty(customerTxnDaoExt.getInstiTaxNo()) && (customerTxnDaoExt.getInstiTaxNo().length() <= 15)))
				customerTxnDaoExt
						.setInstiTaxNo(CryptoUtil.encrypt(customerTxnDaoExt.getInstiTaxNo(), INSTI_TAX_NO));
				if (!StringUtils.isEmpty(customerTxnDaoExt.getEmailId()))
				customerTxnDaoExt.setEmailId(CryptoUtil.encrypt(customerTxnDaoExt.getEmailId(), EMAIL_ID));
				if (!StringUtils.isEmpty(customerTxnDaoExt.getCustomerName()))
				customerTxnDaoExt
						.setCustomerName(CryptoUtil.encrypt(customerTxnDaoExt.getCustomerName(), CUSTOMER_NAME));
				if ((!StringUtils.isEmpty(customerTxnDaoExt.getCustTaxNo()) && (customerTxnDaoExt.getCustTaxNo().length() <= 10)))
				customerTxnDaoExt.setCustTaxNo(CryptoUtil.encrypt(customerTxnDaoExt.getCustTaxNo(),CUST_TAX_NO));
				if((!StringUtils.isEmpty(customerTxnDaoExt.getCustTaxNoOld()) && (customerTxnDaoExt.getCustTaxNoOld().length() <= 10)))
				customerTxnDaoExt.setCustTaxNoOld(CryptoUtil.encrypt(customerTxnDaoExt.getCustTaxNoOld(),CUST_TAX_NO_OLD));
				customerTxnDaoExt.setPassportId(CryptoUtil.encrypt(customerTxnDaoExt.getPassportId(),PASSPORT_ID));
		}
	}

	private List<InventoryDetailsDao> addItemDetailsInInventory(GoodsExchangeDaoExt goodsExchangeDaoExt,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList) {
		List<GoodsExchangeDetailsDaoExt> itemList = new ArrayList<>();
		Map<String, String> goodsExchangeDetailsMap;
		List<InventoryDetailsDao> inventoryDetailsList = new ArrayList<>();
		goodsExchangeDetailsMap = super.addItemsInInventory(goodsExchangeDaoExt.getSalesTxn().getDocDate(),
				goodsExchangeDaoExt.getSalesTxn().getDocNo(), SalesDocTypeEnum.GEP, goodsExchangeDetailsList,
				inventoryDetailsList, goodsExchangeDaoExt.getSalesTxn().getFiscalYear());
		for (GoodsExchangeDetailsDaoExt record : goodsExchangeDetailsList) {
			String inventoryId = goodsExchangeDetailsMap.get(record.getId());
			log.debug("inventoryId ---- {}", inventoryId);
			record.setInventoryId(inventoryId);
			itemList.add(record);
		}
		super.saveGoodsExchangeDetailsListObject(itemList);
		return inventoryDetailsList;
	}

	private void validateManualGepWeight(GoodsExchangeDaoExt goodsExchangeDaoExt) {
		// to check total weight and final value for manual bill.
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchangeDaoExt);
		WeightDetailsDto weightDetailsDto = super.getGoodsExchangeWeightDetails(goodsExchangeDetailsList);
		commonTransactionService.manualBillValuesWithHeader(goodsExchangeDaoExt.getTotalWeight(),
				goodsExchangeDaoExt.getTotalValue(), goodsExchangeDaoExt.getSalesTxn(), true, weightDetailsDto);
	}

	private void validateGepConfirm(String status, GepConfirmOrHoldDto gepConfirmOrHoldDto,
			GoodsExchangeDaoExt goodsExchangeDaoExt) {
		// gep confirm only when status is OPEN/HOLD
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchangeDaoExt.getSalesTxn().getStatus());

		// metal rate check
		commonTransactionService.checkMetalRate(goodsExchangeDaoExt.getSalesTxn(),
				gepConfirmOrHoldDto.getMetalRateList(), TransactionStatusEnum.valueOf(status), true,
				getHoldTimeInMinutesForGep(goodsExchangeDaoExt.getSalesTxn().getLocationCode()), false, Set.of());
		// validate UI input & db value
		validateGepTotals(gepConfirmOrHoldDto, goodsExchangeDaoExt);
		validateExchangeConfigJson(gepConfirmOrHoldDto.getExchangeDetails());
		// check: customer change is valid
		if (!goodsExchangeDaoExt.getSalesTxn().getCustomerId().equals(gepConfirmOrHoldDto.getCustomerId())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Customer id in db : " + goodsExchangeDaoExt.getSalesTxn().getCustomerId()
							+ " and customer id is coming from UI : " + gepConfirmOrHoldDto.getCustomerId());
		}
	}

	private void validateGepTotals(GepConfirmOrHoldDto gepConfirmOrHoldDto, GoodsExchangeDaoExt goodsExchangeDao) {
		log.debug("total quantity in db ---- " + goodsExchangeDao.getTotalQuantity() + " and UI total quantity ---- "
				+ gepConfirmOrHoldDto.getTotalQuantity());
		if (!goodsExchangeDao.getTotalQuantity().equals(gepConfirmOrHoldDto.getTotalQuantity())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"DB total quantity : " + goodsExchangeDao.getTotalQuantity() + " and UI total quantity : "
							+ gepConfirmOrHoldDto.getTotalQuantity());
		}
		log.debug("total weight in db ---- " + goodsExchangeDao.getTotalWeight() + " and UI total weight ---- "
				+ gepConfirmOrHoldDto.getTotalWeight());
		if (goodsExchangeDao.getTotalWeight().compareTo(gepConfirmOrHoldDto.getTotalWeight()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"DB total weight : " + goodsExchangeDao.getTotalWeight() + " and UI total weight : "
							+ gepConfirmOrHoldDto.getTotalWeight());
		}
		log.debug("total tax in db ---- " + goodsExchangeDao.getTotalTax() + " and UI total tax ---- "
				+ gepConfirmOrHoldDto.getTotalTax());
		if (goodsExchangeDao.getTotalWeight().compareTo(gepConfirmOrHoldDto.getTotalWeight()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048, "DB total tax : "
					+ goodsExchangeDao.getTotalTax() + " and UI total tax : " + gepConfirmOrHoldDto.getTotalTax());
		}
		log.debug("total value in db ---- " + goodsExchangeDao.getTotalValue() + " and UI total value ---- "
				+ gepConfirmOrHoldDto.getTotalValue());
		if (goodsExchangeDao.getTotalValue().compareTo(gepConfirmOrHoldDto.getTotalValue()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"DB total value : " + goodsExchangeDao.getTotalValue() + " and UI total value : "
							+ gepConfirmOrHoldDto.getTotalValue());
		}
		log.debug("final value in db ---- " + goodsExchangeDao.getFinalValue() + " and UI final value ---- "
				+ gepConfirmOrHoldDto.getFinalValue());
		if (goodsExchangeDao.getFinalValue().compareTo(gepConfirmOrHoldDto.getFinalValue()) != 0) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"DB final value : " + goodsExchangeDao.getFinalValue() + " and UI final value : "
							+ gepConfirmOrHoldDto.getFinalValue());
		}
	}

	@Override
	public List<GoodsExchangeDetailsDaoExt> updateGepItemsPrice(GoodsExchangeDaoExt goodsExchangeDao) {
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchangeDao.getSalesTxn().getStatus());

		// if within hold time, then do not update metal rate
		if (TransactionStatusEnum.HOLD.name().equals(goodsExchangeDao.getSalesTxn().getStatus())
				&& commonTransactionService.holdTimeCheck(goodsExchangeDao.getSalesTxn(),
						getHoldTimeInMinutesForGep(goodsExchangeDao.getSalesTxn().getLocationCode()))) {
			return super.findGoodsExchangeDetailsByGoodsExchange(goodsExchangeDao);
		}

		MetalRateListDto metalRateList = commonTransactionService.getMetalRate();
		List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList = super.findGoodsExchangeDetailsByGoodsExchange(
				goodsExchangeDao);
		goodsExchangeDetailsList = updatePriceOrTax(goodsExchangeDao, goodsExchangeDetailsList, metalRateList);
		return super.saveGoodsExchangeDetailsListObject(goodsExchangeDetailsList);
	}

	private List<GoodsExchangeDetailsDaoExt> updatePriceOrTax(GoodsExchangeDaoExt goodsExchangeDao,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, MetalRateListDto metalRateList) {
		List<GoodsExchangeDetailsDaoExt> detailsList = new ArrayList<>();
		for (GoodsExchangeDetailsDaoExt goodsExchangeDetails : goodsExchangeDetailsList) {
			// get updated price
			BigDecimal priceValue;
			GepPriceResponseDto gepPriceResp = null;
			if (metalRateList != null) {
				gepPriceResp = getGepPriceDetails(goodsExchangeDetails, metalRateList);
				priceValue = gepPriceResp.getFinalValue();
			} else {
				priceValue = goodsExchangeDetails.getTotalValue();
			}
			// get totalTax & taxDetails JSON
			TaxCalculationResponseDto taxDetails = engineService.getTaxDetails(CommonUtil.getLocationCode(),
					goodsExchangeDao.getSalesTxn().getCustomerId(), TxnTaxTypeEnum.TEP_GEP_TANISHQ_EXCHANGE.name(),
					goodsExchangeDetails.getItemCode(), false, null);
			BigDecimal itemTotalTax = commonTransactionService.getTaxDetails(priceValue, null, taxDetails);
			goodsExchangeDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
			goodsExchangeDetails.setTotalTax(itemTotalTax);
			goodsExchangeDetails.setUnitValue(priceValue);
			goodsExchangeDetails.setTotalValue(priceValue);
			goodsExchangeDetails.setFinalValue(priceValue.add(itemTotalTax));
			if (gepPriceResp != null)
				goodsExchangeDetails.setPriceDetails(MapperUtil.getStringFromJson(gepPriceResp));
			detailsList.add(goodsExchangeDetails);
		}
		if (metalRateList != null)
			goodsExchangeDao.getSalesTxn().setMetalRateDetails(MapperUtil.getStringFromJson(metalRateList));
		super.saveSalesObject(goodsExchangeDao.getSalesTxn());
		return detailsList;
	}

	private GepPriceResponseDto getGepPriceDetails(GoodsExchangeDetailsDaoExt goodsExchangeDetails,
			MetalRateListDto metalRateList) {
		GepPriceRequest gepPriceRequest = new GepPriceRequest();
		gepPriceRequest.setStandardPrice(metalRateList.getMetalRates());
		MapperUtil.beanMapping(goodsExchangeDetails, gepPriceRequest);
		gepPriceRequest.setMeasuredPurity(goodsExchangeDetails.getPurity());
		gepPriceRequest.setMeasuredWeight(goodsExchangeDetails.getUnitWeight());
		return engineService.getGepPriceDetails(gepPriceRequest);
	}

	@Override
	public GoodsExchangeDaoExt updateGoodsExchangeHeader(GoodsExchangeDaoExt goodsExchangeDao) {
		return super.updateGoodsExchangeHeaderDetails(goodsExchangeDao);
	}

	@Override
	public void deleteGep(String id, String txnType, String subTxnType, String remarks,
			GoodsExchangeDaoExt goodsExchange) {
		commonTransactionService.checkTranscationStatusForUpdate(goodsExchange.getSalesTxn().getStatus());
		goodsExchange.setSalesTxn(commonTransactionService.getSalesTxnDao(goodsExchange.getSalesTxn(),
				TransactionTypeEnum.GEP.name(), goodsExchange.getSalesTxn().getSubTxnType(), SalesDocTypeEnum.CT_DELETE,
				TransactionStatusEnum.DELETED));
		// if remarks not empty, then set remarks
		if (!StringUtils.isEmpty(remarks)) {
			goodsExchange.getSalesTxn().setRemarks(remarks);
		}

		super.saveSalesObject(goodsExchange.getSalesTxn());
	}

	@Override
	public GoodExchangeDiscountDetailsDto checkApplicableDiscounts(GoodsExchangeDaoExt goodsExchangeDaoExt,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList) {
		return super.getApplicableDiscounts(goodsExchangeDaoExt, goodsExchangeDetailsList);
	}

}
