package com.titan.poss.payment.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.titan.poss.payment.dao.CashbackCardDetailsDaoExt;

@Service
public interface CashbackCardDetailsRepositoryExt extends JpaRepository<CashbackCardDetailsDaoExt, String> {

	/*
	 * This method will delete the offers mapped to cashback id.
	 * 
	 * @param cashBackId
	 */
	@Modifying
	@Query("DELETE from CashbackCardDetailsDaoExt co WHERE co.cashbackDao.id = :cashBackId AND co.id IN (:cardList)")
	void deleteCardsBasedOnCashbackId(@Param("cashBackId") String cashBackId, @Param("cardList") Set<String> cardList);

	/**
	 * @param cashBackId
	 * @param string
	 * @return
	 */
	CashbackCardDetailsDaoExt findByCashbackDaoIdAndCardNo(String cashBackId, String cardNo);

	/**
	 * @param cardNo
	 * @return
	 */
	@Query("SELECT co from CashbackCardDetailsDaoExt co WHERE co.cashbackDao.id = :cashBackId AND co.cardNo = :cardNo")
	CashbackCardDetailsDaoExt findByCardNumber(@Param("cashBackId") String cashBackId, @Param("cardNo") String cardNo);

	/**
	 * @param keySet
	 * @return
	 */
	List<CashbackCardDetailsDaoExt> findByIdIn(@Param("idlist") Set<String> idlist);

	/**
	 * @param cardNo
	 * @return
	 */
	@Query("SELECT co from CashbackCardDetailsDaoExt co WHERE co.cashbackDao.id = :cashBackId AND co.cardNo IN (:cardNoList)")
	List<CashbackCardDetailsDaoExt> findByCashbackIdAndCardNumber(@Param("cashBackId") String cashBackId,
			@Param("cardNoList") List<String> cardNoList);

	@Query("SELECT co from CashbackCardDetailsDaoExt co WHERE co.cashbackDao.id = :cashBackId AND co.id = :cashbackCardId")
	Optional<CashbackCardDetailsDaoExt> findById(@Param("cashBackId") String cashBackId,
			@Param("cashbackCardId") String id);
}
