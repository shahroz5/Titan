package com.titan.poss.integration.intg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.integration.intg.dao.PanDocAuditDao;

@Repository
public interface PanDocAuditRepository extends JpaRepository<PanDocAuditDao, String> {

	@Query("SELECT coalesce(max(pan.sequenceNo), 0) FROM PanDocAuditDao pan where pan.locationCode =:locationCode")
	public Integer getMaxSeqNo(@Param("locationCode") String locationCode);

}
