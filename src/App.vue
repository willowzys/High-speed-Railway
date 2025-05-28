<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <div class="nav-menu">
          <div class="logo-container">
            <img src="/favicon.ico" alt="Logo" class="logo">
          </div>
          <div class="title-container">
            <h1 class="site-title">中国高铁数据可视化</h1>
          </div>
          <div class="nav-links">
            <!-- 可以添加更多导航链接 -->
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup></script>

<style>
body {
  background-color: #f0f2f5;
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.app-container {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e6e9f0 100%);
}

.el-container {
  height: 100%;
  width: 100%;
  max-width: 100%;
}

.nav-menu {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 5%;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-menu:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: rotate(360deg);
}

.title-container {
  display: flex;
  align-items: center;
}

.site-title {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 1px;
  transition: color 0.3s ease;
  margin: 0;
  text-align: left;
}

.site-title:hover {
  color: #3498db;
}

.nav-links {
  margin-left: auto;
}

.el-main {
  padding: 0;
  margin: 0;
  width: 100%;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
    padding: 10px;
  }
  
  .logo-container, .title-container, .nav-links {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
  }
  
  .site-title {
    font-size: 18px;
  }
  
  .logo {
    width: 30px;
    height: 30px;
  }
}

@media (min-width: 1920px) {
  .nav-menu {
    padding: 10px 10%;
  }
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
}

.title-container {
  flex-grow: 1;
  text-align: center;
}

.site-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  letter-spacing: 2px;
}

.nav-links {
  display: flex;
  align-items: center;
}

.el-header {
  padding: 0;
  background-color: transparent;
}

.el-main {
  padding: 20px;
  background: transparent;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
  width: 100%;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
