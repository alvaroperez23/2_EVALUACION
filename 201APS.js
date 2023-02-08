function dias() {
    const semana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
    let contador = 0;
    for (let i=0; i<semana.length; i++){
        const x = document.getElementById(semana[i]).checked;
        if(x == true){
            contador++
        }
    }

    document.getElementById("confirmacion").setAttribute("value", contador);

    const confirmacion = document.getElementById("confirmacion");
    if (!confirmacion.checkValidity()) {
        alert(confirmacion.validationMessage);
    } else {
        alert("Todo OK")
    }
}