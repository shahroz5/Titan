/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.RefundRequestStatusEnum;
import com.titan.poss.core.domain.constant.RefundSubTxnTypeEnum;
import com.titan.poss.core.domain.constant.RefundTypeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.enums.DateEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.RefundRequestDaoExt;
import com.titan.poss.sales.dto.RoChequeRefundDto;
import com.titan.poss.sales.dto.RoRTGSRefundDto;
import com.titan.poss.sales.dto.request.RefundListRequestDto;
import com.titan.poss.sales.dto.request.RefundRequestCreateDto;
import com.titan.poss.sales.dto.request.RefundUpdateRequestDto;
import com.titan.poss.sales.dto.response.RefundCreateResponseDto;
import com.titan.poss.sales.dto.response.RefundResponseDto;
import com.titan.poss.sales.dto.response.RefundUpdateResponseDto;
import com.titan.poss.sales.repository.RefundRequestRepositoryExt;
import com.titan.poss.sales.service.RefundService;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("refundService")
public class RefundServiceImpl implements RefundService {

	@Autowired
	private RefundRequestRepositoryExt refundRequestRepository;

	@Autowired
	private SalesIntegrationServiceImpl salesIntegrationServiceImpl;

	private static final String TYPE = "TEP_REFUND_DETAILS";

	private static final String IS_EPOSS_APP = "isEpossApp {}";

	@Override
	@Transactional
	public RefundCreateResponseDto createRefundRequest(String txnType, RefundRequestCreateDto refundRequestDto) {
		boolean isEpossApp = CommonUtil.isEpossApp();
		RefundCreateResponseDto refundCreateResponseDto = null;
		log.debug(IS_EPOSS_APP, isEpossApp);
		if (isEpossApp) {
			refundCreateResponseDto = createRequest(txnType, refundRequestDto);
		} else {
			refundCreateResponseDto = callEpossCreateRefundRequest(txnType, refundRequestDto);
		}
		return refundCreateResponseDto;
	}

	private RefundCreateResponseDto callEpossCreateRefundRequest(String txnType,
			RefundRequestCreateDto refundRequestDto) {
		refundRequestDto.setDocDate(CalendarUtils.addOffSetTimeZone(refundRequestDto.getDocDate()));
		Map<String, String> reqParams = Map.of(SalesUtil.REFUND_REQUEST_TXN_TYPE, txnType);
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.POST,
				SalesUtil.CREATE_REFUND_REQUEST_EPOSS_URL, reqParams, refundRequestDto);
		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				RefundCreateResponseDto.class);
	}

	private RefundCreateResponseDto createRequest(String txnType, RefundRequestCreateDto refundRequestDto) {
		RefundRequestDaoExt refundRequest = (RefundRequestDaoExt) MapperUtil.getDtoMapping(refundRequestDto,
				RefundRequestDaoExt.class);
		refundRequest.setTxnType(txnType);
		refundRequest.setHeaderData(MapperUtil.getStringFromJson(refundRequestDto.getHeaderData()));
		refundRequest.setRequestData(MapperUtil.getStringFromJson(refundRequestDto.getRequestData()));
		refundRequest.setApprovedData(MapperUtil.getStringFromJson(refundRequestDto.getRequestData()));
		refundRequest.setStatus(RefundRequestStatusEnum.APPROVAL_PENDING.toString());
		refundRequest.setLocationCode(CommonUtil.getLocationCode());
		refundRequest = refundRequestRepository.save(refundRequest);
		RefundCreateResponseDto refundResponseDto = (RefundCreateResponseDto) MapperUtil.getDtoMapping(refundRequest,
				RefundCreateResponseDto.class);
		refundResponseDto.setRequestData(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(refundRequest.getRequestData()), JsonData.class));
		return refundResponseDto;
	}

	@Override
	public PagedRestResponse<List<RefundResponseDto>> listRefundRequest(String txnType,
			RefundListRequestDto refundListRequestDto, Pageable pageable) {
		PagedRestResponse<List<RefundResponseDto>> refundResponseObj = null;
		boolean isEpossApp = CommonUtil.isEpossApp();
		log.debug(IS_EPOSS_APP, isEpossApp);
		if (isEpossApp) {
			refundResponseObj = listRefund(txnType, refundListRequestDto, pageable);
		} else {
			refundResponseObj = callEpossListRefundRequest(txnType, refundListRequestDto,pageable);
		}
		return refundResponseObj;
	}

	@SuppressWarnings("unchecked")
	private PagedRestResponse<List<RefundResponseDto>> callEpossListRefundRequest(String txnType,
			RefundListRequestDto refundListRequestDto, Pageable pageable) {
		Map<String, String> reqParams = new HashMap<>();
		reqParams.put(SalesUtil.REFUND_REQUEST_TXN_TYPE, txnType);
		reqParams.put("page", String.valueOf(pageable.getPageNumber()));
		reqParams.put("size", String.valueOf(pageable.getPageSize()));
		pageable.getSort().forEach(sort -> reqParams.put("sort", sort.toString().replace(": ", ",")));
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.POST,
				SalesUtil.CREATE_REFUND_REQUEST_EPOSS_URL + "/list", reqParams, refundListRequestDto);
		log.debug("eposs api response : {}", epossApiResponseDto);
		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				PagedRestResponse.class);
	}

	/**
	 * @param status
	 * @param txnType
	 * @param refundListDto
	 * @param pageable
	 * @return
	 */
	private PagedRestResponse<List<RefundResponseDto>> listRefund(String txnType, RefundListRequestDto refundListDto,
			Pageable pageable) {
		List<RefundResponseDto> refundResponseList = new ArrayList<>();
		Date startingDate = new Date();
		Date endingDate = new Date();
		startingDate = getStartDateBasedOnInput(refundListDto.getDateRangeType(), refundListDto.getStartDate(),
				refundListDto.getEndDate(), startingDate);
		if (DateEnum.CUSTOM.toString().equals(refundListDto.getDateRangeType())) {
			endingDate = refundListDto.getEndDate();
		}
		if (startingDate.compareTo(endingDate) > 0) {
			throw new ServiceException("Start date should be lesser than end date", "ERR-SALE-307");
		}
		List<String> statusList = getRefundStatus(refundListDto.getStatus(),refundListDto.getRefundType());
		List<String> subTxnList = getSubTxnType(refundListDto.getSubTxnType());
		Page<RefundRequestDaoExt> refundRequestPageObject = refundRequestRepository.listStockTransactionIssueHistory(
				txnType, refundListDto.getDocNo(), refundListDto.getLocationCode(), startingDate, endingDate,
				statusList, refundListDto.getFiscalYear(), refundListDto.getRefundType(), subTxnList, pageable);
		refundRequestPageObject.forEach(record -> {
			RefundResponseDto refundResponse = getRefundResponseObj(record);
			refundResponseList.add(refundResponse);
		});
		return new PagedRestResponse<>(refundResponseList, refundRequestPageObject);
	}

	private RefundResponseDto getRefundResponseObj(RefundRequestDaoExt record) {
		RefundResponseDto refundResponse = (RefundResponseDto) MapperUtil.getDtoMapping(record,
				RefundResponseDto.class);
		refundResponse.setHeaderData(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(record.getHeaderData()), JsonData.class));
		refundResponse.setApprovedData(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(record.getApprovedData()), JsonData.class));
		return refundResponse;
	}

	private List<String> getRefundStatus(String status,String refundType) {
		List<String> statusList = new ArrayList<>();
		if (StringUtils.isEmpty(status)) {
			statusList = RefundRequestStatusEnum.getAllStatuses();
			//if(RefundTypeEnum.RTGS.name().equals(refundType))
			statusList.remove(RefundRequestStatusEnum.APPROVAL_PENDING.name());
		} else {
			statusList.add(status);
		}
		
		return statusList;
	}

	private List<String> getSubTxnType(String subTxnType) {
		List<String> subTxnList = new ArrayList<>();
		if (StringUtils.isEmpty(subTxnType)) {
			subTxnList = RefundSubTxnTypeEnum.getAllRefundSubTxnType();
		} else {
			subTxnList.add(subTxnType);
		}
		return subTxnList;
	}

	private Date getStartDateBasedOnInput(String dateRangeType, Date startDate, Date endDate, Date startingDate) {
		if (DateEnum.TODAY.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.getTodayStartDateAndTime();
		} else if (DateEnum.LAST_WEEK.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, -1, null, null);
		} else if (DateEnum.LAST_MONTH.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, -1, null);
		} else if (DateEnum.LAST_YEAR.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, null, -1);
		} else if (DateEnum.CUSTOM.toString().equals(dateRangeType)) {
			if (startDate == null || endDate == null) {
				throw new ServiceException("Start date & end date cannot be null", "ERR-CORE-052");
			}
			startingDate = startDate;
		}
		return startingDate;
	}

	@Override
	public RefundResponseDto getRefundRequest(String id, String txnType) {
		RefundResponseDto refundDto = null;
		boolean isEpossApp = CommonUtil.isEpossApp();
		log.debug(IS_EPOSS_APP, isEpossApp);
		if (isEpossApp) {
			refundDto = getRefundRequestResponse(id, txnType);
		} else {
			refundDto = callEpossGetRefundRequest(id, txnType);
		}
		return refundDto;
	}

	private RefundResponseDto callEpossGetRefundRequest(String id, String txnType) {
		Map<String, String> reqParams = Map.of(SalesUtil.REFUND_REQUEST_TXN_TYPE, txnType);
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.GET,
				SalesUtil.CREATE_REFUND_REQUEST_EPOSS_URL + "/" + id, reqParams, null);
		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				RefundResponseDto.class);
	}

	private RefundRequestDaoExt getRefundRequestDaoObject(String id, String txnType) {
		RefundRequestDaoExt refundDao = refundRequestRepository.findByIdAndTxnType(id, txnType);
		if (refundDao == null) {
			throw new ServiceException("Record not found", "ERR-SALE-303");
		}
		return refundDao;
	}

	@Override
	@Transactional
	public RefundUpdateResponseDto updateRefundRequest(String id, String status, String txnType,
			RefundUpdateRequestDto refundUpdateRequest) {
		boolean isEpossApp = CommonUtil.isEpossApp();
		log.debug(IS_EPOSS_APP, isEpossApp);
		RefundRequestDaoExt refundRequestDao = null;
		if (isEpossApp) {
			refundRequestDao = updateRequest(id, status, txnType, refundUpdateRequest);
		} else {
			refundRequestDao = callEpossUpdateRefundRequest(id, status, txnType, refundUpdateRequest);
		}
		return (RefundUpdateResponseDto) MapperUtil.getDtoMapping(refundRequestDao, RefundUpdateResponseDto.class);
	}

	private RefundRequestDaoExt callEpossUpdateRefundRequest(String id, String status, String txnType,
			RefundUpdateRequestDto refundUpdateRequest) {
		Map<String, String> reqParams = Map.of(SalesUtil.REFUND_REQUEST_TXN_TYPE, txnType,
				SalesUtil.REFUND_REQUEST_STATUS, status);
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.PUT,
				SalesUtil.CREATE_REFUND_REQUEST_EPOSS_URL + "/" + id, reqParams, refundUpdateRequest);
		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				RefundRequestDaoExt.class);
	}

	/**
	 * @param id
	 * @param status
	 * @param refundUpdateRequest
	 * @return
	 */
	private RefundRequestDaoExt updateRequest(String id, String status, String txnType,
			RefundUpdateRequestDto refundUpdateRequest) {
		RefundRequestDaoExt refundRequestDao = getRefundRequestDaoObject(id, txnType);
		validateStatus(status, refundRequestDao);
		if(!RefundRequestStatusEnum.REJECTED.name().equals(status))
			validateApprovedData(refundUpdateRequest.getApprovedData(), refundRequestDao);
		refundRequestDao.setStatus(status);
		if (!StringUtils.isEmpty(refundUpdateRequest.getApprovedData())) {
			refundRequestDao.setApprovedData(MapperUtil.getJsonString(refundUpdateRequest.getApprovedData()));
			refundRequestDao.setApprovedDateTime(CalendarUtils.getCurrentDate());
			refundRequestDao.setApproverName(CommonUtil.getUserName());
		}
		refundRequestDao = refundRequestRepository.save(refundRequestDao);
		return refundRequestDao;
	}

	private void validateStatus(String status, RefundRequestDaoExt refundRequestDao) {
		
//		if (status.contains(refundRequestDao.getStatus())) {
//			throw new ServiceException("Same status cannot be updated", "ERR-SALE-437");
//		}
//		
		List<String> nextStatusList = RefundRequestStatusEnum.getNextStatus(refundRequestDao.getStatus());
		if (!nextStatusList.contains(status)) {
			throw new ServiceException(" status cannot be updated", "ERR-SALE-432",Map.of("status", status));
		}
	}

	private void validateApprovedData(JsonData approvedData, RefundRequestDaoExt refundRequestDao) {
		if (!StringUtils.isEmpty(approvedData)) {
			if (!TYPE.equals(approvedData.getType())) {
				throw new ServiceException(SalesConstants.JSON_TYPE_MISMATCH, SalesConstants.ERR_CORE_014);
			}
			if (RefundTypeEnum.CHEQUE.toString().equals(refundRequestDao.getRefundType())) {
				RoChequeRefundDto roChequeRefund = new RoChequeRefundDto();
				roChequeRefund.validate(approvedData.getData());
			} else if (RefundTypeEnum.RTGS.toString().equals(refundRequestDao.getRefundType())) {
				RoRTGSRefundDto roRtgsRefundDto = new RoRTGSRefundDto();
				roRtgsRefundDto.validate(approvedData.getData());
			} else {
				throw new ServiceException("JSON type mismatch", "ERR-CORE-014");
			}
		}
	}

	private RefundResponseDto getRefundRequestResponse(String id, String txnType) {
		RefundRequestDaoExt refundRequestDao = getRefundRequestDaoObject(id, txnType);
		RefundResponseDto refundDto = (RefundResponseDto) MapperUtil.getDtoMapping(refundRequestDao,
				RefundResponseDto.class);
		refundDto.setApprovedData(MapperUtil.getJsonFromString(refundRequestDao.getApprovedData()));
		refundDto.setHeaderData(MapperUtil.getJsonFromString(refundRequestDao.getHeaderData()));
		return refundDto;
	}

	@Override
	public RefundUpdateResponseDto cancelRefundRequest(String refTxnId, String txnType) {
		RefundUpdateResponseDto refundUpdateResponseDto = null;
		boolean isEpossApp = CommonUtil.isEpossApp();
		log.debug(IS_EPOSS_APP, isEpossApp);
		if (isEpossApp) {
			refundUpdateResponseDto = cancelRequest(refTxnId, txnType);
		} else {
			refundUpdateResponseDto = callEpossCancelRequest(refTxnId, txnType);
		}
		return refundUpdateResponseDto;
	}

	/**
	 * @param refTxnId
	 * @param txnType
	 * @return
	 */
	private RefundUpdateResponseDto cancelRequest(String refTxnId, String txnType) {
		RefundRequestDaoExt refundRequestDao = refundRequestRepository.findByRefTxnIdAndTxnType(refTxnId, txnType);
		if (refundRequestDao == null) {
			throw new ServiceException("Record not found", "ERR-SALE-303");
		}
		// if the status is not ALLOWED_TO_CANCEL, REJECTED or APPROVAL_PENDING then
		// user is not
		// able to cancel
		if (!(RefundRequestStatusEnum.ALLOWED_TO_CANCEL.toString().equals(refundRequestDao.getStatus())
				|| RefundRequestStatusEnum.APPROVAL_PENDING.toString().equals(refundRequestDao.getStatus())
				|| RefundRequestStatusEnum.REJECTED.toString().equals(refundRequestDao.getStatus()))) {
			throw new ServiceException("This TEP is not allowed to cancel", "ERR-SALE-304");
		}
		refundRequestDao.setStatus(RefundRequestStatusEnum.CANCELLED.toString());
		refundRequestDao = refundRequestRepository.save(refundRequestDao);
		return (RefundUpdateResponseDto) MapperUtil.getDtoMapping(refundRequestDao, RefundUpdateResponseDto.class);
	}

	private RefundUpdateResponseDto callEpossCancelRequest(String refTxnId, String txnType) {
		Map<String, String> reqParams = Map.of(SalesUtil.REFUND_REQUEST_TXN_TYPE, txnType);
		ApiResponseDto epossApiResponseDto = salesIntegrationServiceImpl.callIntegration(HttpMethod.PUT,
				SalesUtil.CREATE_REFUND_REQUEST_EPOSS_URL + "/cancel/" + refTxnId, reqParams, null);
		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				RefundUpdateResponseDto.class);
	}

}
