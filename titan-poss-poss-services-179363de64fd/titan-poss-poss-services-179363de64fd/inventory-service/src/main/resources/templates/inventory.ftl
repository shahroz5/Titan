<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Titan POSS</title>
   
    <style>


body {
  font-family: "IBM Plex Sans Condensed";
  font-size: 14px;
}

.pw-text-center {
  text-align: center;
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
  /* z-index: 9; */
}

.pw-content {
  padding: 0.5cm 1cm;
  /* z-index: 99; */
  position: relative;
  height: 100%;
}

/* Header css */
.pw-header {
  border-bottom: 0.25px solid #ababab;
  align-items: center;
  padding-bottom: 5px;
}

.pw-header__left-content {
  font-size: 24px;
  /* color: #d2ad67; */
  color: #000;
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
}

.pw-header__right-content {
  margin-left: auto;
}

.pw-text-right {
  text-align: right
}

/* .pw-body-content {
  margin-bottom: 100px;
} */

/* end */

/* Sub-header css */
.pw-sub-header {
  padding: 10px 0;
  border-bottom: 0.25px solid #ababab;
}

.pw-sub-header__content1 {
  font-size: 15px;
  font-weight: bold;
}
/* end */

/* Grid component */
.pw-grid {
  padding: 10px 0;
  border-bottom: 0.25px solid #ababab;
}

.pw-grid__img {
  padding: 5px 0 0px;
  position: relative;
}

.pw-grid__header {
  position: relative;
  margin-bottom: 10px;
  /* margin-top: 5px; */
}

/* .pw-grid__header::before {
  position: absolute;
  content: "";
  bottom: -2px;
  border: 1px solid #333333;
  width: 25px;
} */

.pw-grid__address {
  font-size: 12px;
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
  height: 1px;
  border: 0.25px solid #d6d6d6;
  bottom: 9px;
}

.pw-dot-section1::before {
  border: none;
  width: 0;
}



/* Table section css */
.pw-table-section {
  padding: 10px 0;
  position: relative;
  border-bottom: 0.25px solid #ababab;
  margin-bottom: 20px;
}

table {
  width: 100%;
  text-align: left;
}

table,
th,
td {
  border: 0.25px solid #8c8c8c;
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
  padding: 10px 8px;
}

/* .table-bordered {
  border: 1px solid #8c8c8c;
  border-left-width: 0;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 10px;
}

.table-bordered td,
.table-bordered th {
  border-top: 1px solid #8c8c8c;
  border-left: 1px solid #8c8c8c;
}
 page[size="A4"] {
         // page-break-after: always;
          overflow: initial;
         // padding-bottom: 30mm !important;
        }

.table-bordered tbody:first-child tr:first-child td,
.table-bordered thead:first-child tr:first-child th {
  border-top-width: 0;
}

.table-bordered thead:first-child tr:first-child td:first-child,
.table-bordered thead:first-child tr:first-child th:first-child {
  border-top-left-radius: 10px;
}

.table-bordered tbody:last-child tr:last-child td:first-child,
.table-bordered tbody:last-child tr:last-child th:first-child {
  border-bottom-left-radius: 10px;
} */

.pw-table-footer td {
  padding: 15px 8px;
}
/* end */

.pw-content-section {
  /* padding: 10px 0; */
  font-size: 12px;
}

.pw-footer {
  /* position: absolute;
  width: 90%; */
  /* bottom: 28px; */
  /* font-size: 12px;
  padding-bottom: 15px;
    padding-top: 15px; */

    bottom: 0;
    position: fixed;
    width: 100%;
    padding: 0;
}

.pw-footer__top {
  padding: 10px 0;
  border-bottom: 0.25px solid #ababab;
}

.pw-footer__bottom {
  padding-top: 10px;
}

.pw-body-footer {
  margin-top: 100px;
}

@media print {
  body,
  page {
    margin: 0;
    box-shadow: 0;
    border: none;
    position: relative;
  }

  page[size="A4"] {
    overflow: unset;
  }

  .pw-content {
    padding: 0;
  }

  .pw-footer {
    bottom: 0;
    position: fixed;
    width: 100%;
    padding: 0;
    
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
        <#if (einvoice)??>         
	        <div style="text-left; width: ${einvoice.height}px; height: ${einvoice.height}px; margin-top: -10px; padding-bottom: 16px;">
	          <img
              src="data:image/png;base64,${einvoice.qrCode}"
	            alt="Titan" style="height: 100%;width: 100%;"  height=100% width=100%
	          />
	        </div>
        </#if>	 
        <div class="row pw-header">
          <div class="col-auto" style="width: 45%;display: inline-block;">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAoZJREFUSA29Vj2PElEUfRqxgIJtmRgyHVYr2TFxrRwLatRsD4k/QFo6/oEb/8BSUVgYrCl24rYSiRulIXGWWJI4FEvDmvEcdu765muBMHqSs/fdc+87972ZCVmlwqgiPQX9DPgDHvTbGA46sxgsHjxAKu5oFZ7yS5B/RBxptW2XJjY0gk0vEfvBOjV0UeGJPXAP3BUuDOjXBdeCQzduXuum1HHgR89bL9PUGm2ss4AJEw4mW2AqHFTY5IJZwoEZfeVbinmbQcPaE8Z2rheamnc1qb2jNZhJDTtofNceyIt1wRhcKCz2tQo3vQVPQBvU0URCvaGLWFcDnftMUNDFgv6/RNAjC+RJINqIbBSd8Q34DDyN6MxtkHX2Cbm/ARItUPSVoP9xtKI0SXRTamm6l9JPvxEYgwmFBRkokSfeA/tazcO6AxIdkLn0O1izvwmKJtGFVgVTYaPSAmUDcwFNbZBxBd/3871e72G9Xj9qt9tPkBskc8MwfLJSqbxnLjU9ik80Jg2P9igYvQZT4XmeP/4+Tq2jcP9ezDUDYbFYqLNPZ2q5XKrLxaWyLCvR9W6iuqOYz+dVqVRauUwvpmo4HCY6ZnLzyWSirpZXoQGFQkHlcrnV7XkAIvoEMhl+/vU8NDgp4QGMkqFKxvUTYU8mw/mI+X6jmM1mN1K5XA4NZiGT4YdPD2+GyGL4+e975mDrcfyj+ycf3Hw+V9Pp9XtOG5zZzeW2EovFojqwDtTcm6v9R/six+Jtj92MdYeFb0jfhSWlxuPxg8Fg8Ip6rVb7gPAz2hPkv/X/XqWHv3DECDwGXXBT8Oe3A1aDDc8RnWC9UfDQJT+xu0T6bA2e2gV3Hfxi68n/c8MfLKtquXMUgzIAAAAASUVORK5CYII="
              alt="issue-to-factory"
            />
            <span class="pw-header__left-content">Issue to Factory</span>
          </div>
          <div class="col-auto pw-header__right-content pw-light-color" style="width: 50%;display: inline-block;text-align: right;">
            Date. : ${inventoryHeader.issuedDocDate}
          </div>
        </div>
        <div class="row pw-sub-header">
          <div class="col-auto">
            <div class="pw-sub-header__content1">
              Stock Transfer Memo
            </div>
            <div class="pw-sub-header__content2">
              <span class="pw-light-color">STM No. :</span> ${inventoryHeader.locationCode}/STM/${inventoryHeader.id}
            </div>
          </div>
        </div>
        <div class="pw-body-content">
          <div class="row pw-grid no-gutters">
            <div class="col-4" style="display: inline-block; width: 32%;vertical-align: top;">
              <div class="pw-light-color">
                <b>From</b>
              </div>
              <div class="pw-grid__img-container">
                <img
                  class="pw-grid__img"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAb5JREFUOBGVk79OAkEQxm8PaGy4R4CG1gOMjZrQW6AvIP9CDZRW6BvwAp76BtBYn4Ul3FnaGI0vgIUxBgF/c97GjcEDJ5mbnZlvvt2Z3VNWLKVSaaCU6mh/A+vP5/PjMAyngk3Lx0ViktFyuQwltkYcwdu2XQc3EGxEFAcsduiyw5Mk1gkdVMBIBxGRLQWw1zGjTUmkBpFR5KQbcWyY69gsLQ0lsKksFosIn0qlulKjyuWyBCrj8djZlETjqL3iAFVI8zKjKnrNCR1m1ee4soPcSA+/ZvgNmSV+n3xIvgGJj1/Dd/WJhEzLiMVvv0IsKwCKbyl2tY99hTRn86mT7AlAgLR4RCwvMWwx9l3tTyaTCusQfUbPwbhc0lRqI2HoZ/S81H6SBeuLmpjoHZkBvW42m/u8iwt2XSjLGnqed6pzq2z0jlYliG2hj5+z2Q7HlAtIlCQimexeOpMJONlNIgvJZCKl7i49rwBh6aTdLiSR/TkjKWI+B81W64HW3t6n05d/EXFzHV5qGATBB4WHRvFusVgUcofYNnpv5L7/fglQ7PPf9FkOeMEmZuUawtBMcLM/wm+SwxNdKzxC3wR9AdJGzroB6afOAAAAAElFTkSuQmCC"
                  alt="Boutique"
                />
              </div>
            
              <div class="pw-grid__header"><b>Boutique Name: ${inventoryHeader.locationCode} </b></div>
              <div class="pw-grid__address pw-light-color">
                TITAN COMPANY LIMITED<br />
                46 North Usman Road<br />
                T Nagar, Chennai<br />
                Phone : 044 2814 9333/34<br />
                <i> btqurb@titan.co.in</i><br /><br />

                GSTIN : 33AAACT5131A1Z4<br />
                State Code : 33<br />
                CIN : L74999TZ1984PLC001456
              </div>
            </div>
            <div class="col-4" style="display: inline-block; width: 32%;vertical-align: top;">
              <div class="pw-light-color">
                <b>Courier</b>
              </div>
              <div class="pw-grid__img-container">
                <img
                  class="pw-grid__img"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAASCAYAAABFGc6jAAAAAXNSR0IArs4c6QAAAkZJREFUOBG1lN9xm0AQxu+A9+AKjCsQSAUEVxCnApPY7yEVWOnABXhGuAN3YPRuKagCkQqMCgDyWwyeMzo8zkN25rR7u9/tn+8OaWWRJEl87Th7rbVvCau2bau2aaIsy0pb3ObzxEnikKSfxF6tVmvleaFuW79V6l4rFZO4i4E54MvRl63nBcBL1oekK+S47u8BTdFosFutM9r3SfxFfBRZi48mLgfMR7UjwKauzxqtz0VDR2Eebus66WLExTZj/2J736+uSg6c0rlSrqvMiSQRhStULrZIcn39YvAbhmHguu7q1dEbUL3ebrdL0+9wBylFfvXr53giE2yxA3wx648kl4V9gOqb+XyeYL8KdY6FqULz3o4R0A2VxdMTJLiPdV2fF0WRD7jFYpFhyz1+3Ww2D+K3FpIAFMWipyS7u8uhLrYVkjNMlKNmTdNIE0X36iQwFrqtoKB71uOY7KMo+uw4zswWEx8FLojnrEcaOrMWopul8DyVxOKXB/NGGKLqJ36mWGqlrh/bp6v0zWn7piRpaQ+9UEjTpXWi/lBFArmHAOApL2onXU4lHPw2PGeD7oMdQGMtFHLZ+57rPUnCMcbcg0+m8O9RN2MSn0T3PN+MYhn7Z7p7MJObNvGlgb/F7h4T/rWVOgICyliKIrdQVtCtFPhBLBT/lEhTwHPBg5UHdZAc1okkiXAtNGDmTJGjU+mMD/AC+0jA++BLAvt+6hR7x19RjFaTd0RXJQe+gYkosETv6CxBWwV8RTzmzMmAl2/JCv6fzr9DzxzlmYg/TQAAAABJRU5ErkJggg=="
                  alt="Boutique"
                />
              </div>
            
              <div class="pw-grid__header">
                <b>Courier Name : Blue Dart </b>
              </div>
              <div class="pw-grid__address pw-light-color">
                Docket No. : 12345678<br />
                Road Permit No. : test<br />
                Lock No. : test<br />
                Approval code : SCMMELT2101<br />
                Date : 06<sup>th</sup> Sep 19<br />
              </div>
            </div>
            <div class="col-4" style="display: inline-block; width: 32%;vertical-align: top;">
              <div class="pw-light-color">
                <b>To</b>
              </div>
              <div class="pw-grid__img-container">
                <img
                  class="pw-grid__img"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAbBJREFUOBGNU7tSwkAUzQYdG14NpTNksDeB2jGlHfoFhIYW+ALkD/gBUP9A/iB+AMxaOGPBoJZWYOkIxHN2srqjQHJnNnfPveeevfuIsGKrVqsDIURb4xQ+XK/XV1LKJbkH/LiwWGQcRZFkLMGK5Nu2HYA3IFcJxQELK3SwwisTSYYd+OBwB0rIZgHUA7hxWhHWwHgUZe6GwIZyAF/Alu4ZSGubzUbxM5lMhzWiVqsx4E8mk2JaEc1D7S0aqEPU4RnVMe7QYRFn1UO7XIE30gVuGLjJswTuIS+Rb0IkBG4Au7ojimkbY/IX+4gVSEDxA4pdjeE/IFq28QmQ7JJAIrZ4iZjDGLwXY1fj6XTqYy4x3jD64Li4pCVrleHQr7HnSON9HtyQw+Sod2QG9LzVah1+rVZPxMKy3kej0ZnObfM7hRaLhcjmcscv83muVColdqoe5LYV4tiRU6k8Z/P5/h6OSu3sKC78vBkOT5JEmE/qKI2G4vzrCDfXxkuVs9mMhAvP885NNVw5/4BTjEcz/iOE4hD/TQ/JAV6wydk651syE7jZX8NvUgbiSDQ8wtAkfQPz7r5SKcv85AAAAABJRU5ErkJggg=="
                  alt="Boutique"
                />
              </div>
            
              <div class="pw-grid__header">
                <b>Factory Name: ${inventoryHeader.locationCode} </b>
              </div>
              <div class="pw-grid__address pw-light-color">
                TITAN COMPANY LIMITED<br />
                Jewellery Stores<br />
                29 Sipcot Indl. Complex<br />
                Hosur - 635126<br />
                Phone : 043 4466 4778<br /><br />

                GSTIN : 33AAACT5131A1Z4<br />
                State Code : 33<br />
                CIN : L74999TZ1984PLC001456
              </div>
            </div>
          </div>
          <div class="pw-table-section page-break">
            <div class="pw-grid__header"><b>Product List </b></div>

            <table class="table-bordered">
              <thead>
                <tr>
                  <th rowspan="2" class="pw-text-center">S.No.</th>
                  <th rowspan="2">
                    Variant Code/<br />
                    HSN Code
                  </th>
                  <th rowspan="2">Lot No</th>
                  <th rowspan="2" class="pw-text-center">Qty</th>
                  <th colspan="2">Wt (gms)</th>
                  <th rowspan="2">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAYAAAB4zEQNAAAAAXNSR0IArs4c6QAAAI5JREFUGBljLCgo+MPIyMjMgAb+//8fyAgTAyoSACqaAOQL9Pf3B4DEGQsLCx8AaXkQBxlg6ARK9gN1C8J0sgB1fgAK8kN1HQTqABsJ4rMAOQ1AOh+IDSdMmABSCAdgBwF1LwAq0geKOiIrYAIpA9qRALTrI4gJ4sMAWBLEAdkFVGAI9FICTBKFBvkVWQAAdCEykIK6pSsAAAAASUVORK5CYII="
                    />

                    Price<span class="pw-light-color">/unit</span>
                  </th>
                  <th colspan="3">Total tax</th>
                  <th rowspan="2">Net Amt</th>
                </tr>
                <tr>
                  <td>Unit</td>
                  <td>Gross</td>
                  <td>IGST</td>
                  <td>CGST</td>
                  <td>SGST</td>
                </tr>
              </thead>
              <tbody>
              <#list inventoryChildList as item>
                <tr>
                  <td class="pw-text-center">${item?counter}</td>
                  <td>
                    <span class="pw-bold-font"
                      >${item.itemCode} -</span
                    >
                    Gold plain
                  </td>
                  <td>${item.lotNumber}</td>
                  <td class="pw-text-center">${item.issuedQuantity}N</td>
                  <td>${item.stdWeight}</td>
                  <td>${item.issuedWeight}</td>
                  <td>${item.stdValue}</td>
                  <td>0.0</td>
                  <td>0.0</td>
                  <td>0.0</td>
                  <td>${item.issuedValue}</td>
                </tr>
    		</#list>           
    
                <tr class="pw-table-footer">
                  <td colspan="4">
                    <span class="pw-bold-font">Total</span> (in numbers)
                  </td>
                  <td><b>${inventoryHeader.totalIssuedWeight}</b></td>
                  <td><b>${inventoryHeader.totalIssuedWeight}</b></td>
                  <td>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAYAAAB4zEQNAAAAAXNSR0IArs4c6QAAAI5JREFUGBljLCgo+MPIyMjMgAb+//8fyAgTAyoSACqaAOQL9Pf3B4DEGQsLCx8AaXkQBxlg6ARK9gN1C8J0sgB1fgAK8kN1HQTqABsJ4rMAOQ1AOh+IDSdMmABSCAdgBwF1LwAq0geKOiIrYAIpA9qRALTrI4gJ4sMAWBLEAdkFVGAI9FICTBKFBvkVWQAAdCEykIK6pSsAAAAASUVORK5CYII="
                    />
                    <b>${inventoryHeader.totalIssuedValue}</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAYAAAB4zEQNAAAAAXNSR0IArs4c6QAAAFxJREFUGBljZGBg+APEzECMDgKRBQSAnAVAvAFZ8AGQ8x8LDkBWBNI5H4hRdH5A0nUAyAYpgoMCIOs+EKMIwmWBjAVAfB6IcSo4AJQE2YkVgHRdAOIErLJAQRRjAVPgE4ebP6eFAAAAAElFTkSuQmCC"
                    />
                    <span class="pw-bold-font">${inventoryHeader.totalIssuedValue}</span>
                  </td>
                </tr>
                <tr class="pw-table-footer">
                  <td colspan="11" rowspan="2">
                    <span class="pw-bold-font">Total</span> (in words) : ${inventoryHeader.totalIssuedValueInWords}
                    only.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pw-light-color pw-content-section">
            Space for TITAN COMPANY LIMITED
          </div>

          <div class="pw-body-footer page-break">
            <b>Boutique Manager/Cashier</b>
          </div>
        </div>

        <div class="pw-footer">
          <div class="row pw-footer__top pw-text-right">
          
            <div class="col-auto ml-auto pw-light-color ">
              1/1
            </div>
          </div>
          <div class="pw-light-color pw-footer__bottom">
            Corporate Office Address : TITAN COMPANY LTD., Integrity, #193,
            Veerasandra, Electronics City P.O., Off Hosur main<br />
            road, Bangalore 560100, India, Tel +91 80 6704 7000, Fax +91 80 6704
            6262
          </div>
        </div>
      </div>

  </body>

</html>
