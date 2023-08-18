/* delete data from all tables*/

DELETE FROM customer_ulp;
DELETE FROM customer_location_mapping;
DELETE FROM customer_master;





 
 
 
 /*insert into customer_master*/	
 
 insert into customer_master( id,	ulp_id,	mobile_number,	customer_type,	title,	customer_name,	email_id,	customer_details,	is_active,	created_by,	created_date,	last_modified_by,	last_modified_date,	is_encrypted,	insti_tax_no,	cust_tax_no) values
 	('EF69B419-7D63-4762-8A77-2BF8714ACDDD',	'700170118645',	'9980XXXXXX',	'regular_customer',	'Ms',	'ABHA',	'one@gmail.com',	NULL,	1,	'jyoti',	'2011-10-30 00:00:00.000',	'jyoti',	'2018-02-04 00:00:00.000',	0,	NULL,	NULL),
 	('71B3E1CB-EE19-4C8D-8B2E-A1E713E51C4C',	'5907',	'NTNyWn+Q1f9/qkjPLWqYfw==',	'INSTITUTIONAL',	'M/S',	'FUHR67AGOWsd3mfAGYF62w==',	'XiqvaBM6uCqh7qepNaEScw==',	'{"type":"Institutional","data":{"addressLines":null,"pinCode":null,"city":null,"state":null,"country":null,"panCardNo":"FQpa7udO6zwBYj/7AyQBeg==","fax":"tcq7ewBHJPN34yqEm8V9ow=="}}',	1,	'sm.khn',	'2020-01-29 12:51:59.968',	'sm.khn',	'2020-01-29 00:00:00.000',	1,	'zodaxUbBZ94ZI07hTGXoaw==',	NULL);
 	
 
 
 /*insert into customer_location_mapping*/
 	
insert into customer_location_mapping(	customer_id,	location_code,	customer_master_id,	created_by,	created_date,	last_modified_by,	last_modified_date) values
(1,	'KHN',	'EF69B419-7D63-4762-8A77-2BF8714ACDDD',	'sm.khn',	'2020-01-24 10:34:07.493',	'sm.khn',	'2020-01-24 10:34:07.493'),
(2,	'KHN',	'71B3E1CB-EE19-4C8D-8B2E-A1E713E51C4C',	'sm.khn',	'2020-01-29 12:51:59.968',	'sm.khn',	'2020-01-29 12:51:59.968');
 	
 	