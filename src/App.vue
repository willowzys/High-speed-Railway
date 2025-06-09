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
  background-color: #959290;
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
  background: linear-gradient(135deg, #1d4870 0%, #e6e9f0 100%);
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
  margin-right: 5px;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  transition: transform 0.5s ease;
  cursor: pointer;
}

.logo:hover {
  transform: rotate(360deg);
}

.title-container {
  display: flex;
  align-items: center;
}


@media (min-width: 1920px) {
  .nav-menu {
    padding: 10px 10%;
  }
}


.site-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  letter-spacing: 2px;
}

.site-title:hover {
  color: #3498db;
}

.nav-links {
  display: flex;
  align-items: center;
}

.el-header {
  padding: 0;
  background-color: transparent;
}


</style>
