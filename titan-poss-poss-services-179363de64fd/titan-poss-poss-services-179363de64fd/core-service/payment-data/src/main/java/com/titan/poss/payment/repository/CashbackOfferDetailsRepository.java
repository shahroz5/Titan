/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.CASHBACK_OFFER_DETAILS_REPOSITORY;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.CashbackOfferDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(CASHBACK_OFFER_DETAILS_REPOSITORY)
public interface CashbackOfferDetailsRepository extends JpaRepository<CashbackOfferDetailsDao, String> {

	/*
	 * This method will return the offers mapped to cashback id.
	 * 
	 * @param cashBackId
	 * 
	 * @return List<CashbackProductMappingDao>
	 */
	@Query("SELECT co FROM CashbackOfferDetailsDao co WHERE co.cashbackDao.id = :cashBackId order By co.rowId asc")
	List<CashbackOfferDetailsDao> findMappedOffer(@Param("cashBackId") String cashBackId);

	/*
	 * This method will delete the offers mapped to cashback id.
	 * 
	 * @param cashBackId
	 */

	@Query("SELECT co from CashbackOfferDetailsDao co WHERE co.id IN (:removeIdList)")
	List<CashbackOfferDetailsDao> findAllByOfferDetailId(@Param("removeIdList") List<String> removeIdList);

	/**
	 * @param keySet
	 * @return
	 */
	List<CashbackOfferDetailsDao> findByIdIn(@Param("offerIdList") Set<String> offerIdList);

	/**
	 * @param offerId
	 */
	@Query("SELECT MIN(co.minSwipeAmt),MIN(co.minInvoiceAmt) ,MIN(co.discountAmt),MAX(co.discountAmt),MAX(co.maxSwipeAmt) FROM CashbackOfferDetailsDao co WHERE co.cashbackDao.id = :offerId AND co.discountAmt > 0")
	List<Object[]> getDetailsIfAmount(@Param("offerId") String offerId);

	/**
	 * @param offerId
	 */
	@Query("SELECT MIN(co.minSwipeAmt),MIN(co.minInvoiceAmt),MIN(co.discountPercent*co.minSwipeAmt/100),MAX(co.maxDiscountAmt),MAX(co.maxSwipeAmt) FROM CashbackOfferDetailsDao co WHERE co.cashbackDao.id = :offerId AND co.discountPercent > 0 AND co.maxDiscountAmt >0")
	List<Object[]> getDetailsIfPercent(@Param("offerId") String offerId);

	/**
	 * @param id
	 * @param swipeAmount
	 * @param invoiceAmount
	 */
	@Query("SELECT co from CashbackOfferDetailsDao co WHERE co.cashbackDao.id = :offerId AND (:swipeAmount between co.minSwipeAmt AND co.maxSwipeAmt) "
			+ "AND (:invoiceAmount >= co.minInvoiceAmt)")
//	CashbackOfferDetailsDao getCashbackValue(@Param("offerId") String id, @Param("swipeAmount") BigDecimal swipeAmount,
//			@Param("invoiceAmount") BigDecimal invoiceAmount);
	
	List<CashbackOfferDetailsDao> getCashbackValue(@Param("offerId") String id,
			@Param("swipeAmount") BigDecimal swipeAmount, @Param("invoiceAmount") BigDecimal invoiceAmount);

}
