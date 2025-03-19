import { $, $$, showNotification } from './core/utils.js';

// 侧边栏拖拽调整大小功能
class Resizer {
    constructor() {
        this.resizer = $('#resizer');
        this.sidebar = $('#sidebar');
        this.mainContent = $('#main-content');
        this.isResizing = false;
        this.startX = 0;
        this.startWidth = 0;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.resizer.addEventListener('mousedown', (e) => this.startResizing(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.stopResizing());
    }

    startResizing(e) {
        this.isResizing = true;
        this.startX = e.clientX;
        this.startWidth = this.sidebar.offsetWidth;
    }

    stopResizing() {
        this.isResizing = false;
    }

    handleMouseMove(e) {
        if (!this.isResizing) return;
        
        const width = this.startWidth + (e.clientX - this.startX);
        const minWidth = 200;
        const maxWidth = window.innerWidth * 0.4;
        
        if (width >= minWidth && width <= maxWidth) {
            this.sidebar.style.width = `${width}px`;
            this.mainContent.style.marginLeft = `${width}px`;
        }
    }
}

// 导航管理
class Navigation {
    constructor() {
        console.log('Initializing Navigation');
        this.navItems = $$('.nav-item');
        console.log('Found nav items:', this.navItems.length);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.navItems.forEach(item => {
            console.log('Setting up click listener for:', item.getAttribute('data-section'));
            item.addEventListener('click', (e) => {
                console.log('Nav item clicked:', item.getAttribute('data-section'));
                this.handleNavClick(item);
            });
        });
    }

    handleNavClick(item) {
        const sectionId = item.getAttribute('data-section');
        console.log('Handling navigation to section:', sectionId);
        
        // 移除所有活动状态
        this.navItems.forEach(i => i.classList.remove('active'));
        
        // 隐藏所有内容区域
        const allSections = $$('.content-section');
        console.log('Found content sections:', allSections.length);
        allSections.forEach(section => {
            section.style.display = 'none';
            console.log('Hiding section:', section.id);
        });
        
        // 添加新的活动状态
        item.classList.add('active');
        
        // 显示选中的内容区域
        let targetSection;
        if (sectionId === 'users') {
            targetSection = $('#users-section');
        } else if (sectionId === 'playbooks') {
            targetSection = $('#playbooks-section');
        } else {
            targetSection = $('#' + sectionId);
        }
        
        if (targetSection) {
            console.log('Showing section:', sectionId);
            targetSection.style.display = 'block';
        } else {
            console.error('Target section not found:', sectionId);
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing application');
    
    // 初始化侧边栏调整大小功能
    const resizer = new Resizer();
    
    // 初始化导航
    const navigation = new Navigation();
    
    // 设置默认显示的部分
    const defaultSection = $('#dashboard');
    if (defaultSection) {
        defaultSection.style.display = 'block';
    }
});

// 主机管理功能
const modal = document.getElementById('add-host-modal');
const addHostBtn = document.getElementById('add-host-btn');
const closeBtn = document.querySelector('#add-host-modal .close');
const cancelBtn = document.getElementById('cancel-add-host');
const addHostForm = document.getElementById('add-host-form');
const hostList = document.getElementById('host-list');
const groupFilter = document.getElementById('group-filter');
const tableSearch = document.querySelector('.table-search input');

// 示例主机数据
let hosts = [
    {
        id: 1,
        hostname: 'web-server-1',
        address: '192.168.1.100',
        username: 'admin',
        status: '在线',
        os: 'Ubuntu 20.04',
        group: 'web',
        resources: {
            cpu: 45,
            memory: 60,
            disk: 75,
            network: 30
        }
    },
    {
        id: 2,
        hostname: 'db-server-1',
        address: '192.168.1.101',
        username: 'root',
        status: '离线',
        os: 'CentOS 7',
        group: 'db',
        resources: {
            cpu: 0,
            memory: 0,
            disk: 55,
            network: 0
        }
    }
];

// 更新统计数据
function updateStats() {
    const onlineCount = hosts.filter(host => host.status === '在线').length;
    const offlineCount = hosts.filter(host => host.status === '离线').length;
    const totalCount = hosts.length;

    const onlineElement = document.getElementById('online-hosts-count');
    const offlineElement = document.getElementById('offline-hosts-count');
    const totalElement = document.getElementById('total-hosts-count');

    if (onlineElement) onlineElement.textContent = onlineCount;
    if (offlineElement) offlineElement.textContent = offlineCount;
    if (totalElement) totalElement.textContent = totalCount;
}

// 过滤和搜索主机
function filterHosts() {
    const searchTerm = tableSearch.value.toLowerCase();
    const selectedGroup = groupFilter.value;
    
    return hosts.filter(host => {
        const matchesSearch = 
            host.hostname.toLowerCase().includes(searchTerm) ||
            host.address.toLowerCase().includes(searchTerm) ||
            host.username.toLowerCase().includes(searchTerm) ||
            host.os.toLowerCase().includes(searchTerm);
            
        const matchesGroup = !selectedGroup || host.group === selectedGroup;
        
        return matchesSearch && matchesGroup;
    });
}

// 显示主机列表
function renderHosts() {
    const filteredHosts = filterHosts();
    hostList.innerHTML = filteredHosts.map(host => `
        <tr>
            <td>${host.hostname}</td>
            <td>${host.address}</td>
            <td>${host.username}</td>
            <td>
                <span class="status-badge ${host.status === '在线' ? 'status-online' : 'status-offline'}">
                    <i class="fas fa-${host.status === '在线' ? 'check' : 'times'}-circle"></i>
                    ${host.status}
                </span>
            </td>
            <td>${host.os}</td>
            <td>
                <span class="group-badge group-${host.group}">${getGroupName(host.group)}</span>
            </td>
            <td>
                <div class="resource-mini">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${host.resources.cpu}%;">${host.resources.cpu}%</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="resource-mini">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${host.resources.memory}%;">${host.resources.memory}%</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="resource-mini">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${host.resources.disk}%;">${host.resources.disk}%</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="resource-mini">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${host.resources.network}%;">${host.resources.network}%</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-danger btn-sm" onclick="deleteHost(${host.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updateStats();
}

// 获取组名称
function getGroupName(groupCode) {
    const groupNames = {
        'web': 'Web服务器组',
        'db': '数据库服务器组',
        'app': '应用服务器组',
        'other': '其他'
    };
    return groupNames[groupCode] || groupCode;
}

// 删除主机
function deleteHost(id) {
    if (confirm('确定要删除这个主机吗？')) {
        hosts = hosts.filter(host => host.id !== id);
        renderHosts();
    }
}

// 打开新增主机弹窗
addHostBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// 关闭弹窗
function closeModal() {
    modal.style.display = 'none';
    addHostForm.reset();
}

// 为关闭按钮添加点击事件监听器
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
} else {
    console.error('关闭按钮未找到');
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
} else {
    console.error('取消按钮未找到');
}

// 点击弹窗外部关闭弹窗
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// 处理新增主机表单提交
addHostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newHost = {
        id: hosts.length + 1,
        hostname: document.getElementById('hostname').value,
        address: document.getElementById('address').value,
        username: document.getElementById('username').value,
        status: '离线', // 默认状态
        os: '未知', // 默认操作系统
        group: document.getElementById('group').value
    };
    
    hosts.push(newHost);
    renderHosts();
    closeModal();
});

// 监听过滤和搜索事件
groupFilter.addEventListener('change', renderHosts);
tableSearch.addEventListener('input', renderHosts);

// 初始化显示主机列表
renderHosts();

// 更新主机资源使用情况
function updateHostResources() {
    hosts.forEach(host => {
        if (host.status === '在线') {
            host.resources = {
                cpu: Math.floor(Math.random() * 100),
                memory: Math.floor(Math.random() * 100),
                disk: Math.floor(Math.random() * 100),
                network: Math.floor(Math.random() * 100)
            };
        }
    });
    renderHosts();
}

// 定期更新主机资源使用情况
setInterval(updateHostResources, 5000);

// 剧本编写功能
const addPlaybookBtn = document.getElementById('add-playbook-btn');
const addPlaybookModal = document.getElementById('add-playbook-modal');
const addPlaybookForm = document.getElementById('add-playbook-form');
const cancelAddPlaybookBtn = document.getElementById('cancel-add-playbook');
const createPlaybookBtn = document.getElementById('create-playbook');
const playbackItems = document.querySelectorAll('.playbook-item');
const savePlaybookBtn = document.getElementById('save-playbook');
const previewPlaybookBtn = document.getElementById('preview-playbook');
const executePlaybookBtn = document.getElementById('execute-playbook');
const executeModal = document.getElementById('execute-playbook-modal');
const executeForm = document.getElementById('execute-playbook-form');
const cancelExecuteBtn = document.getElementById('cancel-execute');
const targetTypeInputs = document.querySelectorAll('input[name="target-type"]');
const groupSelectContainer = document.getElementById('group-select-container');
const hostSelectContainer = document.getElementById('host-select-container');
const targetGroupSelect = document.getElementById('target-group-select');
const targetHostSelect = document.getElementById('target-host-select');

// 打开新建剧本弹窗
addPlaybookBtn?.addEventListener('click', () => {
    addPlaybookModal.style.display = 'block';
});

// 关闭新建剧本弹窗
const closeAddPlaybookModal = () => {
    addPlaybookModal.style.display = 'none';
    addPlaybookForm?.reset();
};

// 为关闭按钮添加点击事件
addPlaybookModal?.querySelector('.close')?.addEventListener('click', closeAddPlaybookModal);

// 为取消按钮添加点击事件
cancelAddPlaybookBtn?.addEventListener('click', closeAddPlaybookModal);

// 点击弹窗外部关闭
window.addEventListener('click', (e) => {
    if (e.target === addPlaybookModal) {
        closeAddPlaybookModal();
    }
});

// 处理创建剧本
createPlaybookBtn?.addEventListener('click', () => {
    if (!addPlaybookForm?.checkValidity()) {
        addPlaybookForm?.reportValidity();
        return;
    }

    const formData = new FormData(addPlaybookForm);
    const playbookData = {
        name: formData.get('name'),
        description: formData.get('description'),
        category: formData.get('category'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
        permissions: Array.from(formData.getAll('permissions')),
        options: Array.from(formData.getAll('options'))
    };

    // 这里应该调用后端 API 创建剧本
    console.log('创建剧本:', playbookData);

    // 模拟成功响应
    showNotification('剧本创建成功！', 'success');
    closeAddPlaybookModal();

    // 刷新剧本列表
    // TODO: 实现刷新剧本列表的逻辑
});

// 标签页切换
editorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // 更新标签页状态
        editorTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // 更新内容显示
        tabContents.forEach(content => {
            content.style.display = content.id === `${targetTab}-tab` ? 'block' : 'none';
        });
    });
});

// 剧本列表项点击
playbackItems.forEach(item => {
    item.addEventListener('click', () => {
        // 更新选中状态
        playbackItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // 更新编辑器标题
        const fileName = item.querySelector('h4').textContent;
        document.querySelector('.file-info h3').textContent = fileName;
        
        // 这里应该加载剧本内容
        loadPlaybookContent(fileName);
    });
});

// 保存剧本
savePlaybookBtn?.addEventListener('click', () => {
    // 获取当前编辑器内容
    const content = document.querySelector('.code-editor code').textContent;
    
    // 这里应该是实际的保存API调用
    console.log('保存剧本:', content);
    
    // 模拟成功响应
    showNotification('剧本保存成功！', 'success');
});

// 预览剧本
previewPlaybookBtn?.addEventListener('click', () => {
    // 获取当前编辑器内容
    const content = document.querySelector('.code-editor code').textContent;
    
    // 这里应该是实际的预览API调用
    console.log('预览剧本:', content);
    
    // 模拟预览响应
    showNotification('正在解析剧本...', 'info');
    setTimeout(() => {
        showNotification('剧本语法检查通过！', 'success');
    }, 1000);
});

// 打开执行剧本弹窗
executePlaybookBtn?.addEventListener('click', () => {
    executeModal.style.display = 'block';
});

// 关闭执行剧本弹窗
const closeExecuteModal = () => {
    executeModal.style.display = 'none';
    executeForm.reset();
};

cancelExecuteBtn?.addEventListener('click', closeExecuteModal);
executeModal?.querySelector('.close')?.addEventListener('click', closeExecuteModal);

// 点击弹窗外部关闭
window.addEventListener('click', (e) => {
    if (e.target === executeModal) {
        closeExecuteModal();
    }
});

// 切换执行目标类型
targetTypeInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (input.value === 'group') {
            groupSelectContainer.style.display = 'block';
            hostSelectContainer.style.display = 'none';
            targetGroupSelect.required = true;
            targetHostSelect.required = false;
            targetHostSelect.disabled = true;
        } else {
            groupSelectContainer.style.display = 'none';
            hostSelectContainer.style.display = 'block';
            targetGroupSelect.required = false;
            targetHostSelect.required = true;
            targetHostSelect.disabled = false;
        }
    });
});

// 处理执行表单提交
executeForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(executeForm);
    const executionData = Object.fromEntries(formData.entries());
    
    // 获取当前选中的剧本名称
    const playbookName = document.querySelector('.file-info h3').textContent;
    
    // 创建执行状态区域
    const statusContainer = document.createElement('div');
    statusContainer.className = 'execution-status';
    statusContainer.innerHTML = `
        <div class="status-header">
            <h3>执行状态</h3>
            <span class="status-badge running">
                <i class="fas fa-spinner fa-spin"></i> 正在执行
            </span>
        </div>
        <div class="execution-log"></div>
    `;
    
    // 添加到编辑器下方
    document.querySelector('.editor-container').appendChild(statusContainer);
    
    const logContainer = statusContainer.querySelector('.execution-log');
    const statusBadge = statusContainer.querySelector('.status-badge');
    
    // 添加日志条目
    const addLogEntry = (message, type = 'info') => {
        const logLine = document.createElement('div');
        logLine.className = 'log-entry ' + type;
        logLine.innerHTML = `
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            <span class="message">${message}</span>
        `;
        logContainer.appendChild(logLine);
        logContainer.scrollTop = logContainer.scrollHeight;
    };

    // 模拟执行过程
    closeExecuteModal();
    
    try {
        // 这里应该是实际的执行API调用
        console.log('执行剧本:', {
            playbookName,
            executionData
        });
        
        // 模拟执行过程
        addLogEntry('开始执行剧本: ' + playbookName);
        addLogEntry('正在连接目标主机...', 'info');
        
        setTimeout(() => {
            addLogEntry('连接成功，开始执行任务', 'success');
            
            setTimeout(() => {
                addLogEntry('任务执行完成', 'success');
                statusBadge.className = 'status-badge success';
                statusBadge.innerHTML = '<i class="fas fa-check"></i> 执行成功';
                
                showNotification('剧本执行成功！', 'success');
            }, 2000);
        }, 1000);
        
    } catch (error) {
        addLogEntry('执行出错: ' + error.message, 'error');
        statusBadge.className = 'status-badge error';
        statusBadge.innerHTML = '<i class="fas fa-times"></i> 执行失败';
        
        showNotification('剧本执行失败！', 'error');
    }
});