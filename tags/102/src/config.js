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
    if (chrome.extension) {
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
var urlTime = 'http://www2.pch.etat.lu/info_trafic/temps_parcours/temps_parcours_convert.jsp';
var timesCoords = {
    treves: {
        i: 1,
        name: "Wasserbillig(Trèves)",
        lat: 49.723510000000005,
        lng: 6.48922
    },
    luxest: {
        i: 2,
        name: "Senningerberg(Lux Est)",
        lat: 49.64278,
        lng: 6.21759
    },
    hollerich: {
        i: 3,
        name: "Hollerich",
        lat: 49.585710000000006,
        lng: 6.132890000000001
    },
    gasperich: {
        i: 3.1,
        name: "Gasperich",
        lat: 49.59,
        lng: 6.133
    },
    bridel: {
        i: 4,
        name: "Bridel",
        lat: 49.627500000000005,
        lng: 6.075740000000001
    },
    belgique: {
        i: 5,
        name: "Belgique",
        lat: 49.638090000000005,
        lng: 5.909000000000001
    },
    esch: {
        i: 6,
        name: "Esch",
        lat: 49.519380000000005,
        lng: 6.000190000000001
    },
    france: {
        i: 7,
        name: "France",
        lat: 49.47281,
        lng: 6.12119
    },
    schengen: {
        i: 8,
        name: "Schengen(Allemagne)",
        lat: 49.4791,
        lng: 6.3656500000000005
    }
};
var timeMappings = {
    2: {
        code: 'A6_france',
        cat: 'FRANCE',
        from: 'belgique',
        to: 'france',
        text: 'Belgique ' + LANG.to + ' France'
    },
    17: {
        code: 'A1_france',
        cat: 'FRANCE',
        from: 'treves',
        to: 'france',
        text: 'Wasserbillig ' + LANG.to + ' France'
    },
    19: {
        code: 'A1_france',
        cat: 'FRANCE',
        from: 'luxest',
        to: 'france',
        text: 'Senningerberg ' + LANG.to + ' France'
    },
    6: {
        code: 'A3_france',
        cat: 'FRANCE',
        from: 'hollerich',
        to: 'france',
        text: 'Gasperich ' + LANG.to + ' France'
    },
    4: {
        code: 'A3_belgique',
        cat: 'BELGIQUE',
        from: 'france',
        to: 'belgique',
        text: 'France ' + LANG.to + ' Belgique'
    },
    14: {
        code: 'A13_belgique',
        cat: 'BELGIQUE',
        from: 'schengen',
        to: 'belgique',
        text: 'Schengen ' + LANG.to + ' Belgique'
    },
    20: {
        code: 'A1_belgique',
        cat: 'BELGIQUE',
        from: 'luxest',
        to: 'belgique',
        text: 'Senningerberg ' + LANG.to + ' Belgique'
    },
    5: {
        code: 'A6_belgique',
        cat: 'BELGIQUE',
        from: 'bridel',
        to: 'belgique',
        text: 'Bridel ' + LANG.to + ' Belgique'
    },
    1: {
        code: 'A6_lux_sud',
        cat: 'LUX-SUD',
        from: 'belgique',
        to: 'gasperich',
        text: 'Belgique ' + LANG.to + ' Gasperich'
    },
    9: {
        code: 'A4_lux_sud',
        cat: 'LUX-SUD',
        from: 'esch',
        to: 'gasperich',
        text: 'Esch ' + LANG.to + ' Gasperich'
    },
    3: {
        code: 'A3_lux_sud',
        cat: 'LUX-SUD',
        from: 'esch',
        to: 'hollerich',
        text: 'Esch ' + LANG.to + ' Lux Hollerich'
    },
    12: {
        code: 'A13_lux_sud',
        cat: 'LUX-SUD',
        from: 'schengen',
        to: 'gasperich',
        text: 'Schengen ' + LANG.to + ' Gasperich'
    },
    16: {
        code: 'A1_lux_sud',
        cat: 'LUX-SUD',
        from: 'treves',
        to: 'gasperich',
        text: 'Wasserbillig ' + LANG.to + ' Gasperich'
    },
    18: {
        code: 'A1_lux_sud',
        cat: 'LUX-SUD',
        from: 'luxest',
        to: 'gasperich',
        text: 'Senningerberg ' + LANG.to + ' Gasperich'
    },
    7: {
        code: 'A6_lux_est',
        cat: 'LUX-EST',
        from: 'belgique',
        to: 'luxest',
        text: 'Belgique ' + LANG.to + ' Lux Est'
    },
    10: {
        code: 'A4_lux_est',
        cat: 'LUX-EST',
        from: 'esch',
        to: 'luxest',
        text: 'Esch ' + LANG.to + ' Lux Est'
    },
    11: {
        code: 'A3_lux_est',
        cat: 'LUX-EST',
        from: 'france',
        to: 'luxest',
        text: 'France ' + LANG.to + ' Lux Est'
    },
    13: {
        code: 'A13_lux_est',
        cat: 'LUX-EST',
        from: 'schengen',
        to: 'luxest',
        text: 'Schengen ' + LANG.to + ' Lux Est'
    },
    15: {
        code: 'A1_lux_est',
        cat: 'LUX-EST',
        from: 'treves',
        to: 'luxest',
        text: 'Wasserbillig ' + LANG.to + ' Lux Est'
    },
    8: {
        code: 'A4_lux_hol',
        cat: 'LUX-HOL',
        from: 'france',
        to: 'gasperich',
        text: 'France ' + LANG.to + ' Gasperich'
    }
};
var reTime = /&(\d+)([^=]+)=([\w-]+)\s+(.*)/g;
//Service
//var urlService = 'http://www2.pch.etat.lu/info_trafic/niveau_service/niveau_service_convert.jsp';
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
