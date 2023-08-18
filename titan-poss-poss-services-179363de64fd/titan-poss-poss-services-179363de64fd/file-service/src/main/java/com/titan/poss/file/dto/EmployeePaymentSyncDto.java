package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.AuditableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.EmployeePaymentConfigDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class EmployeePaymentSyncDto extends AuditableEntity {

	private String id;

	private Date approvalDate;

	private String employeeCode;

	private BigDecimal eligibleAmount;

	private Date validityDate;

	private String documentDetails;

	private String employeeDetails;

	private String status;

	private String config_type;

	private BigDecimal redeemedAmount;

	private String correlationId;

	public EmployeePaymentSyncDto() {

	}

	public EmployeePaymentSyncDto getEmployeePaymentSyncDto(EmployeePaymentConfigDao productPriceMappingDao) {
		EmployeePaymentSyncDto productPriceMappingSyncDto = (EmployeePaymentSyncDto) MapperUtil
				.getObjectMapping(productPriceMappingDao, this);
		return productPriceMappingSyncDto;
	}

	public List<EmployeePaymentSyncDto> getSyncDtoList(List<EmployeePaymentConfigDao> daoList) {
		List<EmployeePaymentSyncDto> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			EmployeePaymentSyncDto vendorConfigSyncDto = new EmployeePaymentSyncDto();
  		    syncDtoList.add(vendorConfigSyncDto.getEmployeePaymentSyncDto(dao));
		});

		return syncDtoList;
	}
}
