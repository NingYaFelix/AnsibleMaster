// 侧边栏拖拽调整大小功能
const resizer = document.getElementById('resizer');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
let isResizing = false;
let startX;
let startWidth;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = sidebar.offsetWidth;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
    });
});

function handleMouseMove(e) {
    if (!isResizing) return;
    
    const width = startWidth + (e.clientX - startX);
    const minWidth = 200; // 最小宽度
    const maxWidth = window.innerWidth * 0.4; // 最大宽度（40%的窗口宽度）
    
    if (width >= minWidth && width <= maxWidth) {
        sidebar.style.width = `${width}px`;
        mainContent.style.marginLeft = `${width}px`;
    }
}

// 导航切换
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        // 移除所有活动状态
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.content-section, #users-section, #playbooks-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // 添加新的活动状态
        item.classList.add('active');
        const sectionId = item.getAttribute('data-section');
        
        // 根据不同的section显示对应内容
        if (sectionId === 'users') {
            document.getElementById('users-section').style.display = 'block';
        } else if (sectionId === 'playbooks') {
            document.getElementById('playbooks-section').style.display = 'block';
        } else {
            document.getElementById(sectionId).style.display = 'block';
        }
    });
});

// 主机管理功能
const modal = document.getElementById('add-host-modal');
const addHostBtn = document.getElementById('add-host-btn');
const closeBtn = document.querySelector('.close');
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

    document.getElementById('online-hosts-count').textContent = onlineCount;
    document.getElementById('offline-hosts-count').textContent = offlineCount;
    document.getElementById('total-hosts-count').textContent = totalCount;
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

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

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

// 用户管理功能
const addUserBtn = document.getElementById('add-user-btn');
const userModal = document.getElementById('user-modal');
const userForm = document.getElementById('user-form');
const cancelUserBtn = document.getElementById('cancel-user');
const modalTitle = document.getElementById('modal-title');
const currentUser = {
    role: 'admin', // 示例：当前用户是管理员
    username: 'Admin'
};

// 打开新增用户模态框
addUserBtn?.addEventListener('click', () => {
    modalTitle.textContent = '新增用户';
    userForm.reset();
    userModal.style.display = 'block';
    
    // 如果不是管理员，禁用角色选择
    const roleSelect = document.getElementById('user-role');
    if (currentUser.role !== 'admin') {
        roleSelect.disabled = true;
        roleSelect.value = 'user';
    } else {
        roleSelect.disabled = false;
    }
});

// 关闭模态框
const closeUserModal = () => {
    userModal.style.display = 'none';
};

cancelUserBtn?.addEventListener('click', closeUserModal);
userModal?.querySelector('.close')?.addEventListener('click', closeUserModal);

// 点击模态框外部关闭
window.addEventListener('click', (e) => {
    if (e.target === userModal) {
        closeUserModal();
    }
});

// 处理用户表单提交
userForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(userForm);
    const userData = Object.fromEntries(formData.entries());
    
    // 这里应该是实际的API调用
    console.log('提交用户数据:', userData);
    
    // 模拟成功响应
    showNotification('用户创建成功！', 'success');
    closeUserModal();
});

// 编辑用户
document.querySelectorAll('.btn-icon[title="编辑"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const userCard = e.target.closest('.user-card');
        const isAdmin = userCard.querySelector('.user-role').classList.contains('admin');
        
        // 检查权限
        if (currentUser.role !== 'admin' && 
            userCard.querySelector('.user-info h3').textContent !== currentUser.username) {
            showNotification('您没有权限编辑其他用户的信息！', 'error');
            return;
        }

        modalTitle.textContent = '编辑用户';
        userModal.style.display = 'block';

        // 填充表单数据
        document.getElementById('user-username').value = userCard.querySelector('.user-info h3').textContent;
        document.getElementById('user-description').value = userCard.querySelector('.user-info p').textContent;
        document.getElementById('user-role').value = isAdmin ? 'admin' : 'user';
        
        // 如果不是管理员，禁用角色选择
        if (currentUser.role !== 'admin') {
            document.getElementById('user-role').disabled = true;
        }
    });
});

// 删除用户
document.querySelectorAll('.btn-icon[title="删除"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const userCard = e.target.closest('.user-card');
        const username = userCard.querySelector('.user-info h3').textContent;
        
        // 检查权限
        if (currentUser.role !== 'admin') {
            showNotification('只有管理员可以删除用户！', 'error');
            return;
        }

        if (confirm(`确定要删除用户 "${username}" 吗？`)) {
            // 这里应该是实际的API调用
            userCard.remove();
            showNotification('用户删除成功！', 'success');
        }
    });
});

// 重置密码
document.querySelectorAll('.btn-icon[title="重置密码"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const userCard = e.target.closest('.user-card');
        const username = userCard.querySelector('.user-info h3').textContent;
        
        // 检查权限
        if (currentUser.role !== 'admin' && 
            username !== currentUser.username) {
            showNotification('您没有权限重置其他用户的密码！', 'error');
            return;
        }

        if (confirm(`确定要重置用户 "${username}" 的密码吗？`)) {
            // 这里应该是实际的API调用
            showNotification('密码重置成功！新密码已发送至用户邮箱。', 'success');
        }
    });
});

// 显示通知消息
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 设置图标
    const icon = document.createElement('i');
    icon.className = `fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'times-circle' : 
                         'info-circle'}`;
    
    // 设置消息
    const text = document.createElement('span');
    text.textContent = message;
    
    // 组装通知
    notification.appendChild(icon);
    notification.appendChild(text);
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加动画类
    setTimeout(() => notification.classList.add('show'), 10);
    
    // 自动移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加通知样式
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid #2ecc71;
    }
    
    .notification.error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification.info {
        border-left: 4px solid #3498db;
    }
    
    .notification i {
        font-size: 1.25rem;
    }
    
    .notification.success i {
        color: #2ecc71;
    }
    
    .notification.error i {
        color: #e74c3c;
    }
    
    .notification.info i {
        color: #3498db;
    }
`;
document.head.appendChild(style);

// 剧本编写功能
const addPlaybookBtn = document.getElementById('add-playbook-btn');
const playbackModal = document.getElementById('add-playbook-modal');
const cancelPlaybookBtn = document.getElementById('cancel-add-playbook');
const addPlaybookForm = document.getElementById('add-playbook-form');
const editorTabs = document.querySelectorAll('.editor-tabs .tab');
const tabContents = document.querySelectorAll('.tab-content');
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

// 处理新建剧本
addPlaybookBtn?.addEventListener('click', () => {
    playbackModal.style.display = 'block';
});

// 关闭新建剧本弹窗
const closePlaybookModal = () => {
    playbackModal.style.display = 'none';
    addPlaybookForm?.reset();
};

cancelPlaybookBtn?.addEventListener('click', closePlaybookModal);
playbackModal?.querySelector('.close')?.addEventListener('click', closePlaybookModal);

// 点击弹窗外部关闭
window.addEventListener('click', (e) => {
    if (e.target === playbackModal) {
        closePlaybookModal();
    }
});

// 处理剧本表单提交
addPlaybookForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(addPlaybookForm);
    const playbookData = Object.fromEntries(formData.entries());
    
    // 这里应该是实际的API调用
    console.log('提交剧本数据:', playbookData);
    
    // 模拟成功响应
    showNotification('剧本创建成功！', 'success');
    closePlaybookModal();
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
        logLine.className = `log-line ${type}`;
        logLine.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logLine);
        logContainer.scrollTop = logContainer.scrollHeight;
    };
    
    try {
        // 这里应该是实际的API调用
        addLogEntry(`开始执行剧本: ${playbookName}`);
        addLogEntry(`目标: ${executionData['target-type'] === 'group' ? '主机组 - ' + executionData['target-group'] : '主机 - ' + executionData['target-host']}`);
        
        // 模拟执行过程
        await new Promise(resolve => setTimeout(resolve, 2000));
        addLogEntry('正在连接目标主机...', 'info');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        addLogEntry('连接成功，开始执行任务', 'success');
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        addLogEntry('任务执行完成', 'success');
        
        // 更新状态为成功
        statusBadge.className = 'status-badge success';
        statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> 执行成功';
        
        showNotification('剧本执行成功！', 'success');
    } catch (error) {
        // 处理错误
        addLogEntry(`执行出错: ${error.message}`, 'error');
        statusBadge.className = 'status-badge error';
        statusBadge.innerHTML = '<i class="fas fa-times-circle"></i> 执行失败';
        
        showNotification('剧本执行失败！', 'error');
    }
    
    closeExecuteModal();
});

// 加载剧本内容
function loadPlaybookContent(fileName) {
    // 这里应该是实际的API调用来获取剧本内容
    const demoContent = {
        'nginx_install.yml': `---
- name: Install and Configure Nginx
  hosts: web_servers
  become: yes
  
  vars:
    nginx_port: 80
    server_name: example.com
  
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes
    
    - name: Configure Nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: restart nginx
  
  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted`,
        'mysql_setup.yml': `---
- name: Deploy MySQL Database
  hosts: db_servers
  become: yes
  
  vars:
    mysql_root_password: "{{ vault_mysql_root_password }}"
    mysql_version: "8.0"
  
  tasks:
    - name: Install MySQL
      apt:
        name: mysql-server
        state: present
        update_cache: yes
    
    - name: Start MySQL Service
      service:
        name: mysql
        state: started
        enabled: yes`
    };
    
    // 更新编辑器内容
    const editor = document.querySelector('.code-editor code');
    editor.textContent = demoContent[fileName] || '# 新建剧本\n';
} 