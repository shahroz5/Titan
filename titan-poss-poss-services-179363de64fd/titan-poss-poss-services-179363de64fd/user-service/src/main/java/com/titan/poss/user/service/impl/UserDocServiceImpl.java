/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.user.dao.UserDocDao;
import com.titan.poss.user.dto.constants.UserDocTypeEnum;
import com.titan.poss.user.repository.UserDocRepository;
import com.titan.poss.user.service.UserDocService;

/**
 * service impl layer of ACL controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserDocService")
public class UserDocServiceImpl implements UserDocService {

	@Autowired
	UserDocRepository userDocRepo;

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Integer getDocNumber(String locationCode, short fiscalYear, String docType) {

		UserDocDao userDoc;

		if (UserDocTypeEnum.TEMP_EMP_NO.name().equalsIgnoreCase(docType))
			userDoc = userDocRepo.findByLocationCodeAndDocType(locationCode, docType);
		else
			userDoc = userDocRepo.findOneByLocationCodeAndFiscalYearAndDocType(locationCode, fiscalYear, docType);
		Integer docNo;
		if (userDoc == null) {
			UserDocDao udm = new UserDocDao();
			udm.setDocNo(1);
			udm.setDocType(docType);
			udm.setFiscalYear(fiscalYear);
			udm.setLocationCode(locationCode);
			userDocRepo.save(udm);
			docNo = udm.getDocNo();
		} else {
			docNo = userDoc.getDocNo() + 1;
			userDoc.setDocNo(docNo);
			userDocRepo.save(userDoc);
		}
		return docNo;
	}

}
