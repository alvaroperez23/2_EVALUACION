document.addEventListener('DOMContentLoaded', () => {

    const contenedorJuego = document.querySelector('.contenedor-juego');
    const juego = document.querySelector('.juego');
    const resultado = document.querySelector('.resultado-juego');
    const contadorBanderas = document.getElementById('num-banderas');
    const contadorBanderasRestantes = document.getElementById('banderas-restantes');
    const botonGenerar = document.querySelector('.btn-generar');
    const puntuacion = document.getElementById('puntuacion');
    const nombreUsuario = prompt("¿Cual es tu nombre?");

    botonGenerar.addEventListener('click', crearJuego);

    let tamaño = 10;
    let numBombas = 20;         // => Número de bombas. Se modifica en crearJuego().
    let numBanderas = 0;        // => Número de banderas marcadas
    let casillas = [];          // => Array con las casillas
    let finPartida = false;
    let dificultad = 1;
    let timeLeft = 0;


    function añadeNumeros() {
        for (let i = 0; i < casillas.length; i++) {
            // Nº de bombas contiguas a una casilla
            let total = 0;
            // Para evaluar los bordes
            const estaBordeIzq = (i % tamaño === 0);
            const estaBordeDech = (i % tamaño === tamaño - 1);

            if (casillas[i].classList.contains('vacio')) {
                // Checkeamos casilla anterior
                if (i > 0 && !estaBordeIzq && casillas[i - 1].classList.contains('bomba')) total++;

                // Checkeamos casilla siguiente
                if (i < (tamaño * tamaño - 1) && !estaBordeDech && casillas[i + 1].classList.contains('bomba')) total++;

                // Checkeamos casilla superior
                if (i > tamaño && casillas[i - tamaño].classList.contains('bomba')) total++;

                // Checkeamos casilla siguiente de la fila anterior
                if (i > (tamaño - 1) && !estaBordeDech && casillas[i + 1 - tamaño].classList.contains('bomba')) total++;

                // Checkeamos casilla anterior de la fila anterior
                if (i > tamaño && !estaBordeIzq && casillas[i - 1 - tamaño].classList.contains('bomba')) total++;

                // Checkeamos casilla inferior
                if (i < (tamaño * (tamaño - 1)) && casillas[i + tamaño].classList.contains('bomba')) total++;

                // Checkeamos casilla siguiente de la fila siguiente
                if (i < (tamaño * (tamaño - 1)) && !estaBordeDech && casillas[i + 1 + tamaño].classList.contains('bomba')) total++;

                // Checkeamos casilla anterior de la fila siguiente
                if (i < (tamaño * (tamaño - 1)) && !estaBordeIzq && casillas[i - 1 + tamaño].classList.contains('bomba')) total++;

                // Guardamos el nº de bombas en atributo data
                casillas[i].setAttribute('data', total);
            }
        }
    }


    function revelarCasillas(casilla) {
        const idCasilla = parseInt(casilla.id);
        const estaBordeIzq = (idCasilla % tamaño === 0);
        const estaBordeDech = (idCasilla % tamaño === tamaño - 1);

        setTimeout(() => {
            // Simulamos clik en la casilla anterior
            if (idCasilla > 0 && !estaBordeIzq) click(casillas[idCasilla - 1]);

            // Simulamos clik en la casilla siguiente
            if (idCasilla < (tamaño * tamaño - 2) && !estaBordeDech) click(casillas[idCasilla + 1]);

            // Simulamos clik en la casilla superior
            if (idCasilla >= tamaño) click(casillas[idCasilla - tamaño]);

            // Simulamos clik en la casilla siguiente de la fila anterior
            if (idCasilla > (tamaño - 1) && !estaBordeDech) click(casillas[idCasilla + 1 - tamaño]);

            // Simulamos clik en la casilla anterior de la fila anterior
            if (idCasilla > (tamaño + 1) && !estaBordeIzq) click(casillas[idCasilla - 1 - tamaño]);

            // Simulamos clik en la casilla inferior
            if (idCasilla < (tamaño * (tamaño - 1))) click(casillas[idCasilla + tamaño]);

            // Simulamos clik en la casilla siguiente de la fila siguiente
            if (idCasilla < (tamaño * tamaño - tamaño - 2) && !estaBordeDech) click(casillas[idCasilla + 1 + tamaño]);

            // Simulamos clik en la casilla anterior de la fila siguiente
            if (idCasilla < (tamaño * tamaño - tamaño) && !estaBordeIzq) click(casillas[idCasilla - 1 + tamaño]);

        }, 10);
    }



    function bomba(casillaClickeada) {
        finPartida = true;
        casillaClickeada.classList.add('back-red');

        // Desvelamos todas las bombas
        casillas.forEach((casilla, index, array) => {
            if (casilla.classList.contains('bomba')) {
                casilla.innerHTML = '💣';
                casilla.classList.remove('bomba');
                casilla.classList.add('marcada');
            }
        });

        resultado.textContent = 'Has perdido! Suerte la próxima';
    }


    /**
     * @description Añade bandera a la casilla seleccionada con el botón derecho
     * @param casilla Casilla sobre la que se hizo click con botón derecho
     */
    function añadirBandera(casilla) {
        if (finPartida) return;

        if (!casilla.classList.contains('marcada') && numBanderas < numBombas) {
            if (!casilla.classList.contains('bandera')) {
                casilla.classList.add('bandera');
                casilla.innerHTML = '🚩';
                numBanderas++;
                actualizaNumBanderas();
                compruebaPartida();
            } else {
                casilla.classList.remove('bandera');
                casilla.innerHTML = '';
                numBanderas--;
                actualizaNumBanderas();
            }
        }
    }







    /**
     * @description Comprueba si se ha ganado o no una partida
     */
    function compruebaPartida() {
        let aciertos = 0;

        for (let i = 0; i < casillas.length; i++) {
            if (casillas[i].classList.contains('bandera') && casillas[i].classList.contains('bomba'))
                aciertos++;
        }

        if (aciertos === numBombas) {
            finPartida = true;
            switch (dificultad) {
                case 1:
                    puntos = 100 * numBombas;
                    break;
                case 2:
                    puntos = 200 * numBombas;
                    break;
                case 3:
                    puntos = 300 * numBombas;
                    break;
                default:
                    puntos = 0;
            }
            puntuacion.innerHTML = "<h2>" + nombreUsuario + ", tu puntuacion es de " + puntos + "<h2>";
            resultado.textContent = 'Eres un titán! Enhorabuena!';

            var marcador = localStorage.setItem('puntuacion', puntos);
            
            // Obtener la puntuación anterior del usuario desde localStorage
            var puntuacionAnterior = localStorage.getItem('puntuacion');

            // Comprobar si la puntuación actual es mayor que la puntuación anterior
            if (puntos > puntuacionAnterior) {
                // Guardar la puntuación actual como la puntuación más alta
                localStorage.setItem('puntuacion', puntos);
            }

            // Mostrar la puntuación más alta al usuario
            var puntuacionMaxima = localStorage.getItem('puntuacion');
            document.getElementById('puntuacion-maxima').textContent = nombreUsuario + ', tu puntuación más alta es: ' + puntuacionMaxima;
        }
    }


    /**
     * @description Actualizar el contador de banderas
     */
    function actualizaNumBanderas() {
        contadorBanderas.textContent = numBanderas;
        contadorBanderasRestantes.textContent = (numBombas - numBanderas);
    }


    function click(casilla) {
        // Comprobamos si la casilla no es clickeable
        if (casilla.classList.contains('marcada') || casilla.classList.contains('bandera') || finPartida) return;

        if (casilla.classList.contains('bomba')) {
            // Casilla bomba
            bomba(casilla);
        } else {
            let total = casilla.getAttribute('data');
            if (total != 0) {
                // Casilla con bombas cerca
                casilla.classList.add('marcada');
                casilla.innerHTML = total;
                return;
            }
            casilla.classList.add('marcada');

            // Casilla sin bombas cerca
            revelarCasillas(casilla);

        }
    }


    function dobleClick(casilla) {
        // Comprobamos si la casilla no es clickeable
        if (!casilla.classList.contains('marcada') || finPartida) return;

        revelarCasillas(casilla);
    }


    function crearJuego() {
        tamaño = parseInt(document.getElementById('tamaño').value);
        numBombas = parseInt(document.getElementById('num-bombas').value);
        countdownEl = document.getElementById('countdown');
        dificultad = parseInt(document.getElementById('dificultad').value);

        dificultad = parseInt(document.getElementById('dificultad').value);


        
        if (dificultad === 1) { timeLeft = 300; }
        if (dificultad === 2) { timeLeft = 250; }
        if (dificultad === 3) { timeLeft = 200; }


        function cuentaAtras() {
            const minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;

            // Agrega un 0 antes del número si es menor a 10
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }

            // Actualiza el contenido del elemento del contador
            countdownEl.innerHTML = `${minutes}:${seconds}`;

            // Si se acaba el tiempo, detén el contador
            if (timeLeft <= 0) {
                countdownEl.innerHTML = '<h3>Se acabo el tiempo! Suerte la próxima<h3>';
                const casillaAleatoria = Math.floor(Math.random() * casillas.length);
                revelarCasillas(casillas[casillaAleatoria]);
                click(casillas[casillaAleatoria]);
                click(casillas[casillaAleatoria]);
            } else {
                // Resta un segundo al tiempo restante
                timeLeft--;

                // Actualiza el contador después de 1 segundo
                setTimeout(cuentaAtras, 1000);
            }
        }




        // Comprobamos que se cumplen los requisitos de creacion del juego
        if (tamaño < 5 || tamaño > 20) {
            alert(`El tamaño no puede ser menor de 5 ni mayor de 20`);
            return;
        }
        if (numBombas < 1) {
            alert(`El número de bombas tiene que ser como mínimo 1`);
            return;
        }
        if (numBombas > tamaño * tamaño) {
            alert(`El número de bombas no puede ser superior al producto de \"Tamaño\" x \"Tamaño\" que en este caso es: ${tamaño * tamaño}`);
            return;
        }

        if (contenedorJuego.classList.contains('hidden')) {
            // Esto hace que al hacer click en "Empezar" se quite el atributo hidden para que se vea el tablero
            contenedorJuego.classList.remove('hidden');
        } else {
            // Si no tiene clase 'hidden' es porque estamos generando un nuevo juego 
            // borramos el anterior y reiniciamos valores
            juego.innerHTML = "";
            resultado.innerHTML = "";
            resultado.className = "resultado-juego";
            casillas = [];
            finPartida = false;
            numBanderas = 0;
        }

        // Para que el juego se vea con las casillas en orden, les damos estructuras con rem
        juego.style.width = (tamaño * 4) + 'rem';
        resultado.style.width = (tamaño * 4) + 'rem';

        // Creamos un matriz con bombas aleatorias
        const arrayBombas = Array(numBombas).fill('bomba');
        const arrayVacios = Array(tamaño * tamaño - numBombas).fill('vacio');
        const arrayCompleto = arrayVacios.concat(arrayBombas);
        arrayCompleto.sort(() => Math.random() - 0.5);

        for (let i = 0; i < tamaño * tamaño; i++) {
            const casilla = document.createElement('div');
            casilla.setAttribute('id', i);
            casilla.classList.add(arrayCompleto[i]);
            juego.appendChild(casilla);
            casillas.push(casilla);

            // Añadimos función al hacer click
            casilla.addEventListener('click', () => {
                click(event.target);
            });

            // Añadimos función al hacer click derecho
            casilla.oncontextmenu = function (event) {
                event.preventDefault();
                añadirBandera(casilla);
            }

            // Añadimos función al hacer doble-click
            casilla.addEventListener('dblclick', () => {
                dobleClick(event.target);
            });
        }

        añadeNumeros();
        actualizaNumBanderas();
        cuentaAtras();
    }
});