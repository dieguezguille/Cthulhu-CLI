///////////////// INICIALIZACION //////////////////

//Importar Vorpal
var vorpal = require('vorpal')();
//Inicializar navegación
var stackNavegación = [];
var pantallaActual;
//Inicializar las pantallas
var cargarPantalla = function (pantalla) {
    //Inicializar pantalla
    console.log('--------------------------');
    console.log('Estás actualmente en ' + '"' + pantalla.nombre + '"');
    console.log('--------------------------');
    console.log(pantalla.descripcion);
    console.log('--------------------------');
    vorpal.show();
};
//Cargar el Mapa
var zonasMapa = [{
        nombre: 'Vestíbulo del Cine',
        descripcion: 'El vestíbulo del Cine tiene dos pisos de altura. Está enmoquetado en rojo y decorado al estilo fin de siglo. Pueden verse cuatro sofás circulares, unas majestuosas escaleras que flanquean las paredes y comunican con la planta de arriba. Pueden verse dos ventanas enfrentadas, cada una con un cartel. Uno de ellos dice "Entradas" y el otro dice "Recepción". Tanto las paredes como las escaleras presentan imaginativas tallas de ninfas y sátiros...',
        items: [
            'Misterioso papel sobre un sofá',
            'Una navaja de afeitar oxidada',
            'Un libro polvoriento'
        ],
        lugares: [{
                name: 'Subir escaleras',
                value: 0,
                short: 'Subiste las escaleras'
            },
            {
                name: 'Ir a Entradas',
                value: 1,
                short: 'Fuiste a la casilla de Entradas'
            },
            {
                name: 'Ir a Recepción',
                value: 2,
                short: 'Fuiste a la casilla de Recepción'
            }
        ]
    },
    {
        nombre: 'Taquillas del Cine',
        descripcion: 'Un pequeño compartimento con una ventana con barrotes que da al exterior, donde se venden las entradas. La ventana se encuentra tapada por lo que parece un póster...',
    },
    {
        nombre: 'Recepción del Cine',
        descripcion: 'Un pequeño compartimento con una ventana con barrotes que da al exterior, donde debería encontrarse la persona encargada de entregar las entradas reservadas con antelación. La entrada parece bloqueada...',
    },
];

//Inicializar personaje
var personaje = [{
    nombre: 'FUE',
    valor: 0
}, {
    nombre: 'DES',
    valor: 0
}, {
    nombre: 'CON',
    valor: 0
}, {
    nombre: 'INT',
    valor: 0
}, {
    nombre: 'SAB',
    valor: 0
}, {
    nombre: 'CAR',
    valor: 0
}];

//Seteando cursor de la CLI
vorpal
    .delimiter('acción:')
    .show();

//////////////////////////////////////////////////////
////////////////////// COMANDOS //////////////////////
//////////////////////////////////////////////////////

//////////////// COMANDOS DE PARTIDA /////////////////

vorpal
    .command('nueva partida', 'Inicia una nueva partida')
    .action(function (args, callback) {
        nuevaPartida();
        callback();
    });

vorpal
    .command('descubrir', 'Busca objetos y lugares en la escena actual')
    .action(function (args, callback) {
        var sab = personaje[4].valor;
        descubrirObjetos(sab);
        callback();
    });

vorpal
    .command('elegir', 'Elige una opcion y navega a la pantalla seleccionada')
    .action(function (args, callback) {
        const self = this;
        return this.prompt({
            type: 'list',
            name: 'respuesta',
            choices: pantallaActual.lugares,
            message: 'Qué deseas hacer?',
        }, function (result) {
            //Navegar a la pantalla seleccionada
            var rta = result.respuesta;
            var nuevaPantalla = zonasMapa[rta];
            stackNavegación.push(nuevaPantalla);
            pantallaActual = nuevaPantalla;
            cargarPantalla(pantallaActual);
            vorpal.show();
            callback();
        });
    });

vorpal
    .command('atras', 'Regresa a la pantalla anterior')
    .action(function (args, callback) {
        if (stackNavegación[pantallaActual] > 0){
            pantallaActual = stackNavegación[pantallaActual - 1];
            cargarPantalla(pantallaActual);
        }
        callback();
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var nuevaPartida = function () {
    //Setear que la primera pantalla sea el vestibulo
    stackNavegación = [];
    stackNavegación[0] = zonasMapa[0];
    //Setear que la pantalla actual sea igual a la primera pantalla
    pantallaActual = stackNavegación[0];
    //Pedir creacion de personaje
    crearPersonaje();
    //Cargar pantalla inicial
    cargarPantalla(pantallaActual);
};

var crearPersonaje = function () {
    //Mostrar personaje
    console.log('--------------------------');
    console.log('Características de tu Personaje');
    console.log('--------------------------');
    personaje.forEach(function (caracteristica) {
        caracteristica.valor = randomNumber();
        console.log(caracteristica.nombre + ' --> ' + caracteristica.valor);
    });
};

//Generar numero aleatorio entre 1 y 100 y redondea para arriba
var randomNumber = function () {
    return Math.ceil(Math.random() * 100) + 1;
};

//Realizar la tirada con porcentaje
var tirarDados = function (porcentaje) {
    return !!porcentaje && Math.ceil(Math.random() * 100) + 1 <= porcentaje;
};

//Mostrar lugares para moverse
var mostrarLugares = function () {
    //Mostrar lugares
    pantallaActual.lugares.forEach(function (lugar) {
        console.log(lugar.name);
    });
};

//Mostrar items en la pantalla actual
var mostrarItems = function () {
    pantallaActual.items.forEach(function (item) {
        console.log(' * ' + item);
    });
};

var descubrirObjetos = function (sabiduria) {
    //Realizar la tirada con porcentaje
    var resultado = tirarDados(sabiduria);
    console.log('--------------------------');
    console.log('Tu sabiduría es de ' + sabiduria);
    console.log('   ');
    if (resultado === true) {
        console.log('La tirada fue exitosa! Encontraste lo siguiente:');
        console.log('   ');
        //Mostrar items descubiertos en la pantalla actual y opciones para moverse
        mostrarItems();
        vorpal.exec('elegir', function (err, response) {
            if (err) {
                console.log('Hubo un error');
            } else {
                return response;
            }
        });
        console.log('--------------------------');
    } else {
        console.log('Tu tirada ha fracasado... No encontraste ningún ítem');
        //Mostrar solo las opciones para moverse
        console.log('--------------------------');
        vorpal.exec('elegir', function (err, response) {
            if (err) {
                console.log('Hubo un error');
            } else {
                return response;
            }
        });
    }
    console.log('--------------------------');
};