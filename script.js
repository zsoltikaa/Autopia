let isAscending = true; 

document.addEventListener("DOMContentLoaded", () => {
    loadCarData();
    setupEventListeners();
});

function setupEventListeners() {
    const filters = document.querySelectorAll("#carBrand, #carModel, #kmFrom, #kmTo, #priceFrom, #priceTo, #carTransmission, #carFuel, #carType, #performanceFrom, #performanceTo, #yearFrom, #yearTo");

    filters.forEach(filter => {
        filter.addEventListener("change", function(){
            applyFilters();
            checkFiltersState();
        });
    });

    let sortButton = document.getElementById('sortPriceButton');
    sortButton.addEventListener('click', function(){
        sortCarsByPrice(sortButton);
    });

    document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

let carsData = [];

function loadCarData() {
    const xhr = new XMLHttpRequest();
    const url = 'json/cars.json';

    xhr.open("GET", url, true);

    xhr.onload = function() {
        if (xhr.status == 200) {
            carsData = JSON.parse(xhr.responseText); 

            const firstFour = carsData.slice(0, 4);

            const rest = carsData.slice(4).sort(function() {
                return 0.5 - Math.random();
            });
            
            const shuffledCarsData = firstFour.concat(rest);
            
            populateDropdowns(shuffledCarsData);
            renderCars(shuffledCarsData);
        } else {
            console.error("AJAX hiba: ", xhr.statusText);
        }
    };
    xhr.send();
}


function populateDropdowns(cars) {
    const brandSelect = document.getElementById("carBrand");
    const typeSelect = document.getElementById("carType");

    const brands = [...new Set(cars.map(car => car.brand))].sort(); 
    const types = [...new Set(cars.map(car => car.type))];

    brands.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });

    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = capitalizeFirstLetter(type);
        typeSelect.appendChild(option);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleFilters() {
    const filterMenu = document.querySelector(".filterMenu");
    filterMenu.style.display = filterMenu.style.display === "block" ? "none" : "block";
}

function applyFilters() {
    const filteredCars = filterCars(carsData);
    renderCars(filteredCars);
}

function filterCars(cars) {
    const brand = document.getElementById("carBrand")?.value || "Any";
    const model = document.getElementById("carModel")?.value.toLowerCase() || "";
    const type = document.getElementById("carType")?.value || "Any";
    const kmFrom = parseInt(document.getElementById("kmFrom")?.value) || 0;
    const kmTo = parseInt(document.getElementById("kmTo")?.value) || Infinity;
    const yearFrom = parseInt(document.getElementById("yearFrom")?.value) || 0;
    const yearTo = parseInt(document.getElementById("yearTo")?.value) || Infinity;
    const priceFrom = parseInt(document.getElementById("priceFrom")?.value) || 0;
    const priceTo = parseInt(document.getElementById("priceTo")?.value) || Infinity;
    const transmission = document.getElementById("carTransmission")?.value || "Any";
    const fuel = document.getElementById("carFuel")?.value || "Any";
    const performanceFrom = parseInt(document.getElementById("performanceFrom")?.value) || 0;
    const performanceTo = parseInt(document.getElementById("performanceTo")?.value) || Infinity;

    return cars.filter(car => {
        return (brand === "Any" || car.brand === brand) &&
            (model === "" || includesEveryChar(car.model.toLowerCase(), model.split(''))) &&
            (type === "Any" || car.type === type) &&
            (car.km >= kmFrom && car.km <= kmTo) &&
            (car.year >= yearFrom && car.year <= yearTo) &&
            (car.price >= priceFrom && car.price <= priceTo) &&
            (transmission === "Any" || car.transmission === transmission) &&
            (fuel === "Any" || car.fuel === fuel) &&
            (car.performance >= performanceFrom && car.performance <= performanceTo);
    });
}

function includesEveryChar(string, charArray){
    let charSet = new Set(charArray);

    if(charSet.size == 0){
        return true;
    }

    for(let char of charSet){
        if(!string.includes(char)){
            return false;
        }
    }

    return true;
}

function renderCars(cars, currentPage = 1, carsPerPage = 10) {
    const carContainer = document.querySelector(".container-fluid");
    const startIndex = (currentPage - 1) * carsPerPage;
    const endIndex = Math.min(startIndex + carsPerPage, cars.length);
    const currentCars = cars.slice(startIndex, endIndex);

    carContainer.innerHTML = "";

    currentCars.forEach(function(data) {
        const row = `
        <div class="row carRow animate-fadeIn">
            <div class="col-12 col-lg-3">
                <img src="${data.url}" alt="" class="car-img">
            </div>
            <div class="col-12 col-lg-3 d-flex flex-column justify-content-center align-items-center">
                <p class="title">${data.brand} ${data.model} ${data.variant}</p>
                <p>Year: ${data.year}</p>
                <p>Type: ${data.type}</p>
                <p>Condition: ${data.condition}</p>
            </div>
            <div class="col-12 col-lg-3 d-flex flex-column justify-content-center align-items-center">
                <p>Performance: ${data.performance} HP</p>
                <p>Engine Capacity: ${data.capacity} cc</p>
                <p>Transmission: ${data.transmission}</p>
                <p>Fuel Type: ${data.fuel}</p>
            </div>
            <div class="col-12 col-lg-3 d-flex flex-column justify-content-center align-items-center">
                <p>Mileage: ${data.km} km</p>
                <p>Valid Hungarian License: ${data.documents ? "yes" : "no"}</p>
                <p>Contact: ${data.contact}</p>
                <p class="text-glow">Price: ${formatter.format(data.price)}</p>
            </div>
        </div>
        `;
        carContainer.innerHTML += row;
    });

    updatePagination(cars.length, currentPage, carsPerPage);
}

function updatePagination(totalCars, currentPage, carsPerPage) {
    let maxDisplayedPages = window.innerWidth <= 991 ? 3 : 6;
    const totalPages = Math.ceil(totalCars / carsPerPage);
    const paginationContainer = document.querySelector(".pagination");

    if(totalPages <= 1){
        paginationContainer.style.display = "none";
        return;
    } else{
        paginationContainer.style.display = "flex";
    }

    paginationContainer.innerHTML = "";

    paginationContainer.innerHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;" tabindex="-1" aria-disabled="true">Prev</a>
        </li>
    `;

    const startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    const endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.innerHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    paginationContainer.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Next</a>
        </li>
    `;

    if (currentPage >= totalPages - Math.floor(maxDisplayedPages / 2)) {
        maxDisplayedPages++;
    }
}

function changePage(pageNumber) {
    history.pushState({ page: pageNumber }, `Page ${pageNumber}`, `?page=${pageNumber}`);
    const filteredCars = filterCars(carsData);
    renderCars(filteredCars, pageNumber);
    window.scrollTo(0, 0); 
}

window.addEventListener('popstate', function(event) {
    const pageNumber = event.state ? event.state.page : 1;
    changePage(pageNumber);
});

function sortCarsByPrice(sortButton) {
    const filteredCars = filterCars(carsData);
    if (isAscending) {
        filteredCars.sort((a, b) => a.price - b.price);
        sortButton.innerHTML = "Sort by price (low to high)";
    } else {
        filteredCars.sort((a, b) => b.price - a.price);
        sortButton.innerHTML = "Sort by price (high to low)";
    }
    renderCars(filteredCars);
    isAscending = !isAscending;
    document.getElementById('resetFilters').disabled = false;
}

function resetFilters() {
    if (document.getElementById('resetFilters').disabled) {
        return;
    }
    document.getElementById("carBrand").value = "Any";
    document.getElementById("carModel").value = "";
    document.getElementById("carType").value = "Any";
    document.getElementById("kmFrom").value = "";
    document.getElementById("kmTo").value = "";
    document.getElementById("yearFrom").value = "";
    document.getElementById("yearTo").value = "";
    document.getElementById("priceFrom").value = "";
    document.getElementById("priceTo").value = "";
    document.getElementById("carTransmission").value = "Any";
    document.getElementById("carFuel").value = "Any";
    document.getElementById("performanceFrom").value = "";
    document.getElementById("performanceTo").value = "";
    document.getElementById("sortPriceButton").innerHTML = "Sort by price";
    applyFilters();
    checkFiltersState();
}

function checkFiltersState() {
    const filters = [
        document.getElementById("carBrand").value !== "Any",
        document.getElementById("carModel").value !== "",
        document.getElementById("carType").value !== "Any",
        document.getElementById("kmFrom").value !== "",
        document.getElementById("kmTo").value !== "",
        document.getElementById("yearFrom").value !== "",
        document.getElementById("yearTo").value !== "",
        document.getElementById("priceFrom").value !== "",
        document.getElementById("priceTo").value !== "",
        document.getElementById("carTransmission").value !== "Any",
        document.getElementById("carFuel").value !== "Any",
        document.getElementById("performanceFrom").value !== "",
        document.getElementById("performanceTo").value !== ""
    ];

    const isAnyFilterApplied = filters.some(Boolean);
    document.getElementById('resetFilters').disabled = !isAnyFilterApplied;
}


const formatter = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
});

window.onscroll = function() {scrollFunction()};

document.getElementById("floatButton").addEventListener("click", function(){
    backToTop();
});

function scrollFunction() {
    var floatButton = document.getElementById("floatButton");
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        floatButton.classList.add("show");
    } else {
        floatButton.classList.remove("show");
    }
}

function backToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

checkFiltersState();