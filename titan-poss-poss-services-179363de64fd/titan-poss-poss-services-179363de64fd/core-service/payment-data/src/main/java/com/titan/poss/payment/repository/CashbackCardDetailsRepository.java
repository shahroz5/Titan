/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.CASHBACK_CARD_DETAIL_REPOSITORY;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.CashbackCardDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(CASHBACK_CARD_DETAIL_REPOSITORY)
public interface CashbackCardDetailsRepository extends JpaRepository<CashbackCardDetailsDao, String> {

	/**
	 * @param cashBackId
	 * @param string
	 * @return
	 */
	CashbackCardDetailsDao findByCashbackDaoIdAndCardNo(String cashBackId, String cardNo);

	/**
	 * @param cardNo
	 * @return
	 */
	@Query("SELECT co from CashbackCardDetailsDao co WHERE co.cashbackDao.id = :cashBackId AND co.cardNo = :cardNo")
	CashbackCardDetailsDao findByCardNumber(@Param("cashBackId") String cashBackId, @Param("cardNo") String cardNo);

	/**
	 * @param cardNo
	 * @return
	 */
	@Query("SELECT co from CashbackCardDetailsDao co WHERE co.cashbackDao.id = :cashBackId AND co.cardNo IN (:cardNoList)")
	List<CashbackCardDetailsDao> findByCashbackIdAndCardNumber(@Param("cashBackId") String cashBackId,
			@Param("cardNoList") List<String> cardNoList);

	/**
	 * @param cardNo
	 * @return
	 */
	@Query("SELECT co from CashbackCardDetailsDao co WHERE co.cashbackDao.id = :cashBackId AND co.id IN (:id)")
	List<CashbackCardDetailsDao> findAllByCardDetailId(@Param("cashBackId") String cashBackId,
			@Param("id") Set<String> id);

	/**
	 * @param keySet
	 * @return
	 */
	List<CashbackCardDetailsDao> findByIdIn(@Param("idlist") Set<String> idlist);

	/**
	 * @param id
	 * @param firstDigits
	 * @param lastDigits
	 */
	@Query("SELECT co from CashbackCardDetailsDao co WHERE co.cashbackDao.id = :cashBackId AND co.isActive = 1 AND co.cardNo = :cardDigits")
	CashbackCardDetailsDao validateCardNo(@Param("cashBackId") String id, @Param("cardDigits") String cardDigits);
}
