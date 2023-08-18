/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.workflow.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.workflow.dao.WorkflowDocMasterDao;
import com.titan.poss.workflow.dto.response.DocNoAndFiscalYearDto;
import com.titan.poss.workflow.repository.WorkflowDocMasterRepository;
import com.titan.poss.workflow.service.EngineService;
import com.titan.poss.workflow.service.WorkflowDocMasterService;

/**
 * Service Implementation class for Workflow Doc Master.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("workflowDocMasterService")
public class WorkflowDocMasterServiceImpl implements WorkflowDocMasterService {

	@Autowired
	private WorkflowDocMasterRepository workflowDocMasterRepository;

	@Autowired
	private EngineService engineService;

	/**
	 * This method will return the docNo from the workflow_doc_master Table based on
	 * a Workflow Type Returns doc no specific to a store, year and docType
	 * 
	 * Internally, we are doing Inter-Service Call to get Business Day and fiscal
	 * year.
	 * 
	 * @param docType
	 * @param isActive
	 * @return Integer
	 */

	@Override
	public DocNoAndFiscalYearDto getDocNumber(WorkflowTypeEnum docType, Boolean isActive) {
		Integer docNo;
		BusinessDayDto businessDayDto = engineService.getBusinessDay(CommonUtil.getStoreCode());
		Short fiscalYear = businessDayDto.getFiscalYear().shortValue();

		WorkflowDocMasterDao workflowDocMasterDao = workflowDocMasterRepository
				.findOneByLocationCodeAndFiscalYearAndDocType(CommonUtil.getStoreCode(), fiscalYear, docType.name());

		if (workflowDocMasterDao == null) {
			workflowDocMasterDao = new WorkflowDocMasterDao();
			workflowDocMasterDao.setDocNo(1);
			workflowDocMasterDao.setLocationCode(CommonUtil.getStoreCode());
			workflowDocMasterDao.setFiscalYear(fiscalYear);
			workflowDocMasterDao.setDocType(docType.name());
			workflowDocMasterDao.setIsActive(isActive);

			docNo = workflowDocMasterDao.getDocNo();
		} else {
			docNo = workflowDocMasterDao.getDocNo() + 1;
			workflowDocMasterDao.setDocNo(docNo);
		}

		workflowDocMasterRepository.save(workflowDocMasterDao);

		return new DocNoAndFiscalYearDto(docNo, fiscalYear);
	}

}
