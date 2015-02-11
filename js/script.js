
/*-----------------------------------------
----------------GLOBALE VARIABLER------------------*/
//holder styr på ALLE bestillinger laget
var bestillinger = [];
//holder styr på alle bestillinger som skal i ovn 1
var ovn1 = [];
//holder styr på alle bestillinger som skal i ovn 2
var ovn2 = [];
//holder styr på alle bestillinger som er ferdig.
var ferdig = [];

//hvor lenge står pizzaen i ovnen?
var steketid = 600; //i sekunder
//hvor lang tid tar det å få ut en pizza og inn en ny?
var lazytime = 120; //i sekunder

//hvilket dag er det i dag?
var tid;

/*-----------------------------------------
----------------FUNCTIONS------------------*/
function getBestilling(form) {
	//Henter informasjon fra form
	var bestilling = {
		type: form.type.value,
		betalt: form.betalt.value,
		navn: form.name.value, //navn på kunde
		kommentar:  form.kommentar.value,
		tidFerdigMin: NaN,
		tidFerdigTime: NaN
	};
	//legg bestilling til totalt totale listen over bestillinger
	bestillinger[bestillinger.length] = bestilling;
}

function getTime() {
	/*Oppdaterer klokka*/
	var today = new Date();
	tid = {
		time: today.getHours(),
		min: today.getMinutes(),
		sec: today.getSeconds()
	};

	// legger til ekstra 0 hvis tallet er under 10.
	tid.time = (tid.time < 10 ? "0" : "") + tid.time;
	tid.min = (tid.min < 10 ? "0" : "") + tid.min;
	tid.sec = (tid.sec < 10 ? "0" : "") + tid.sec;
	// vis klokke
	document.getElementById('clock').innerHTML = tid.time + ":" + tid.min + ":" + tid.sec;
}

// var time = tid.time; 
function tidFerdig(ovn, bestilling) {
	// hvis det ikke er noen pizza i ovnen:
	if (ovn.length < 1) {
		var time = tid.time, min = Number(tid.min) + (steketid / 60) + (lazytime / 60);
	}
    // hvis det er pizza i ovnen, regn ut fra når siste pizza skal være ferdig.
	else{
        var time = ovn[ovn.length-1].tidFerdigTime;
		var min = Number(ovn[ovn.length-1].tidFerdigMin) + (steketid/60) + (lazytime/60);
	}
    
    // passer på at tall over 60 blir 0. 61 = 01 osv
    if (min > 59) {
			min = min % 60;
			time = Number(time) + 1;
    }
    if (time == 24) {
        time = 0;
    }

// legger til ekstra 0 hvis tallet er under 10.
    if (time < 10 && time.toString().length < 2) time = "0" + time;
    if (min <10 && min.toString().length < 3) min = "0" + min; 

    // legger inn utregnet tid
    bestilling.tidFerdigMin = min;
    bestilling.tidFerdigTime = time;
};

function visBestilling(bestilling, element) {
    if (element == "#table3 tr:last") {
        //print ut bestilling 
        $(element).after(
        '<tr>' +
		'<td>' +  bestilling.navn + '</td>' +
		'<td>' + bestilling.type + '</td>' +
		'<td>' + bestilling.betalt + '</td>' +
		'<td>' + bestilling.kommentar + '</td>'+
		'<td>' + bestilling.tidFerdigTime + ":" + bestilling.tidFerdigMin + '</td>'+
        '<td>'+'<button  onclick="fjernBestilling(this, true)">Hentet</button>' + '</td>' +
		'</tr>'
        );
    }
    else {
        //print ut bestilling 
        $(element).after(
            '<tr>' +
            '<td>' +  bestilling.navn + '</td>' +
            '<td>' + bestilling.type + '</td>' +
            '<td>' + bestilling.betalt + '</td>' +
            '<td>' + bestilling.kommentar + '</td>'+
            '<td>' + bestilling.tidFerdigTime + ":" + bestilling.tidFerdigMin + '</td>'+
            '</tr>'
        );
    }
}

function fjernBestilling (element, parent) {
    if(parent == true) {
           $(element).closest('tr').remove();
    }
    else {
	//fjern bestilling fra ovn visuelt
	$(element).remove();
    }
}
function fjernSisteBestilling (element, ovn) {
    // sjekk at det er noen bestillinger
    if (ovn.length < 1) return false;
    
	//fjern bestilling fra ovn visuelt
	$(element).remove();
	//fjern bestilling fra listene
	ovn.pop();
}

function putPizzaIVenteliste (bestilling) {
	/*Tar siste pizza bestilling og putter den in i ovn med
	minst kø
	*/
	//easter egg - for those who are worthy
	if (bestilling.kommentar == "you shall not pass") {
		bestillinger[bestillinger.length-1] = "";
		alert ("YOU HAVE PROVEN YOURSELF WORTHY");
		window.open('https://www.youtube.com/watch?v=2rCP4CRRO7E', 'newwindow', 'width=1000', 'height=1000');
 		
 		return true;
	};

	//put pizzaen i venteliste med minst kø
	if (ovn1.length <= ovn2.length) {
        // spesifisere ovn
        var ovn = ovn1;
        // DOM element
        var table = "#table1";
        var table_last_tr = "#table1 tr:last";

	}
	else {
		// spesifisere ovn
        var ovn = ovn2;
        // DOM element
        var table = "#table2";
        var table_last_tr = "#table2 tr:last";
	}
    //regne ut når pizzaen er feridg
    tidFerdig(ovn, bestilling);

    //legg til pizzaen i ovn 1 køen
    ovn[ovn.length] = bestilling;

    // print ut bestillingen
    visBestilling(bestilling, table_last_tr)
};

function startTimer (ovnTimer) {
    
    // return false hvis klokken allerede går eller hvis det ikke  er noen pizza i ovn
    var ovn = (ovnTimer == "#timer1" ? ovn1 : ovn2);
    if ($(ovnTimer).text() != "00:00" || ovn.length == 0) {
        return false;
    }
    var start = new Date().getTime(),
    elapsed = '0.0';

    // kjør hvert sekund
    var timer = window.setInterval(function()
    {
        var time = new Date().getTime() - start;

        elapsed = Math.floor(time / 100) / 10;
        if(Math.round(elapsed) == elapsed) { elapsed -= '.0'; }
        
        // regne ut min og sek
        var min = Math.floor((steketid - elapsed) / 60);
        var sek = Math.floor((steketid - elapsed) - min * 60);
        
        // legge til ekstra 0
        if (min <10 && min.toString().length < 2) min = "0" + min; 
        if (sek <10 && sek.toString().length < 3) sek = "0" + sek; 
        
        // print
        $(ovnTimer).text (min + ":" + sek);
        
        // sjekke om pizzaen er ferdig
        if (min < 1 && sek < 1) {
            $(ovnTimer).text ("00:00");
            
            // stoppe timer
            clearInterval(timer);
            // flytte ovnen til FERDIG listen
            (ovnTimer == "#timer1" ? pizzaFerdig(1) : pizzaFerdig(2));
            return true;
        };

    }, 100);
};

function pizzaFerdig (ovn) {

	if (ovn == 1) {
		//temporary variable to keep track of bestilling
		var bestilling = ovn1[0];
        
		//fjern bestilling fra ovn1 lista
		ovn1.shift();

		//spesifiserer hvilket html element som skal fjernes - det er det tredje tr elementet
		// var element = "#table1 tr:nth-child(3)";
		fjernBestilling("#table1 tr:nth-child(3)");

	}
	else if (ovn == 2){
		//temporary variable to keep track of bestilling
		var bestilling = ovn2[0];
		//fjern bestilling fra ovn1 lista
		ovn2.shift();

		//spesifiserer hvilket html element som skal fjernes - det er det tredje tr elementet
		// var element = "#table2 tr:nth-child(3)";
		fjernBestilling("#table2 tr:nth-child(3)");
	}

	//legg bestilling til i ferdig listen
	ferdig[ferdig.length] = bestilling;

	// //fjern bestilling fra ovn visuelt
	// $(element).remove();

	//print ut bestilling
	visBestilling(bestilling, "#table3 tr:last")
	
};
/*-----------------------------------------
----------------MAIN------------------*/
$(document).ready(function() {

	//if new pizzabutton is pressed
	$("#newpizzabutton").click(function(){
		//put pizza i ovn
		putPizzaIVenteliste(bestillinger[bestillinger.length -1]);

	});
	//if timer 1 is pressed
	$("#timerB1").click(function() {
		startTimer("#timer1");
//		pizzaFerdig(1);
	});
	//if timer 2 is pressed
	$("#timerB2").click(function() {
		startTimer("#timer2");
	});
    // if FjernSisteBestilling knapp 1 blir trykket
    $("#FSB1").click(function() {
        fjernSisteBestilling('#table1 tr:last', ovn1);
    });
// if FjernSisteBestilling knapp 2 blir trykket
    $("#FSB2").click(function() {
        fjernSisteBestilling('#table2 tr:last', ovn2);
    });
});
