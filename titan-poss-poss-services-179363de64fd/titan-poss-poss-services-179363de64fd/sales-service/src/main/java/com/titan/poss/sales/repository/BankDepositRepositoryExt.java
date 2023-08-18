/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.BankDepositDaoExt;
import com.titan.poss.sales.dao.RevenueSummaryDaoExt;
import com.titan.poss.sales.dto.DepositDto;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("bankDepositRepositoryExt")
public interface BankDepositRepositoryExt extends JpaRepository<BankDepositDaoExt, String> {

	/**
	 * 
	 * @param idList
	 * @param locationCode
	 * @return List<BankDepositDaoExt>
	 */
	List<BankDepositDaoExt> findByIdInAndLocationCode(List<String> idList, String locationCode);

	/**
	 * 
	 * @param status
	 * @param locationCode
	 * @param paymentCode
	 * @return Page<BankDepositDaoExt>
	 */
	Page<BankDepositDaoExt> findByIsBankingCompletedAndLocationCodeAndPaymentCodeIn(Boolean status, String locationCode,
			List<String> paymentCode, Pageable pageable);

	/**
	 * 
	 * @param locationCode
	 * @param businessDate
	 * @param status
	 * @param status
	 * @return List<BankDepositDao>
	 */
	List<BankDepositDaoExt> findByLocationCodeAndBusinessDateAndIsBankingCompleted(String locationCode,
			Date businessDate, Boolean status);

	/**
	 * 
	 * @param businessDate
	 * @param locationCode
	 * @return List<BankDepositDaoExt>
	 */
	List<BankDepositDaoExt> findByIsBankingCompletedAndBusinessDateAndLocationCode(Boolean status, Date businessDate,
			String locationCode);

	/**
	 * 
	 * @param locationCode
	 * @param businessDate
	 * @param paymentCode
	 * @return BankDepositDaoExt
	 */
	BankDepositDaoExt findByLocationCodeAndBusinessDateAndPaymentCode(String locationCode, Date businessDate,
			String paymentCode);

	/**
	 * 
	 * @param locationCode
	 * @param businessDate
	 * @return List<BankDepositDaoExt>
	 */
	List<BankDepositDaoExt> findByLocationCodeAndBusinessDate(String locationCode, Date businessDate);

	/**
	 * 
	 * @param locationCode
	 * @param businessDate
	 * @param status
	 * @return List<BankDepositDaoExt>
	 */
	List<BankDepositDaoExt> findByLocationCodeAndDepositDateAndIsBankingCompleted(String locationCode,
			Date businessDate, Boolean status);

	/**
	 * @param txnId
	 * @param locationCode
	 * @return
	 */
	BankDepositDaoExt findByIdAndLocationCode(String txnId, String locationCode);

	/**
	 * @param locationCode
	 * @return
	 */
	@Query(nativeQuery = true, value = "Select MAX(CAST(deposit_slip_no as bigint)) as depo FROM bank_deposits where location_code =:locationCode")
	BigInteger findLastSlipNumber(@Param("locationCode") String locationCode);

	/**
	 * @param depositSlipNo
	 * @param id
	 */
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE bank_deposits SET deposit_slip_no = :depositSlipNo WHERE id = :id")
	void updateSlipNumber(@Param("depositSlipNo") String depositSlipNo, @Param("id") String ids);

	/**
	 * @param payeeBankName
	 * @param depositDate
	 * @param true1
	 * @param locationCode
	 * @param paymentCode
	 * @return
	 */
	List<BankDepositDaoExt> findAllByPayeeBankNameAndDepositDateAndIsBankingCompletedAndLocationCodeAndPaymentCodeIn(
			String payeeBankName, Date depositDate, Boolean true1, String locationCode, List<String> paymentCode);
	
	@Query(nativeQuery = true, value = "SELECT * FROM bank_deposits  WHERE id in(:txnIds) and location_code = :locationCode")
	List<BankDepositDaoExt> findAllByIdAndLocationCode(@Param("txnIds") List<String> txnIds,@Param("locationCode") String locationCode);
	
//	/**
//	 * @param fromDate
//	 * @param toDate
//	 * @param pageable
//	 * @return
//	 */

	@Query("SELECT new com.titan.poss.sales.dto.DepositDto(bd.depositDate,bd.paymentCode,SUM(bd.depositAmount)) from com.titan.poss.sales.dao.BankDepositDaoExt bd where bd.paymentCode IN "
			+ "(SELECT bd1.paymentCode FROM com.titan.poss.sales.dao.BankDepositDaoExt bd1 WHERE bd1.paymentCode IN (:paymentCodes))"
			+ " AND bd.depositDate =:businessDate AND bd.locationCode = :locationCode AND bd.isBankingCompleted = 'TRUE' GROUP BY bd.depositDate,bd.paymentCode")
	List<DepositDto> findByBusinessDateAndLocationCode(@Param("paymentCodes") List<String> paymentCodes, @Param("businessDate") Date businessDate,
			@Param("locationCode") String locationCode);
	
	
	@Query("SELECT b FROM BankDepositExt b WHERE b.depositDate = :depositDate AND b.paymentCode in (:paymentCodes) AND b.locationCode = :locationCode AND b.isBankingCompleted=:isBankingCompleted ")
	List<BankDepositDaoExt> getDepositDateAndPaymentCode(@Param("depositDate") Date depositDate,@Param("paymentCodes") List<String> paymentCodes ,@Param("locationCode") String locationCode,@Param("isBankingCompleted") Boolean isBankingCompleted);
	
	@Query("SELECT b FROM BankDepositExt b WHERE b.paymentCode='CASH' AND b.pifNo = :pifNo ")
	List<BankDepositDaoExt> getByDepositIdAndAmount(@Param("pifNo") String pifNo);


}

