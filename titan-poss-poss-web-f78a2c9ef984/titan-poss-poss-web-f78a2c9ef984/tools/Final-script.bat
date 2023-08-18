call npx create-nx-workspace@latest poss-web
call cd poss-web
call npm install --save-dev @nrwl/angular
rem Creation of Applications
call nx g @nrwl/angular:app eposs --unit-test-runner=karma  --tags="scope:eposs,type:app" --style="scss"
call nx g @nrwl/angular:app poss  --unit-test-runner=karma  --tags="scope:poss,type:app" --style="scss"
call ng add @angular/material
call npm install --save @ngrx/effects
call npm install --save @ngrx/entity
call npm install --save @ngrx/router-store
call npm install --save @ngrx/store
call npm install --save angular2-hotkeys
call npm install --save bootstrap
call npm install --save core-js
call npm install --save hammerjs
call npm install --save moment
call npm install --save moment-es6
call npm install --save @angular/material-moment-adapter
call npm install --save-dev @compodoc/compodoc
call npm install --save-dev @ngrx/store-devtools
call npm install --save-dev @ngx-translate/core
call npm install --save-dev @ngx-translate/http-loader
call npm install --save-dev @types/jasmine
call npm install --save-dev @types/jasminewd2
call npm install --save-dev @types/lodash.clonedeep
call npm install --save-dev @types/node
call npm install --save-dev codelyzer
call npm install --save-dev dotenv
call npm install --save-dev eslint
call npm install --save-dev jasmine-core
call npm install --save-dev jasmine-marbles
call npm install --save-dev jasmine-spec-reporter
call npm install --save-dev karma
call npm install --save-dev karma-chrome-launcher
call npm install --save-dev karma-coverage-istanbul-reporter
call npm install --save-dev karma-html-detailed-reporter
call npm install --save-dev karma-jasmine
call npm install --save-dev karma-jasmine-html-reporter
call npm install --save-dev karma-junit-reporter
call npm install --save-dev karma-spec-reporter
call npm install --save-dev ng-packagr
call npm install --save-dev prettier
call npm install --save-dev protractor
call npm install --save-dev sonar-scanner
call npm install --save-dev ts-node
call npm install --save-dev tsickle
call npm install --save-dev tslint
call npm install --save-dev typescript
rem creation of Common modules used across the apps , libs
call nx g @nrwl/angular:lib  custom-material --directory=common --unit-test-runner=karma --tags="scope:common,type:ui" --style="scss"
rem creation of shared libraries
call nx g @nrwl/workspace:lib assets --directory=shared --unit-test-runner=none --tags="scope:shared,type:assets"
call nx g @nrwl/workspace:lib styles --directory=shared --unit-test-runner=none --tags="scope:shared,type:styles"
rem Appsetting
call nx g @nrwl/angular:lib data-access-appsetting --directory=shared/appsetting --unit-test-runner=karma --tags="scope:shared,type:data-access" --style="scss"
call nx g @nrwl/angular:lib feature-appsetting --directory=shared/appsetting --unit-test-runner=karma --tags="scope:shared,type:feature" --style="scss"

rem Authentication
call nx g @nrwl/angular:lib data-access-auth --directory=shared/auth --unit-test-runner=karma --tags="scope:shared,type:data-access" --style="scss"
call nx g @nrwl/angular:lib feature-auth --directory=shared/auth --unit-test-runner=karma --tags="scope:shared,type:feature" --style="scss"
rem location-mapping
call nx g @nrwl/angular:lib data-access-location-mapping --directory=shared/location-mapping --unit-test-runner=karma --tags="scope:shared,type:data-access" --style="scss"
call nx g @nrwl/angular:lib feature-location-mapping --directory=shared/location-mapping --unit-test-runner=karma --tags="scope:shared,type:feature" --style="scss"
rem login
call nx g @nrwl/angular:lib feature-login-shell --directory=shared/login --unit-test-runner=karma --tags="scope:shared,type:feature" --style="scss"
call nx g @nrwl/angular:lib ui-login-form --directory=shared/login --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem masters
call nx g @nrwl/angular:lib data-access-masters --directory=shared/master --unit-test-runner=karma --tags="scope:shared,type:data-access" --style="scss"
rem models
call nx g @nrwl/angular:lib models --directory=shared --unit-test-runner=karma  --tags="scope:shared,type:util" --style="scss"
rem navigation
call nx g @nrwl/angular:lib data-access-navigation --directory=shared/navigation --unit-test-runner=karma --tags="scope:shared,type:data-access" --style="scss"
call nx g @nrwl/angular:lib feature-navigation --directory=shared/navigation --unit-test-runner=karma --tags="scope:shared,type:feature" --style="scss"
call nx g @nrwl/angular:lib ui-side-menu --directory=shared/navigation --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
call nx g @nrwl/angular:lib ui-top-menu --directory=shared/navigation --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem ngrx-router
call nx g @nrwl/angular:lib data-access-router --directory=shared/ngrx-router --unit-test-runner=karma --tags="scope:shared,type:data-access" --style="scss"
call nx g @nrwl/angular:lib feature-router --directory=shared/ngrx-router --unit-test-runner=karma --tags="scope:shared,type:feature" --style="scss"
rem ACL- Encoder
call nx g @nrwl/angular:lib util-acl-encoder --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem Adaptors
call nx g @nrwl/angular:lib util-adaptors --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem API Service
call nx g @nrwl/angular:lib util-api-service --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem barcode reader
call nx g @nrwl/angular:lib util-barcode-reader --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem Config
call nx g @nrwl/angular:lib util-config --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem Error List
call nx g @nrwl/angular:lib util-error --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem Hotkey service/shortcut key service
call nx g @nrwl/angular:lib util-hotkeys --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem Meta Reducer
call nx g @nrwl/angular:lib util-meta-reducer --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem logger
call nx g @nrwl/angular:lib util-notification --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
call nx g @nrwl/angular:lib util-logger --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem SiteRoutes
call nx g @nrwl/angular:lib util-site-routes --directory=shared --unit-test-runner=karma --tags="scope:shared,type:util" --style="scss"
rem UIComponents
rem Card-list
call nx g @nrwl/angular:lib ui-card-list --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem Dynamic-Form
call nx g @nrwl/angular:lib ui-dynamic-form --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem expansion-panel
call nx g @nrwl/angular:lib ui-expansion-panel --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem filter-dialog
call nx g @nrwl/angular:lib ui-filter-dialog --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem UI Formatters
call nx g @nrwl/angular:lib ui-formatters --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem UI Loaders
call nx g @nrwl/angular:lib ui-loader --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem UI Overlay Notification
call nx g @nrwl/angular:lib ui-overlay-notification --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem UI Search
call nx g @nrwl/angular:lib ui-search --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem UI Search List
call nx g @nrwl/angular:lib ui-search-list --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem UI Selection Dialog
call nx g @nrwl/angular:lib ui-selection-dialog --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem UI Sort Dialog
call nx g @nrwl/angular:lib ui-sort-dialog --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem UI Thumbnail
call nx g @nrwl/angular:lib ui-thumbnail --directory=shared/components --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem creation of App specific libraries
rem Home Page/Landing page
call nx g @nrwl/angular:lib feature-Home --directory=eposs/Home --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss" --dry-run
rem Inventory
call nx g @nrwl/angular:lib data-access-Inventory-home --directory=eposs/Inventory-home --unit-test-runner=karma --tags="scope:eposs,type:data-access" --style="scss"
call nx g @nrwl/angular:lib feature-Inventory-home --directory=eposs/Inventory-home --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss"
rem Data-Upload
call nx g @nrwl/angular:lib data-access-data-upload --directory=eposs/data-upload --unit-test-runner=karma --tags="scope:eposs,type:data-access" --style="scss"
rem App specific Shared components
rem Courier Detail Popup
call nx g @nrwl/angular:lib ui-courier-details-popup --directory=eposs/shared --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem out of stock Popup
call nx g @nrwl/angular:lib ui-out-of-stock-popup --directory=eposs/shared --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem stock issues
call nx g @nrwl/angular:lib data-access-stock-issue --directory=eposs/stock-issue --unit-test-runner=karma --tags="scope:eposs,type:data-access" --style="scss"
call nx g @nrwl/angular:lib feature-stock-issue-details --directory=eposs/stock-issue --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss"
call nx g @nrwl/angular:lib feature-stock-issue-list --directory=eposs/stock-issue --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss"
rem call nx g @nrwl/angular:lib ui-stock-issue-item --directory=eposs/stock-issue --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
call nx g @nrwl/angular:lib ui-stock-issue-item-list --directory=eposs/stock-issue --unit-test-runner=karma --tags="scope:shared,type:ui" --style="scss"
rem stock-return
call nx g @nrwl/angular:lib data-access-stock-return --directory=eposs/stock-return --unit-test-runner=karma --tags="scope:eposs,type:data-access" --style="scss"


nx g @nrwl/angular:lib data-access-state-tax-config  --directory=eposs/state-tax-config  --unit-test-runner=karma --tags="scope:eposs,type:data-access" --style="scss"
nx g @nrwl/angular:lib feature-state-tax-config-detail  --directory=eposs/state-tax-config  --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss"
nx g @nrwl/angular:lib ui-state-tax-config-detail  --directory=eposs/state-tax-config  --unit-test-runner=karma --tags="scope:eposs,type:ui" --style="scss"
nx g @nrwl/angular:lib ui-state-tax-config-list  --directory=eposs/state-tax-config  --unit-test-runner=karma --tags="scope:eposs,type:ui" --style="scss"
nx g @nrwl/angular:lib feature-state-tax-config-listing  --directory=eposs/state-tax-config --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss"

nx g @nrwl/angular:lib data-access-cash-payment-config  --directory=eposs/cash-payment-config  --unit-test-runner=karma --tags="scope:eposs,type:data-access" --style="scss"
nx g @nrwl/angular:lib feature-cash-payment-config-detail  --directory=eposs/cash-payment-config  --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss"
nx g @nrwl/angular:lib ui-cash-payment-config-detail  --directory=eposs/cash-payment-config  --unit-test-runner=karma --tags="scope:eposs,type:ui" --style="scss"

nx g @nrwl/angular:lib data-access-grf-tolerance-config  --directory=eposs/grf-tolerance-config  --unit-test-runner=karma --tags="scope:eposs,type:data-access" --style="scss"
nx g @nrwl/angular:lib feature-grf-tolerance-config-detail  --directory=eposs/grf-tolerance-config  --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss"
nx g @nrwl/angular:lib feature-grf-tolerance-config-listing  --directory=eposs/grf-tolerance-config --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss"
nx g @nrwl/angular:lib ui-grf-tolerance-config-detail  --directory=eposs/grf-tolerance-config  --unit-test-runner=karma --tags="scope:eposs,type:ui" --style="scss"
nx g @nrwl/angular:lib ui-grf-tolerance-config-list  --directory=eposs/grf-tolerance-config  --unit-test-runner=karma --tags="scope:eposs,type:ui" --style="scss"

nx g @nrwl/angular:lib data-access-grn-interboutique-config  --directory=eposs/grn-interboutique-config  --unit-test-runner=karma --tags="scope:eposs,type:data-access" --style="scss"
nx g @nrwl/angular:lib feature-grn-interboutique-config  --directory=eposs/grn-interboutique-config  --unit-test-runner=karma --tags="scope:eposs,type:feature" --style="scss"
nx g @nrwl/angular:lib ui-grn-interboutique-config  --directory=eposs/grn-interboutique-config  --unit-test-runner=karma --tags="scope:eposs,type:ui" --style="scss"