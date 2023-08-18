/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.EmployeeLoanCustomerDetailsDto;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.dto.ItemStoneMappingDto;
import com.titan.poss.core.dto.LotNumberDetailReqDto;
import com.titan.poss.core.dto.LotNumberDetailsDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.MultiMetalDetailsDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemStoneMappingDao;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotDetailsIdDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsIdDao;
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.repository.ItemRepository;
import com.titan.poss.product.repository.ItemStoneMappingRepository;
import com.titan.poss.product.repository.LotDetailsRepository;
import com.titan.poss.product.repository.LotMaterialDetailsRepository;
import com.titan.poss.product.repository.MaterialRepository;
import com.titan.poss.product.repository.StoneRepository;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CustomerCouponDaoExt;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.DiscountDetailsDao;
import com.titan.poss.sales.dao.DiscountItemDetailsDao;
import com.titan.poss.sales.dao.FocDetailsDao;
import com.titan.poss.sales.dao.FocSchemesDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.PaymentItemMappingDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CashMemoDetailsResponseDto;
import com.titan.poss.sales.dto.CashMemoDetailsSyncDtoExt;
import com.titan.poss.sales.dto.CashMemoEntities;
import com.titan.poss.sales.dto.CashMemoEntity;
import com.titan.poss.sales.dto.CashMemoSyncDtoExt;
import com.titan.poss.sales.dto.CustomerCouponDto;
import com.titan.poss.sales.dto.CustomerEpossSearchDto;
import com.titan.poss.sales.dto.CustomerLocationMappingSyncDto;
import com.titan.poss.sales.dto.CustomerSyncDtoExt;
import com.titan.poss.sales.dto.CustomerTxnSyncDtoExt;
import com.titan.poss.sales.dto.FocDetailsDtoEntity;
import com.titan.poss.sales.dto.ReturnableItemsDto;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.RivaahCardStatusEnum;
import com.titan.poss.sales.dto.constants.SalesCouponEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.TxnSourceType;
import com.titan.poss.sales.dto.constants.TxnStatusCancelEnum;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.repository.CancellationRepositoryExt;
import com.titan.poss.sales.repository.CashMemoDetailsRepository;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepository;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CustomerCouponRepositoryExt;
import com.titan.poss.sales.repository.CustomerLocationMappingRepositoryExt;
import com.titan.poss.sales.repository.CustomerTcsDetailsRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepository;
import com.titan.poss.sales.repository.DiscountDetailsRepository;
import com.titan.poss.sales.repository.DiscountItemDetailsRepository;
import com.titan.poss.sales.repository.FocDetailsRepository;
import com.titan.poss.sales.repository.FocSchemesRepository;
import com.titan.poss.sales.repository.GoodsExchangeDetailsRepositoryExt;
import com.titan.poss.sales.repository.GrnDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepository;
import com.titan.poss.sales.repository.PaymentItemMappingRepository;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CashMemoEpossService;
import com.titan.poss.sales.service.CashMemoItemService;
import com.titan.poss.sales.service.CustomerEpossService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.GoodsReturnService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.EpossCallServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("CashMemoEpossService")
public class CashMemoEpossServiceImpl implements CashMemoEpossService {

	@Autowired
	private GoodsReturnService goodsReturnService;

	@Autowired
	private PaymentDetailsRepository paymentDetailsRepo;

	@Autowired
	private CashMemoRepository cashMemoRepo;

	@Autowired
	private CashMemoRepositoryExt cashMemoRepoExt;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private SalesTxnRepository salesTxnRepo;

	@Autowired
	private CustomerTxnRepository custTxnRepo;

	@Autowired
	private CashMemoDetailsRepository cmdRepo;

	@Autowired
	private FocDetailsRepository focDetailsRepo;

	@Autowired
	private FocSchemesRepository focSchemeRepo;

	@Autowired
	private CustomerEpossService customerEpossService;

	@Autowired
	private CustomerLocationMappingRepositoryExt customerLocationMappingRepo;

	@Autowired
	private CashMemoItemService cmItemService;

	@Autowired
	private CustomerCouponRepositoryExt customerCouponRepository;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private EpossCallServiceImpl epossCallService;

	@Autowired
	private DiscountDetailsRepository discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepository discountItemDetailsRepository;

	@Autowired
	private LotDetailsRepository lotDetailsRepo;

	@Autowired
	private ItemRepository itemRepoExt;

	@Autowired
	private CancellationRepositoryExt cancelRepo;

	@Autowired
	private StoneRepository stoneRepoExt;

	@Autowired
	private LotMaterialDetailsRepository lotMaterialRepo;

	@Autowired
	private ItemStoneMappingRepository itemStoneRepo;

	@Autowired
	private MaterialRepository materialRepoExt;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private GrnDetailsRepositoryExt grnDetailsRepositoryExt;

	@Autowired
	private GoodsExchangeDetailsRepositoryExt goodsExchangeDetailsRepository;
	

	@Autowired
	private CustomerTcsDetailsRepositoryExt customerTcsDetailsRepository;

	@Autowired 
	private PaymentItemMappingRepository paymentItemMappingRepository;


	// same if customer not found
	private static final String ERR_SALE_070 = "ERR-SALE-070";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	public static final String ERR_SALE_075 = "ERR-SALE-075";
	public static final String NO_CUST_DETAILS_IN_THE_TRANSACTION = "No customer details found in the transaction.";

	public static final String ERR_SALE_076 = "ERR-SALE-076";
	public static final String NO_PAYMENT_FOUND_IN_THE_TRANSACTION = "No payment(s) found in the transaction.";

	public static final String LEGACY_CALL_FAILED = "Request to Legacy applicaiton failed, couldn't download cashMemo";
	public static final String ERR_SALE_327 = "ERR-SALE-327";

	private static final String INSTI_TAX_NO = "instiTaxNo";
    private static final String MOBILE_NO = "mobileNo";
    private static final String CUST_TAX_NO = "custTaxNo";
    private static final String EMAIL_ID =  "emailId";
    private static final String CUSTOMER_NAME ="customerName";
    private static final String PASSPORT_ID = "passportId";
    private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	
	@Value("${app.name}")
	private String appName;

	@Override
	public List<ReturnableItemsDto> listItemIdAllowedForReturn(String cmId, String txnType) {

		// check if CM is available else record not found error
		// helpful when doing GRN for same location & CM is not synced to EPOSS
		verifyIfCmExist(cmId);
		ReturnableItemsDto list = new ReturnableItemsDto();
		List<ReturnableItemsDto> items = new ArrayList<ReturnableItemsDto>();
		if (txnType != null && txnType.equals(TxnTypeCancelEnum.GRN.name())) {
			items = goodsReturnService.listReturnableItems(cmId);
		}
		return items;
	}

	@Override
	public ListResponse<ItemDetailsResponseDto> listItemsAllowedForReturn(String cmId, String locationCode,
			String txnType) {

		verifyIfCmExist(cmId, locationCode);

		List<String> itemIds = new ArrayList<>();
		if (txnType != null && txnType.equals(TxnTypeCancelEnum.GRN.name()))
			itemIds = goodsReturnService.listItemIdsAllowedForGRN(cmId).getResults();

		List<ItemDetailsResponseDto> items = new ArrayList<>();
		if (!itemIds.isEmpty()) {
			List<CashMemoDetailsDaoExt> cashMemoItems = cashMemoDetailsRepository.findByIdIn(itemIds);
			if (!cashMemoItems.isEmpty()) {
				items = cashMemoItems.stream().map(item -> cmItemService.mapCashMemoDetailsToItemDto(item))
						.collect(Collectors.toList());
			}
		}
		return new ListResponse<>(items);
	}

	private void verifyIfCmExist(String cmId, String locationCode) {

		// check if CM available in EPOSS DB
		String cmTxnType = TransactionTypeEnum.CM.name();
		CashMemoDaoExt cm = cashMemoRepoExt.findOneByIdAndLocationCodeAndTxnType(cmId, locationCode, cmTxnType);
		if (cm == null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070,
					"Cash Memo not available. " + cmId + " : " + locationCode + " : " + cmTxnType);
	}

	private void verifyIfCmExist(String cmId) {

		// check if CM available in EPOSS DB
		String cmTxnType = TransactionTypeEnum.CM.name();
		CashMemoDaoExt cm = cashMemoRepoExt.findOneByIdAndTxnType(cmId, cmTxnType);
		if (cm == null)
			throw new ServiceException(RECORD_NOT_FOUND, ERR_SALE_070, "Cash Memo not available. " + cmId + cmTxnType);
	}

	@Override
	@Transactional(readOnly = true)
	public CashMemoEntities getCashMemoEntityDetails(String txnType, String locationCode, Integer refDocNo,
			Short refFiscalYear, boolean isGrnItemAllowedCheck, Boolean isMigratedIgnored) {

		List<String> txnStatus = List.of(TransactionStatusEnum.CONFIRMED.name(),
				TransactionStatusEnum.CANCELLED.name());

		CashMemoDao cashMemo = getCashMemoWErrorCheck(locationCode, refDocNo, refFiscalYear, txnStatus,
				TransactionTypeEnum.CM.name(), null, null, isMigratedIgnored);

		if (cashMemo == null) {
			return new CashMemoEntities();
		}

		String refId = cashMemo.getId();

		List<ReturnableItemsDto> returnedItems = null;
		// removed FK values using @JsonIgnore
		CashMemoEntity original = mapDaoToDto(cashMemo, getCashMemoDetailsByCMId(refId),
				getCustomerTxnDetailsById(refId), getPaymentDetailsById(refId, cashMemo.getIsMigrated()),
				getFocSchemesBySalesTxnId(refId), getFocDetailsBySalesTxnId(refId));
		mapDiscountsToCm(refId, original);
		CustomerTcsDetailsDaoExt customerTcsDetailsDao = customerTcsDetailsRepository.findBySalesTxnDaoId(cashMemo.getSalesTxnDao().getId());
		if(customerTcsDetailsDao !=null) {
			original.setTcsApplicableAmount(customerTcsDetailsDao.getTcsApplicableAmount());
			original.setTcsPercentage(customerTcsDetailsDao.getTcsPercentage());
		}
		else {
			original.setTcsApplicableAmount(null);
			original.setTcsPercentage(null);
		}
		CashMemoEntity foc = getRelatedFocCM(locationCode, txnStatus, cashMemo);

		if ((txnType != null && txnType.equals(TxnTypeCancelEnum.GRN.name())) && (isGrnItemAllowedCheck)) {
			List<ReturnableItemsDto> items = goodsReturnService.listReturnableItems(refId);
			returnedItems = items;

		}

		CustomerEpossSearchDto customer = customerEpossService
				.getCustomerByIdAndLocationCode(original.getCashMemo().getSalesTxnDao().getCustomerId(), locationCode);
		
		List<PaymentItemMappingDao> paymentItemMappingDaoDetails=paymentItemMappingRepository.getByTxnIdAndLocationCodeAndStatusIn(cashMemo.getSalesTxnDao().getId(),locationCode,
				List.of(PaymentStatusEnum.COMPLETED.toString()),null);
        original.setPaymentItemMappingDaoDetails(paymentItemMappingDaoDetails);
//		return new CashMemoEntities(original, foc, customer, focEligibleItemIds, returnedItemIds);
		return new CashMemoEntities(original, foc, customer, returnedItems,paymentItemMappingDaoDetails);
	}

	@Override
	@Transactional(value = "chainedTransaction")
	public CashMemoEntities persistLegacyCm(CashMemoEntities cashMemoEntities,List<CashMemoDetailsDao> cmDetailsList) {

		String createdBy = cashMemoEntities.getOriginalTxn().getCashMemo().getCreatedBy();
		CashMemoDao legacyCm = cashMemoEntities.getOriginalTxn().getCashMemo();
		SalesTxnDao salesTxn = legacyCm.getSalesTxnDao();
		CustomerTxnDao customerTxn = cashMemoEntities.getOriginalTxn().getCustomerTxn();
		
		// adding legacy CM payment details in db for cm history
		List<CashMemoDetailsDao> legacyCashMemoDetails = cashMemoEntities.getOriginalTxn().getCashMemoDetails();

		// Customer persist
		CustomerEpossSearchDto customerToSearch = new CustomerEpossSearchDto();
		customerToSearch.setCustomer(cashMemoEntities.getCustomer().getCustomer());
		customerToSearch.setCustomerUlp(cashMemoEntities.getCustomer().getCustomerUlp());
		CustomerEpossSearchDto customer = customerEpossService.searchCustomer(customerToSearch,
				legacyCm.getSalesTxnDao().getLocationCode());

		// customer location mapping
		CustomerLocationMappingDao customerLocation = getLocationMapping(customer.getCustomer(),
				legacyCm.getSalesTxnDao().getLocationCode());

		// cashMemo search
		CashMemoDao cashMemo = cashMemoRepo
				.getBySalesTxnDaoLocationCodeAndSalesTxnDaoDocNoAndSalesTxnDaoFiscalYearAndIsMigrated(
						legacyCm.getSalesTxnDao().getLocationCode(), legacyCm.getSalesTxnDao().getDocNo(),
						legacyCm.getSalesTxnDao().getFiscalYear(), true);
		
		List<LotNumberDetailsDto> lotnumberDetailsList = cashMemoEntities.getOriginalTxn().getLotNumberDetailsList();
		List<MultiMetalDetailsDto> multiMetalDetailsList = cashMemoEntities.getOriginalTxn().getMultiMetalDetailsList();
		List<ItemStoneMappingDto> itemStoneDetailsList = cashMemoEntities.getOriginalTxn().getItemStoneMappingList();

		List<LotDetailsDao> templLotnumberDetailsList = new ArrayList<LotDetailsDao>();
		List<LotMaterialDetailsDao> tempMaterialDaoList = new ArrayList<LotMaterialDetailsDao>();
		List<ItemStoneMappingDao> tempItemStoneMappingList = new ArrayList<ItemStoneMappingDao>();

		LotNumberDetailReqDto lotDetailsReqDto = new LotNumberDetailReqDto();
		lotDetailsReqDto.setLotDetails(lotnumberDetailsList);
		lotDetailsReqDto.setMultiMetalDetailsList(multiMetalDetailsList);
		lotDetailsReqDto.setItemStoneMappingList(itemStoneDetailsList);
		
		if (BooleanUtils.isFalse(customerTxn.getIsEncrypted())) {
			if (customerTxn.getMobileNumber() != null)
				customerTxn.setMobileNumber(CryptoUtil.encrypt(customerTxn.getMobileNumber(), MOBILE_NO));
			if (customerTxn.getEmailId() != null)
				customerTxn.setEmailId(CryptoUtil.encrypt(customerTxn.getEmailId(), EMAIL_ID));
			if (customerTxn.getCustomerName() != null)
				customerTxn.setCustomerName(CryptoUtil.encrypt(customerTxn.getCustomerName(), CUSTOMER_NAME));
			if (customerTxn.getCustTaxNo() != null)
				customerTxn.setCustTaxNo(CryptoUtil.encrypt(customerTxn.getCustTaxNo(), CUST_TAX_NO));
			if (customerTxn.getCustTaxNoOld() != null)
				customerTxn.setCustTaxNoOld(CryptoUtil.encrypt(customerTxn.getCustTaxNoOld(), CUST_TAX_NO_OLD));
			if (customerTxn.getInstiTaxNo() != null)
				customerTxn.setInstiTaxNo(CryptoUtil.encrypt(customerTxn.getInstiTaxNo(), INSTI_TAX_NO));
			if (customerTxn.getPassportId() != null)
				customerTxn.setPassportId(CryptoUtil.encrypt(customerTxn.getPassportId(), PASSPORT_ID));

			customerTxn.setIsEncrypted(true);
		}
		if (cashMemo == null) {
			
			log.info("lotDetailsReqDto - {}",MapperUtil.getStringFromJson(lotDetailsReqDto));;
			
			epossCallService.callEposs(HttpMethod.PUT, SalesUtil.UPDATE_LOT_NUMBER_DETAILS_URL, null, lotDetailsReqDto,
					null);
			// set Lot Stone details,Other Material Details and Item Stone Details for
			// studded items
			saveLotDetails(lotnumberDetailsList, multiMetalDetailsList, itemStoneDetailsList, templLotnumberDetailsList,
					tempMaterialDaoList, tempItemStoneMappingList);
			String id = UUID.randomUUID().toString().toUpperCase();
			salesTxn.setId(id);
			salesTxn.setCustomerId(customerLocation.getCustomerLocationMappingId().getCustomerId());
			salesTxn.setTxnSource(TxnSourceType.LEGACY.name());
			salesTxn = salesTxnRepo.save(salesTxn);
			legacyCm.setId(id);
			legacyCm.setSalesTxnDao(salesTxn);
			legacyCm = cashMemoRepo.save(legacyCm);
			customerTxn.setId(id);
			customerTxn.setSalesTxnDao(salesTxn);
			customerTxn.setCustomerId(salesTxn.getCustomerId());
			customerTxn = custTxnRepo.save(customerTxn);
			for (CashMemoDetailsDao legacyCmDetails : legacyCashMemoDetails) {
				String cmDetailId = UUID.randomUUID().toString().toUpperCase();
				legacyCmDetails.setId(cmDetailId);
				legacyCmDetails.setCashMemoDao(legacyCm);

				if (legacyCmDetails.getProductCategoryCode() == null || legacyCmDetails.getProductGroupCode() == null
						|| legacyCmDetails.getInventoryStdValue() == null) {
					ItemDao itemDao = itemRepoExt.findOneByItemCode(legacyCmDetails.getItemCode());
					if (itemDao != null) {
						legacyCmDetails.setProductCategoryCode(itemDao.getProductCategory().getProductCategoryCode());
						legacyCmDetails.setProductGroupCode(itemDao.getProductGroup().getProductGroupCode());
						legacyCmDetails.setInventoryStdValue(
								itemDao.getStdValue().multiply(new BigDecimal(legacyCmDetails.getTotalQuantity())));
					} else {
						throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
								"itemCode : " + legacyCmDetails.getItemCode());
					}
				}
			}
			legacyCashMemoDetails = cmdRepo.saveAll(legacyCashMemoDetails);
			
			if(salesTxn!=null && cashMemoEntities.getOriginalTxn().getPaymentDetails()!=null && !cashMemoEntities.getOriginalTxn().getPaymentDetails().isEmpty())
			{
				
				List<PaymentDetailsDao> paymentDetails = cashMemoEntities.getOriginalTxn().getPaymentDetails();
				for(PaymentDetailsDao paymentDetail : paymentDetails)
				{
					
					paymentDetail.setId(UUID.randomUUID().toString().toUpperCase());
					paymentDetail.setSalesTxnDao(salesTxn);
					paymentDetail.setCurrencyCode(salesTxn.getCurrencyCode());
					// if payment code comes as wallet , set payment group as wallet.
					//if paymnt code comes as bank loan , set if paymnt group comes as bankloan 
					//else paymnt code as regular
					if(paymentDetail.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.WALLET.toString()) )
					{
						paymentDetail.setPaymentGroup(PaymentGroupEnum.WALLET.toString());
					} else if(paymentDetail.getPaymentCode().equalsIgnoreCase(PaymentCodeEnum.BANK_LOAN.toString()) )
					{
						paymentDetail.setPaymentGroup(PaymentGroupEnum.BANK_LOAN.toString());
						
					}
					else
					{
						paymentDetail.setPaymentGroup(PaymentGroupEnum.REGULAR.toString());
						
					}
						
					paymentDetail.setStatus(PaymentStatusEnum.COMPLETED.toString());
					
					
					
				}
				paymentDetailsRepo.saveAll(paymentDetails);
			}

		} else {
			List<CashMemoDetailsDao> epossCashMemoDetails = cmdRepo.findByCashMemoDaoId(cashMemo.getId());
			salesTxn = salesTxnRepo.findById(cashMemo.getId()).get();
			log.info("epossCashMemoDetails DB:>>>>" + MapperUtil.getJsonString(epossCashMemoDetails));
			log.info("legacyCashMemoDetails DB:>>>>" + MapperUtil.getJsonString(legacyCashMemoDetails));
			List<CashMemoDetailsDao> saveCashMemoDetails = new ArrayList<>();
			for (CashMemoDetailsDao legacyCmDetails : legacyCashMemoDetails) {
				if (!epossCashMemoDetails.isEmpty()) {
					for (CashMemoDetailsDao epossCmDetails : epossCashMemoDetails) {
						if (epossCmDetails.getItemCode().equalsIgnoreCase(legacyCmDetails.getItemCode())) {
							String id = epossCmDetails.getId();
							epossCmDetails = (CashMemoDetailsDao) MapperUtil.getObjectMapping(legacyCmDetails,
									epossCmDetails, "id");
							epossCmDetails.setCashMemoDao(cashMemo);
							epossCmDetails.setId(id);
//						epossCmDetails.setNoOfItemsReturned(legacyCmDetails.getNoOfItemsReturned());
							log.info("epossCmDetails :>>>>" + MapperUtil.getJsonString(epossCmDetails));
							saveCashMemoDetails.add(epossCmDetails);
						}
					}
				} else {
					String cmDetailId = "";
					if(cmDetailsList!=null && !cmDetailsList.isEmpty()) {
						cmDetailId = cmDetailsList.stream().filter(cmDetails->cmDetails.getItemCode().equals(legacyCmDetails.getItemCode()))
						.map(cmDetail->cmDetail.getId()).findFirst().get();
					}else {
						cmDetailId = UUID.randomUUID().toString().toUpperCase();
					}
					
					legacyCmDetails.setId(cmDetailId);
					legacyCmDetails.setCashMemoDao(cashMemo);

					if (legacyCmDetails.getProductCategoryCode() == null
							|| legacyCmDetails.getProductGroupCode() == null
							|| legacyCmDetails.getInventoryStdValue() == null) {
						ItemDao itemDao = itemRepoExt.findOneByItemCode(legacyCmDetails.getItemCode());
						if (itemDao != null) {
							legacyCmDetails
									.setProductCategoryCode(itemDao.getProductCategory().getProductCategoryCode());
							legacyCmDetails.setProductGroupCode(itemDao.getProductGroup().getProductGroupCode());
							legacyCmDetails.setInventoryStdValue(
									itemDao.getStdValue().multiply(new BigDecimal(legacyCmDetails.getTotalQuantity())));
						} else {
							throw new ServiceException("No Item details found for the requested itemCode",
									"ERR-PRO-028", "itemCode : " + legacyCmDetails.getItemCode());
						}
						
					}
					
					log.info("legacyCmDetails :>>>>" + MapperUtil.getJsonString(legacyCmDetails));
					saveCashMemoDetails.add(legacyCmDetails);
				}
			}
			log.info("saveCashMemoDetails :>>>>" + MapperUtil.getJsonString(saveCashMemoDetails));
			salesTxn = salesTxnRepo.save(salesTxn);
			legacyCm = cashMemoRepo.save(cashMemo);
			CustomerTxnDao customerTxnDB = custTxnRepo.findOneBySalesTxnDaoId(salesTxn.getId());
			if(customerTxnDB == null) {
				customerTxn.setId(salesTxn.getId());
				customerTxn.setSalesTxnDao(salesTxn);
				customerTxn.setCustomerId(salesTxn.getCustomerId());
				customerTxn = custTxnRepo.save(customerTxn);
			}else {
				customerTxn = custTxnRepo.save(customerTxnDB);
			}
			legacyCashMemoDetails = cmdRepo.saveAll(saveCashMemoDetails);
		}
		log.info("cashmemo details :>>>>" + MapperUtil.getJsonString(legacyCashMemoDetails));
		cashMemoEntities.getOriginalTxn().setCashMemo(legacyCm);
		cashMemoEntities.getOriginalTxn().setCashMemoDetails(legacyCashMemoDetails);
		cashMemoEntities.getOriginalTxn().setCustomerTxn(customerTxn);
		cashMemoEntities.setCustomer(customer);
		cashMemoEntities.getOriginalTxn().getCashMemo().setCreatedBy(createdBy);
		cashMemoEntities.getOriginalTxn().getCashMemo().getSalesTxnDao().setCreatedBy(createdBy);

		SyncStagingDto customerSyncStagingDto = customerUpdateSyncStagging(customerLocation,
				SalesOperationCode.CUSTOMER_UPDATE);
		SyncStagingDto syncStagingDto = syncStagging(createdBy, salesTxn, legacyCashMemoDetails, legacyCm, customerTxn);
		List<SyncStagingDto> syncDtoList = new ArrayList<>();
		if (customerSyncStagingDto != null)
			syncDtoList.add(customerSyncStagingDto);
		syncDtoList.add(syncStagingDto);
		log.info("syncDtoList :>>>>" + MapperUtil.getJsonString(syncDtoList));
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			syncDtoList.forEach(syncDto -> salesSyncDataService.publishSalesMessagesToQueue(syncDto));
		}

		return cashMemoEntities;
	}

	public SyncStagingDto customerUpdateSyncStagging(CustomerLocationMappingDao clm, String operation) {
		if (!AppTypeEnum.POSS.name().equalsIgnoreCase(appName) || clm == null) {
			return null;
		}
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());

		syncDataList.add(DataSyncUtil.createSyncData(new CustomerLocationMappingSyncDto(clm), 2));

		MessageRequest customerMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		SyncStagingDto customerStagingDto = new SyncStagingDto();
		customerStagingDto.setMessageRequest(customerMsgRequest);
		String customerMsgRqst = MapperUtil.getJsonString(customerMsgRequest);
		SyncStaging customerSyncStaging = new SyncStaging();
		customerSyncStaging.setMessage(customerMsgRqst);
		customerSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		customerSyncStaging = saleSyncStagingRepository.save(customerSyncStaging);
		customerStagingDto.setId(customerSyncStaging.getId());
		return customerStagingDto;
	}

	public SyncStagingDto syncStagging(String createdBy, SalesTxnDao salesTxn, List<CashMemoDetailsDao> cashMemoDetailsDaoList,
			CashMemoDao cashMemoDao, CustomerTxnDao customer) {
		
		salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
		cashMemoDao.setSrcSyncId(cashMemoDao.getSrcSyncId() + 1);
		salesTxn = salesTxnRepo.save(salesTxn);
		cashMemoDao = cashMemoRepo.save(cashMemoDao);
		SyncStagingDto cashMemoStagingDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<SyncData> syncDataList = new ArrayList<>();
			List<String> destinations = new ArrayList<>();
			destinations.add(AppTypeEnum.EPOSS.name());
			syncDataList.add(DataSyncUtil.createSyncData(new SalesTxnSyncDtoExt(salesTxn,createdBy), 0));
			syncDataList.add(DataSyncUtil.createSyncData(new CashMemoSyncDtoExt(cashMemoDao,createdBy), 1));
			if (!cashMemoDetailsDaoList.isEmpty()) {
				List<CashMemoDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
				cashMemoDetailsDaoList.forEach(daoExt -> {
					daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
					dtoExtList.add(new CashMemoDetailsSyncDtoExt(daoExt));
				});
				cmdRepo.saveAll(cashMemoDetailsDaoList);
				syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 3));
			}
			if (customer != null) {
				customer.setSrcSyncId(customer.getSrcSyncId() + 1);
				customer = custTxnRepo.save(customer);
				syncDataList.add(DataSyncUtil.createSyncData(new CustomerTxnSyncDtoExt(customer), 4));
			}
			MessageRequest cashMemoMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
					SalesOperationCode.CASHMEMO_CONFIRM, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			cashMemoStagingDto = new SyncStagingDto();
			cashMemoStagingDto.setMessageRequest(cashMemoMsgRequest);
			String cashMemoMsgRqst = MapperUtil.getJsonString(cashMemoMsgRequest);
			SyncStaging cashMemoSyncStaging = new SyncStaging();
			cashMemoSyncStaging.setMessage(cashMemoMsgRqst);
			cashMemoSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			cashMemoSyncStaging = saleSyncStagingRepository.save(cashMemoSyncStaging);
			cashMemoStagingDto.setId(cashMemoSyncStaging.getId());
		}

		salesTxnRepo.flush();
		cashMemoRepo.flush();

		salesTxnRepo.updateSalesTxnCreatedBy(salesTxn.getId(), createdBy);
		cashMemoRepo.updateCashMemoCreatedBy(cashMemoDao.getId(), createdBy);
		return cashMemoStagingDto;
	}

	private void saveLotDetails(List<LotNumberDetailsDto> lotnumberDetailsList,
			List<MultiMetalDetailsDto> multiMetalDetailsList, List<ItemStoneMappingDto> itemStoneDetailsList,
			List<LotDetailsDao> templLotnumberDetailsList, List<LotMaterialDetailsDao> tempMaterialDaoList,
			List<ItemStoneMappingDao> tempItemStoneMappingList) {
		long start;
		long finish;
		long timeElapsed;
		if (lotnumberDetailsList != null && !lotnumberDetailsList.isEmpty()) {

			List<String> itemCodes = lotnumberDetailsList.stream().map(it -> it.getItemCode())
					.collect(Collectors.toList());
			List<String> lotNumbers = lotnumberDetailsList.stream().map(it -> it.getLotNumber())
					.collect(Collectors.toList());
			List<String> stoneCodes = lotnumberDetailsList.stream().map(it -> it.getStoneCode())
					.collect(Collectors.toList());

			start = System.currentTimeMillis();
			List<String> dbLotnumberDetailsList = lotDetailsRepo.fetchLotStoneDetails(itemCodes, lotNumbers,
					stoneCodes);
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to Fetch" + timeElapsed);
			log.info("dbLotnumberDetailsList" + dbLotnumberDetailsList);
			List<LotNumberDetailsDto> finallotnumberDetailsList = new ArrayList<>();

			start = System.currentTimeMillis();
			ItemDao itemDao = null;
			StoneDao stoneDao = null;
			for (LotNumberDetailsDto lotNumberDetailsDto : lotnumberDetailsList) {
				if (!dbLotnumberDetailsList.contains(lotNumberDetailsDto.getItemCode())) {
//					lotDetailsRepo.saveLotStoneDetails(lotNumberDetailsDto.getItemCode(),lotNumberDetailsDto.getLineItemNo(),
//							lotNumberDetailsDto.getLotNumber(),lotNumberDetailsDto.getNoOfStones(),lotNumberDetailsDto.getStoneCode(),
//							lotNumberDetailsDto.getStoneWeight(),"ct",CalendarUtils.getCurrentDate());
//					finallotnumberDetailsList.add(lotNumberDetailsDto);

					LotDetailsDao lotDetailsDao = new LotDetailsDao();
					LotDetailsIdDao lotDetailsIdDao = new LotDetailsIdDao();
					itemDao = itemRepoExt.findOneByItemCode(lotNumberDetailsDto.getItemCode());
					stoneDao = stoneRepoExt.findOneByStoneCode(lotNumberDetailsDto.getStoneCode());
					if (itemDao != null) {
						lotDetailsIdDao.setItem(itemDao);
					} else {
						throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
								"itemCode : " + lotNumberDetailsDto.getItemCode());
					}
					if (stoneDao != null) {
						lotDetailsDao.setStone(stoneDao);
					} else {
						throw new ServiceException("No Stone details found for the requested stoneCode", "ERR-PRO-008",
								"stoneCode : " + lotNumberDetailsDto.getStoneCode());
					}
					lotDetailsIdDao.setLotNumber(lotNumberDetailsDto.getLotNumber());
					lotDetailsIdDao.setLineItemNo(lotNumberDetailsDto.getLineItemNo());
					lotDetailsDao.setLotDetailsId(lotDetailsIdDao);
					lotDetailsDao.setNoOfStones(lotNumberDetailsDto.getNoOfStones());
					lotDetailsDao.setStoneWeight(lotNumberDetailsDto.getStoneWeight());
					lotDetailsDao.setWeightUnit("ct");
					lotDetailsDao.setSyncTime(CalendarUtils.getCurrentDate().getTime());
					templLotnumberDetailsList.add(lotDetailsDao);
				}
			}

			if (!templLotnumberDetailsList.isEmpty()) {
				templLotnumberDetailsList = lotDetailsRepo.saveAll(templLotnumberDetailsList);
			}
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to save" + timeElapsed);
		}

		if (multiMetalDetailsList != null && !multiMetalDetailsList.isEmpty()) {
			List<String> itemCodes = multiMetalDetailsList.stream().map(it -> it.getItemCode())
					.collect(Collectors.toList());
			List<String> lotNumbers = multiMetalDetailsList.stream().map(it -> it.getLotNumber())
					.collect(Collectors.toList());
			List<String> materialCodes = multiMetalDetailsList.stream().map(it -> it.getMultiMetalCode())
					.collect(Collectors.toList());
			start = System.currentTimeMillis();
			List<String> dbLotnumberDetailsList = lotMaterialRepo.fetchLotMaterialDetails(itemCodes, lotNumbers,
					materialCodes);

			log.info("dbLotnumberDetailsList" + dbLotnumberDetailsList);
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to fetch multi meterial details" + timeElapsed);
			start = System.currentTimeMillis();
			for (MultiMetalDetailsDto multiMetalDetails : multiMetalDetailsList) {
				if (!dbLotnumberDetailsList.contains(multiMetalDetails.getItemCode())) {
//					lotMaterialRepo.saveMaterialsDetails(multiMetalDetails.getItemCode(),
//							multiMetalDetails.getLineItemNo(), multiMetalDetails.getLotNumber(),
//							multiMetalDetails.getMaterialWeight(), multiMetalDetails.getMultiMetalCode(),
//							multiMetalDetails.getNoOfMaterials(), CalendarUtils.getCurrentDate());
					LotMaterialDetailsDao lotMaterialDetailsDao = new LotMaterialDetailsDao();
					LotMaterialDetailsIdDao lotMaterialDetailsIdDao = new LotMaterialDetailsIdDao();
					ItemDao itemDao = itemRepoExt.findOneByItemCode(multiMetalDetails.getItemCode());
					MaterialDao materialDaoDetails = materialRepoExt
							.findOneByMaterialCode(multiMetalDetails.getMultiMetalCode());
					if (itemDao != null) {
						lotMaterialDetailsIdDao.setItem(itemDao);
					} else {
						throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
								"itemCode : " + multiMetalDetails.getItemCode());
					}
					if (materialDaoDetails != null) {
						lotMaterialDetailsDao.setMaterial(materialDaoDetails);
					} else {
						throw new ServiceException(
								"No Material type details found for the requested material Type Code", "ERR-PRO-006",
								"materialCode : " + multiMetalDetails.getMultiMetalCode());
					}

					lotMaterialDetailsIdDao.setLotNumber(multiMetalDetails.getLotNumber());
					lotMaterialDetailsIdDao.setLineItemNo(multiMetalDetails.getLineItemNo());
					lotMaterialDetailsDao.setLotDetailsId(lotMaterialDetailsIdDao);
					if(multiMetalDetails.getMaterialWeight()!=null) {
						lotMaterialDetailsDao.setMaterialWeight(multiMetalDetails.getMaterialWeight());
					}else {
						lotMaterialDetailsDao.setMaterialWeight(BigDecimal.ZERO);
					}
					lotMaterialDetailsDao.setNoOfMaterials(multiMetalDetails.getNoOfMaterials());
					lotMaterialDetailsDao.setWeightUnit("gms");
					lotMaterialDetailsDao.setSyncTime(CalendarUtils.getCurrentDate().getTime());
					tempMaterialDaoList.add(lotMaterialDetailsDao);
				}
			}
			if (!tempMaterialDaoList.isEmpty())
				lotMaterialRepo.saveAll(tempMaterialDaoList);
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to save multi meterial details" + timeElapsed);
		}

		if (itemStoneDetailsList != null && !itemStoneDetailsList.isEmpty()) {
			List<String> itemCodes = itemStoneDetailsList.stream().map(it -> it.getItemCode())
					.collect(Collectors.toList());
			List<String> stoneCodes = itemStoneDetailsList.stream().map(it -> it.getStoneCode())
					.collect(Collectors.toList());
			start = System.currentTimeMillis();
			List<String> dbItemStoneDetailsList = itemStoneRepo.fetchItemStoneMapping(itemCodes, stoneCodes);
			log.info("dbItemStoneDetailsList" + dbItemStoneDetailsList);
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to fetch itemStone details" + timeElapsed);
			start = System.currentTimeMillis();
			for (ItemStoneMappingDto itemStoneMappingDto : itemStoneDetailsList) {
				if (!dbItemStoneDetailsList.contains(itemStoneMappingDto.getItemCode())) {
//					itemStoneRepo.saveItemStoneDetails(UUID.randomUUID().toString(), itemStoneMappingDto.getItemCode(),
//							itemStoneMappingDto.getNoOfStones(), itemStoneMappingDto.getStoneCode(),
//							itemStoneMappingDto.getIsActive(), itemStoneMappingDto.getCreatedDate());
					ItemStoneMappingDao itemStoneMappingDaoExt = new ItemStoneMappingDao();
					ItemDao itemDao = itemRepoExt.findOneByItemCode(itemStoneMappingDto.getItemCode());
					StoneDao stoneDao = stoneRepoExt.findOneByStoneCode(itemStoneMappingDto.getStoneCode());
					if (itemDao != null) {
						itemStoneMappingDaoExt.setItem(itemDao);
					} else {
						throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
								"itemCode : " + itemStoneMappingDto.getItemCode());
					}
					if (stoneDao != null) {
						itemStoneMappingDaoExt.setStone(stoneDao);
					} else {
						throw new ServiceException("No Stone details found for the requested stoneCode", "ERR-PRO-008",
								"stoneCode : " + itemStoneMappingDto.getStoneCode());
					}
					itemStoneMappingDaoExt.setId(UUID.randomUUID().toString());
					itemStoneMappingDaoExt.setNoOfStones(itemStoneMappingDto.getNoOfStones());
					itemStoneMappingDaoExt.setIsActive(itemStoneMappingDto.getIsActive());
					itemStoneMappingDaoExt.setSyncTime(CalendarUtils.getCurrentDate().getTime());
					tempItemStoneMappingList.add(itemStoneMappingDaoExt);
				}
			}
			if (!tempItemStoneMappingList.isEmpty())
				itemStoneRepo.saveAll(tempItemStoneMappingList);
			finish = System.currentTimeMillis();
			timeElapsed = finish - start;
			log.info("Total Time Taken to fetch itemStone details" + timeElapsed);
		}
	}

	private CustomerLocationMappingDao getLocationMapping(CustomerDao customer, String locationCode) {
		CustomerLocationMappingDao clm = customerLocationMappingRepo
				.findOneByCustomerAndCustomerLocationMappingIdLocationCode(customer, locationCode);

		if (clm == null) {

			// create new customer customer location mapping
			CustomerLocationMappingIdDao customerLocationMappingId = new CustomerLocationMappingIdDao();
			customerLocationMappingId.setLocationCode(locationCode);
			customerLocationMappingId
					.setCustomerId(customerLocationMappingRepo.getNewCustomerIdForLocationMapping(locationCode));

			CustomerLocationMappingDao customerLocationMapping = new CustomerLocationMappingDao();
			customerLocationMapping.setCustomerLocationMappingId(customerLocationMappingId);
			customerLocationMapping.setCustomer(customer);
			if (customerLocationMapping.getSrcSyncId() != null) {
				customerLocationMapping.setSrcSyncId(customerLocationMapping.getSrcSyncId() + 1);
			}
			clm = customerLocationMappingRepo.save(customerLocationMapping);
		} else {
			clm.setSrcSyncId(clm.getSrcSyncId() + 1);
			clm = customerLocationMappingRepo.save(clm);
		}
		return clm;
	}

	private CashMemoEntity getRelatedFocCM(String locationCode, List<String> txnStatus, CashMemoDao cashMemo) {
		txnStatus = List.of(TransactionStatusEnum.CONFIRMED.name());
		CashMemoDao focCM = getCashMemo(locationCode, null, null, txnStatus, TransactionTypeEnum.CM.name(),
				SubTxnTypeEnum.FOC_CM.name(), cashMemo.getId(), null);

		CashMemoEntity foc = null;

		if (focCM != null) {
			String focSalesId = focCM.getId();
			foc = mapDaoToDto(focCM, null, null, null, getFocSchemesBySalesTxnId(focSalesId),
					getFocDetailsBySalesTxnId(focSalesId));
		}
		return foc;
	}

	private List<CashMemoDetailsDao> getCashMemoDetailsByCMId(String cmId) {
		return cmdRepo.findByCashMemoDaoId(cmId);
	}

	private List<FocSchemesDao> getFocSchemesBySalesTxnId(String salesTxnId) {
		return focSchemeRepo.getBySalesTxnIdAndStatus(salesTxnId, null);
	}

	private List<FocDetailsDao> getFocDetailsBySalesTxnId(String salesTxnId) {
		return focDetailsRepo.getBySalesTxnIdAndStatus(salesTxnId, null);
	}

	private CashMemoDao getCashMemoWErrorCheck(String locationCode, Integer refDocNo, Short refFiscalYear,
			List<String> txnStatus, String txnType, String subTxnType, String refTxnId, Boolean isMigratedIgnored) {
		return getCashMemo(locationCode, refDocNo, refFiscalYear, txnStatus, txnType, subTxnType, refTxnId,
				isMigratedIgnored);
	}

	private CashMemoDao getCashMemo(String locationCode, Integer refDocNo, Short refFiscalYear, List<String> txnStatus,
			String txnType, String subTxnType, String refTxnId, Boolean isMigratedIgnored) {
		Boolean isMigrated = null;
		if (BooleanUtils.isNotTrue(isMigratedIgnored)) {
			isMigrated = false;
		}
		return cashMemoRepo
				.getByLocationCodeAndStatusAndDocNoAndFiscalYearAndTxnTypeAndSubTxnTypeAndRefTxnIdAndIsMigrated(
						locationCode, txnStatus, refDocNo, refFiscalYear, txnType, subTxnType, refTxnId, isMigrated);

	}
	
	private List<CashMemoDetailsResponseDto> getCashMemo(String locationCode, String itemCode, String customerMobileNo, String customerId,Boolean isMigratedIgnored) {
		Boolean isMigrated = null;
		if(BooleanUtils.isNotTrue(isMigratedIgnored)) {
			isMigrated = false;
		}
List<Object[]> arry = cashMemoRepo
.getByLocationCodeAndItemCodeAndCustomerMobileNoOrCustomerIdAndIsMigrated(
		locationCode, itemCode, customerMobileNo, customerId, isMigrated);
		return mapCashMemoDetailsResponseDto(arry);

	}
	private List<CashMemoDetailsResponseDto> mapCashMemoDetailsResponseDto(List<Object[]> cashMemoDetailsArray){
		List<CashMemoDetailsResponseDto> cashMemoDetailsResponseDtos = new ArrayList<>();
		if(cashMemoDetailsArray != null && cashMemoDetailsArray.size() >0 ) {
			cashMemoDetailsResponseDtos.addAll(cashMemoDetailsArray.stream().map( cashMemoDetails -> {
				CashMemoDetailsResponseDto  cashMemoDetailsResponseDto = new CashMemoDetailsResponseDto();
				cashMemoDetailsResponseDto.setId(String.valueOf(cashMemoDetails[0]));
				cashMemoDetailsResponseDto.setLocationCode(String.valueOf(cashMemoDetails[1]));
				cashMemoDetailsResponseDto.setFiscalYear((short)cashMemoDetails[2]);
				cashMemoDetailsResponseDto.setDocNo((Integer)cashMemoDetails[3]);
				cashMemoDetailsResponseDto.setIsMigrated((Boolean)(cashMemoDetails[4]));
				
				short totalTepQuantity = (short) goodsExchangeDetailsRepository.getSumOfTotalQuantityByCashMemoDetails(
						String.valueOf(cashMemoDetails[0]));
				short totalGrnQuantity = (short) grnDetailsRepositoryExt.getSumOfTotalQuantityByCashMemoDetails(
						String.valueOf(cashMemoDetails[0]));
				log.debug("totalQuantity available in TEP : {}", totalTepQuantity);
				log.debug("totalQuantity available in GRN : {}", totalGrnQuantity);
				short totalPendingQuantity = (short) ((short)cashMemoDetails[5]
						- (totalTepQuantity + totalGrnQuantity));
				log.debug("totalPendingQuantity available in TEP : {}", totalPendingQuantity);
				cashMemoDetailsResponseDto.setTotalQuantity(totalPendingQuantity);
				return cashMemoDetailsResponseDto;
			}).collect(Collectors.toList()));
		}
		return cashMemoDetailsResponseDtos;
	}
	

	private List<PaymentDetailsDao> getPaymentDetailsById(String refId, Boolean isMigrated) {
		return getPaymentDetailsById(refId, null, isMigrated);
	}

	private List<PaymentDetailsDao> getPaymentDetailsById(String refId, String paymentStatus, Boolean isMigrated) {
		List<PaymentDetailsDao> paymentDetails = paymentDetailsRepo.getBySalesTxnDaoIdAndStatus(refId, paymentStatus);
		/*
		 * if (paymentDetails.isEmpty() && !isMigrated) throw new
		 * ServiceException(NO_PAYMENT_FOUND_IN_THE_TRANSACTION, ERR_SALE_076);
		 */
		return paymentDetails;
	}

	@Override
	public CustomerTxnDao getCustomerTxnDetailsById(String refId) {
		CustomerTxnDao customerTxn = custTxnRepo.findOneBySalesTxnDaoId(refId);
		if (customerTxn == null)
			throw new ServiceException(NO_CUST_DETAILS_IN_THE_TRANSACTION, ERR_SALE_075);
		return customerTxn;
	}

	private CashMemoEntity mapDaoToDto(CashMemoDao cashMemo, List<CashMemoDetailsDao> cashMemoDetails,
			CustomerTxnDao customerTxn, List<PaymentDetailsDao> paymentDetails, List<FocSchemesDao> focSchemes,
			List<FocDetailsDao> focDetails) {
		Map<String,BigDecimal> paymentDetailsMap = new HashMap<>();
		CashMemoEntity cmRelatedEntity = new CashMemoEntity();

		cmRelatedEntity.setCashMemo(cashMemo);
		cmRelatedEntity.setCashMemoDetails(cashMemoDetails);
		cmRelatedEntity.setCustomerTxn(customerTxn);
		cmRelatedEntity.setPaymentDetails(paymentDetails);

		cmRelatedEntity.setFocSchemes(focSchemes);

		if (!CollectionUtil.isEmpty(focDetails)) {

			// @formatter:off
			List<FocDetailsDtoEntity> focDetailsEnt = focDetails.stream().map(focDtl -> {
				FocDetailsDtoEntity focEnt = (FocDetailsDtoEntity) MapperUtil.getDtoMapping(focDtl,
						FocDetailsDtoEntity.class);
				focEnt.setFocSchemeId(focDtl.getFocScheme().getId());
				return focEnt;
			}).collect(Collectors.toList());
			// @formatter:on

			cmRelatedEntity.setFocDetails(focDetailsEnt);
		}
		for(PaymentDetailsDao payments: paymentDetails) {
			if(payments.getPaymentCode().equals(PaymentCodeEnum.ENCIRCLE.getPaymentcode()) && payments.getStatus().equalsIgnoreCase(PaymentStatusEnum.COMPLETED.name())) {			
				paymentDetailsMap.put(payments.getSalesTxnDao().getId(),payments.getAmount());	
				
			}
		}
		cmRelatedEntity.setPaymentDetailsMap(paymentDetailsMap);	
		return cmRelatedEntity;
	}

	@Override
	public CustomerCouponDto getCustomerCoupon(String id, String couponCode, String status, String transactionId) {
		if (transactionId != null) {
			List<CustomerCouponDaoExt> customerCoupons = customerCouponRepository.findAllByRefId(transactionId);
			if (!CollectionUtil.isEmpty(customerCoupons)) {
				customerCoupons.forEach(customerCoupon -> {
					customerCoupon.setStatus(RivaahCardStatusEnum.CANCELLED.name());
					customerCoupon.setIsActive(Boolean.FALSE);
				});
				customerCouponRepository.saveAll(customerCoupons);
				return new CustomerCouponDto();
			}
		}
		String couponType = SalesCouponEnum.RIVAAH_CARD.name();
		List<CustomerCouponDaoExt> customerCouponDaos = null;
		CustomerCouponDto couponDto = null;
		if (StringUtils.isEmpty(id)) {
			CustomerCouponDto couponToReturn = new CustomerCouponDto();
			customerCouponDaos = customerCouponRepository.findAllByCouponTypeAndCouponCodeAndStatus(couponType,
					couponCode, RivaahCardStatusEnum.OPEN.name());
			if (!CollectionUtil.isEmpty(customerCouponDaos))
				couponToReturn.setStatus(RivaahCardStatusEnum.OPEN.name());
			else
				couponToReturn.setStatus(RivaahCardStatusEnum.EXPIRED.name());
			return couponToReturn;
		}
		if (couponCode != null) {
			customerCouponDaos = customerCouponRepository.findAllByCouponTypeAndCouponCodeAndIsActive(couponType,
					couponCode, Boolean.TRUE);
			validateDetailsIfCouponExists(couponType, couponCode, id, customerCouponDaos);
		} else {
			customerCouponDaos = customerCouponRepository.findAllByCouponTypeAndCustomerIdAndIsActive(couponType, id,
					Boolean.TRUE);
			if (!CollectionUtil.isEmpty(customerCouponDaos) && customerService.getCustomer(id).getCustomerType()
					.equalsIgnoreCase(CustomerTypeEnum.REGULAR.name())) {
				validateDetailsWithoutCoupon(customerCouponDaos, status);
			} else {
				return couponDto;
			}
		}
		couponDto = (CustomerCouponDto) MapperUtil.getObjectMapping(customerCouponDaos.get(0), new CustomerCouponDto());
		couponDto.setCustomerMasterId(customerCouponDaos.get(0).getCustomer().getId());
		return couponDto;
	}

	private void validateDetailsWithoutCoupon(List<CustomerCouponDaoExt> customerCouponDaos, String status) {
		if (customerCouponDaos.size() != 1)
			throw new ServiceException("Multiple active RIVAAH CARDS exist for the customer", "ERR-SALE-353");
		if (!StringUtils.isEmpty(status)) {
			CustomerCouponDaoExt customerCouponToSave = customerCouponDaos.get(0);
			if (status.equalsIgnoreCase(RivaahCardStatusEnum.OPEN.name())) {
				customerCouponToSave.setAttempts(customerCouponToSave.getAttempts() + 1);
			} else if (status.equalsIgnoreCase(RivaahCardStatusEnum.LIMIT_EXCEEDED.name())) {
				customerCouponToSave.setStatus(status);
				customerCouponToSave.setAttempts(customerCouponToSave.getAttempts() + 1);
			} else if (status.equalsIgnoreCase(RivaahCardStatusEnum.EXPIRED.name())) {
				customerCouponToSave.setStatus(status);
				customerCouponToSave.setIsActive(Boolean.FALSE);
			} else if (status.equalsIgnoreCase(TransactionTypeEnum.CM.name())) {
				customerCouponToSave.setIsActive(Boolean.FALSE);
			} else {
				if (customerCouponToSave.getStatus().equalsIgnoreCase(RivaahCardStatusEnum.LIMIT_EXCEEDED.name()))
					customerCouponToSave.setStatus(RivaahCardStatusEnum.OPEN.name());
				customerCouponToSave.setAttempts(customerCouponToSave.getAttempts() - 1);
			}
			customerCouponRepository.save(customerCouponToSave);
		}
	}

	private void validateDetailsIfCouponExists(String couponType, String couponCode, String customerId,
			List<CustomerCouponDaoExt> customerCouponDaos) {
		List<CustomerCouponDaoExt> customerCouponsExpired = customerCouponRepository
				.findAllByCouponTypeAndCouponCodeAndCustomerIdAndStatusIn(couponType, couponCode, customerId,
						Arrays.asList(RivaahCardStatusEnum.EXPIRED.name()));
		List<CustomerCouponDaoExt> customerCouponsCancelled = customerCouponRepository
				.findAllByCouponTypeAndCouponCodeAndCustomerIdAndStatusIn(couponType, couponCode, customerId,
						Arrays.asList(RivaahCardStatusEnum.CANCELLED.name()));
		if (!CollectionUtil.isEmpty(customerCouponsExpired))
			throw new ServiceException("Invalid coupon code", "ERR-SALE-351");
		if (!CollectionUtil.isEmpty(customerCouponsCancelled))
			throw new ServiceException(
					"Customer is not eligible to redeem the Rivaah coupon since the eligible cash memo was cancelled",
					"ERR-SALE-410");
		List<CustomerCouponDaoExt> customerCouponsLimit = customerCouponRepository
				.findAllByCouponTypeAndCouponCodeAndCustomerIdAndStatusIn(couponType, couponCode, customerId,
						Arrays.asList(RivaahCardStatusEnum.LIMIT_EXCEEDED.name()));
		if (!CollectionUtil.isEmpty(customerCouponsLimit))
			throw new ServiceException("The Redemption limit of this card has been completed", "ERR-SALE-393");
		List<CustomerCouponDaoExt> customerCouponsValid = new ArrayList<>();
		if (!CollectionUtil.isEmpty(customerCouponDaos)) {
			customerCouponDaos.forEach(customerCoupon -> {
				if (customerCoupon.getCustomer().getId().equalsIgnoreCase(customerId))
					customerCouponsValid.add(customerCoupon);
			});
			if (!CollectionUtil.isEmpty(customerCouponsValid)) {
				if (customerCouponsValid.size() != 1)
					throw new ServiceException("Multiple active RIVAAH CARDS exist for the customer", "ERR-SALE-353");
			} else {
				throw new ServiceException("Different customer", "ERR-SALE-350");
			}
		} else {
			throw new ServiceException("Coupon doesn't exist", "ERR-SALE-349");
		}
	}

	@Override
	public EmployeePaymentDtoExt getEmployeeLoanConfigDetails(String employeeCode, String customerId) {
		String locationCode = CommonUtil.getLocationCode();
		Date buissnessDate = CalendarUtils.getStartOfDay(businessDayService.getBusinessDay().getBusinessDate());
		Map<String, String> requestParams = new HashMap<>();
		requestParams.put("employeeCode", employeeCode);
		requestParams.put("buissnessDate", CalendarUtils.formatDateToSql(buissnessDate));
		requestParams.put("locationCode", locationCode);
		EmployeePaymentDtoExt employeePaymentDtoExt = epossCallService.callEposs(HttpMethod.POST,
				"api/payment/v2/employee-loan/fetch-config-details", requestParams, null, EmployeePaymentDtoExt.class);
		CustomerLocationMappingDao customerDetails = customerLocationMappingRepo
				.findByCustomerIdAndLocationCode(Integer.parseInt(customerId), locationCode);

		if (customerDetails != null) {
			if (employeePaymentDtoExt != null) {
				EmployeeLoanCustomerDetailsDto emDetailsDto = new Gson()
						.fromJson(employeePaymentDtoExt.getEmployeeDetails(), EmployeeLoanCustomerDetailsDto.class);
				String mobileNo = CryptoUtil.decrypt(customerDetails.getCustomer().getMobileNumber(), "MOBILENUMBER");
				String customerName = CryptoUtil.decrypt(customerDetails.getCustomer().getCustomerName(),
						"CUSTOMERNAME");
				if (!mobileNo.equalsIgnoreCase(emDetailsDto.getMobileNumber())) {
					throw new ServiceException(
							"Employee loan mobile number does not match with the selected customer mobile number",
							"ERR-SALE-389");
				}
				if (!customerName.equalsIgnoreCase(emDetailsDto.getEmployeeName())) {
					throw new ServiceException("Selected customer name does not match with the employee loan details",
							"ERR-SALE-416");
				}

				employeePaymentDtoExt.setCustomerId(customerDetails.getCustomer().getId());
			}

		} else {
			throw new ServiceException("Customer record not found.", "ERR-SALE-129");
		}

		return employeePaymentDtoExt;
	}

	private void mapDiscountsToCm(String refId, CashMemoEntity original) {
		// pick necessary discounts
		// remove CATEGORY_DISCOUNT discount type later. Added for testing only
		List<DiscountDetailsDao> discountDetails = discountDetailsRepository.findAllBySalesTxnIdAndDiscountTypeIn(refId,
				Set.of(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name(),
						DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name(), DiscountTypeEnum.BEST_DEAL_DISCOUNT.name(),
						DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name(), DiscountTypeEnum.CATEGORY_DISCOUNT.name(),
						DiscountTypeEnum.COIN_OFFER_DISCOUNT.name(), DiscountTypeEnum.DIGI_GOLD_DISCOUNT.name(),
						DiscountTypeEnum.EMPLOYEE_DISCOUNT.name(), DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name(),
						DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name(), DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT.name(),
						DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name(),
						DiscountTypeEnum.RIVAAH_CARD_DISCOUNT.name(), DiscountTypeEnum.SLAB_BASED_DISCOUNT.name(),
						DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name(), DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name(),
						DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.name(), DiscountTypeEnum.TSSS_DISCOUNT.name(),
						DiscountTypeEnum.ULP_DISCOUNT_ANNIVERSARY.name(), DiscountTypeEnum.ULP_DISCOUNT_BIRTHDAY.name(),
						DiscountTypeEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY.name()));
		if (CollectionUtil.isEmpty(discountDetails)) {
			return;
		}
		// added extra query as StackOverFlow error comes if tried to map
		List<Object[]> dicountAndConfigMap = discountDetailsRepository.findDiscountIdAndDiscountConfigId(
				discountDetails.stream().map(DiscountDetailsDao::getId).collect(Collectors.toList()));
		List<DiscountItemDetailsDao> discountItemDetails = discountItemDetailsRepository.findAllByDiscountDetailIdIn(
				discountDetails.stream().map(DiscountDetailsDao::getId).collect(Collectors.toList()));
		List<Object[]> dicountItemAndDetails = discountItemDetailsRepository.findDiscountItemIdAndDiscountDetailId(
				discountItemDetails.stream().map(DiscountItemDetailsDao::getId).collect(Collectors.toList()));
		original.setDiscountItemDetails(discountItemDetails);
		original.setDiscountDetails(discountDetails);
		original.setDiscountConfigDetails(
				discountDetails.stream().map(DiscountDetailsDao::getDiscountConfig).collect(Collectors.toList()));
		Map<String, String> discountDetailAndConfigMap = new HashMap<>();
		Map<String,String>  discountDetailsAndTypeMap = new HashMap<>();
		for (Object[] dDetail : dicountAndConfigMap) {
			discountDetailAndConfigMap.put((String) dDetail[0], (String) dDetail[1]);
		}
		original.setDiscountDetailAndConfigMap(discountDetailAndConfigMap);
		Map<String, String> discountItemAndDetailMap = new HashMap<>();
		for (Object[] itemDiscount : dicountItemAndDetails) {
			discountItemAndDetailMap.put((String) itemDiscount[0], (String) itemDiscount[1]);
		}
		original.setDiscountItemAndDetailsMap(discountItemAndDetailMap);
		for(DiscountDetailsDao discount : discountDetails) {
			discountDetailsAndTypeMap.put(discount.getId(),discount.getDiscountType());
		}
		original.setDiscountDetailsAndTypeMap(discountDetailsAndTypeMap);
		}

	@Override
	public ListResponse<RivaahGhsDiscountDto> getReturnedRivaahGhsDetails(String transactionId) {

		verifyIfCmExist(transactionId);

		List<CancelDaoExt> cancelDaoWithRivaahGhsDiscountReturned = cancelRepo.findByRefSalesTxnIdAndStatusAndTxnType(
				transactionId, TxnStatusCancelEnum.CONFIRMED.name(), TxnTypeCancelEnum.GRN.name());
		if (CollectionUtil.isEmpty(cancelDaoWithRivaahGhsDiscountReturned)) {
			return new ListResponse<>(List.of());
		}

		cancelDaoWithRivaahGhsDiscountReturned = cancelDaoWithRivaahGhsDiscountReturned.stream()
				.filter(cancel -> !StringUtil.isBlankJsonStr(cancel.getCancellationDetails()))
				.collect(Collectors.toList());
		// if no Rivaah details found
		if (CollectionUtil.isEmpty(cancelDaoWithRivaahGhsDiscountReturned)) {
			return new ListResponse<>(List.of());
		}

		List<RivaahGhsDiscountDto> rivaahdiscountReturned = new ArrayList<>();
		for (CancelDaoExt cancel : cancelDaoWithRivaahGhsDiscountReturned) {
			RivaahGhsDiscountDto rd = MapperUtil.mapObjToClass(cancel.getCancellationDetails(),
					RivaahGhsDiscountDto.class);
			if (rd != null)
				rivaahdiscountReturned.add(rd);
		}

		return new ListResponse<>(rivaahdiscountReturned);
	}
	
	@Override
	public List<CashMemoDetailsResponseDto> checkCmAvailable(String txnType, String locationCode,String itemCode, String customerMobileNo, String customerId, Boolean isMigratedIgnored) {
		

		List<CashMemoDetailsResponseDto> cashMemoDetails = getCashMemo(locationCode, itemCode, customerMobileNo, customerId, isMigratedIgnored);
		if (cashMemoDetails == null) {
			return new ArrayList<CashMemoDetailsResponseDto>();
		}

		
		/*cashMemoDetails.stream().findFirst().get().;
		String refId = cashMemo.getId();

		List<ReturnableItemsDto> returnedItems = null;
		// removed FK values using @JsonIgnore
		CashMemoEntity original = mapDaoToDto(cashMemo, getCashMemoDetailsByCMId(refId),
				getCustomerTxnDetailsById(refId), getPaymentDetailsById(refId, cashMemo.getIsMigrated()),
				getFocSchemesBySalesTxnId(refId), getFocDetailsBySalesTxnId(refId));
		mapDiscountsToCm(refId, original);

		CashMemoEntity foc = getRelatedFocCM(locationCode, txnStatus, cashMemo);

		if ((txnType != null && txnType.equals(TxnTypeCancelEnum.GRN.name()))) {
			List<ReturnableItemsDto> items = goodsReturnService.listReturnableItems(refId);
			returnedItems = items;

		} 

		CustomerEpossSearchDto customer = customerEpossService
				.getCustomerByIdAndLocationCode(original.getCashMemo().getSalesTxnDao().getCustomerId(), locationCode);

//		return new CashMemoEntities(original, foc, customer, focEligibleItemIds, returnedItemIds);*/
		return cashMemoDetails;
		}
	
	@Override
	public short getTotalReturnedItems(String id) {
		short noOfItemReturned = 0;
		CashMemoDetailsDao cmDetailsDao = cmdRepo.findOneById(id);
		if (cmDetailsDao != null) {
			short totalQty = cmDetailsDao.getTotalQuantity();
			short totalTepQuantity = (short) goodsExchangeDetailsRepository.getSumOfTotalQuantityByCashMemoDetails(id);
			short totalGrnQuantity = (short) grnDetailsRepositoryExt.getSumOfTotalQuantityByCashMemoDetails(id);
			short totalLegacyReturnQty = (cmDetailsDao.getNoOfItemsReturned() == null) ? 0
					: cmDetailsDao.getNoOfItemsReturned();
			
			if (totalQty == totalLegacyReturnQty || totalQty == totalTepQuantity || totalQty == totalGrnQuantity) {
				noOfItemReturned = totalQty;
			} else {
				noOfItemReturned = (short) (totalTepQuantity + totalGrnQuantity + totalLegacyReturnQty);
			}
			
			log.debug("totalQuantity : {}", totalQty);
			log.debug("totalQuantity available in Legacy : {}", totalLegacyReturnQty);
			log.debug("totalQuantity available in TEP : {}", totalTepQuantity);
			log.debug("totalQuantity available in GRN : {}", totalGrnQuantity);
			log.debug("totalPendingQuantity available in TEP : {}", noOfItemReturned);
		}
		return noOfItemReturned;
	}

}
