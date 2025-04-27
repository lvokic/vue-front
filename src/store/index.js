import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: window.localStorage.getItem('userId') == null ? '' : JSON.parse(window.localStorage.getItem('userId' || '[]')),
    username: window.localStorage.getItem('username') == null ? '' : JSON.parse(window.localStorage.getItem('username' || '[]')),
    adminMenus: [],
    studentId: window.localStorage.getItem('studentId') == null ? '' : JSON.parse(window.localStorage.getItem('studentId' || '[]'))
  },
  mutations: {
    // 用于更新 studentId
    setStudentId(state, studentId) {
      state.studentId = studentId;  // 更新 Vuex 中的 studentId
      window.localStorage.setItem('studentId', JSON.stringify(studentId));  // 将 studentId 存储到 localStorage
    },
    initAdminMenu (state, menus) {
      state.adminMenus = menus
    },
    login (state, data) {
      state.username = data.username;
      state.userId = data.userId;
      window.localStorage.setItem('username', JSON.stringify(data.username));
      window.localStorage.setItem('userId', JSON.stringify(data.userId));
    },
    logout (state) {
      // 注意不能用 null 清除，否则将无法判断 user 里具体的内容
      state.username = '';
      window.localStorage.removeItem('username');
      state.userId = '';
      window.localStorage.removeItem('userId');
      state.adminMenus = [];
      state.studentId = '';  // 清除 studentId
      window.localStorage.removeItem('studentId'); // 从 localStorage 中移除 studentId
    }
  },
  actions: {
    // 用于通过 dispatch 调用 mutation 更新 studentId
    setStudentId({ commit }, studentId) {
      commit('setStudentId', studentId);  // 调用 mutation 来更新 studentId
    }
  },
  getters: {
    // 获取当前的 studentId
    getStudentId(state) {
      return state.studentId;
    }
  }
})
