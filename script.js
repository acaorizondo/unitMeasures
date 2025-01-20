// Datos de las unidades de medida organizadas por tipo
const unitData = {
    Weight: ["KG", "LBS", "OZ", "GR", "MG"],
    Volume: ["L", "ML", "OZ", "GL", "QT"],
    Units: ["EA"],
    PackType: ["CS", "PK", "BG", "TN", "BT"]
};

// Referencias
const unitSelector = document.getElementById("unitSelector");
const unitSelectorSecondary = document.getElementById("unitSelectorSecondary");
const unitSelectorTertiary = document.getElementById("unitSelectorTertiary");
const extraControls = document.getElementById("extra-controls");
const nestedControls = document.getElementById("nested-controls");

// Función para generar las opciones del select
function populateUnitSelector(selector, data, excludePackType = false) {
    for (const [type, units] of Object.entries(data)) {
        // Si `excludePackType` es true, saltamos las unidades de tipo PackType
        if (excludePackType && type === "PackType") {
            continue;
        }

        const group = document.createElement("optgroup");
        group.label = type;

        units.forEach(unit => {
            const option = document.createElement("option");
            option.value = unit; // Solo la unidad será el valor
            option.textContent = `${type} - ${unit}`; // Mostrar el tipo y la unidad en el desplegable
            group.appendChild(option);
        });

        selector.appendChild(group);
    }
}

function updateSelectorValue(selector) {
    const selectedOption = selector.options[selector.selectedIndex];
    const selectedUnit = selectedOption.value; // Solo la unidad
    selectedOption.textContent = selectedUnit; // Mostrar solo la unidad en el selector
}

// En el evento de cambio para cada selector
unitSelector.addEventListener("change", function () {
    const selectedUnit = this.value;
    updateSelectorValue(this); // Actualizar el texto visible
    if (unitData.PackType.includes(selectedUnit)) {
        extraControls.classList.remove("hidden");
    } else {
        extraControls.classList.add("hidden");
        document.getElementById("quantityInput").value = "";
        unitSelectorSecondary.selectedIndex = 0;
		
		// También ocultar los nested controls y resetear sus valores
        nestedControls.classList.add("hidden");
        document.getElementById("nestedQuantityInput").value = ""; // Resetear cantidad anidada
        unitSelectorTertiary.selectedIndex = 0; // Resetear tercer selector
    }
});

unitSelectorSecondary.addEventListener("change", function () {
    const selectedUnit = this.value;
    updateSelectorValue(this); // Actualizar el texto visible
    if (unitData.PackType.includes(selectedUnit)) {
        nestedControls.classList.remove("hidden");
    } else {
        nestedControls.classList.add("hidden");
        document.getElementById("nestedQuantityInput").value = "";
        unitSelectorTertiary.selectedIndex = 0;
    }
});

unitSelectorTertiary.addEventListener("change", function () {
    updateSelectorValue(this); // Actualizar el texto visible
});


// Llenar los selectores
populateUnitSelector(unitSelector, unitData); // Incluye todo
populateUnitSelector(unitSelectorSecondary, unitData); // Incluye todo
populateUnitSelector(unitSelectorTertiary, unitData, true); // Excluye PackType


// Referencia al span donde se mostrará la cadena concatenada
const unitMeasureValue = document.getElementById("unitMeasureValue");

// Función para actualizar la cadena concatenada
function updateUnitMeasure() {
    // Obtener los valores actuales de los controles visibles
    const primaryUnit = unitSelector.value || "";
    const quantity1 = document.getElementById("quantityInput").value || "";
    const secondaryUnit = unitSelectorSecondary.value || "";
    const quantity2 = document.getElementById("nestedQuantityInput").value || "";
    const tertiaryUnit = document.getElementById("unitSelectorTertiary").value || "";

    // Concatenar los valores en el orden correcto
    const concatenatedValue = [primaryUnit, quantity1, secondaryUnit, quantity2, tertiaryUnit]
        .filter(value => value) // Filtrar valores vacíos
        .join(""); // Concatenar con espacio

    // Actualizar el texto del span
    unitMeasureValue.textContent = concatenatedValue || "N/A";
}

// Actualizar la cadena cuando cambian los controles
unitSelector.addEventListener("change", updateUnitMeasure);
document.getElementById("quantityInput").addEventListener("input", updateUnitMeasure);
unitSelectorSecondary.addEventListener("change", updateUnitMeasure);
document.getElementById("nestedQuantityInput").addEventListener("input", updateUnitMeasure);
document.getElementById("unitSelectorTertiary").addEventListener("change", updateUnitMeasure);

// Referencias a los campos y al botón Accept
const acceptButton = document.getElementById("acceptButton");
const quantityInput = document.getElementById("quantityInput");
const nestedQuantityInput = document.getElementById("nestedQuantityInput");

// Función para verificar si todos los campos están llenos
function validateFields() {
    const isUnitSelected = unitSelector.value !== ""; // Primer selector
    const isQuantityFilled = quantityInput.value.trim() !== ""; // Primer campo de cantidad
    const isSecondaryUnitSelected = unitSelectorSecondary.value !== ""; // Segundo selector
    const isNestedQuantityFilled = nestedQuantityInput.value.trim() !== ""; // Segundo campo de cantidad
    const isTertiaryUnitSelected = unitSelectorTertiary.value !== ""; // Tercer selector

    // Verificar si los controles secundarios están visibles
    const areExtraControlsVisible = !extraControls.classList.contains("hidden");
    const areNestedControlsVisible = !nestedControls.classList.contains("hidden");

    // Condición para habilitar el botón Accept
    if (
        isUnitSelected &&
        (!areExtraControlsVisible || (isQuantityFilled && isSecondaryUnitSelected)) &&
        (!areNestedControlsVisible || (isNestedQuantityFilled && isTertiaryUnitSelected))
    ) {
        acceptButton.disabled = false;
    } else {
        acceptButton.disabled = true;
    }
}

// Eventos para validar los campos en tiempo real
unitSelector.addEventListener("change", validateFields);
quantityInput.addEventListener("input", validateFields);
unitSelectorSecondary.addEventListener("change", validateFields);
nestedQuantityInput.addEventListener("input", validateFields);
unitSelectorTertiary.addEventListener("change", validateFields);


// clear --------------------------------------------------------------------
// Referencia al botón Clear
const clearButton = document.getElementById("clearButton");

// Función para limpiar los controles
function clearForm() {
    // Resetear el primer selector
    unitSelector.selectedIndex = 0;

    // Limpiar el input de cantidad
    quantityInput.value = "";

    // Resetear el selector secundario
    unitSelectorSecondary.selectedIndex = 0;

    // Limpiar el input anidado de cantidad
    nestedQuantityInput.value = "";

    // Resetear el selector terciario
    unitSelectorTertiary.selectedIndex = 0;

    // Ocultar los controles adicionales
    extraControls.classList.add("hidden");
    nestedControls.classList.add("hidden");

    // Restablecer la etiqueta de la cadena a "N/A"
    unitMeasureValue.textContent = "N/A";

    // Deshabilitar el botón Accept
    acceptButton.disabled = true;
}

// Agregar evento al botón Clear
clearButton.addEventListener("click", clearForm);


