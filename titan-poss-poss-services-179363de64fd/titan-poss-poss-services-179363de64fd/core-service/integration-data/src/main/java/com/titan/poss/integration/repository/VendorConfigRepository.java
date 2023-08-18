/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.dao.VendorConfigDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("IntegrationVendorConfigRepository")
public interface VendorConfigRepository extends JpaRepository<VendorConfigDao, String> {

	List<VendorConfigDao> findAllByVendorVendorCodeAndLocationCodeAndIsActiveTrue(String vendorType,
			String locationCode);

	List<VendorConfigDao> findAllByVendorVendorCodeAndIsActiveTrue(String vendorType);

	public List<VendorConfigDao> findByVendorVendorCodeAndIsActive(String vendorCode, Boolean isActive);

	public VendorConfigDao findByVendorVendorCodeAndLocationCodeAndIsActive(String vendorCode, String locationCode,
			Boolean isActive);

	List<VendorConfigDao> findByVendorVendorCode(String vendorCode);

	List<VendorConfigDao> findByCorrelationId(String correlationId);

}
