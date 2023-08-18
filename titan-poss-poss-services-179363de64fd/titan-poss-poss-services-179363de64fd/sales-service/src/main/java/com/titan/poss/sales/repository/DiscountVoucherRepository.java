/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.DiscountVoucherDao;

/**
 * Repository to handle operations on <b>discount_voucher</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesDiscountVoucherRepository")
public interface DiscountVoucherRepository extends JpaRepository<DiscountVoucherDao, String> {

	//@formatter:off
	@Query("SELECT dv FROM com.titan.poss.sales.dao.DiscountVoucherDao dv \r\n" 
			+ " WHERE dv.voucherType = :voucherType \r\n"
			+ " AND dv.voucherNo = :voucherNo \r\n"
			+ " AND dv.customerLocationMap.customerLocationMappingId.locationCode = :locationCode ")
	//@formatter:on
	DiscountVoucherDao findOneByVoucherNoVoucherTypeLocationCode(@Param("voucherNo") String voucherNo,
			@Param("voucherType") String voucherType, @Param("locationCode") String locationCode);

}
