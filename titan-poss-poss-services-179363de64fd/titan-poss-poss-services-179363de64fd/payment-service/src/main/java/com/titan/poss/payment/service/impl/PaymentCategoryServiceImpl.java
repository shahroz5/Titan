/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CATEGORY_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.payment.constants.GiftCardTypeEnum;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.PaymentCategoryDao;
import com.titan.poss.payment.dao.PaymentDao;
import com.titan.poss.payment.dao.PaymentProductDaoExt;
import com.titan.poss.payment.dao.SyncStaging;
import com.titan.poss.payment.dto.InstrumentNumberDto;
import com.titan.poss.payment.dto.PaymentCategoryDto;
import com.titan.poss.payment.dto.PaymentCategorySyncDto;
import com.titan.poss.payment.dto.PaymentProductSyncDtoExt;
import com.titan.poss.payment.dto.request.PaymentCategoryUpdateDto;
import com.titan.poss.payment.dto.request.PaymentProductMappingDto;
import com.titan.poss.payment.dto.response.PaymentProductDto;
import com.titan.poss.payment.repository.PaymentCategoryRepository;
import com.titan.poss.payment.repository.PaymentProductMappingRepositoryExt;
import com.titan.poss.payment.repository.PaymentSyncStagingRepository;
import com.titan.poss.payment.service.PaymentCategoryService;
import com.titan.poss.payment.service.PaymentCommonService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(PAYMENT_CATEGORY_SERVICE_IMPL)
public class PaymentCategoryServiceImpl implements PaymentCategoryService {

	@Autowired
	private PaymentCategoryRepository paymentCategoryRepository;

	@Autowired
	private PaymentProductMappingRepositoryExt paymentProductMappingRepository;

	@Autowired
	private PaymentCommonService paymentUtilService;

	@Autowired
	private PaymentSyncDataServiceImpl syncDataService;

	@Autowired
	private PaymentSyncStagingRepository paymentSyncStagingRepository;

	@Autowired
	private PaymentCategoryServiceImpl paymentCategoryService;

	private static PaymentCategoryDto apply(PaymentCategoryDao paymentCategoryDao) {
		PaymentCategoryDto paymentCategoryDto = (PaymentCategoryDto) MapperUtil.getObjectMapping(paymentCategoryDao,
				new PaymentCategoryDto(), "instrumentNumber");
		if (!StringUtils.isEmpty(paymentCategoryDao.getInstrumentNumber())) {
			JsonData jsonData = MapperUtil.mapObjToClass(paymentCategoryDao.getInstrumentNumber(), JsonData.class);

			paymentCategoryDto.setInstrumentNumberDetails(jsonData);
		}

		paymentCategoryDto.setPaymentCode(paymentCategoryDao.getPayment().getPaymentCode());
		return paymentCategoryDto;
	}

	/**
	 * Gets the all gift cards.
	 *
	 * @param isActive the is active
	 * @param pageable the pageable
	 * @return the all gift cards
	 */
	@Override
	public PagedRestResponse<List<PaymentCategoryDto>> getAllPaymentCategory(String paymentCategoryName,
			Boolean isActive, Pageable pageable) {

		PaymentCategoryDao paymentCategoryCriteria = new PaymentCategoryDao();
		paymentCategoryCriteria.setIsActive(isActive);
		PaymentDao payment = new PaymentDao();
		payment.setPaymentCode("QCGC");
		paymentCategoryCriteria.setPayment(payment);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PaymentCategoryDao> criteria = Example.of(paymentCategoryCriteria, matcher);

		Page<PaymentCategoryDao> paymentCategoryList = paymentCategoryRepository.findConfigName(paymentCategoryName,
				isActive, pageable);

		List<PaymentCategoryDto> paymentCategoryDtoList = paymentCategoryList.stream()
				.map(PaymentCategoryServiceImpl::apply).collect(Collectors.toList());

		return new PagedRestResponse<>(paymentCategoryDtoList, paymentCategoryList);
	}

	/**
	 * Gets the specific gift card.
	 *
	 * @param paymentCategoryName the gift card name
	 * @return the gift card
	 */
	@Override
	public PaymentCategoryDto getPaymentCategory(String paymentCategoryName, Boolean isActive, Pageable pageable) {

		Optional<PaymentCategoryDao> paymentCategoryDao = paymentCategoryRepository.findById(paymentCategoryName);

		if (!paymentCategoryDao.isPresent())
			throw new ServiceException(PaymentConstants.NO_GIFT_CARD_FOUND, PaymentConstants.ERR_PAY_007);

		return PaymentCategoryServiceImpl.apply(paymentCategoryDao.get());

	}

	/**
	 * Creates the gift card.
	 *
	 * @param paymentCategoryDto
	 * @return PaymentCategoryDto
	 */
	@Override
	public PaymentCategoryDto createPaymentCategory(PaymentCategoryDto paymentCategoryDto) {

		Optional<PaymentCategoryDao> paymentCategoryDao = paymentCategoryRepository
				.findById(paymentCategoryDto.getPaymentCategoryName());
		if (paymentCategoryDao.isPresent())
			throw new ServiceException(PaymentConstants.GIFT_CARD_ALREADY_PRESENT, PaymentConstants.ERR_PAY_008);

		validateInstrumentNumber(paymentCategoryDto.getPaymentCategoryName(),
				paymentCategoryDto.getInstrumentNumberDetails());

		if (paymentCategoryDto.getInstrumentType().equalsIgnoreCase(GiftCardTypeEnum.PHYSICAL_CARD.toString()))
			paymentCategoryDto
					.setInstrumentType(GiftCardTypeEnum.valueOfEnum(GiftCardTypeEnum.PHYSICAL_CARD.toString()));
		else
			paymentCategoryDto
					.setInstrumentType(GiftCardTypeEnum.valueOfEnum(GiftCardTypeEnum.EVOUCHER_CARD.toString()));

		PaymentCategoryDao paymentCategory = (PaymentCategoryDao) MapperUtil.getObjectMapping(paymentCategoryDto,
				new PaymentCategoryDao());
		String request = MapperUtil.getJsonString(paymentCategoryDto.getInstrumentNumberDetails());
		paymentCategory.setInstrumentNumber(request);
		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(paymentCategoryDto.getPaymentCode());
		paymentCategory.setPayment(paymentDao);
		paymentCategory.setSrcSyncId(0);
		paymentCategory.setDestSyncId(0);
		SyncStagingDto syncStagingDto = paymentCategoryService.savePaymentCategory(paymentCategory,
				PaymentOperationCodes.PAYMENT_CATEGORY_ADD);
		syncDataService.publishPaymentMessagesToQueue(syncStagingDto);

		return PaymentCategoryServiceImpl.apply(paymentCategory);
	}

	/**
	 * 
	 * @param instrumentNumberDetails
	 */
	private void validateInstrumentNumber(String paymentCategoryName, JsonData instrumentNumberDetails) {

		List<PaymentCategoryDao> paymentCategory = new ArrayList<>();
		List<String> instrumentNoList = new ArrayList<>();
		instrumentNumberDetails.setType("INSTRUMENT_NUMBER_DETAILS");
		String str = MapperUtil.getJsonString(instrumentNumberDetails.getData());
		List<InstrumentNumberDto> instrumentNumberList = MapperUtil.jsonStrToList(str, InstrumentNumberDto.class);
		for (InstrumentNumberDto instrumentNumbers : instrumentNumberList) {
			if (!StringUtils.isEmpty(instrumentNumbers.getInstrumentNo())) {
				checkLength(instrumentNumbers.getInstrumentNo(), instrumentNoList);
				paymentCategory = paymentCategoryRepository.checkForUniqueInstrumentNumber("QCGC",
						instrumentNumbers.getInstrumentNo());
			}
		}
//
//		if (!StringUtils.isEmpty(instrumentNumber)) {
//			if (instrumentNumber.contains(",")) {
//				String[] instrumentNo = instrumentNumber.split(",");
//
//				for (String cardNumber : instrumentNo) {
//
//					checkLength(cardNumber, instrumentNoList);
//					paymentCategory = paymentCategoryRepository.checkForUniqueInstrumentNumber("QCGC", cardNumber);
//				}
//			} else {
//				checkLength(instrumentNumber, instrumentNoList);
//				paymentCategory = paymentCategoryRepository.checkForUniqueInstrumentNumber("QCGC", instrumentNumber);
//			}
//		}
		if (!CollectionUtil.isEmpty(paymentCategory)) {
			boolean isDifferentCatrgory = false;
			for (PaymentCategoryDao paymentCatgeoryDao : paymentCategory) {

				if (!paymentCategoryName.equalsIgnoreCase(paymentCatgeoryDao.getPaymentCategoryName())) {
					isDifferentCatrgory = true;
					break;
				}
			}

			if (isDifferentCatrgory) {
				throw new ServiceException("Card Number series already exists", "ERR-PAY-044",
						"Card Number series already exists for category name & series - " + paymentCategory.stream()
								.collect(Collectors.toMap(PaymentCategoryDao::getPaymentCategoryName,
										PaymentCategoryDao::getInstrumentNumber)));
			}
		}
	}

	/**
	 * 
	 * @param cardNumber
	 */
	private void checkLength(String cardNumber, List<String> instrumentNoList) {

		if (cardNumber.length() != 9) {
			throw new ServiceException("Card Number is invalid length should be 9 digits", "ERR-PAY-045",
					"Card Number is invalid length should be 9 digits for number - " + cardNumber);
		}

		// check if series is unique - i.e, only one occurrence of the serialNo. should
		// be there in list.
		if (instrumentNoList.contains(cardNumber.toUpperCase())) {
			throw new ServiceException("Serial numbers mapped to the payment category should be unique.", "ERR-PAY-027",
					"Serial numbers mapped to the payment category should be unique for number - " + cardNumber);
		} else {
			instrumentNoList.add(cardNumber.toUpperCase());
		}

	}

	/**
	 * @param paymentCategory
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto savePaymentCategory(PaymentCategoryDao paymentCategory, String operation) {
		paymentCategory = paymentCategoryRepository.save(paymentCategory);
		SyncStagingDto pymtCtgryStagingDto = new SyncStagingDto();
		List<SyncData> syncDataList = new ArrayList<>();
		PaymentCategorySyncDto paymentCategorySyncDto = new PaymentCategorySyncDto(paymentCategory);
		syncDataList.add(DataSyncUtil.createSyncData(paymentCategorySyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest pymtCtgryMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		pymtCtgryStagingDto.setMessageRequest(pymtCtgryMsgRequest);
		String pymtCtgryMsg = MapperUtil.getJsonString(pymtCtgryMsgRequest);
		// saving to staging table
		SyncStaging pymtCtgrySyncStaging = new SyncStaging();
		pymtCtgrySyncStaging.setMessage(pymtCtgryMsg);
		pymtCtgrySyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		pymtCtgrySyncStaging = paymentSyncStagingRepository.save(pymtCtgrySyncStaging);
		pymtCtgryStagingDto.setId(pymtCtgrySyncStaging.getId());
		return pymtCtgryStagingDto;
	}

	/**
	 * Updates the gift card.
	 *
	 * @param paymentCategoryName
	 * @param paymentCategoryUpdateDto
	 * @return PaymentCategoryDto
	 */
	@Override
	public PaymentCategoryDto updatePaymentCategory(String paymentCategoryName,
			PaymentCategoryUpdateDto paymentCategoryUpdateDto) {
		Optional<PaymentCategoryDao> paymentCategoryDao = paymentCategoryRepository.findById(paymentCategoryName);

		if (!paymentCategoryDao.isPresent())
			throw new ServiceException(PaymentConstants.NO_GIFT_CARD_FOUND, PaymentConstants.ERR_PAY_007);

		validateInstrumentNumber(paymentCategoryName, paymentCategoryUpdateDto.getInstrumentNumberDetails());

		PaymentCategoryDao paymentCategory = (PaymentCategoryDao) MapperUtil.getObjectMapping(paymentCategoryUpdateDto,
				paymentCategoryDao.get());
		paymentCategory
				.setInstrumentNumber(MapperUtil.getJsonString(paymentCategoryUpdateDto.getInstrumentNumberDetails()));

		if (paymentCategoryUpdateDto.getPaymentCode() != null) {
			PaymentDao paymentDao = new PaymentDao();
			paymentDao.setPaymentCode(paymentCategoryUpdateDto.getPaymentCode());
			paymentCategory.setPayment(paymentDao);
		}
		paymentCategory.setSrcSyncId(paymentCategory.getSrcSyncId() + 1);
		SyncStagingDto syncStagingDto = paymentCategoryService.savePaymentCategory(paymentCategory,
				PaymentOperationCodes.PAYMENT_CATEGORY_UPDATE);
		syncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		return PaymentCategoryServiceImpl.apply(paymentCategory);
	}

	/**
	 * Gets the payment category mapping.
	 *
	 * @param paymentCategoryName
	 * @return List<PaymentProductDto>
	 */
	@Override
	public PagedRestResponse<List<PaymentProductDto>> getPaymentCategoryMapping(String paymentCategoryName,
			Pageable pageable, String productGroup, Boolean isPageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		PaymentCategoryDao paymentCategoryDao = new PaymentCategoryDao();
		paymentCategoryDao.setPaymentCategoryName(paymentCategoryName);

		PaymentProductDaoExt paymentProductDaoExt = new PaymentProductDaoExt();
		paymentProductDaoExt.setPaymentCategoryDao(paymentCategoryDao);
		paymentProductDaoExt.setProductGroupCode(productGroup);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PaymentProductDaoExt> criteria = Example.of(paymentProductDaoExt, matcher);

		Page<PaymentProductDaoExt> paymentProductList = paymentProductMappingRepository
				.findAll(criteria, pageable);

		if (paymentProductList.isEmpty())
			throw new ServiceException(PaymentConstants.NO_MAPPING_FOUND, PaymentConstants.ERR_PAY_009);

		List<PaymentProductDto> paymentProductDtoList = new ArrayList<>();
		paymentProductList.forEach(paymentProductDao -> {
			PaymentProductDto paymentProductDto = (PaymentProductDto) MapperUtil.getObjectMapping(paymentProductDao,
					new PaymentProductDto());
			paymentProductDto
					.setPaymentCategoryName(paymentProductDao.getPaymentCategoryDao().getPaymentCategoryName());
			paymentProductDtoList.add(paymentProductDto);
		});

		return new PagedRestResponse<>(paymentProductDtoList, paymentProductList);
	}

	/**
	 * Add/Update/Remove payment category mapping.
	 *
	 * @param paymentCategoryName
	 * @param paymentProductMappingDto
	 * @return List<PaymentProductDto>
	 */
	@Override
	public List<PaymentProductDto> updatePaymentCategoryMapping(String paymentCategoryName,
			PaymentProductMappingDto paymentProductMappingDto) {
		List<PaymentProductDaoExt> paymentCategoryProductList = new ArrayList<>();
		List<PaymentProductDaoExt> removePaymentProductMapping = new ArrayList<>();
		if (!CollectionUtils.isEmpty(paymentProductMappingDto.getRemoveProductMappingIds())) {
			removePaymentProductMapping = paymentProductMappingRepository
					.findByIdIn(paymentProductMappingDto.getRemoveProductMappingIds());
			removePaymentProductMapping.forEach(paymentProduct -> paymentProduct.setSyncTime(new Date().getTime()));
		}

		if (!CollectionUtils.isEmpty(paymentProductMappingDto.getAddProductGroupCode())) {
			List<PaymentProductDaoExt> getMapping = paymentProductMappingRepository
					.findByPaymentCategoryDaoPaymentCategoryNameAndProductGroupCodeIn(paymentCategoryName,
							paymentProductMappingDto.getAddProductGroupCode());
			Map<String, PaymentProductDaoExt> productMappingMap = new HashMap<>();
			for (PaymentProductDaoExt giftCardProductDao : getMapping)
				productMappingMap.put(giftCardProductDao.getProductGroupCode(), giftCardProductDao);

			paymentProductMappingDto.getAddProductGroupCode().forEach(productGroupCode -> {
				PaymentProductDaoExt paymentProductDao;
				if (!productMappingMap.isEmpty() && productMappingMap.containsKey(productGroupCode)) {
					paymentProductDao = productMappingMap.get(productGroupCode);
				} else {
					paymentProductDao = new PaymentProductDaoExt();
					PaymentCategoryDao paymentCategoryDao = new PaymentCategoryDao();
					paymentCategoryDao.setPaymentCategoryName(paymentCategoryName);
					paymentProductDao.setPaymentCategoryDao(paymentCategoryDao);
					paymentProductDao.setProductGroupCode(productGroupCode);
				}
				paymentProductDao.setSyncTime(new Date().getTime());
				paymentCategoryProductList.add(paymentProductDao);
			});
		}

		SyncStagingDto syncStagingDto = paymentCategoryService.saveAndDeletePaymentProduct(paymentCategoryProductList,
				removePaymentProductMapping, PaymentOperationCodes.PAYMENT_CATEGORY_PRODUCT);
		if (syncStagingDto != null)
			syncDataService.publishPaymentMessagesToQueue(syncStagingDto);

		return paymentUtilService.getPaymentProductDtoMapping(paymentCategoryProductList);
	}

	/**
	 * @param paymentCategoryProductList
	 * @param removePaymentProductMapping
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto saveAndDeletePaymentProduct(List<PaymentProductDaoExt> paymentCategoryProductList,
			List<PaymentProductDaoExt> removePaymentProductMapping, String operation) {

		List<SyncData> syncDataList = new ArrayList<>();
		PaymentProductSyncDtoExt syncDto = new PaymentProductSyncDtoExt();
		if (!removePaymentProductMapping.isEmpty()) {
			paymentProductMappingRepository.deleteAll(removePaymentProductMapping);
			syncDataList.add(DataSyncUtil.createSyncData(syncDto.getSyncDtoList(removePaymentProductMapping), 0));
		}

		if (!paymentCategoryProductList.isEmpty()) {
			paymentCategoryProductList = paymentProductMappingRepository.saveAll(paymentCategoryProductList);
			syncDataList.add(DataSyncUtil.createSyncData(syncDto.getSyncDtoList(paymentCategoryProductList), 1));
		}
		SyncStagingDto paymentPrdtStagingDto = new SyncStagingDto();
		if (!syncDataList.isEmpty()) {
			List<String> destinations = new ArrayList<>();
			MessageRequest paymentPrdtMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation,
					destinations, MessageType.GENERAL.toString(), DestinationType.ALL.toString());
			paymentPrdtStagingDto.setMessageRequest(paymentPrdtMsgRequest);
			String paymentPrdtMsg = MapperUtil.getJsonString(paymentPrdtMsgRequest);
			// saving to staging table
			SyncStaging payeeBankSyncStaging = new SyncStaging();
			payeeBankSyncStaging.setMessage(paymentPrdtMsg);
			payeeBankSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			payeeBankSyncStaging = paymentSyncStagingRepository.save(payeeBankSyncStaging);
			paymentPrdtStagingDto.setId(payeeBankSyncStaging.getId());

		}
		return paymentPrdtStagingDto;
	}

	@Override
	public PaymentCategoryDto tempUpdate(String paymentCategoryName) {
		Optional<PaymentCategoryDao> paymentCategoryDao = paymentCategoryRepository.findById(paymentCategoryName);
		if (!StringUtils.isEmpty(paymentCategoryDao.get().getInstrumentNumber())) {
			if (paymentCategoryDao.get().getInstrumentNumber().contains(",")) {
				String[] instrumentNo = paymentCategoryDao.get().getInstrumentNumber().split(",");

				List<InstrumentNumberDto> instNoDto = new ArrayList<>();
				for (String cardNumber : instrumentNo) {
					InstrumentNumberDto obj = new InstrumentNumberDto(cardNumber,true);
					
					instNoDto.add(obj);					
				}
				paymentCategoryDao.get().setInstrumentNumber(MapperUtil.getStringFromJson(new JsonData("INSTRUMENT_NUMBER_DETAILS", instNoDto)));
				paymentCategoryRepository.save(paymentCategoryDao.get());
			}
			
		}	
		return null;
	}

}