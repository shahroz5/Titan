/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service.impl;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.inventory.dao.InvDocMasterDao;
import com.titan.poss.inventory.repository.InvDocMasterRepository;
import com.titan.poss.inventory.service.InventoryDocMasterService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("inventoryDocMasterService")
public class InventoryDocMasterServiceImpl implements InventoryDocMasterService {

	@Autowired
	InvDocMasterRepository invDocMasterRepository;

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public synchronized Integer getDocNumber(short fiscalYear, String locationCode, String docType) {
		Integer docNumber = null;
		InvDocMasterDao invDocMasterCriteria = new InvDocMasterDao();
		invDocMasterCriteria.setLocationCode(locationCode);
		invDocMasterCriteria.setFiscalYear(fiscalYear);
		invDocMasterCriteria.setDocType(docType);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<InvDocMasterDao> criteria = Example.of(invDocMasterCriteria, matcher);

		Optional<InvDocMasterDao> invDocMaster = invDocMasterRepository.findOne(criteria);
		if (!invDocMaster.isPresent()) {
			InvDocMasterDao idm = new InvDocMasterDao();
			idm.setDocNo(1);
			idm.setDocType(docType);
			idm.setFiscalYear(fiscalYear);
			idm.setLocationCode(locationCode);
			idm.setCreatedBy("Admin");
			idm.setCreatedDate(new Date());
			idm.setIsActive(true);
			idm.setLastModifiedBy("Admin");
			idm.setLastModifiedDate(new Date());
			invDocMasterRepository.save(idm);
			return idm.getDocNo();
		}
		docNumber = invDocMaster.get().getDocNo() + 1;
		invDocMaster.get().setDocNo(docNumber);
		invDocMasterRepository.saveAndFlush(invDocMaster.get());
		return docNumber;
	}

}
