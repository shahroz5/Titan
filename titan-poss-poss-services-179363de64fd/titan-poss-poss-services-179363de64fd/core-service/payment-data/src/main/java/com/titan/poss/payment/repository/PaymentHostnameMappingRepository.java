/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.PaymentHostnameMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository(PaymentConstants.PAYMENT_HOSTNAME_REPOSITORY)
public interface PaymentHostnameMappingRepository extends JpaRepository<PaymentHostnameMappingDao, String> {

	List<PaymentHostnameMappingDao> findByLocationCodeAndHostName(String locationCode, String hostName);

	Optional<PaymentHostnameMappingDao> findByLocationCodeAndHostNameAndPaymentCode(String locationCode,
			String hostName, String paymentCode);

	Optional<PaymentHostnameMappingDao> findByDeviceIdAndPaymentCode(String deviceId, String paymentCode);

	Page<PaymentHostnameMappingDao> findByPaymentCode(String paymentCode, Pageable pageable);
	
	List<PaymentHostnameMappingDao> findByIsActive(boolean isActive);
	
	@Query("SELECT phn FROM PaymentHostnameMappingDao phn WHERE (:locationCode IS NULL OR phn.locationCode LIKE '%'+:locationCode +'%') AND (:isActive IS NULL OR phn.isActive = :isActive) AND (:paymentCode IS NULL OR phn.paymentCode = :paymentCode)")
	Page<PaymentHostnameMappingDao> findLocation(@Param("paymentCode")String paymentCode, @Param("locationCode")String locationCode, @Param("isActive")Boolean isActive, Pageable pageable);

}
