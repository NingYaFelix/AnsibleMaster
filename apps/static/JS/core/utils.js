// 通用工具函数
export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

// 显示通知消息
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('i');
    icon.className = `fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'times-circle' : 
                         'info-circle'}`;
    
    const text = document.createElement('span');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 创建元素
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
}

// 事件委托
export function delegate(element, eventType, selector, handler) {
    element.addEventListener(eventType, (event) => {
        const target = event.target.closest(selector);
        if (target && element.contains(target)) {
            handler.call(target, event);
        }
    });
}

// 防抖函数
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 表单数据处理
export function getFormData(form) {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

// 模态框基类
export class Modal {
    constructor(modalId) {
        this.modal = $(`#${modalId}`);
        this.closeBtn = this.modal.querySelector('.close');
        this.cancelBtn = this.modal.querySelector('[data-action="cancel"]');
        this.form = this.modal.querySelector('form');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.close());
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    open() {
        this.modal.style.display = 'block';
        if (this.form) this.form.reset();
    }

    close() {
        this.modal.style.display = 'none';
        if (this.form) this.form.reset();
    }

    handleSubmit(e) {
        e.preventDefault();
        // 子类实现具体的提交逻辑
    }
} 