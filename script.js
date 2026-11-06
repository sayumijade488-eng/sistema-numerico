// ============================================
// CONVERSOR DE SISTEMAS NUMÉRICOS
// Casos 1-4: bases 2 a 10 | Caso 5: hexadecimal (2 a 16)
// ============================================

const DIGITOS = "0123456789ABCDEF";
let casoSeleccionado = 0;

function validarEntero(numero, base) {
    if (numero.length === 0) return false;
    for (let caracter of numero.toUpperCase()) {
        let valor = DIGITOS.indexOf(caracter);
        if (valor === -1 || valor >= base) return false;
    }
    return true;
}

function mostrarCaso(numero) {
    casoSeleccionado = numero;
    document.getElementById("menu").classList.remove("activa");
    document.getElementById("caso").classList.add("activa");

    let numeroCaso = document.getElementById("numeroCaso");
    let tituloCaso = document.getElementById("tituloCaso");
    let descripcionCaso = document.getElementById("descripcionCaso");
    let formulario = document.getElementById("formulario");
    let resultado = document.getElementById("resultado");

    numeroCaso.textContent = "0" + numero;
    resultado.style.display = "none";
    resultado.innerHTML = "";

    if (numero === 1) {
        tituloCaso.textContent = "Descomposición";
        descripcionCaso.textContent = "Descompón un número utilizando potencias de 10.";
        formulario.innerHTML = `
            <div class="grupo"><label for="numero">Número</label>
            <input type="text" id="numero" inputmode="decimal" placeholder="Ejemplo: 273 o 987.6"></div>`;
    } else if (numero === 2) {
        tituloCaso.textContent = "Base N → Decimal";
        descripcionCaso.textContent = "Convierte un número de otra base al sistema decimal.";
        formulario.innerHTML = `
            <div class="grupo"><label for="numero">Número</label>
            <input type="text" id="numero" placeholder="Ejemplo: 101101"></div>
            <div class="grupo"><label for="base">Base de origen</label>
            <input type="number" id="base" min="2" max="10" inputmode="numeric" placeholder="Ejemplo: 2"></div>`;
    } else if (numero === 3) {
        tituloCaso.textContent = "Decimal → Base N";
        descripcionCaso.textContent = "Convierte un número decimal a otra base mediante divisiones sucesivas.";
        formulario.innerHTML = `
            <div class="grupo"><label for="decimal">Número decimal</label>
            <input type="number" id="decimal" min="0" step="1" inputmode="numeric" placeholder="Ejemplo: 45"></div>
            <div class="grupo"><label for="base">Base destino</label>
            <input type="number" id="base" min="2" max="10" inputmode="numeric" placeholder="Ejemplo: 2"></div>`;
    } else if (numero === 4) {
        tituloCaso.textContent = "Base N → Base M";
        descripcionCaso.textContent = "Convierte un número desde una base de origen hacia otra base.";
        formulario.innerHTML = `
            <div class="grupo"><label for="numero">Número</label>
            <input type="text" id="numero" placeholder="Ejemplo: 243"></div>
            <div class="grupo"><label for="baseOrigen">Base de origen</label>
            <input type="number" id="baseOrigen" min="2" max="10" inputmode="numeric" placeholder="Ejemplo: 8"></div>
            <div class="grupo"><label for="baseDestino">Base de destino</label>
            <input type="number" id="baseDestino" min="2" max="10" inputmode="numeric" placeholder="Ejemplo: 2"></div>`;
    } else if (numero === 5) {
        tituloCaso.textContent = "Hexadecimal ↔ Base N";
        descripcionCaso.textContent = "Convierte desde o hacia hexadecimal (base 16). Una de las dos bases debe ser 16. Usa letras A-F para los valores 10 al 15.";
        formulario.innerHTML = `
            <div class="grupo"><label for="numero">Número</label>
            <input type="text" id="numero" autocapitalize="characters" placeholder="Ejemplo: 2F, 1A3 o 255"></div>
            <div class="grupo"><label for="baseOrigen">Base de origen</label>
            <input type="number" id="baseOrigen" min="2" max="16" inputmode="numeric" placeholder="Ejemplo: 16"></div>
            <div class="grupo"><label for="baseDestino">Base de destino</label>
            <input type="number" id="baseDestino" min="2" max="16" inputmode="numeric" placeholder="Ejemplo: 10"></div>`;
    }
}

function volverMenu() {
    document.getElementById("caso").classList.remove("activa");
    document.getElementById("menu").classList.add("activa");
}

function mostrarError(mensaje) {
    let resultado = document.getElementById("resultado");
    resultado.style.display = "block";
    resultado.innerHTML = `<h3>⚠️ Error</h3><p>${mensaje}</p>`;
}

function aDecimal(numero, base) {
    let decimal = 0;
    let pasos = [];
    let longitud = numero.length;
    for (let i = 0; i < longitud; i++) {
        let caracter = numero[i];
        let digito = DIGITOS.indexOf(caracter);
        let posicion = longitud - 1 - i;
        let valor = digito * (base ** posicion);
        let etiqueta = digito > 9 ? `${caracter}(${digito})` : `${digito}`;
        pasos.push(`${etiqueta} × ${base}^${posicion} = ${valor}`);
        decimal += valor;
    }
    return { decimal, pasos };
}

function deDecimal(decimal, base) {
    let numeroActual = decimal;
    let residuos = [];
    let pasos = [];
    if (numeroActual === 0) return { pasos: [], resultado: "0" };

    while (numeroActual > 0) {
        let cociente = Math.floor(numeroActual / base);
        let residuo = numeroActual % base;
        let etiqueta = residuo > 9 ? `${residuo} (${DIGITOS[residuo]})` : `${residuo}`;
        pasos.push(`${numeroActual} ÷ ${base} = ${cociente}   Residuo = ${etiqueta}`);
        residuos.push(DIGITOS[residuo]);
        numeroActual = cociente;
    }
    return { pasos, resultado: residuos.reverse().join("") };
}

function htmlPasos(pasos) {
    return pasos.map(paso => `<div class="paso">${paso}</div>`).join("");
}

function calcular() {
    let resultado = document.getElementById("resultado");

    if (casoSeleccionado === 1) {
        let numero = document.getElementById("numero").value.trim();
        if (numero === "") { mostrarError("Ingrese un número."); return; }

        let partes = numero.split(".");
        if (partes.length > 2 || partes[0] === "" || !/^[0-9]*$/.test(partes[0]) ||
            (partes.length === 2 && !/^[0-9]*$/.test(partes[1]))) {
            mostrarError("El número decimal no es válido."); return;
        }

        let parteEntera = partes[0];
        let parteDecimal = partes.length === 2 ? partes[1] : "";
        let pasos = [];
        let suma = 0;
        let posicion = parteEntera.length - 1;

        for (let caracter of parteEntera) {
            let digito = Number(caracter);
            let valor = digito * (10 ** posicion);
            pasos.push(`${digito} × 10^${posicion} = ${valor}`);
            suma += valor;
            posicion--;
        }
        posicion = -1;
        for (let caracter of parteDecimal) {
            let digito = Number(caracter);
            let valor = digito * (10 ** posicion);
            pasos.push(`${digito} × 10^${posicion} = ${valor}`);
            suma += valor;
            posicion--;
        }

        resultado.style.display = "block";
        resultado.innerHTML = `<h3>📐 Descomposición</h3>${htmlPasos(pasos)}
            <div class="suma">Suma = ${Number(suma.toFixed(10))}</div>`;
    } else if (casoSeleccionado === 2) {
        let numero = document.getElementById("numero").value.trim().toUpperCase();
        let base = Number(document.getElementById("base").value);
        if (numero === "" || !base) { mostrarError("Complete todos los campos."); return; }
        if (base < 2 || base > 10 || !Number.isInteger(base)) { mostrarError("La base debe estar entre 2 y 10."); return; }
        if (!validarEntero(numero, base)) { mostrarError(`El número no es válido para la base ${base}.`); return; }

        let conversion = aDecimal(numero, base);
        resultado.style.display = "block";
        resultado.innerHTML = `<h3>📐 Descomposición</h3>${htmlPasos(conversion.pasos)}
            <div class="suma">Suma = ${conversion.decimal}</div>
            <div class="resultado-final">${numero}₍${base}₎ = ${conversion.decimal}₍10₎</div>`;
    } else if (casoSeleccionado === 3) {
        let textoDecimal = document.getElementById("decimal").value;
        let decimal = Number(textoDecimal);
        let base = Number(document.getElementById("base").value);
        if (textoDecimal === "" || !base) { mostrarError("Complete todos los campos."); return; }
        if (!Number.isSafeInteger(decimal)) { mostrarError("Ingrese un número entero válido."); return; }
        if (decimal < 0) { mostrarError("Ingrese un número decimal positivo."); return; }
        if (base < 2 || base > 10 || !Number.isInteger(base)) { mostrarError("La base debe estar entre 2 y 10."); return; }
        if (decimal === 0) {
            resultado.style.display = "block";
            resultado.innerHTML = `<h3>🔢 Divisiones sucesivas</h3><div class="resultado-final">0₍10₎ = 0₍${base}₎</div>`;
            return;
        }
        let division = deDecimal(decimal, base);
        resultado.style.display = "block";
        resultado.innerHTML = `<h3>➗ Divisiones sucesivas</h3>${htmlPasos(division.pasos)}
            <div class="suma">Residuos de abajo hacia arriba: ${division.resultado}</div>
            <div class="resultado-final">${decimal}₍10₎ = ${division.resultado}₍${base}₎</div>`;
    } else if (casoSeleccionado === 4 || casoSeleccionado === 5) {
        let esHex = casoSeleccionado === 5;
        let baseMax = esHex ? 16 : 10;
        let numero = document.getElementById("numero").value.trim().toUpperCase();
        let baseOrigen = Number(document.getElementById("baseOrigen").value);
        let baseDestino = Number(document.getElementById("baseDestino").value);

        if (numero === "" || !baseOrigen || !baseDestino) { mostrarError("Complete todos los campos."); return; }
        if (!Number.isInteger(baseOrigen) || !Number.isInteger(baseDestino) ||
            baseOrigen < 2 || baseOrigen > baseMax || baseDestino < 2 || baseDestino > baseMax) {
            mostrarError(`Las bases deben estar entre 2 y ${baseMax}.`); return;
        }
        if (esHex && baseOrigen !== 16 && baseDestino !== 16) {
            mostrarError("En este caso una de las dos bases debe ser 16 (hexadecimal)."); return;
        }
        if (!validarEntero(numero, baseOrigen)) {
            mostrarError("El número no es válido para la base de origen." +
                (baseOrigen > 10 ? " Use dígitos 0-9 y letras A-F." : "")); return;
        }

        let conversion = aDecimal(numero, baseOrigen);
        let division = deDecimal(conversion.decimal, baseDestino);
        resultado.style.display = "block";
        resultado.innerHTML = `<h3>📐 Parte 1 · Conversión a decimal</h3>${htmlPasos(conversion.pasos)}
            <div class="suma">Suma = ${conversion.decimal}</div>
            <h3 style="margin-top:30px">➗ Parte 2 · Divisiones sucesivas</h3>
            ${division.pasos.length > 0 ? htmlPasos(division.pasos) : `<div class="paso">El número es 0, no hay divisiones.</div>`}
            <div class="suma">Residuos de abajo hacia arriba: ${division.resultado}</div>
            <div class="resultado-final">${numero}₍${baseOrigen}₎ = ${division.resultado}₍${baseDestino}₎</div>`;
    }
}
