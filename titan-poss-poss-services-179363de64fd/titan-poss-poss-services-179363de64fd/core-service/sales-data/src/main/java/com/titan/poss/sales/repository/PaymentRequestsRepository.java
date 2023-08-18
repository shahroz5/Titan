/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.PaymentRequestsDao;
import com.titan.poss.sales.dto.PaymentRequestSearchDto;



/**
 * Repository for <b>payment_requests</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesPaymentRequestsRepository")
public interface PaymentRequestsRepository extends JpaRepository<PaymentRequestsDao, String> {

	// @formatter:off
	@Query("SELECT pr FROM com.titan.poss.sales.dao.PaymentRequestsDao pr \r\n"
			+ " WHERE pr.customerLocationMap.customerLocationMappingId.locationCode = :locationCode \r\n"
			+ " AND (:#{#paymentRequestSearchDto.customerId} IS NULL OR pr.customerLocationMap.customerLocationMappingId.customerId = :#{#paymentRequestSearchDto.customerId}) \r\n"
			+ " AND (:paymentCode IS NULL OR pr.paymentCode = :paymentCode) \r\n"
			+ " AND (:#{#paymentRequestSearchDto.referenceId} IS NULL OR pr.referenceId = :#{#paymentRequestSearchDto.referenceId}) \r\n"
			+ " AND (nullif(CHOOSE(1,:#{#paymentRequestSearchDto.status}),'') IS NULL OR pr.status IN (:#{#paymentRequestSearchDto.status})) \r\n"
			+ " AND (:isReferenceIdExists IS NULL OR \r\n"
			+ "			("
			+ "				(:isReferenceIdExists=true AND pr.referenceId IS NOT NULL) \r\n"
			+ "				 OR \r\n"
			+ "				(:isReferenceIdExists=false AND pr.referenceId IS NULL) \r\n"
			+ "			) \r\n"
			+ "		) \r\n"
			+ " AND (:#{#paymentRequestSearchDto.fiscalYear} IS NULL or pr.fiscalYear = :#{#paymentRequestSearchDto.fiscalYear}) \r\n"
			+ " AND ((:startDate IS NULL AND pr.requestedDate <= :endDate) OR (:startDate IS NOT NULL AND pr.requestedDate BETWEEN :startDate AND :endDate))")
	// @formatter:on
	Page<PaymentRequestsDao> listPendingPayments(@Param("paymentCode") String paymentCode,
			@Param("paymentRequestSearchDto") PaymentRequestSearchDto paymentRequestSearchDto,
			@Param("locationCode") String locationCode, @Param("isReferenceIdExists") Boolean isReferenceIdExists,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageable);

	@Query("SELECT pr FROM com.titan.poss.sales.dao.PaymentRequestsDao pr \r\n"
			+ " WHERE pr.customerLocationMap.customerLocationMappingId.locationCode = :locationCode \r\n"
			+ " AND (:customerId IS NULL OR pr.customerLocationMap.customerLocationMappingId.customerId = :customerId) \r\n"
			+ " AND (:paymentCode IS NULL OR pr.paymentCode = :paymentCode) \r\n"
			+ " AND (:referenceId IS NULL OR pr.referenceId = :referenceId) \r\n"
			+ " AND (:status IS NULL OR pr.status = :status) \r\n")
	List<PaymentRequestsDao> getAllPendingPayments(@Param("customerId") Integer customerId,
			@Param("paymentCode") String paymentCode, @Param("referenceId") String referenceId,
			@Param("status") String status, @Param("locationCode") String locationCode);

	@Query("SELECT pr FROM com.titan.poss.sales.dao.PaymentRequestsDao pr \r\n"
			+ " WHERE pr.customerLocationMap.customerLocationMappingId.locationCode = :locationCode \r\n"
			+ " AND pr.id = :id")
	PaymentRequestsDao findOneByIdAndLocationCode(@Param("id") String id, @Param("locationCode") String locationCode);

	List<PaymentRequestsDao> findByStatusInAndCustomerLocationMapCustomerLocationMappingIdLocationCodeAndPaymentCode(
			List<String> asList, String locationCode, String paymentCode);

	// @formatter:off
	@Query("SELECT pr FROM com.titan.poss.sales.dao.PaymentRequestsDao pr \r\n"
			+ " WHERE pr.customerLocationMap.customerLocationMappingId.locationCode = :locationCode \r\n"
			+ " AND pr.status IN (:statusList) \r\n"
			+ " AND pr.paymentCode IN (:paymentCodeList) \r\n"
			+ " AND pr.docDate = :docDate")
	// @formatter:on
	List<PaymentRequestsDao> findByStatusLocationCodeAndPaymentCodeAndDocDate(
			@Param("locationCode") String locationCode, @Param("statusList") List<String> statusList,
			@Param("paymentCodeList") List<String> paymentCodeList, @Param("docDate") Date docDate);
}
