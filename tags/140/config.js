/**
 * Config
 *
 * @author Ludovic Valente
 * @web pitaso.com
 * @web xeoos.fr
 */
//UTF8: �
//API maps
//http://econym.org.uk/gmap/
//http://code.google.com/apis/maps/documentation/reference.html
//Geoip
//http://www.geoipview.com/
//cartes
//www.guideroutier.lu/
//INFO
//http://www.acl.lu/fr/trafic_news/info_trafic_luxembourg
//www.vdl.lu/Environnement+et+mobilit�/Circulation/Trafic_Info.html
//temps
//www.guideroutier.lu/mobile/index.php
//cameras
//www.guideroutier.lu/mobile/camera.php
//www.driving.lu/index.php?module=auto&action=getListeCamera&idauto=1
//API googlemaps : http://www.guideroutier.lu/xmlgen.php?catid=0&localite=&numeromaison=undefined
//chantiers
//www.vdl.lu/Chantiers_de_courte_dur�e-path-1,641223,1445670.html
//www.vdl.lu/Chantiers_de_longue_dur�e-path-1,641223,1445670.html
//http://www2.pch.etat.lu/chantiers/tableau_chantiers_autoroutes.jsp
//http://www2.pch.etat.lu/chantiers/tableau_chantiers_autoroutes.jsp?type=1&service=all&show=longue
//www.pch.public.lu/chantiers/chantiers/chantiers.jsp?type=1&service=all
//www.pch.public.lu/chantiers/chantiers/chantiers.jsp?type=2&service=all
//API googlemaps : http://www.guideroutier.lu/xmlgen.php?catid=7&localite=&numeromaison=undefined
//radars
//www.police.public.lu/actualites/trafic/controles_radar/index.html
//API googlemaps : http://www.guideroutier.lu/xmlgen.php?catid=6&localite=&numeromaison=undefined
//parking
//www.driving.lu/index.php?module=auto&action=getGuidageParking
//www.vdl.lu/Guidage_parking.html
//API : service.vdl.lu/rss/circulation_guidageparking.php
function getGUID(){
    if (typeof chrome !== 'undefined' && chrome.extension) {
        var url = chrome.extension.getURL('bg.html');
        var m = /:\/\/(\w+)/.exec(url);
        return m[1];
    } else {
        return false;
    }
}

var GUID = getGUID();
var LANGS = {
    en: {
        NOTRAFFICINFO: 'No traffic info',
        to: 'to',
        map: 'Map'
    }
};
var LANG = LANGS.en;
//Temps de parcours
var mcfg = {
    username: 'valente',
    password: 'fR6' + 'UmJ',
    dataType: 'xml',
    headers: [{
        'Accept': 'application/json'
    }, {
        'Content-Type': 'application/json'
    }]
};
//var urlTime = 'http://www2.pch.etat.lu/info_trafic/temps_parcours/temps_parcours_convert.jsp';
var urlTime = 'http://www2.pch.etat.lu/citaRS/seam/resource/rest/cita/tempsParcours/actuel';
var timesCoords = {
    treves: {
        i: 1,
        name: "Wasserbillig(Trèves)",
        from: {
            lat: 49.7281619614461,
            lng: 6.491616368293762
        },
        to: {
            lat: 49.7280926086086,
            lng: 6.491836309432983
        }
    },
    luxest: {
        i: 2,
        name: "Senningerberg(Lux Est)",
        from: {
            lat: 49.64259201082733,
            lng: 6.217709183692932
        },
        to: {
            lat: 49.64259201082733,
            lng: 6.217709183692932
        }
    },
    hollerich: {
        i: 3,
        name: "Hollerich",
        from: {
            lat: 49.59980791291147,
            lng: 6.112797260284424
        },
        to: {
            lat: 49.59980791291147,
            lng: 6.112797260284424
        }
    },
    gasperich: {
        i: 3.1,
        name: "Gasperich",
        from: {
            lat: 49.576806067218364,
            lng: 6.124733090400696
        },
        to: {
            lat: 49.576806067218364,
            lng: 6.124733090400696
        }
    },
    bridel: {
        i: 4,
        name: "Bridel",
        from: {
            lat: 49.63001194343733,
            lng: 6.067285537719727
        },
        to: {
            lat: 49.62989380533881,
            lng: 6.067092418670654
        }
    },
    belgique: {
        i: 5,
        name: "Belgique",
        from: {
            lat: 49.63829479456733,
            lng: 5.907082557678223
        },
        to: {
            lat: 49.63839206800664,
            lng: 5.907345414161682
        }
    },
    esch: {
        i: 6,
        name: "Esch",
        from: {
            lat: 49.51625151986239,
            lng: 5.996840000152588
        },
        to: {
            lat: 49.51625151986239,
            lng: 5.996840000152588
        }
    },
    france: {
        i: 7,
        name: "France",
        from: {
            lat: 49.47257920235622,
            lng: 6.121401786804199
        },
        to: {
            lat: 49.472467654625156,
            lng: 6.121192574501038
        }
    },
    schengen: {
        i: 8,
        name: "Schengen(Allemagne)",
        from: {
            lat: 49.47800987525055,
            lng: 6.361062526702881
        },
        to: {
            lat: 49.47800987525055,
            lng: 6.361062526702881
        }
    }
};

var dirCoords = {
    "Croix de Gasperich": {
        lat: 49.576806067218364,
        lng: 6.124733090400696
    },
    "Echangeur Itzig": {
        lat: 49.592420000000004,
        lng: 6.1666300000000005
    },
    "Echangeur Hamm": {
        lat: 49.61209,
        lng: 6.17719
    },
    "Echangeur Kirchberg": {
        lat: 49.63557,
        lng: 6.182150000000001
    },
    "Jonction Grunewald": {
        lat: 49.642590000000006,
        lng: 6.2182200000000005
    },
    "Echangeur Senningerberg": {
        lat: 49.642590000000006,
        lng: 6.2182200000000005
    },
    "Echangeur Cargo-Center": {
        lat: 49.637600000000006,
        lng: 6.236960000000001
    },
    "Echangeur Munsbach": {
        lat: 49.641000000000005,
        lng: 6.26635
    },
    "Echangeur Flaxweiler": {
        lat: 49.66302,
        lng: 6.35425
    },
    "Echangeur Potaschberg": {
        lat: 49.678900000000006,
        lng: 6.3982600000000005
    },
    "Echangeur Mertert": {
        lat: 49.693920000000006,
        lng: 6.44857
    },
    "Echangeur Wasserbillig": {
        lat: 49.725410000000004,
        lng: 6.489240000000001
    },
    "Aire de Wasserbillig": {
        lat: 49.72917,
        lng: 6.4933000000000005
    },
    "Frontiere Allemagne": {
        lat: 49.733050000000006,
        lng: 6.50121
    },
    "Rond-Point Gasperich-Howald": {
        lat: 49.58518,
        lng: 6.1336
    },
    "Echangeur Hesperange": {
        lat: 49.57873000000001,
        lng: 6.152380000000001
    },
    "Aire de Berchem": {
        lat: 49.53654,
        lng: 6.1143
    },
    "Echangeur Livange": {
        lat: 49.531760000000006,
        lng: 6.11333
    },
    "Croix de Bettembourg": {
        lat: 49.49692,
        lng: 6.11706
    },
    "Echangeur Dudelange": {
        lat: 49.484750000000005,
        lng: 6.117850000000001
    },
    "Douane Dudelange": {
        lat: 49.4585,
        lng: 6.0808800000000005
    },
    "Frontière France": {
        lat: 49.47247,
        lng: 6.121200000000001
    },
    "Croisement Merl": {
        lat: 49.60701,
        lng: 6.081080000000001
    },
    "Croix de Cessange": {
        lat: 49.58599,
        lng: 6.087300000000001
    },
    "Echangeur Leudelange-Nord": {
        lat: 49.56687,
        lng: 6.0850800000000005
    },
    "Echangeur Leudelange-Sud": {
        lat: 49.556090000000005,
        lng: 6.05506
    },
    "Aire de Pontpierre": {
        lat: 49.03913000000001,
        lng: 6.62546
    },
    "Echangeur Pontpierre": {
        lat: 49.042750000000005,
        lng: 6.626460000000001
    },
    "Echangeur Foetz": {
        lat: 49.52328000000001,
        lng: 6.0056
    },
    "Jonction Esch": {
        lat: 49.52121,
        lng: 6.003590000000001
    },
    "Echangeur Lallange": {
        lat: 49.515040000000006,
        lng: 5.992500000000001
    },
    "Jonction Lankelz": {
        lat: 49.51259,
        lng: 5.97576
    },
    "Rond-Point Raemerich": {
        lat: 49.50862,
        lng: 5.957820000000001
    },
    "Echangeur Helfenterbruck": {
        lat: 49.60372,
        lng: 6.080290000000001
    },
    "Echangeur Strassen": {
        lat: 49.62008,
        lng: 6.083150000000001
    },
    "Echangeur Bridel": {
        lat: 49.63006000000001,
        lng: 6.066120000000001
    },
    "Echangeur Mamer": {
        lat: 49.6388,
        lng: 6.008400000000001
    },
    "Aire de Capellen": {
        lat: 49.63485000000001,
        lng: 5.9891700000000005
    },
    "Echangeur Steinfort": {
        lat: 49.635540000000006,
        lng: 5.954420000000001
    },
    "Frontiere Belgique": {
        lat: 49.63828,
        lng: 5.9072700000000005
    },
    "Waldhof": {
        lat: 49.65001,
        lng: 6.185980000000001
    },
    "Lorentzweiler": {
        lat: 49.706300000000006,
        lng: 6.13252
    },
    "Schoenfels": {
        lat: 49.73033,
        lng: 6.1066400000000005
    },
    "Mersch": {
        lat: 49.73836000000001,
        lng: 6.0974
    },
    "Merscherbierg": {
        lat: 49.80369,
        lng: 6.10967
    },
    "Comar-Berg": {
        lat: 49.820130000000006,
        lng: 6.098350000000001
    },
    "Schieren": {
        lat: 49.836020000000005,
        lng: 6.099920000000001
    },
    "Biff": {
        lat: 49.63956,
        lng: 5.8411800000000005
    },
    "Echangeur Bascharage": {
        lat: 49.56071000000001,
        lng: 5.8955
    },
    "Echangeur Sanem": {
        lat: 49.54343,
        lng: 5.918990000000001
    },
    "Echangeur Differdange": {
        lat: 49.55277,
        lng: 5.9057
    },
    "Echangeur Ehlerange": {
        num: 4,
        lat: 49.517390000000006,
        lng: 5.97339
    },
    "Echangeur Schifflange": {
        num: 6,
        lat: 49.51299,
        lng: 6.016170000000001
    },
    "Echangeur Kayl": {
        num: 7,
        lat: 49.499700000000004,
        lng: 6.0536900000000005
    },
    "Echangeur Burange": {
        num: 4,
        lat: 49.49989,
        lng: 6.088310000000001
    },
    "Echangeur Hellange": {
        lat: 49.503220000000006,
        lng: 6.1315100000000005
    },
    "Echangeur Frisange": {
        num: 10,
        lat: 49.506890000000006,
        lng: 6.19406
    },
    "Echangeur Altwies": {
        num: 11,
        lat: 49.51691,
        lng: 6.2466800000000005
    },
    "Echangeur Mondorf": {
        num: 12,
        lat: 49.51362,
        lng: 6.2916300000000005
    },
    "Aire de Burmerange": {
        lat: 49.495110000000004,
        lng: 6.317570000000001
    },
    "Echangeur Schengen": {
        lat: 49.47809,
        lng: 6.363200000000001
    },
    "Frontière Allemagne": {
        lat: 49.47925000000001,
        lng: 6.367780000000001
    }
};

var timeMappings = {
    'Fr. Belgique vers Gasperich': {
        code: 'A6_lux_sud',
        vid: 1,
        cat: 'LUX-SUD',
        from: 'belgique',
        to: 'gasperich',
        text: 'Belgique ' + LANG.to + ' Gasperich'
    },
    'Fr. Belgique vers Kirchberg': {
        code: 'A6_lux_est',
        vid: 7,
        cat: 'LUX-EST',
        from: 'belgique',
        to: 'luxest',
        text: 'Belgique ' + LANG.to + ' Lux Est'
    },
    'Fr. Belgique vers Fr. France': {
        code: 'A6_france',
        vid: 2,
        cat: 'FRANCE',
        from: 'belgique',
        to: 'france',
        text: 'Belgique ' + LANG.to + ' France'
    },
    'Lallange vers Merl': {
        code: 'A4_lux_hol',
        vid: 8,
        cat: 'LUX-HOL',
        from: 'france',
        to: 'gasperich',
        text: 'France ' + LANG.to + ' Gasperich'
    },
    'Lallange vers Gasperich': {
        code: 'A4_lux_sud',
        vid: 9,
        cat: 'LUX-SUD',
        from: 'esch',
        to: 'gasperich',
        text: 'Esch ' + LANG.to + ' Gasperich'
    },
    'Lallange vers Kirchberg': {
        code: 'A4_lux_est',
        vid: 10,
        cat: 'LUX-EST',
        from: 'esch',
        to: 'luxest',
        text: 'Esch ' + LANG.to + ' Lux Est'
    },
    'Fr. France vers Gasperich': {
        code: 'A3_lux_sud',
        vid: 3,
        cat: 'LUX-SUD',
        //from: 'esch',
        from: 'france',
        //to: 'hollerich',
        to: 'gasperich',
        //text: 'Esch ' + LANG.to + ' Lux Hollerich'
        text: 'Esch ' + LANG.to + ' Gasperich'
    },
    'Fr. France vers Kirchberg': {
        code: 'A3_lux_est',
        vid: 11,
        cat: 'LUX-EST',
        from: 'france',
        to: 'luxest',
        text: 'France ' + LANG.to + ' Lux Est'
    },
    'Fr. France vers Fr. Belgique': {
        code: 'A3_belgique',
        vid: 4,
        cat: 'BELGIQUE',
        from: 'france',
        to: 'belgique',
        text: 'France ' + LANG.to + ' Belgique'
    },
    'Schengen vers Gasperich': {
        code: 'A13_lux_sud',
        vid: 12,
        cat: 'LUX-SUD',
        from: 'schengen',
        to: 'gasperich',
        text: 'Schengen ' + LANG.to + ' Gasperich'
    },
    'Schengen vers Kirchberg': {
        code: 'A13_lux_est',
        vid: 13,
        cat: 'LUX-EST',
        from: 'schengen',
        to: 'luxest',
        text: 'Schengen ' + LANG.to + ' Lux Est'
    },
    'Schengen vers Fr. Belgique': {
        code: 'A13_belgique',
        vid: 14,
        cat: 'BELGIQUE',
        from: 'schengen',
        to: 'belgique',
        text: 'Schengen ' + LANG.to + ' Belgique'
    },
    'Wasserbillig vers Kirchberg': {
        code: 'A1_lux_est',
        vid: 15,
        cat: 'LUX-EST',
        from: 'treves',
        to: 'luxest',
        text: 'Wasserbillig ' + LANG.to + ' Lux Est'
    },
    'Wasserbillig vers Gasperich': {
        code: 'A1_lux_sud',
        vid: 16,
        cat: 'LUX-SUD',
        from: 'treves',
        to: 'gasperich',
        text: 'Wasserbillig ' + LANG.to + ' Gasperich'
    },
    'Wasserbillig vers Fr. France': {
        code: 'A1_france',
        vid: 17,
        cat: 'FRANCE',
        from: 'treves',
        to: 'france',
        text: 'Wasserbillig ' + LANG.to + ' France'
    },
    'Senningerberg vers Gasperich': {
        code: 'A1_lux_sud',
        vid: 18,
        cat: 'LUX-SUD',
        from: 'luxest',
        to: 'gasperich',
        text: 'Senningerberg ' + LANG.to + ' Gasperich'
    },
    'Senningerberg vers Fr. France': {
        code: 'A1_france',
        vid: 19,
        cat: 'FRANCE',
        from: 'luxest',
        to: 'france',
        text: 'Senningerberg ' + LANG.to + ' France'
    },
    'Senningerberg vers Fr. Belgique': {
        code: 'A1_belgique',
        vid: 20,
        cat: 'BELGIQUE',
        from: 'luxest',
        to: 'belgique',
        text: 'Senningerberg ' + LANG.to + ' Belgique'
    },
    'Gasperich vers Fr. France': {
        code: 'A3_france',
        vid: 6,
        cat: 'FRANCE',
        //from: 'hollerich',
        from: 'gasperich',
        to: 'france',
        text: 'Gasperich ' + LANG.to + ' France'
    },
    'Bridel vers Fr. Belgique': {
        code: 'A6_belgique',
        vid: 5,
        cat: 'BELGIQUE',
        from: 'bridel',
        to: 'belgique',
        text: 'Bridel ' + LANG.to + ' Belgique'
    }
};
var reTime = /&(\d+)([^=]+)=([\w-]+)\s+(.*)/g;
//Service
//var urlService = 'http://www2.pch.etat.lu/info_trafic/niveau_service/niveau_service_convert.jsp';
var urlService = 'http://www2.pch.etat.lu/citaRS/seam/resource/rest/cita/niveauService/actuel';
var services = {
    "2001_2002": {
        "from": "Croix de Gasperich",
        "to": "Echangeur Itzig"
    },
    "2002_2001": {
        "from": "Echangeur Itzig",
        "to": "Croix de Gasperich"
    },
    "2002_2003": {
        "from": "Echangeur Itzig",
        "to": "Echangeur Hamm"
    },
    "2003_2002": {
        "from": "Echangeur Hamm",
        "to": "Echangeur Itzig"
    },
    "2003_2004": {
        "from": "Echangeur Hamm",
        "to": "Echangeur Kirchberg"
    },
    "2004_2003": {
        "from": "Echangeur Kirchberg",
        "to": "Echangeur Hamm"
    },
    "2004_2005": {
        "from": "Echangeur Kirchberg",
        "to": "Jonction Grunewald"
    },
    "2005_2004": {
        "from": "Jonction Grunewald",
        "to": "Echangeur Kirchberg"
    },
    "2005_2006": {
        "from": "Jonction Grunewald",
        "to": "Echangeur Senningerberg"
    },
    "2006_2005": {
        "from": "Echangeur Senningerberg",
        "to": "Jonction Grunewald"
    },
    "2006_2007": {
        "from": "Echangeur Senningerberg",
        "to": "Echangeur Cargo-Center"
    },
    "2007_2006": {
        "from": "Echangeur Cargo-Center",
        "to": "Echangeur Senningerberg"
    },
    "2007_2008": {
        "from": "Echangeur Cargo-Center",
        "to": "Echangeur Munsbach"
    },
    "2008_2007": {
        "from": "Echangeur Munsbach",
        "to": "Echangeur Cargo-Center"
    },
    "2008_2009": {
        "from": "Echangeur Munsbach",
        "to": "Echangeur Flaxweiler"
    },
    "2009_2008": {
        "from": "Echangeur Flaxweiler",
        "to": "Echangeur Munsbach"
    },
    "2009_2010": {
        "from": "Echangeur Flaxweiler",
        "to": "Echangeur Potaschberg"
    },
    "2010_2009": {
        "from": "Echangeur Potaschberg",
        "to": "Echangeur Flaxweiler"
    },
    "2010_2011": {
        "from": "Echangeur Potaschberg",
        "to": "Echangeur Mertert"
    },
    "2011_2010": {
        "from": "Echangeur Mertert",
        "to": "Echangeur Potaschberg"
    },
    "2011_2012": {
        "from": "Echangeur Mertert",
        "to": "Echangeur Wasserbillig"
    },
    "2012_2011": {
        "from": "Echangeur Wasserbillig",
        "to": "Echangeur Mertert"
    },
    "2012_2013": {
        "from": "Echangeur Wasserbillig",
        "to": "Aire de Wasserbillig"
    },
    "2013_2012": {
        "from": "Aire de Wasserbillig",
        "to": "Echangeur Wasserbillig"
    },
    "2013_2014": {
        "from": "Aire de Wasserbillig",
        "to": "Frontiere Allemagne"
    },
    "2014_2013": {
        "from": "Frontiere Allemagne",
        "to": "Aire de Wasserbillig"
    },
    "2101_2102": {
        "from": "Rond-Point Gasperich-Howald",
        "to": "Echangeur Hesperange"
    },
    "2102_2101": {
        "from": "Echangeur Hesperange",
        "to": "Rond-Point Gasperich-Howald"
    },
    "2102_2104": {
        "from": "Echangeur Hesperange",
        "to": "Croix de Gasperich"
    },
    "2104_2102": {
        "from": "Croix de Gasperich",
        "to": "Echangeur Hesperange"
    },
    "2104_2105": {
        "from": "Croix de Gasperich",
        "to": "Aire de Berchem"
    },
    "2105_2104": {
        "from": "Aire de Berchem",
        "to": "Croix de Gasperich"
    },
    "2105_2106": {
        "from": "Aire de Berchem",
        "to": "Echangeur Livange"
    },
    "2106_2105": {
        "from": "Echangeur Livange",
        "to": "Aire de Berchem"
    },
    "2106_2107": {
        "from": "Echangeur Livange",
        "to": "Croix de Bettembourg"
    },
    "2107_2106": {
        "from": "Croix de Bettembourg",
        "to": "Echangeur Livange"
    },
    "2107_2108": {
        "from": "Croix de Bettembourg",
        "to": "Echangeur Dudelange"
    },
    "2108_2107": {
        "from": "Echangeur Dudelange",
        "to": "Croix de Bettembourg"
    },
    "2108_2109": {
        "from": "Echangeur Dudelange",
        "to": "Douane Dudelange"
    },
    "2109_2108": {
        "from": "Douane Dudelange",
        "to": "Echangeur Dudelange"
    },
    "2109_2110": {
        "from": "Douane Dudelange",
        "to": "Frontière France"
    },
    "2110_2109": {
        "from": "Frontière France",
        "to": "Douane Dudelange"
    },
    "2201_2202": {
        "from": "Croisement Merl",
        "to": "Croix de Cessange"
    },
    "2202_2201": {
        "from": "Croix de Cessange",
        "to": "Croisement Merl"
    },
    "2202_2203": {
        "from": "Croix de Cessange",
        "to": "Echangeur Leudelange-Nord"
    },
    "2203_2202": {
        "from": "Echangeur Leudelange-Nord",
        "to": "Croix de Cessange"
    },
    "2203_2204": {
        "from": "Echangeur Leudelange-Nord",
        "to": "Echangeur Leudelange-Sud"
    },
    "2204_2203": {
        "from": "Echangeur Leudelange-Sud",
        "to": "Echangeur Leudelange-Nord"
    },
    "2204_2205": {
        "from": "Echangeur Leudelange-Sud",
        "to": "Aire de Pontpierre"
    },
    "2205_2204": {
        "from": "Aire de Pontpierre",
        "to": "Echangeur Leudelange-Sud"
    },
    "2205_2206": {
        "from": "Aire de Pontpierre",
        "to": "Echangeur Pontpierre"
    },
    "2206_2205": {
        "from": "Echangeur Pontpierre",
        "to": "Aire de Pontpierre"
    },
    "2206_2207": {
        "from": "Echangeur Pontpierre",
        "to": "Echangeur Foetz"
    },
    "2207_2206": {
        "from": "Echangeur Foetz",
        "to": "Echangeur Pontpierre"
    },
    "2207_2208": {
        "from": "Echangeur Foetz",
        "to": "Jonction Esch"
    },
    "2208_2207": {
        "from": "Jonction Esch",
        "to": "Echangeur Foetz"
    },
    "2208_2209": {
        "from": "Jonction Esch",
        "to": "Echangeur Lallange"
    },
    "2209_2208": {
        "from": "Echangeur Lallange",
        "to": "Jonction Esch"
    },
    "2209_2210": {
        "from": "Echangeur Lallange",
        "to": "Jonction Lankelz"
    },
    "2210_2209": {
        "from": "Jonction Lankelz",
        "to": "Echangeur Lallange"
    },
    "2210_2211": {
        "from": "Jonction Lankelz",
        "to": "Rond-Point Raemerich"
    },
    "2211_2210": {
        "from": "Rond-Point Raemerich",
        "to": "Jonction Lankelz"
    },
    "2301_2302": {
        "from": "Croix de Gasperich",
        "to": "Croix de Cessange"
    },
    "2302_2301": {
        "from": "Croix de Cessange",
        "to": "Croix de Gasperich"
    },
    "2302_2303": {
        "from": "Croix de Cessange",
        "to": "Echangeur Helfenterbruck"
    },
    "2303_2302": {
        "from": "Echangeur Helfenterbruck",
        "to": "Croix de Cessange"
    },
    "2303_2304": {
        "from": "Echangeur Helfenterbruck",
        "to": "Echangeur Strassen"
    },
    "2304_2303": {
        "from": "Echangeur Strassen",
        "to": "Echangeur Helfenterbruck"
    },
    "2304_2305": {
        "from": "Echangeur Strassen",
        "to": "Echangeur Bridel"
    },
    "2305_2304": {
        "from": "Echangeur Bridel",
        "to": "Echangeur Strassen"
    },
    "2305_2306": {
        "from": "Echangeur Bridel",
        "to": "Echangeur Mamer"
    },
    "2306_2305": {
        "from": "Echangeur Mamer",
        "to": "Echangeur Bridel"
    },
    "2306_2307": {
        "from": "Echangeur Mamer",
        "to": "Aire de Capellen"
    },
    "2307_2306": {
        "from": "Aire de Capellen",
        "to": "Echangeur Mamer"
    },
    "2307_2308": {
        "from": "Aire de Capellen",
        "to": "Echangeur Steinfort"
    },
    "2308_2307": {
        "from": "Echangeur Steinfort",
        "to": "Aire de Capellen"
    },
    "2308_2309": {
        "from": "Echangeur Steinfort",
        "to": "Frontiere Belgique"
    },
    "2309_2308": {
        "from": "Frontiere Belgique",
        "to": "Echangeur Steinfort"
    },
    "2401_2402": {
        "from": "Jonction Grunewald",
        "to": "Waldhof"
    },
    "2402_2401": {
        "from": "Waldhof",
        "to": "Jonction Grunewald"
    },
    "2402_2403": {
        "from": "Waldhof",
        "to": "Lorentzweiler"
    },
    "2403_2402": {
        "from": "Lorentzweiler",
        "to": "Waldhof"
    },
    "2403_2404": {
        "from": "Lorentzweiler",
        "to": "Schoenfels"
    },
    "2404_2403": {
        "from": "Schoenfels",
        "to": "Lorentzweiler"
    },
    "2404_2405": {
        "from": "Schoenfels",
        "to": "Mersch"
    },
    "2405_2404": {
        "from": "Mersch",
        "to": "Schoenfels"
    },
    "2405_2406": {
        "from": "Mersch",
        "to": "Merscherbierg"
    },
    "2406_2405": {
        "from": "Merscherbierg",
        "to": "Mersch"
    },
    "2406_2407": {
        "from": "Merscherbierg",
        "to": "Comar-Berg"
    },
    "2407_2406": {
        "from": "Comar-Berg",
        "to": "Merscherbierg"
    },
    "2407_2408": {
        "from": "Comar-Berg",
        "to": "Schieren"
    },
    "2408_2407": {
        "from": "Schieren",
        "to": "Comar-Berg"
    },
    "2501_2502": {
        "from": "Biff",
        "to": "Echangeur Bascharage"
    },
    "2502_2501": {
        "from": "Echangeur Bascharage",
        "to": "Biff"
    },
    "2502_2503": {
        "from": "Echangeur Bascharage",
        "to": "Echangeur Sanem"
    },
    "2503_2502": {
        "from": "Echangeur Sanem",
        "to": "Echangeur Bascharage"
    },
    "2503_2504": {
        "from": "Echangeur Sanem",
        "to": "Echangeur Differdange"
    },
    "2504_2503": {
        "from": "Echangeur Differdange",
        "to": "Echangeur Sanem"
    },
    "2504_2505": {
        "from": "Echangeur Differdange",
        "to": "Echangeur Ehlerange"
    },
    "2505_2504": {
        "from": "Echangeur Ehlerange",
        "to": "Echangeur Differdange"
    },
    "2505_2506": {
        "from": "Echangeur Ehlerange",
        "to": "Jonction Lankelz"
    },
    "2506_2505": {
        "from": "Jonction Lankelz",
        "to": "Echangeur Ehlerange"
    },
    "2511_2512": {
        "from": "Jonction Esch",
        "to": "Echangeur Schifflange"
    },
    "2512_2511": {
        "from": "Echangeur Schifflange",
        "to": "Jonction Esch"
    },
    "2512_2513": {
        "from": "Echangeur Schifflange",
        "to": "Echangeur Kayl"
    },
    "2513_2512": {
        "from": "Echangeur Kayl",
        "to": "Echangeur Schifflange"
    },
    "2513_2514": {
        "from": "Echangeur Kayl",
        "to": "Echangeur Burange"
    },
    "2514_2513": {
        "from": "Echangeur Burange",
        "to": "Echangeur Kayl"
    },
    "2514_2515": {
        "from": "Echangeur Burange",
        "to": "Croix de Bettembourg"
    },
    "2515_2514": {
        "from": "Croix de Bettembourg",
        "to": "Echangeur Burange"
    },
    "2515_2516": {
        "from": "Croix de Bettembourg",
        "to": "Echangeur Hellange"
    },
    "2516_2515": {
        "from": "Echangeur Hellange",
        "to": "Croix de Bettembourg"
    },
    "2516_2517": {
        "from": "Echangeur Hellange",
        "to": "Echangeur Frisange"
    },
    "2517_2516": {
        "from": "Echangeur Frisange",
        "to": "Echangeur Hellange"
    },
    "2517_2518": {
        "from": "Echangeur Frisange",
        "to": "Echangeur Altwies"
    },
    "2518_2517": {
        "from": "Echangeur Altwies",
        "to": "Echangeur Frisange"
    },
    "2518_2519": {
        "from": "Echangeur Altwies",
        "to": "Echangeur Mondorf"
    },
    "2519_2518": {
        "from": "Echangeur Mondorf",
        "to": "Echangeur Altwies"
    },
    "2519_2520": {
        "from": "Echangeur Mondorf",
        "to": "Aire de Burmerange"
    },
    "2520_2519": {
        "from": "Aire de Burmerange",
        "to": "Echangeur Mondorf"
    },
    "2520_2521": {
        "from": "Aire de Burmerange",
        "to": "Echangeur Schengen"
    },
    "2521_2520": {
        "from": "Echangeur Schengen",
        "to": "Aire de Burmerange"
    },
    "2521_2522": {
        "from": "Echangeur Schengen",
        "to": "Frontière Allemagne"
    },
    "2522_2521": {
        "from": "Frontière Allemagne",
        "to": "Echangeur Schengen"
    }
};
//Alertes
var urlAlert = 'http://www.cita.lu/rss_feeds/rtl/index.xml';
var tplAlert = '<div class="news"><div class="desc">${description}</div><div class="date">${date}</div></div>';
//Cams
//CITA
//var urlCam = 'http://www2.pch.etat.lu/info_trafic/cameras/images/cccam_{0}.jpg?cachekill=5058852'
var urlCam = 'http://www2.pch.etat.lu/info_trafic/cameras/images/cccam_{0}.jpg?cachekill={1}';
var urlFlashInfo = 'http://www.lesfrontaliers.lu/index.php';
var reFlashInfoLF = {
    main: /<div\s+id="info_flash">[^<]*<div[^>]*>(.*?<\/div>)/,
    title: /<b>(.*?)<\/b>/,
    content: /<div[^>]*>(.*?)<\/div>/
};
var urlMap = 'http://webfiles.luxweb.com/images/auto/traficCams/map{0}.jpg';
var urlStream = 'http://auto.rtl.lu/trafic/stream/';
var dcams = {
    'A1': {
        start: 'Luxembourg',
        end: 'Trèves',
        camsin: {
            46: {
                text: 'Croix de Gasperich - Tunnel Howald',
                dummy: 1
            },
            70: {
                text: 'Croix de Gasperich - Tunnel Howald',
                dummy: 1
            },
            81: {
                text: 'Tunnel Howald - Sandweiler',
                dummy: 1
            },
            84: {
                text: 'Tunnel Howald - Sandweiler',
                dummy: 1
            },
            86: {
                text: 'Sandweiler - Tunnel Cents',
                dummy: 1
            },
            100: {
                text: 'Jonction Grünewald - Senningerberg',
                dummy: 1
            },
            101: {
                text: 'Senningerberg - Cargo Center',
                dummy: 1
            },
            103: {
                text: 'Cargo Center - Münsbach',
                dummy: 1
            },
            110: {
                text: 'Münsbach - Flaxweiler',
                dummy: 1
            },
            112: {
                text: 'Potaschbierg - Mertert',
                dummy: 1
            },
            119: {
                text: 'Mertert - Aire de Wasserbillig',
                dummy: 1
            }
        },
        camsout: {
            77: {
                text: 'Sandweiler - Tunnel Howald',
                dummy: 1
            },
            91: {
                text: 'Kirchberg - Tunnel Cents',
                dummy: 1
            },
            95: {
                text: 'Jonction Grünewald - Kirchberg',
                dummy: 1
            },
            98: {
                text: 'Senningerberg - Jonction Grünewald',
                dummy: 1
            },
            109: {
                text: 'Münsbach - Cargo Center',
                dummy: 1
            },
            111: {
                text: 'Flaxweiler - Münsbach',
                dummy: 1
            },
            114: {
                text: 'Mertert - Potaschbierg',
                dummy: 1
            }
        }
    },
    'A3': {
        start: 'Luxembourg',
        end: 'France',
        camsin: {
            41: {
                text: 'Croix de Gasperich - Aire de Berchem',
                dummy: 1
            },
            55: {
                text: 'Croix de Gasperich - Aire de Berchem',
                dummy: 1
            },
            53: {
                text: 'Aire de Berchem - Bettembourg',
                x: 49.5364890954628,
                y: 6.11391305923462
            },
            59: {
                text: 'Bettembourg - Croix de Bettembourg',
                dummy: 1
            }
        },
        camsout: {
            47: {
                text: 'Croix de Gasperich - Luxembourg',
                dummy: 1
            },
            51: {
                text: 'Aire de Berchem - Croix de Gasperich',
                dummy: 1
            },
            63: {
                text: 'Croix de Bettembourg - France',
                dummy: 1
            },
            66: {
                text: 'France - Croix de Bettembourg',
                dummy: 1
            }
        }
    },
    'A4': {
        start: 'Luxembourg',
        end: 'Esch',
        camsin: {
            31: {
                text: 'Luxembourg - Croix de Cessange',
                dummy: 1
            },
            122: {
                text: 'Croix de Cessange - Leudelange',
                dummy: 1
            },
            137: {
                text: 'Jonction de Foetz - Esch',
                dummy: 1
            },
            139: {
                text: 'Esch - Jonction Lankelz',
                dummy: 1
            }
        },
        camsout: {
            36: {
                text: 'Croix de Cessange - Luxembourg',
                dummy: 1
            },
            120: {
                text: 'Leudelange - Croix de Cessange',
                dummy: 1
            },
            125: {
                text: 'Pontpierre - Leudelange',
                dummy: 1
            },
            133: {
                text: 'Jonction de Foetz - Pontpierre',
                dummy: 1
            },
            140: {
                text: 'Jonction Lankelz - Esch',
                dummy: 1
            }
        }
    },
    'A6': {
        start: 'Luxembourg',
        end: 'Belgique',
        camsin: {
            3: {
                text: 'Steinfort - Belgique',
                dummy: 1
            },
            27: {
                text: 'Croix de Cessange - Bertrange',
                dummy: 1
            }
        },
        camsout: {
            6: {
                text: 'Steinfort - Mamer',
                dummy: 1
            },
            11: {
                text: 'Steinfort - Mamer',
                dummy: 1
            },
            15: {
                text: 'Mamer - Bridel',
                dummy: 1
            },
            17: {
                text: 'Mamer - Bridel',
                dummy: 1
            },
            21: {
                text: 'Bridel - Strassen',
                dummy: 1
            },
            30: {
                text: 'Bertrange - Croix de Cessange',
                dummy: 1
            },
            37: {
                text: 'Croix de Cessange - Croix de Gasperich',
                dummy: 1
            },
            42: {
                text: 'Croix de Cessange - Croix de Gasperich',
                dummy: 1
            }
        }
    },
    'A13': {
        start: 'Longwy',
        end: 'Sarrebruck',
        camsin: {
            145: {
                text: 'Differdange - Tunnel Aessen',
                dummy: 1
            },
            147: {
                text: 'Differdange - Tunnel Aessen',
                dummy: 1
            },
            151: {
                text: 'Tunnel Aessen - Tunnel Ehlerange',
                dummy: 1
            },
            162: {
                text: 'Kayl - Dudelange',
                dummy: 1
            },
            164: {
                text: 'Dudelange - Croix de Bettembourg',
                dummy: 1
            },
            204: {
                text: 'Hellange - Frisange',
                dummy: 1
            },
            217: {
                text: 'Altwies - Mondorf',
                dummy: 1
            },
            230: {
                text: 'Altwies - Mondorf',
                dummy: 1
            },
            236: {
                text: 'Mondorf - Tunnel Markusbierg',
                dummy: 1
            },
            268: {
                text: 'Schengen - Allemagne',
                dummy: 1
            }
        },
        camsout: {
            142: {
                text: 'Jonction Lankelz - Tunnel Ehlerange',
                dummy: 1
            },
            143: {
                text: 'Sanem - Pétange',
                dummy: 1
            },
            154: {
                text: 'Jonction Lankelz - Tunnel Ehlerange',
                dummy: 1
            },
            161: {
                text: 'Kayl - Schifflange',
                dummy: 1
            },
            167: {
                text: 'Croix de Bettembourg - Dudelange',
                dummy: 1
            },
            200: {
                text: 'Hellange - Croix de Bettembourg',
                dummy: 1
            },
            215: {
                text: 'Altwies - Frisange',
                dummy: 1
            },
            218: {
                text: 'Mondorf - Altwies',
                dummy: 1
            },
            231: {
                text: 'Mondorf - Altwies',
                dummy: 1
            },
            235: {
                text: 'Tunnel Markusbierg - Mondorf',
                dummy: 1
            },
            237: {
                text: 'Tunnel Markusbierg - Mondorf',
                dummy: 1
            },
            269: {
                text: 'Schengen - Tunnel Markusbierg',
                dummy: 1
            }
        }
    },
    'A7': {
        start: 'Luxembourg',
        end: 'Nord',
        camsin: {
            403: {
                text: 'Tunnel Gousselerbierg',
                dummy: 1
            },
            445: {
                text: 'Tunnel Mersch',
                dummy: 1
            },
            458: {
                text: 'Mierscherbierg',
                dummy: 1
            },
            471: {
                text: 'Colmar Berg',
                dummy: 1
            }
        },
        camsout: {
            466: {
                text: 'Colmar Berg',
                dummy: 1
            },
            455: {
                text: 'Tunnel Mersch',
                dummy: 1
            },
            444: {
                text: 'Tunnel Gousselerbierg',
                dummy: 1
            },
            402: {
                text: 'Lorentzweiler',
                dummy: 1
            },
            400: {
                text: 'Tunnel Grouft - Lorentzweiler',
                dummy: 1
            }
        }
    }
};
