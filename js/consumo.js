document.addEventListener("DOMContentLoaded", function() {
    // Modo claro/oscuro
    let savedMode = localStorage.getItem("mode");
    if (savedMode === "dark") {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
    } else {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
    }

    // Manejo del botón de toggle para el menú lateral
    document.getElementById("toggle-btn").addEventListener("click", function() {
        let sidebar = document.getElementById("menu");
        sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
    });

    // Manejo del botón de cambio de modo claro/oscuro
    document.getElementById("mode-toggle").addEventListener("click", function() {
        let body = document.body;
        body.classList.toggle("dark-mode");
        body.classList.toggle("light-mode");
        let mode = body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("mode", mode);
    });

    // Manejo de la carga del archivo CSV
    const cargarCSV = document.getElementById("cargar-csv");
    const csvStatus = document.getElementById("csv-status");

    // Mostrar el input de carga de archivo CSV al hacer click en "Añadir CSV"
    document.getElementById('btn-aniadir-csv').addEventListener('click', function() {
        cargarCSV.click();  // Abrir el selector de archivos
    });

    // Cuando el archivo es seleccionado
    cargarCSV.addEventListener("change", handleCSVUpload);

    // Función para manejar la carga del CSV
    function handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Mostrar que estamos procesando el CSV
        csvStatus.textContent = "Cargando archivo CSV...";

        const reader = new FileReader();
        reader.onload = function(e) {
            const csvContent = e.target.result;

            // Convertir el CSV en una matriz 2D usando PapaParse
            Papa.parse(csvContent, {
                header: true, // Si el archivo tiene una fila de encabezado
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: function(results) {
                    console.log(results); // Muestra los resultados procesados

                    // Mostrar mensaje de éxito y número de filas procesadas
                    csvStatus.textContent = `CSV cargado correctamente. Registros procesados: ${results.data.length}`;
                    
                    // Llamar a la función para actualizar los gráficos con los datos del CSV
                    updateChartsFromCSV(results.data);
                },
                error: function(error) {
                    csvStatus.textContent = "Hubo un error al cargar el CSV.";
                    console.error(error.message);
                }
            });
        };
        reader.readAsText(file); // Lee el archivo como texto
    }

    // Función para actualizar los gráficos a partir de los datos del CSV
    function updateChartsFromCSV(data) {
        const labels = data.map(row => row.fecha); // Suponiendo que 'fecha' es una columna en el CSV
        const electricityData = data.map(row => row.electricidad); // Suponiendo que 'electricidad' es una columna en el CSV
        const waterData = data.map(row => row.agua); // Suponiendo que 'agua' es una columna en el CSV

        // Actualizar los gráficos
        renderBarChart("grafico-electricidad", "Electricidad", "#f39c12", electricityData, labels);
        renderBarChart("grafico-agua", "Agua", "#3498db", waterData, labels);
    }

    // Función para renderizar el gráfico de barras
    function renderBarChart(id, label, color, data, labels) {
        const ctx = document.getElementById(id).getContext("2d");

        // Verifica si el gráfico ya existe antes de destruirlo
        if (window[id] instanceof Chart) {
            window[id].destroy(); // Destruye el gráfico anterior si existe
        }

        // Crea un nuevo gráfico
        window[id] = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: color,
                    borderColor: "#ffffff",
                    borderWidth: 1.5,
                    borderRadius: 8,
                    hoverBackgroundColor: "#2c3e50",
                    hoverBorderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(200, 200, 200, 0.2)" }
                    },
                    x: {
                        grid: { color: "rgba(200, 200, 200, 0.2)" }
                    }
                }
            }
        });
    }

    // Configuración de la calculadora y otros elementos
    setupEventListeners();
    generatePredictions("proximoAnio");
    renderCharts("anio");
});

function setupEventListeners() {
    // Verificar si el elemento existe antes de añadir el event listener
    const periodoPrediccion = document.getElementById("periodo-prediccion");
    if (periodoPrediccion) {
        periodoPrediccion.addEventListener("change", toggleCustomDates);
    }

    const botonCalcular = document.getElementById("boton-calcular");
    if (botonCalcular) {
        botonCalcular.addEventListener("click", () => {
            generatePredictions(document.getElementById("periodo-prediccion").value);
            renderCharts(); 
        });
    }

    const exportarPDF = document.getElementById("exportar-pdf");
    if (exportarPDF) {
        exportarPDF.addEventListener("click", exportToPDF);
    }
}

function toggleCustomDates() {
    document.getElementById("contenedor-periodo-personalizado").style.display = this.value === "personalizado" ? "block" : "none";
}

function generatePredictions(period) {
    const factor = { proximoAnio: 1, proximoCurso: 0.75, personalizado: getCustomRatio() }[period] || 1;
    updateResults("electricidad", factor * getRandom(900, 1100), getRandom(-5, 5));
    updateResults("agua", factor * getRandom(5000, 9000), getRandom(-8, 8));
    updateResults("oficina", factor * getRandom(150, 250), getRandom(-3, 7));
    updateResults("limpieza", factor * getRandom(80, 200), getRandom(-4, 6));
}

function getCustomRatio() {
    const start = new Date(document.getElementById("fecha-inicio").value);
    const end = new Date(document.getElementById("fecha-fin").value);
    return isNaN(start) || isNaN(end) ? 1 : (end - start) / (365 * 24 * 60 * 60 * 1000);
}

function updateResults(type, value, change) {
    document.getElementById(`prediccion-${type}`).textContent = value.toFixed(2);
}

function renderCharts(period) {
    const periods = {
        "mes": ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
        "trimestre": ["Mes 1", "Mes 2", "Mes 3"],
        "anio": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        "curso": ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun"]
    };
    const labels = periods[period] || periods["anio"];
    
    // Valores aleatorios para cada periodo (Electricidad y Agua)
    const electricityData = labels.map(() => getRandom(900, 1100)); 
    const waterData = labels.map(() => getRandom(5000, 9000));

    // Renderizamos los gráficos de barras para electricidad y agua
    renderBarChart("grafico-electricidad", "Electricidad", "#f39c12", electricityData, labels); 
    renderBarChart("grafico-agua", "Agua", "#3498db", waterData, labels); 
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function exportToPDF() {
    alert("Función para exportar a PDF no implementada");
}
