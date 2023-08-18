package com.titan.poss.integration.intg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.EmailIdValidationDao;

@Repository
public interface EmailIdValidationRepository extends JpaRepository<EmailIdValidationDao, String> {
	
	@Query("SELECT coalesce(max(email.sequenceNo), 0) FROM EmailIdValidationDao email where "
			+ "email.locationCode =:locationCode")
	public Integer getMaxSeqNo(@Param("locationCode") String locationCode);
	
	/*
	 * @Query("SELECT coalesce(max(gc.sequenceNo), 0) FROM GiftCardAuditDao gc where gc.locationCode =:locationCode"
	 * ) public Integer getMaxSeqNo(@Param("locationCode") String locationCode);
	 */

}
