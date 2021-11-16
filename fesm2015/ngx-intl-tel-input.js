import * as lpn from 'google-libphonenumber';
import { Injectable, EventEmitter, Component, forwardRef, Input, Output, ViewChild, Directive, ElementRef, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, NgControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { setTheme } from 'ngx-bootstrap/utils';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';

class CountryCode {
    constructor() {
        this.allCountries = [
            {
                "name": "United States",
                "dial_code": "+1",
                "code": "US"
            },
            {
                "name": "United Kingdom",
                "dial_code": "+44",
                "code": "GB"
            },
            {
                "name": "India",
                "dial_code": "+91",
                "code": "IN"
            },
            {
                "name": "United Arab Emirates",
                "dial_code": "+971",
                "code": "AE"
            },
            {
                "name": "Saudi Arabia",
                "dial_code": "+966",
                "code": "SA"
            },
            {
                "name": "Singapore",
                "dial_code": "+65",
                "code": "SG"
            },
            {
                "name": "Japan",
                "dial_code": "+81",
                "code": "JP"
            },
            {
                "name": "Afghanistan",
                "dial_code": "+93",
                "code": "AF"
            },
            {
                "name": "Aland Islands",
                "dial_code": "+358",
                "code": "AX"
            },
            {
                "name": "Albania",
                "dial_code": "+355",
                "code": "AL"
            },
            {
                "name": "Algeria",
                "dial_code": "+213",
                "code": "DZ"
            },
            {
                "name": "American Samoa",
                "dial_code": "+1",
                "code": "AS",
                "priority": 1,
                "area_codes": [
                    '684'
                ]
            },
            {
                "name": "Andorra",
                "dial_code": "+376",
                "code": "AD"
            },
            {
                "name": "Angola",
                "dial_code": "+244",
                "code": "AO"
            },
            {
                "name": "Anguilla",
                "dial_code": "+1",
                "code": "AI",
                "priority": 1,
                "area_codes": [
                    '264'
                ]
            },
            {
                "name": "Antarctica",
                "dial_code": "+672",
                "code": "AQ"
            },
            {
                "name": "Antigua and Barbuda",
                "dial_code": "+1",
                "code": "AG",
                "priority": 1,
                "area_codes": [
                    '268'
                ]
            },
            {
                "name": "Argentina",
                "dial_code": "+54",
                "code": "AR"
            },
            {
                "name": "Armenia",
                "dial_code": "+374",
                "code": "AM"
            },
            {
                "name": "Aruba",
                "dial_code": "+297",
                "code": "AW"
            },
            {
                "name": "Australia",
                "dial_code": "+61",
                "code": "AU"
            },
            {
                "name": "Austria",
                "dial_code": "+43",
                "code": "AT"
            },
            {
                "name": "Azerbaijan",
                "dial_code": "+994",
                "code": "AZ"
            },
            {
                "name": "Bahamas",
                "dial_code": "+1",
                "code": "BS",
                "priority": 1,
                "area_codes": [
                    '242'
                ]
            },
            {
                "name": "Bahrain",
                "dial_code": "+973",
                "code": "BH"
            },
            {
                "name": "Bangladesh",
                "dial_code": "+880",
                "code": "BD"
            },
            {
                "name": "Barbados",
                "dial_code": "+1",
                "code": "BB",
                "priority": 1,
                "area_codes": [
                    '246'
                ]
            },
            {
                "name": "Belarus",
                "dial_code": "+375",
                "code": "BY"
            },
            {
                "name": "Belgium",
                "dial_code": "+32",
                "code": "BE"
            },
            {
                "name": "Belize",
                "dial_code": "+501",
                "code": "BZ"
            },
            {
                "name": "Benin",
                "dial_code": "+229",
                "code": "BJ"
            },
            {
                "name": "Bermuda",
                "dial_code": "+1",
                "code": "BM",
                "priority": 1,
                "area_codes": [
                    '441'
                ]
            },
            {
                "name": "Bhutan",
                "dial_code": "+975",
                "code": "BT"
            },
            {
                "name": "Bolivia, Plurinational State of",
                "dial_code": "+591",
                "code": "BO"
            },
            {
                "name": "Bosnia and Herzegovina",
                "dial_code": "+387",
                "code": "BA"
            },
            {
                "name": "Botswana",
                "dial_code": "+267",
                "code": "BW"
            },
            {
                "name": "Brazil",
                "dial_code": "+55",
                "code": "BR"
            },
            {
                "name": "British Indian Ocean Territory",
                "dial_code": "+246",
                "code": "IO"
            },
            {
                "name": "Brunei Darussalam",
                "dial_code": "+673",
                "code": "BN"
            },
            {
                "name": "Bulgaria",
                "dial_code": "+359",
                "code": "BG"
            },
            {
                "name": "Burkina Faso",
                "dial_code": "+226",
                "code": "BF"
            },
            {
                "name": "Burundi",
                "dial_code": "+257",
                "code": "BI"
            },
            {
                "name": "Cambodia",
                "dial_code": "+855",
                "code": "KH"
            },
            {
                "name": "Cameroon",
                "dial_code": "+237",
                "code": "CM"
            },
            {
                "name": "Canada",
                "dial_code": "+1",
                "code": "CA",
                "priority": 1,
                "area_codes": [
                    '204', '226', '236', '249', '250', '289', '306', '343', '365', '387', '403', '416',
                    '418', '431', '437', '438', '450', '506', '514', '519', '548', '579', '581', '587',
                    '604', '613', '639', '647', '672', '705', '709', '742', '778', '780', '782', '807',
                    '819', '825', '867', '873', '902', '905'
                ]
            },
            {
                "name": "Cape Verde",
                "dial_code": "+238",
                "code": "CV"
            },
            {
                "name": "Cayman Islands",
                "dial_code": "+1",
                "code": "KY",
                "priority": 1,
                "area_codes": [
                    '345'
                ]
            },
            {
                "name": "Central African Republic",
                "dial_code": "+236",
                "code": "CF"
            },
            {
                "name": "Chad",
                "dial_code": "+235",
                "code": "TD"
            },
            {
                "name": "Chile",
                "dial_code": "+56",
                "code": "CL"
            },
            {
                "name": "China",
                "dial_code": "+86",
                "code": "CN"
            },
            {
                "name": "Christmas Island",
                "dial_code": "+61",
                "code": "CX"
            },
            {
                "name": "Cocos (Keeling) Islands",
                "dial_code": "+61",
                "code": "CC"
            },
            {
                "name": "Colombia",
                "dial_code": "+57",
                "code": "CO"
            },
            {
                "name": "Comoros",
                "dial_code": "+269",
                "code": "KM"
            },
            {
                "name": "Republic of the Congo",
                "dial_code": "+242",
                "code": "CG"
            },
            {
                "name": "Democratic Republic of the Congo",
                "dial_code": "+243",
                "code": "CD"
            },
            {
                "name": "Cook Islands",
                "dial_code": "+682",
                "code": "CK"
            },
            {
                "name": "Costa Rica",
                "dial_code": "+506",
                "code": "CR"
            },
            {
                "name": "Cote d'Ivoire",
                "dial_code": "+225",
                "code": "CI"
            },
            {
                "name": "Croatia",
                "dial_code": "+385",
                "code": "HR"
            },
            {
                "name": "Cuba",
                "dial_code": "+53",
                "code": "CU"
            },
            {
                "name": "Cyprus",
                "dial_code": "+357",
                "code": "CY"
            },
            {
                "name": "Czech Republic",
                "dial_code": "+420",
                "code": "CZ"
            },
            {
                "name": "Denmark",
                "dial_code": "+45",
                "code": "DK"
            },
            {
                "name": "Djibouti",
                "dial_code": "+253",
                "code": "DJ"
            },
            {
                "name": "Dominica",
                "dial_code": "+1767",
                "code": "DM"
            },
            {
                "name": "Dominican Republic",
                "dial_code": "+1",
                "code": "DO",
                "priority": 2,
                "area_codes": ['809', '829', '849']
            },
            {
                "name": "Ecuador",
                "dial_code": "+593",
                "code": "EC"
            },
            {
                "name": "Egypt",
                "dial_code": "+20",
                "code": "EG"
            },
            {
                "name": "El Salvador",
                "dial_code": "+503",
                "code": "SV"
            },
            {
                "name": "Equatorial Guinea",
                "dial_code": "+240",
                "code": "GQ"
            },
            {
                "name": "Eritrea",
                "dial_code": "+291",
                "code": "ER"
            },
            {
                "name": "Estonia",
                "dial_code": "+372",
                "code": "EE"
            },
            {
                "name": "Ethiopia",
                "dial_code": "+251",
                "code": "ET"
            },
            {
                "name": "Falkland Islands (Malvinas)",
                "dial_code": "+500",
                "code": "FK"
            },
            {
                "name": "Faroe Islands",
                "dial_code": "+298",
                "code": "FO"
            },
            {
                "name": "Fiji",
                "dial_code": "+679",
                "code": "FJ"
            },
            {
                "name": "Finland",
                "dial_code": "+358",
                "code": "FI"
            },
            {
                "name": "France",
                "dial_code": "+33",
                "code": "FR"
            },
            {
                "name": "French Guiana",
                "dial_code": "+594",
                "code": "GF"
            },
            {
                "name": "French Polynesia",
                "dial_code": "+689",
                "code": "PF"
            },
            {
                "name": "Gabon",
                "dial_code": "+241",
                "code": "GA"
            },
            {
                "name": "Gambia",
                "dial_code": "+220",
                "code": "GM"
            },
            {
                "name": "Georgia",
                "dial_code": "+995",
                "code": "GE"
            },
            {
                "name": "Germany",
                "dial_code": "+49",
                "code": "DE"
            },
            {
                "name": "Ghana",
                "dial_code": "+233",
                "code": "GH"
            },
            {
                "name": "Gibraltar",
                "dial_code": "+350",
                "code": "GI"
            },
            {
                "name": "Greece",
                "dial_code": "+30",
                "code": "GR"
            },
            {
                "name": "Greenland",
                "dial_code": "+299",
                "code": "GL"
            },
            {
                "name": "Grenada",
                "dial_code": "+1473",
                "code": "GD"
            },
            {
                "name": "Guadeloupe",
                "dial_code": "+590",
                "code": "GP"
            },
            {
                "name": "Guam",
                "dial_code": "+1",
                "code": "GU",
                "priority": 1,
                "area_codes": [
                    '671'
                ]
            },
            {
                "name": "Guatemala",
                "dial_code": "+502",
                "code": "GT"
            },
            {
                "name": "Guernsey",
                "dial_code": "+44",
                "code": "GG",
                "priority": 1,
                "area_codes": [
                    '684'
                ]
            },
            {
                "name": "Guinea",
                "dial_code": "+224",
                "code": "GN"
            },
            {
                "name": "Guinea-Bissau",
                "dial_code": "+245",
                "code": "GW"
            },
            {
                "name": "Guyana",
                "dial_code": "+595",
                "code": "GY"
            },
            {
                "name": "Haiti",
                "dial_code": "+509",
                "code": "HT"
            },
            {
                "name": "Vatican City",
                "dial_code": "+379",
                "code": "VA"
            },
            {
                "name": "Honduras",
                "dial_code": "+504",
                "code": "HN"
            },
            {
                "name": "Hong Kong",
                "dial_code": "+852",
                "code": "HK"
            },
            {
                "name": "Hungary",
                "dial_code": "+36",
                "code": "HU"
            },
            {
                "name": "Iceland",
                "dial_code": "+354",
                "code": "IS"
            },
            {
                "name": "Indonesia",
                "dial_code": "+62",
                "code": "ID"
            },
            {
                "name": "Iran",
                "dial_code": "+98",
                "code": "IR"
            },
            {
                "name": "Iraq",
                "dial_code": "+964",
                "code": "IQ"
            },
            {
                "name": "Ireland",
                "dial_code": "+353",
                "code": "IE"
            },
            {
                "name": "Isle of Man",
                "dial_code": "+44",
                "code": "IM",
                "priority": 2,
                "area_codes": [
                    '1624'
                ]
            },
            {
                "name": "Israel",
                "dial_code": "+972",
                "code": "IL"
            },
            {
                "name": "Italy",
                "dial_code": "+39",
                "code": "IT"
            },
            {
                "name": "Jamaica",
                "dial_code": "+1",
                "code": "JM",
                "priority": 1,
                "area_codes": [
                    '876'
                ]
            },
            {
                "name": "Jersey",
                "dial_code": "+44",
                "code": "JE",
                "priority": 3,
                "area_codes": [
                    '1534'
                ]
            },
            {
                "name": "Jordan",
                "dial_code": "+962",
                "code": "JO"
            },
            {
                "name": "Kazakhstan",
                "dial_code": "+77",
                "code": "KZ"
            },
            {
                "name": "Kenya",
                "dial_code": "+254",
                "code": "KE"
            },
            {
                "name": "Kiribati",
                "dial_code": "+686",
                "code": "KI"
            },
            {
                "name": "North Korea, Democratic People's Republic of Korea",
                "dial_code": "+850",
                "code": "KP"
            },
            {
                "name": "South Korea",
                "dial_code": "+82",
                "code": "KR"
            },
            {
                "name": "Kuwait",
                "dial_code": "+965",
                "code": "KW"
            },
            {
                "name": "Kyrgyzstan",
                "dial_code": "+996",
                "code": "KG"
            },
            {
                "name": "Laos",
                "dial_code": "+856",
                "code": "LA"
            },
            {
                "name": "Latvia",
                "dial_code": "+371",
                "code": "LV"
            },
            {
                "name": "Lebanon",
                "dial_code": "+961",
                "code": "LB"
            },
            {
                "name": "Lesotho",
                "dial_code": "+266",
                "code": "LS"
            },
            {
                "name": "Liberia",
                "dial_code": "+231",
                "code": "LR"
            },
            {
                "name": "Libya",
                "dial_code": "+218",
                "code": "LY"
            },
            {
                "name": "Liechtenstein",
                "dial_code": "+423",
                "code": "LI"
            },
            {
                "name": "Lithuania",
                "dial_code": "+370",
                "code": "LT"
            },
            {
                "name": "Luxembourg",
                "dial_code": "+352",
                "code": "LU"
            },
            {
                "name": "Macao",
                "dial_code": "+853",
                "code": "MO"
            },
            {
                "name": "Macedonia",
                "dial_code": "+389",
                "code": "MK"
            },
            {
                "name": "Madagascar",
                "dial_code": "+261",
                "code": "MG"
            },
            {
                "name": "Malawi",
                "dial_code": "+265",
                "code": "MW"
            },
            {
                "name": "Malaysia",
                "dial_code": "+60",
                "code": "MY"
            },
            {
                "name": "Maldives",
                "dial_code": "+960",
                "code": "MV"
            },
            {
                "name": "Mali",
                "dial_code": "+223",
                "code": "ML"
            },
            {
                "name": "Malta",
                "dial_code": "+356",
                "code": "MT"
            },
            {
                "name": "Marshall Islands",
                "dial_code": "+692",
                "code": "MH"
            },
            {
                "name": "Martinique",
                "dial_code": "+596",
                "code": "MQ"
            },
            {
                "name": "Mauritania",
                "dial_code": "+222",
                "code": "MR"
            },
            {
                "name": "Mauritius",
                "dial_code": "+230",
                "code": "MU"
            },
            {
                "name": "Mayotte",
                "dial_code": "+262",
                "code": "YT"
            },
            {
                "name": "Mexico",
                "dial_code": "+52",
                "code": "MX"
            },
            {
                "name": "Micronesia, Federated States of Micronesia",
                "dial_code": "+691",
                "code": "FM"
            },
            {
                "name": "Moldova",
                "dial_code": "+373",
                "code": "MD"
            },
            {
                "name": "Monaco",
                "dial_code": "+377",
                "code": "MC"
            },
            {
                "name": "Mongolia",
                "dial_code": "+976",
                "code": "MN"
            },
            {
                "name": "Montenegro",
                "dial_code": "+382",
                "code": "ME"
            },
            {
                "name": "Montserrat",
                "dial_code": "+1",
                "code": "MS",
                "priority": 1,
                "area_codes": [
                    '664'
                ]
            },
            {
                "name": "Morocco",
                "dial_code": "+212",
                "code": "MA"
            },
            {
                "name": "Mozambique",
                "dial_code": "+258",
                "code": "MZ"
            },
            {
                "name": "Myanmar",
                "dial_code": "+95",
                "code": "MM"
            },
            {
                "name": "Namibia",
                "dial_code": "+264",
                "code": "NA"
            },
            {
                "name": "Nauru",
                "dial_code": "+674",
                "code": "NR"
            },
            {
                "name": "Nepal",
                "dial_code": "+977",
                "code": "NP"
            },
            {
                "name": "Netherlands",
                "dial_code": "+31",
                "code": "NL"
            },
            {
                "name": "Netherlands Antilles",
                "dial_code": "+599",
                "code": "AN"
            },
            {
                "name": "New Caledonia",
                "dial_code": "+687",
                "code": "NC"
            },
            {
                "name": "New Zealand",
                "dial_code": "+64",
                "code": "NZ"
            },
            {
                "name": "Nicaragua",
                "dial_code": "+505",
                "code": "NI"
            },
            {
                "name": "Niger",
                "dial_code": "+227",
                "code": "NE"
            },
            {
                "name": "Nigeria",
                "dial_code": "+234",
                "code": "NG"
            },
            {
                "name": "Niue",
                "dial_code": "+683",
                "code": "NU"
            },
            {
                "name": "Norfolk Island",
                "dial_code": "+672",
                "code": "NF"
            },
            {
                "name": "Northern Mariana Islands",
                "dial_code": "+1670",
                "code": "MP"
            },
            {
                "name": "Norway",
                "dial_code": "+47",
                "code": "NO"
            },
            {
                "name": "Oman",
                "dial_code": "+968",
                "code": "OM"
            },
            {
                "name": "Pakistan",
                "dial_code": "+92",
                "code": "PK"
            },
            {
                "name": "Palau",
                "dial_code": "+680",
                "code": "PW"
            },
            {
                "name": "Palestinian Territory, Occupied",
                "dial_code": "+970",
                "code": "PS"
            },
            {
                "name": "Panama",
                "dial_code": "+507",
                "code": "PA"
            },
            {
                "name": "Papua New Guinea",
                "dial_code": "+675",
                "code": "PG"
            },
            {
                "name": "Paraguay",
                "dial_code": "+595",
                "code": "PY"
            },
            {
                "name": "Peru",
                "dial_code": "+51",
                "code": "PE"
            },
            {
                "name": "Philippines",
                "dial_code": "+63",
                "code": "PH"
            },
            {
                "name": "Pitcairn",
                "dial_code": "+872",
                "code": "PN"
            },
            {
                "name": "Poland",
                "dial_code": "+48",
                "code": "PL"
            },
            {
                "name": "Portugal",
                "dial_code": "+351",
                "code": "PT"
            },
            {
                "name": "Puerto Rico",
                "dial_code": "+1",
                "code": "PR",
                "priority": 3,
                "area_codes": [
                    '787', '939'
                ]
            },
            {
                "name": "Qatar",
                "dial_code": "+974",
                "code": "QA"
            },
            {
                "name": "Romania",
                "dial_code": "+40",
                "code": "RO"
            },
            {
                "name": "Russia",
                "dial_code": "+7",
                "code": "RU"
            },
            {
                "name": "Rwanda",
                "dial_code": "+250",
                "code": "RW"
            },
            {
                "name": "Reunion",
                "dial_code": "+262",
                "code": "RE"
            },
            {
                "name": "Saint Barthelemy",
                "dial_code": "+590",
                "code": "BL"
            },
            {
                "name": "Saint Helena",
                "dial_code": "+290",
                "code": "SH"
            },
            {
                "name": "Saint Kitts and Nevis",
                "dial_code": "+1869",
                "code": "KN"
            },
            {
                "name": "Saint Lucia",
                "dial_code": "+1",
                "code": "LC",
                "priority": 1,
                "area_codes": [
                    '758'
                ]
            },
            {
                "name": "Saint Martin",
                "dial_code": "+590",
                "code": "MF"
            },
            {
                "name": "Saint Pierre and Miquelon",
                "dial_code": "+508",
                "code": "PM"
            },
            {
                "name": "Saint Vincent and the Grenadines",
                "dial_code": "+1",
                "code": "VC",
                "priority": 1,
                "area_codes": [
                    '784'
                ]
            },
            {
                "name": "Samoa",
                "dial_code": "+685",
                "code": "WS"
            },
            {
                "name": "San Marino",
                "dial_code": "+378",
                "code": "SM"
            },
            {
                "name": "Sao Tome and Principe",
                "dial_code": "+239",
                "code": "ST"
            },
            {
                "name": "Senegal",
                "dial_code": "+221",
                "code": "SN"
            },
            {
                "name": "Serbia",
                "dial_code": "+381",
                "code": "RS"
            },
            {
                "name": "Seychelles",
                "dial_code": "+248",
                "code": "SC"
            },
            {
                "name": "Sierra Leone",
                "dial_code": "+232",
                "code": "SL"
            },
            {
                "name": "Slovakia",
                "dial_code": "+421",
                "code": "SK"
            },
            {
                "name": "Slovenia",
                "dial_code": "+386",
                "code": "SI"
            },
            {
                "name": "Solomon Islands",
                "dial_code": "+677",
                "code": "SB"
            },
            {
                "name": "Somalia",
                "dial_code": "+252",
                "code": "SO"
            },
            {
                "name": "South Africa",
                "dial_code": "+27",
                "code": "ZA"
            },
            {
                "name": "South Sudan",
                "dial_code": "+211",
                "code": "SS"
            },
            {
                "name": "South Georgia and the South Sandwich Islands",
                "dial_code": "+500",
                "code": "GS"
            },
            {
                "name": "Spain",
                "dial_code": "+34",
                "code": "ES"
            },
            {
                "name": "Sri Lanka",
                "dial_code": "+94",
                "code": "LK"
            },
            {
                "name": "Sudan",
                "dial_code": "+249",
                "code": "SD"
            },
            {
                "name": "Suriname",
                "dial_code": "+597",
                "code": "SR"
            },
            {
                "name": "Svalbard and Jan Mayen",
                "dial_code": "+47",
                "code": "SJ"
            },
            {
                "name": "Swaziland",
                "dial_code": "+268",
                "code": "SZ"
            },
            {
                "name": "Sweden",
                "dial_code": "+46",
                "code": "SE"
            },
            {
                "name": "Switzerland",
                "dial_code": "+41",
                "code": "CH"
            },
            {
                "name": "Syria, Syrian Arab Republic",
                "dial_code": "+963",
                "code": "SY"
            },
            {
                "name": "Taiwan",
                "dial_code": "+886",
                "code": "TW"
            },
            {
                "name": "Tajikistan",
                "dial_code": "+992",
                "code": "TJ"
            },
            {
                "name": "Tanzania, United Republic of Tanzania",
                "dial_code": "+255",
                "code": "TZ"
            },
            {
                "name": "Thailand",
                "dial_code": "+66",
                "code": "TH"
            },
            {
                "name": "Timor-Leste, East Timor",
                "dial_code": "+670",
                "code": "TL"
            },
            {
                "name": "Togo",
                "dial_code": "+228",
                "code": "TG"
            },
            {
                "name": "Tokelau",
                "dial_code": "+690",
                "code": "TK"
            },
            {
                "name": "Tonga",
                "dial_code": "+676",
                "code": "TO"
            },
            {
                "name": "Trinidad and Tobago",
                "dial_code": "+1",
                "code": "TT",
                "priority": 1,
                "area_codes": [
                    '868'
                ]
            },
            {
                "name": "Tunisia",
                "dial_code": "+216",
                "code": "TN"
            },
            {
                "name": "Turkey",
                "dial_code": "+90",
                "code": "TR"
            },
            {
                "name": "Turkmenistan",
                "dial_code": "+993",
                "code": "TM"
            },
            {
                "name": "Turks and Caicos Islands",
                "dial_code": "+1649",
                "code": "TC"
            },
            {
                "name": "Tuvalu",
                "dial_code": "+688",
                "code": "TV"
            },
            {
                "name": "Uganda",
                "dial_code": "+256",
                "code": "UG"
            },
            {
                "name": "Ukraine",
                "dial_code": "+380",
                "code": "UA"
            },
            {
                "name": "Uruguay",
                "dial_code": "+598",
                "code": "UY"
            },
            {
                "name": "Uzbekistan",
                "dial_code": "+998",
                "code": "UZ"
            },
            {
                "name": "Vanuatu",
                "dial_code": "+678",
                "code": "VU"
            },
            {
                "name": "Venezuela, Bolivarian Republic of Venezuela",
                "dial_code": "+58",
                "code": "VE"
            },
            {
                "name": "Vietnam",
                "dial_code": "+84",
                "code": "VN"
            },
            {
                "name": "British Virgin Islands",
                "dial_code": "+1",
                "code": "VG",
                "priority": 1,
                "area_codes": [
                    '284'
                ]
            },
            {
                "name": "U.S. Virgin Islands",
                "dial_code": "+1",
                "code": "VI",
                "priority": 1,
                "area_codes": [
                    '340'
                ]
            },
            {
                "name": "Wallis and Futuna",
                "dial_code": "+681",
                "code": "WF"
            },
            {
                "name": "Yemen",
                "dial_code": "+967",
                "code": "YE"
            },
            {
                "name": "Zambia",
                "dial_code": "+260",
                "code": "ZM"
            },
            {
                "name": "Zimbabwe",
                "dial_code": "+263",
                "code": "ZW"
            }
        ];
    }
}
CountryCode.decorators = [
    { type: Injectable }
];

var SearchCountryField;
(function (SearchCountryField) {
    SearchCountryField["DialCode"] = "dialCode";
    SearchCountryField["Iso2"] = "iso2";
    SearchCountryField["Name"] = "name";
    SearchCountryField["All"] = "all";
})(SearchCountryField || (SearchCountryField = {}));

/*
We use "control: any" instead of "control: FormControl" to silence:
"Property 'nativeElement' does not exist on type 'FormControl'".
This happens because I've expanded control with nativeElement via
'NativeElementInjectorDirective' to get an access to the element.
More about this approach and reasons for this:
https://github.com/angular/angular/issues/18025
https://stackoverflow.com/a/54075119/1617590
*/
const phoneNumberValidator = (control) => {
    if (!control.value) {
        return;
    }
    // Find <input> inside injected nativeElement and get its "id".
    const el = control.nativeElement;
    const inputBox = el
        ? el.querySelector('input[type="tel"]')
        : undefined;
    if (inputBox) {
        const id = inputBox.id;
        const isCheckValidation = inputBox.getAttribute('validation');
        if (isCheckValidation === 'true') {
            const isRequired = control.errors && control.errors.required === true;
            const error = { validatePhoneNumber: { valid: false } };
            inputBox.setCustomValidity('Invalid field.');
            let number;
            try {
                number = lpn.PhoneNumberUtil.getInstance().parse(control.value.number, control.value.countryCode);
            }
            catch (e) {
                if (isRequired === true) {
                    return error;
                }
                else {
                    inputBox.setCustomValidity('');
                }
            }
            if (control.value) {
                if (!number) {
                    return error;
                }
                else {
                    if (!lpn.PhoneNumberUtil.getInstance().isValidNumberForRegion(number, control.value.countryCode)) {
                        return error;
                    }
                    else {
                        inputBox.setCustomValidity('');
                    }
                }
            }
        }
        else if (isCheckValidation === 'false') {
            inputBox.setCustomValidity('');
            control.clearValidators();
        }
    }
    return;
};

var PhoneNumberFormat;
(function (PhoneNumberFormat) {
    PhoneNumberFormat["International"] = "INTERNATIONAL";
    PhoneNumberFormat["National"] = "NATIONAL";
})(PhoneNumberFormat || (PhoneNumberFormat = {}));

const ɵ0 = phoneNumberValidator;
class NgxIntlTelInputComponent {
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

/*
"Property 'nativeElement' does not exist on type 'FormControl'".
'NativeElementInjectorDirective' injects nativeElement to each control,
so we can access it from inside validator for example.
More about this approach and reasons for this:
https://github.com/angular/angular/issues/18025
https://stackoverflow.com/a/54075119/1617590
*/
class NativeElementInjectorDirective {
    constructor(controlDir, host) {
        this.controlDir = controlDir;
        this.host = host;
    }
    ngOnInit() {
        if (this.controlDir.control) {
            this.controlDir.control['nativeElement'] = this.host.nativeElement;
        }
    }
}
NativeElementInjectorDirective.decorators = [
    { type: Directive, args: [{
                // tslint:disable-next-line: directive-selector
                selector: '[ngModel], [formControl], [formControlName]',
            },] }
];
NativeElementInjectorDirective.ctorParameters = () => [
    { type: NgControl },
    { type: ElementRef }
];

const dropdownModuleForRoot = BsDropdownModule.forRoot();
class NgxIntlTelInputModule {
}
NgxIntlTelInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgxIntlTelInputComponent, NativeElementInjectorDirective],
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    dropdownModuleForRoot,
                ],
                exports: [NgxIntlTelInputComponent, NativeElementInjectorDirective],
            },] }
];

var CountryISO;
(function (CountryISO) {
    CountryISO["Afghanistan"] = "af";
    CountryISO["Albania"] = "al";
    CountryISO["Algeria"] = "dz";
    CountryISO["AmericanSamoa"] = "as";
    CountryISO["Andorra"] = "ad";
    CountryISO["Angola"] = "ao";
    CountryISO["Anguilla"] = "ai";
    CountryISO["AntiguaAndBarbuda"] = "ag";
    CountryISO["Argentina"] = "ar";
    CountryISO["Armenia"] = "am";
    CountryISO["Aruba"] = "aw";
    CountryISO["Australia"] = "au";
    CountryISO["Austria"] = "at";
    CountryISO["Azerbaijan"] = "az";
    CountryISO["Bahamas"] = "bs";
    CountryISO["Bahrain"] = "bh";
    CountryISO["Bangladesh"] = "bd";
    CountryISO["Barbados"] = "bb";
    CountryISO["Belarus"] = "by";
    CountryISO["Belgium"] = "be";
    CountryISO["Belize"] = "bz";
    CountryISO["Benin"] = "bj";
    CountryISO["Bermuda"] = "bm";
    CountryISO["Bhutan"] = "bt";
    CountryISO["Bolivia"] = "bo";
    CountryISO["BosniaAndHerzegovina"] = "ba";
    CountryISO["Botswana"] = "bw";
    CountryISO["Brazil"] = "br";
    CountryISO["BritishIndianOceanTerritory"] = "io";
    CountryISO["BritishVirginIslands"] = "vg";
    CountryISO["Brunei"] = "bn";
    CountryISO["Bulgaria"] = "bg";
    CountryISO["BurkinaFaso"] = "bf";
    CountryISO["Burundi"] = "bi";
    CountryISO["Cambodia"] = "kh";
    CountryISO["Cameroon"] = "cm";
    CountryISO["Canada"] = "ca";
    CountryISO["CapeVerde"] = "cv";
    CountryISO["CaribbeanNetherlands"] = "bq";
    CountryISO["CaymanIslands"] = "ky";
    CountryISO["CentralAfricanRepublic"] = "cf";
    CountryISO["Chad"] = "td";
    CountryISO["Chile"] = "cl";
    CountryISO["China"] = "cn";
    CountryISO["ChristmasIsland"] = "cx";
    CountryISO["Cocos"] = "cc";
    CountryISO["Colombia"] = "co";
    CountryISO["Comoros"] = "km";
    CountryISO["CongoDRCJamhuriYaKidemokrasiaYaKongo"] = "cd";
    CountryISO["CongoRepublicCongoBrazzaville"] = "cg";
    CountryISO["CookIslands"] = "ck";
    CountryISO["CostaRica"] = "cr";
    CountryISO["C\u00F4teDIvoire"] = "ci";
    CountryISO["Croatia"] = "hr";
    CountryISO["Cuba"] = "cu";
    CountryISO["Cura\u00E7ao"] = "cw";
    CountryISO["Cyprus"] = "cy";
    CountryISO["CzechRepublic"] = "cz";
    CountryISO["Denmark"] = "dk";
    CountryISO["Djibouti"] = "dj";
    CountryISO["Dominica"] = "dm";
    CountryISO["DominicanRepublic"] = "do";
    CountryISO["Ecuador"] = "ec";
    CountryISO["Egypt"] = "eg";
    CountryISO["ElSalvador"] = "sv";
    CountryISO["EquatorialGuinea"] = "gq";
    CountryISO["Eritrea"] = "er";
    CountryISO["Estonia"] = "ee";
    CountryISO["Ethiopia"] = "et";
    CountryISO["FalklandIslands"] = "fk";
    CountryISO["FaroeIslands"] = "fo";
    CountryISO["Fiji"] = "fj";
    CountryISO["Finland"] = "fi";
    CountryISO["France"] = "fr";
    CountryISO["FrenchGuiana"] = "gf";
    CountryISO["FrenchPolynesia"] = "pf";
    CountryISO["Gabon"] = "ga";
    CountryISO["Gambia"] = "gm";
    CountryISO["Georgia"] = "ge";
    CountryISO["Germany"] = "de";
    CountryISO["Ghana"] = "gh";
    CountryISO["Gibraltar"] = "gi";
    CountryISO["Greece"] = "gr";
    CountryISO["Greenland"] = "gl";
    CountryISO["Grenada"] = "gd";
    CountryISO["Guadeloupe"] = "gp";
    CountryISO["Guam"] = "gu";
    CountryISO["Guatemala"] = "gt";
    CountryISO["Guernsey"] = "gg";
    CountryISO["Guinea"] = "gn";
    CountryISO["GuineaBissau"] = "gw";
    CountryISO["Guyana"] = "gy";
    CountryISO["Haiti"] = "ht";
    CountryISO["Honduras"] = "hn";
    CountryISO["HongKong"] = "hk";
    CountryISO["Hungary"] = "hu";
    CountryISO["Iceland"] = "is";
    CountryISO["India"] = "in";
    CountryISO["Indonesia"] = "id";
    CountryISO["Iran"] = "ir";
    CountryISO["Iraq"] = "iq";
    CountryISO["Ireland"] = "ie";
    CountryISO["IsleOfMan"] = "im";
    CountryISO["Israel"] = "il";
    CountryISO["Italy"] = "it";
    CountryISO["Jamaica"] = "jm";
    CountryISO["Japan"] = "jp";
    CountryISO["Jersey"] = "je";
    CountryISO["Jordan"] = "jo";
    CountryISO["Kazakhstan"] = "kz";
    CountryISO["Kenya"] = "ke";
    CountryISO["Kiribati"] = "ki";
    CountryISO["Kosovo"] = "xk";
    CountryISO["Kuwait"] = "kw";
    CountryISO["Kyrgyzstan"] = "kg";
    CountryISO["Laos"] = "la";
    CountryISO["Latvia"] = "lv";
    CountryISO["Lebanon"] = "lb";
    CountryISO["Lesotho"] = "ls";
    CountryISO["Liberia"] = "lr";
    CountryISO["Libya"] = "ly";
    CountryISO["Liechtenstein"] = "li";
    CountryISO["Lithuania"] = "lt";
    CountryISO["Luxembourg"] = "lu";
    CountryISO["Macau"] = "mo";
    CountryISO["Macedonia"] = "mk";
    CountryISO["Madagascar"] = "mg";
    CountryISO["Malawi"] = "mw";
    CountryISO["Malaysia"] = "my";
    CountryISO["Maldives"] = "mv";
    CountryISO["Mali"] = "ml";
    CountryISO["Malta"] = "mt";
    CountryISO["MarshallIslands"] = "mh";
    CountryISO["Martinique"] = "mq";
    CountryISO["Mauritania"] = "mr";
    CountryISO["Mauritius"] = "mu";
    CountryISO["Mayotte"] = "yt";
    CountryISO["Mexico"] = "mx";
    CountryISO["Micronesia"] = "fm";
    CountryISO["Moldova"] = "md";
    CountryISO["Monaco"] = "mc";
    CountryISO["Mongolia"] = "mn";
    CountryISO["Montenegro"] = "me";
    CountryISO["Montserrat"] = "ms";
    CountryISO["Morocco"] = "ma";
    CountryISO["Mozambique"] = "mz";
    CountryISO["Myanmar"] = "mm";
    CountryISO["Namibia"] = "na";
    CountryISO["Nauru"] = "nr";
    CountryISO["Nepal"] = "np";
    CountryISO["Netherlands"] = "nl";
    CountryISO["NewCaledonia"] = "nc";
    CountryISO["NewZealand"] = "nz";
    CountryISO["Nicaragua"] = "ni";
    CountryISO["Niger"] = "ne";
    CountryISO["Nigeria"] = "ng";
    CountryISO["Niue"] = "nu";
    CountryISO["NorfolkIsland"] = "nf";
    CountryISO["NorthKorea"] = "kp";
    CountryISO["NorthernMarianaIslands"] = "mp";
    CountryISO["Norway"] = "no";
    CountryISO["Oman"] = "om";
    CountryISO["Pakistan"] = "pk";
    CountryISO["Palau"] = "pw";
    CountryISO["Palestine"] = "ps";
    CountryISO["Panama"] = "pa";
    CountryISO["PapuaNewGuinea"] = "pg";
    CountryISO["Paraguay"] = "py";
    CountryISO["Peru"] = "pe";
    CountryISO["Philippines"] = "ph";
    CountryISO["Poland"] = "pl";
    CountryISO["Portugal"] = "pt";
    CountryISO["PuertoRico"] = "pr";
    CountryISO["Qatar"] = "qa";
    CountryISO["R\u00E9union"] = "re";
    CountryISO["Romania"] = "ro";
    CountryISO["Russia"] = "ru";
    CountryISO["Rwanda"] = "rw";
    CountryISO["SaintBarth\u00E9lemy"] = "bl";
    CountryISO["SaintHelena"] = "sh";
    CountryISO["SaintKittsAndNevis"] = "kn";
    CountryISO["SaintLucia"] = "lc";
    CountryISO["SaintMartin"] = "mf";
    CountryISO["SaintPierreAndMiquelon"] = "pm";
    CountryISO["SaintVincentAndTheGrenadines"] = "vc";
    CountryISO["Samoa"] = "ws";
    CountryISO["SanMarino"] = "sm";
    CountryISO["S\u00E3oTom\u00E9AndPr\u00EDncipe"] = "st";
    CountryISO["SaudiArabia"] = "sa";
    CountryISO["Senegal"] = "sn";
    CountryISO["Serbia"] = "rs";
    CountryISO["Seychelles"] = "sc";
    CountryISO["SierraLeone"] = "sl";
    CountryISO["Singapore"] = "sg";
    CountryISO["SintMaarten"] = "sx";
    CountryISO["Slovakia"] = "sk";
    CountryISO["Slovenia"] = "si";
    CountryISO["SolomonIslands"] = "sb";
    CountryISO["Somalia"] = "so";
    CountryISO["SouthAfrica"] = "za";
    CountryISO["SouthKorea"] = "kr";
    CountryISO["SouthSudan"] = "ss";
    CountryISO["Spain"] = "es";
    CountryISO["SriLanka"] = "lk";
    CountryISO["Sudan"] = "sd";
    CountryISO["Suriname"] = "sr";
    CountryISO["SvalbardAndJanMayen"] = "sj";
    CountryISO["Swaziland"] = "sz";
    CountryISO["Sweden"] = "se";
    CountryISO["Switzerland"] = "ch";
    CountryISO["Syria"] = "sy";
    CountryISO["Taiwan"] = "tw";
    CountryISO["Tajikistan"] = "tj";
    CountryISO["Tanzania"] = "tz";
    CountryISO["Thailand"] = "th";
    CountryISO["TimorLeste"] = "tl";
    CountryISO["Togo"] = "tg";
    CountryISO["Tokelau"] = "tk";
    CountryISO["Tonga"] = "to";
    CountryISO["TrinidadAndTobago"] = "tt";
    CountryISO["Tunisia"] = "tn";
    CountryISO["Turkey"] = "tr";
    CountryISO["Turkmenistan"] = "tm";
    CountryISO["TurksAndCaicosIslands"] = "tc";
    CountryISO["Tuvalu"] = "tv";
    CountryISO["USVirginIslands"] = "vi";
    CountryISO["Uganda"] = "ug";
    CountryISO["Ukraine"] = "ua";
    CountryISO["UnitedArabEmirates"] = "ae";
    CountryISO["UnitedKingdom"] = "gb";
    CountryISO["UnitedStates"] = "us";
    CountryISO["Uruguay"] = "uy";
    CountryISO["Uzbekistan"] = "uz";
    CountryISO["Vanuatu"] = "vu";
    CountryISO["VaticanCity"] = "va";
    CountryISO["Venezuela"] = "ve";
    CountryISO["Vietnam"] = "vn";
    CountryISO["WallisAndFutuna"] = "wf";
    CountryISO["WesternSahara"] = "eh";
    CountryISO["Yemen"] = "ye";
    CountryISO["Zambia"] = "zm";
    CountryISO["Zimbabwe"] = "zw";
    CountryISO["\u00C5landIslands"] = "ax";
})(CountryISO || (CountryISO = {}));

/*
 * Public API Surface of ngx-intl-tel-input
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CountryISO, NativeElementInjectorDirective, NgxIntlTelInputComponent, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField, dropdownModuleForRoot, ɵ0, CountryCode as ɵa, phoneNumberValidator as ɵb };
//# sourceMappingURL=ngx-intl-tel-input.js.map
