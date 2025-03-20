document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');

    // 切换密码显示/隐藏
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.querySelector('i').className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
    });

    // 检查是否有保存的登录信息
    const savedUsername = localStorage.getItem('username');
    const savedRemember = localStorage.getItem('remember') === 'true';
    
    if (savedUsername && savedRemember) {
        document.getElementById('username').value = savedUsername;
        rememberCheckbox.checked = true;
    }

    // 处理表单提交
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = passwordInput.value;
        
        // 这里应该是实际的登录验证逻辑
        // 示例中使用模拟数据
        if (username === 'admin' && password === 'admin') {
            // 如果选择了"记住我"，保存用户名
            if (rememberCheckbox.checked) {
                localStorage.setItem('username', username);
                localStorage.setItem('remember', 'true');
            } else {
                localStorage.removeItem('username');
                localStorage.removeItem('remember');
            }
            
            // 登录成功，跳转到主页
            window.location.href = 'index.html';
        } else {
            // 登录失败，显示错误信息
            alert('用户名或密码错误！');
        }
    });

    // 添加输入动画效果
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}); 