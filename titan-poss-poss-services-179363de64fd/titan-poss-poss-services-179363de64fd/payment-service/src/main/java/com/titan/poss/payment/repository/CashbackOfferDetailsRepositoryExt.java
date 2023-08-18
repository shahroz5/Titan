package com.titan.poss.payment.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.payment.dao.CashbackOfferDetailsDaoExt;

public interface CashbackOfferDetailsRepositoryExt extends JpaRepository<CashbackOfferDetailsDaoExt, String> {
	/*
	 * This method will return the offers mapped to cashback id.
	 * 
	 * @param cashBackId
	 * 
	 * @return List<CashbackProductMappingDao>
	 */
	@Query("SELECT co FROM CashbackOfferDetailsDaoExt co WHERE co.cashbackDao.id = :cashBackId order By co.rowId asc")
	List<CashbackOfferDetailsDaoExt> findMappedOffer(@Param("cashBackId") String cashBackId);

	/*
	 * This method will delete the offers mapped to cashback id.
	 * 
	 * @param cashBackId
	 */
	@Modifying
	@Query("DELETE from CashbackOfferDetailsDaoExt co WHERE co.cashbackDao.id = :cashBackId AND co.id = :id")
	void deleteOffersBasedOnCashbackId(@Param("cashBackId") String cashBackId, @Param("id") String id);

	@Query("from CashbackOfferDetailsDaoExt co WHERE co.cashbackDao.id = :cashBackId AND co.id = :Id")
	CashbackOfferDetailsDaoExt findBycashbackId(@Param("cashBackId") String cashbackId, @Param("Id") String id);

	/**
	 * @param keySet
	 * @return
	 */
	List<CashbackOfferDetailsDaoExt> findByIdIn(@Param("idList") Set<String> idList);
}
