(function () {
    var imagenPrincipal = document.getElementById("imagen");
    var spanTitle = document.getElementById("titulo");
    var spanGenre = document.getElementById("genero");
    var spanActors = document.getElementById("actores");
    var spanPlot = document.getElementById("sinopsis");
    var spanRating = document.getElementById("nota");
    var informacionP = document.getElementById("serieD");
    var principal = document.getElementById("principal");
    var episodios = document.getElementById("episodios");
    var episodioConcreto = document.getElementById("episodioConcreto");
    var serie = document.getElementById("serie");
    var seasonE = document.getElementById("seasonE");
    var episodeE = document.getElementById("episodeE");
    var tituloE = document.getElementById("tituloE");
    var runtime = document.getElementById("runtime");
    var sinopsisE = document.getElementById("sinopsisE");
    var notaE = document.getElementById("notaE");
    var imagenCapitulo = document.getElementById("imagenCapitulo");
    var imagenC = document.getElementById("imagenC");
    var div = document.getElementById("temporadas");

    var noEncontrado = document.getElementById("noEncontrado");
    var volver = document.getElementById("volver");
    volver.addEventListener('click', volverPrincipal);

    var noDisponible = document.getElementById("noDisponible");
    var volverSerie = document.getElementById("volverSerie");
    volverSerie.addEventListener('click', volverS);

    var noEpisodio = document.getElementById("noEpisodio");
    var volverTemporada = document.getElementById("volverTemporada");
    volverTemporada.addEventListener('click', volverSeason);

    var bt = document.getElementById("btSearch");
    bt.addEventListener('click', search);

    window.addEventListener('keypress', function (e) {
        if (e.keyCode === 13) {
            search();
        }
    });

    var i = 1;
    var temporada;

    function search() {
        var titulo = document.getElementById("title");
        var ajax = new Ajax();
        var datotitulo = encodeURI(titulo.value);
        ajax.setUrl("http://www.omdbapi.com/?type=series&plot=full&t=" + datotitulo);
        ajax.setRespuesta(searchResponse);
        ajax.doPeticion();
    }
    function searchResponse(respuesta) {
        serie.setAttribute('class', 'flexible');
        div.setAttribute('class', 'flexible');
        ocultar(principal);
        borrarHijos(div);
        borrarHijos(episodios);
        ocultar(episodioConcreto);
        ocultar(imagenCapitulo);
        ocultar(noEncontrado);
        ocultar(noDisponible);
        ocultar(noEpisodio);
        visualizar(imagenPrincipal);
        imagenPrincipal.setAttribute('alt', respuesta.Title);
        if (respuesta.Response !== "False") {
            visualizar(informacionP);
            var year = respuesta.Year;
            var year1 = year.substr(0, 4);
            var year2;
            if (year.length > 6) {
                year2 = year.substr(5, 4);
            } else {
                var date = new Date();
                year2 = date.getFullYear();
            }
            var yearT = year2 - year1;
            imagenPrincipal.setAttribute("src", respuesta.Poster);
            spanTitle.textContent = respuesta.Title;
            spanGenre.textContent = respuesta.Genre;
            spanActors.textContent = respuesta.Actors;
            spanPlot.textContent = respuesta.Plot;
            spanRating.textContent = respuesta.imdbRating;
            for (var i = 0; i < yearT; i++) {
                var j = i + 1;
                var a = document.createElement("a");
                a.textContent = "Season " + j;
                a.setAttribute("href", "#");
                div.appendChild(a);
            }
            var enlaces = div.getElementsByTagName("a");
            for (var x = 0; x < enlaces.length; x++) {
                enlaces[x].addEventListener('click', function (e) {
                    e.preventDefault();
                    var longitud = this.textContent.length;
                    if (longitud === 8) {
                        temporada = this.textContent.substr(7, 1);
                    } else {
                        temporada = this.textContent.substr(7, 2);
                    }
                    var ajax = new Ajax();
                    ajax.setUrl("http://www.omdbapi.com/?type=series&plot=full&t=" + respuesta.Title + "&season=" + temporada);
                    ajax.setRespuesta(showSeason);
                    ajax.doPeticion();
                });
            }
            function showSeason(respuesta) {
                borrarHijos(episodios);
                ocultar(episodioConcreto);
                ocultar(imagenCapitulo);
                ocultar(informacionP);
                if (respuesta.Response !== "False") {
                    visualizar(episodios);
                    visualizar(imagenPrincipal);
                    var numEpisodios = respuesta.Episodes.length + 1;
                    for (var i = 0; i < numEpisodios; i++) {
                        var j = i + 1;
                        var li = document.createElement("li");
                        li.textContent = "Episode " + j;
                        li.setAttribute("href", "#");
                        episodios.appendChild(li);
                        var br = document.createElement("br");
                        li.appendChild(br);
                    }
                    var enlacesli = document.getElementsByTagName("li");
                    for (var x = 0; x < enlacesli.length; x++) {
                        enlacesli[x].addEventListener('click', function (e) {
                            e.preventDefault();
                            var longitud = this.textContent.length;
                            var epi;
                            if (longitud === 9) {
                                epi = this.textContent.substr(8, 1);
                            } else {
                                epi = this.textContent.substr(8, 2);
                            }
                            var ajax = new Ajax();
                            ajax.setUrl("http://www.omdbapi.com/?type=series&t=" + respuesta.Title + "&plot=full&season=" + temporada + "&episode=" + epi);
                            ajax.setRespuesta(showEpisode);
                            ajax.doPeticion();
                        });
                    }
                    function showEpisode(respuesta) {
                        ocultar(episodios);
                        if (respuesta.Response !== "False") {
                            visualizar(episodioConcreto);
                            seasonE.textContent = respuesta.Season;
                            episodeE.textContent = respuesta.Episode;
                            tituloE.textContent = respuesta.Title;
                            runtime.textContent = respuesta.Runtime;
                            sinopsisE.textContent = respuesta.Plot;
                            notaE.textContent = respuesta.imdbRating;
                            ocultar(imagenPrincipal);
                            visualizar(imagenCapitulo);
                            imagenCapitulo.setAttribute('alt', respuesta.Title);
                            imagenC.setAttribute("src", respuesta.Poster);

                        } else {
                            visualizar(noEpisodio);
                            ocultar(episodios);
                            ocultar(imagenPrincipal);
                            div.setAttribute('class', 'desaparecido');
                        }
                    }
                } else {
                    visualizar(noDisponible);
                    ocultar(imagenPrincipal);
                    div.setAttribute('class', 'desaparecido');
                }
            }
        } else {
            visualizar(noEncontrado);
            ocultar(imagenPrincipal);
            ocultar(informacionP);
        }
    }
    function volverPrincipal(e) {
        e.preventDefault();
        ocultar(noEncontrado);
        visualizar(principal);
    }
    function volverS(e) {
        e.preventDefault();
        ocultar(noDisponible);
        visualizar(informacionP);
        visualizar(imagenPrincipal);
        visualizar(div);
    }
    function volverSeason(e) {
        e.preventDefault(e);
        ocultar(noEpisodio);
        visualizar(episodios);
        visualizar(imagenPrincipal);
        visualizar(div);
    }
})();

function borrarHijos(etiqueta) {
    if (etiqueta.hasChildNodes())
    {
        while (etiqueta.childNodes.length >= 1)
        {
            etiqueta.removeChild(etiqueta.firstChild);
        }
    }
}
function ocultar(etiqueta) {
    etiqueta.setAttribute('class', 'oculto');
}
function visualizar(etiqueta) {
    etiqueta.setAttribute('class', 'visible');
}
