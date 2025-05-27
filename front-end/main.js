// API Base URL
const API_BASE_URL = 'http://10.110.12.53:3001';

// Global variables
let currentMaintenanceOrder = null;
let aircraftsCache = [];

// DOM Elements
const pages = {
    dashboard: document.getElementById('dashboard-page'),
    aeronaves: document.getElementById('aeronaves-page'),
    manutencao: document.getElementById('manutencao-page'),
    pecas: document.getElementById('pecas-page'),
    certificacao: document.getElementById('certificacao-page')
};

const navLinks = document.querySelectorAll('.nav-link');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    loadAllData();
    setupForms();
    setupModal();
    setupSearch();
});

// Setup Functions
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            Object.values(pages).forEach(p => p.classList.remove('active'));
            pages[page].classList.add('active');
        });
    });
}

async function loadAllData() {
    try {
        await Promise.all([
            loadDashboardData(),
            loadAircraftsData(),
            loadMaintenanceData(),
            loadPartsData(),
            loadCertificationData()
        ]);
    } catch (error) {
        console.error("Error loading initial data:", error);
        showNotification('Erro ao carregar dados iniciais', 'error');
    }
}

function setupForms() {
    document.getElementById('aircraft-form').addEventListener('submit', handleAircraftForm);
    document.getElementById('maintenance-form').addEventListener('submit', handleMaintenanceForm);
    document.getElementById('part-form').addEventListener('submit', handlePartForm);
    document.getElementById('technician-form').addEventListener('submit', handleTechnicianForm);
}

function setupModal() {
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-maintenance').addEventListener('click', closeModal);
    document.getElementById('complete-maintenance').addEventListener('click', completeMaintenance);
}

function setupSearch() {
    document.getElementById('aircraft-search').addEventListener('input', searchAircrafts);
    document.getElementById('maintenance-search').addEventListener('input', searchMaintenance);
    document.getElementById('part-search').addEventListener('input', searchParts);
    document.getElementById('technician-search').addEventListener('input', searchTechnicians);
}

// API Functions
async function fetchAircrafts() {
    try {
        const response = await fetch(`http://10.110.12.53:3000/getAero`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        aircraftsCache = data.success ? data.data : [];
        return aircraftsCache;
    } catch (error) {
        console.error('Error fetching aircrafts:', error);
        showNotification('Erro ao carregar aeronaves', 'error');
        return [];
    }
}

async function registerAircraft(aircraftData) {
    try {
        const payload = {
            model: aircraftData.model,
            manufacturer: aircraftData.manufacturer,
            flightHours: String(aircraftData.flightHours),
            serialNumber: Number(aircraftData.serialNumber)
        };

        const response = await fetch(`http://10.110.12.53:3000/postAero`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao cadastrar aeronave');
        }
        
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error registering aircraft:', error);
        throw error;
    }
}

async function fetchAllMaintenance() {
    try {
        const response = await fetch(`http://10.110.12.53:3002/getManu`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Error fetching maintenance orders:', error);
        showNotification('Erro ao carregar ordens de manutenção', 'error');
        return [];
    }
}

async function registerMaintenance(maintenanceData) {
    try {
        const payload = {
            aircraftId: String(maintenanceData.aircraftId),
            serviceType: maintenanceData.serviceType,
            description: maintenanceData.description,
            openedAt: new Date().toISOString()
        };

        const response = await fetch(`http://10.110.12.53:3002/postManu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao cadastrar manutenção');
        }
        
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error registering maintenance:', error);
        throw error;
    }
}

// Data Loading Functions
async function loadDashboardData() {
    try {
        const [aircrafts, maintenanceOrders] = await Promise.all([
            fetchAircrafts(),
            fetchAllMaintenance()
        ]);

        document.getElementById('total-aircrafts').textContent = aircrafts.length;
        document.getElementById('total-maintenance').textContent = maintenanceOrders.length;
        document.getElementById('total-parts').textContent = parts.reduce((sum, part) => sum + part.quantity, 0);
        document.getElementById('total-technicians').textContent = technicians.length;

        updateRecentMaintenanceTable(aircrafts, maintenanceOrders);
        updatePendingAircraftsTable(aircrafts, maintenanceOrders);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Erro ao carregar dados do dashboard', 'error');
    }
}

function updateRecentMaintenanceTable(aircrafts, maintenanceOrders) {
    const recentMaintenanceBody = document.querySelector('#recent-maintenance tbody');
    recentMaintenanceBody.innerHTML = '';
    
    maintenanceOrders.slice(0, 5).forEach(order => {
        const aircraft = aircrafts.find(a => a.id === order.aircraftId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${aircraft ? aircraft.model : 'N/A'}</td>
            <td>${order.serviceType === 'preventiva' ? 'Preventiva' : 'Corretiva'}</td>
            <td>${formatDate(order.openedAt)}</td>
            <td><span class="status ${order.status === 'concluido' ? 'active' : order.status === 'andamento' ? 'pending' : 'inactive'}">
                ${order.status || 'Pendente'}
            </span></td>
            <td>Técnico</td>
        `;
        recentMaintenanceBody.appendChild(row);
    });
}

function updatePendingAircraftsTable(aircrafts, maintenanceOrders) {
    const pendingAircraftsBody = document.querySelector('#pending-aircrafts tbody');
    pendingAircraftsBody.innerHTML = '';
    
    aircrafts.forEach(aircraft => {
        const lastMaintenance = maintenanceOrders
            .filter(m => m.aircraftId === aircraft.id && m.status === 'concluido')
            .sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt))[0];
        
        const nextMaintenanceDate = lastMaintenance ? 
            new Date(new Date(lastMaintenance.openedAt).setFullYear(new Date(lastMaintenance.openedAt).getFullYear() + 1)) : 
            new Date();
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${aircraft.model}</td>
            <td>${aircraft.manufacturer}</td>
            <td>${aircraft.flightHours}</td>
            <td>${lastMaintenance ? formatDate(lastMaintenance.openedAt) : 'Nunca'}</td>
            <td>${formatDate(nextMaintenanceDate)}</td>
        `;
        pendingAircraftsBody.appendChild(row);
    });
}

async function loadAircraftsData() {
    try {
        const aircrafts = await fetchAircrafts();
        const aircraftsBody = document.querySelector('#aircrafts-table tbody');
        aircraftsBody.innerHTML = '';
        
        aircrafts.forEach(aircraft => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aircraft.model}</td>
                <td>${aircraft.manufacturer}</td>
                <td>${aircraft.serialNumber}</td>
                <td>${aircraft.flightHours}</td>
                <td><span class="status ${aircraft.status === 'ativo' ? 'active' : 'inactive'}">
                    ${aircraft.status === 'ativo' ? 'Ativo' : 'Em Manutenção'}
                </span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editAircraft('${aircraft.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAircraft('${aircraft.id}')">Excluir</button>
                </td>
            `;
            aircraftsBody.appendChild(row);
        });

        updateAircraftDropdown(aircrafts);
    } catch (error) {
        console.error('Error loading aircrafts data:', error);
        showNotification('Erro ao carregar dados de aeronaves', 'error');
    }
}

function updateAircraftDropdown(aircrafts) {
    const aircraftSelect = document.getElementById('maintenance-aircraft');
    aircraftSelect.innerHTML = '<option value="">Selecione uma aeronave</option>';
    
    aircrafts.forEach(aircraft => {
        const option = document.createElement('option');
        option.value = aircraft.id;
        option.textContent = `${aircraft.model} (${aircraft.serialNumber})`;
        aircraftSelect.appendChild(option);
    });
}

async function loadMaintenanceData() {
    try {
        const maintenanceOrders = await fetchAllMaintenance();
        const maintenanceBody = document.querySelector('#maintenance-table tbody');
        maintenanceBody.innerHTML = '';
        
        const aircrafts = await fetchAircrafts();
        
        maintenanceOrders.forEach(order => {
            const aircraft = aircrafts.find(a => a.id === order.aircraftId);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${aircraft ? aircraft.model : 'N/A'} (${order.aircraftId})</td>
                <td>${order.serviceType === 'preventiva' ? 'Preventiva' : 'Corretiva'}</td>
                <td>${formatDate(order.openedAt)}</td>
                <td>${order.description}</td>
                <td><span class="status ${order.status === 'concluido' ? 'active' : order.status === 'andamento' ? 'pending' : 'inactive'}">
                    ${order.status || 'Pendente'}
                </span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="viewMaintenanceDetails('${order.id}')">Detalhes</button>
                </td>
            `;
            maintenanceBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading maintenance data:', error);
        showNotification('Erro ao carregar dados de manutenção', 'error');
    }
}

// Form Handlers
async function handleAircraftForm(e) {
    e.preventDefault();
    
    const model = document.getElementById('aircraft-model').value;
    const manufacturer = document.getElementById('aircraft-manufacturer').value;
    const serialNumber = document.getElementById('aircraft-serial').value;
    const flightHours = document.getElementById('aircraft-hours').value;
    
    if (!model || !manufacturer || !serialNumber || !flightHours) {
        showNotification('Todos os campos são obrigatórios', 'error');
        return;
    }

    if (isNaN(serialNumber)) {
        showNotification('Número de série deve ser um valor numérico', 'error');
        return;
    }

    try {
        const success = await registerAircraft({
            model,
            manufacturer,
            flightHours,
            serialNumber
        });
        
        if (success) {
            await loadAircraftsData();
            await loadDashboardData();
            e.target.reset();
            showNotification('Aeronave cadastrada com sucesso!');
        }
    } catch (error) {
        showNotification(error.message || 'Erro ao cadastrar aeronave', 'error');
    }
}

async function handleMaintenanceForm(e) {
    e.preventDefault();
    
    const aircraftId = document.getElementById('maintenance-aircraft').value;
    const serviceType = document.getElementById('maintenance-type').value;
    const description = document.getElementById('maintenance-description').value;
    
    if (!aircraftId || !serviceType || !description) {
        showNotification('Todos os campos são obrigatórios', 'error');
        return;
    }

    try {
        const success = await registerMaintenance({
            aircraftId,
            serviceType,
            description
        });
        
        if (success) {
            await loadMaintenanceData();
            await loadDashboardData();
            e.target.reset();
            showNotification('Ordem de manutenção cadastrada com sucesso!');
        }
    } catch (error) {
        showNotification(error.message || 'Erro ao cadastrar manutenção', 'error');
    }
}

// Helper Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showNotification(message, type = 'success') {
    notification.className = `notification ${type}`;
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Make functions available globally
window.editAircraft = editAircraft;
window.deleteAircraft = deleteAircraft;
window.editPart = editPart;
window.deletePart = deletePart;
window.editTechnician = editTechnician;
window.deleteTechnician = deleteTechnician;
window.verifyANAT = verifyANAT;
window.viewMaintenanceDetails = viewMaintenanceDetails;