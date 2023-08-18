/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/

 
/*
DATABASE SELECT
*/

use test_payments;

 /*
TRUNCATE TABLE
*/

delete from payment_lov_master;
delete from payment_config_details;
delete from config_location_mapping;
delete from payment_master;
delete from payment_config_master;

/* cashbackOffer tables */
delete from cashback_product_mapping;
delete from cashback_offer_details;
delete from cashback_card_details;
delete from cashback_master;


/* insert data into cashback_master*/

insert into cashback_master(cashback_id, bank_name, card_no_length, start_date, end_date, first_digits, last_digits, validate_mobile, max_usage_count, cm_remarks, offer_remarks, is_active, created_by, created_date, last_modified_by, last_modified_date, exclude_cashback) values
('NEWID()', 'AXIS', 10, GETDATE(),GETDATE(), 5, 5, 1, 2, 'REMARKS', 'REMARKS', 1, 'admin', GETDATE(),'admin', GETDATE(),1);

insert into cashback_card_details(id, cashback_id, card_no, is_active, created_by, created_date, last_modified_by, last_modified_date) values
(NEWID(), '{0FBF8A15-0531-4D7E-B996-B2EFB6C95C16}', '12345',1,'admin', GETDATE(), 'admin', GETDATE()),
(NEWID(), '{0FBF8A15-0531-4D7E-B996-B2EFB6C95C16}', '1234098',1,'admin', GETDATE(), 'admin', GETDATE());

insert into cashback_offer_details(id,cashback_id, min_swipe_amount,max_swipe_amount,min_invoice_amount,max_invoice_amount,discount_amount,discount_percent,max_discount_amount,is_active, created_by, created_date, last_modified_by, last_modified_date, row_id) values
(NEWID(), '{0FBF8A15-0531-4D7E-B996-B2EFB6C95C16}',0, 49999, 0,49999, 0,0,0,1,'admin', GETDATE(), 'admin', GETDATE(),1);

insert into cashback_product_mapping(id, cashback_id, product_group_code, is_active, created_by, created_date, last_modified_by, last_modified_date) values
(NEWID(), '{0FBF8A15-0531-4D7E-B996-B2EFB6C95C16}', '71',1,'admin', GETDATE(), 'admin', GETDATE());

/* set id auto-generation to 1*/

DBCC CHECKIDENT (payment_config_master, RESEED, 0);

/*
Insert Data in Revenue Lov Master
*/

insert into payment_lov_master(id, lov_type, code, value, is_active, created_by, created_date, last_modified_by, last_modified_date) values 
        (NEWID(), 'TRANSACTION_TYPE', 'Cash Memo', 'Cash Memo',1, 'rahul', GETDATE(), 'rahul', GETDATE()),
        (NEWID(), 'TRANSACTION_TYPE', 'Advance Order', 'Advance Order',1, 'rahul', GETDATE(), 'rahul', GETDATE());
		
/*
Insert Data in Payment Master
*/

insert into payment_master(payment_mode, description, payment_group, is_active, created_by, created_date, last_modified_by, last_modified_date) values
        ('CASH','Cash Payment','REGULAR',1, 'rahul', GETDATE(), 'rahul', GETDATE()),
		('CARD','Card Payment','REGULAR',1, 'rahul', GETDATE(), 'rahul', GETDATE());
		
/*
Insert Data in Config Master
*/

insert into payment_config_master(description, is_active, created_by, created_date, last_modified_by, last_modified_date) values
        ('Payment Config 1',1, 'rahul', GETDATE(), 'rahul', GETDATE()),
		('Payment Config 2',1, 'rahul', GETDATE(), 'rahul', GETDATE());

/*
Insert Data in Config Details
*/

insert into payment_config_details(id, config_id, payment_mode, transaction_type, config_details, created_by, created_date, last_modified_by, last_modified_date) values
         (NEWID(),1,'CARD','Cash Memo','{}', 'rahul', GETDATE(), 'rahul', GETDATE()),
		 (NEWID(),1,'CASH','Cash Memo','{}', 'rahul', GETDATE(), 'rahul', GETDATE());


/*
Insert Data in Config Location Mapping
*/

insert into config_location_mapping(id, location_code, config_id, created_by, created_date, last_modified_by, last_modified_date)values
        (NEWID(),'URB',1, 'rahul', GETDATE(), 'rahul', GETDATE()),
		(NEWID(),'BGR',1, 'rahul', GETDATE(), 'rahul', GETDATE()),
		(NEWID(),'PNB',1, 'rahul', GETDATE(), 'rahul', GETDATE());  

	/*	delete from gift_master;

		insert into gift_master(serial_no, gift_code,region_code, denomination, quantity, total_value, status, mfg_date, location_code, validity_days, activation_date, valid_from, valid_till, gift_details, remarks, excludes, created_by, created_date , last_modified_by, last_modified_date) values
		(553212532,'GV2000','NORTH',2000,1,2000,'Redeemable',GETDATE(),'URB',365,GETDATE(),GETDATE(),GETDATE(),'{"issuedTo": "Ro North","customerName": "Vouchagram India Private Limited","customerType": "INSTI","discount": "100","discountPercentage": "0","mailDetails": "vouchergram.123@gmail.com"}','ok','excludes','jeeban',GETDATE(),'jeeban',GETDATE()); */