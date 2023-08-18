package com.titan.poss.sales.repository;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GhsBankDepositDaoExt;
@Repository
public interface BankDepositeStagingRepositoryExt extends JpaRepository<GhsBankDepositDaoExt, String>{

	@Query(nativeQuery = true ,value = "select *from bank_deposits_stage where type = :type AND (bank_name = :bankName OR bank_name is NULL) AND cheque_no = :chequeNo AND collection_date = :collectionDate AND location_code = :locationCode")
	GhsBankDepositDaoExt findByUnique(@Param("type") String type,@Param("bankName") String bankName,@Param("chequeNo") String chequeNo,@Param("collectionDate") Date collectionDate,
			@Param("locationCode") String locationCode);

}
