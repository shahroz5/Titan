<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Titan POSS</title>

    <style>
      body {
        background: #ffff;
        font-family: sans-serif;
        font-size: 13px;
        line-height: 18px;
      }

      .pw-text-center {
        text-align: center;
      }

      .pw-text-right {
        text-align: right;
      }

      page {
        background: white;
        display: block;
        margin: 0 auto;
        margin-bottom: 0.5cm;
        border: 1px solid #ccc;
        position: relative;
      }
      page[size="A4"] {
        width: 21cm;
        height: 29.7cm;
        overflow-y: auto;
      }
      page[size="A4"][layout="landscape"] {
        width: 29.7cm;
        height: 21cm;
      }

      .pw-light-color {
        color: #333333;
        font-weight: normal;
      }

      .pw-bold-font {
        color: #000;
        font-weight: bold;
      }

      .pw-body-img {
        position: absolute;
        right: 0;
      }

      .pw-content {
        padding: 0.5cm 1cm;
        position: relative;
        height: 100%;
      }

      .pw-header {
        border-bottom: 1px solid #ababab;
        align-items: center;
        padding-bottom: 5px;
        /* display: flex; */
        position: relative;
      }

      .pw-header__left-content {
        font-size: 20px;
        color: #000;
        font-family: "Montserrat", sans-serif;
        font-weight: 900;
      }

      .pw-header__right-content {
        margin-left: auto;
      }

      .pw-margin-left {
        margin-left: auto;
      }

      .pw-padding-right-15 {
        padding-right: 15px;
      }

      .pw-sub-header {
        padding: 10px 0;
        border-bottom: 1px solid #ababab;
      }

      .pw-sub-header__content1 {
        font-size: 15px;
        font-weight: bold;
      }

      .pw-grid {
        padding: 10px 0;
        /* border-bottom: 1px solid #ababab; */
        /* display: flex; */
      }

      .pw-grid__column {
        /* width: 33%; */
      }

      .pw-grid__img {
        padding: 5px 0 0px;
        position: relative;
      }

      .pw-grid__header {
        position: relative;
        margin-bottom: 10px;
      }

      .pw-grid__header::before {
        position: absolute;
        content: "";
        bottom: -2px;
        border: 1px solid #333333;
        width: 25px;
      }

      .pw-grid__address {
        font-size: 14px;
      }

      .pw-grid__img-container {
        position: relative;
      }

      .pw-dot-section {
        position: relative;
      }

      .pw-dot-section img {
        position: relative;
        background: #fff;
      }

      .pw-dot-section::before {
        position: absolute;
        content: "";
        width: 100%;
        border: 1px solid #d6d6d6;
        bottom: 9px;
      }

      .pw-dot-section1::before {
        border: none;
        width: 0;
      }

      .pw-table-section {
        padding: 10px 0;
        position: relative;
        /* margin-bottom: 20px; */
      }

      table {
        width: 100%;
        text-align: left;
      }

      table,
      th,
      td {
        border: 1px solid #8c8c8c;
        border-radius: 5px;
        border-collapse: collapse;
        font-size: 10px;
      }

      th,
      td {
        padding: 5px 8px;
      }

      td {
        color: #333333;
      }

      tbody td {
        padding: 5px 8px;
      }

      .pw-table-footer td {
        padding: 5px 8px;
      }

      .pw-content-section {
        font-size: 12px;
        border-top: 1px solid #ababab;
        padding: 5px 0;
      }

      .pw-footer {
        position: absolute;
        width: 90%;
        font-size: 12px;
        padding-bottom: 15px;
        padding-top: 15px;
        line-height: 16px;
      }

      .pw-footer__top {
        padding: 10px 0;
      }

      .pw-footer__bottom1 {
        padding: 10px 0;
        border-top: 1px solid #ababab;
      }

      .pw-footer__bottom2 {
        padding-top: 10px;
        border-top: 1px solid #ababab;
      }

      .pw-body-footer {
        margin-top: 110px;
      }

      input[type="text"] {
        border: none;
        border-bottom: 2px dotted rgb(122, 121, 121);
        width: 100%;
        margin-bottom: 3px;
      }

      .pw-input1 {
        width: 100%;
      }

      .pw-input2 {
        width: 74%;
      }

      .pw-input3 {
        width: 79%;
      }
      .pw-listing {
        padding: 0 20px;
        margin: 0;
      }

      @media print {
        body,
        page {
          box-shadow: 0;
          border: none;
          position: relative;
          page-break-before:none;
          page-break-after:none;
          page-break-inside:avoid
          /* margin: 0mm 0mm 30mm 0mm !important;
          padding-bottom: 30mm !important; */
        }

        page[size="A4"] {
          page-break-after: always;
          overflow: initial;
          /* padding-bottom: 30mm !important; */
        }

        .pw-content {
          padding: 0;
          height: 26cm;
          overflow-y: initial;
          page-break-before:none;
          page-break-after:none;
          page-break-inside:avoid
          /* padding-bottom: 30mm !important; */
        }

        .pw-footer {
          /*bottom: 0;
          position: fixed;*/
          width: 100%;
          padding: 0;
          height: 30mm;
        }

        .pw-input1 {
          width: 100%;
        }

        .pw-input2 {
          width: 77%;
        }

        .pw-input3 {
          width: 82%;
        }
      }
    </style>
  </head>
  <body>
    <div class="pw-content">
      <div class="pw-text-center pw-logo-section">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAoCAYAAACIC2hQAAAAAXNSR0IArs4c6QAAAmxJREFUWAntVsFx2zAQVDL5h6kgSAVhCeggKoEluIMoHagEpgK7g8AVmKnA6iDswN4dE9YahkmBOM7k4ZtZ4Q53t7cAOTZ3O1trhC7A9xJXuR+qus/NDu5P4BvgAdrD07IbsPYA12i30UlWh/gr8BcYgWdLhTpkfgB6M8/FGYd1HminHAUwpkWhT1H574CWX8CNtnLgNUDyGgT0R6vh0d6rSMiV6jW51g8km2wtR66v/QRSKv4e2QtXvkuX9n5B7R5wQAs0wJKx7jNwRaFspv0GhgmMPX8yFqY91pLozxQvLSMK+qWiJN8gPgKO+yTwdFaYR48+qiAcuk+/xg5s7viz0jz6VFAQHt2vFcqbrTKPbhV0J2y6Xyt091GILdzWgiTHYS00N8Nkz1rorYmqDIm10MwIm613oTb3eGZ5v9HzXdh4W96o6V+ALYWmV+nSjZLYWmiQ4fzYUXMalPq1Quc+FoZSMXP1tULT/+0nGZYKTWuldNmtFeqSESpOfZaltUnrtmEAffycGzOjTpLXT8BM6XZbjYig2JvMqD6pYc8qq3n0PpmYExqSmrQnSW8THkGrj/2t2xqlrt9GyjzrpQL0QP9A+daB5qetzO7RF2+Tq5/hcchp7WGm1jwVwBiH01+yAwpi/f1SsVXeyVAOZ7xkfNwjEMV2Sw0W+R4kceCxgFBfl83fVS8ieUNNgVCW8mDxkNeFvReXU9S9DPIXd74sDAij2P3LlE3Uy4CugpIHHiYuvgJtBder1h478Ra6V9nyDYrtAXKaiY2EJ5Canh58HXACKHYPrDKe+g4YgQOwpVFkD7RrhrCZ+C/sES4T358RuZxpAAAAAElFTkSuQmCC"
          alt="Titan"
        />
      </div>

      <div class="row">
        <div class="col-auto" style="text-align: center">
          <div class="pw-header__left-content">DECLARATION FORM</div>
        </div>
      </div>
      <div class="row">
        <div class="col-auto" style="text-align: center">
          <h3>TANISHQ EXCHANGE PROGRAM</h3>
        </div>
      </div>
      <!-- <div class="row pw-sub-header">
          <div class="col-auto">
            <div class="pw-sub-header__content1">Delivery Challan</div>
            <div class="pw-sub-header__content2">
              <span class="pw-light-color">Delivery Challan No. : </span>
              VLS/ADJ/53
            </div>
          </div>
        </div> -->
      <div class="pw-body-content">
        <div class="row pw-grid">
          <div
            class="col-4 pw-grid__column"
            style="display: inline-block; width: 60%; vertical-align: top"
          >
            <div class="pw-light-color" style="margin-bottom: 5px">
              <b>To</b>
            </div>
            <div class="pw-grid__address pw-light-color">
              <div>
                The Manager,
              </div>
              <div>
                Titan Company Limited,
              </div>
               <#list storeDetails.addressLines as address>
                   <div>
                    ${address}
                   </div>
                </#list>
                <div>
                  PINCODE - ${storeDetails.pincode}
                </div>
            </div>
          </div>
          <div
            class="col-4 pw-grid__column pw-margin-left"
            style="display: inline-block; vertical-align: top;width: 30%;"
          >
            <div class="pw-grid__address pw-light-color">Date : ${businessDateStr}</div>
          </div>
        </div>
        <div style="margin-top: 10px">Dear Sir,</div>
        <div style="margin-top: 10px">
          I voluntarily offer my jewellery that I have purchased from Tanishq
          for the purpose of exchanging in the same under the Tanishq Exchange
          Program.
        </div>
        <div style="margin-top: 10px">I therefore agree:</div>
        <div style="margin-top: 5px">
          <ol class="pw-confirmation-box__item">
            <li class="pw-confirmation-box__margin-top-5">
              For melting / breaking the jewellery given by me to assess /
              verify and losses if any, during the process due to dirt, volatile
              impurity etc.
            </li>
            <li class="pw-confirmation-box__margin-top-5">
              That in case I take back or the company given back the jewellery
              for any reason after melting / breaking before exchange / billing,
              it will not be returned in the original form and weight.
            </li>
            <li class="pw-confirmation-box__margin-top-5">
              To the result of assessment / purity test, weight of the gold, the
              estimated value of my gold and / or stones including standard
              deduction plus and additional deduction of 10% increase of cash
              back of studded jewellery and 3% increase of cash back of plain
              jewellery.
            </li>
          </ol>
        </div>
        <div style="margin-top: 20px">
          Further, I have read, understood and am satisfied with the terms and
          conditions of the scheme and I agree to the same
        </div>
        <div style="margin-top: 10px">Thank you,</div>
        <div style="margin-top: 10px">Yours Sincerely</div>
        <#if (custSignature)??>         
	        	<div style="text-left; width: 200px;">
	          	<img
              	src="${custSignature}"
	            alt="Titan" style="max-width:100%;padding-top:-50px;"  height=100% width=100%
	          	/>
	        	</div>
        		</#if>	
        <div style="margin-top: 20px">(Customer Signature)</div>
        <div style="margin-top: 10px">Customer details:</div>
        <div style="margin-top: 10px">
          Name:${customer.customerName}
        </div>
        <div style="margin-top: 10px">
          Address:  <#if (customer.address.addressLines)??>
                <#list customer.address.addressLines as address>
                   ${address},
                </#list>
                </#if><br />
                  <#if (customer.address.city)??> ${customer.address.city}</#if> - <#if (customer.address.pincode)??>${customer.address.pincode}</#if>, <#if (customer.address.state)??>${customer.address.state}</#if></br>
        </div>
        <div style="margin-top: 10px">
        </div>
      </div>

      <div class="pw-footer">
        <div class="pw-footer-content">
          <div class="row pw-footer__top">
            <div class="col-auto ml-auto pw-light-color">1/1</div>
          </div>
          <div class="pw-light-color pw-footer__bottom1">E&OE See Overleaf</div>
          <div class="pw-light-color pw-footer__bottom2">
            Corporate Office Address : TITAN COMPANY LTD., Integrity, #193,
            Veerasandra, Electronics City P.O., Off Hosur main<br />
            road, Bangalore 560100, India, Tel +91 80 6704 7000, Fax +91 80 6704
            6262
          </div>
        </div>
      </div>
    </div>
  </body>   
</html>
