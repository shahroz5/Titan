/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.CASHBACK_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.CashbackCardDetailsDaoExt;
import com.titan.poss.payment.dao.CashbackDaoExt;
import com.titan.poss.payment.dao.CashbackOfferDetailsDaoExt;
import com.titan.poss.payment.dao.CashbackProductMappingDaoExt;
import com.titan.poss.payment.dao.PayerBankDao;
import com.titan.poss.payment.dao.SyncStaging;
import com.titan.poss.payment.dto.CardDetailsUpdateDto;
import com.titan.poss.payment.dto.CashbackCardDetailsSyncDtoExt;
import com.titan.poss.payment.dto.CashbackDto;
import com.titan.poss.payment.dto.CashbackOfferAddDto;
import com.titan.poss.payment.dto.CashbackOfferDetailsSyncDtoExt;
import com.titan.poss.payment.dto.CashbackOfferDto;
import com.titan.poss.payment.dto.CashbackOfferResponseDto;
import com.titan.poss.payment.dto.CashbackOfferUpdateDto;
import com.titan.poss.payment.dto.CashbackProductMappingSyncDtoExt;
import com.titan.poss.payment.dto.CashbackSyncDtoExt;
import com.titan.poss.payment.dto.request.CashbackRequestDto;
import com.titan.poss.payment.dto.request.CashbackUpdateDto;
import com.titan.poss.payment.dto.response.CardDetailResponseDto;
import com.titan.poss.payment.dto.response.CashbackProductDto;
import com.titan.poss.payment.dto.response.CashbackProductResponseDto;
import com.titan.poss.payment.repository.CashbackCardDetailsRepositoryExt;
import com.titan.poss.payment.repository.CashbackOfferDetailsRepositoryExt;
import com.titan.poss.payment.repository.CashbackProductMappingRepositoryExt;
import com.titan.poss.payment.repository.CashbackRepositoryExt;
import com.titan.poss.payment.repository.PayerBankRepository;
import com.titan.poss.payment.repository.PaymentSyncStagingRepository;
import com.titan.poss.payment.service.CashbackService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(CASHBACK_SERVICE_IMPL)
public class CashbackServiceImpl implements CashbackService {

	@Autowired
	CashbackRepositoryExt cashbackRepoExt;

	@Autowired
	CashbackCardDetailsRepositoryExt cashbackCardRepo;

	@Autowired
	CashbackProductMappingRepositoryExt cashbackProductRepo;

	@Autowired
	private PaymentSyncDataServiceImpl syncDataService;

	@Autowired
	CashbackOfferDetailsRepositoryExt cashbackOfferRepo;

	@Autowired
	private PaymentSyncStagingRepository paymentSyncStagingRepository;

	@Autowired
	private CashbackServiceImpl cashbackServiceImp;

	@Autowired
	private PayerBankRepository payerBankRepo;

	/**
	 * This method will save the Cashback details.
	 * 
	 * @param cashbackRequestDto
	 * @return CashbackDto
	 */

	@Override
	public CashbackDto addCashbackDetails(CashbackRequestDto cashbackRequestDto) {

		CashbackDaoExt cashbackDaoExt = (CashbackDaoExt) MapperUtil.getObjectMapping(cashbackRequestDto,
				new CashbackDaoExt());
		PayerBankDao payerBankName = payerBankRepo.findById(cashbackRequestDto.getBankName())
				.orElseThrow(() -> new ServiceException(PaymentConstants.NO_BANK_FOUND_FOR_THE_REQUESTED_BANK_NAME,
						PaymentConstants.ERR_PAY_005));

		cashbackDaoExt.setPayerBankName(payerBankName);
		cashbackDaoExt.setSrcSyncId(0);
		cashbackDaoExt.setDestSyncId(0);
		SyncStagingDto syncStagingDto = cashbackServiceImp.saveCashback(cashbackDaoExt,
				PaymentOperationCodes.CASHBACK_ADD);
		syncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		return setCashbackResponse(cashbackDaoExt);
	}

	private CashbackDto setCashbackResponse(CashbackDaoExt cashbackDaoExt) {
		CashbackDto cashbackDto = (CashbackDto) MapperUtil.getObjectMapping(cashbackDaoExt, new CashbackDto());
		cashbackDto.setBankName(cashbackDaoExt.getPayerBankName().getBankName());
		return cashbackDto;
	}

	@Transactional
	public SyncStagingDto saveCashback(CashbackDaoExt cashbackDao, String operation) {
		cashbackDao = cashbackRepoExt.save(cashbackDao);
		CashbackSyncDtoExt cashbackSyncDtoExt = new CashbackSyncDtoExt(cashbackDao);
		SyncStagingDto cashbackStagingDto = new SyncStagingDto();
		List<SyncData> syncDataList = new ArrayList<>();
		syncDataList.add(DataSyncUtil.createSyncData(cashbackSyncDtoExt, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest cashbackMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		cashbackStagingDto.setMessageRequest(cashbackMsgRequest);
		String cashbackMsg = MapperUtil.getJsonString(cashbackMsgRequest);
		// saving to staging table
		SyncStaging cashbackSyncStaging = new SyncStaging();
		cashbackSyncStaging.setMessage(cashbackMsg);
		cashbackSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		cashbackSyncStaging = paymentSyncStagingRepository.save(cashbackSyncStaging);
		cashbackStagingDto.setId(cashbackSyncStaging.getId());
		return cashbackStagingDto;
	}

	/**
	 * This method will get the Cashback details based on cashbackId
	 * 
	 * @param cashBackId
	 * @return CashbackDto
	 */
	@Override
	public CashbackDto getCashbackDetails(String cashBackId) {

		Optional<CashbackDaoExt> cashbackDaoExtResp = cashbackRepoExt.findById(cashBackId);

		if (!cashbackDaoExtResp.isPresent())
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_CASHBACK_ID,
					PaymentConstants.ERR_PAY_031);
		return setCashbackResponse(cashbackDaoExtResp.get());
	}

	/**
	 * This method will update the Cashback Details.
	 * 
	 * @param cashbackUpdateDto
	 * @param cashbackId
	 * @return CashbackDto
	 */
	@Override
	public CashbackDto updateCashbackDetails(String cashBackId, CashbackUpdateDto cashbackUpdateDto) {
		Optional<CashbackDaoExt> cashbackDaoResp = cashbackRepoExt.findById(cashBackId);

		if (!cashbackDaoResp.isPresent())
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_CASHBACK_ID,
					PaymentConstants.ERR_PAY_031);

		if (cashbackUpdateDto.getStartDate() != null && cashbackUpdateDto.getEndDate() != null) {
			if (cashbackUpdateDto.getStartDate().after(cashbackUpdateDto.getEndDate())) {
				throw new ServiceException("Start date must be before end date", "ERR-CONFIG-052");
			}
		}

		CashbackDaoExt cashbackDaoExt = (CashbackDaoExt) MapperUtil.getObjectMapping(cashbackUpdateDto,
				cashbackDaoResp.get(), "lastCardDigits", "firstCardDigits");
		if (!StringUtils.isEmpty(cashbackUpdateDto.getFirstCardDigits()))
			cashbackDaoExt.setFirstCardDigits(Integer.parseInt(cashbackUpdateDto.getFirstCardDigits()));
		else
			cashbackDaoExt.setFirstCardDigits(null);
		if (!StringUtils.isEmpty(cashbackUpdateDto.getLastCardDigits()))
			cashbackDaoExt.setLastCardDigits(Integer.parseInt(cashbackUpdateDto.getLastCardDigits()));
		else
			cashbackDaoExt.setLastCardDigits(null);
		PayerBankDao payerBankName = payerBankRepo.findById(cashbackUpdateDto.getBankName())
				.orElseThrow(() -> new ServiceException(PaymentConstants.NO_BANK_FOUND_FOR_THE_REQUESTED_BANK_NAME,
						PaymentConstants.ERR_PAY_005));

		cashbackDaoExt.setPayerBankName(payerBankName);
		cashbackDaoExt.setSrcSyncId(cashbackDaoExt.getSrcSyncId() + 1);
		SyncStagingDto syncStagingDto = cashbackServiceImp.saveCashback(cashbackDaoExt,
				PaymentOperationCodes.CASHBACK_UPDATE);
		syncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		return setCashbackResponse(cashbackDaoExt);
	}

	/**
	 * This method will return the list of Cashback Details based on the cashBackId,
	 * isActive.
	 * 
	 * @param isActive
	 * @return ListResponse<CashbackDto>
	 */
	@Override
	public PagedRestResponse<List<CashbackDto>> listCashbackDetails(String bankName, Boolean isActive,
			Pageable pageable) {

		CashbackDaoExt cashbackCriteria = new CashbackDaoExt();
		cashbackCriteria.setIsActive(isActive);
		PayerBankDao payerBankDao = new PayerBankDao();
		payerBankDao.setBankName(bankName);

		cashbackCriteria.setPayerBankName(payerBankDao);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CashbackDaoExt> criteria = Example.of(cashbackCriteria, matcher);

		Page<CashbackDaoExt> cashbackList = cashbackRepoExt.findAllBankName(bankName, isActive, pageable);

		List<CashbackDto> cashbckDtoList = new ArrayList<>();
		cashbackList.forEach(cashbackDao -> cashbckDtoList.add(setCashbackResponse(cashbackDao)));
		return new PagedRestResponse<>(cashbckDtoList, cashbackList);

	}

	/**
	 * This method will update the Card Details based on cashbackId
	 * 
	 * @param cashbackId
	 */
	@Override
	public CardDetailsUpdateDto updateCardDetails(String cashBackId, CardDetailsUpdateDto cardDetailsUpdateDto) {

		Optional<CashbackDaoExt> cashbackDaoResp = cashbackRepoExt.findById(cashBackId);

		if (!cashbackDaoResp.isPresent())
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_CASHBACK_ID,
					PaymentConstants.ERR_PAY_031);

		List<CashbackCardDetailsDaoExt> cashbackCardDaoList = new ArrayList<>();
		Map<String, Boolean> cardDetailMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(cardDetailsUpdateDto.getUpdateCards())) {

			cardDetailsUpdateDto.getUpdateCards()
					.forEach(cardDetail -> cardDetailMap.put(cardDetail.getId(), cardDetail.getIsActive()));

			List<CashbackCardDetailsDaoExt> cardDetailDao = cashbackCardRepo.findByIdIn(cardDetailMap.keySet());

			cardDetailDao.forEach(cardDetail -> {
				cardDetail.setIsActive(cardDetailMap.get(cardDetail.getId()));
				cashbackCardDaoList.add(cardDetail);
			});

			SyncStagingDto syncStagingDto = cashbackServiceImp.updateCashbackCardDetails(cashbackCardDaoList,
					PaymentOperationCodes.CASHBACK_CARD_DETAILS_UPDATE);
			syncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		}
		return cardDetailsUpdateDto;

	}

	@Transactional
	public SyncStagingDto updateCashbackCardDetails(List<CashbackCardDetailsDaoExt> cashbackCardDaoList,
			String operation) {
		cashbackCardDaoList.forEach(cardDetails -> cardDetails.setSrcSyncId(cardDetails.getSrcSyncId() + 1));
		cashbackCardRepo.saveAll(cashbackCardDaoList);
		List<CashbackCardDetailsSyncDtoExt> cashbackCardDetailsSyncDtoExtList = new ArrayList<>();
		cashbackCardDaoList.forEach(cashbackCardDetailsDao -> cashbackCardDetailsSyncDtoExtList
				.add(new CashbackCardDetailsSyncDtoExt(cashbackCardDetailsDao)));
		SyncStagingDto cashbackStagingDto = new SyncStagingDto();
		List<SyncData> syncDataList = new ArrayList<>();
		syncDataList.add(DataSyncUtil.createSyncData(cashbackCardDetailsSyncDtoExtList, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest cashbackMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		cashbackStagingDto.setMessageRequest(cashbackMsgRequest);
		String cashbackMsg = MapperUtil.getJsonString(cashbackMsgRequest);
		// saving to staging table
		SyncStaging cashbackSyncStaging = new SyncStaging();
		cashbackSyncStaging.setMessage(cashbackMsg);
		cashbackSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		cashbackSyncStaging = paymentSyncStagingRepository.save(cashbackSyncStaging);
		cashbackStagingDto.setId(cashbackSyncStaging.getId());
		return cashbackStagingDto;
	}

	/**
	 * This method will return the list of Cards based on the cashBackId,
	 * 
	 * @param isActive
	 * @return ListResponse<UpdateCardDetailDto>
	 */
	@Override
	public PagedRestResponse<List<CardDetailResponseDto>> listCardDetails(String cashBackId, Boolean isActive,
			Pageable pageable) {

		CashbackCardDetailsDaoExt cardCriteria = new CashbackCardDetailsDaoExt();

		CashbackDaoExt cashbackDao = new CashbackDaoExt();
		cashbackDao.setId(cashBackId);
		cardCriteria.setCashbackDao(cashbackDao);

		cardCriteria.setIsActive(isActive);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CashbackCardDetailsDaoExt> criteria = Example.of(cardCriteria, matcher);

		Page<CashbackCardDetailsDaoExt> cashbackList = cashbackCardRepo.findAll(criteria, pageable);

		List<CardDetailResponseDto> cashbckCardList = new ArrayList<>();
		cashbackList.forEach(cardDetailDao -> {

			CardDetailResponseDto cardDetail = (CardDetailResponseDto) MapperUtil.getObjectMapping(cardDetailDao,
					new CardDetailResponseDto());
			cashbckCardList.add(cardDetail);
		});
		return new PagedRestResponse<>(cashbckCardList, cashbackList);
	}

	/**
	 * This method will create or remove product mapping with cashbackId
	 * 
	 * @param cashbackId
	 */
	@Override
	public CashbackProductDto cashbackProductMapping(String cashBackId, CashbackProductDto cashbackProductDto) {
		SyncStagingDto syncStagingDto = cashbackServiceImp.updateCashbackProductMapping(cashBackId, cashbackProductDto,
				PaymentOperationCodes.CASHBACK_PRODUCT);
		if (syncStagingDto != null)
			syncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		return cashbackProductDto;
	}

	@Transactional
	public SyncStagingDto updateCashbackProductMapping(String cashBackId, CashbackProductDto cashbackProductDto,
			String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(cashbackProductDto.getRemoveProductGroups())) {
			List<CashbackProductMappingSyncDtoExt> cashbackProductMappingDeleteDaoExtList = deleteCashbackProductMapping(
					cashBackId, cashbackProductDto);
			syncDataList.add(DataSyncUtil.createSyncData(cashbackProductMappingDeleteDaoExtList, 0));
		}
		if (!CollectionUtils.isEmpty(cashbackProductDto.getAddProductGroups())) {
			List<CashbackProductMappingSyncDtoExt> cashbackProductMappingSyncDtoExtList = saveCashbackProductMapping(
					cashBackId, cashbackProductDto);
			syncDataList.add(DataSyncUtil.createSyncData(cashbackProductMappingSyncDtoExtList, 1));
		}
		SyncStagingDto cashbackStagingDto = new SyncStagingDto();
		if (!syncDataList.isEmpty()) {
			List<String> destinations = new ArrayList<>();
			MessageRequest cashbackMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
					MessageType.GENERAL.toString(), DestinationType.ALL.toString());
			cashbackStagingDto.setMessageRequest(cashbackMsgRequest);
			String cashbackMsg = MapperUtil.getJsonString(cashbackMsgRequest);
			// saving to staging table
			SyncStaging cashbackSyncStaging = new SyncStaging();
			cashbackSyncStaging.setMessage(cashbackMsg);
			cashbackSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			cashbackSyncStaging = paymentSyncStagingRepository.save(cashbackSyncStaging);
			cashbackStagingDto.setId(cashbackSyncStaging.getId());
		}
		return cashbackStagingDto;
	}

	public List<CashbackProductMappingSyncDtoExt> deleteCashbackProductMapping(String cashBackId,
			CashbackProductDto cashbackProductDto) {
		List<String> removeIdList = cashbackProductDto.getRemoveProductGroups().parallelStream()
				.collect(Collectors.toList());
		List<CashbackProductMappingDaoExt> deleteList = cashbackProductRepo.findAllById(cashBackId, removeIdList);
		cashbackProductRepo.deleteAll(deleteList);
		deleteList.forEach(cashbackProductDao -> cashbackProductDao.setSyncTime(new Date().getTime()));
		return daoTosyncDto(deleteList);
	}

	public List<CashbackProductMappingSyncDtoExt> saveCashbackProductMapping(String cashBackId,
			CashbackProductDto cashbackProductDto) {
		List<CashbackProductMappingDaoExt> cashbackProductDaoList = new ArrayList<>();
		cashbackProductDto.getAddProductGroups().forEach(productGroupMapping -> {

			CashbackProductMappingDaoExt cashbackProductDao = (CashbackProductMappingDaoExt) MapperUtil
					.getObjectMapping(productGroupMapping, new CashbackProductMappingDaoExt());
			if (cashbackRepoExt.existsById(cashBackId)) {
				cashbackProductDao.setCashbackDao(cashbackRepoExt.findById(cashBackId).get());
			}
			cashbackProductDao.setSyncTime(new Date().getTime());
			cashbackProductDaoList.add(cashbackProductDao);
		});
		return daoTosyncDto(cashbackProductRepo.saveAll(cashbackProductDaoList));
	}

	public List<CashbackProductMappingSyncDtoExt> daoTosyncDto(
			List<CashbackProductMappingDaoExt> cashbackProductDaoList) {
		List<CashbackProductMappingSyncDtoExt> cashbackProductMappingSyncDtoExtList = new ArrayList<>();
		for (CashbackProductMappingDaoExt cashbackProductMappingDaoExt : cashbackProductDaoList) {
			cashbackProductMappingSyncDtoExtList
					.add(new CashbackProductMappingSyncDtoExt(cashbackProductMappingDaoExt));
		}
		return cashbackProductMappingSyncDtoExtList;
	}

	/**
	 * This method will return the list of Cashback Product mapping details based on
	 * cashbackId.
	 * 
	 * @param cashbackId
	 * @return ListResponse<CashbackProductUpdateDto>
	 */
	@Override
	public ListResponse<CashbackProductResponseDto> listCashbackProductMapping(String cashBackId) {

		List<CashbackProductMappingDaoExt> cashbackProductList = cashbackProductRepo.findMappedProduct(cashBackId);

		if (CollectionUtils.isEmpty(cashbackProductList))
			throw new ServiceException(PaymentConstants.NO_PRODUCT_MAPPING_FOUND_FOR_REQUESTED_ID,
					PaymentConstants.ERR_PAY_033);

		List<CashbackProductResponseDto> mappedProductList = new ArrayList<>();
		cashbackProductList.forEach(mappedProduct -> {
			CashbackProductResponseDto productDto = (CashbackProductResponseDto) MapperUtil
					.getObjectMapping(mappedProduct, new CashbackProductResponseDto());
			mappedProductList.add(productDto);
		});

		return new ListResponse<>(mappedProductList);
	}

	/**
	 * This method will update offerDetails with cashbackId
	 * 
	 * @param cashbackOfferDto
	 * @param cashbackId
	 */
	@Override
	public CashbackOfferDto updateCashbackOfferDetails(String cashbackId, CashbackOfferDto cashbackOfferDto) {
		SyncStagingDto cashbackStagingDto = cashbackServiceImp.stagingOfferDetails(cashbackId, cashbackOfferDto);
		if (cashbackStagingDto != null)
			syncDataService.publishPaymentMessagesToQueue(cashbackStagingDto);
		return cashbackOfferDto;
	}

	@Transactional
	public SyncStagingDto stagingOfferDetails(String cashbackId, CashbackOfferDto cashbackOfferDto) {
		CashbackDaoExt cashbackDao = cashbackRepoExt.findById(cashbackId)
				.orElseThrow(() -> new ServiceException(
						PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED_CASHBACK_ID,
						PaymentConstants.ERR_PAY_031));

		cashbackDao.setIsCashbackAmount(cashbackOfferDto.getIsCashbackAmount());

		List<CashbackOfferAddDto> offers = cashbackOfferDto.getAddOffers();
		List<CashbackOfferDetailsDaoExt> cashbackRecordsList = new ArrayList<>();
		List<SyncData> syncDataList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(cashbackOfferDto.getRemoveOffers())) {
			syncDataList.add(DataSyncUtil.createSyncData(deleteMappedOffer(cashbackOfferDto.getRemoveOffers()), 0));

		}
		if (!CollectionUtils.isEmpty(cashbackOfferDto.getUpdateOffers())) {

			updateOfferDetail(cashbackOfferDto.getUpdateOffers(), cashbackRecordsList);
		}

		if (!CollectionUtils.isEmpty(offers)) {

			/* for future use, if requirement is to get all the errors in a record */
			List<String> errorList = new ArrayList<>();

			addOfferDetails(cashbackId, offers, cashbackDao, cashbackRecordsList, errorList);

		}
		cashbackOfferRepo.flush();
		if (!cashbackRecordsList.isEmpty()) {
			cashbackRecordsList = cashbackOfferRepo.saveAll(cashbackRecordsList);
			List<CashbackOfferDetailsSyncDtoExt> cashbackOfferSyncDtoList = new ArrayList<>();
			cashbackRecordsList.forEach(
					cashbackOffer -> cashbackOfferSyncDtoList.add(new CashbackOfferDetailsSyncDtoExt(cashbackOffer)));
			syncDataList.add(DataSyncUtil.createSyncData(cashbackOfferSyncDtoList, 1));
		}

		SyncStagingDto cashbackStagingDto = new SyncStagingDto();
		if (!syncDataList.isEmpty()) {
			List<String> destinations = new ArrayList<>();
			MessageRequest cashbackMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
					PaymentOperationCodes.CASHBACK_OFFER_DETAILS_UPDATE, destinations, MessageType.GENERAL.toString(),
					DestinationType.ALL.toString());
			cashbackStagingDto.setMessageRequest(cashbackMsgRequest);
			String cashbackMsg = MapperUtil.getJsonString(cashbackMsgRequest);
			// saving to staging table
			SyncStaging cashbackSyncStaging = new SyncStaging();
			cashbackSyncStaging.setMessage(cashbackMsg);
			cashbackSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			cashbackSyncStaging = paymentSyncStagingRepository.save(cashbackSyncStaging);
			cashbackStagingDto.setId(cashbackSyncStaging.getId());
		}
		cashbackDao.setSrcSyncId(cashbackDao.getSrcSyncId() + 1);
		SyncStagingDto syncStagingDto = cashbackServiceImp.saveCashback(cashbackDao,
				PaymentOperationCodes.CASHBACK_UPDATE);
		syncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		return cashbackStagingDto;
	}

	/**
	 * This method validates and add offer details
	 * 
	 * @param cashbackId
	 * @param offers
	 * @param cashbackDao
	 * @param cashbackRecordsList
	 * @param errorList
	 * @param offerDaoList
	 * @return
	 */
	public void addOfferDetails(String cashbackId, List<CashbackOfferAddDto> offers, CashbackDaoExt cashbackDao,
			List<CashbackOfferDetailsDaoExt> cashbackRecordsList, List<String> errorList) {

		Collections.sort(offers, Comparator.comparing(CashbackOfferAddDto::getRowId));

		Boolean excludeCashbckFlag = false;
		Optional<CashbackDaoExt> cashbackDaoResp = cashbackRepoExt.findById(cashbackId);

		if (cashbackDaoResp.isPresent()) {
			excludeCashbckFlag = cashbackDaoResp.get().getExcludeCashback();
		}

		for (int i = 0; i < offers.size(); i++) {
			boolean isValid = true;
			CashbackOfferAddDto currentRecord = offers.get(i);

			isValid = validateAgainstCurrentRecord(currentRecord, errorList);

			if (i > 0) {
				CashbackOfferAddDto previousRecord = offers.get(i - 1);
				isValid = validateAgainstPreviousRecord(excludeCashbckFlag, currentRecord, previousRecord, errorList);
			}

			if (!isValid) {
				throw new ServiceException(PaymentConstants.VALIDATION_FAILED, PaymentConstants.ERR_PAY_038,
						errorList.get(0));
			}

			CashbackOfferDetailsDaoExt cardDetailDao = (CashbackOfferDetailsDaoExt) MapperUtil
					.getObjectMapping(currentRecord, new CashbackOfferDetailsDaoExt());

			cardDetailDao.setCashbackDao(cashbackDao);
			cardDetailDao.setSyncTime(new Date().getTime());
			cashbackRecordsList.add(cardDetailDao);

		}

		List<CashbackOfferDetailsDaoExt> mappedRecordList = cashbackOfferRepo.findMappedOffer(cashbackId);

		if (mappedRecordList != null && !mappedRecordList.isEmpty()) {
			cashbackOfferRepo.deleteAll(mappedRecordList);
		}
		cashbackRepoExt.save(cashbackDao);

	}

	/**
	 * this method will delete Mapped Offers to cashbackId
	 * 
	 * @param cashbackId
	 * @param removeOffers
	 * @return
	 */

	public List<CashbackOfferDetailsSyncDtoExt> deleteMappedOffer(List<String> removeOffers) {
		List<String> removeIdList = removeOffers.parallelStream().collect(Collectors.toList());

		List<CashbackOfferDetailsDaoExt> deleteList = cashbackOfferRepo.findAllById(removeIdList);
		cashbackOfferRepo.deleteAll(deleteList);
		List<CashbackOfferDetailsSyncDtoExt> cashbackOfferSyncDtoList = new ArrayList<>();
		deleteList.forEach(cashbackOffer -> {
			cashbackOffer.setSyncTime(new Date().getTime());
			cashbackOfferSyncDtoList.add(new CashbackOfferDetailsSyncDtoExt(cashbackOffer));
		});
		return cashbackOfferSyncDtoList;

	}

	/**
	 * This method updates the offerDetails based on offerId
	 * 
	 * @param offerDaoList
	 * 
	 * @param cashBackId
	 * @param updateOfferDetail
	 * @return
	 */
	public void updateOfferDetail(List<CashbackOfferUpdateDto> offerList,
			List<CashbackOfferDetailsDaoExt> offerDaoList) {

		Map<String, CashbackOfferUpdateDto> offerMap = new HashMap<>();

		offerList.forEach(updateOffer -> offerMap.put(updateOffer.getId(), updateOffer));

		List<CashbackOfferDetailsDaoExt> offerDetailList = cashbackOfferRepo.findByIdIn(offerMap.keySet());

		offerDetailList.forEach(offerDetail -> {

			CashbackOfferDetailsDaoExt offerDetailDao = (CashbackOfferDetailsDaoExt) MapperUtil
					.getObjectMapping(offerMap.get(offerDetail.getId()), offerDetail);
			offerDetailDao.setSyncTime(new Date().getTime());
			offerDaoList.add(offerDetailDao);
		});

	}

	/**
	 * This method is use to validate Against Current Record
	 * 
	 * @param errorList
	 * @param currentRecord
	 */
	public Boolean validateAgainstCurrentRecord(CashbackOfferAddDto currentRecord, List<String> errorList) {
		boolean isValid = true;

		if (currentRecord.getMaxSwipeAmt().compareTo(currentRecord.getMinSwipeAmt()) <= 0) {
			isValid = false;
			errorList.add("Maximum Swipe Amount should be greater than Minimum Swipe Amount @ rowId - "
					+ currentRecord.getRowId() + "");
		}

		if (isValid && currentRecord.getMaxInvoiceAmt().compareTo(currentRecord.getMinInvoiceAmt()) <= 0) {
			isValid = false;
			errorList.add("Maximum Invoice Amount should be greater than Minimum Invoice Amount @ rowId - "
					+ currentRecord.getRowId() + "");
		}

		return isValid;
	}

	/**
	 * This method is use to validate Against Previous Record
	 * 
	 * @param excludeCashbckFlag
	 * @param boolean1
	 * @param currentRecord
	 * @param previousRecord
	 * @param errorList
	 * 
	 */
	public Boolean validateAgainstPreviousRecord(Boolean excludeCashbckFlag, CashbackOfferAddDto currentRecord,
			CashbackOfferAddDto previousRecord, List<String> errorList) {
		boolean isValid = true;

		isValid = validateSwipeAmount(excludeCashbckFlag, currentRecord, previousRecord, errorList);

		if (isValid) {
			isValid = validateInvoiceAmount(excludeCashbckFlag, currentRecord, previousRecord, errorList);
		}

		return isValid;
	}

	/**
	 * @param isCashbackAmt
	 * @param cashbackDaoResp
	 * @param currentRecord
	 * @param previousRecord
	 * @param errorList
	 * @return
	 */
	public Boolean validateSwipeAmount(Boolean excludeCashbckFlag, CashbackOfferAddDto currentRecord,
			CashbackOfferAddDto previousRecord, List<String> errorList) {
		Boolean isValid = true;

		if ((!excludeCashbckFlag) && (currentRecord.getMinSwipeAmt().compareTo(previousRecord.getMaxSwipeAmt()) <= 0)) {
			isValid = false;
			errorList
					.add("Minimum Swipe Amount should be greater than Maximum Swipe Amount of previous record @ rowId -"
							+ currentRecord.getRowId() + "");
		}

		return isValid;
	}

	/**
	 * This method is to validate Invoice AMount
	 * 
	 * @param excludeCashbckFlag
	 * @param isCashbackAmt
	 * @param currentRecord
	 * @param previousRecord
	 * @param errorList
	 * @return
	 */
	public Boolean validateInvoiceAmount(Boolean excludeCashbckFlag, CashbackOfferAddDto currentRecord,
			CashbackOfferAddDto previousRecord, List<String> errorList) {
		Boolean isValid = true;

		if (currentRecord.getMinInvoiceAmt().compareTo(previousRecord.getMaxInvoiceAmt()) <= 0) {
			isValid = false;
			errorList.add(
					"Minimum Invoice Amount should be greater than Maximum Invoice Amount of previous record @ rowId - "
							+ currentRecord.getRowId() + "");
		} else {
			isValid = validateExcludeCashback(excludeCashbckFlag, currentRecord, errorList);
		}

		return isValid;
	}

	/**
	 * This method is used to validate Invoice AMount in for exclude/ include
	 * cashback Amount scenario.
	 * 
	 * @param isCashbackAmt
	 * 
	 * @param cashbackDaoResp
	 * @param currentRecord
	 * @param errorList
	 * @return
	 */
	public Boolean validateExcludeCashback(Boolean excludeCashbckFlag, CashbackOfferAddDto currentRecord,
			List<String> errorList) {
		Boolean isValid = true;

		if ((!excludeCashbckFlag)
				&& (currentRecord.getMinInvoiceAmt().compareTo(currentRecord.getMinSwipeAmt()) != 0)) {
			isValid = false;
			errorList.add("Minimum Invoice Amount should be Equal to Minimum Swipe amount @ rowId - "
					+ currentRecord.getRowId() + "");

		}

		return isValid;

	}

	/**
	 * This method will return the CashBack Offer details based on the cashBackId.
	 * 
	 * @param cashBackId
	 * @return CashbackDto
	 */
	@Override
	public ListResponse<CashbackOfferResponseDto> getCashbackOfferDetails(String cashBackId) {

		List<CashbackOfferDetailsDaoExt> cashbackOfferList = cashbackOfferRepo.findMappedOffer(cashBackId);

		if (CollectionUtils.isEmpty(cashbackOfferList))
			throw new ServiceException(PaymentConstants.NO_OFFER_MAPPED_FOR_REQUESTED_ID, PaymentConstants.ERR_PAY_035);

		List<CashbackOfferResponseDto> mappedOfferList = new ArrayList<>();
		cashbackOfferList.forEach(mappedOffer -> {
			CashbackOfferResponseDto productDto = (CashbackOfferResponseDto) MapperUtil.getObjectMapping(mappedOffer,
					new CashbackOfferResponseDto());
			mappedOfferList.add(productDto);
		});

		return new ListResponse<>(mappedOfferList);
	}

	/**
	 * This method will bulk delete offerDetails for mapped cashbackID
	 * 
	 * @param cashBackId
	 */
	@Transactional
	@Override
	public void deleteCashbackOfferDetails(String cashBackId) {
		List<CashbackOfferDetailsDaoExt> mappedRecordList = cashbackOfferRepo.findMappedOffer(cashBackId);
		cashbackOfferRepo.deleteAll(mappedRecordList);
	}

	/**
	 * This method will insert cardDetails into DB
	 * 
	 * @param cardDetailsFileList
	 */

	@Override
	public void addCardDetails(Set<CashbackCardDetailsDaoExt> cardDetailsFileList) {

		SyncStagingDto syncStagingDto = cashbackServiceImp.saveCashbackCardDetails(cardDetailsFileList,
				PaymentOperationCodes.CASHBACK_CARD_DETAILS_ADD);
		syncDataService.publishPaymentMessagesToQueue(syncStagingDto);
	}

	@Transactional
	public SyncStagingDto saveCashbackCardDetails(Set<CashbackCardDetailsDaoExt> cardDetailsFileList,
			String operation) {
		cardDetailsFileList.forEach(cardDetails -> {
			cardDetails.setSrcSyncId(0);
			cardDetails.setDestSyncId(0);
		});
		cashbackCardRepo.saveAll(cardDetailsFileList);
		List<CashbackCardDetailsSyncDtoExt> cashbackCardDetailsSyncDtoExtList = new ArrayList<>();
		cardDetailsFileList.forEach(cashbackCardDetailsDao -> cashbackCardDetailsSyncDtoExtList
				.add(new CashbackCardDetailsSyncDtoExt(cashbackCardDetailsDao)));
		SyncStagingDto cashbackStagingDto = new SyncStagingDto();
		List<SyncData> syncDataList = new ArrayList<>();
		syncDataList.add(DataSyncUtil.createSyncData(cashbackCardDetailsSyncDtoExtList, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest cashbackMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		cashbackStagingDto.setMessageRequest(cashbackMsgRequest);
		String cashbackMsg = MapperUtil.getJsonString(cashbackMsgRequest);
		// saving to staging table
		SyncStaging cashbackSyncStaging = new SyncStaging();
		cashbackSyncStaging.setMessage(cashbackMsg);
		cashbackSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		cashbackSyncStaging = paymentSyncStagingRepository.save(cashbackSyncStaging);
		cashbackStagingDto.setId(cashbackSyncStaging.getId());
		return cashbackStagingDto;
	}
}
