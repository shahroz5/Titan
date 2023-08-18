package com.titan.poss.engine.config.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.config.repository.FocSchemeMasterRepository;

@Repository
public interface FocSchemeMasterRepositoryExt extends FocSchemeMasterRepository {

	@Query("select fm from FocSchemeMasterDao fm inner join FocSchemeLocationMappingDao flm on fm.id = flm.focSchemeMasterDao.id where fm.isActive = 1 AND fm.manualFoc = 0 AND flm.isActive = 1  AND flm.locationCode = :locationCode AND (:currentDate between flm.startDate and flm.endDate)")
	List<FocSchemeMasterDao> getActiveSchemes(@Param("locationCode") String locationCode,
			@Param("currentDate") Date currentDate);

	@Query("select fm from FocSchemeMasterDao fm inner join FocSchemeLocationMappingDao flm on fm.id = flm.focSchemeMasterDao.id where fm.isActive = 1 AND fm.manualFoc = 0 AND flm.isActive = 1  AND flm.locationCode = :locationCode AND (:currentDate between flm.startDate and DATEADD(DAY, :offerPeriodForAB, flm.endDate )) AND fm.id = :schemeId")
	FocSchemeMasterDao getActiveAbSchemes(@Param("locationCode") String locationCode,
			@Param("offerPeriodForAB") Integer offerPeriodForAB, @Param("currentDate") Date currentDate,
			@Param("schemeId") String schemeId);

}
