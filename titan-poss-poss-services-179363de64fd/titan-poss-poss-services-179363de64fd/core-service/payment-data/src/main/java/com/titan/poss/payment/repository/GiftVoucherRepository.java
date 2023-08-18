/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.GIFT_VOUCHER_REPOSITORY;

import java.math.BigInteger;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.GiftMasterDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(GIFT_VOUCHER_REPOSITORY)
public interface GiftVoucherRepository extends JpaRepository<GiftMasterDao, Integer> {

	/**
	 *
	 * @param srcSerialNo
	 * @param destSerialNo
	 * @param giftVoucherStatus
	 * @param pageable
	 * @return Page<GiftVoucherDao>
	 */
	@Query("SELECT gv FROM GiftMasterDao gv WHERE (gv.serialNo BETWEEN :srcSerialNo AND :destSerialNo)"
			+ "AND (gv.status IN (:giftVoucherStatus) OR  nullif(CHOOSE(1,:giftVoucherStatus),'') IS NULL)")
	Page<GiftMasterDao> findGiftVoucherDetails(@Param("srcSerialNo") BigInteger srcSerialNo,
			@Param("destSerialNo") BigInteger destSerialNo, @Param("giftVoucherStatus") List<String> giftVoucherStatus,
			Pageable pageable);

	/**
	 * 
	 * @param serialNumberList
	 * @param giftStatusList
	 * @param pageable
	 * @return Page<GiftMasterDao>
	 */
	@Query("SELECT gv FROM GiftMasterDao gv WHERE ( CHOOSE(1,:serialNumberList) IS NULL OR gv.serialNo IN (:serialNumberList))"
			+ "AND (gv.status IN (:giftVoucherStatus) OR  nullif(CHOOSE(1,:giftVoucherStatus),'') IS NULL)")
	Page<GiftMasterDao> findGiftVoucherDetails(@Param("serialNumberList") List<BigInteger> serialNumberList,
			@Param("giftVoucherStatus") List<String> giftStatusList, Pageable pageable);

	/**
	 *
	 * @param serialNumbers
	 * @return List<GiftMasterDao>
	 */
	List<GiftMasterDao> findBySerialNoIn(Set<BigInteger> serialNumbers);

//	convert(varchar(20)
	/**
	 * 
	 * @param serialNumberList
	 * @param giftStatusList
	 * @param pageable
	 * @return Page<GiftMasterDao>
	 */
	@Query("SELECT gv FROM GiftMasterDao gv WHERE (gv.serialNo = :serialNumber  OR :serialNumber IS NULL)"
			+ "AND (gv.status IN (:giftVoucherStatus) OR  nullif(CHOOSE(1,:giftVoucherStatus),'') IS NULL)")
	Page<GiftMasterDao> findGiftVoucher(@Param("serialNumber") BigInteger serialNumber,
			@Param("giftVoucherStatus") List<String> giftStatusList, Pageable pageable);
}
