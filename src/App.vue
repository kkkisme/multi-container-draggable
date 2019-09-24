<template>
  <div id="app">
    <aside>
      <div
        class="template-item"
        :key="idx"
        v-for="(item, idx) in templateItems"
        :style="{ background: item.color }"
      ></div>
    </aside>
    <main class="main">
      <grid-layout
        ref="gridLayout"
        :layout.sync="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item
          class="item"
          v-for="item in layout"
          :isDraggable="!item.isTemplate"
          :isResizable="!item.isTemplate"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          :style="{ outline: item.isTemplate ? '2px dashed darkmagenta' : '' }"
          @click="editorShow = true"
        >
          <div
            style="height: 100%;width: 100%"
            v-show="!item.isTemplate"
            :style="{ background: item.color }"
          >
            {{ item.i }}
          </div>
        </grid-item>
      </grid-layout>
    </main>
    <transition>
      <div class="editor" v-show="editorShow"></div>
    </transition>
  </div>
</template>

<script>
import interact from "interactjs";
import VueGridLayout from "vue-grid-layout";
export default {
  name: "app",
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      editorShow: false,
      templateItems: [
        {
          color: "aqua"
        },
        {
          color: "salmon"
        }
      ],
      layout: []
    };
  },
  mounted() {
    let copy = null;
    let _this = this;
    let position = { x: 0, y: 0 };
    interact(".template-item").draggable({
      inertia: true,
      listeners: {
        start(event) {
          copy = event.target.cloneNode(true);
          event.target.appendChild(copy);
        },
        move(event) {
          position.x += event.dx;
          position.y += event.dy;
          copy.style.transform = `translate(${position.x}px, ${position.y}px)`;
        },
        end(event) {
          event.target.removeChild(copy);
          copy = null;
          position = { x: 0, y: 0 };
        }
      }
    });
    interact(".main").dropzone({
      accept: ".template-item",
      ondropactivate(event) {
        event.target.classList.add("drop-active");
      },
      ondragenter(event) {
        let color = getComputedStyle(event.relatedTarget).backgroundColor;
        _this.layout.push({
          x: 0,
          y: 0,
          w: 2,
          h: 2,
          i: Math.random() + "",
          isTemplate: true,
          color
        });
      },
      ondragleave() {
        _this.layout.splice(_this.layout.length - 1, 1);
      },
      ondrop() {
        _this.layout[_this.layout.length - 1].isTemplate = false;
      },
      ondropdeactivate(event) {
        event.target.classList.remove("drop-active");
      }
    });
  }
};
</script>

<style>
aside {
  width: 180px;
  height: 800px;
  padding: 10px;
  border: 1px solid salmon;
  margin-right: 20px;
  z-index: 100;
}
main {
  border: 1px solid skyblue;
  height: 800px;
  flex: 1;
}
main.drop-active {
  border: 2px dashed skyblue;
}

.item {
  user-select: none;
}
.template-item {
  touch-action: none;
  user-select: none;
  margin-bottom: 10px;
  height: 100px;
}
#app {
  display: flex;
  position: relative;
}

.editor {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 800px;
  width: 200px;
  border: 1px solid darkmagenta;
}
</style>
