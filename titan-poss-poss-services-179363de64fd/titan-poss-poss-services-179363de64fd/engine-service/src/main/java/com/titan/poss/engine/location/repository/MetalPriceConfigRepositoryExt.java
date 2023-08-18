/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.location.repository;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MetalPriceConfigDao;
import com.titan.poss.location.repository.MetalPriceConfigRepository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("EngineMetalPriceConfigRepository")
public interface MetalPriceConfigRepositoryExt extends MetalPriceConfigRepository {

	List<MetalPriceConfigDao> findByMetalTypeCodeAndApplicableDate(String metalTypeCode, Date applicableDate);

}
