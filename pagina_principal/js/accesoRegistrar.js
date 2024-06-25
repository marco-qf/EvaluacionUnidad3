document.getElementById('FormularioRegistrar').addEventListener('submit', function(event) {
    // Obtener los valores de los campos del formulario
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var correo = document.getElementById('correo').value;
    var direccion = document.getElementById('direccion').value;
    var cursos = document.getElementById('cursos').value;
    var clave = document.getElementById('clave').value;
    var rol = document.getElementById('rol').value;

    // Expresiones regulares para validación
    var nameRegex = /^[a-zA-Z\s]+$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var direccionRegex = /^[a-zA-Z0-9\s]+$/;
    var claveRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    // Validación del nombre (solo letras y espacios)
    if (!nameRegex.test(nombre)) {
        alert('El nombre solo puede contener letras y espacios');
        event.preventDefault(); // Evita el envío del formulario
        return;
    }

    // Validación del apellido (solo letras y espacios)
    if (!nameRegex.test(apellido)) {
        alert('El apellido solo puede contener letras y espacios');
        event.preventDefault();
        return;
    }

    // Validación del correo electrónico
    if (!emailRegex.test(correo)) {
        alert('Por favor, introduce un correo electrónico válido');
        event.preventDefault();
        return;
    }

    // Validación de la dirección (alfanumérica y permite espacios)
    if (!direccionRegex.test(direccion)) {
        alert('La dirección solo puede contener caracteres alfanuméricos y espacios');
        event.preventDefault();
        return;
    }

    // Validación del curso seleccionado
    if (cursos === "") {
        alert('Por favor, selecciona un curso');
        event.preventDefault();
        return;
    }

    // Validación de la clave (mínimo 8 caracteres, una mayúscula, una minúscula y un número)
    if (!claveRegex.test(clave)) {
        alert('La clave debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número');
        event.preventDefault();
        return;
    }

    // Validación del rol seleccionado
    if (rol === "") {
        alert('Por favor, selecciona un rol');
        event.preventDefault();
        return;
    }

    // Si todas las validaciones pasan, el formulario se enviará
});
