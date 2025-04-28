<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-menu
          :router="true"
          mode="horizontal"
          :ellipsis="false"
          class="nav-menu"
        >
          <el-menu-item index="/">
            <h2>中国高铁数据可视化</h2>
          </el-menu-item>
          <div class="flex-grow" />
          <el-menu-item index="/train-models">车型数据</el-menu-item>
          <el-menu-item index="/tech-tree">技术谱系</el-menu-item>
          <el-menu-item index="/transport-competition">交通运输竞争力</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup></script>

<style>
.app-container {
  height: 100vh;
  width: 100vw;
}

.nav-menu {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.flex-grow {
  flex-grow: 1;
}

.el-header {
  padding: 0;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}

body {
  margin: 0;
  padding: 0;
}
</style>
