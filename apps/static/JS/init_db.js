document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('init-db-form');
    const dbType = document.getElementById('db-type');
    const dbHost = document.getElementById('db-host');
    const dbPort = document.getElementById('db-port');
    const statusContainer = document.getElementById('status-container');
    const statusMessage = document.getElementById('status-message');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');

    // 数据库类型切换
    dbType.addEventListener('change', function() {
        switch(this.value) {
            case 'mysql':
                dbPort.value = '3306';
                dbHost.disabled = false;
                break;
            case 'postgresql':
                dbPort.value = '5432';
                dbHost.disabled = false;
                break;
            case 'sqlite':
                dbHost.value = ':memory:';
                dbPort.value = '';
                dbHost.disabled = true;
                break;
        }
    });

    // 密码显示切换
    document.querySelector('.toggle-password').addEventListener('click', function() {
        const input = document.getElementById('db-password');
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // 表单提交
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        errorMessage.classList.remove('show');
        statusContainer.classList.add('show');
        submitBtn.disabled = true;

        try {
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // 这里添加实际的初始化逻辑
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            window.location.href = '/login';
        } catch (error) {
            errorMessage.querySelector('span').textContent = '初始化失败，请检查配置信息';
            errorMessage.classList.add('show');
            submitBtn.disabled = false;
        }
    });
});