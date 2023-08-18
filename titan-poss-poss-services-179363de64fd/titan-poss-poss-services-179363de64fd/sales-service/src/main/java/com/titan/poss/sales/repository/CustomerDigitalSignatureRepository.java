package com.titan.poss.sales.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerDigitalSignatureDaoExt;
import com.titan.poss.sales.dto.response.CustomerDigitalSignatureResponseDto;

@Repository
public interface CustomerDigitalSignatureRepository extends JpaRepository<CustomerDigitalSignatureDaoExt, String> {

	@Query(value = "SELECT new com.titan.poss.sales.dto.response.CustomerDigitalSignatureResponseDto(c.mobileNumber,"
			+ "c.ulpId," + "cds.applicableTransactionTypes,c.id,c.customerName,"
			+ "c.emailId,c.customerDetails,c,c.customerType,cds.digitalSignature,cds.customerDocumentTxnId) FROM"
			+ " com.titan.poss.sales.dao.CustomerDigitalSignatureDaoExt as cds "
			+ "RIGHT JOIN com.titan.poss.sales.dao.CustomerDaoExt as c " + "ON c.id = cds.customer "
			+ "WHERE c.customerType!= 'ONETIME' AND ((:mobileNumber is not null AND c.mobileNumber = :mobileNumber) OR (:ulpNumber is not null AND c.ulpId = :ulpNumber)) "
			+ "AND cds.locationCode = :locationCode")
	public List<CustomerDigitalSignatureResponseDto> getByMobileNumberOrUlpNumber(@Param("mobileNumber") String mobileNumber,
			@Param("ulpNumber") String ulpNumber,@Param("locationCode") String locationCode);
	
	@Query(value = "SELECT new com.titan.poss.sales.dto.response.CustomerDigitalSignatureResponseDto(cds.mobileNumber,"
			+ "cds.ulpNumber," + "cds.applicableTransactionTypes,cds.customer.id,cds.customer.customerName,"
			+ "cds.customer.emailId,cds.customer.customerDetails,cds.customer,cds.customerType,cds.digitalSignature,cds.customerDocumentTxnId) FROM"
			+ " com.titan.poss.sales.dao.CustomerDigitalSignatureDaoExt as cds "
			+ "WHERE ((:mobileNumber is not null AND cds.mobileNumber = :mobileNumber) OR (:ulpNumber is not null AND cds.ulpNumber = :ulpNumber)) "
			+ "AND (:customerType is not null AND cds.customerType = :customerType) AND cds.locationCode = :locationCode")
	public List<CustomerDigitalSignatureResponseDto> getByMobileNumberOrUlpNumberOrLocationCode(@Param("mobileNumber") String mobileNumber,
			@Param("ulpNumber") String ulpNumber,@Param("customerType")String customerType,@Param("locationCode") String locationCode);

	public CustomerDigitalSignatureDaoExt findOneByMobileNumber(String mobileNumber);
	
//	@Query(value = "SELECT new com.titan.poss.sales.dto.response.CustomerDigitalSignatureResponseDto(c.mobileNumber,"
//			+ "c.ulpId," + "cds.applicableTransactionTypes,c.id,c.customerName,"
//			+ "c.emailId,c.customerDetails,c,c.customerType,cds.digitalSignature,cds.customerDocumentTxnId) FROM"
//			+ " com.titan.poss.sales.dao.CustomerDigitalSignatureDaoExt as cds "
//			+ "RIGHT JOIN com.titan.poss.sales.dao.CustomerDaoExt as c " 
//			+ "ON (c.mobileNumber = cds.mobileNumber and c.customerType = cds.customerType)"
//			+ "WHERE c.customerType!= 'ONETIME' AND ((:mobileNumber is not null AND c.mobileNumber = :mobileNumber) "
//			+ "AND (:customerType is not null AND c.customerType = :customerType)) "
//			+ "AND cds.locationCode = :locationCode")
	@Query(value = "SELECT new com.titan.poss.sales.dto.response.CustomerDigitalSignatureResponseDto(cds.mobileNumber,"
			+ "cds.ulpNumber," + "cds.applicableTransactionTypes,cds.customer.id,cds.customer.customerName,"
			+ "cds.customer.emailId,cds.customer.customerDetails,cds.customer,cds.customerType,cds.digitalSignature,cds.customerDocumentTxnId) FROM"
			+ " com.titan.poss.sales.dao.CustomerDigitalSignatureDaoExt as cds "
			+ "WHERE (:mobileNumber is not null AND cds.mobileNumber = :mobileNumber) AND (:customerType is not null AND cds.customerType = :customerType) "
			+ "AND cds.locationCode = :locationCode")
	public CustomerDigitalSignatureResponseDto fetchByMobileNumberAndCustomerType(@Param("mobileNumber")String mobileNumber,
			@Param("customerType")String customerType,@Param("locationCode") String locationCode);
	
	@Query(value = "SELECT new com.titan.poss.sales.dto.response.CustomerDigitalSignatureResponseDto(c.mobileNumber,"
			+ "c.ulpId," + " '',c.id,c.customerName,"
			+ "c.emailId,c.customerDetails,c,c.customerType,'','') FROM"
			+ " com.titan.poss.sales.dao.CustomerDaoExt as c " 
			+ "WHERE c.customerType!= 'ONETIME' AND ((:mobileNumber is not null AND c.mobileNumber = :mobileNumber) "
			+ "OR (:ulpId is not null AND c.ulpId = :ulpId))")
	public List<CustomerDigitalSignatureResponseDto> searchCustomerByMobileNumberOrUlpId(@Param("mobileNumber")String mobileNumber,
			@Param("ulpId") String ulpNumber);
	
	@Query(value = "SELECT new com.titan.poss.sales.dto.response.CustomerDigitalSignatureResponseDto(c.mobileNumber,"
            + "c.ulpId," + " '',c.id,c.customerName,"
            + "c.emailId,c.customerDetails,c,c.customerType,'','') FROM"
            + " com.titan.poss.sales.dao.CustomerDaoExt as c "
            + "WHERE ((:mobileNumber is not null AND c.mobileNumber = :mobileNumber) "
            + "OR (:ulpId is not null AND c.ulpId = :ulpId)) AND (:customerType is not null AND c.customerType = :customerType) AND (:customerId is not null AND c.id = :customerId)")
    public CustomerDigitalSignatureResponseDto searchOneCustomerByMobileNumberOrUlpId(@Param("mobileNumber")String mobileNumber,
            @Param("ulpId") String ulpNumber,@Param("customerType")String customerType,@Param("customerId")String customerId);
	
	

	public CustomerDigitalSignatureDaoExt findByMobileNumberAndCustomerTypeAndLocationCode(String mobileNumber,String customerType,String locationCode);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE CustomerDigitalSignatureDaoExt cs set cs.digitalSignature=:digitalSignature where cs.locationCode = :locationCode")
	public void deleteDigitalSignature(@Param("locationCode") String locationCode,@Param("digitalSignature") String digitalSignature);

}
