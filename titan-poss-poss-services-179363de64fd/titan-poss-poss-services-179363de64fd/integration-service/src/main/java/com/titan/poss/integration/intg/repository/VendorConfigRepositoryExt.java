/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.intg.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.VendorConfigDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("IntegrationVendorConfigRepositoryExt")
public interface VendorConfigRepositoryExt extends JpaRepository<VendorConfigDaoExt, String> {

	List<VendorConfigDaoExt> findAllByVendorVendorCodeAndLocationCodeAndIsActiveTrue(String vendorType,
			String locationCode);

	List<VendorConfigDaoExt> findAllByVendorVendorCodeAndIsActiveTrue(String vendorType);

	public List<VendorConfigDaoExt> findByVendorVendorCodeAndIsActive(String vendorCode, Boolean isActive);

	public VendorConfigDaoExt findByVendorVendorCodeAndLocationCode(String vendorCode, String locationCode);

	List<VendorConfigDaoExt> findByVendorVendorCode(String vendorCode);

	List<VendorConfigDaoExt> findByCorrelationId(String correlationId);

	@Query("SELECT vcd FROM VendorConfigDaoExt vcd WHERE (:locationCode IS NULL OR vcd.locationCode LIKE %:locationCode%) AND (:isActive IS NULL OR vcd.vendor.isActive =:isActive) AND vcd.vendor.vendorCode= :vendorCode")
	Page<VendorConfigDaoExt> findAllLocation(@Param("locationCode")String locationCode,@Param("vendorCode")String vendorCode, @Param("isActive")Boolean isActive, Pageable pageable);
}
