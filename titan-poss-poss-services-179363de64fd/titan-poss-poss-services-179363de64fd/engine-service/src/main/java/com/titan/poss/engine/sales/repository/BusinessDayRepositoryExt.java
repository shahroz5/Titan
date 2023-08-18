package com.titan.poss.engine.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.BusinessDayDao;
import com.titan.poss.sales.repository.BusinessDayRepository;

@Repository
public interface BusinessDayRepositoryExt extends BusinessDayRepository {

	@Query(nativeQuery = true, value = "SELECT TOP 1 bdm.* FROM sales.dbo.business_day_master bdm where bdm.location_code = :locationCode and bdm.status = :status ORDER BY bdm.business_date DESC")
	BusinessDayDao getFiscalYearForBusinessDay(@Param("locationCode") String locationCode,
			@Param("status") String status);

	@Query(nativeQuery = true, value ="select * from sales.dbo.business_day_master bd where bd.location_code = :locationCode and bd.status = :status and business_date in (SELECT max(business_date) from sales.dbo.business_day_master bdm2 where bdm2.status =:status and location_code =:locationCode )")
	List<BusinessDayDao> getMaxBusinessDayForClosedState(@Param("locationCode") String locationCode,
			@Param("status") String status);
}
