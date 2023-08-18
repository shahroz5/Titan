/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.dao.VendorDao;

/**
 * Handles repository operations for <b>AclGroup</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0s
 */
@Repository("IntegrationVendorRepository")
public interface VendorRepository extends JpaRepository<VendorDao, String> {

	List<VendorDao> findAllByVendorTypeAndIsActiveTrue(String vendorType);

	Boolean existsByVendorCodeAndIsActiveTrue(String vendorType);

	VendorDao findByVendorCode(String vendorCode);

	VendorDao findOneByVendorTypeAndIsActiveTrue(String vendorType);

	VendorDao findByVendorCodeAndIsActiveTrue(String vendorCode);

}
