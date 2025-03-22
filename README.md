## AnsibleMaster

### 目前只有前端界面

## 数据库配置

### 创建数据库`create database AnsibleMster default charset=utf8;`

### 请在AnsibleMaster下新建一个`config.cnf`

```cnf
# my.cnf
[client]
databases = AnsibleMaster
user = root
host = 
port = 3306
password = 
```