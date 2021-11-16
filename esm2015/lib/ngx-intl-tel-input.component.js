import * as lpn from 'google-libphonenumber';
import { Component, EventEmitter, forwardRef, Input, Output, ViewChild, } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { setTheme } from 'ngx-bootstrap/utils';
import { CountryCode } from './data/country-code';
import { SearchCountryField } from './enums/search-country-field.enum';
import { phoneNumberValidator } from './ngx-intl-tel-input.validator';
import { PhoneNumberFormat } from './enums/phone-number-format.enum';
const ɵ0 = phoneNumberValidator;
export class NgxIntlTelInputComponent {
    constructor(countryCodeData) {
        this.countryCodeData = countryCodeData;
        this.value = '';
        this.preferredCountries = [];
        this.enablePlaceholder = true;
        this.numberFormat = PhoneNumberFormat.International;
        this.cssClass = 'form-control';
        this.onlyCountries = [];
        this.enableAutoCountrySelect = true;
        this.searchCountryFlag = false;
        this.searchCountryField = [SearchCountryField.All];
        this.searchCountryPlaceholder = 'Search Country';
        this.maxLength = '';
        this.selectFirstCountry = true;
        this.phoneValidation = true;
        this.inputId = 'phone';
        this.separateDialCode = false;
        this.countryChange = new EventEmitter();
        this.selectedCountry = {
            areaCodes: undefined,
            dialCode: '',
            htmlId: '',
            flagClass: '',
            iso2: '',
            name: '',
            placeHolder: '',
            priority: 0,
        };
        this.phoneNumber = '';
        this.allCountries = [];
        this.preferredCountriesInDropDown = [];
        // Has to be 'any' to prevent a need to install @types/google-libphonenumber by the package user...
        this.phoneUtil = lpn.PhoneNumberUtil.getInstance();
        this.disabled = false;
        this.errors = ['Phone number is required.'];
        this.countrySearchText = '';
        this.allCountriesMasterData = [];
        this.onTouched = () => { };
        this.propagateChange = (_) => { };
        // If this is not set, ngx-bootstrap will try to use the bs3 CSS (which is not what we've embedded) and will
        // Add the wrong classes and such
        setTheme('bs4');
    }
    ngOnInit() {
        this.init();
    }
    ngOnChanges(changes) {
        const selectedISO = changes['selectedCountryISO'];
        if (this.allCountries &&
            selectedISO &&
            selectedISO.currentValue !== selectedISO.previousValue) {
            this.updateSelectedCountry();
        }
        if (changes.preferredCountries) {
            this.updatePreferredCountries();
        }
        this.checkSeparateDialCodeStyle();
    }
    /*
        This is a wrapper method to avoid calling this.ngOnInit() in writeValue().
        Ref: http://codelyzer.com/rules/no-life-cycle-call/
    */
    init() {
        this.fetchCountryData();
        if (this.preferredCountries.length) {
            this.updatePreferredCountries();
        }
        if (this.onlyCountries.length) {
            this.allCountries = this.allCountries.filter((c) => this.onlyCountries.includes(c.iso2));
        }
        if (this.selectFirstCountry) {
            if (this.preferredCountriesInDropDown.length) {
                this.setSelectedCountry(this.preferredCountriesInDropDown[0]);
            }
            else {
                this.setSelectedCountry(this.allCountries[0]);
            }
        }
        this.allCountriesMasterData = JSON.parse(JSON.stringify(this.allCountries));
        this.updateSelectedCountry();
        this.checkSeparateDialCodeStyle();
    }
    setSelectedCountry(country) {
        this.selectedCountry = country;
        this.countryChange.emit(country);
    }
    /**
     * Search country based on country name, iso2, dialCode or all of them.
     */
    searchCountry() {
        let countrySearchText = this.countrySearchText.replace('+', '');
        if (!countrySearchText) {
            this.allCountries = this.allCountriesMasterData;
            // this.countryList.nativeElement
            // 	.querySelector('.iti__country-list li')
            // 	.scrollIntoView({
            // 		behavior: 'smooth',
            // 		block: 'nearest',
            // 		inline: 'nearest',
            // 	});
            return;
        }
        const countrySearchTextLower = countrySearchText.toLowerCase();
        this.allCountries = this.allCountriesMasterData.filter((c) => {
            if (this.searchCountryField.indexOf(SearchCountryField.All) > -1) {
                // Search in all fields
                if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
                    return c;
                }
                if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
                    return c;
                }
                if (c.dialCode.startsWith(countrySearchText)) {
                    return c;
                }
            }
            else {
                // Or search by specific SearchCountryField(s)
                if (this.searchCountryField.indexOf(SearchCountryField.Iso2) > -1) {
                    if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
                        return c;
                    }
                }
                if (this.searchCountryField.indexOf(SearchCountryField.Name) > -1) {
                    if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
                        return c;
                    }
                }
                if (this.searchCountryField.indexOf(SearchCountryField.DialCode) > -1) {
                    if (c.dialCode.startsWith(countrySearchText)) {
                        return c;
                    }
                }
            }
        });
        // if (this.allCountries.length > 0) {
        // 	const el = this.countryList.nativeElement.querySelector(
        // 		'#' + this.allCountries[0].htmlId
        // 	);
        // 	if (el) {
        // 		el.scrollIntoView({
        // 			behavior: 'smooth',
        // 			block: 'nearest',
        // 			inline: 'nearest',
        // 		});
        // 	}
        // }
        this.checkSeparateDialCodeStyle();
    }
    onPhoneNumberChange() {
        let countryCode;
        // Handle the case where the user sets the value programatically based on a persisted ChangeData obj.
        if (this.phoneNumber && typeof this.phoneNumber === 'object') {
            const numberObj = this.phoneNumber;
            this.phoneNumber = numberObj.number;
            countryCode = numberObj.countryCode;
        }
        this.value = this.phoneNumber;
        countryCode = countryCode || this.selectedCountry.iso2;
        const number = this.getParsedNumber(this.phoneNumber, countryCode);
        // auto select country based on the extension (and areaCode if needed) (e.g select Canada if number starts with +1 416)
        if (this.enableAutoCountrySelect) {
            countryCode =
                number && number.getCountryCode()
                    ? this.getCountryIsoCode(number.getCountryCode(), number)
                    : this.selectedCountry.iso2;
            if (countryCode && countryCode !== this.selectedCountry.iso2) {
                const newCountry = this.allCountries
                    .sort((a, b) => {
                    return a.priority - b.priority;
                })
                    .find((c) => c.iso2 === countryCode);
                if (newCountry) {
                    this.selectedCountry = newCountry;
                }
            }
        }
        countryCode = countryCode ? countryCode : this.selectedCountry.iso2;
        this.checkSeparateDialCodeStyle();
        if (!this.value) {
            // Reason: avoid https://stackoverflow.com/a/54358133/1617590
            // tslint:disable-next-line: no-null-keyword
            this.propagateChange(null);
        }
        else {
            const intlNo = number
                ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
                : '';
            // parse phoneNumber if separate dial code is needed
            if (this.separateDialCode && intlNo) {
                this.value = this.removeDialCode(intlNo);
            }
            this.propagateChange({
                number: this.value,
                internationalNumber: intlNo,
                nationalNumber: number
                    ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
                    : '',
                e164Number: number
                    ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
                    : '',
                countryCode: countryCode.toUpperCase(),
                dialCode: '+' + this.selectedCountry.dialCode,
            });
        }
    }
    onCountrySelect(country, el) {
        this.setSelectedCountry(country);
        this.checkSeparateDialCodeStyle();
        if (this.phoneNumber && this.phoneNumber.length > 0) {
            this.value = this.phoneNumber;
            const number = this.getParsedNumber(this.phoneNumber, this.selectedCountry.iso2);
            const intlNo = number
                ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
                : '';
            // parse phoneNumber if separate dial code is needed
            if (this.separateDialCode && intlNo) {
                this.value = this.removeDialCode(intlNo);
            }
            this.propagateChange({
                number: this.value,
                internationalNumber: intlNo,
                nationalNumber: number
                    ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
                    : '',
                e164Number: number
                    ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
                    : '',
                countryCode: this.selectedCountry.iso2.toUpperCase(),
                dialCode: '+' + this.selectedCountry.dialCode,
            });
        }
        else {
            // Reason: avoid https://stackoverflow.com/a/54358133/1617590
            // tslint:disable-next-line: no-null-keyword
            this.propagateChange(null);
        }
        this.allCountries = this.allCountriesMasterData;
        el.focus();
    }
    onInputKeyPress(event) {
        const allowedChars = /[0-9\+\-\(\)\ ]/;
        const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
        const allowedOtherKeys = [
            'ArrowLeft',
            'ArrowUp',
            'ArrowRight',
            'ArrowDown',
            'Home',
            'End',
            'Insert',
            'Delete',
            'Backspace',
        ];
        if (!allowedChars.test(event.key) &&
            !(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
            !allowedOtherKeys.includes(event.key)) {
            event.preventDefault();
        }
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    writeValue(obj) {
        if (obj === undefined) {
            this.init();
        }
        this.phoneNumber = obj;
        setTimeout(() => {
            this.onPhoneNumberChange();
        }, 1);
    }
    resolvePlaceholder() {
        let placeholder = '';
        if (this.customPlaceholder) {
            placeholder = this.customPlaceholder;
        }
        else if (this.selectedCountry.placeHolder) {
            placeholder = this.selectedCountry.placeHolder;
            if (this.separateDialCode) {
                placeholder = this.removeDialCode(placeholder);
            }
        }
        return placeholder;
    }
    /* --------------------------------- Helpers -------------------------------- */
    /**
     * Returns parse PhoneNumber object.
     * @param phoneNumber string
     * @param countryCode string
     */
    getParsedNumber(phoneNumber, countryCode) {
        let number;
        try {
            number = this.phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
        }
        catch (e) { }
        return number;
    }
    /**
     * Adjusts input alignment based on the dial code presentation style.
     */
    checkSeparateDialCodeStyle() {
        if (this.separateDialCode && this.selectedCountry) {
            const cntryCd = this.selectedCountry.dialCode;
            this.separateDialCodeClass =
                'separate-dial-code iti-sdc-' + (cntryCd.length + 1);
        }
        else {
            this.separateDialCodeClass = '';
        }
    }
    /**
     * Cleans dialcode from phone number string.
     * @param phoneNumber string
     */
    removeDialCode(phoneNumber) {
        const number = this.getParsedNumber(phoneNumber, this.selectedCountry.iso2);
        phoneNumber = this.phoneUtil.format(number, lpn.PhoneNumberFormat[this.numberFormat]);
        if (phoneNumber.startsWith('+') && this.separateDialCode) {
            phoneNumber = phoneNumber.substr(phoneNumber.indexOf(' ') + 1);
        }
        return phoneNumber;
    }
    /**
     * Sifts through all countries and returns iso code of the primary country
     * based on the number provided.
     * @param countryCode country code in number format
     * @param number PhoneNumber object
     */
    getCountryIsoCode(countryCode, number) {
        // Will use this to match area code from the first numbers
        const rawNumber = number['values_']['2'].toString();
        // List of all countries with countryCode (can be more than one. e.x. US, CA, DO, PR all have +1 countryCode)
        const countries = this.allCountries.filter((c) => c.dialCode === countryCode.toString());
        // Main country is the country, which has no areaCodes specified in country-code.ts file.
        const mainCountry = countries.find((c) => c.areaCodes === undefined);
        // Secondary countries are all countries, which have areaCodes specified in country-code.ts file.
        const secondaryCountries = countries.filter((c) => c.areaCodes !== undefined);
        let matchedCountry = mainCountry ? mainCountry.iso2 : undefined;
        /*
            Iterate over each secondary country and check if nationalNumber starts with any of areaCodes available.
            If no matches found, fallback to the main country.
        */
        secondaryCountries.forEach((country) => {
            country.areaCodes.forEach((areaCode) => {
                if (rawNumber.startsWith(areaCode)) {
                    matchedCountry = country.iso2;
                }
            });
        });
        return matchedCountry;
    }
    /**
     * Gets formatted example phone number from phoneUtil.
     * @param countryCode string
     */
    getPhoneNumberPlaceHolder(countryCode) {
        try {
            return this.phoneUtil.format(this.phoneUtil.getExampleNumber(countryCode), lpn.PhoneNumberFormat[this.numberFormat]);
        }
        catch (e) {
            return e;
        }
    }
    /**
     * Clearing the list to avoid duplicates (https://github.com/webcat12345/ngx-intl-tel-input/issues/248)
     */
    fetchCountryData() {
        this.allCountries = [];
        this.countryCodeData.allCountries.forEach((c) => {
            const country = {
                name: c.name,
                iso2: c.code.toLowerCase(),
                dialCode: c.dial_code.replace('+', ''),
                priority: c.priority ? c.priority : 0,
                areaCodes: c.area_codes ? c.area_codes : undefined,
                htmlId: `iti-0__item-${c.code.toLowerCase()}`,
                flagClass: `iti__${c.code.toLocaleLowerCase()}`,
                placeHolder: '',
            };
            if (this.enablePlaceholder) {
                country.placeHolder = this.getPhoneNumberPlaceHolder(country.iso2.toUpperCase());
            }
            this.allCountries.push(country);
        });
        this.allCountries.sort(this.sortAlphabeticallyByField('name'));
    }
    /**
     * Populates preferredCountriesInDropDown with prefferred countries.
     */
    updatePreferredCountries() {
        if (this.preferredCountries.length) {
            this.preferredCountriesInDropDown = [];
            this.preferredCountries.forEach((iso2) => {
                const preferredCountry = this.allCountries.filter((c) => {
                    return c.iso2 === iso2;
                });
                this.preferredCountriesInDropDown.push(preferredCountry[0]);
            });
        }
    }
    /**
     * Updates selectedCountry.
     */
    updateSelectedCountry() {
        if (this.selectedCountryISO) {
            this.selectedCountry = this.allCountries.find((c) => {
                return c.iso2.toLowerCase() === this.selectedCountryISO.toLowerCase();
            });
            if (this.selectedCountry) {
                if (this.phoneNumber) {
                    this.onPhoneNumberChange();
                }
                else {
                    // Reason: avoid https://stackoverflow.com/a/54358133/1617590
                    // tslint:disable-next-line: no-null-keyword
                    this.propagateChange(null);
                }
            }
        }
    }
    /**
     * Resets searched value on dropdown reopen.
     */
    resetCountrySearchText() {
        this.countrySearchText = '';
        this.allCountries = this.allCountriesMasterData;
    }
    /**
     * Sort array of objects alphabetically by field name.
     */
    sortAlphabeticallyByField(field) {
        return (a, b) => {
            if (a[field] < b[field]) {
                return -1;
            }
            if (a[field] > b[field]) {
                return 1;
            }
            return 0;
        };
    }
}
NgxIntlTelInputComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line: component-selector
                selector: 'ngx-intl-tel-input',
                template: "<div class=\"iti iti--allow-dropdown\"\r\n\t[ngClass]=\"separateDialCodeClass\" (click)=\"resetCountrySearchText()\">\r\n\t<div class=\"iti__flag-container\"\r\n\t\tdropdown\r\n\t\t[ngClass]=\"{'disabled': disabled}\"\r\n\t\t[isDisabled]=\"disabled\">\r\n\t\t<div class=\"iti__selected-flag dropdown-toggle\"\r\n\t\t\tdropdownToggle>\r\n\t\t\t<div class=\"iti__flag\"\r\n\t\t\t\t[ngClass]=\"selectedCountry?.flagClass\"></div>\r\n\t\t\t<div *ngIf=\"separateDialCode\"\r\n\t\t\t\tclass=\"selected-dial-code\">+{{selectedCountry.dialCode}}</div>\r\n\t\t\t<div class=\"iti__arrow\"></div>\r\n\t\t</div>\r\n\t\t<div *dropdownMenu\r\n\t\t\tclass=\"dropdown-menu country-dropdown\">\r\n\t\t\t<div class=\"search-container\"\r\n\t\t\t\t*ngIf=\"searchCountryFlag && searchCountryField\">\r\n\t\t\t\t<input id=\"country-search-box\"\r\n\t\t\t\t\t[(ngModel)]=\"countrySearchText\"\r\n\t\t\t\t\t(keyup)=\"searchCountry()\"\r\n\t\t\t\t\t(click)=\"$event.stopPropagation()\"\r\n\t\t\t\t\t[placeholder]=\"searchCountryPlaceholder\"\r\n\t\t\t\t\tautocomplete=\"off\"\r\n\t\t\t\t\tautofocus>\r\n\t\t\t</div>\r\n\t\t\t<ul class=\"iti__country-list\"\r\n\t\t\t\t#countryList>\r\n\t\t\t\t<li class=\"iti__country iti__preferred\"\r\n\t\t\t\t\t*ngFor=\"let country of preferredCountriesInDropDown\"\r\n\t\t\t\t\t(click)=\"onCountrySelect(country, focusable)\"\r\n\t\t\t\t\t[id]=\"country.htmlId+'-preferred'\">\r\n\t\t\t\t\t<div class=\"iti__flag-box\">\r\n\t\t\t\t\t\t<div class=\"iti__flag\"\r\n\t\t\t\t\t\t\t[ngClass]=\"country.flagClass\"></div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<span class=\"iti__country-name\">{{country.name}}</span>\r\n\t\t\t\t\t<span class=\"iti__dial-code\">+{{country.dialCode}}</span>\r\n\t\t\t\t</li>\r\n\t\t\t\t<li class=\"iti__divider\"\r\n\t\t\t\t\t*ngIf=\"preferredCountriesInDropDown?.length\"></li>\r\n\t\t\t\t<ng-container *ngIf=\"allCountries?.length; else noRecordFound\">\r\n\t\t\t\t\t<li class=\"iti__country iti__standard\" *ngFor=\"let country of allCountries\"\r\n\t\t\t\t\t\t(click)=\"onCountrySelect(country, focusable)\" [id]=\"country.htmlId\">\r\n\t\t\t\t\t\t<div class=\"iti__flag-box\">\r\n\t\t\t\t\t\t\t<div class=\"iti__flag\" [ngClass]=\"country.flagClass\"></div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<span class=\"iti__country-name\">{{country.name}}</span>\r\n\t\t\t\t\t\t<span class=\"iti__dial-code\">+{{country.dialCode}}</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t</ng-container>\r\n\t\t\t\t<ng-template #noRecordFound>\r\n\t\t\t\t\t<li class=\"iti__country iti__standard\">No Record Found</li>\r\n\t\t\t\t</ng-template>\r\n\t\t\t</ul>\r\n\t\t</div>\r\n\t</div>\r\n\t<input type=\"tel\"\r\n\t\t[id]=\"inputId\"\r\n\t\tautocomplete=\"off\"\r\n\t\t[ngClass]=\"cssClass\"\r\n\t\t(blur)=\"onTouched()\"\r\n\t\t(keypress)=\"onInputKeyPress($event)\"\r\n\t\t[(ngModel)]=\"phoneNumber\"\r\n\t\t(ngModelChange)=\"onPhoneNumberChange()\"\r\n\t\t[disabled]=\"disabled\"\r\n\t\t[placeholder]=\"resolvePlaceholder()\"\r\n\t\t[attr.maxLength]=\"maxLength\"\r\n\t\t[attr.validation]=\"phoneValidation\"\r\n\t\t#focusable>\r\n</div>\r\n",
                providers: [
                    CountryCode,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        // tslint:disable-next-line:no-forward-ref
                        useExisting: forwardRef(() => NgxIntlTelInputComponent),
                        multi: true,
                    },
                    {
                        provide: NG_VALIDATORS,
                        useValue: ɵ0,
                        multi: true,
                    },
                ],
                styles: [".dropdown,.dropleft,.dropright,.dropup{position:relative}.dropdown-toggle{white-space:nowrap}.dropdown-toggle:after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:\"\";border-top:.3em solid;border-right:.3em solid transparent;border-bottom:0;border-left:.3em solid transparent}.dropdown-toggle:empty:after{margin-left:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:10rem;padding:.5rem 0;margin:.125rem 0 0;font-size:1rem;color:#212529;text-align:left;list-style:none;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.15);border-radius:.25rem}.dropdown-menu-left{right:auto;left:0}.dropdown-menu-right{right:0;left:auto}@media (min-width:576px){.dropdown-menu-sm-left{right:auto;left:0}.dropdown-menu-sm-right{right:0;left:auto}}@media (min-width:768px){.dropdown-menu-md-left{right:auto;left:0}.dropdown-menu-md-right{right:0;left:auto}}@media (min-width:992px){.dropdown-menu-lg-left{right:auto;left:0}.dropdown-menu-lg-right{right:0;left:auto}}@media (min-width:1200px){.dropdown-menu-xl-left{right:auto;left:0}.dropdown-menu-xl-right{right:0;left:auto}}.dropup .dropdown-menu{top:auto;bottom:100%;margin-top:0;margin-bottom:.125rem}.dropup .dropdown-toggle:after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:\"\";border-top:0;border-right:.3em solid transparent;border-bottom:.3em solid;border-left:.3em solid transparent}.dropup .dropdown-toggle:empty:after{margin-left:0}.dropright .dropdown-menu{top:0;right:auto;left:100%;margin-top:0;margin-left:.125rem}.dropright .dropdown-toggle:after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:\"\";border-top:.3em solid transparent;border-right:0;border-bottom:.3em solid transparent;border-left:.3em solid}.dropright .dropdown-toggle:empty:after{margin-left:0}.dropright .dropdown-toggle:after{vertical-align:0}.dropleft .dropdown-menu{top:0;right:100%;left:auto;margin-top:0;margin-right:.125rem}.dropleft .dropdown-toggle:after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:\"\";display:none}.dropleft .dropdown-toggle:before{display:inline-block;margin-right:.255em;vertical-align:.255em;content:\"\";border-top:.3em solid transparent;border-right:.3em solid;border-bottom:.3em solid transparent}.dropleft .dropdown-toggle:empty:after{margin-left:0}.dropleft .dropdown-toggle:before{vertical-align:0}.dropdown-menu[x-placement^=bottom],.dropdown-menu[x-placement^=left],.dropdown-menu[x-placement^=right],.dropdown-menu[x-placement^=top]{right:auto;bottom:auto}.dropdown-divider{height:0;margin:.5rem 0;overflow:hidden;border-top:1px solid #e9ecef}.dropdown-item{display:block;width:100%;padding:.25rem 1.5rem;clear:both;font-weight:400;color:#212529;text-align:inherit;white-space:nowrap;background-color:transparent;border:0}.dropdown-item:focus,.dropdown-item:hover{color:#16181b;text-decoration:none;background-color:#f8f9fa}.dropdown-item.active,.dropdown-item:active{color:#fff;text-decoration:none;background-color:#007bff}.dropdown-item.disabled,.dropdown-item:disabled{color:#6c757d;pointer-events:none;background-color:transparent}.dropdown-menu.show{display:block}.dropdown-header{display:block;padding:.5rem 1.5rem;margin-bottom:0;font-size:.875rem;color:#6c757d;white-space:nowrap}.dropdown-item-text{display:block;padding:.25rem 1.5rem;color:#212529}", "li.iti__country:hover{background-color:rgba(0,0,0,.05)}.iti__selected-flag.dropdown-toggle:after{content:none}.iti__flag-container.disabled{cursor:default!important}.iti.iti--allow-dropdown .flag-container.disabled:hover .iti__selected-flag{background:none}.country-dropdown{border:1px solid #ccc;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;padding:1px;border-collapse:collapse}.search-container{position:relative}.search-container input{width:100%;border:none;border-bottom:1px solid #ccc;padding-left:10px}.search-icon{position:absolute;z-index:2;width:25px;margin:1px 10px}.iti__country-list{position:relative;border:none}.iti input#country-search-box{padding-left:6px}.iti .selected-dial-code{margin-left:6px}.iti.separate-dial-code.iti--allow-dropdown.iti-sdc-2 .iti__selected-flag,.iti.separate-dial-code.iti--allow-dropdown.iti-sdc-3 .iti__selected-flag,.iti.separate-dial-code.iti--allow-dropdown.iti-sdc-4 .iti__selected-flag,.iti.separate-dial-code .iti__selected-flag{width:93px}.iti.separate-dial-code.iti--allow-dropdown.iti-sdc-2 input,.iti.separate-dial-code.iti--allow-dropdown.iti-sdc-3 input,.iti.separate-dial-code.iti--allow-dropdown.iti-sdc-4 input,.iti.separate-dial-code input{padding-left:98px}"]
            },] }
];
NgxIntlTelInputComponent.ctorParameters = () => [
    { type: CountryCode }
];
NgxIntlTelInputComponent.propDecorators = {
    value: [{ type: Input }],
    preferredCountries: [{ type: Input }],
    enablePlaceholder: [{ type: Input }],
    customPlaceholder: [{ type: Input }],
    numberFormat: [{ type: Input }],
    cssClass: [{ type: Input }],
    onlyCountries: [{ type: Input }],
    enableAutoCountrySelect: [{ type: Input }],
    searchCountryFlag: [{ type: Input }],
    searchCountryField: [{ type: Input }],
    searchCountryPlaceholder: [{ type: Input }],
    maxLength: [{ type: Input }],
    selectFirstCountry: [{ type: Input }],
    selectedCountryISO: [{ type: Input }],
    phoneValidation: [{ type: Input }],
    inputId: [{ type: Input }],
    separateDialCode: [{ type: Input }],
    countryChange: [{ type: Output }],
    countryList: [{ type: ViewChild, args: ['countryList',] }]
};
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWludGwtdGVsLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1pbnRsLXRlbC1pbnB1dC9zcmMvbGliL25neC1pbnRsLXRlbC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLEdBQUcsTUFBTSx1QkFBdUIsQ0FBQztBQUU3QyxPQUFPLEVBQ04sU0FBUyxFQUVULFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFbEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFHdkUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7V0FpQnhELG9CQUFvQjtBQUtqQyxNQUFNLE9BQU8sd0JBQXdCO0lBZ0RwQyxZQUFvQixlQUE0QjtRQUE1QixvQkFBZSxHQUFmLGVBQWUsQ0FBYTtRQS9DdkMsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLHVCQUFrQixHQUFrQixFQUFFLENBQUM7UUFDdkMsc0JBQWlCLEdBQUcsSUFBSSxDQUFDO1FBRXpCLGlCQUFZLEdBQXNCLGlCQUFpQixDQUFDLGFBQWEsQ0FBQztRQUNsRSxhQUFRLEdBQUcsY0FBYyxDQUFDO1FBQzFCLGtCQUFhLEdBQWtCLEVBQUUsQ0FBQztRQUNsQyw0QkFBdUIsR0FBRyxJQUFJLENBQUM7UUFDL0Isc0JBQWlCLEdBQUcsS0FB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O2FBQ0Q7OztZQTNCUSxXQUFXOzs7b0JBNkJsQixLQUFLO2lDQUNMLEtBQUs7Z0NBQ0wsS0FBSztnQ0FDTCxLQUFLOzJCQUNMLEtBQUs7dUJBQ0wsS0FBSzs0QkFDTCxLQUFLO3NDQUNMLEtBQUs7Z0NBQ0wsS0FBSztpQ0FDTCxLQUFLO3VDQUNMLEtBQUs7d0JBQ0wsS0FBSztpQ0FDTCxLQUFLO2lDQUNMLEtBQUs7OEJBQ0wsS0FBSztzQkFDTCxLQUFLOytCQUNMLEtBQUs7NEJBR0wsTUFBTTswQkF1Qk4sU0FBUyxTQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBscG4gZnJvbSAnZ29vZ2xlLWxpYnBob25lbnVtYmVyJztcclxuXHJcbmltcG9ydCB7XHJcblx0Q29tcG9uZW50LFxyXG5cdEVsZW1lbnRSZWYsXHJcblx0RXZlbnRFbWl0dGVyLFxyXG5cdGZvcndhcmRSZWYsXHJcblx0SW5wdXQsXHJcblx0T25DaGFuZ2VzLFxyXG5cdE9uSW5pdCxcclxuXHRPdXRwdXQsXHJcblx0U2ltcGxlQ2hhbmdlcyxcclxuXHRWaWV3Q2hpbGQsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5HX1ZBTElEQVRPUlMsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0IHsgc2V0VGhlbWUgfSBmcm9tICduZ3gtYm9vdHN0cmFwL3V0aWxzJztcclxuXHJcbmltcG9ydCB7IENvdW50cnlDb2RlIH0gZnJvbSAnLi9kYXRhL2NvdW50cnktY29kZSc7XHJcbmltcG9ydCB7IENvdW50cnlJU08gfSBmcm9tICcuL2VudW1zL2NvdW50cnktaXNvLmVudW0nO1xyXG5pbXBvcnQgeyBTZWFyY2hDb3VudHJ5RmllbGQgfSBmcm9tICcuL2VudW1zL3NlYXJjaC1jb3VudHJ5LWZpZWxkLmVudW0nO1xyXG5pbXBvcnQgdHlwZSB7IENoYW5nZURhdGEgfSBmcm9tICcuL2ludGVyZmFjZXMvY2hhbmdlLWRhdGEnO1xyXG5pbXBvcnQgdHlwZSB7IENvdW50cnkgfSBmcm9tICcuL21vZGVsL2NvdW50cnkubW9kZWwnO1xyXG5pbXBvcnQgeyBwaG9uZU51bWJlclZhbGlkYXRvciB9IGZyb20gJy4vbmd4LWludGwtdGVsLWlucHV0LnZhbGlkYXRvcic7XHJcbmltcG9ydCB7IFBob25lTnVtYmVyRm9ybWF0IH0gZnJvbSAnLi9lbnVtcy9waG9uZS1udW1iZXItZm9ybWF0LmVudW0nO1xyXG5cclxuQENvbXBvbmVudCh7XHJcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBjb21wb25lbnQtc2VsZWN0b3JcclxuXHRzZWxlY3RvcjogJ25neC1pbnRsLXRlbC1pbnB1dCcsXHJcblx0dGVtcGxhdGVVcmw6ICcuL25neC1pbnRsLXRlbC1pbnB1dC5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vYm9vdHN0cmFwLWRyb3Bkb3duLmNzcycsICcuL25neC1pbnRsLXRlbC1pbnB1dC5jb21wb25lbnQuY3NzJ10sXHJcblx0cHJvdmlkZXJzOiBbXHJcblx0XHRDb3VudHJ5Q29kZSxcclxuXHRcdHtcclxuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcblx0XHRcdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1mb3J3YXJkLXJlZlxyXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ3hJbnRsVGVsSW5wdXRDb21wb25lbnQpLFxyXG5cdFx0XHRtdWx0aTogdHJ1ZSxcclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXHJcblx0XHRcdHVzZVZhbHVlOiBwaG9uZU51bWJlclZhbGlkYXRvcixcclxuXHRcdFx0bXVsdGk6IHRydWUsXHJcblx0XHR9LFxyXG5cdF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hJbnRsVGVsSW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblx0QElucHV0KCkgdmFsdWUgPSAnJztcclxuXHRASW5wdXQoKSBwcmVmZXJyZWRDb3VudHJpZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuXHRASW5wdXQoKSBlbmFibGVQbGFjZWhvbGRlciA9IHRydWU7XHJcblx0QElucHV0KCkgY3VzdG9tUGxhY2Vob2xkZXI6IHN0cmluZztcclxuXHRASW5wdXQoKSBudW1iZXJGb3JtYXQ6IFBob25lTnVtYmVyRm9ybWF0ID0gUGhvbmVOdW1iZXJGb3JtYXQuSW50ZXJuYXRpb25hbDtcclxuXHRASW5wdXQoKSBjc3NDbGFzcyA9ICdmb3JtLWNvbnRyb2wnO1xyXG5cdEBJbnB1dCgpIG9ubHlDb3VudHJpZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuXHRASW5wdXQoKSBlbmFibGVBdXRvQ291bnRyeVNlbGVjdCA9IHRydWU7XHJcblx0QElucHV0KCkgc2VhcmNoQ291bnRyeUZsYWcgPSBmYWxzZTtcclxuXHRASW5wdXQoKSBzZWFyY2hDb3VudHJ5RmllbGQ6IFNlYXJjaENvdW50cnlGaWVsZFtdID0gW1NlYXJjaENvdW50cnlGaWVsZC5BbGxdO1xyXG5cdEBJbnB1dCgpIHNlYXJjaENvdW50cnlQbGFjZWhvbGRlciA9ICdTZWFyY2ggQ291bnRyeSc7XHJcblx0QElucHV0KCkgbWF4TGVuZ3RoID0gJyc7XHJcblx0QElucHV0KCkgc2VsZWN0Rmlyc3RDb3VudHJ5ID0gdHJ1ZTtcclxuXHRASW5wdXQoKSBzZWxlY3RlZENvdW50cnlJU086IENvdW50cnlJU087XHJcblx0QElucHV0KCkgcGhvbmVWYWxpZGF0aW9uID0gdHJ1ZTtcclxuXHRASW5wdXQoKSBpbnB1dElkID0gJ3Bob25lJztcclxuXHRASW5wdXQoKSBzZXBhcmF0ZURpYWxDb2RlID0gZmFsc2U7XHJcblx0c2VwYXJhdGVEaWFsQ29kZUNsYXNzOiBzdHJpbmc7XHJcblxyXG5cdEBPdXRwdXQoKSByZWFkb25seSBjb3VudHJ5Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDb3VudHJ5PigpO1xyXG5cclxuXHRzZWxlY3RlZENvdW50cnk6IENvdW50cnkgPSB7XHJcblx0XHRhcmVhQ29kZXM6IHVuZGVmaW5lZCxcclxuXHRcdGRpYWxDb2RlOiAnJyxcclxuXHRcdGh0bWxJZDogJycsXHJcblx0XHRmbGFnQ2xhc3M6ICcnLFxyXG5cdFx0aXNvMjogJycsXHJcblx0XHRuYW1lOiAnJyxcclxuXHRcdHBsYWNlSG9sZGVyOiAnJyxcclxuXHRcdHByaW9yaXR5OiAwLFxyXG5cdH07XHJcblxyXG5cdHBob25lTnVtYmVyID0gJyc7XHJcblx0YWxsQ291bnRyaWVzOiBBcnJheTxDb3VudHJ5PiA9IFtdO1xyXG5cdHByZWZlcnJlZENvdW50cmllc0luRHJvcERvd246IEFycmF5PENvdW50cnk+ID0gW107XHJcblx0Ly8gSGFzIHRvIGJlICdhbnknIHRvIHByZXZlbnQgYSBuZWVkIHRvIGluc3RhbGwgQHR5cGVzL2dvb2dsZS1saWJwaG9uZW51bWJlciBieSB0aGUgcGFja2FnZSB1c2VyLi4uXHJcblx0cGhvbmVVdGlsOiBhbnkgPSBscG4uUGhvbmVOdW1iZXJVdGlsLmdldEluc3RhbmNlKCk7XHJcblx0ZGlzYWJsZWQgPSBmYWxzZTtcclxuXHRlcnJvcnM6IEFycmF5PGFueT4gPSBbJ1Bob25lIG51bWJlciBpcyByZXF1aXJlZC4nXTtcclxuXHRjb3VudHJ5U2VhcmNoVGV4dCA9ICcnO1xyXG5cdGFsbENvdW50cmllc01hc3RlckRhdGE6IEFycmF5PENvdW50cnk+ID0gW107XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ2NvdW50cnlMaXN0JykgY291bnRyeUxpc3Q6IEVsZW1lbnRSZWY7XHJcblxyXG5cdG9uVG91Y2hlZCA9ICgpID0+IHt9O1xyXG5cdHByb3BhZ2F0ZUNoYW5nZSA9IChfOiBDaGFuZ2VEYXRhKSA9PiB7fTtcclxuXHJcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBjb3VudHJ5Q29kZURhdGE6IENvdW50cnlDb2RlKSB7XHJcblx0XHQvLyBJZiB0aGlzIGlzIG5vdCBzZXQsIG5neC1ib290c3RyYXAgd2lsbCB0cnkgdG8gdXNlIHRoZSBiczMgQ1NTICh3aGljaCBpcyBub3Qgd2hhdCB3ZSd2ZSBlbWJlZGRlZCkgYW5kIHdpbGxcclxuXHRcdC8vIEFkZCB0aGUgd3JvbmcgY2xhc3NlcyBhbmQgc3VjaFxyXG5cdFx0c2V0VGhlbWUoJ2JzNCcpO1xyXG5cdH1cclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHR0aGlzLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuXHRcdGNvbnN0IHNlbGVjdGVkSVNPID0gY2hhbmdlc1snc2VsZWN0ZWRDb3VudHJ5SVNPJ107XHJcblx0XHRpZiAoXHJcblx0XHRcdHRoaXMuYWxsQ291bnRyaWVzICYmXHJcblx0XHRcdHNlbGVjdGVkSVNPICYmXHJcblx0XHRcdHNlbGVjdGVkSVNPLmN1cnJlbnRWYWx1ZSAhPT0gc2VsZWN0ZWRJU08ucHJldmlvdXNWYWx1ZVxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMudXBkYXRlU2VsZWN0ZWRDb3VudHJ5KCk7XHJcblx0XHR9XHJcblx0XHRpZiAoY2hhbmdlcy5wcmVmZXJyZWRDb3VudHJpZXMpIHtcclxuXHRcdFx0dGhpcy51cGRhdGVQcmVmZXJyZWRDb3VudHJpZXMoKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuY2hlY2tTZXBhcmF0ZURpYWxDb2RlU3R5bGUoKTtcclxuXHR9XHJcblxyXG5cdC8qXHJcblx0XHRUaGlzIGlzIGEgd3JhcHBlciBtZXRob2QgdG8gYXZvaWQgY2FsbGluZyB0aGlzLm5nT25Jbml0KCkgaW4gd3JpdGVWYWx1ZSgpLlxyXG5cdFx0UmVmOiBodHRwOi8vY29kZWx5emVyLmNvbS9ydWxlcy9uby1saWZlLWN5Y2xlLWNhbGwvXHJcblx0Ki9cclxuXHRpbml0KCkge1xyXG5cdFx0dGhpcy5mZXRjaENvdW50cnlEYXRhKCk7XHJcblx0XHRpZiAodGhpcy5wcmVmZXJyZWRDb3VudHJpZXMubGVuZ3RoKSB7XHJcblx0XHRcdHRoaXMudXBkYXRlUHJlZmVycmVkQ291bnRyaWVzKCk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5vbmx5Q291bnRyaWVzLmxlbmd0aCkge1xyXG5cdFx0XHR0aGlzLmFsbENvdW50cmllcyA9IHRoaXMuYWxsQ291bnRyaWVzLmZpbHRlcigoYykgPT5cclxuXHRcdFx0XHR0aGlzLm9ubHlDb3VudHJpZXMuaW5jbHVkZXMoYy5pc28yKVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuc2VsZWN0Rmlyc3RDb3VudHJ5KSB7XHJcblx0XHRcdGlmICh0aGlzLnByZWZlcnJlZENvdW50cmllc0luRHJvcERvd24ubGVuZ3RoKSB7XHJcblx0XHRcdFx0dGhpcy5zZXRTZWxlY3RlZENvdW50cnkodGhpcy5wcmVmZXJyZWRDb3VudHJpZXNJbkRyb3BEb3duWzBdKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnNldFNlbGVjdGVkQ291bnRyeSh0aGlzLmFsbENvdW50cmllc1swXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuYWxsQ291bnRyaWVzTWFzdGVyRGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5hbGxDb3VudHJpZXMpKTtcclxuXHRcdHRoaXMudXBkYXRlU2VsZWN0ZWRDb3VudHJ5KCk7XHJcblx0XHR0aGlzLmNoZWNrU2VwYXJhdGVEaWFsQ29kZVN0eWxlKCk7XHJcblx0fVxyXG5cclxuXHRzZXRTZWxlY3RlZENvdW50cnkoY291bnRyeTogQ291bnRyeSkge1xyXG5cdFx0dGhpcy5zZWxlY3RlZENvdW50cnkgPSBjb3VudHJ5O1xyXG5cdFx0dGhpcy5jb3VudHJ5Q2hhbmdlLmVtaXQoY291bnRyeSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBTZWFyY2ggY291bnRyeSBiYXNlZCBvbiBjb3VudHJ5IG5hbWUsIGlzbzIsIGRpYWxDb2RlIG9yIGFsbCBvZiB0aGVtLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzZWFyY2hDb3VudHJ5KCkge1xyXG5cdFx0bGV0IGNvdW50cnlTZWFyY2hUZXh0ID0gdGhpcy5jb3VudHJ5U2VhcmNoVGV4dC5yZXBsYWNlKCcrJywgJycpO1xyXG5cdFx0aWYgKCFjb3VudHJ5U2VhcmNoVGV4dCkge1xyXG5cdFx0XHR0aGlzLmFsbENvdW50cmllcyA9IHRoaXMuYWxsQ291bnRyaWVzTWFzdGVyRGF0YTtcclxuXHRcdFx0Ly8gdGhpcy5jb3VudHJ5TGlzdC5uYXRpdmVFbGVtZW50XHJcblx0XHRcdC8vIFx0LnF1ZXJ5U2VsZWN0b3IoJy5pdGlfX2NvdW50cnktbGlzdCBsaScpXHJcblx0XHRcdC8vIFx0LnNjcm9sbEludG9WaWV3KHtcclxuXHRcdFx0Ly8gXHRcdGJlaGF2aW9yOiAnc21vb3RoJyxcclxuXHRcdFx0Ly8gXHRcdGJsb2NrOiAnbmVhcmVzdCcsXHJcblx0XHRcdC8vIFx0XHRpbmxpbmU6ICduZWFyZXN0JyxcclxuXHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgY291bnRyeVNlYXJjaFRleHRMb3dlciA9IGNvdW50cnlTZWFyY2hUZXh0LnRvTG93ZXJDYXNlKCk7XHJcblx0XHR0aGlzLmFsbENvdW50cmllcyA9IHRoaXMuYWxsQ291bnRyaWVzTWFzdGVyRGF0YS5maWx0ZXIoKGMpID0+IHtcclxuXHRcdFx0aWYgKHRoaXMuc2VhcmNoQ291bnRyeUZpZWxkLmluZGV4T2YoU2VhcmNoQ291bnRyeUZpZWxkLkFsbCkgPiAtMSkge1xyXG5cdFx0XHRcdC8vIFNlYXJjaCBpbiBhbGwgZmllbGRzXHJcblx0XHRcdFx0aWYgKGMuaXNvMi50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoY291bnRyeVNlYXJjaFRleHRMb3dlcikpIHtcclxuXHRcdFx0XHRcdHJldHVybiBjO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoYy5uYW1lLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChjb3VudHJ5U2VhcmNoVGV4dExvd2VyKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGM7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChjLmRpYWxDb2RlLnN0YXJ0c1dpdGgoY291bnRyeVNlYXJjaFRleHQpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gT3Igc2VhcmNoIGJ5IHNwZWNpZmljIFNlYXJjaENvdW50cnlGaWVsZChzKVxyXG5cdFx0XHRcdGlmICh0aGlzLnNlYXJjaENvdW50cnlGaWVsZC5pbmRleE9mKFNlYXJjaENvdW50cnlGaWVsZC5Jc28yKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRpZiAoYy5pc28yLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChjb3VudHJ5U2VhcmNoVGV4dExvd2VyKSkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuc2VhcmNoQ291bnRyeUZpZWxkLmluZGV4T2YoU2VhcmNoQ291bnRyeUZpZWxkLk5hbWUpID4gLTEpIHtcclxuXHRcdFx0XHRcdGlmIChjLm5hbWUudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGNvdW50cnlTZWFyY2hUZXh0TG93ZXIpKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBjO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5zZWFyY2hDb3VudHJ5RmllbGQuaW5kZXhPZihTZWFyY2hDb3VudHJ5RmllbGQuRGlhbENvZGUpID4gLTEpIHtcclxuXHRcdFx0XHRcdGlmIChjLmRpYWxDb2RlLnN0YXJ0c1dpdGgoY291bnRyeVNlYXJjaFRleHQpKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBjO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gaWYgKHRoaXMuYWxsQ291bnRyaWVzLmxlbmd0aCA+IDApIHtcclxuXHRcdC8vIFx0Y29uc3QgZWwgPSB0aGlzLmNvdW50cnlMaXN0Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuXHRcdC8vIFx0XHQnIycgKyB0aGlzLmFsbENvdW50cmllc1swXS5odG1sSWRcclxuXHRcdC8vIFx0KTtcclxuXHRcdC8vIFx0aWYgKGVsKSB7XHJcblx0XHQvLyBcdFx0ZWwuc2Nyb2xsSW50b1ZpZXcoe1xyXG5cdFx0Ly8gXHRcdFx0YmVoYXZpb3I6ICdzbW9vdGgnLFxyXG5cdFx0Ly8gXHRcdFx0YmxvY2s6ICduZWFyZXN0JyxcclxuXHRcdC8vIFx0XHRcdGlubGluZTogJ25lYXJlc3QnLFxyXG5cdFx0Ly8gXHRcdH0pO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0dGhpcy5jaGVja1NlcGFyYXRlRGlhbENvZGVTdHlsZSgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uUGhvbmVOdW1iZXJDaGFuZ2UoKTogdm9pZCB7XHJcblx0XHRsZXQgY291bnRyeUNvZGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuXHRcdC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgdXNlciBzZXRzIHRoZSB2YWx1ZSBwcm9ncmFtYXRpY2FsbHkgYmFzZWQgb24gYSBwZXJzaXN0ZWQgQ2hhbmdlRGF0YSBvYmouXHJcblx0XHRpZiAodGhpcy5waG9uZU51bWJlciAmJiB0eXBlb2YgdGhpcy5waG9uZU51bWJlciA9PT0gJ29iamVjdCcpIHtcclxuXHRcdFx0Y29uc3QgbnVtYmVyT2JqOiBDaGFuZ2VEYXRhID0gdGhpcy5waG9uZU51bWJlcjtcclxuXHRcdFx0dGhpcy5waG9uZU51bWJlciA9IG51bWJlck9iai5udW1iZXI7XHJcblx0XHRcdGNvdW50cnlDb2RlID0gbnVtYmVyT2JqLmNvdW50cnlDb2RlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudmFsdWUgPSB0aGlzLnBob25lTnVtYmVyO1xyXG5cdFx0Y291bnRyeUNvZGUgPSBjb3VudHJ5Q29kZSB8fCB0aGlzLnNlbGVjdGVkQ291bnRyeS5pc28yO1xyXG5cdFx0Y29uc3QgbnVtYmVyID0gdGhpcy5nZXRQYXJzZWROdW1iZXIodGhpcy5waG9uZU51bWJlciwgY291bnRyeUNvZGUpO1xyXG5cclxuXHRcdC8vIGF1dG8gc2VsZWN0IGNvdW50cnkgYmFzZWQgb24gdGhlIGV4dGVuc2lvbiAoYW5kIGFyZWFDb2RlIGlmIG5lZWRlZCkgKGUuZyBzZWxlY3QgQ2FuYWRhIGlmIG51bWJlciBzdGFydHMgd2l0aCArMSA0MTYpXHJcblx0XHRpZiAodGhpcy5lbmFibGVBdXRvQ291bnRyeVNlbGVjdCkge1xyXG5cdFx0XHRjb3VudHJ5Q29kZSA9XHJcblx0XHRcdFx0bnVtYmVyICYmIG51bWJlci5nZXRDb3VudHJ5Q29kZSgpXHJcblx0XHRcdFx0XHQ/IHRoaXMuZ2V0Q291bnRyeUlzb0NvZGUobnVtYmVyLmdldENvdW50cnlDb2RlKCksIG51bWJlcilcclxuXHRcdFx0XHRcdDogdGhpcy5zZWxlY3RlZENvdW50cnkuaXNvMjtcclxuXHRcdFx0aWYgKGNvdW50cnlDb2RlICYmIGNvdW50cnlDb2RlICE9PSB0aGlzLnNlbGVjdGVkQ291bnRyeS5pc28yKSB7XHJcblx0XHRcdFx0Y29uc3QgbmV3Q291bnRyeSA9IHRoaXMuYWxsQ291bnRyaWVzXHJcblx0XHRcdFx0XHQuc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LmZpbmQoKGMpID0+IGMuaXNvMiA9PT0gY291bnRyeUNvZGUpO1xyXG5cdFx0XHRcdGlmIChuZXdDb3VudHJ5KSB7XHJcblx0XHRcdFx0XHR0aGlzLnNlbGVjdGVkQ291bnRyeSA9IG5ld0NvdW50cnk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRjb3VudHJ5Q29kZSA9IGNvdW50cnlDb2RlID8gY291bnRyeUNvZGUgOiB0aGlzLnNlbGVjdGVkQ291bnRyeS5pc28yO1xyXG5cclxuXHRcdHRoaXMuY2hlY2tTZXBhcmF0ZURpYWxDb2RlU3R5bGUoKTtcclxuXHJcblx0XHRpZiAoIXRoaXMudmFsdWUpIHtcclxuXHRcdFx0Ly8gUmVhc29uOiBhdm9pZCBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTQzNTgxMzMvMTYxNzU5MFxyXG5cdFx0XHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLW51bGwta2V5d29yZFxyXG5cdFx0XHR0aGlzLnByb3BhZ2F0ZUNoYW5nZShudWxsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnN0IGludGxObyA9IG51bWJlclxyXG5cdFx0XHRcdD8gdGhpcy5waG9uZVV0aWwuZm9ybWF0KG51bWJlciwgbHBuLlBob25lTnVtYmVyRm9ybWF0LklOVEVSTkFUSU9OQUwpXHJcblx0XHRcdFx0OiAnJztcclxuXHJcblx0XHRcdC8vIHBhcnNlIHBob25lTnVtYmVyIGlmIHNlcGFyYXRlIGRpYWwgY29kZSBpcyBuZWVkZWRcclxuXHRcdFx0aWYgKHRoaXMuc2VwYXJhdGVEaWFsQ29kZSAmJiBpbnRsTm8pIHtcclxuXHRcdFx0XHR0aGlzLnZhbHVlID0gdGhpcy5yZW1vdmVEaWFsQ29kZShpbnRsTm8pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnByb3BhZ2F0ZUNoYW5nZSh7XHJcblx0XHRcdFx0bnVtYmVyOiB0aGlzLnZhbHVlLFxyXG5cdFx0XHRcdGludGVybmF0aW9uYWxOdW1iZXI6IGludGxObyxcclxuXHRcdFx0XHRuYXRpb25hbE51bWJlcjogbnVtYmVyXHJcblx0XHRcdFx0XHQ/IHRoaXMucGhvbmVVdGlsLmZvcm1hdChudW1iZXIsIGxwbi5QaG9uZU51bWJlckZvcm1hdC5OQVRJT05BTClcclxuXHRcdFx0XHRcdDogJycsXHJcblx0XHRcdFx0ZTE2NE51bWJlcjogbnVtYmVyXHJcblx0XHRcdFx0XHQ/IHRoaXMucGhvbmVVdGlsLmZvcm1hdChudW1iZXIsIGxwbi5QaG9uZU51bWJlckZvcm1hdC5FMTY0KVxyXG5cdFx0XHRcdFx0OiAnJyxcclxuXHRcdFx0XHRjb3VudHJ5Q29kZTogY291bnRyeUNvZGUudG9VcHBlckNhc2UoKSxcclxuXHRcdFx0XHRkaWFsQ29kZTogJysnICsgdGhpcy5zZWxlY3RlZENvdW50cnkuZGlhbENvZGUsXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIG9uQ291bnRyeVNlbGVjdChjb3VudHJ5OiBDb3VudHJ5LCBlbCk6IHZvaWQge1xyXG5cdFx0dGhpcy5zZXRTZWxlY3RlZENvdW50cnkoY291bnRyeSk7XHJcblxyXG5cdFx0dGhpcy5jaGVja1NlcGFyYXRlRGlhbENvZGVTdHlsZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLnBob25lTnVtYmVyICYmIHRoaXMucGhvbmVOdW1iZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHR0aGlzLnZhbHVlID0gdGhpcy5waG9uZU51bWJlcjtcclxuXHRcdFx0Y29uc3QgbnVtYmVyID0gdGhpcy5nZXRQYXJzZWROdW1iZXIoXHJcblx0XHRcdFx0dGhpcy5waG9uZU51bWJlcixcclxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkQ291bnRyeS5pc28yXHJcblx0XHRcdCk7XHJcblx0XHRcdGNvbnN0IGludGxObyA9IG51bWJlclxyXG5cdFx0XHRcdD8gdGhpcy5waG9uZVV0aWwuZm9ybWF0KG51bWJlciwgbHBuLlBob25lTnVtYmVyRm9ybWF0LklOVEVSTkFUSU9OQUwpXHJcblx0XHRcdFx0OiAnJztcclxuXHRcdFx0Ly8gcGFyc2UgcGhvbmVOdW1iZXIgaWYgc2VwYXJhdGUgZGlhbCBjb2RlIGlzIG5lZWRlZFxyXG5cdFx0XHRpZiAodGhpcy5zZXBhcmF0ZURpYWxDb2RlICYmIGludGxObykge1xyXG5cdFx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnJlbW92ZURpYWxDb2RlKGludGxObyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMucHJvcGFnYXRlQ2hhbmdlKHtcclxuXHRcdFx0XHRudW1iZXI6IHRoaXMudmFsdWUsXHJcblx0XHRcdFx0aW50ZXJuYXRpb25hbE51bWJlcjogaW50bE5vLFxyXG5cdFx0XHRcdG5hdGlvbmFsTnVtYmVyOiBudW1iZXJcclxuXHRcdFx0XHRcdD8gdGhpcy5waG9uZVV0aWwuZm9ybWF0KG51bWJlciwgbHBuLlBob25lTnVtYmVyRm9ybWF0Lk5BVElPTkFMKVxyXG5cdFx0XHRcdFx0OiAnJyxcclxuXHRcdFx0XHRlMTY0TnVtYmVyOiBudW1iZXJcclxuXHRcdFx0XHRcdD8gdGhpcy5waG9uZVV0aWwuZm9ybWF0KG51bWJlciwgbHBuLlBob25lTnVtYmVyRm9ybWF0LkUxNjQpXHJcblx0XHRcdFx0XHQ6ICcnLFxyXG5cdFx0XHRcdGNvdW50cnlDb2RlOiB0aGlzLnNlbGVjdGVkQ291bnRyeS5pc28yLnRvVXBwZXJDYXNlKCksXHJcblx0XHRcdFx0ZGlhbENvZGU6ICcrJyArIHRoaXMuc2VsZWN0ZWRDb3VudHJ5LmRpYWxDb2RlLFxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIFJlYXNvbjogYXZvaWQgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU0MzU4MTMzLzE2MTc1OTBcclxuXHRcdFx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1udWxsLWtleXdvcmRcclxuXHRcdFx0dGhpcy5wcm9wYWdhdGVDaGFuZ2UobnVsbCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5hbGxDb3VudHJpZXMgPSB0aGlzLmFsbENvdW50cmllc01hc3RlckRhdGE7XHJcblx0XHRlbC5mb2N1cygpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uSW5wdXRLZXlQcmVzcyhldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xyXG5cdFx0Y29uc3QgYWxsb3dlZENoYXJzID0gL1swLTlcXCtcXC1cXChcXClcXCBdLztcclxuXHRcdGNvbnN0IGFsbG93ZWRDdHJsQ2hhcnMgPSAvW2F4Y3ZdLzsgLy8gQWxsb3dzIGNvcHktcGFzdGluZ1xyXG5cdFx0Y29uc3QgYWxsb3dlZE90aGVyS2V5cyA9IFtcclxuXHRcdFx0J0Fycm93TGVmdCcsXHJcblx0XHRcdCdBcnJvd1VwJyxcclxuXHRcdFx0J0Fycm93UmlnaHQnLFxyXG5cdFx0XHQnQXJyb3dEb3duJyxcclxuXHRcdFx0J0hvbWUnLFxyXG5cdFx0XHQnRW5kJyxcclxuXHRcdFx0J0luc2VydCcsXHJcblx0XHRcdCdEZWxldGUnLFxyXG5cdFx0XHQnQmFja3NwYWNlJyxcclxuXHRcdF07XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHQhYWxsb3dlZENoYXJzLnRlc3QoZXZlbnQua2V5KSAmJlxyXG5cdFx0XHQhKGV2ZW50LmN0cmxLZXkgJiYgYWxsb3dlZEN0cmxDaGFycy50ZXN0KGV2ZW50LmtleSkpICYmXHJcblx0XHRcdCFhbGxvd2VkT3RoZXJLZXlzLmluY2x1ZGVzKGV2ZW50LmtleSlcclxuXHRcdCkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XHJcblx0XHR0aGlzLnByb3BhZ2F0ZUNoYW5nZSA9IGZuO1xyXG5cdH1cclxuXHJcblx0cmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xyXG5cdFx0dGhpcy5vblRvdWNoZWQgPSBmbjtcclxuXHR9XHJcblxyXG5cdHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xyXG5cdFx0dGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XHJcblx0fVxyXG5cclxuXHR3cml0ZVZhbHVlKG9iajogYW55KTogdm9pZCB7XHJcblx0XHRpZiAob2JqID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dGhpcy5pbml0KCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLnBob25lTnVtYmVyID0gb2JqO1xyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdHRoaXMub25QaG9uZU51bWJlckNoYW5nZSgpO1xyXG5cdFx0fSwgMSk7XHJcblx0fVxyXG5cclxuXHRyZXNvbHZlUGxhY2Vob2xkZXIoKTogc3RyaW5nIHtcclxuXHRcdGxldCBwbGFjZWhvbGRlciA9ICcnO1xyXG5cdFx0aWYgKHRoaXMuY3VzdG9tUGxhY2Vob2xkZXIpIHtcclxuXHRcdFx0cGxhY2Vob2xkZXIgPSB0aGlzLmN1c3RvbVBsYWNlaG9sZGVyO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkQ291bnRyeS5wbGFjZUhvbGRlcikge1xyXG5cdFx0XHRwbGFjZWhvbGRlciA9IHRoaXMuc2VsZWN0ZWRDb3VudHJ5LnBsYWNlSG9sZGVyO1xyXG5cdFx0XHRpZiAodGhpcy5zZXBhcmF0ZURpYWxDb2RlKSB7XHJcblx0XHRcdFx0cGxhY2Vob2xkZXIgPSB0aGlzLnJlbW92ZURpYWxDb2RlKHBsYWNlaG9sZGVyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBsYWNlaG9sZGVyO1xyXG5cdH1cclxuXHJcblx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHBhcnNlIFBob25lTnVtYmVyIG9iamVjdC5cclxuXHQgKiBAcGFyYW0gcGhvbmVOdW1iZXIgc3RyaW5nXHJcblx0ICogQHBhcmFtIGNvdW50cnlDb2RlIHN0cmluZ1xyXG5cdCAqL1xyXG5cdHByaXZhdGUgZ2V0UGFyc2VkTnVtYmVyKFxyXG5cdFx0cGhvbmVOdW1iZXI6IHN0cmluZyxcclxuXHRcdGNvdW50cnlDb2RlOiBzdHJpbmdcclxuXHQpOiBscG4uUGhvbmVOdW1iZXIge1xyXG5cdFx0bGV0IG51bWJlcjogbHBuLlBob25lTnVtYmVyO1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0bnVtYmVyID0gdGhpcy5waG9uZVV0aWwucGFyc2UocGhvbmVOdW1iZXIsIGNvdW50cnlDb2RlLnRvVXBwZXJDYXNlKCkpO1xyXG5cdFx0fSBjYXRjaCAoZSkge31cclxuXHRcdHJldHVybiBudW1iZXI7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBBZGp1c3RzIGlucHV0IGFsaWdubWVudCBiYXNlZCBvbiB0aGUgZGlhbCBjb2RlIHByZXNlbnRhdGlvbiBzdHlsZS5cclxuXHQgKi9cclxuXHRwcml2YXRlIGNoZWNrU2VwYXJhdGVEaWFsQ29kZVN0eWxlKCkge1xyXG5cdFx0aWYgKHRoaXMuc2VwYXJhdGVEaWFsQ29kZSAmJiB0aGlzLnNlbGVjdGVkQ291bnRyeSkge1xyXG5cdFx0XHRjb25zdCBjbnRyeUNkID0gdGhpcy5zZWxlY3RlZENvdW50cnkuZGlhbENvZGU7XHJcblx0XHRcdHRoaXMuc2VwYXJhdGVEaWFsQ29kZUNsYXNzID1cclxuXHRcdFx0XHQnc2VwYXJhdGUtZGlhbC1jb2RlIGl0aS1zZGMtJyArIChjbnRyeUNkLmxlbmd0aCArIDEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5zZXBhcmF0ZURpYWxDb2RlQ2xhc3MgPSAnJztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENsZWFucyBkaWFsY29kZSBmcm9tIHBob25lIG51bWJlciBzdHJpbmcuXHJcblx0ICogQHBhcmFtIHBob25lTnVtYmVyIHN0cmluZ1xyXG5cdCAqL1xyXG5cdHByaXZhdGUgcmVtb3ZlRGlhbENvZGUocGhvbmVOdW1iZXI6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRjb25zdCBudW1iZXIgPSB0aGlzLmdldFBhcnNlZE51bWJlcihwaG9uZU51bWJlciwgdGhpcy5zZWxlY3RlZENvdW50cnkuaXNvMik7XHJcblx0XHRwaG9uZU51bWJlciA9IHRoaXMucGhvbmVVdGlsLmZvcm1hdChcclxuXHRcdFx0bnVtYmVyLFxyXG5cdFx0XHRscG4uUGhvbmVOdW1iZXJGb3JtYXRbdGhpcy5udW1iZXJGb3JtYXRdXHJcblx0XHQpO1xyXG5cdFx0aWYgKHBob25lTnVtYmVyLnN0YXJ0c1dpdGgoJysnKSAmJiB0aGlzLnNlcGFyYXRlRGlhbENvZGUpIHtcclxuXHRcdFx0cGhvbmVOdW1iZXIgPSBwaG9uZU51bWJlci5zdWJzdHIocGhvbmVOdW1iZXIuaW5kZXhPZignICcpICsgMSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGhvbmVOdW1iZXI7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBTaWZ0cyB0aHJvdWdoIGFsbCBjb3VudHJpZXMgYW5kIHJldHVybnMgaXNvIGNvZGUgb2YgdGhlIHByaW1hcnkgY291bnRyeVxyXG5cdCAqIGJhc2VkIG9uIHRoZSBudW1iZXIgcHJvdmlkZWQuXHJcblx0ICogQHBhcmFtIGNvdW50cnlDb2RlIGNvdW50cnkgY29kZSBpbiBudW1iZXIgZm9ybWF0XHJcblx0ICogQHBhcmFtIG51bWJlciBQaG9uZU51bWJlciBvYmplY3RcclxuXHQgKi9cclxuXHRwcml2YXRlIGdldENvdW50cnlJc29Db2RlKFxyXG5cdFx0Y291bnRyeUNvZGU6IG51bWJlcixcclxuXHRcdG51bWJlcjogbHBuLlBob25lTnVtYmVyXHJcblx0KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuXHRcdC8vIFdpbGwgdXNlIHRoaXMgdG8gbWF0Y2ggYXJlYSBjb2RlIGZyb20gdGhlIGZpcnN0IG51bWJlcnNcclxuXHRcdGNvbnN0IHJhd051bWJlciA9IG51bWJlclsndmFsdWVzXyddWycyJ10udG9TdHJpbmcoKTtcclxuXHRcdC8vIExpc3Qgb2YgYWxsIGNvdW50cmllcyB3aXRoIGNvdW50cnlDb2RlIChjYW4gYmUgbW9yZSB0aGFuIG9uZS4gZS54LiBVUywgQ0EsIERPLCBQUiBhbGwgaGF2ZSArMSBjb3VudHJ5Q29kZSlcclxuXHRcdGNvbnN0IGNvdW50cmllcyA9IHRoaXMuYWxsQ291bnRyaWVzLmZpbHRlcihcclxuXHRcdFx0KGMpID0+IGMuZGlhbENvZGUgPT09IGNvdW50cnlDb2RlLnRvU3RyaW5nKClcclxuXHRcdCk7XHJcblx0XHQvLyBNYWluIGNvdW50cnkgaXMgdGhlIGNvdW50cnksIHdoaWNoIGhhcyBubyBhcmVhQ29kZXMgc3BlY2lmaWVkIGluIGNvdW50cnktY29kZS50cyBmaWxlLlxyXG5cdFx0Y29uc3QgbWFpbkNvdW50cnkgPSBjb3VudHJpZXMuZmluZCgoYykgPT4gYy5hcmVhQ29kZXMgPT09IHVuZGVmaW5lZCk7XHJcblx0XHQvLyBTZWNvbmRhcnkgY291bnRyaWVzIGFyZSBhbGwgY291bnRyaWVzLCB3aGljaCBoYXZlIGFyZWFDb2RlcyBzcGVjaWZpZWQgaW4gY291bnRyeS1jb2RlLnRzIGZpbGUuXHJcblx0XHRjb25zdCBzZWNvbmRhcnlDb3VudHJpZXMgPSBjb3VudHJpZXMuZmlsdGVyKFxyXG5cdFx0XHQoYykgPT4gYy5hcmVhQ29kZXMgIT09IHVuZGVmaW5lZFxyXG5cdFx0KTtcclxuXHRcdGxldCBtYXRjaGVkQ291bnRyeSA9IG1haW5Db3VudHJ5ID8gbWFpbkNvdW50cnkuaXNvMiA6IHVuZGVmaW5lZDtcclxuXHJcblx0XHQvKlxyXG5cdFx0XHRJdGVyYXRlIG92ZXIgZWFjaCBzZWNvbmRhcnkgY291bnRyeSBhbmQgY2hlY2sgaWYgbmF0aW9uYWxOdW1iZXIgc3RhcnRzIHdpdGggYW55IG9mIGFyZWFDb2RlcyBhdmFpbGFibGUuXHJcblx0XHRcdElmIG5vIG1hdGNoZXMgZm91bmQsIGZhbGxiYWNrIHRvIHRoZSBtYWluIGNvdW50cnkuXHJcblx0XHQqL1xyXG5cdFx0c2Vjb25kYXJ5Q291bnRyaWVzLmZvckVhY2goKGNvdW50cnkpID0+IHtcclxuXHRcdFx0Y291bnRyeS5hcmVhQ29kZXMuZm9yRWFjaCgoYXJlYUNvZGUpID0+IHtcclxuXHRcdFx0XHRpZiAocmF3TnVtYmVyLnN0YXJ0c1dpdGgoYXJlYUNvZGUpKSB7XHJcblx0XHRcdFx0XHRtYXRjaGVkQ291bnRyeSA9IGNvdW50cnkuaXNvMjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cmV0dXJuIG1hdGNoZWRDb3VudHJ5O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogR2V0cyBmb3JtYXR0ZWQgZXhhbXBsZSBwaG9uZSBudW1iZXIgZnJvbSBwaG9uZVV0aWwuXHJcblx0ICogQHBhcmFtIGNvdW50cnlDb2RlIHN0cmluZ1xyXG5cdCAqL1xyXG5cdHByb3RlY3RlZCBnZXRQaG9uZU51bWJlclBsYWNlSG9sZGVyKGNvdW50cnlDb2RlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGhvbmVVdGlsLmZvcm1hdChcclxuXHRcdFx0XHR0aGlzLnBob25lVXRpbC5nZXRFeGFtcGxlTnVtYmVyKGNvdW50cnlDb2RlKSxcclxuXHRcdFx0XHRscG4uUGhvbmVOdW1iZXJGb3JtYXRbdGhpcy5udW1iZXJGb3JtYXRdXHJcblx0XHRcdCk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiBlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2xlYXJpbmcgdGhlIGxpc3QgdG8gYXZvaWQgZHVwbGljYXRlcyAoaHR0cHM6Ly9naXRodWIuY29tL3dlYmNhdDEyMzQ1L25neC1pbnRsLXRlbC1pbnB1dC9pc3N1ZXMvMjQ4KVxyXG5cdCAqL1xyXG5cdHByb3RlY3RlZCBmZXRjaENvdW50cnlEYXRhKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5hbGxDb3VudHJpZXMgPSBbXTtcclxuXHJcblx0XHR0aGlzLmNvdW50cnlDb2RlRGF0YS5hbGxDb3VudHJpZXMuZm9yRWFjaCgoYykgPT4ge1xyXG5cdFx0XHRjb25zdCBjb3VudHJ5OiBDb3VudHJ5ID0ge1xyXG5cdFx0XHRcdG5hbWU6IGMubmFtZSxcclxuXHRcdFx0XHRpc28yOiBjLmNvZGUudG9Mb3dlckNhc2UoKSxcclxuXHRcdFx0XHRkaWFsQ29kZTogYy5kaWFsX2NvZGUucmVwbGFjZSgnKycsICcnKSxcclxuXHRcdFx0XHRwcmlvcml0eTogYy5wcmlvcml0eSA/IGMucHJpb3JpdHkgOiAwLFxyXG5cdFx0XHRcdGFyZWFDb2RlczogYy5hcmVhX2NvZGVzID8gYy5hcmVhX2NvZGVzIDogdW5kZWZpbmVkLFxyXG5cdFx0XHRcdGh0bWxJZDogYGl0aS0wX19pdGVtLSR7Yy5jb2RlLnRvTG93ZXJDYXNlKCl9YCxcclxuXHRcdFx0XHRmbGFnQ2xhc3M6IGBpdGlfXyR7Yy5jb2RlLnRvTG9jYWxlTG93ZXJDYXNlKCl9YCxcclxuXHRcdFx0XHRwbGFjZUhvbGRlcjogJycsXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZiAodGhpcy5lbmFibGVQbGFjZWhvbGRlcikge1xyXG5cdFx0XHRcdGNvdW50cnkucGxhY2VIb2xkZXIgPSB0aGlzLmdldFBob25lTnVtYmVyUGxhY2VIb2xkZXIoXHJcblx0XHRcdFx0XHRjb3VudHJ5LmlzbzIudG9VcHBlckNhc2UoKVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYWxsQ291bnRyaWVzLnB1c2goY291bnRyeSk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuYWxsQ291bnRyaWVzLnNvcnQodGhpcy5zb3J0QWxwaGFiZXRpY2FsbHlCeUZpZWxkKCduYW1lJykpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUG9wdWxhdGVzIHByZWZlcnJlZENvdW50cmllc0luRHJvcERvd24gd2l0aCBwcmVmZmVycmVkIGNvdW50cmllcy5cclxuXHQgKi9cclxuXHRwcml2YXRlIHVwZGF0ZVByZWZlcnJlZENvdW50cmllcygpIHtcclxuXHRcdGlmICh0aGlzLnByZWZlcnJlZENvdW50cmllcy5sZW5ndGgpIHtcclxuXHRcdFx0dGhpcy5wcmVmZXJyZWRDb3VudHJpZXNJbkRyb3BEb3duID0gW107XHJcblx0XHRcdHRoaXMucHJlZmVycmVkQ291bnRyaWVzLmZvckVhY2goKGlzbzIpID0+IHtcclxuXHRcdFx0XHRjb25zdCBwcmVmZXJyZWRDb3VudHJ5ID0gdGhpcy5hbGxDb3VudHJpZXMuZmlsdGVyKChjKSA9PiB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYy5pc28yID09PSBpc28yO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLnByZWZlcnJlZENvdW50cmllc0luRHJvcERvd24ucHVzaChwcmVmZXJyZWRDb3VudHJ5WzBdKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBVcGRhdGVzIHNlbGVjdGVkQ291bnRyeS5cclxuXHQgKi9cclxuXHRwcml2YXRlIHVwZGF0ZVNlbGVjdGVkQ291bnRyeSgpIHtcclxuXHRcdGlmICh0aGlzLnNlbGVjdGVkQ291bnRyeUlTTykge1xyXG5cdFx0XHR0aGlzLnNlbGVjdGVkQ291bnRyeSA9IHRoaXMuYWxsQ291bnRyaWVzLmZpbmQoKGMpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gYy5pc28yLnRvTG93ZXJDYXNlKCkgPT09IHRoaXMuc2VsZWN0ZWRDb3VudHJ5SVNPLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRpZiAodGhpcy5zZWxlY3RlZENvdW50cnkpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5waG9uZU51bWJlcikge1xyXG5cdFx0XHRcdFx0dGhpcy5vblBob25lTnVtYmVyQ2hhbmdlKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIFJlYXNvbjogYXZvaWQgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU0MzU4MTMzLzE2MTc1OTBcclxuXHRcdFx0XHRcdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tbnVsbC1rZXl3b3JkXHJcblx0XHRcdFx0XHR0aGlzLnByb3BhZ2F0ZUNoYW5nZShudWxsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlc2V0cyBzZWFyY2hlZCB2YWx1ZSBvbiBkcm9wZG93biByZW9wZW4uXHJcblx0ICovXHJcblx0cmVzZXRDb3VudHJ5U2VhcmNoVGV4dCgpIHtcclxuXHRcdHRoaXMuY291bnRyeVNlYXJjaFRleHQgPSAnJztcclxuXHRcdHRoaXMuYWxsQ291bnRyaWVzID0gdGhpcy5hbGxDb3VudHJpZXNNYXN0ZXJEYXRhO1xyXG5cdH1cclxuICAgIFxyXG5cdC8qKlxyXG5cdCAqIFNvcnQgYXJyYXkgb2Ygb2JqZWN0cyBhbHBoYWJldGljYWxseSBieSBmaWVsZCBuYW1lLlxyXG5cdCAqL1xyXG5cdHNvcnRBbHBoYWJldGljYWxseUJ5RmllbGQoZmllbGQpIHtcclxuXHRcdHJldHVybiAoYSwgYikgPT4ge1xyXG5cdFx0ICBpZiAoYVtmaWVsZF0gPCBiW2ZpZWxkXSkgeyByZXR1cm4gLTE7IH1cclxuXHRcdCAgaWYgKGFbZmllbGRdID4gYltmaWVsZF0pIHsgcmV0dXJuIDE7IH1cclxuXHRcdCAgcmV0dXJuIDA7XHJcblx0XHR9XHJcblx0ICB9XHJcbn1cclxuIl19