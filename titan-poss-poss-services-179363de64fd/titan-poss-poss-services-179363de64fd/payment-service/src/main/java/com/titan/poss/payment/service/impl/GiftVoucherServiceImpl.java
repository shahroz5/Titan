/*
 *  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.GIFT_VOUCHER_SERVICE_IMPL;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.GVDetailsReqDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GiftDetailsDto;
import com.titan.poss.core.dto.GiftDetailsResponseDto;
import com.titan.poss.core.dto.GiftStatusDto;
import com.titan.poss.core.dto.GiftStatusRequestDto;
import com.titan.poss.core.dto.GiftStatusResponseDto;
import com.titan.poss.core.dto.GiftValidityDto;
import com.titan.poss.core.dto.GiftValidityRequestDto;
import com.titan.poss.core.dto.GiftValidityResponseDto;
import com.titan.poss.core.dto.GiftVoucherRedeemDetailsDto;
import com.titan.poss.core.enums.GiftVoucherStatusEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.LegacyGVResponse;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.GiftMasterDao;
import com.titan.poss.payment.dto.GiftErrorDto;
import com.titan.poss.payment.repository.GiftVoucherRepository;
import com.titan.poss.payment.service.GiftVoucherService;
import com.titan.poss.payment.service.PaymentCommonService;
import com.titan.poss.payment.util.GiftStatusUtil;
import com.titan.poss.payment.util.PaymentCommonUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(GIFT_VOUCHER_SERVICE_IMPL)
public class GiftVoucherServiceImpl implements GiftVoucherService {

	@Autowired
	GiftVoucherRepository giftVoucherRepository;

	@Autowired
	PaymentCommonService paymentUtilService;

	@Autowired
	IntegrationServiceClient integrationService;

	/**
	 * This method will return the list of all gift voucher details or based on the
	 * serialNumber, seriesOfSerialNumber or listOfStatus
	 *
	 * @param serialNo
	 * @param giftStatusList
	 * @param pageable
	 * @return PagedRestResponse<List < GiftDetailsResponseDto>>
	 **/
	@Override
	public PagedRestResponse<List<GiftDetailsResponseDto>> listGiftDetails(String serialNo, List<String> giftStatusList,
			Pageable pageable) {
		Page<GiftMasterDao> giftVoucherDao = null;
		List<BigInteger> serialNumber = null;
		List<String> serialNumberList = new ArrayList<>();
		if (serialNo != null && serialNo.contains(Character.toString('-'))) {
			serialNumber = paymentUtilService.getSerialNumberList(serialNo);
			giftVoucherDao = giftVoucherRepository.findGiftVoucherDetails(serialNumber.get(0), serialNumber.get(1),
					giftStatusList, pageable);
		} else if (serialNo != null && serialNo.contains(Character.toString(','))) {
			serialNumberList = Arrays.stream(serialNo.split(Character.toString(','))).map(String::trim)
					.collect(Collectors.toList());
//			serialNumber = serialNumberList.stream().map(gv -> BigInteger.valueOf(Long.parseLong(gv)))
//					.collect(Collectors.toList());
			serialNumber = new ArrayList<>();
			for (String gv : serialNumberList) {
				serialNumber.add(BigInteger.valueOf(Long.parseLong(gv)));
			}
			giftVoucherDao = giftVoucherRepository.findGiftVoucherDetails(serialNumber, giftStatusList, pageable);
		} else {
			if (serialNo != null)
				giftVoucherDao = giftVoucherRepository
						.findGiftVoucher(BigInteger.valueOf(Long.parseLong(serialNo.trim())), giftStatusList, pageable);
			else {
				giftVoucherDao = giftVoucherRepository.findGiftVoucher(null, giftStatusList, pageable);
			}
		}
//		if (giftVoucherDao == null || giftVoucherDao.isEmpty()) {
//			throw new ServiceException("No GIft Voucher is present for the given input", "ERR-PAY-046");
//		}
		List<GiftDetailsResponseDto> giftDetailsResponseDtoList = new ArrayList<>();

		giftVoucherDao.forEach(giftVoucher -> {
			GiftDetailsResponseDto giftDetailsResponseDto = (GiftDetailsResponseDto) MapperUtil
					.getObjectMapping(giftVoucher, new GiftDetailsResponseDto());
			if (giftVoucher.getExcludes() != null) {
				giftDetailsResponseDto.setExcludes(Arrays.stream(
						giftVoucher.getExcludes().replace("'", "").replace("[", "").replace("]", "").trim().split("/"))
						.collect(Collectors.toList()));
			}
			if (giftVoucher.getGiftDetails() != null) {
				giftDetailsResponseDto.setGiftDetails(MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(giftVoucher.getGiftDetails()), GiftDetailsDto.class));
			}
			if (giftVoucher.getRedeemDetails() != null) {
				giftDetailsResponseDto.setGiftVoucherRedeemDetails(MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(giftVoucher.getRedeemDetails()),
						GiftVoucherRedeemDetailsDto.class));
			}
			giftDetailsResponseDtoList.add(giftDetailsResponseDto);
		});
		return (new PagedRestResponse<>(giftDetailsResponseDtoList, giftVoucherDao));
	}

	/**
	 * This method will extend the validity
	 *
	 * @param giftValidity
	 * @return ListResponse<GiftValidityResponseDto>
	 */
	@Override
	@Transactional
	public ListResponse<GiftValidityResponseDto> updateGiftValidity(GiftValidityRequestDto giftValidity) {

		List<GiftMasterDao> validGiftMasterList = new ArrayList<>();
		List<GiftValidityDto> invalidGiftMasterList = new ArrayList<>();

		Map<BigInteger, Date> giftValidityMap = giftValidity.getGiftValidity().stream()
				.collect(Collectors.toMap(GiftValidityDto::getSerialNo, GiftValidityDto::getValidTill));

		List<GiftMasterDao> giftMasterDao = getGiftDetailsBySerialNo(giftValidityMap.keySet());

		giftMasterDao.forEach(giftMaster -> {
			if (giftMaster.getStatus().equalsIgnoreCase(GiftVoucherStatusEnum.REDEEMABLE.name()) && PaymentCommonUtil
					.dateValidation(giftValidityMap.get(giftMaster.getSerialNo()), giftMaster.getValidFrom())) {
				giftMaster.setRemarks(giftValidity.getRemarks());
				giftMaster.setValidTill(giftValidityMap.get(giftMaster.getSerialNo()));
				giftMaster.setExtendCount(giftMaster.getExtendCount() + 1);
				giftMaster.setValidityDays(
						(PaymentCommonUtil.dateDifference(giftMaster.getValidTill(), giftMaster.getValidFrom()))
								.intValue());
				validGiftMasterList.add(giftMaster);
			} else {
				invalidGiftMasterList.add(invalidData(giftMaster, giftValidityMap));
			}
		});

		if (invalidGiftMasterList.isEmpty()) {
			List<GiftMasterDao> giftMasterDaoList = giftVoucherRepository.saveAll(validGiftMasterList);
			return new ListResponse<>(giftMasterDaoList.stream()
					.map(giftVoucherResponse -> (GiftValidityResponseDto) MapperUtil
							.getObjectMapping(giftVoucherResponse, new GiftValidityResponseDto()))
					.collect(Collectors.toList()));
		} else {
			throw new ServiceException(PaymentConstants.INVALID_DATE_TO_UPDATE, PaymentConstants.ERR_PAY_020,
					invalidGiftMasterList);
		}

	}

	/**
	 * 
	 * @param giftMaster
	 * @param giftValidityMap
	 * @return GiftValidityDto
	 */
	private GiftValidityDto invalidData(GiftMasterDao giftMaster, Map<BigInteger, Date> giftValidityMap) {
		GiftValidityDto giftError = new GiftValidityDto();
		giftError.setSerialNo(giftMaster.getSerialNo());
		giftError.setValidTill(giftValidityMap.get(giftMaster.getSerialNo()));
		return giftError;
	}

	/**
	 * This method will update the status of the gift voucher
	 *
	 * @param giftStatus
	 * @return ListResponse<GiftStatusResponseDto>
	 */
	@Override
	// @Transactional
	public ListResponse<GiftStatusResponseDto> updateGiftStatus(GiftStatusRequestDto giftStatus) {

		List<GiftMasterDao> validGiftMasterList = new ArrayList<>();
		List<GiftErrorDto> invalidGiftMasterList = new ArrayList<>();
		List<BigInteger> serialNoListToUpdate = new ArrayList<>();
		List<BigInteger> serialNoPresent = new ArrayList<>();
		giftStatus.getGiftVoucherStatus().forEach(giftVoucher -> serialNoListToUpdate.add(giftVoucher.getSerialNo()));
		Map<BigInteger, String> giftStatusMap = giftStatus.getGiftVoucherStatus().stream()
				.collect(Collectors.toMap(GiftStatusDto::getSerialNo, GiftStatusDto::getStatus));
		List<GiftMasterDao> giftMasterDaoList = getGiftDetailsBySerialNo(giftStatusMap.keySet());
		giftMasterDaoList.forEach(giftMasterDao -> serialNoPresent.add(giftMasterDao.getSerialNo()));
		serialNoListToUpdate.forEach(serialNo -> {
			if (!serialNoPresent.contains(serialNo)) {
				invalidGiftMasterList.add(getGiftErrorDtoForSerialNoNotPresent(serialNo));
			}
		});
		if (Boolean.TRUE.equals(CommonUtil.isAStoreUser())) {
			giftMasterDaoList.forEach(giftMaster -> {
				if (giftMaster.getStatus().equalsIgnoreCase(GiftVoucherStatusEnum.REDEEMABLE.name())
						|| giftMaster.getStatus().equalsIgnoreCase(GiftVoucherStatusEnum.REDEEMED.name())) {
					performCheckOnLegacy(giftMaster, giftStatusMap);
					giftMaster.setStatus(giftStatusMap.get(giftMaster.getSerialNo()));
					validGiftMasterList.add(giftMaster);
				} else {
					invalidGiftMasterList.add(getGiftErrorDto(giftMaster));
				}

			});
		} else if (Boolean.TRUE.equals(CommonUtil.isALegacyUser())) {
			giftMasterDaoList.forEach(giftMaster -> {
				if (giftMaster.getStatus().equalsIgnoreCase(GiftVoucherStatusEnum.REDEEMABLE.name())) {
					giftMaster.setStatus(giftStatusMap.get(giftMaster.getSerialNo()));
					validGiftMasterList.add(giftMaster);
				} else {
					invalidGiftMasterList.add(getGiftErrorDto(giftMaster));
				}

			});
		} else {
			updateGiftStatusForOtherUsers(validGiftMasterList, invalidGiftMasterList, giftStatusMap, giftMasterDaoList,
					giftStatus);
		}
		if (Boolean.TRUE.equals(CommonUtil.isALegacyUser())) {
			if (invalidGiftMasterList.isEmpty()) {
				return saveGiftDetailsToDB(validGiftMasterList);
			} else {
				saveGiftDetailsToDB(validGiftMasterList);
				invalidRecordException(invalidGiftMasterList);
			}

		} else {
			if (invalidGiftMasterList.isEmpty())
				return saveGiftDetailsToDB(validGiftMasterList);
			else
				invalidRecordException(invalidGiftMasterList);
		}
		return new ListResponse<>();
	}

	private GiftErrorDto getGiftErrorDtoForSerialNoNotPresent(BigInteger serialNo) {
		GiftErrorDto giftErrorDto = new GiftErrorDto();
		giftErrorDto.setSerialNo(serialNo);
		giftErrorDto.setStatus("No Gift Voucher Present for this serial No");
		return giftErrorDto;
	}

	private void updateGiftStatusForOtherUsers(List<GiftMasterDao> validGiftMasterList,
			List<GiftErrorDto> invalidGiftMasterList, Map<BigInteger, String> giftStatusMap,
			List<GiftMasterDao> giftMasterDaoList, GiftStatusRequestDto giftStatus) {
		giftMasterDaoList.forEach(giftMaster -> {
			if (giftMaster.getStatus().toUpperCase().equalsIgnoreCase(GiftVoucherStatusEnum.FOR_INWARDING.name())
					|| giftMaster.getStatus().toUpperCase().equalsIgnoreCase(GiftVoucherStatusEnum.REDEEMABLE.name())
					|| giftMaster.getStatus().toUpperCase().equalsIgnoreCase(GiftVoucherStatusEnum.EXPIRED.name())
					|| giftMaster.getStatus().toUpperCase().equalsIgnoreCase(GiftVoucherStatusEnum.BLOCKED.name())) {
				List<GiftVoucherStatusEnum> listOfStatus = getListOfStatus(giftMaster.getStatus());
				if (listOfStatus.contains(GiftVoucherStatusEnum.valueOf(giftStatusMap.get(giftMaster.getSerialNo())))) {
					giftMaster.setRemarks(giftStatus.getRemarks());
					giftMaster.setStatus(giftStatusMap.get(giftMaster.getSerialNo()));
					if (giftStatus.getGiftVoucherRedeemDetails() != null) {
						giftMaster.setRedeemDetails(MapperUtil.getJsonString(giftStatus.getGiftVoucherRedeemDetails()));
					}

					validGiftMasterList.add(giftMaster);
				} else {
					invalidGiftMasterList.add(getGiftErrorDto(giftMaster));
				}
			} else {
				invalidGiftMasterList.add(getGiftErrorDto(giftMaster));
			}
		});

	}

	/**
	 * 
	 * @param giftMaster
	 * @param giftStatusMap
	 */
	public void performCheckOnLegacy(GiftMasterDao giftMaster, Map<BigInteger, String> giftStatusMap) {

		if (giftStatusMap.get(giftMaster.getSerialNo()).equalsIgnoreCase(GiftVoucherStatusEnum.REDEEMED.name())) {
			GVRequestDto gvRequest = getLegacyDto(giftMaster);
			Object obj = integrationService.getGiftVoucher(gvRequest);
			ObjectMapper mapper=new ObjectMapper();
			List<LegacyGVResponse> giftVoucherUpdate=mapper.convertValue(obj, new TypeReference<List<LegacyGVResponse>>() {
			});
			for (LegacyGVResponse gvStatusDto : giftVoucherUpdate) {
				if ("GV Not Found".equalsIgnoreCase(gvStatusDto.getRemark())|| !Integer.valueOf("2").equals(gvStatusDto.getStatus())) {
					Optional<GiftVoucherStatusEnum> status=GiftStatusUtil.getStatusdetails().entrySet().stream()
							.filter(entry -> gvStatusDto.getStatus().equals(entry.getKey())).map(Map.Entry::getValue)
							.findFirst();
					throw new ServiceException("GV isn't available for redemption, status: {status} , remark: {remark}",
							"ERR-PAY-048",
							"Status of Gv is :" + GiftStatusUtil.getStatusdetails().get(gvStatusDto.getStatus()),
							Map.of("status", status.isPresent() ? status.get().name() : null, "remark",
									org.springframework.util.StringUtils.isEmpty(gvStatusDto.getRemark()) ? "NA"
											: gvStatusDto.getRemark())) {
					};
				}
			}
			
		}

	}

	private GVRequestDto getLegacyDto(GiftMasterDao giftMaster) {
		GVRequestDto gvRequest = new GVRequestDto();
		List<GVDetailsReqDto> giftVoucherStatus = new ArrayList<>();
		GVDetailsReqDto gvStatus = new GVDetailsReqDto();
		gvStatus.setItemCode(giftMaster.getGiftCode());
		gvStatus.setSerialNo(giftMaster.getSerialNo());
		giftVoucherStatus.add(gvStatus);
		gvRequest.setGvDetails(giftVoucherStatus);
		return gvRequest;
	}

	/**
	 * This method will save the data into the db and dto mapping
	 * 
	 * @param giftMasterDaoList
	 * @return ListResponse<GiftStatusResponseDto>
	 */
	private ListResponse<GiftStatusResponseDto> saveGiftDetailsToDB(List<GiftMasterDao> giftMasterDaoList) {

		List<GiftMasterDao> giftMasterDao = giftVoucherRepository.saveAll(giftMasterDaoList);
		return new ListResponse<>(giftMasterDao
				.stream().map(giftVoucherResponse -> (GiftStatusResponseDto) MapperUtil
						.getObjectMapping(giftVoucherResponse, new GiftStatusResponseDto()))
				.collect(Collectors.toList()));
	}

	/**
	 * This will give the gift details by serial no.
	 * 
	 * @param serialNumbers
	 * @return List<GiftMasterDao>
	 */
	private List<GiftMasterDao> getGiftDetailsBySerialNo(Set<BigInteger> serialNumbers) {

		return giftVoucherRepository.findBySerialNoIn(serialNumbers);
	}

	/**
	 * It will throw the exception when data is wrong.
	 * 
	 * @param invalidGiftMasterList
	 */
	private void invalidRecordException(List<GiftErrorDto> invalidGiftMasterList) {
		throw new ServiceException(PaymentConstants.INVALID_STATUS_TO_UPDATE, PaymentConstants.ERR_PAY_019,
				invalidGiftMasterList);
	}

	/**
	 * This will create gift error dto
	 * 
	 * @param giftMaster
	 * @return GiftErrorDto
	 */
	private GiftErrorDto getGiftErrorDto(GiftMasterDao giftMaster) {

		GiftErrorDto giftErrorDto = new GiftErrorDto();
		giftErrorDto.setSerialNo(giftMaster.getSerialNo());
		giftErrorDto.setStatus(giftMaster.getStatus());
		giftErrorDto.setUpdatableStaus(getListOfStatus(giftMaster.getStatus()));
		return giftErrorDto;
	}

	/**
	 * This will give the list of applicable status.
	 * 
	 * @param status
	 * @return
	 */
	private List<GiftVoucherStatusEnum> getListOfStatus(String status) {

		return GiftStatusUtil.getGiftupdatestatus().get(GiftVoucherStatusEnum.valueOf(status.toUpperCase()));
	}

}
