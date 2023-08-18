package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GiftCardDetailsDao;

@Repository("salesQwcikcilverCardDetailsRepositoryExt")
public interface QwcikcilverCardDetailsRepositoryExt extends JpaRepository<GiftCardDetailsDao, String> {

	@Query("SELECT qcgc FROM com.titan.poss.sales.dao.GiftCardDetailsDao qcgc \r\n" 
			+ " WHERE qcgc.cardNumber = :cardNumber ")
	GiftCardDetailsDao findByCardNumber(@Param("cardNumber") String cardNumber);

	@Query("SELECT qcgc FROM com.titan.poss.sales.dao.GiftCardDetailsDao qcgc \r\n" 
			+ " WHERE qcgc.trackData = :trackData ")
	GiftCardDetailsDao findByTrackData(@Param("trackData") String trackData);

	void deleteByTrackData(String trackData);

	void deleteByCardNumber(String cardNumber);

	
}
