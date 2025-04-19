
// ====== DATA MANAGEMENT ======
// Initialize local storage with default data structure
function initializeLocalStorage() {
    if (!localStorage.getItem('dropdeckData')) {
        const defaultData = {
            projects: projectsData,
            joinedProjects: [],
            tasks: [],
            transactions: [],
            news: newsData,
            settings: {
                theme: 'light-mode'
            }
        };
        localStorage.setItem('dropdeckData', JSON.stringify(defaultData));
    }
    
    // Check if we need to reset tasks (at midnight)
    const lastResetDate = localStorage.getItem('tasksLastReset');
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
        const data = JSON.parse(localStorage.getItem('dropdeckData'));
        data.tasks.forEach(task => {
            task.completed = false;
        });
        localStorage.setItem('dropdeckData', JSON.stringify(data));
        localStorage.setItem('tasksLastReset', today);
    }
}

// Get data from localStorage
function getLocalData() {
    return JSON.parse(localStorage.getItem('dropdeckData'));
}

// Save data to localStorage
function saveLocalData(data) {
    localStorage.setItem('dropdeckData', JSON.stringify(data));
}

// ====== NAVIGATION ======
// Handle tab navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('#bottom-nav .nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Hide all tab contents
            tabContents.forEach(tabContent => {
                tabContent.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            item.classList.add('active');
            
            // Show corresponding tab content
            const tabId = item.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Handle profile icon click
    document.getElementById('profile-icon').addEventListener('click', () => {
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        
        document.getElementById('profile').classList.add('active');
    });
    
    // Handle explore link in dashboard
    document.querySelector('.explore-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        
        document.querySelector('[data-tab="explore"]').classList.add('active');
        document.getElementById('explore').classList.add('active');
    });
}

// ====== THEME TOGGLE ======
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.material-symbols-rounded');
    const data = getLocalData();
    
    // Set initial theme
    document.body.className = data.settings.theme;
    themeIcon.textContent = data.settings.theme === 'light-mode' ? 'dark_mode' : 'light_mode';
    
    themeToggle.addEventListener('click', () => {
        const data = getLocalData();
        const newTheme = data.settings.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
        
        document.body.className = newTheme;
        themeIcon.textContent = newTheme === 'light-mode' ? 'dark_mode' : 'light_mode';
        
        data.settings.theme = newTheme;
        saveLocalData(data);
    });
}

// ====== DASHBOARD ======
function updateDashboardStats() {
    const data = getLocalData();
    
    document.getElementById('total-investment').textContent = formatCurrency(calculateTotalInvestment(data.transactions));
    document.getElementById('total-earnings').textContent = formatCurrency(calculateTotalEarnings(data.transactions));
    document.getElementById('joined-projects').textContent = data.joinedProjects.length;
    document.getElementById('total-projects').textContent = data.projects.length;
    
    const completedTasks = data.tasks.filter(task => task.completed).length;
    const totalTasks = data.tasks.length;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('total-tasks').textContent = totalTasks;
}

function renderMyProjects() {
    const myProjectsContainer = document.getElementById('my-projects');
    const data = getLocalData();
    
    // Clear container
    myProjectsContainer.innerHTML = '';
    
    if (data.joinedProjects.length === 0) {
        // Show empty state
        myProjectsContainer.innerHTML = `
            <div class="empty-state">
                <span class="material-symbols-rounded">rocket_launch</span>
                <p>No projects joined yet</p>
                <a href="#" class="explore-link">Explore projects</a>
            </div>
        `;
        return;
    }
    
    data.joinedProjects.forEach(projectId => {
        const project = data.projects.find(p => p.id === projectId);
        if (project) {
            const projectTasks = data.tasks.filter(task => task.projectId === projectId);
            const completedTasks = projectTasks.filter(task => task.completed).length;
            
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card';
            projectElement.innerHTML = `
                <div class="project-logo">
                    <span class="material-symbols-rounded">${project.icon || 'rocket_launch'}</span>
                </div>
                <div class="project-info">
                    <div class="project-name">${project.name}</div>
                    <div class="project-stats">
                        Tasks: ${completedTasks}/${projectTasks.length}
                    </div>
                </div>
                <span class="project-tag">Joined</span>
            `;
            myProjectsContainer.appendChild(projectElement);
        }
    });
    
    // Reattach event listener for explore link
    document.querySelector('.explore-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        
        document.querySelectorAll('#bottom-nav .nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-content').forEach(tabContent => {
            tabContent.classList.remove('active');
        });
        
        document.querySelector('[data-tab="explore"]').classList.add('active');
        document.getElementById('explore').classList.add('active');
    });
}

function renderNewsPreview() {
    const newsPreviewContainer = document.getElementById('news-preview');
    const data = getLocalData();
    
    // Clear container
    newsPreviewContainer.innerHTML = '';
    
    // Show only the first 5 news items
    const previewNews = data.news.slice(0, 5);
    
    previewNews.forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-card';
        newsElement.innerHTML = `
            <div class="news-card-img">
                <img src="${newsItem.image || 'https://via.placeholder.com/300x150?text=Crypto+News'}" alt="${newsItem.title}">
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">${newsItem.title}</h3>
                <p class="news-card-description">${newsItem.description}</p>
                <div class="news-tags">
                    ${newsItem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Add click event to open news detail
        newsElement.addEventListener('click', () => {
            showNewsDetail(newsItem);
        });
        
        newsPreviewContainer.appendChild(newsElement);
    });
}

function setupDashboardToggles() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Here you would toggle between hot and all projects
            // For now, just a basic toggle with no functionality change
        });
    });
}

// ====== INVESTMENT & EARNINGS ======
function calculateTotalInvestment(transactions) {
    return transactions
        .filter(t => t.type === 'investment')
        .reduce((sum, t) => sum + t.amount, 0);
}

function calculateTotalEarnings(transactions) {
    return transactions
        .filter(t => t.type === 'earning')
        .reduce((sum, t) => sum + t.amount, 0);
}

function calculateROI(transactions) {
    const totalInvestment = calculateTotalInvestment(transactions);
    const totalEarnings = calculateTotalEarnings(transactions);
    
    if (totalInvestment === 0) return 0;
    
    return (totalEarnings / totalInvestment) * 100;
}

function calculateMonthlyEarnings(transactions) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'earning' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function updateInvestmentStats() {
    const data = getLocalData();
    
    document.getElementById('roi-value').textContent = formatPercentage(calculateROI(data.transactions));
    document.getElementById('monthly-earnings').textContent = formatCurrency(calculateMonthlyEarnings(data.transactions));
    
    renderEarningsChart();
}

function renderTransactionHistory() {
    const historyContainer = document.getElementById('transaction-history');
    const data = getLocalData();
    
    // Clear container
    historyContainer.innerHTML = '';
    
    if (data.transactions.length === 0) {
        // Show empty state
        historyContainer.innerHTML = `
            <div class="empty-state">
                <span class="material-symbols-rounded">history</span>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...data.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedTransactions.forEach(transaction => {
        const project = data.projects.find(p => p.id === transaction.projectId);
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        transactionElement.innerHTML = `
            <div class="transaction-details">
                <div class="transaction-project">${project ? project.name : 'Unknown Project'}</div>
                <div class="transaction-date">${formatDate(transaction.date)}</div>
            </div>
            <div class="transaction-amount ${transaction.type}">${formatCurrency(transaction.amount)}</div>
            <button class="delete-transaction" data-id="${transaction.id}">
                <span class="material-symbols-rounded">delete</span>
            </button>
        `;
        historyContainer.appendChild(transactionElement);
    });
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-transaction').forEach(btn => {
        btn.addEventListener('click', () => {
            const transactionId = btn.getAttribute('data-id');
            deleteTransaction(transactionId);
        });
    });
}

function deleteTransaction(transactionId) {
    const data = getLocalData();
    
    data.transactions = data.transactions.filter(t => t.id !== transactionId);
    
    saveLocalData(data);
    updateInvestmentStats();
    renderTransactionHistory();
    updateDashboardStats();
}

function setupInvestmentModal() {
    const addInvestmentBtn = document.getElementById('add-investment');
    const modal = document.getElementById('investment-modal');
    const closeModal = modal.querySelector('.close-modal');
    const form = document.getElementById('investment-form');
    const projectSelect = document.getElementById('investment-project');
    
    // Populate project select
    populateProjectSelect(projectSelect);
    
    // Set default date to today
    document.getElementById('investment-date').valueAsDate = new Date();
    
    // Open modal
    addInvestmentBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        form.reset();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            form.reset();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const projectId = projectSelect.value;
        const amount = parseFloat(document.getElementById('investment-amount').value);
        const date = document.getElementById('investment-date').value;
        const notes = document.getElementById('investment-notes').value;
        
        addTransaction('investment', projectId, amount, date, notes);
        
        modal.classList.remove('active');
        form.reset();
    });
}

function setupEarningModal() {
    const addEarningBtn = document.getElementById('add-earning');
    const modal = document.getElementById('earning-modal');
    const closeModal = modal.querySelector('.close-modal');
    const form = document.getElementById('earning-form');
    const projectSelect = document.getElementById('earning-project');
    
    // Populate project select
    populateProjectSelect(projectSelect);
    
    // Set default date to today
    document.getElementById('earning-date').valueAsDate = new Date();
    
    // Open modal
    addEarningBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        form.reset();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            form.reset();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const projectId = projectSelect.value;
        const amount = parseFloat(document.getElementById('earning-amount').value);
        const date = document.getElementById('earning-date').value;
        const notes = document.getElementById('earning-notes').value;
        
        addTransaction('earning', projectId, amount, date, notes);
        
        modal.classList.remove('active');
        form.reset();
    });
}

function addTransaction(type, projectId, amount, date, notes) {
    const data = getLocalData();
    
    const transaction = {
        id: generateId(),
        type,
        projectId,
        amount,
        date,
        notes,
        timestamp: new Date().toISOString()
    };
    
    data.transactions.push(transaction);
    
    saveLocalData(data);
    updateInvestmentStats();
    renderTransactionHistory();
    updateDashboardStats();
}

function populateProjectSelect(selectElement) {
    const data = getLocalData();
    
    // Clear existing options
    selectElement.innerHTML = '<option value="">Select a project</option>';
    
    // Add joined projects first
    if (data.joinedProjects.length > 0) {
        const joinedProjectsGroup = document.createElement('optgroup');
        joinedProjectsGroup.label = 'My Projects';
        
        data.joinedProjects.forEach(projectId => {
            const project = data.projects.find(p => p.id === projectId);
            if (project) {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                joinedProjectsGroup.appendChild(option);
            }
        });
        
        selectElement.appendChild(joinedProjectsGroup);
    }
    
    // Add all other projects
    const otherProjectsGroup = document.createElement('optgroup');
    otherProjectsGroup.label = 'All Projects';
    
    data.projects.forEach(project => {
        if (!data.joinedProjects.includes(project.id)) {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            otherProjectsGroup.appendChild(option);
        }
    });
    
    selectElement.appendChild(otherProjectsGroup);
}

function renderEarningsChart() {
    // In a real app, you would use a chart library here
    // For this exercise, we'll create a simple bar chart with HTML/CSS
    const chartContainer = document.getElementById('earnings-chart');
    chartContainer.innerHTML = '<div class="chart-placeholder">Chart would be rendered here using real data</div>';
    
    // Style the placeholder
    const placeholder = chartContainer.querySelector('.chart-placeholder');
    placeholder.style.height = '200px';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.backgroundColor = 'var(--surface-2)';
    placeholder.style.borderRadius = 'var(--border-radius-sm)';
    placeholder.style.color = 'var(--gray-dark)';
}

// ====== EXPLORE ======
function renderExploreProjects() {
    const projectsGrid = document.getElementById('explore-projects');
    const data = getLocalData();
    
    // Clear container
    projectsGrid.innerHTML = '';
    
    data.projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-box';
        projectElement.innerHTML = `
            <div class="project-box-logo">
                <span class="material-symbols-rounded">${project.icon || 'rocket_launch'}</span>
            </div>
            <div class="project-box-name">${project.name}</div>
            <div class="project-box-description">${project.shortDescription || 'Crypto project'}</div>
        `;
        
        // Add click event to show project details
        projectElement.addEventListener('click', () => {
            showProjectDetails(project.id);
        });
        
        projectsGrid.appendChild(projectElement);
    });
}

function showProjectDetails(projectId) {
    const modal = document.getElementById('project-details-modal');
    const modalContent = document.getElementById('project-details-content');
    const data = getLocalData();
    const project = data.projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    // Check if project is joined
    const isJoined = data.joinedProjects.includes(projectId);
    
    modalContent.innerHTML = `
        <div class="project-details-header">
            <div class="project-details-logo">
                <span class="material-symbols-rounded">${project.icon || 'rocket_launch'}</span>
            </div>
            <h3 class="project-details-name">${project.name}</h3>
            <p class="project-details-description">${project.shortDescription || 'Crypto project'}</p>
        </div>
        <div class="project-details-content">
            <div class="project-details-info">
                <div class="project-details-row">
                    <div class="project-details-label">TGE (Token Generation Event)</div>
                    <div>${project.tge || 'N/A'}</div>
                </div>
                <div class="project-details-row">
                    <div class="project-details-label">Funding</div>
                    <div>${project.funding ? formatCurrency(project.funding) : 'N/A'}</div>
                </div>
                <div class="project-details-row">
                    <div class="project-details-label">Reward</div>
                    <div>${project.reward || 'N/A'}</div>
                </div>
                <div class="project-details-row">
                    <div class="project-details-label">Type</div>
                    <div>${project.type || 'N/A'}</div>
                </div>
            </div>
            
            <div class="project-details-row">
                <div class="project-details-label">Description</div>
            </div>
            <p>${project.description || 'No description available.'}</p>
            
            <div class="project-social-links">
                ${project.twitter ? `<a href="${project.twitter}" class="social-link" target="_blank"><span class="material-symbols-rounded">tag</span></a>` : ''}
                ${project.website ? `<a href="${project.website}" class="social-link" target="_blank"><span class="material-symbols-rounded">language</span></a>` : ''}
                ${project.discord ? `<a href="${project.discord}" class="social-link" target="_blank"><span class="material-symbols-rounded">forum</span></a>` : ''}
            </div>
            
            <div class="project-buttons">
                <button class="button" id="favorite-project">
                    <span class="material-symbols-rounded">favorite</span>
                </button>
                <button class="button" id="join-project" ${isJoined ? 'disabled' : ''}>
                    <span class="material-symbols-rounded">${isJoined ? 'check' : 'add'}</span>
                    ${isJoined ? 'Joined' : 'Join'}
                </button>
                ${project.joinUrl ? `<a href="${project.joinUrl}" class="button" target="_blank">Visit</a>` : ''}
            </div>
        </div>
    `;
    
    // Add event listener to join button
    const joinButton = modalContent.querySelector('#join-project');
    if (joinButton && !isJoined) {
        joinButton.addEventListener('click', () => {
            joinProject(projectId);
            joinButton.innerHTML = '<span class="material-symbols-rounded">check</span> Joined';
            joinButton.disabled = true;
        });
    }
    
    // Add event listener to back button
    modal.querySelector('.back-button').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Show modal
    modal.classList.add('active');
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function joinProject(projectId) {
    const data = getLocalData();
    
    if (!data.joinedProjects.includes(projectId)) {
        data.joinedProjects.push(projectId);
        
        // Add default tasks for the project
        const project = data.projects.find(p => p.id === projectId);
        if (project) {
            // Add a default task
            const task = {
                id: generateId(),
                projectId,
                name: `Complete ${project.name} registration`,
                description: 'Sign up and complete the initial registration process',
                completed: false
            };
            
            data.tasks.push(task);
        }
        
        saveLocalData(data);
        renderMyProjects();
        renderTasks();
        updateDashboardStats();
    }
}

// ====== STATISTICS ======
function renderStatistics() {
    renderPerformanceChart();
    renderTaskCompletionChart();
    renderProjectLeaderboard();
}

function renderPerformanceChart() {
    // In a real app, you would use a chart library here
    const chartContainer = document.getElementById('monthly-performance-chart');
    chartContainer.innerHTML = '<div class="chart-placeholder">Performance chart would be rendered here using real data</div>';
    
    // Style the placeholder
    const placeholder = chartContainer.querySelector('.chart-placeholder');
    placeholder.style.height = '200px';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.backgroundColor = 'var(--surface-2)';
    placeholder.style.borderRadius = 'var(--border-radius-sm)';
    placeholder.style.color = 'var(--gray-dark)';
}

function renderTaskCompletionChart() {
    // In a real app, you would use a chart library here
    const chartContainer = document.getElementById('task-completion-chart');
    chartContainer.innerHTML = '<div class="chart-placeholder">Task completion chart would be rendered here using real data</div>';
    
    // Style the placeholder
    const placeholder = chartContainer.querySelector('.chart-placeholder');
    placeholder.style.height = '200px';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.backgroundColor = 'var(--surface-2)';
    placeholder.style.borderRadius = 'var(--border-radius-sm)';
    placeholder.style.color = 'var(--gray-dark)';
}

function renderProjectLeaderboard() {
    const leaderboardContainer = document.getElementById('project-leaderboard');
    const data = getLocalData();
    
    // Clear container
    leaderboardContainer.innerHTML = '';
    
    // Sort projects by funding (higher first)
    const sortedProjects = [...data.projects]
        .filter(p => p.funding)
        .sort((a, b) => b.funding - a.funding)
        .slice(0, 10); // Top 10 projects
    
    if (sortedProjects.length === 0) {
        leaderboardContainer.innerHTML = '<div class="empty-state">No project funding data available</div>';
        return;
    }
    
    // Calculate max funding for progress bar
    const maxFunding = sortedProjects[0].funding;
    
    sortedProjects.forEach((project, index) => {
        const projectElement = document.createElement('div');
        projectElement.className = 'leaderboard-item';
        
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        
        projectElement.innerHTML = `
            <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
            <div class="leaderboard-project-logo">
                <span class="material-symbols-rounded">${project.icon || 'rocket_launch'}</span>
            </div>
            <div class="leaderboard-project-info">
                <div class="leaderboard-project-name">${project.name}</div>
                <div class="leaderboard-project-funding">${formatCurrency(project.funding)}</div>
            </div>
            <div class="leaderboard-progress">
                <div class="leaderboard-progress-bar" style="width: ${(project.funding / maxFunding) * 100}%"></div>
            </div>
        `;
        
        leaderboardContainer.appendChild(projectElement);
    });
}

// ====== TASKS ======
function renderTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    const data = getLocalData();
    
    // Clear container
    tasksContainer.innerHTML = '';
    
    if (data.joinedProjects.length === 0) {
        // Show empty state
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <span class="material-symbols-rounded">task_alt</span>
                <p>No tasks yet</p>
                <p>Join projects to see tasks here</p>
            </div>
        `;
        return;
    }
    
    // Group tasks by project
    const tasksByProject = {};
    data.joinedProjects.forEach(projectId => {
        const project = data.projects.find(p => p.id === projectId);
        if (project) {
            tasksByProject[projectId] = {
                project,
                tasks: data.tasks.filter(task => task.projectId === projectId)
            };
        }
    });
    
    // Render each project's tasks
    Object.values(tasksByProject).forEach(({ project, tasks }) => {
        const completedTasks = tasks.filter(task => task.completed).length;
        const projectElement = document.createElement('div');
        projectElement.className = 'project-tasks';
        projectElement.innerHTML = `
            <div class="project-tasks-header">
                <div class="project-tasks-logo">
                    <span class="material-symbols-rounded">${project.icon || 'rocket_launch'}</span>
                </div>
                <div class="project-tasks-info">
                    <div class="project-tasks-name">${project.name}</div>
                    <div class="project-tasks-progress">${completedTasks}/${tasks.length} tasks completed</div>
                </div>
                <div class="project-tasks-actions">
                    <button class="add-subtask-btn" data-project-id="${project.id}">
                        <span class="material-symbols-rounded">add_task</span>
                    </button>
                    <button class="remove-project-btn" data-project-id="${project.id}">
                        <span class="material-symbols-rounded">close</span>
                    </button>
                </div>
            </div>
            <div class="task-list" id="task-list-${project.id}">
                ${tasks.length === 0 ? '<div class="empty-state">No tasks yet</div>' : ''}
            </div>
        `;
        
        tasksContainer.appendChild(projectElement);
        
        // Render tasks for this project
        const taskListElement = projectElement.querySelector(`#task-list-${project.id}`);
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-name">${task.name}</div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                </div>
                <button class="remove-task-btn" data-task-id="${task.id}">
                    <span class="material-symbols-rounded">delete</span>
                </button>
            `;
            
            taskListElement.appendChild(taskElement);
        });
    });
    
    // Add event listeners for task checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const taskId = checkbox.getAttribute('data-task-id');
            toggleTaskCompletion(taskId, checkbox.checked);
        });
    });
    
    // Add event listeners for remove task buttons
    document.querySelectorAll('.remove-task-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const taskId = btn.getAttribute('data-task-id');
            removeTask(taskId);
        });
    });
    
    // Add event listeners for add subtask buttons
    document.querySelectorAll('.add-subtask-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showAddTaskModal(btn.getAttribute('data-project-id'));
        });
    });
    
    // Add event listeners for remove project buttons
    document.querySelectorAll('.remove-project-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeProject(btn.getAttribute('data-project-id'));
        });
    });
    
    // Update task counts and progress bar
    updateTaskCounts();
}

function toggleTaskCompletion(taskId, completed) {
    const data = getLocalData();
    
    const task = data.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = completed;
        saveLocalData(data);
        
        updateTaskCounts();
        updateDashboardStats();
    }
}

function removeTask(taskId) {
    const data = getLocalData();
    
    data.tasks = data.tasks.filter(t => t.id !== taskId);
    
    saveLocalData(data);
    renderTasks();
    updateDashboardStats();
}

function showAddTaskModal(projectId) {
    const modal = document.getElementById('add-task-modal');
    const form = document.getElementById('add-task-form');
    const projectSelect = document.getElementById('task-project');
    
    // Populate project select
    populateProjectSelect(projectSelect);
    
    // Set the selected project
    projectSelect.value = projectId;
    
    // Open modal
    modal.classList.add('active');
    
    // Close modal when clicking the close button
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        form.reset();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            form.reset();
        }
    });
    
    // Handle form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        const projectId = projectSelect.value;
        const name = document.getElementById('task-name').value;
        const description = document.getElementById('task-description').value;
        
        addTask(projectId, name, description);
        
        modal.classList.remove('active');
        form.reset();
    };
}

function addTask(projectId, name, description) {
    const data = getLocalData();
    
    const task = {
        id: generateId(),
        projectId,
        name,
        description,
        completed: false
    };
    
    data.tasks.push(task);
    
    saveLocalData(data);
    renderTasks();
    updateDashboardStats();
}

function removeProject(projectId) {
    const data = getLocalData();
    
    // Remove from joined projects
    data.joinedProjects = data.joinedProjects.filter(id => id !== projectId);
    
    // Remove tasks for this project
    data.tasks = data.tasks.filter(task => task.projectId !== projectId);
    
    saveLocalData(data);
    renderTasks();
    renderMyProjects();
    updateDashboardStats();
}

function updateTaskCounts() {
    const data = getLocalData();
    
    const completedTasks = data.tasks.filter(task => task.completed).length;
    const totalTasks = data.tasks.length;
    
    document.getElementById('completed-tasks-count').textContent = completedTasks;
    document.getElementById('total-tasks-count').textContent = totalTasks;
    
    // Update progress bar
    const progressBar = document.getElementById('tasks-progress-bar');
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = `${progressPercentage}%`;
}

// ====== NEWS ======
function renderNews() {
    const newsContainer = document.getElementById('news-container');
    const data = getLocalData();
    
    // Get active tag
    const activeTag = document.querySelector('#news-tags .tag.active').getAttribute('data-tag');
    
    // Filter news by tag
    const filteredNews = activeTag === 'all' 
        ? data.news 
        : data.news.filter(news => news.tags.includes(activeTag));
    
    // Clear container
    newsContainer.innerHTML = '';
    
    if (filteredNews.length === 0) {
        newsContainer.innerHTML = `
            <div class="empty-state">
                <span class="material-symbols-rounded">feed</span>
                <p>No news found for this category</p>
            </div>
        `;
        return;
    }
    
    filteredNews.forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.innerHTML = `
            <div class="news-item-img">
                <img src="${newsItem.image || 'https://via.placeholder.com/600x300?text=Crypto+News'}" alt="${newsItem.title}">
            </div>
            <div class="news-item-content">
                <h3 class="news-item-title">${newsItem.title}</h3>
                <p class="news-item-description">${newsItem.description}</p>
                <div class="news-item-meta">
                    <div class="news-tags">
                        ${newsItem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="news-item-date">${formatDate(newsItem.date)}</div>
                </div>
            </div>
        `;
        
        // Add click event to open news detail
        newsElement.addEventListener('click', () => {
            showNewsDetail(newsItem);
        });
        
        newsContainer.appendChild(newsElement);
    });
}

function setupNewsTags() {
    const tagElements = document.querySelectorAll('#news-tags .tag');
    
    tagElements.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            tagElements.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            tag.classList.add('active');
            
            // Re-render news with the new filter
            renderNews();
        });
    });
}

function showNewsDetail(newsItem) {
    const modal = document.getElementById('news-detail-modal');
    const modalContent = document.getElementById('news-detail-content');
    
    modalContent.innerHTML = `
        <div class="news-detail-header">
            <img class="news-detail-img" src="${newsItem.image || 'https://via.placeholder.com/1200x600?text=Crypto+News'}" alt="${newsItem.title}">
            <div class="news-detail-overlay">
                <h3 class="news-detail-title">${newsItem.title}</h3>
                <div class="news-detail-meta">
                    ${newsItem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="news-detail-date">${formatDate(newsItem.date)}</div>
            </div>
        </div>
        <div class="news-detail-content">
            <p>${newsItem.fullContent || newsItem.description}</p>
        </div>
    `;
    
    // Add event listener to back button
    modal.querySelector('.back-button').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Show modal
    modal.classList.add('active');
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// ====== UTILITY FUNCTIONS ======
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

function formatPercentage(value) {
    return `${value.toFixed(2)}%`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ====== SAMPLE DATA ======
// Default project data
const projectsData = [
    {
        id: 'blockmesh',
        name: 'Blockmesh',
        shortDescription: 'Decentralized mesh network',
        description: 'A decentralized mesh network that allows direct peer-to-peer communication.',
        icon: 'hub',
        type: 'Network',
        tge: 'Q3 2025',
        funding: 45000000,
        reward: 'Up to 5,000 BMT',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['testnet', 'network']
    },
    {
        id: 'taker',
        name: 'Taker',
        shortDescription: 'Automated market maker',
        description: 'An automated market maker with enhanced liquidity pools and reduced slippage.',
        icon: 'trending_up',
        type: 'DeFi',
        tge: 'Q2 2025',
        funding: 38000000,
        reward: 'Up to 3,000 TKR',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['defi', 'amm']
    },
    {
        id: 'bless',
        name: 'Bless',
        shortDescription: 'Ethical finance platform',
        description: 'An ethical finance platform focusing on sustainable and socially responsible investments.',
        icon: 'volunteer_activism',
        type: 'DeFi',
        tge: 'Q4 2025',
        funding: 22000000,
        reward: 'Up to 2,500 BLS',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['defi', 'ethical']
    },
    {
        id: 'cess',
        name: 'Cess',
        shortDescription: 'Decentralized storage',
        description: 'A decentralized storage solution with enhanced security and privacy features.',
        icon: 'cloud',
        type: 'Storage',
        tge: 'Q1 2025',
        funding: 35000000,
        reward: 'Up to 10,000 CSS',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['storage', 'privacy']
    },
    {
        id: 'beamable',
        name: 'Beamable',
        shortDescription: 'Gaming platform',
        description: 'A Web3 gaming platform with built-in asset management and marketplace functionality.',
        icon: 'sports_esports',
        type: 'Gaming',
        tge: 'Q3 2025',
        funding: 50000000,
        reward: 'Up to 7,500 BML',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['gaming', 'nft']
    },
    {
        id: 'pod',
        name: 'P.o.d',
        shortDescription: 'NFT platform',
        description: 'A proof-of-derivation NFT platform that enables authentic digital ownership verification.',
        icon: 'photo',
        type: 'NFT',
        tge: 'Q2 2025',
        funding: 18000000,
        reward: 'Up to 5,000 POD',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['nft', 'ownership']
    },
    {
        id: 'ofc',
        name: 'OFC',
        shortDescription: 'Open finance collective',
        description: 'A community-driven open finance collective with democratic governance.',
        icon: 'groups',
        type: 'DeFi',
        tge: 'Q4 2025',
        funding: 25000000,
        reward: 'Up to 4,000 OFC',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['defi', 'dao']
    },
    {
        id: 'newton',
        name: 'Newton',
        shortDescription: 'Physics-based consensus',
        description: 'A blockchain using physics principles for a novel consensus mechanism.',
        icon: 'science',
        type: 'Layer 1',
        tge: 'Q2 2025',
        funding: 42000000,
        reward: 'Up to 8,000 NTN',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['layer1', 'consensus']
    },
    {
        id: 'billions',
        name: 'Billions',
        shortDescription: 'Finance automation',
        description: 'Automated finance platform for institutional and retail investors.',
        icon: 'auto_awesome',
        type: 'DeFi',
        tge: 'Q3 2025',
        funding: 60000000,
        reward: 'Up to 12,000 BLN',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['defi', 'automation']
    },
    {
        id: 'monadscore',
        name: 'Monad Score',
        shortDescription: 'Reputation protocol',
        description: 'Cross-chain reputation protocol with identity verification capabilities.',
        icon: 'verified_user',
        type: 'Identity',
        tge: 'Q1 2025',
        funding: 30000000,
        reward: 'Up to 6,000 MNS',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['identity', 'reputation']
    },
    {
        id: 'malda',
        name: 'Malda [soon]',
        shortDescription: 'AI-powered analytics',
        description: 'AI-powered analytics platform for crypto markets with predictive capabilities.',
        icon: 'monitoring',
        type: 'Analytics',
        tge: 'Q4 2025',
        funding: 28000000,
        reward: 'TBA',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['ai', 'analytics']
    },
    {
        id: 'recall',
        name: 'Recall',
        shortDescription: 'Memory optimization',
        description: 'Memory optimization protocol for smart contract efficiency.',
        icon: 'memory',
        type: 'Infrastructure',
        tge: 'Q2 2025',
        funding: 32000000,
        reward: 'Up to 9,000 RCL',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['infrastructure', 'optimization']
    },
    {
        id: 'arichan',
        name: 'Ari Chan Wallet',
        shortDescription: 'Smart wallet',
        description: 'AI-assisted smart wallet with automated portfolio management.',
        icon: 'account_balance_wallet',
        type: 'Wallet',
        tge: 'Q3 2025',
        funding: 24000000,
        reward: 'Up to 3,500 ACW',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['wallet', 'ai'],
        referCode: '67ea953c38d2f'
    },
    {
        id: 'exabits',
        name: 'Exabits',
        shortDescription: 'Quantum computing',
        description: 'Quantum-resistant blockchain with advanced cryptography.',
        icon: 'widgets',
        type: 'Layer 1',
        tge: 'Q1 2025',
        funding: 55000000,
        reward: 'Up to 15,000 EXB',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['layer1', 'quantum']
    },
    {
        id: 'grass',
        name: 'Grass',
        shortDescription: 'Environmental platform',
        description: 'Carbon credit marketplace and environmental impact tracking platform.',
        icon: 'eco',
        type: 'Environmental',
        tge: 'Q2 2025',
        funding: 20000000,
        reward: 'Up to 5,000 GRS',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['environment', 'sustainability']
    },
    {
        id: 'coresky',
        name: 'Coresky',
        shortDescription: 'Cloud infrastructure',
        description: 'Decentralized cloud infrastructure for Web3 applications.',
        icon: 'cloud_queue',
        type: 'Infrastructure',
        tge: 'Q4 2025',
        funding: 48000000,
        reward: 'Up to 10,000 CSK',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['infrastructure', 'cloud']
    },
    {
        id: 'interlink',
        name: 'Interlink',
        shortDescription: 'Cross-chain protocol',
        description: 'Seamless cross-chain interaction protocol with minimal fees.',
        icon: 'link',
        type: 'Interoperability',
        tge: 'Q1 2025',
        funding: 40000000,
        reward: 'Up to 8,000 INL',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['interop', 'cross-chain']
    },
    {
        id: 'ethblockscout',
        name: 'Eth Block Scout',
        shortDescription: 'Explorer platform',
        description: 'Advanced Ethereum blockchain explorer with enhanced analytics capabilities.',
        icon: 'search',
        type: 'Explorer',
        tge: 'Q3 2025',
        funding: 15000000,
        reward: 'Up to 6,000 EBS',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['explorer', 'ethereum']
    },
    {
        id: 'haust',
        name: 'Haust',
        shortDescription: 'Security protocol',
        description: 'Multi-layer security protocol for smart contracts and dApps.',
        icon: 'security',
        type: 'Security',
        tge: 'Q2 2025',
        funding: 27000000,
        reward: 'Up to 7,000 HST',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['security', 'smart-contracts']
    },
    {
        id: '3dos',
        name: '3DOS',
        shortDescription: '3D asset platform',
        description: '3D asset marketplace and creation platform for metaverse applications.',
        icon: '3d_rotation',
        type: 'Metaverse',
        tge: 'Q4 2025',
        funding: 35000000,
        reward: 'Up to 9,000 3DO',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['metaverse', '3d'],
        mobileLimitations: true
    },
    {
        id: 'dvin',
        name: 'Dvin',
        shortDescription: 'Wine authentication',
        description: 'Wine authentication and provenance tracking on the blockchain.',
        icon: 'wine_bar',
        type: 'NFT',
        tge: 'Q3 2025',
        funding: 18000000,
        reward: 'Up to 4,000 DVN',
        website: '#',
        twitter: '#',
        discord: '#',
        tags: ['nft', 'luxury']
    }
];

// Default news data
const newsData = [
    {
        id: 'news1',
        title: 'Blockmesh Announces Testnet Launch Date',
        description: 'The highly anticipated mesh network protocol will launch its testnet next month.',
        fullContent: 'Blockmesh has officially announced that its testnet will go live on May 15, 2025. The launch will allow developers to test the network\'s capabilities and provide feedback before the mainnet launch later this year. The team has also announced a bug bounty program with rewards up to $50,000 for critical vulnerabilities.',
        image: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=1200&auto=format&fit=crop',
        date: '2025-04-10',
        tags: ['airdrop', 'testnet']
    },
    {
        id: 'news2',
        title: 'Taker Protocol Secures Additional $15M in Funding',
        description: 'DeFi protocol Taker has secured an additional $15M in Series B funding led by Crypto Capital Ventures.',
        fullContent: 'Taker Protocol, the automated market maker designed for reduced slippage, has announced the successful closing of its Series B funding round, securing an additional $15 million. The round was led by Crypto Capital Ventures, with participation from existing investors BlockChain Capital and DeFi Alliance. The funds will be used to expand the team and accelerate the development of new features.',
        image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1200&auto=format&fit=crop',
        date: '2025-04-08',
        tags: ['market', 'defi']
    },
    {
        id: 'news3',
        title: 'How to Qualify for the Exabits Airdrop',
        description: 'Step-by-step guide to qualifying for the upcoming Exabits token airdrop.',
        fullContent: 'Exabits is preparing for one of the most anticipated airdrops of 2025. To qualify, users need to complete a series of tasks including testnet participation, social media engagement, and liquidity provision. This comprehensive guide walks through each step of the qualification process, with tips to maximize your potential rewards. Remember that the snapshot date is June 15, 2025, so all activities must be completed before then.',
        image: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=1200&auto=format&fit=crop',
        date: '2025-04-05',
        tags: ['airdrop', 'guide']
    },
    {
        id: 'news4',
        title: 'P.o.d Partners with Major Art Galleries',
        description: 'NFT platform P.o.d announces partnerships with five major art galleries for tokenized exhibitions.',
        fullContent: 'P.o.d has announced strategic partnerships with five major art galleries including MoMA and Tate Modern to create tokenized exhibitions on its NFT platform. This move represents a significant step toward mainstream adoption of NFT technology in the traditional art world. The first exhibition is scheduled for July 2025 and will feature works from contemporary artists exploring the intersection of digital and physical art.',
        image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1200&auto=format&fit=crop',
        date: '2025-04-02',
        tags: ['nft', 'partnership']
    },
    {
        id: 'news5',
        title: 'DropDeck App Launches New Features',
        description: 'DropDeck crypto airdrop tracker introduces new portfolio analytics and notification system.',
        fullContent: 'DropDeck, the popular crypto airdrop tracking application, has launched a major update featuring enhanced portfolio analytics, an improved notification system, and integration with major wallets for real-time tracking. The update also includes a revamped UI for better user experience and accessibility. Users can now set custom alerts for specific project milestones and airdrop qualification deadlines.',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
        date: '2025-03-28',
        tags: ['app', 'update']
    },
    {
        id: 'news6',
        title: 'Malda Tokenomics Revealed Ahead of Launch',
        description: 'AI analytics platform Malda has revealed its token distribution and utility details.',
        fullContent: 'Malda, the AI-powered analytics platform for crypto markets, has revealed its tokenomics ahead of its anticipated launch. The MLD token will have a maximum supply of 100 million, with 15% allocated for the public sale, 20% for the team (vested over 3 years), 25% for ecosystem development, 10% for initial liquidity, and 30% for rewards and staking incentives. The token will function as both a governance token and utility token within the Malda ecosystem.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        date: '2025-03-25',
        tags: ['tokenomics', 'ai']
    }
];

// ====== APP INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    // Initialize local storage
    initializeLocalStorage();
    
    // Setup navigation
    setupNavigation();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Initialize dashboard
    updateDashboardStats();
    renderMyProjects();
    renderNewsPreview();
    setupDashboardToggles();
    
    // Initialize investment & earnings
    updateInvestmentStats();
    renderTransactionHistory();
    setupInvestmentModal();
    setupEarningModal();
    
    // Initialize explore
    renderExploreProjects();
    
    // Initialize statistics
    renderStatistics();
    
    // Initialize tasks
    renderTasks();
    
    // Initialize news
    renderNews();
    setupNewsTags();
})
