// ==UserScript==
// @name		Resource statistics
// @namespace	OGame
// @version		2.0
// @description	OGame 資源統計
// @author		segat800@gmail.com, yutong.milu@gmail.com
// @include		https://s*-tw.ogame.gameforge.com/game/index.php?page=resourceSettings*
// @include		https://s*-tw.ogame.gameforge.com/game/index.php?page=fleet1*
// @include		https://s*-tw.ogame.gameforge.com/game/index.php?page=resources*
// @include		https://s*-tw.ogame.gameforge.com/game/index.php?page=station*
// @include		https://s*-tw.ogame.gameforge.com/game/index.php?page=research*
// @include		https://s*-tw.ogame.gameforge.com/game/index.php?page=shipyard*
// @include		https://s*-tw.ogame.gameforge.com/game/index.php?page=defense*
// @include		https://s*-tw.ogame.gameforge.com/game/index.php?page=traderOverview*
// @grant		none
// ==/UserScript==

(function () {

    var SCRIPT_VERSION = "2.0";

    var unsafe = (typeof unsafeWindow) != "undefined" ? unsafeWindow : window;

    const openImg  = "data:image/gif;base64," +
          "R0lGODlhEgAQALMAACQuNxsiKRsiKBgcIxccHxYbH2B3ghccICMtNmN5hSUvOBYbHhggJAAAAAAAA" +
          "AAAACH5BAAAAAAALAAAAAASABAAAARFMKhJq1WS6c07m164gWJIlt2JjgqXvPBrsF0McwpyLDxv94" +
          "sDQgf0vYpCYnGRWCZ3y+gzKh1CqUACAlDAFgcAAeBCVoQjADs=";

    const closeImg = "data:image/gif;base64," +
          "R0lGODlhEgAQALMAACQuNxsiKRsiKBgcIxccHxYbH2B3ghccICMtNmN5hSUvOBYbHhggJAAAAAAAA" +
          "AAAACH5BAAAAAAALAAAAAASABAAAARFUABFq7VAjsW79wWAEF/ZHQhymCaqsqW7fkmbzl2ix7en/x" +
          "+UgkFk/I5FIqVoOCKLy6R0Gp1aGdWrNKuFDrvbwGV8CUQAADs=";

    var patron_basico;
    var patron_completo;

    // 電漿技術
    var nivel_plasma = -1;

    function addEvent (el, evt, fxn)
    {
        if (el.addEventListener)
            el.addEventListener (evt, fxn, false);
        else if (el.attachEvent)
            el.attachEvent ("on" + evt, fxn);
        else
            el ['on' + evt] = fxn;
    }

    var LANG_EN = {
        domain: "*"

        ,produccion_imp: "Imperial Production for "
        ,resources_imp: ""
        ,recplaneta: "Daily resources per planet"
        ,xingyueresources: "Planet And Moon Resources"
        ,almacen_tiempo: "Storage and filling time"

        ,metal: "Metal"
        ,cristal: "Crystal"
        ,deuterio: "Deuterium"
        ,total: "Total (M+C+D)"
        ,en_metal: "In metal (3x2x1 ratio)"
        ,diaria: "Daily"
        ,semanal: "Weekly"
        ,mensual: "Monthly"
        ,planetas: "Planets"
        ,moons: "Moons"
        ,produccion: "Production"
        ,excedentes: "Excess per day"
        ,dia: "Day"
        ,semana: "Week"
        ,hora: "Hourly"
        ,produccion_flota: "Estimated fleet production"
        ,produccion_def: "Estimated defense production"
        ,producc_diaria: "Daily Production"
        ,bbcode: "BBCode"
        ,almacenes: "Storage"
        ,flota: "Fleet"
        ,defensa: "Defense"
        ,produccion_basica: "Basic production"
        ,produccion_completa: "Complete production"
        ,geologo: "Geologist"
        ,translate_by: ""

        ,p_carga: "Small Cargo"
        ,g_carga: "Large Cargo"
        ,c_ligero: "Light Fighter"
        ,c_pesado: "Heavy Fighter"
        ,crucero: "Cruiser"
        ,nbatalla: "Battleship"
        ,colonizador: "Colony Ship"
        ,reciclador: "Recycler"
        ,sonda: "Espionage Probe"
        ,bombardero: "Bomber"
        ,destructor: "Destroyer"
        ,edlm: "Deathstar"
        ,acorazado: "Battlecruiser"
        ,satelite: "Solar Satellite"

        ,lanzamisiles: "Rocket Launcher"
        ,laser_peq: "Light Laser"
        ,laser_gra: "Heavy Laser"
        ,c_gaus: "Gauss Cannon"
        ,c_ionico: "Ion Cannon"
        ,c_plasma: "Plasma Turret"
        ,m_anti: "Anti-Ballistic M."
        ,m_plan: "Interp. M."

        ,h_hora: "h"
        ,d_dia: "d"
        ,s_semana: "w"
    };

    var LANG_TW = {
        domain: "s*-tw.ogame.gameforge.com"

        ,produccion_imp: "帝國生產量"
        ,resources_imp: "帝國資源量"
        ,recplaneta: "行星產量"
        ,xingyueresources: "星月現有資源量"
        ,almacen_tiempo: "距離儲存槽滿的時間"

        ,metal: "金屬"
        ,cristal: "晶體"
        ,deuterio: "重氫"
        ,total: "加總 (金+晶+氫)"
        ,en_metal: "對金屬 (比例：3x2x1)"
        ,diaria: "每日"
        ,semanal: "每週"
        ,mensual: "每月"
        ,planetas: "行星"
        ,moons: "月球"
        ,produccion: "生產"
        ,excedentes: "儲存槽"
        ,dia: "日"
        ,semana: "週"
        ,hora: "時"
        ,produccion_flota: "預估生產艦隊"
        ,produccion_def: "預估生產防禦"
        ,producc_diaria: "日產"
        ,translate_by: ""
        ,bbcode: "BBCode"
        ,almacenes: "儲存槽"
        ,flota: "艦隊"
        ,defensa: "防禦"
        ,produccion_basica: "基本產量"
        ,produccion_completa: "整體產量"
        ,geologo: "地質學家"

        ,p_carga: "小型運輸艦"
        ,g_carga: "大型運輸艦"
        ,c_ligero: "輕型戰鬥機"
        ,c_pesado: "重型戰鬥機"
        ,crucero: "巡洋艦"
        ,nbatalla: "戰列艦"
        ,colonizador: "殖民船"
        ,reciclador: "回收船"
        ,sonda: "間諜衛星"
        ,bombardero: "導彈艦"
        ,destructor: "驅逐艦"
        ,edlm: "死星"
        ,acorazado: "戰鬥巡洋艦"
        ,satelite: "太陽能衛星"

        ,lanzamisiles: "飛彈發射器"
        ,laser_peq: "輕型鐳射炮"
        ,laser_gra: "重型鐳射炮"
        ,c_gaus: "高斯炮"
        ,c_ionico: "離子加農炮"
        ,c_plasma: "等離子炮塔"
        ,m_anti: "反彈道導彈"
        ,m_plan: "星際導彈"
        ,h_hora: "時"
        ,d_dia: "日"
        ,s_semana: "週"
    };

    var op = function () {
        this.set = function(key, value) {
            return localStorage.setItem ("ogres_" + getServer() + "_" + getPlayerId() + "_" + key, value);
        }

        this.get = function(key){
            var def = 0;
            return localStorage.getItem ("ogres_" + getServer() + "_" + getPlayerId() + "_" + key) || def;
        }
    }

    var options = new op();

    function getServer() {
        var server = location.href;
        server = server.replace("https://", "").replace("www.", "");
        server = server.substring(0, server.indexOf("."));

        return server;
    }

    function getPlayerId() {
        return document.getElementsByName("ogame-player-id")[0].content;
    }

    function getElementsByClass(searchClass,node,tag) {
        var classElements = new Array();
        if (node == null)
            node = document;
        if (tag == null)
            tag = '*';
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;

        for (var i = 0, j = 0; i < elsLen; i++) {
            var sep = els[i].className.split(" ");
            var content = false;

            for(var k = 0; k < sep.length; k++){
                if(sep[k] == searchClass)
                    content = true;
            }

            if (els[i].className == searchClass || content) {
                classElements[j] = els[i];
                j++;
            }
        }
        return classElements;
    }

    function mostrarNumero(num) {
        num = parseInt(num);
        var neg = "";

        if(num<0) {
            neg = "-";
            num *= -1;
        }

        var nNmb = String(parseInt(num));
        var sRes = "";
        for (var j, i = nNmb.length - 1, j = 0; i >= 0; i--, j++)
            sRes = nNmb.charAt(i) + ((j > 0) && (j % 3 == 0)? ",": "") + sRes;

        return neg + sRes;
    }

    function getPosActual () {
        return "[" + document.getElementsByName("ogame-planet-coordinates")[0].content + "]";
    }

    function getNombreJugador () {
        return document.getElementsByName("ogame-player-name")[0].content;
    }

    function geologoActivo() {
        var salida = false;
        var oficiales = document.getElementById("officers").getElementsByTagName("a");
        var geologo = oficiales[3].className;

        if(geologo.indexOf(" on ") != -1) {
            salida = true;
        }
        return salida;
    }

    function equipoComandoActivo() {
        var salida = true;
        var oficiales = document.getElementById("officers").getElementsByTagName("a");

        var i = 0;
        for(i = 0; i < 5; i++) {
            var oficial = oficiales[i].className;
            if(oficial.indexOf(" on ") == -1) {
                salida = false;
            }
        }
        return salida;
    }

    function getFecha()  {
        var fecha=new Date();
        return fecha.getFullYear() + "/" + (fecha.getMonth()+1) + "/" + fecha.getDate() ;
    }

    // 更新目前所屬星月的資源
    function updateResources(p) {
        var parcial = 0;

        // 取得目前星月基本資料
        var planeta_type = document.getElementsByName("ogame-planet-type")[0].content;
        var planeta_cord = getPosActual() + (planeta_type != "moon" ? "" : "m");

        // 取得星球資料
        var planeta;
        if (typeof p == 'undefined') {
            planeta = new ObjPlaneta();
            planeta.load(options.get("objplanet_" + planeta_cord));
        }
        else {
            planeta = p;
        }

        // 擷取現有資源數據
        parcial = document.getElementById("metal_box").innerText.replace(/\./g,"").replace(/,/g,"");
        planeta.metal_resource = parcial;

        parcial = document.getElementById("crystal_box").innerText.replace(/\./g,"").replace(/,/g,"");
        planeta.cristal_resource = parcial;

        parcial = document.getElementById("deuterium_box").innerText.replace(/\./g,"").replace(/,/g,"");
        planeta.deuterio_resource = parcial;

        // 儲存資源資料
        if (typeof p == 'undefined') {
            planeta.actualizado = new Date();
            options.set("objplanet_" + planeta_cord, planeta.save());
        }
    }

    // 建立全星月資源表格
    function getResourcesTable() {
        // 建立資源清單
        var tMetal, tCristal, tDeuterio;
        tMetal = tCristal = tDeuterio = 0;

        var pmList = options.get("objlist").split(";");

        var resTable = '';
        resTable += '<br /><br /><table cellspacing="0" cellpadding="0" align="center" style="margin-top: 0px;" width="98%">';
        resTable += '<tr><td align="center" colspan="4"><font color="#FF4000"><p style="font-size:23px">{RESOURCES_IMPERIAL}</p></font></td></tr>';
        resTable += '<tr height="40"><td>星月名稱</td><td width="22%" align="right">{METAL}</td><td width="22%" align="right">{CRISTAL}</td><td width="22%" align="right">{DEUTERIO}</td></tr>';
        for (var k = 0; k < pmList.length - 1; k++) {
            var planeta = new ObjPlaneta();
            planeta.load(options.get("objplanet_" + pmList[k]));

            if (planeta.type == "moon") continue;

            resTable += '<tr height="16"><td align="left"><font color="#0090ff"><span style="display: inline-block; width: 74px;">' + planeta.coordenadas + '</span>' + planeta.nombre + '</font></td><td align="right" class="undermark">' + mostrarNumero(planeta.getRealM()) + '</td><td align="right" class="undermark">' + mostrarNumero(planeta.getRealC()) + '</td><td align="right" class="undermark">' + mostrarNumero(planeta.getRealD()) + '</td></tr>';
            tMetal += planeta.getRealM();
            tCristal += planeta.getRealC();
            tDeuterio += planeta.getRealD();

            for(var kk = 0; kk < pmList.length - 1; kk++) {
                if (pmList[kk] == planeta.coordenadas + "m") {
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + pmList[kk]));
                    resTable += '<tr height="16"><td align="left"><font color="#eeee66"><span style="display: inline-block; width: 74px;"></span>' + planeta.nombre + '</font></td><td align="right" class="undermark">' + mostrarNumero(planeta.getRealM()) + '</td><td align="right" class="undermark">' + mostrarNumero(planeta.getRealC()) + '</td><td align="right" class="undermark">' + mostrarNumero(planeta.getRealD()) + '</td></tr>';
                    tMetal += planeta.getRealM();
                    tCristal += planeta.getRealC();
                    tDeuterio += planeta.getRealD();
                }
            }
        }
        resTable += '<tr height="40"><td align="left">星月總資源量</td><td align="right">' + mostrarNumero(tMetal) + '</td><td align="right">' + mostrarNumero(tCristal) + '</td><td align="right">' + mostrarNumero(tDeuterio) + '</td></tr>';
        resTable += '</table>';

        // 建立資源清單 div
        var divResource = document.createElement('div');
        divResource.setAttribute("id", "divResource");
        divResource.innerHTML = translate(resTable);

        return divResource;
    }

    // 全星月資源表格顯示設定變更
    function ResourcesShow_Click() {
        var resshowopt = "";
        $("input.resShow:checked").each(function() {
            resshowopt += $(this).val() + ',';
        });

        options.set("resshowopt", resshowopt);
    }

    function generarFilaProduccion(nombre, pM, pC, pD, cM, cC, cD, c) {
        var salida = "";
        var diario = 0;
        var semanal = 0;

        // diario
        if(pD == 0) {
            diario = parseInt(Math.min(pM/cM,pC/cC));
        } else {
            diario = parseInt(Math.min(pM/cM,pC/cC, pD/cD));
        }

        if(isNaN(diario))
            diario = 0;

        var exM = pM - (diario*cM);
        var exC = pC - (diario*cC);
        var exD = pD - (diario*cD);

        // semanal
        pM *= 7;
        pC *= 7;
        pD *= 7;

        if(pD == 0) {
            semanal = parseInt(Math.min(pM/cM,pC/cC));
        } else {
            semanal = parseInt(Math.min(pM/cM,pC/cC, pD/cD));
        }

        if(isNaN(semanal))
            semanal = 0;

        salida += '<tr class="' + c + '" align="right"><td class="label">' + nombre + '</td><td class="undermark"><b>'
        salida += mostrarNumero(diario) + '</b></td><td class="undermark">' + mostrarNumero(semanal) + '</td><td>';
        salida += mostrarNumero(exM) + '</td><td>';
        salida += mostrarNumero(exC) + '</td><td>';
        salida += mostrarNumero(exD) + '</td></tr>'

        return(salida);
    }

    function getColumnas(tabla){
        return tabla.rows[0].cells.length;
    }

    function getFilas(tabla){
        return tabla.rows.length;
    }

    function getContenido(tabla, fila, col)
    {
        var rowElem = tabla.rows[fila];
        var tdValue = rowElem.cells[col];
        return tdValue;
    }

    function A(almacen) {
        var ret = "-";

        if(typeof almacen != 'undefined' && almacen > 0) {

            almacen = parseInt(almacen)/1000;
            ret = mostrarNumero(almacen) + " k";
        }
        return ret
    }

    function getTiempoLlenado(produccion, realResource, almacen) {
        var ret = '-';

        if(typeof almacen != 'undefined' && produccion > 0) {

            almacen = Math.floor(almacen);
            produccion = Math.floor(produccion);
            horas = Math.floor((almacen - realResource) / produccion);
            horas = horas < 0 ? 0 : horas;

            if(horas > 24) {
                dias = horas/24;
                if(dias > 7) {
                    semanas = dias / 7;
                    ret = Math.floor(semanas) + LANG.s_semana + " " + Math.floor(dias % 7) + LANG.d_dia;

                }else {
                    ret = Math.floor(dias) + LANG.d_dia + " " + Math.floor(horas % 24) + LANG.h_hora;
                }
            }
            else {
                ret = Math.floor(horas) + LANG.h_hora;
            }
        }

        return  ret;
    }

    function getNivelMina(tipo, sep, pos) {
        var ret = "";
        var mediana = 0;
        var nivel = 0;

        switch(tipo)
        {
            case 1:
                var lista = new Array(sep.length);

                for(var k = 0; k < sep.length; k++) {
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + sep[k]));
                    lista[k]  = planeta.metal_nivel_mina*10;
                    if(k == pos) {
                        nivel = planeta.metal_nivel_mina*10;
                    }
                }
                lista.sort(sortNumerico);
                var mitad = parseInt(sep.length/2)
                mediana = lista[mitad-1];
                break;
            case 2:
                var lista = new Array(sep.length);

                for(var k = 0; k < sep.length; k++){
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + sep[k]));
                    lista[k]  = planeta.cristal_nivel_mina*10;
                    if(k == pos) {
                        nivel = planeta.cristal_nivel_mina*10;
                    }
                }
                lista.sort(sortNumerico);
                var mitad = parseInt(sep.length/2)
                mediana = lista[mitad-1];
                break;
            case 3:
                var lista = new Array(sep.length);

                for(var k = 0; k < sep.length; k++){
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + sep[k]));
                    lista[k]  = planeta.deuterio_nivel_mina*10;
                    if(k == pos) {
                        nivel = planeta.deuterio_nivel_mina*10;
                    }
                }
                lista.sort(sortNumerico);
                var mitad = parseInt(sep.length/2)
                mediana = lista[mitad-1];
                break;
            default:
                break;
        }

        if(nivel < mediana) {
            ret = ' <font color="#FF0000"><b>[' + nivel/10 + ']</b></font>';
        }
        else {
            if(nivel == mediana) {
                ret = ' <font color="#A9BCF5"><b>[' + nivel/10 + ']</b></font>';
            }
            else {
                ret = ' <font color="#5858FA"><b>[' + nivel/10 + ']</b></font>';
            }
        }

        return ret;
    }

    function getStrNiveles(tipo, sep) {
        var ret = "";
        var lista = new Array(sep.length);

        switch(tipo)
        {
            case 1:
                for(var k = 0; k < sep.length; k++){
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + sep[k]));
                    lista[k] = planeta.metal_nivel_mina*10;
                }
                break;
            case 2:
                for(var k = 0; k < sep.length; k++){
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + sep[k]));
                    lista[k] = planeta.cristal_nivel_mina*10;
                }
                break;
            case 3:
                for(var k = 0; k < sep.length; k++){
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + sep[k]));
                    lista[k] = planeta.deuterio_nivel_mina*10;
                }
                break;
            default:
                break;
        }

        lista.sort(sortNumerico);

        for(var k = 0; k < lista.length-1; k++) {
            ret += lista[k]/10 + " ";
        }

        return ret;
    }

    function sortNumerico(a,b){
        if (a < b) return 1;
        if (a > b) return -1;
        if (a = b) return 0;
    }

    function mostrarDetallesRecursos(id) {
        var asig;

        var img = document.getElementById("img_" + id);
        var fila = document.getElementById(id + "_1");

        if (fila.style.display != "none") {
            asig = "none";
            img.setAttribute ("src", openImg);
        } else {
            asig = "";
            img.setAttribute ("src", closeImg);
        }

        for(var i = 1; (fila = document.getElementById(id + "_" + i)) != null; i++) {
            fila.style.display = asig;
        }
    }

    function mostrarSeccion(id) {
        var div = document.getElementById("sec_" + id);
        var anterior = div.style.display;
        var img;

        for(var i = 1; (div = document.getElementById("sec_" + i)) != null; i++) {
            div.style.display = "none";
            img = document.getElementById("img_sec" + i);
            img.setAttribute("src", openImg);
        }

        for(var i = 1; (fila = document.getElementById("mostrar_sec" + i)) != null; i++) {
            fila.parentNode.style.backgroundColor = "#240B3B";
        }


        div = document.getElementById("sec_" + id);
        img = document.getElementById("img_sec" + id);

        if (anterior != "none") {
            div.style.display = "none";
            img.setAttribute("src", openImg);
            document.getElementById("mostrar_sec" + id).parentNode.style.backgroundColor = "#240B3B";
        } else {
            div.style.display = "";
            img.setAttribute("src", closeImg);
            document.getElementById("mostrar_sec" + id).parentNode.style.backgroundColor = "#4C0B5F";
        }
    }

    // ============================================================

    function translate(text) {
        text = text.replace(/{RECURSOS_PLANETAS}/gi, LANG.recplaneta)
        text = text.replace(/{PRODUCCION_IMPERIAL}/gi, LANG.produccion_imp)
        text = text.replace(/{RESOURCES_IMPERIAL}/gi, LANG.resources_imp)
        text = text.replace(/{XINGYUE_RESOURCES}/gi, LANG.xingyueresources)

        text = text.replace(/{METAL}/gi, LANG.metal)
        text = text.replace(/{CRISTAL}/gi, LANG.cristal)
        text = text.replace(/{DEUTERIO}/gi, LANG.deuterio)
        text = text.replace(/{SEMANA}/gi, LANG.semana)
        text = text.replace(/{HORA}/gi, LANG.hora)
        text = text.replace(/{DIA}/gi, LANG.dia)
        text = text.replace(/{DIARIA}/gi, LANG.diaria)
        text = text.replace(/{SEMANAL}/gi, LANG.semanal)
        text = text.replace(/{MENSUAL}/gi, LANG.mensual)

        text = text.replace(/{EXCEDENTES_DIA}/gi, LANG.excedentes)
        text = text.replace(/{PRODUCCION}/gi, LANG.produccion)
        text = text.replace(/{PRODUCCION_FLOTA}/gi, LANG.produccion_flota)
        text = text.replace(/{PRODUCCION_DEFENSAS}/gi, LANG.produccion_def)
        text = text.replace(/{ALMACEN_TIEMPO}/gi, LANG.almacen_tiempo)
        text = text.replace(/{PLANETAS}/gi, LANG.planetas)
        text = text.replace(/{MOONS}/gi, LANG.moons)
        text = text.replace(/{TOTAL}/gi, LANG.total)
        text = text.replace(/{PRODUCCION_DIARIA_DE}/gi, LANG.producc_diaria)
        text = text.replace(/{TRANSLATE_BY}/gi, LANG.translate_by)
        text = text.replace(/{EN_METAL}/gi, LANG.en_metal)

        text = text.replace(/{BBCODE}/gi, LANG.bbcode)
        text = text.replace(/{ALMACENES}/gi, LANG.almacenes)
        text = text.replace(/{FLOTA}/gi, LANG.flota)
        text = text.replace(/{DEFENSA}/gi, LANG.defensa)
        text = text.replace(/{PRODUCCION_BASICA}/gi, LANG.produccion_basica)
        text = text.replace(/{PRODUCCION_COMPLETA}/gi, LANG.produccion_completa)
        text = text.replace(/{GEOLOGO}/gi, LANG.geologo)

        text = text.replace('{P_CARGA}', LANG.p_carga)
        text = text.replace('{G_CARGA}', LANG.g_carga)
        text = text.replace('{C_LIGERO}', LANG.c_ligero)
        text = text.replace('{C_PESADO}', LANG.c_pesado)
        text = text.replace('{CRUCERO}', LANG.crucero)
        text = text.replace('{NBATALLA}', LANG.nbatalla)
        text = text.replace('{COLONIZADOR}', LANG.colonizador)
        text = text.replace('{RECICLADOR}', LANG.reciclador)
        text = text.replace('{SONDA}', LANG.sonda)
        text = text.replace('{BOMBARDERO}', LANG.bombardero)
        text = text.replace('{DESTRUCTOR}', LANG.destructor)
        text = text.replace('{EDLM}', LANG.edlm)
        text = text.replace('{ACORAZADO}', LANG.acorazado)
        text = text.replace('{SATELITE}', LANG.satelite)

        text = text.replace('{LANZAMISILES}', LANG.lanzamisiles)
        text = text.replace('{LASER_PEQ}', LANG.laser_peq)
        text = text.replace('{LASER_GRA}', LANG.laser_gra)
        text = text.replace('{C_GAUS}', LANG.c_gaus)
        text = text.replace('{C_IONICO}', LANG.c_ionico)
        text = text.replace('{C_PLASMA}', LANG.c_plasma)
        text = text.replace('{M_ANTI}', LANG.m_anti)
        text = text.replace('{M_PLAN}', LANG.m_plan)

        return text;
    }

    function codificar(patron, tipo) {
        var marcas = new Array();

        var colores = [
            [/{COLOR_METAL}/gi, '#9999ff'],
            [/{COLOR_CRISTAL}/gi, '#00ff00'],
            [/{COLOR_DEUTERIO}/gi, '#ff00ff'],
            [/{COLOR_TOTAL1}/gi, '#999900'],
            [/{COLOR_TOTAL2}/gi, '#ffff00']];

        if(tipo == "html") {
            marcas = [
                [/{B}/gi, '<b>'],
                [/{\/B}/gi, '</b>'],
                [/{U}/gi, '<u>'],
                [/{\/U}/gi, '</u>'],
                [/{NL}/gi, '<br>\n'],
                [/{SIZE_PEQ}/gi, '<font style="font-size:8pt;">'],
                [/{SIZE_MED}/gi, '<font style="font-size:8pt;">'],
                [/{SIZE_GRA}/gi, '<font style="font-size:11pt;">'],
                [/{\/SIZE}/gi, '</font>'],
                [/{\/COLOR}/gi, '</font>'] ];

            patron = patron.replace(/{URL_SCRIPT}/gi, '<a href="http://userscripts.org/scripts/show/73101">OGameRediseno Recursos Ampliados ' + SCRIPT_VERSION.substr(0,SCRIPT_VERSION.lastIndexOf(".")) + '</a>');

            for(var i = 0; i < colores.length; i++)
                patron = patron.replace(colores[i][0],'<font color="' + colores[i][1] + '">');
        }

        if(tipo == "phpbb") {
            marcas = [
                [/{B}/gi, '[b]'],
                [/{\/B}/gi, '[/b]'],
                [/{U}/gi, '[u]'],
                [/{\/U}/gi, '[/u]'],
                [/{NL}/gi, '\n'],
                [/{SIZE_PEQ}/gi, '[size=9]'],
                [/{SIZE_MED}/gi, '[size=12]'],
                [/{SIZE_GRA}/gi, '[size=14]'],
                [/{\/SIZE}/gi, '[/size]'],
                [/{\/COLOR}/gi, '[/color]'] ];

            patron = patron.replace(/{URL_SCRIPT}/gi, '[url=http://userscripts.org/scripts/show/73101]OGameRediseno Recursos Ampliados ' + SCRIPT_VERSION.substr(0,SCRIPT_VERSION.lastIndexOf(".")) + '[/url]');

            for(var i = 0; i < colores.length; i++)
                patron = patron.replace(colores[i][0],'[color=' + colores[i][1] + ']');
        }

        for(var i = 0; i < marcas.length; i++)
            patron = patron.replace(marcas[i][0],marcas[i][1]);

        return patron;
    }

    function setTxtBBCode(tipo) {

        if(tipo == 0) {
            document.getElementById("txtBB").value = codificar(bbcode_basico, "phpbb");
            document.getElementById("preview").innerHTML = codificar(bbcode_basico, "html");
        }
        else {
            document.getElementById("txtBB").value = codificar(bbcode_completo, "phpbb");
            document.getElementById("preview").innerHTML = codificar(bbcode_completo, "html");
        }
    }

    // 取得電漿技術等級
    function getNivelPlasma(doUpdate) {
        if ((nivel_plasma != -1) && (typeof doUpdate == 'undefined')) return nivel_plasma;

        var plasma = 0;

        if (location.href.indexOf('/game/index.php?page=resourceSettings') != -1) {
            var lista = getElementsByClass("list")[0];
            plasma = getContenido(lista, 9,0).innerHTML;
            plasma = parseInt(plasma.replace(/\D/g,''));

            if (typeof doUpdate != 'undefined') {
                var researchs = new Array();
                researchs.push("Plasma=" + plasma);

                options.set("research", researchs.join());
            }
        }
        else {
            try {
                var researchs = options.get("research").split(",");
                for (var i = 0; i < researchs; i++) {
                    if (researchs[i].startsWith("Plasma=")) {
                        plasma = parseInt(researchs[i].substring(8));
                        break;
                    }
                }
            }
            catch(err) { }
        }

        nivel_plasma = plasma;
        return nivel_plasma;
    }

    function ObjPlaneta() {
        var metal_base;
        var metal_produccion_mina;
        var metal_produccion_amplificador;
        var metal_nivel_mina;
        var metal_resource;

        var cristal_base;
        var cristal_produccion_mina;
        var cristal_produccion_amplificador;
        var cristal_nivel_mina;
        var cristal_resource;

        var deuterio_base;
        var deuterio_produccion_mina;
        var deuterio_produccion_amplificador;
        var deuterio_nivel_mina;
        var deuterio_gasto_fusion;
        var deuterio_resource;

        var almacen_metal;
        var almacen_cristal;
        var almacen_deuterio;

        var nombre;
        var coordenadas;
        var type;

        var actualizado;

        this.save = function() {
            var ret = "";
            var separador = "|#";

            ret += this.metal_base + separador;
            ret += this.metal_produccion_mina + separador;
            ret += this.metal_produccion_amplificador + separador;
            ret += this.metal_nivel_mina + separador;
            ret += this.metal_resource + separador;

            ret += this.cristal_base + separador;
            ret += this.cristal_produccion_mina + separador;
            ret += this.cristal_produccion_amplificador + separador;
            ret += this.cristal_nivel_mina + separador;
            ret += this.cristal_resource + separador;

            ret += this.deuterio_base + separador;
            ret += this.deuterio_produccion_mina + separador;
            ret += this.deuterio_produccion_amplificador + separador;
            ret += this.deuterio_nivel_mina + separador;
            ret += this.deuterio_gasto_fusion + separador;
            ret += this.deuterio_resource + separador;

            ret += this.almacen_metal + separador;
            ret += this.almacen_cristal + separador;
            ret += this.almacen_deuterio + separador;

            ret += this.nombre + separador;
            ret += this.coordenadas + separador;
            ret += this.type + separador;

            ret += this.actualizado + separador;

            return ret;
        }

        this.load = function(saved) {
            var str = saved + "  ";
            var partes = str.split("|#");
            var i = 0;

            this.metal_base = partes[i++] || 0;
            this.metal_produccion_mina = partes[i++] || 0;
            this.metal_produccion_amplificador = partes[i++] || 0;
            this.metal_nivel_mina = partes[i++] || 0;
            this.metal_resource = partes[i++] || 0;

            this.cristal_base = partes[i++] || 0;
            this.cristal_produccion_mina = partes[i++] || 0;
            this.cristal_produccion_amplificador = partes[i++] || 0;
            this.cristal_nivel_mina = partes[i++] || 0;
            this.cristal_resource = partes[i++] || 0;

            this.deuterio_base = partes[i++] || 0;
            this.deuterio_produccion_mina = partes[i++] || 0;
            this.deuterio_produccion_amplificador = partes[i++] || 0;
            this.deuterio_nivel_mina = partes[i++] || 0;
            this.deuterio_gasto_fusion = partes[i++] || 0;
            this.deuterio_resource = partes[i++] || 0;

            this.almacen_metal = partes[i++] || 0;
            this.almacen_cristal = partes[i++] || 0;
            this.almacen_deuterio = partes[i++] || 0;

            this.nombre = partes[i++] || "-";
            this.coordenadas = partes[i++] || "-";
            this.type = partes[i++] || "-";

            this.actualizado = new Date(partes[i++] || "");
        }

        // 金屬時產數量
        this.getTotalM = function() {
            var total = 0;
            var geo = 0;

            var base = parseInt(this.metal_base || 0);
            var mina = parseInt(this.metal_produccion_mina || 0);
            var plasma = parseInt((this.metal_produccion_mina || 0) * getNivelPlasma() / 100);
            var amplificador = parseInt(this.metal_produccion_amplificador || 0);
            if(equipoComandoActivo()) {
                geo = (this.metal_produccion_mina || 0) * 0.12;
            } else {

                if(geologoActivo()) {
                    geo = (this.metal_produccion_mina ||0) * 0.10;
                }
            }
            return base + mina + geo + plasma + amplificador;
        }

        // 即時金屬數量
        this.getRealM = function() {
            var ahora = new Date();
            var dif = (ahora - this.actualizado) || -1;
            var difM = Math.floor(dif / 60000);

            return parseInt(this.getTotalM() / 60 * difM) + parseInt(this.metal_resource || 0);
        }

        // 晶體時產數量
        this.getTotalC = function() {
            var total = 0;
            var geo = 0;

            var base = parseInt(this.cristal_base || 0);
            var mina = parseInt(this.cristal_produccion_mina || 0);
            var plasma = (this.cristal_produccion_mina || 0) * (getNivelPlasma() * 0.66) / 100;
            var amplificador = parseInt(this.cristal_produccion_amplificador || 0);

            if(equipoComandoActivo()) {
                geo = (this.cristal_produccion_mina ||0) * 0.12;
            }
            else {
                if(geologoActivo()) {
                    geo = (this.cristal_produccion_mina ||0) * 0.10;
                }
            }
            return base + mina + geo + plasma + amplificador;
        }

        // 即時晶體數量
        this.getRealC = function() {
            var ahora = new Date();
            var dif = (ahora - this.actualizado) || -1;
            var difM = Math.floor(dif / 60000);

            return parseInt(this.getTotalC() / 60 * difM) + parseInt(this.cristal_resource || 0);
        }

        // 重氫時產數量
        this.getTotalD = function() {
            var total = 0;
            var geo = 0;

            var mina = parseInt(this.deuterio_produccion_mina || 0);
            var plasma = (this.deuterio_produccion_mina || 0) * (getNivelPlasma() * 0.33) / 100;
            var amplificador = parseInt(this.deuterio_produccion_amplificador || 0);
            var fusion = parseInt(this.deuterio_gasto_fusion || 0);

            if(equipoComandoActivo()) {
                geo = (this.deuterio_produccion_mina ||0) * 0.12;
            }
            else {
                if(geologoActivo()) {
                    geo = (this.deuterio_produccion_mina ||0) * 0.10;
                }
            }
            return mina + geo + plasma + amplificador - fusion;
        }

        // 即時重氫數量
        this.getRealD = function() {
            var ahora = new Date();
            var dif = (ahora - this.actualizado) || -1;
            var difM = Math.floor(dif / 60000);

            return parseInt(this.getTotalD() / 60 * difM ) + parseInt(this.deuterio_resource || 0);
        }

        this.getActualizado = function() {
            var str = "  ";
            var ahora = new Date();
            var dif = (ahora - this.actualizado) || -1;

            if(dif == -1) {
                return "";
            }

            var dias = Math.floor(dif / 86400000);
            dif -= dias * 86400000;
            var horas = Math.floor(dif / 3600000);
            dif -= horas * 3600000;
            var minutos = Math.floor(dif / 60000);
            dif -= minutos * 60000;
            var segundos = Math.floor(dif / 1000);

            if(dias > 0) {
                str += '<font color="#FF0000">(' + dias + 'd' + horas + 'h)</font>';
            }
            else {
                if(horas < 3) {
                    if(horas == 0 && minutos < 60) {
                        str += '<font color="#01DF01">(' + minutos + 'm)</font>';
                    }
                    else {
                        str += '<font color="#01DF01">(' + horas + 'h' + minutos + 'm)</font>';
                    }
                }
                else {
                    str += '<font color="#FFFF00">(' + horas + 'h' + minutos + 'm)</font>';
                }
            }

            return str;
        }
    }

    function getStrSummary(str) {
        var lista = getElementsByClass("list")[0];
        var ret = "";

        if(str.toUpperCase() == "BASICO") {
            ret = getContenido(lista, 2,0).innerHTML;
        }

        if(str.toUpperCase() == "METAL") {
            ret = getContenido(lista, 3,0).innerHTML;
            ret = ret.substring(0, ret.indexOf("("));
            ret = ret.replace(/\./g, "").replace(/\,/g, "").trim();
        }

        if(str.toUpperCase() == "CRISTAL") {
            ret = getContenido(lista, 4,0).innerHTML;
            ret = ret.substring(0, ret.indexOf("("));
            ret = ret.replace(/\./g, "").replace(/\,/g, "").trim();
        }

        if(str.toUpperCase() == "DEUTERIO") {
            ret = getContenido(lista, 5,0).innerHTML;
            ret = ret.substring(0, ret.indexOf("("));
            ret = ret.replace(/\./g, "").replace(/\,/g, "").trim();
        }

        if(str.toUpperCase() == "FUSION") {
            ret = getContenido(lista, 7,0).innerHTML;
            ret = ret.substring(0, ret.indexOf("("));
            ret = ret.replace(/\./g, "").replace(/\,/g, "").trim();
        }

        if(str.toUpperCase() == "PLASMA") {
            ret = getContenido(lista, 9,0).innerHTML;
            ret = ret.substring(0, ret.indexOf("("));
            ret = ret.replace(/\./g, "").replace(/\,/g, "").trim();
        }

        if(str.toUpperCase() == "AMPLIFICADOR") {
            ret = getContenido(lista, 10,0).innerHTML;
            ret = ret.replace(/\./g, "").replace(/\,/g, "").trim();
        }

        if(str.toUpperCase() == "TOTAL_DIA") {
            ret = getContenido(lista, 13,0).innerHTML;
            ret = ret.replace(/\./g, "").replace(/\,/g, "").trim();
            ret = ret.replace("<em>","").replace("</em>","");
        }

        return ret;
    }

    function getDatosSummary() {
        var parcial = 0;

        var planeta = new ObjPlaneta();

        planeta.nombre = document.getElementsByName("ogame-planet-name")[0].content;
        planeta.coordenadas = "[" + document.getElementsByName("ogame-planet-coordinates")[0].content + "]";
        planeta.type = document.getElementsByName("ogame-planet-type")[0].content;

        planeta.actualizado = new Date();

        var metal = 0;
        var cristal = 0;
        var deu = 0;

        var almM = 0;
        var almC = 0;
        var almD = 0;

        var baseM = baseC = baseD = 0;
        var minaM = minaC = minaD = 0;
        var plasmaM = plasmaC = plasmaD = 0;

        var lista = getElementsByClass("list")[0];
        var listb = getElementsByClass("list")[0];

        // ------- metal --------------------

        // produccion base
        parcial = getContenido(lista, 2,1).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.replace(/\./g, "").replace(/\,/g, "").trim();
        planeta.metal_base = parseInt(parcial);

        // produccion minas
        parcial = getContenido(lista, 3,2).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.replace(/\./g, "").replace(/\,/g, "").trim();
        planeta.metal_produccion_mina = parseInt(parcial);

        // nivel de mina
        parcial = getContenido(lista, 3,0).innerHTML;
        parcial = parcial.replace(/\D/g,'');
        planeta.metal_nivel_mina = parseInt(parcial)

        // amplificador
        parcial = getContenido(lista, 10,2).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.replace(/\./g, "").replace(/\,/g, "").trim();
        planeta.metal_produccion_amplificador = parseInt(parcial);

        // ---------- cristal ---------------------

        // produccion base
        parcial = getContenido(lista, 2,2).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.replace(/\./g, "").replace(/\,/g, "").trim();
        planeta.cristal_base = parseInt(parcial);

        // produccion minas
        parcial = getContenido(lista, 4,3).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.replace(/\./g, "").replace(/\,/g, "").trim();
        planeta.cristal_produccion_mina = parseInt(parcial);

        // nivel de mina
        parcial = getContenido(lista, 4,0).innerHTML;
        parcial = parcial.replace(/\D/g,'');
        planeta.cristal_nivel_mina = parseInt(parcial);

        // amplificador
        parcial = getContenido(lista, 10,3).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.replace(/\./g, "").replace(/\,/g, "").trim();
        planeta.cristal_produccion_amplificador = parseInt(parcial);

        // ------- deuterio ------------------------------

        planeta.deuterio_base = 0;

        // deuterio produccion minas
        parcial = getContenido(lista, 5,4).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.replace(/\./g, "").replace(/\,/g, "").trim();
        planeta.deuterio_produccion_mina = parseInt(parcial);

        // deuterio nivel de mina
        parcial = getContenido(lista, 5,0).innerHTML;
        parcial = parcial.replace(/\D/g,'');
        planeta.deuterio_nivel_mina = parseInt(parcial);

        // deuterio resta el gasto de la planta de fusion
        parcial = getContenido(lista, 7,4).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.replace(/\./g, "").replace(/\,/g, "").trim();
        planeta.deuterio_gasto_fusion = parseInt(parcial);

        // amplificador
        parcial = getContenido(lista, 10,4).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.replace(/\./g, "").replace(/\,/g, "").trim();
        planeta.deuterio_produccion_amplificador = parseInt(parcial);

        // ----- almacenes ------------------------------------------------------------

        // almacen de metal
        parcial = getContenido(lista, 11,1).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.trim();
        if(parcial.indexOf(unsafe.LocalizationStrings.unitMega) != -1) {
            parcial = parcial.replace(unsafe.LocalizationStrings.unitMega,'').replace(',', '.');
            parcial = parseFloat(parcial);
            parcial *= 1000000;
        }
        else  {
            parcial = parcial.replace(',', '').replace('.', '');
        }
        planeta.almacen_metal = parseInt(parcial);

        // almacen de cristal
        parcial = getContenido(lista, 11,2).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.trim();
        if(parcial.indexOf(unsafe.LocalizationStrings.unitMega) != -1) {
            parcial = parcial.replace(unsafe.LocalizationStrings.unitMega,'').replace(',', '.');
            parcial = parseFloat(parcial);
            parcial *= 1000000;
        }
        else  {
            parcial = parcial.replace(',', '').replace('.', '');
        }
        planeta.almacen_cristal = parseInt(parcial);

        // almacen de deuterio
        parcial = getContenido(lista, 11,3).innerHTML;
        parcial = parcial.substring(parcial.indexOf('">')+2, parcial.indexOf("</span>"));
        parcial = parcial.trim();
        if(parcial.indexOf(unsafe.LocalizationStrings.unitMega) != -1) {
            parcial = parcial.replace(unsafe.LocalizationStrings.unitMega,'').replace(',', '.');
            parcial = parseFloat(parcial);
            parcial *= 1000000;
        }
        else  {
            parcial = parcial.replace(',', '').replace('.', '');
        }
        planeta.almacen_deuterio = parseInt(parcial);

        // ----------- geologo ------------------------------------------
        // resta el bonus del geologo de la produccion base de la mina

        if(equipoComandoActivo()) {
            planeta.metal_produccion_mina = parseInt((planeta.metal_produccion_mina/112)*100);
            planeta.cristal_produccion_mina = parseInt((planeta.cristal_produccion_mina/112)*100);
            planeta.deuterio_produccion_mina = parseInt((planeta.deuterio_produccion_mina/112)*100);
        } else {
            if(geologoActivo()) {
                planeta.metal_produccion_mina = parseInt((planeta.metal_produccion_mina/110)*100);
                planeta.cristal_produccion_mina = parseInt((planeta.cristal_produccion_mina/110)*100);
                planeta.deuterio_produccion_mina = parseInt((planeta.deuterio_produccion_mina/110)*100);
            }
        }

        // 讀取資源資料
        updateResources(planeta);

        if (planeta.type == "moon") {
            options.set("objplanet_" + getPosActual() + "m", planeta.save());
        }
        else {
            options.set("objplanet_" + getPosActual(), planeta.save());
        }
    }

    // ============================================================
    var LANG = LANG_EN;

    if (location.href.indexOf('-es.ogame.gameforge.com') != -1) { LANG = LANG_ES; }
    if (location.href.indexOf('-ar.ogame.gameforge.com') != -1) { LANG = LANG_ES; }
    if (location.href.indexOf('-mx.ogame.gameforge.com') != -1) { LANG = LANG_ES; }
    if (location.href.indexOf('-bg.ogame.gameforge.com') != -1) { LANG = LANG_BG; }
    if (location.href.indexOf('-pt.ogame.gameforge.com') != -1) { LANG = LANG_PT; }
    if (location.href.indexOf('-br.ogame.gameforge.com') != -1) { LANG = LANG_PT; }
    if (location.href.indexOf('-dk.ogame.gameforge.com') != -1) { LANG = LANG_DA; }
    if (location.href.indexOf('-ru.ogame.gameforge.com') != -1) { LANG = LANG_RU; }
    if (location.href.indexOf('-tw.ogame.gameforge.com') != -1) { LANG = LANG_TW; }
    if (location.href.indexOf('-fr.ogame.gameforge.com') != -1) { LANG = LANG_FR; }
    if (location.href.indexOf('-gr.ogame.gameforge.com') != -1) { LANG = LANG_GR; }
    if (location.href.indexOf('-it.ogame.gameforge.com') != -1) { LANG = LANG_IT; }
    if (location.href.indexOf('-pl.ogame.gameforge.com') != -1) { LANG = LANG_PL; }
    if (location.href.indexOf('-de.ogame.gameforge.com') != -1) { LANG = LANG_DE; }
    if (location.href.indexOf('-nl.ogame.gameforge.com') != -1) { LANG = LANG_NL; }

    // resourceSettings: 資源設定
    if (location.href.indexOf('/game/index.php?page=resourceSettings') != -1) {
        var planeta_type = document.getElementsByName("ogame-planet-type")[0].content;

        // 更新電漿技術等級
        nivel_plasma = getNivelPlasma(true);

        getDatosSummary();

        // 取得星球與星球數量計算
        var planets = getElementsByClass("smallplanet");
        var numPlanets = planets.length;

        // 紀錄月球數量
        var moons = new Array();
        var numMoons = 0;

        if ( numPlanets > 0 ) {
            // --- lista de planetas ---
            var listaPlanetas = "";
            var listbMoons = ""
            var mI = 0;
            for (var i=0; i < planets.length; i++) {
                var cord = getElementsByClass("planet-koords", planets[i]);
                var nombre = getElementsByClass("planet-name", planets[i]);
                listaPlanetas += cord[0].innerHTML + ";";

                // 判斷是否有所屬的月球
                var moon = getElementsByClass("moonlink", planets[i]);
                if (moon.length != 0) {
                    moons[mI++] = moon;
                    listbMoons += cord[0].innerHTML + "m;";
                }
            }
            numMoons = moons.length;

            options.set("objlist", listaPlanetas.concat(listbMoons));

            // --- calcular total ---
            var metalTH = 0;
            var cristalTH = 0;
            var deuTH = 0;
            var sep = listaPlanetas.split(";");

            var plasmaM = plasmaC = plasmaD = 0;
            var baseM = baseC = baseD = 0;
            var minaM = minaC = minaD = 0;
            var geoM = geoC = geoD = 0;
            var amplificadoresM = amplificadoresC = amplificadoresD = 0;

            var geoSTR = " (+0%)";
            var plasmaSTR_metal = " (+" + nivel_plasma + "%)";
            var plasmaSTR_cristal = " (+" + (Math.round((nivel_plasma*0.66)*100)/100)  + "%)";
            var plasmaSTR_deuterium = " (+" + (Math.round((nivel_plasma*0.33)*100)/100)  + "%)";

            var gastoFusion = 0;

            var totalM, totalC, totalD;
            totalM = totalC = totalD = 0;

            for(var k = 0; k < sep.length; k++){
                if(sep[k].length > 3) {
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + sep[k]));

                    baseM += parseInt(planeta.metal_base || 0);
                    baseC += parseInt(planeta.cristal_base || 0);
                    baseD += parseInt(planeta.deuterio_base || 0);

                    minaM += parseInt(planeta.metal_produccion_mina || 0);
                    minaC += parseInt(planeta.cristal_produccion_mina || 0);
                    minaD += parseInt(planeta.deuterio_produccion_mina || 0);

                    plasmaM += (planeta.metal_produccion_mina || 0) * nivel_plasma / 100;
                    plasmaC += (planeta.cristal_produccion_mina || 0) * (nivel_plasma * 0.66) / 100;
                    plasmaD += (planeta.deuterio_produccion_mina || 0) * (nivel_plasma * 0.33) / 100;

                    amplificadoresM += parseInt(planeta.metal_produccion_amplificador || 0);
                    amplificadoresC += parseInt(planeta.cristal_produccion_amplificador || 0);
                    amplificadoresD += parseInt(planeta.deuterio_produccion_amplificador || 0);

                    gastoFusion += parseInt(planeta.deuterio_gasto_fusion || 0);

                    if(equipoComandoActivo()) {
                        geoM += (planeta.metal_produccion_mina ||0) * 0.12;
                        geoC += (planeta.cristal_produccion_mina ||0) * 0.12;
                        geoD += (planeta.deuterio_produccion_mina ||0) * 0.12;
                        geoSTR = " (+12%)";
                    }
                    else {
                        if(geologoActivo()) {
                            geoM += (planeta.metal_produccion_mina ||0) * 0.10;
                            geoC += (planeta.cristal_produccion_mina ||0) * 0.10;
                            geoD += (planeta.deuterio_produccion_mina ||0) * 0.10;
                            geoSTR = " (+10%)";
                        }
                    }

                    totalM = baseM + minaM + geoM + plasmaM + amplificadoresM;
                    totalC = baseC + minaC + geoC + plasmaC + amplificadoresC;
                    totalD = baseD + minaD + geoD + plasmaD + amplificadoresD - gastoFusion;
                }
            }

            // --- crea la tabla ---

            var main = getElementsByClass("mainRS")[0];

            var divPorPlanetas = document.createElement('div');
            var divAlmacen = document.createElement('div');
            var divRecursos = document.createElement('div');
            var divFlotas = document.createElement('div');
            var divDefensas = document.createElement('div');
            var divBB = document.createElement('div');
            var divFinal = document.createElement('div');
            var divControl = document.createElement('div');
            var divResourcesShow = document.createElement('div');

            var tabla = "";
            var textoBB = "";

            // --- tabla con los recursos diarios por planetas

            var tablaPlanetas = "";
            tablaPlanetas += '<table cellspacing="0" cellpadding="0" style="margin-top: 0px;" width="98%">';
            tablaPlanetas += '<tr><td></td><td></td><td></td><td></td></tr>';
            tablaPlanetas += '<tr><td class="" align="left" colspan="4"><font color="#FF4000"><p style="font-size:23px">';
            tablaPlanetas += ' {RECURSOS_PLANETAS} </p></font></td></tr>';
            tablaPlanetas += '<tr><td colspan="4"></td></tr>';
            tablaPlanetas += '<tr align="right"><td width="40%"></td><td width="20%">{METAL}</td><td width="20%">{CRISTAL}</td><td width="20%">{DEUTERIO}</td></tr>';

            for(var k = 0; k < sep.length; k++){
                if(sep[k].length > 3) {
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + sep[k]));

                    var tr = ((k % 2)==0)?'<tr class="alt">':'<tr>';
                    tablaPlanetas += tr + '<td class="label">';
                    tablaPlanetas += ((getPosActual() == sep[k] && planeta_type != "moon") ? '<font color="#FF4000"><b>' + planeta.coordenadas + '</b></font>' : planeta.coordenadas) + "  " + planeta.nombre;
                    tablaPlanetas += planeta.getActualizado();
                    tablaPlanetas += '</td><td align="right" class="undermark">' + mostrarNumero(planeta.getTotalM()*24) + getNivelMina(1, sep, k);
                    tablaPlanetas += '</td><td align="right" class="undermark">' + mostrarNumero(planeta.getTotalC()*24) + getNivelMina(2, sep, k);
                    tablaPlanetas += '</td><td align="right" class="undermark">' + mostrarNumero(planeta.getTotalD()*24) + getNivelMina(3, sep, k);
                    tablaPlanetas += '</td></tr>';
                }
            }

            tablaPlanetas += '<tr><td colspan="4"></td></tr>';
            tablaPlanetas += '</table>';

            // --- tabla con los almacenes

            var tablaAlmacen = "";
            tablaAlmacen += '<table cellspacing="0" cellpadding="0" style="margin-top: 0px;" width="98%">';
            tablaAlmacen += '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            tablaAlmacen += '<tr><td align="left" colspan="7"><font color="#FF4000"><p style="font-size:23px">{ALMACEN_TIEMPO} </p></font></td></tr>';
            tablaAlmacen += '<tr><td colspan="7"></td></tr>';
            tablaAlmacen += '<tr align="right"><td width="25%"></td><td width="12%">{METAL}</td><td width="13%"></td><td width="12%">{CRISTAL}</td><td width="13%"></td><td width="12%">{DEUTERIO}</td><td width="13%"></td></tr>';

            for(var k = 0; k < sep.length; k++){
                if(sep[k].length > 3) {
                    var planeta = new ObjPlaneta();
                    planeta.load(options.get("objplanet_" + sep[k]));

                    var tr = ((k % 2)==0)?'<tr class="alt" align="right">':'<tr align="right">';

                    tablaAlmacen += tr + '<td class="label">';
                    tablaAlmacen += ((getPosActual() == sep[k] && planeta_type != "moon") ? '<font color="#FF4000"><b>' + planeta.coordenadas + '</b></font>' : planeta.coordenadas) + "  " + planeta.nombre;
                    tablaAlmacen += planeta.getActualizado() + '</td>';
                    tablaAlmacen += '<td class="undermark">' + A(planeta.almacen_metal) + '</td>';
                    tablaAlmacen += '<td><p align="right">' + getTiempoLlenado(planeta.getTotalM(), planeta.getRealM(), planeta.almacen_metal) + '</p></td>';
                    tablaAlmacen += '<td class="undermark">' + A(planeta.almacen_cristal) + '</td>';
                    tablaAlmacen += '<td><p align="right">' + getTiempoLlenado(planeta.getTotalC(), planeta.getRealC(), planeta.almacen_cristal) + '</p></td>';
                    tablaAlmacen += '<td class="undermark">' + A(planeta.almacen_deuterio) + '</td>';
                    tablaAlmacen += '<td><p align="right">' + getTiempoLlenado(planeta.getTotalD(), planeta.getRealD(), planeta.almacen_deuterio) + '</p></td>';
                    tablaAlmacen += '</tr>';
                }
            }
            tablaAlmacen += '<tr><td colspan="7"></td></tr>';
            tablaAlmacen += '</table>';

            // --- tabla con los recursos diarios/semanales/mensuales

            tabla += '<table cellspacing="0" cellpadding="0" style="margin-top: 0px;" width="98%">';
            tabla += '<tr height="50"><td width="20%"></td><td width="14%"></td><td width="19%"></td><td width="22%"></td><td></td></tr>';
            tabla += '<tr><td align="center" colspan="5"><font color="#FF4000"><p style="font-size:23px">{PRODUCCION_IMPERIAL}</p></font></td></tr>';
            tabla += '<tr><td colspan="5"></td></tr>';
            tabla += '<tr align="right"><td></td><td>{HORA}</td><td>{DIARIA}</td><td>{SEMANAL}</td><td>{MENSUAL}</td></tr>';

            tabla += '<tr class="alt" align="right"><td class="label"><b><a id="mostrarDM" href="javascript:void(0)"><img src ="" id="img_detalleMetal"> {METAL}</a></b></td><td class="undermark"><b>' + mostrarNumero(totalM) + '</b></td><td class="undermark"><b>' + mostrarNumero(totalM*24) + '</b></td><td class="undermark"><b>' + mostrarNumero(totalM*168) + '</b></td><td class="undermark"><b>' + mostrarNumero(totalM*720) + '</b></td></tr>';
            tabla += '<tr class="" align="right" id="detalleMetal_1" style="display:none"><td class="label">' + getStrSummary("basico") + '</td><td class="">' + mostrarNumero(baseM) + '</td><td class="">' + mostrarNumero(baseM*24) + '</td><td class="">' + mostrarNumero(baseM*168) + '</td><td class="">' + mostrarNumero(baseM*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleMetal_2" style="display:none"><td class="label">' + getStrSummary("metal") + '</td><td class="">' + mostrarNumero(minaM) + '</td><td class="">' + mostrarNumero(minaM*24) + '</td><td class="">' + mostrarNumero(minaM*168) + '</td><td class="">' + mostrarNumero(minaM*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleMetal_3" style="display:none"><td class="label">' + getStrSummary("plasma") + ' ' + plasmaSTR_metal + '</td><td class="">' + mostrarNumero(plasmaM) + '</td><td class="">' + mostrarNumero(plasmaM*24) + '</td><td class="">' + mostrarNumero(plasmaM*168) + '</td><td class="">' + mostrarNumero(plasmaM*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleMetal_4" style="display:none"><td class="label">{GEOLOGO}' + geoSTR + '</td><td class="">' + mostrarNumero(geoM) + '</td><td class="">' + mostrarNumero(geoM*24) + '</td><td class="">' + mostrarNumero(geoM*168) + '</td><td class="">' + mostrarNumero(geoM*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleMetal_5" style="display:none"><td class="label">' + getStrSummary("amplificador") + '</td><td class="">' + mostrarNumero(amplificadoresM) + '</td><td class="">' + mostrarNumero(amplificadoresM*24) + '</td><td class="">' + mostrarNumero(amplificadoresM*168) + '</td><td class="">' + mostrarNumero(amplificadoresM*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleMetal_6" style="display:none"><td class="label"></td><td class=""></td><td class=""></td><td class=""></td><td class=""></td></tr>';

            tabla += '<tr class="alt" align="right"><td class="label"><b><a id="mostrarDC" href="javascript:void(0)"><img src ="" id="img_detalleCristal"> {CRISTAL}</a></b></td><td class="undermark"><b>' + mostrarNumero(totalC) + '</b></td><td class="undermark"><b>' + mostrarNumero(totalC*24) + '</b></td><td class="undermark"><b>' + mostrarNumero(totalC*168) + '</b></td><td class="undermark"><b>' + mostrarNumero(totalC*720) + '</b></td></tr>';
            tabla += '<tr class="" align="right" id="detalleCristal_1" style="display:none"><td class="label">' + getStrSummary("basico") + '</td><td class="">' + mostrarNumero(baseC) + '</td><td class="">' + mostrarNumero(baseC*24) + '</td><td class="">' + mostrarNumero(baseC*168) + '</td><td class="">' + mostrarNumero(baseC*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleCristal_2" style="display:none"><td class="label">' + getStrSummary("cristal") + '</td><td class="">' + mostrarNumero(minaC) + '</td><td class="">' + mostrarNumero(minaC*24) + '</td><td class="">' + mostrarNumero(minaC*168) + '</td><td class="">' + mostrarNumero(minaC*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleCristal_3" style="display:none"><td class="label">' + getStrSummary("plasma") + ' ' + plasmaSTR_cristal + '</td><td class="">' + mostrarNumero(plasmaC) + '</td><td class="">' + mostrarNumero(plasmaC*24) + '</td><td class="">' + mostrarNumero(plasmaC*168) + '</td><td class="">' + mostrarNumero(plasmaC*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleCristal_4" style="display:none"><td class="label">{GEOLOGO}' + geoSTR + '</td><td class="">' + mostrarNumero(geoC) + '</td><td class="">' + mostrarNumero(geoC*24) + '</td><td class="">' + mostrarNumero(geoC*168) + '</td><td class="">' + mostrarNumero(geoC*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleCristal_5" style="display:none"><td class="label">' + getStrSummary("amplificador") + '</td><td class="">' + mostrarNumero(amplificadoresC) + '</td><td class="">' + mostrarNumero(amplificadoresC*24) + '</td><td class="">' + mostrarNumero(amplificadoresC*168) + '</td><td class="">' + mostrarNumero(amplificadoresC*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleCristal_6" style="display:none"><td class="label"></td><td class=""></td><td class=""></td><td class=""></td><td class=""></td></tr>';

            tabla += '<tr class="alt" align="right"><td class="label"><b><a id="mostrarDD" href="javascript:void(0)"><img src ="" id="img_detalleDeuterio"> {DEUTERIO}</a></b></td><td class="undermark"><b>' + mostrarNumero(totalD) + '</b></td><td class="undermark"><b>' + mostrarNumero(totalD*24) + '</b></td><td class="undermark"><b>' + mostrarNumero(totalD*168) + '</b></td><td class="undermark"><b>' + mostrarNumero(totalD*720) + '</b></td></tr>';
            tabla += '<tr class="" align="right" id="detalleDeuterio_1" style="display:none"><td class="label">' + getStrSummary("deuterio") + '</td><td class="">' + mostrarNumero(minaD) + '</td><td class="">' + mostrarNumero(minaD*24) + '</td><td class="">' + mostrarNumero(minaD*168) + '</td><td class="">' + mostrarNumero(minaD*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleDeuterio_2" style="display:none"><td class="label">' + getStrSummary("plasma") + ' ' + plasmaSTR_deuterium + '</td><td class="">' + mostrarNumero(plasmaD) + '</td><td class="">' + mostrarNumero(plasmaD*24) + '</td><td class="">' + mostrarNumero(plasmaD*168) + '</td><td class="">' + mostrarNumero(plasmaD*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleDeuterio_3" style="display:none"><td class="label">{GEOLOGO}' + geoSTR + '</td><td class="">' + mostrarNumero(geoD) + '</td><td class="">' + mostrarNumero(geoD*24) + '</td><td class="">' + mostrarNumero(geoD*168) + '</td><td class="">' + mostrarNumero(geoD*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleDeuterio_4" style="display:none"><td class="label">' + getStrSummary("amplificador") + '</td><td class="">' + mostrarNumero(amplificadoresD) + '</td><td class="">' + mostrarNumero(amplificadoresD*24) + '</td><td class="">' + mostrarNumero(amplificadoresD*168) + '</td><td class="">' + mostrarNumero(amplificadoresD*720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleDeuterio_5" style="display:none"><td class="label">' + getStrSummary("fusion") + '</td><td class="">' + mostrarNumero(gastoFusion*-1) + '</td><td class="">' + mostrarNumero(gastoFusion*-24) + '</td><td class="">' + mostrarNumero(gastoFusion*-168) + '</td><td class="">' + mostrarNumero(gastoFusion*-720) + '</td></tr>';
            tabla += '<tr class="" align="right" id="detalleDeuterio_6" style="display:none"><td class="label"></td><td class=""></td><td class=""></td><td class=""></td><td class=""></td></tr>';

            tabla += '<tr><td colspan="5"></td></tr>';
            tabla += '<tr class="" align="right"><td class="label">{TOTAL}</td><td class="nomark">' + mostrarNumero((totalM+totalC+totalD)) + '</td><td class="nomark">' + mostrarNumero((totalM+totalC+totalD)*24) + '</td><td class="nomark">' + mostrarNumero((totalM+totalC+totalD)*168) + '</td><td class="momark">' + mostrarNumero((totalM+totalC+totalD)*720) + '</td></tr>';
            tabla += '<tr class="" align="right"><td class="label">{EN_METAL}</td><td class="nomark">' + mostrarNumero((totalM)+((totalC)*1.5)+((totalD)*3)) + '</td><td class="nomark">' + mostrarNumero((totalM*24)+((totalC*24)*1.5)+((totalD*24)*3)) + '</td><td class="nomark">' + mostrarNumero((totalM*168)+((totalC*168)*1.5)+((totalD*168)*3)) + '</td><td class="momark">' + mostrarNumero((totalM*720)+((totalC*720)*1.5)+((totalD*720)*3))+ '</td></tr>';
            tabla += '<tr class="" align="left" height="50"><td colspan="5">' + numPlanets + ' {PLANETAS}:   ' + listaPlanetas.replace(/;/g, "  ") + '<br />' + numMoons + ' {MOONS}:   ' + listbMoons.replace(/;/g, "  ") + '</td>';
            tabla += '</tr></form>';
            tabla += '</table>';

            var controlTable = "";
            controlTable += '<br /><br /><br /><br /><table class="" width="98%">';
            controlTable += '<tr>'
            controlTable += '<td width="19%" style="text-align:left;" bgcolor="#240B3B"><a style="color: #FFFFFF; font-size: 10pt" id="mostrar_sec1" href="javascript:void(0)"><img src ="" id="img_sec1">{PLANETAS}</a></td>';
            controlTable += '<td width="19%" style="text-align:left;" bgcolor="#240B3B"><a style="color: #FFFFFF; font-size: 10pt" id="mostrar_sec2" href="javascript:void(0)"><img src ="" id="img_sec2">{ALMACENES}</a></td>';
            controlTable += '<td width="19%" style="text-align:left;" bgcolor="#240B3B"><a style="color: #FFFFFF; font-size: 10pt" id="mostrar_sec3" href="javascript:void(0)"><img src ="" id="img_sec3">{FLOTA}</a></td>';
            controlTable += '<td width="19%" style="text-align:left;" bgcolor="#240B3B"><a style="color: #FFFFFF; font-size: 10pt" id="mostrar_sec4" href="javascript:void(0)"><img src ="" id="img_sec4">{DEFENSA}</a></td>';
            controlTable += '<td style="text-align:left;" bgcolor="#240B3B"><a style="color: #FFFFFF; font-size: 10pt" id="mostrar_sec5" href="javascript:void(0)"><img src ="" id="img_sec5">{BBCODE}</a></td>';
            controlTable += '</tr></table>';

            var metalD = totalM * 24;
            var cristalD = totalC * 24;
            var deuD = totalD * 24;

            // --- tabla de produccion de flotas ---
            var txtTablaFlotas = "";
            txtTablaFlotas += '<table cellspacing="0" cellpadding="0" style="margin-top: 0px;" width="98%">';
            txtTablaFlotas += '<tr align="right"><td style="width: 16%"></td><td style="width: 16%"></td><td style="width: 16%"></td><td style="width: 16%"></td><td style="width: 16%"></td><td></td></tr>'
            txtTablaFlotas += '<tr align="left"><td colspan="6"><font color="#FF4000"><p style="font-size:23px"> {PRODUCCION_FLOTA} </p></font><br><br></tr>'
            txtTablaFlotas += '<tr align="right"><td></td><td>{PRODUCCION}</td><td></td><td></td><td>{EXCEDENTES_DIA}</td><td></td></tr>'
            txtTablaFlotas += '<tr align="right"><td></td><td>{DIA}</td><td>{SEMANA}</td><td>{METAL}</td><td>{CRISTAL}</td><td>{DEUTERIO}</td></tr>'
            txtTablaFlotas += generarFilaProduccion("{P_CARGA}", metalD, cristalD, deuD, 2000, 2000, 0, "alt");
            txtTablaFlotas += generarFilaProduccion("{G_CARGA}", metalD, cristalD, deuD, 6000, 6000, 0);
            txtTablaFlotas += generarFilaProduccion("{C_LIGERO}", metalD, cristalD, deuD, 3000, 1000, 0, "alt");
            txtTablaFlotas += generarFilaProduccion("{C_PESADO}", metalD, cristalD, deuD, 6000, 4000, 0);
            txtTablaFlotas += generarFilaProduccion("{CRUCERO}", metalD, cristalD, deuD, 20000, 7000, 2000, "alt");
            txtTablaFlotas += generarFilaProduccion("{NBATALLA}", metalD, cristalD, deuD, 45000, 15000, 0);
            txtTablaFlotas += generarFilaProduccion("{COLONIZADOR}", metalD, cristalD, deuD, 10000, 20000, 10000, "alt");
            txtTablaFlotas += generarFilaProduccion("{RECICLADOR}", metalD, cristalD, deuD, 10000, 6000, 2000);
            txtTablaFlotas += generarFilaProduccion("{SONDA}", metalD, cristalD, deuD, 0, 1000,0, "alt");
            txtTablaFlotas += generarFilaProduccion("{BOMBARDERO}", metalD, cristalD, deuD, 50000, 25000, 15000);
            txtTablaFlotas += generarFilaProduccion("{DESTRUCTOR}", metalD, cristalD, deuD, 60000, 50000, 15000, "alt");
            txtTablaFlotas += generarFilaProduccion("{EDLM}", metalD, cristalD, deuD, 5000000, 4000000, 1000000);
            txtTablaFlotas += generarFilaProduccion("{ACORAZADO}", metalD, cristalD, deuD, 30000, 40000, 15000, "alt");
            txtTablaFlotas += generarFilaProduccion("{SATELITE}", metalD, cristalD, deuD, 0, 2000, 500, "");
            txtTablaFlotas += '</table>';

            // --- tabla de produccion de defensas ---
            var txtTablaDef = "";
            txtTablaDef += '<table cellspacing="0" cellpadding="0" style="margin-top: 0px;" width="98%">';
            txtTablaDef += '<tr align="right"><td style="width: 16%"></td><td style="width: 16%"></td><td style="width: 16%"></td><td style="width: 16%"></td><td style="width: 16%"></td><td></td></tr>'
            txtTablaDef += '<tr align="left"><td colspan="6"><font color="#FF4000"><p style="font-size:23px"> {PRODUCCION_DEFENSAS} </p></font><br><br></tr>'
            txtTablaDef += '<tr align="right"><td></td><td>{PRODUCCION}</td><td></td><td></td><td>{EXCEDENTES_DIA}</td><td></td></tr>'
            txtTablaDef += '<tr align="right"><td></td><td>{DIA}</td><td>{SEMANA}</td><td>{METAL}</td><td>{CRISTAL}</td><td>{DEUTERIO}</td></tr>'
            txtTablaDef += generarFilaProduccion("{LANZAMISILES}", metalD, cristalD, deuD, 2000, 0, 0, "alt");
            txtTablaDef += generarFilaProduccion("{LASER_PEQ}", metalD, cristalD, deuD, 1500, 500, 0);
            txtTablaDef += generarFilaProduccion("{LASER_GRA}", metalD, cristalD, deuD, 6000, 2000, 0, "alt");
            txtTablaDef += generarFilaProduccion("{C_GAUS}", metalD, cristalD, deuD, 20000, 15000, 2000);
            txtTablaDef += generarFilaProduccion("{C_IONICO}", metalD, cristalD, deuD, 2000, 6000, 0, "alt");
            txtTablaDef += generarFilaProduccion("{C_PLASMA}", metalD, cristalD, deuD, 50000, 50000, 30000);
            txtTablaDef += generarFilaProduccion("{M_ANTI}", metalD, cristalD, deuD, 8000, 0, 2000, "alt");
            txtTablaDef += generarFilaProduccion("{M_PLAN}", metalD, cristalD, deuD, 15500, 2500, 10000);
            txtTablaDef += '</table>';

            // --- textarea con el BBCode
            // produccion basica
            textoBB = '{SIZE_GRA}{U}{B}{PRODUCCION_DIARIA_DE} ' + getNombreJugador() + '{/B}{/U} {/SIZE}{SIZE_PEQ}( ' + getFecha() + ' ){/SIZE}{NL}{NL}';
            textoBB += getStrSummary("basico") + " (" + numPlanets + " {PLANETAS}): {COLOR_METAL}" + mostrarNumero((baseM+minaM)*24) + "{/COLOR} {METAL}, {COLOR_CRISTAL}" + mostrarNumero((baseC+minaC)*24) + "{/COLOR} {CRISTAL}, {COLOR_DEUTERIO}" + mostrarNumero((baseD+minaD-gastoFusion)*24) + "{/COLOR} {DEUTERIO}{NL}";
            textoBB += getStrSummary("plasma") +  ": {COLOR_METAL}" + mostrarNumero(plasmaM*24) + "{/COLOR} " + plasmaSTR_metal + " {METAL}, {COLOR_CRISTAL}" + mostrarNumero(plasmaC*24) + "{/COLOR} " + plasmaSTR_cristal + " {CRISTAL}{NL}{NL}";
            textoBB += "{SIZE_GRA}{B}" + getStrSummary("total_dia") + " {COLOR_METAL}" + mostrarNumero((baseM+minaM+plasmaM)*24) + "{/COLOR} {METAL}, {COLOR_CRISTAL}" + mostrarNumero((baseC+minaC+plasmaC)*24) + "{/COLOR} {CRISTAL}, {COLOR_DEUTERIO}" + mostrarNumero((baseD+minaD-gastoFusion+plasmaD)*24) + "{/COLOR} {DEUTERIO}{/B}{/SIZE}{NL}{NL}";
            textoBB += "{TOTAL}: {COLOR_TOTAL1}" + mostrarNumero(((baseM+minaM+plasmaM)*24)+((baseC+minaC+plasmaC)*24)+((baseD+minaD-gastoFusion+plasmaD)*24)) + "{/COLOR}{NL}";
            textoBB += "{EN_METAL}: {COLOR_TOTAL2}" + mostrarNumero(((baseM+minaM+plasmaM)*24)+((baseC+minaC+plasmaC)*24*3/2)+((baseD+minaD+plasmaD-gastoFusion)*24*3)) + "{/COLOR}{NL}{NL}";
            textoBB += "{SIZE_PEQ}{METAL}: " + getStrNiveles(1,sep) + "{/SIZE}{NL}";
            textoBB += "{SIZE_PEQ}{CRISTAL}: " + getStrNiveles(2,sep) + "{/SIZE}{NL}";
            textoBB += "{SIZE_PEQ}{DEUTERIO}: " + getStrNiveles(3,sep) + "{/SIZE}{NL}{NL}";
            textoBB += "{SIZE_PEQ}{URL_SCRIPT}{/SIZE}{NL}";
            bbcode_basico = translate(textoBB);

            // produccion completa
            textoBB = '{SIZE_GRA}{U}{B}{PRODUCCION_DIARIA_DE} ' + getNombreJugador() + '{/B}{/U} {/SIZE}{SIZE_PEQ}( ' + getFecha() + ' ){/SIZE}{NL}{NL}';
            textoBB += getStrSummary("basico") + " (" + numPlanets + " {PLANETAS}): {COLOR_METAL}" + mostrarNumero((baseM+minaM)*24) + "{/COLOR} {METAL}, {COLOR_CRISTAL}" + mostrarNumero((baseC+minaC)*24) + "{/COLOR} {CRISTAL}, {COLOR_DEUTERIO}" + mostrarNumero((baseD+minaD-gastoFusion)*24) + "{/COLOR} {DEUTERIO}{NL}";
            textoBB += getStrSummary("plasma") +  ": {COLOR_METAL}" + mostrarNumero(plasmaM*24) + "{/COLOR} " + plasmaSTR_metal + " {METAL}, {COLOR_CRISTAL}" + mostrarNumero(plasmaC*24) + "{/COLOR} " + plasmaSTR_cristal + " {CRISTAL}{NL}";
            textoBB += '{GEOLOGO}' + geoSTR + ": {COLOR_METAL}" + mostrarNumero(geoM*24) + "{/COLOR} {METAL}, {COLOR_CRISTAL}" + mostrarNumero(geoC*24) + "{/COLOR} {CRISTAL}, {COLOR_DEUTERIO}" + mostrarNumero(geoD*24) + "{/COLOR} {DEUTERIO}{NL}";
            textoBB += getStrSummary("amplificador") + ": {COLOR_METAL}" + mostrarNumero(amplificadoresM*24) + "{/COLOR} {METAL}, {COLOR_CRISTAL}" + mostrarNumero(amplificadoresC*24) + "{/COLOR} {CRISTAL}, {COLOR_DEUTERIO}" + mostrarNumero(amplificadoresD*24) + "{/COLOR} {DEUTERIO}{NL}{NL}";
            textoBB += "{SIZE_GRA}{B}" + getStrSummary("total_dia") + " {COLOR_METAL}" + mostrarNumero(totalM*24) + "{/COLOR} {METAL}, {COLOR_CRISTAL}" + mostrarNumero(totalC*24) + "{/COLOR} {CRISTAL}, {COLOR_DEUTERIO}" + mostrarNumero(totalD*24) + "{/COLOR} {DEUTERIO}{/B}{/SIZE}{NL}{NL}";
            textoBB += "{TOTAL}: {COLOR_TOTAL1}" + mostrarNumero((totalM*24)+(totalC*24)+(totalD*24)) + "{/COLOR}{NL}";
            textoBB += "{EN_METAL}: {COLOR_TOTAL2}" + mostrarNumero((totalM*24)+(totalC*24*3/2)+(totalD*24*3)) + "{/COLOR}{NL}{NL}";
            textoBB += "{SIZE_PEQ}{METAL}: " + getStrNiveles(1,sep) + "{/SIZE}{NL}";
            textoBB += "{SIZE_PEQ}{CRISTAL}: " + getStrNiveles(2,sep) + "{/SIZE}{NL}";
            textoBB += "{SIZE_PEQ}{DEUTERIO}: " + getStrNiveles(3,sep) + "{/SIZE}{NL}{NL}";
            textoBB += "{SIZE_PEQ}{URL_SCRIPT}{/SIZE}{NL}";
            bbcode_completo = translate(textoBB);

            produccionBB = '<p align="center"><br><textarea id="txtBB" name="txtBB" style="background-color:##0000FF;width:600px;height:100px;border: 2px solid #990000;" rows="5" cols="20" onclick="this.focus();this.select()" readonly="readonly">';
            produccionBB += codificar(bbcode_basico, "phpbb")
            produccionBB += '</textarea><br>';
            produccionBB += '<input id="op_p_bas" type="radio" name="tipo_bbc" value="basica" checked="checked">{PRODUCCION_BASICA}</input><br>';
            produccionBB += '<input id="op_p_comp" type="radio" name="tipo_bbc" value="completa">{PRODUCCION_COMPLETA}</input><br></p>';
            produccionBB += '<br><br><div id="preview" style="margin:25px">' + codificar(bbcode_basico, "html") + '</div>';

            var txtFinal = '<br><br><br><br><br>';
            txtFinal += '<p align="center"><a href="javascript:localStorage.clear();location.reload();" target="">重置資料</a></p>';

            var resShowArr = Array("resources", "station", "traderOverview", "research", "shipyard", "defense", "fleet1");
            var resShowOpt = options.get("resshowopt").toString();
            var tbResourcesShow = '<br /><br /><table cellspacing="0" cellpadding="0" style="margin-top: 0px;" width="98%">';
            tbResourcesShow += '<tr><td colspan="8" align="center"><font color="#FF4000"><p style="font-size:23px">帝國資源量顯示設定</p></font></td></tr>';
            tbResourcesShow += '<tr align="center" height="40"><td>顯示頁面</td><td>資源</td><td>設施</td><td>商人</td><td>科技</td><td>造船廠</td><td>防禦</td><td>艦隊</td></tr>';
            tbResourcesShow += '<tr align="center"><td>勾選顯示</td>';
            for (var k = 0; k < 7; k++) {
                var checkedSet = (resShowOpt.indexOf(resShowArr[k]) == -1) ? '"' : '" checked="checked"';
                tbResourcesShow += '<td width="12%"><input type="checkbox" class="resShow" value="' + resShowArr[k] + checkedSet + ' /></td>';
            }
            tbResourcesShow += '</tr></table>';

            var obj;

            // produccion imperial
            divRecursos.innerHTML = translate(tabla);
            main.appendChild(divRecursos);

            // 全星月資源清單
            main.appendChild(getResourcesTable());

            // 全星月資源清單顯示設定
            divResourcesShow.innerHTML = tbResourcesShow;
            main.appendChild(divResourcesShow);
            $("input.resShow").bind("click", ResourcesShow_Click);

            // control
            divControl.innerHTML = translate(controlTable);
            main.appendChild(divControl);

            // recursos por planetas
            divPorPlanetas.innerHTML = translate(tablaPlanetas);
            divPorPlanetas.id = "sec_1";
            divPorPlanetas.style.display = "";
            main.appendChild(divPorPlanetas);
            obj = document.getElementById("mostrar_sec1");
            addEvent(obj.parentNode, "click", function(){mostrarSeccion(1)});
            obj = document.getElementById("img_sec1");
            obj.setAttribute ("src", closeImg);

            // almacenes
            divAlmacen.innerHTML = translate(tablaAlmacen);
            divAlmacen.id = "sec_2";
            divAlmacen.style.display = "none";
            main.appendChild(divAlmacen);
            obj = document.getElementById("mostrar_sec2");
            addEvent(obj.parentNode, "click", function(){mostrarSeccion(2)});
            obj = document.getElementById("img_sec2");
            obj.setAttribute ("src", openImg);

            // produccion flotas
            divFlotas.innerHTML = translate(txtTablaFlotas);
            divFlotas.id = "sec_3";
            divFlotas.style.display = "none";
            main.appendChild(divFlotas);
            obj = document.getElementById("mostrar_sec3");
            addEvent(obj.parentNode, "click", function(){mostrarSeccion(3)});
            obj = document.getElementById("img_sec3");
            obj.setAttribute ("src", openImg);

            // produccion defensas
            divDefensas.innerHTML = translate(txtTablaDef);
            divDefensas.id = "sec_4";
            divDefensas.style.display = "none";
            main.appendChild(divDefensas);
            obj = document.getElementById("mostrar_sec4");
            addEvent(obj.parentNode, "click", function(){mostrarSeccion(4)});
            obj = document.getElementById("img_sec4");
            obj.setAttribute ("src", openImg);

            // bb-code
            divBB.innerHTML = translate(produccionBB);
            divBB.id = "sec_5";
            divBB.style.display = "none";
            main.appendChild(divBB);
            obj = document.getElementById("mostrar_sec5");
            addEvent(obj.parentNode, "click", function(){mostrarSeccion(5)});
            obj = document.getElementById("img_sec5");
            obj.setAttribute ("src", openImg);

            // detalles de recursos
            obj = document.getElementById("mostrarDM");
            addEvent(obj.parentNode, "click", function(){mostrarDetallesRecursos("detalleMetal")});

            obj = document.getElementById("mostrarDC");
            addEvent(obj.parentNode, "click", function(){mostrarDetallesRecursos("detalleCristal")});

            obj = document.getElementById("mostrarDD");
            addEvent(obj.parentNode, "click", function(){mostrarDetallesRecursos("detalleDeuterio")});

            obj = document.getElementById("img_detalleMetal");
            obj.setAttribute ("src", openImg);

            obj = document.getElementById("img_detalleCristal");
            obj.setAttribute ("src", openImg);

            obj = document.getElementById("img_detalleDeuterio");
            obj.setAttribute ("src", openImg);

            // opciones para el bbcode con la produccion basica o completa
            obj = document.getElementById("op_p_bas");
            addEvent(obj, "click", function(){setTxtBBCode(0)});

            obj = document.getElementById("op_p_comp");
            addEvent(obj, "click", function(){setTxtBBCode(1)});
        }

        // div final (firma y enlace)
        divFinal.innerHTML = translate(txtFinal);
        main.appendChild(divFinal);
    }
    // resources: 資源
    else if (location.href.indexOf('/game/index.php?page=resources') != -1) {
        // 更新現有資源資料
        updateResources();

        // 放置資源清單
        var resShowOpt = options.get("resshowopt").toString();
        if (resShowOpt.indexOf("resources") != -1) {
            var main = document.getElementById("inhalt");
            main.appendChild(getResourcesTable());
        }
    }
    // station: 設施
    else if (location.href.indexOf('/game/index.php?page=station') != -1) {
        // 更新現有資源資料
        updateResources();

        // 放置資源清單
        var resShowOpt = options.get("resshowopt").toString();
        if (resShowOpt.indexOf("station") != -1) {
            var main = document.getElementById("inhalt");
            main.appendChild(getResourcesTable());
        }
    }
    // traderOverview: 商人
    else if (location.href.indexOf('/game/index.php?page=traderOverview') != -1) {
        // 更新現有資源資料
        updateResources();

        // 放置資源清單
        var resShowOpt = options.get("resshowopt").toString();
        if (resShowOpt.indexOf("traderOverview") != -1) {
            var main = document.getElementById("inhalt");
            main.appendChild(getResourcesTable());
        }
    }
    // research: 科技
    else if (location.href.indexOf('/game/index.php?page=research') != -1) {
        // 更新現有資源資料
        updateResources();

        // 放置資源清單
        var resShowOpt = options.get("resshowopt").toString();
        if (resShowOpt.indexOf("research") != -1) {
            var main = document.getElementById("inhalt");
            main.appendChild(getResourcesTable());
        }
    }
    // shipyard: 造船廠
    else if (location.href.indexOf('/game/index.php?page=shipyard') != -1) {
        // 更新現有資源資料
        updateResources();

        // 放置資源清單
        var resShowOpt = options.get("resshowopt").toString();
        if (resShowOpt.indexOf("shipyard") != -1) {
            var main = document.getElementById("inhalt");
            main.appendChild(getResourcesTable());
        }
    }
    // defense: 防禦
    else if (location.href.indexOf('/game/index.php?page=defense') != -1) {
        // 更新現有資源資料
        updateResources();

        // 放置資源清單
        var resShowOpt = options.get("resshowopt").toString();
        if (resShowOpt.indexOf("defense") != -1) {
            var main = document.getElementById("inhalt");
            main.appendChild(getResourcesTable());
        }
    }
    // fleet1: 艦隊1
    else if (location.href.indexOf('/game/index.php?page=fleet1') != -1) {
        // 更新現有資源資料
        updateResources();

        // 放置資源清單
        var resShowOpt = options.get("resshowopt").toString();
        if (resShowOpt.indexOf("fleet1") != -1) {
            var main = document.getElementById("inhalt");
            main.appendChild(getResourcesTable());
        }
    }
}) ()
