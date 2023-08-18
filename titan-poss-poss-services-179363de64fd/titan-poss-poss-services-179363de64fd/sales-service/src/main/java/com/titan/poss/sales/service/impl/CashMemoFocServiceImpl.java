/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.dto.UpdateInventoryDto;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;
import com.titan.poss.sales.dao.FocDetailsDaoExt;
import com.titan.poss.sales.dao.FocSchemesDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CMFocSchemeSearchReqDto;
import com.titan.poss.sales.dto.CashMemoDetailsSyncDtoExt;
import com.titan.poss.sales.dto.CashMemoSyncDtoExt;
import com.titan.poss.sales.dto.CustomerTxnSyncDtoExt;
import com.titan.poss.sales.dto.FocDetailsSyncDtoExt;
import com.titan.poss.sales.dto.FocItemDetailsDto;
import com.titan.poss.sales.dto.FocResponseAndPublishDto;
import com.titan.poss.sales.dto.FocSchemeSyncDtoExt;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.dto.constants.FocStatusEnum;
import com.titan.poss.sales.dto.request.IssueFocDetailsRequestDto;
import com.titan.poss.sales.dto.request.IssueFocRequestDto;
import com.titan.poss.sales.dto.response.FocIssueResponseDto;
import com.titan.poss.sales.dto.response.FocItemResponseDto;
import com.titan.poss.sales.dto.response.FocPendingCMResponseDto;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.CustomerTxnRepositoryExt;
import com.titan.poss.sales.repository.FocDetailsRepositoryExt;
import com.titan.poss.sales.repository.FocSchemesRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CashMemoFocService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.SalesSyncDataService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * Service implementation class for operations on FOC pending Cash memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesCashMemoFocServiceImpl")
public class CashMemoFocServiceImpl implements CashMemoFocService {

	@Autowired
	private FocSchemesRepositoryExt focSchemesRepository;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private FocDetailsRepositoryExt focDetailsRepository;

	@Autowired
	private CustomerTxnRepositoryExt cusTxnDetailsRepository;

	@Autowired
	private CashMemoFocServiceImpl cashMemoFocServiceIml;

	@Autowired
	private SalesSyncDataService salesSyncDataService;
	
	@Autowired
	private EngineService engineService;

	@Autowired
	private InventoryService inventoryService;

	@Autowired
	private CashMemoFocItemServiceImpl cashMemoFocItemServiceImpl;

    private static final String CUST_TAX_NO = "custTaxNo";
    private static final String MOBILE_NO = "mobileNo";
    private static final String EMAIL_ID =  "emailId";
    private static final String CUSTOMER_NAME ="customerName";
    private static final String INSTI_TAX_NO = "instiTaxNo";
    private static final String PASSPORT_ID = "passportId";
    private static final String CUST_TAX_NO_OLD = "custTaxNoOld";
	@Override
	public PagedRestResponse<List<FocPendingCMResponseDto>> listFocPendingCMs(String txnType, String subTxnType,
			Integer docNo, Integer fiscalYear, Integer customerId, String transactionId, String status,
			Pageable pageable) {

		CMFocSchemeSearchReqDto cmFocSchemeFilterDto = new CMFocSchemeSearchReqDto();

		if (!StringUtils.isEmpty(status)) {
			cmFocSchemeFilterDto.setCmStatus(status);
		} else {
			cmFocSchemeFilterDto.setCmStatus(TransactionStatusEnum.CONFIRMED.toString());
		}
		cmFocSchemeFilterDto.setFocStatus(FocStatusEnum.PENDING.toString());
		cmFocSchemeFilterDto.setLocationCode(CommonUtil.getLocationCode());
		cmFocSchemeFilterDto.setTransactionId(transactionId);

		Page<FocPendingCMResponseDto> focPendingCMListPageResponse = focSchemesRepository.listFocPendingCMs(txnType,
				subTxnType, docNo, (fiscalYear == null ? null : fiscalYear.shortValue()), customerId,
				cmFocSchemeFilterDto, pageable);

		return new PagedRestResponse<>(focPendingCMListPageResponse.getContent(), focPendingCMListPageResponse);

	}

	@Override
	public FocIssueResponseDto issueFocItems(String txnType, String subTxnType, String refTxnId,
			IssueFocRequestDto issueFocRequestDto) {

		log.info("Issue Pending FOC>>> ref txn Id:  {} and IssueFocRequestDetails: {}", refTxnId, issueFocRequestDto);

		commonTransactionService.txnTypeAndSubTxnTypeValidation(txnType, subTxnType);

		// Sub txn type should be made optional in this check
		CashMemoDaoExt parentCashMemoDao = cashMemoRepository.findOneByIdAndTxnType(refTxnId, txnType);

		// Parent cash Memo should be in CONFIRMED state to issue the pending FOC
		if (StringUtils.isEmpty(parentCashMemoDao) || (!StringUtils.isEmpty(parentCashMemoDao)
				&& parentCashMemoDao.getSalesTxnDao().getStatus() != null && !parentCashMemoDao.getSalesTxnDao()
						.getStatus().equalsIgnoreCase(TransactionStatusEnum.CONFIRMED.toString()))) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST
							+ "Parent cash Memo should be in CONFIRMED state to issue the pending FOC",
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS,
							"Parent cash Memo should be in CONFIRMED state to issue the pending FOC"));
		}

		// New Sales Txn for FOC CM
		SalesTxnDaoExt salesTxnDaoExt = commonTransactionService.getSalesTxnDao(null, txnType, subTxnType,
				SalesDocTypeEnum.CM, TransactionStatusEnum.CONFIRMED);

		salesTxnDaoExt.setRefTxnId(parentCashMemoDao.getSalesTxnDao());
		salesTxnDaoExt.setRefTxnType(parentCashMemoDao.getSalesTxnDao().getTxnType());
		salesTxnDaoExt.setMetalRateDetails(parentCashMemoDao.getSalesTxnDao().getMetalRateDetails());

		// New Cash Memo for FOC CM
		CashMemoDaoExt cashMemoDao = new CashMemoDaoExt();
		cashMemoDao.setSalesTxnDao(salesTxnDaoExt);
		cashMemoDao.setPaidValue(BigDecimal.ZERO);
		cashMemoDao.setSrcSyncId(0);
		cashMemoDao.setDestSyncId(0);
		FocResponseAndPublishDto publishResponse = cashMemoFocServiceIml.syncStagging(salesTxnDaoExt, cashMemoDao,
				issueFocRequestDto, parentCashMemoDao);
		salesSyncDataService.publishSalesMessagesToQueue(publishResponse.getSyncStaging());
		FocIssueResponseDto focIssueResponseDto = (FocIssueResponseDto) MapperUtil
				.getObjectMapping(cashMemoDao.getSalesTxnDao(), new FocIssueResponseDto());
		focIssueResponseDto.setFocItems(publishResponse.getFocItemResponseDtoList());
		return focIssueResponseDto;
	}

	@Transactional
	public FocResponseAndPublishDto syncStagging(SalesTxnDaoExt salesTxnDaoExt, CashMemoDaoExt cashMemoDao,
			IssueFocRequestDto issueFocRequestDto, CashMemoDaoExt parentCashMemoDao) {

		log.info("Sync staging FOC Issue ->>>> {}", salesTxnDaoExt);

		// Update customer txn details for New FOC CM
		commonTransactionService.updateCustomerDetails(parentCashMemoDao.getSalesTxnDao().getCustomerId(),
				salesTxnDaoExt);

		salesTxnDaoExt = salesTxnRepository.save(salesTxnDaoExt);
		cashMemoDao = cashMemoRepository.save(cashMemoDao);

		log.info("Sales txn with updated Customer details ->>> {} ", cashMemoDao.getSalesTxnDao());

		// Validated FOCScheme id and Create FOC item details
		validateAndCreateFocItemDetails(cashMemoDao, issueFocRequestDto, parentCashMemoDao);

		List<FocDetailsDaoExt> focDetailsDaoList = focDetailsRepository
				.findAllBySalesTxnId(cashMemoDao.getSalesTxnDao().getId());

		Short totalItemQuantity = 0;
		BigDecimal totalItemWeight = BigDecimal.ZERO;

		List<FocItemResponseDto> focItemResponseDtoList = new ArrayList<>();

		List<UpdateInventoryDto> removeInventoryDtoList = new ArrayList<>();
		
		List<FocDetailsDaoExt> focDetailsDao = new ArrayList<>();

		for (FocDetailsDaoExt focDetails : focDetailsDaoList) {
			commonTransactionService.getInvetoryItemDetailsByItemCodeAndLotNumber(focDetails.getInventoryId(),
					focDetails.getUnitWeight(), focDetails.getTotalQuantity(), focDetails.getItemCode(),
					focDetails.getLotNumber());

			// perform your action here
			List<InventoryItemDto> inventoryItemList = engineService
					.getInventoryItemLotDetails(focDetails.getItemCode(), focDetails.getLotNumber());

			Collections.sort(inventoryItemList, Comparator.comparing(InventoryItemDto::getTotalQuantity));

			Short qtyLeftToAdd = focDetails.getTotalQuantity();
			List<InventoryItemDto> invDaoForSalesDetailsUpdate = new ArrayList<>();
			for (InventoryItemDto invDao : inventoryItemList) {
				UpdateInventoryDto updateInvDto = new UpdateInventoryDto();
				updateInvDto.setId(invDao.getInventoryId());
				// if reqQty is less or equal to invQty
				if (qtyLeftToAdd.compareTo(invDao.getTotalQuantity()) <= 0) {
					updateInvDto.setTotalQuantity(qtyLeftToAdd);
					qtyLeftToAdd = 0;
					invDaoForSalesDetailsUpdate.add(invDao);
				} else {
					updateInvDto.setTotalQuantity(invDao.getTotalQuantity());
					qtyLeftToAdd = (short) (qtyLeftToAdd - invDao.getTotalQuantity());
					invDaoForSalesDetailsUpdate.add(invDao);
				}

				removeInventoryDtoList.add(updateInvDto);

				if (qtyLeftToAdd.compareTo((short) 0) == 0) {
					break;
				}
			}

			// Update FOC item status from OPEN to ISSUED and check qtyleft !0 throw error
			if (qtyLeftToAdd.compareTo((short) 0) == 0) {

				focDetails.setStatus(FocStatusEnum.ISSUED.name());
				// update the foc details table for inv id and inv details
				focDetails.setInventoryDetails(MapperUtil
						.getStringFromJson(new JsonData("INVENTORY_DETAILS", invDaoForSalesDetailsUpdate)));
				if (invDaoForSalesDetailsUpdate.size() == 1) {
					focDetails.setInventoryId(invDaoForSalesDetailsUpdate.get(0).getInventoryId());
				}

			} else {
				throw new ServiceException(SalesConstants.ITEM_NOT_AVAILABLE, SalesConstants.ERR_SALE_131,
						"Items with proper quantity are not available in inventory for the item codes: "
								+ focDetails.getItemCode());
			}

			focDetailsDao.add(focDetails);

		}

		focDetailsRepository.saveAll(focDetailsDao);

		// Updating Header details after adding items
		cashMemoDao.setTotalQuantity(totalItemQuantity);
		cashMemoDao.setTotalWeight(totalItemWeight);
		salesTxnDaoExt.setSrcSyncId(salesTxnDaoExt.getSrcSyncId() + 1);
		cashMemoDao.setSrcSyncId(cashMemoDao.getSrcSyncId() + 1);
		cashMemoDao = cashMemoRepository.save(cashMemoDao);

		// Remove the Issued FOC items from inventory
		inventoryService.removeFromInventoryDetails(removeInventoryDtoList, salesTxnDaoExt.getDocNo(),
				SalesDocTypeEnum.CM);

		// Update FOC Scheme status as ISSUED after Issuing the Pending FOC items
		focSchemesRepository.updateFocSchemeStatusBySalesTxnId(FocStatusEnum.ISSUED.toString(),
				cashMemoDao.getSalesTxnDao().getId());
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = cashMemoDetailsRepository
				.findByCashMemoDaoId(cashMemoDao.getId());
		List<FocDetailsDaoExt> focDetailsList = focDetailsRepository.findBySalesTxnId(salesTxnDaoExt.getId());
		List<FocSchemesDaoExt> focSchemeLsit = focSchemesRepository.findBySalesTxnId(salesTxnDaoExt.getId());
		CustomerTxnDaoExt customer = cusTxnDetailsRepository.findOneBySalesTxnDaoId(salesTxnDaoExt.getId());
        customer.setMobileNumber(CryptoUtil.decrypt(customer.getMobileNumber(),MOBILE_NO,false));
        customer.setEmailId(CryptoUtil.decrypt(customer.getEmailId(),EMAIL_ID,false));
        customer.setCustomerName(CryptoUtil.decrypt(customer.getCustomerName(),CUSTOMER_NAME,false));
        customer.setCustTaxNo(CryptoUtil.decrypt(customer.getCustTaxNo(),CUST_TAX_NO,false));
        customer.setCustTaxNoOld(CryptoUtil.decrypt(customer.getCustTaxNoOld(),CUST_TAX_NO_OLD,false));
        customer.setInstiTaxNo(CryptoUtil.decrypt(customer.getInstiTaxNo(),INSTI_TAX_NO,false));
        customer.setPassportId(CryptoUtil.decrypt(customer.getPassportId(),PASSPORT_ID,false));
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add("EPOSS");
		syncDataList.add(DataSyncUtil.createSyncData(new SalesTxnSyncDtoExt(salesTxnDaoExt,null), 0));
		syncDataList.add(DataSyncUtil.createSyncData(new CashMemoSyncDtoExt(cashMemoDao,null), 1));
		if (!cashMemoDetailsDaoList.isEmpty()) {
			List<CashMemoDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
			cashMemoDetailsDaoList.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new CashMemoDetailsSyncDtoExt(daoExt));
			});
			cashMemoDetailsRepository.saveAll(cashMemoDetailsDaoList);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 3));
		}
		if (customer != null) {
			customer.setSrcSyncId(customer.getSrcSyncId() + 1);
            customer.setEmailId(CryptoUtil.encrypt(customer.getEmailId() , EMAIL_ID));
            customer.setMobileNumber(CryptoUtil.encrypt(customer.getMobileNumber(), MOBILE_NO));
            customer.setInstiTaxNo(CryptoUtil.encrypt( customer.getInstiTaxNo() , INSTI_TAX_NO ));    
            customer.setPassportId(CryptoUtil.encrypt(customer.getPassportId(), PASSPORT_ID ));
            customer.setCustTaxNo(CryptoUtil.encrypt(customer.getCustTaxNo(),  CUST_TAX_NO));
            customer.setCustomerName(CryptoUtil.encrypt(customer.getCustomerName(), CUSTOMER_NAME ));      
            customer.setCustTaxNoOld(CryptoUtil.encrypt(customer.getCustTaxNoOld(),  CUST_TAX_NO_OLD ));   
            customer.setIsEncrypted(Boolean.TRUE);
			customer = cusTxnDetailsRepository.save(customer);
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerTxnSyncDtoExt(customer), 4));
		}
		if (focDetailsList.isEmpty()) {
			List<FocDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
			focDetailsList.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new FocDetailsSyncDtoExt(daoExt));
			});
			focDetailsRepository.saveAll(focDetailsList);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 7));
		}
		if (focSchemeLsit.isEmpty()) {
			List<FocSchemeSyncDtoExt> dtoExtList = new ArrayList<>();
			focSchemeLsit.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new FocSchemeSyncDtoExt(daoExt));
			});
			focSchemesRepository.saveAll(focSchemeLsit);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 8));
		}
		MessageRequest cashMemoMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
				SalesOperationCode.PENDING_FOC_CM, destinations, MessageType.FIFO.toString(),
				DestinationType.SELECTIVE.toString());
		SyncStagingDto cashMemoStagingDto = new SyncStagingDto();
		cashMemoStagingDto.setMessageRequest(cashMemoMsgRequest);
		String cashMemoMsgRqst = MapperUtil.getJsonString(cashMemoMsgRequest);
		SyncStaging cashMemoSyncStaging = new SyncStaging();
		cashMemoSyncStaging.setMessage(cashMemoMsgRqst);
		cashMemoSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		cashMemoSyncStaging = saleSyncStagingRepository.save(cashMemoSyncStaging);
		cashMemoStagingDto.setId(cashMemoSyncStaging.getId());
		FocResponseAndPublishDto response = new FocResponseAndPublishDto();
		response.setFocItemResponseDtoList(focItemResponseDtoList);
		response.setSyncStaging(cashMemoStagingDto);
		return response;
	}

	// Method to validate and create FOC item details
	private void validateAndCreateFocItemDetails(CashMemoDaoExt cashMemoDao, IssueFocRequestDto issueFocRequestDto,
			CashMemoDaoExt parentCashMemoDao) {
		for (IssueFocDetailsRequestDto focDetail : issueFocRequestDto.getFocDetails()) {

			log.info("validateAndCreateFocItemDetails - >>>> {}", focDetail);

			FocSchemesDaoExt focSchemesDao = validateFocSchemeId(focDetail.focSchemeId,
					parentCashMemoDao.getSalesTxnDao().getId());

			log.info("validateAndCreateFocItemDetails>>>Post validateFocSchemeId: FocScheme details: {} ",
					focSchemesDao);

			List<FocDetailsDaoExt> focDetailsDaoList = new ArrayList<>();

			short rowId = 1;

			for (FocItemDetailsDto focItem : focDetail.getFocItemDetails()) {
				FocDetailsDaoExt focDetailsDao = (FocDetailsDaoExt) MapperUtil.getObjectMapping(focItem,
						new FocDetailsDaoExt());
				focDetailsDao.setSalesTxn(cashMemoDao.getSalesTxnDao());
				focDetailsDao.setFocScheme(focSchemesDao);
				focDetailsDao.setStatus(FocStatusEnum.ISSUED.toString());
				// TO DO: Change datatype to Integer in DB & getCountById
				focDetailsDao.setRowId(rowId++);
				focDetailsDao.setSrcSyncId(0);
				focDetailsDao.setDestSyncId(0);

				cashMemoFocItemServiceImpl.validateInventoryDetails(focItem, focDetailsDao);

				cashMemoFocItemServiceImpl.calculateFOCItemPrice(focDetailsDao, cashMemoDao.getSalesTxnDao());

				focDetailsDaoList.add(focDetailsDao);
			}

			BigDecimal totalIssuedWeight = focDetailsDaoList.stream().map(FocDetailsDaoExt::getTotalWeight)
					.reduce(BigDecimal.ZERO, BigDecimal::add);

			Integer totalIssuedQuantity = focDetailsDaoList.stream().mapToInt(FocDetailsDaoExt::getTotalQuantity).sum();

			// Total Issued Weight should not be more than Eligible Weight in case of coins
			if (!StringUtils.isEmpty(focSchemesDao.getEligibleWeight())
					&& totalIssuedWeight.compareTo(focSchemesDao.getEligibleWeight()) > 0) {
				throw new ServiceException("Total Issued Weight is more than Eligible Weight", "ERR-SALE-133",
						focSchemesDao.getId());
			}

			// Total Issued Quantity should not be more than Eligible Quantity in case of
			// diamond
			if (!StringUtils.isEmpty(focSchemesDao.getEligibleQuantity())
					&& totalIssuedQuantity.compareTo((int) focSchemesDao.getEligibleQuantity()) > 0) {
				throw new ServiceException("Total Issued Quantity is more than Eligible Quantity", "ERR-SALE-102",
						focSchemesDao.getId());
			}

			log.info("FOC item details ->>>>", focDetailsDaoList);

			focDetailsRepository.saveAll(focDetailsDaoList);

		}
	}

	/**
	 * @param focSchemeId
	 * @param id
	 */
	private FocSchemesDaoExt validateFocSchemeId(String focSchemeId, String salesTxnId) {
		log.info("validateFocSchemeId >>>Sales Txn id - {}", salesTxnId);
		FocSchemesDaoExt focSchemesDao = focSchemesRepository.findByIdAndSalesTxnIdAndStatus(focSchemeId, salesTxnId,
				FocStatusEnum.PENDING.toString());
		log.info("Foc Scheme details - {}", focSchemesDao);
		if (StringUtils.isEmpty(focSchemesDao)) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Foc Scheme details not found for the transaction",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Foc Scheme details not found for the transaction"));
		}
		return focSchemesDao;
	}

}
