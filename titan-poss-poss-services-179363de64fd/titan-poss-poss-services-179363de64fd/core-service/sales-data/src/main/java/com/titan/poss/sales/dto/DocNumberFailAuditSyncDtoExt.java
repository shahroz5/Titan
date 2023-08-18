package com.titan.poss.sales.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode(callSuper = false)
public class DocNumberFailAuditSyncDtoExt extends SyncableEntity {
	
	private String id;
	
	private Integer docNo;
	
	private Short fiscalYear;
	
	private String locationCode;

	private String txnType;

	private String subTxnType;
	
	private String status;
	
	private String failReason;
 
	public DocNumberFailAuditSyncDtoExt()
	{
		
	}
	public DocNumberFailAuditSyncDtoExt(DocNumberFailAuditDaoExt docNumberDaoExt)
	{
		MapperUtil.getObjectMapping(docNumberDaoExt, this);
	}
	public List<DocNumberFailAuditDaoExt> getDocNumberFailAudit(List<DocNumberFailAuditSyncDtoExt> syncDtoList){
		List<DocNumberFailAuditDaoExt> daoList=new ArrayList<>();
		syncDtoList.forEach(syncDto->daoList.add((DocNumberFailAuditDaoExt)MapperUtil.getObjectMapping(syncDto,new DocNumberFailAuditDaoExt())));
		return daoList;
	}

}
