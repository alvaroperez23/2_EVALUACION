//En primer lugar, comprobaremos si el navegador soporta Storage y mostraremos un mensaje con el nombre del usuario si este se ha logueado en la pagina, diferenciando si es su primera visita o ya ha entrado en más ocasiones.
//Utilizaremos una funcion para llevar el control de las veces que el usuario ha accedido a la pagina. Crearemos dos funciones para incrementar y decrementar el valor del contador anterior.
//Finalmente crearemos otra funcion para hacer logout y restablecer los valores anteriores

// Comprobamos si el navegador soporta Storage
if (typeof(Storage) !== "undefined") {
    // Obtenemos el nombre del usuario almacenado en el Storage
    var userName = localStorage.getItem("userName");
    // Comprobamos si el usuario ya se ha logueado anteriormente
    if (userName === null) {
        // Es la primera visita del usuario
        userName = prompt("Por favor ingresa tu nombre:");
        localStorage.setItem("userName", userName);
        alert("Bienvenido " + userName + ", es tu primera visita en nuestra página.");
    } else {
        // El usuario ya ha visitado la página anteriormente
        alert("Bienvenido de nuevo " + userName + "!");
    }
} else {
    // El navegador no soporta Storage
    alert("Lo siento, tu navegador no soporta almacenamiento local. Por favor actualiza a una versión más reciente.");
}