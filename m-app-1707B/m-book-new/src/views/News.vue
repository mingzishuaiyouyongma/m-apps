<template>
  <div class="m-news-wrap">
    <div class="m-news-serarch">
      <input type="text" placeholder="请输入关键词" v-model="search" @keyup.enter="handleSearch" />
    </div>
    <div class="m-news js-news" @scroll="handleScroll">
      <div id="top"></div>
      <div v-for="item in list" :key="item.id" class="m-news-item">
        <img :src="item.image" />
        <div class="m-news-info">{{item.name}}</div>
      </div>
      <div class="m-end">{{end}}</div>
    </div>
    <button @click="handleTop" class="m-top">↑</button>
    <el-backtop target=".js-news"></el-backtop>
  </div>
</template>

<script>
import Api from "../api";

let isUpdated = true;
export default {
  data() {
    return {
      list: [],
      page: 1,
      search: "",
      end: ""
    };
  },
  methods: {
    handleScroll(e) {
      console.log(
        e.target.clientHeight,
        e.target.scrollTop,
        e.target.scrollHeight
      );
      let { scrollTop, clientHeight, scrollHeight } = e.target;
      if (
        scrollTop + clientHeight + 200 > scrollHeight &&
        isUpdated &&
        this.end === ""
      ) {
        this.page++;
        isUpdated = false;
        Api.news(`?page=${this.page}&size=10&search=${this.search}`).then(res => {
          if (res.code === 200) {
            this.list = [...this.list, ...res.data];
            if (res.data.length < 10) {
              this.end = "我是有底线的~";
            }
          }
        });
      }
    },
    handleSearch() {
      document.getElementById('top').scrollIntoView(true)
      Api.news(`?page=1&size=10&search=${this.search}`).then(res => {
        if (res.code === 200) {
          this.list = res.data;
          this.page = 1
          this.end = ''
        }
      });
    },
    handleTop() {
      document.getElementById('top').scrollIntoView(true)
    }
  },
  updated() {
    isUpdated = true;
  },
  mounted() {
    Api.news("?page=1&size=10").then(res => {
      if (res.code === 200) {
        this.list = res.data;
      }
    });
  }
};
</script>

<style>
</style>