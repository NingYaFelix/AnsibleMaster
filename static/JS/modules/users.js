import { $, $$, showNotification, Modal, getFormData, delegate } from '../core/utils.js';

class UserModal extends Modal {
    constructor() {
        super('user-modal');
        this.modalTitle = $('#modal-title');
        this.togglePassword = $('.toggle-password');
        this.passwordInput = $('#user-password');
        
        this.setupPasswordToggle();
    }

    setupPasswordToggle() {
        if (this.togglePassword && this.passwordInput) {
            this.togglePassword.addEventListener('click', (e) => {
                e.preventDefault();
                const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                this.passwordInput.setAttribute('type', type);
                this.togglePassword.querySelector('i').classList.toggle('fa-eye');
                this.togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const userData = getFormData(this.form);
        console.log('提交用户数据:', userData);
        
        // 这里应该是实际的API调用
        showNotification('用户创建成功！', 'success');
        this.close();
    }
}

class UserManager {
    constructor() {
        this.modal = new UserModal();
        this.addUserBtn = $('#add-user-btn');
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.addUserBtn) {
            this.addUserBtn.addEventListener('click', () => {
                console.log('Add user button clicked');
                this.openAddUserModal();
            });
        }

        // 编辑用户
        delegate(document, 'click', '.btn-icon[title="编辑"]', (e) => this.handleEditUser(e));
        
        // 删除用户
        delegate(document, 'click', '.btn-icon[title="删除"]', (e) => this.handleDeleteUser(e));
        
        // 重置密码
        delegate(document, 'click', '.btn-icon[title="重置密码"]', (e) => this.handleResetPassword(e));
    }

    openAddUserModal() {
        this.modal.modalTitle.textContent = '新增用户';
        this.modal.open();
    }

    handleEditUser(e) {
        const userCard = e.target.closest('.user-card');
        const isAdmin = userCard.querySelector('.user-role').classList.contains('admin');
        
        if (!this.checkPermission(userCard)) {
            showNotification('您没有权限编辑其他用户的信息！', 'error');
            return;
        }

        this.modal.modalTitle.textContent = '编辑用户';
        $('#user-username').value = userCard.querySelector('.user-info h3').textContent;
        $('#user-description').value = userCard.querySelector('.user-info p').textContent;
        $('#user-role').value = isAdmin ? 'admin' : 'user';
        
        if (!this.isAdmin()) {
            $('#user-role').disabled = true;
        }

        this.modal.open();
    }

    handleDeleteUser(e) {
        const userCard = e.target.closest('.user-card');
        const username = userCard.querySelector('.user-info h3').textContent;
        
        if (!this.isAdmin()) {
            showNotification('只有管理员可以删除用户！', 'error');
            return;
        }

        if (confirm(`确定要删除用户 "${username}" 吗？`)) {
            // 这里应该是实际的API调用
            userCard.remove();
            showNotification('用户删除成功！', 'success');
        }
    }

    handleResetPassword(e) {
        const userCard = e.target.closest('.user-card');
        const username = userCard.querySelector('.user-info h3').textContent;
        
        if (!this.checkPermission(userCard)) {
            showNotification('您没有权限重置其他用户的密码！', 'error');
            return;
        }

        if (confirm(`确定要重置用户 "${username}" 的密码吗？`)) {
            // 这里应该是实际的API调用
            showNotification('密码重置成功！新密码已发送至用户邮箱。', 'success');
        }
    }

    checkPermission(userCard) {
        return this.isAdmin() || 
               userCard.querySelector('.user-info h3').textContent === this.getCurrentUsername();
    }

    isAdmin() {
        return true; // 临时返回true，实际应该从用户会话中获取
    }

    getCurrentUsername() {
        return 'Admin'; // 临时返回Admin，实际应该从用户会话中获取
    }
}

// 初始化用户管理模块
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing user management module');
    const userManager = new UserManager();
}); 