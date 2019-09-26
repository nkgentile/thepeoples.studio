<template>
  <article id="app">
    <nav id="menu" class="d-flex" :class="{ open: isMenuOpen }">
      <template v-for="{ name, path, meta } in menuLinks">
        <router-link
          class="menu-link"
          :class="{ disabled: meta.disabled }"
          :to="path"
          :key="name"
        >
          <span
            v-for="(letter, index) in meta.title.split('')"
            class="menu-link-letter"
            :key="`${name}-letter-${index}`"
          >
            {{ letter }}
          </span>
        </router-link>
      </template>
    </nav>
    <header
      id="toolbar"
      class="container-fluid"
      :class="[
        { 'menu-open': isMenuOpen },
        `text-${$route.meta.toolbar || 'primary'}`
      ]"
    >
      <div class="row">
        <router-link
          class="col h1 font-weight-bold text-decoration-none transition-color user-select-none"
          :class="isMenuOpen ? 'text-white' : 'text-reset'"
          to="/"
        >
          <span>accessible </span>
          <span class="font-weight-normal">studio</span>
          <small v-if="$route.meta.title" class="ml-3">{{
            $route.meta.title
          }}</small>
        </router-link>
        <svg
          id="menu-toggle"
          class="col-sm-3 col-md-2 transition-fill"
          :class="[
            { 'fill-white': isMenuOpen },
            `fill-${$route.meta.toolbar || 'primary'}`
          ]"
          xmlns="http://www.w3.org/2000/svg"
          version="1"
          viewBox="0 0 720 720"
          @click="toggleMenu"
          @mouseenter="onMenuToggleEnter"
          @mouseleave="onMenuToggleLeave"
        >
          <path ref="menuToggle" :d="menuTogglePath" />
        </svg>
      </div>
    </header>
    <router-view class="pt-5" />
  </article>
</template>

<script>
  import { pipe, filter, pathOr } from "ramda";
  import { mapGetters, mapActions } from "vuex";

  export default {
    data: () => ({
      isMenuToggleHovered: false,
      menuOpenPath: `M192 236h376c9 0 16-7 16-16v-40c0-9-7-16-16-16H192c-9 0-16 7-16 16v40c0 9 7 16 16 16zm-40 160h416c9 0 16-7 16-16v-40c0-9-7-16-16-16H152c-9 0-16 7-16 16v40c0 9 7 16 16 16zm96 160h320c9 0 16-7 16-16v-40c0-9-7-16-16-16H248c-9 0-16 7-16 16v40c0 9 7 16 16 16z`,
      menuHoverPath: `M152 236h416c9 0 16-7 16-16v-40c0-9-7-16-16-16H152c-9 0-16 7-16 16v40c0 9 7 16 16 16zm40 160h336c9 0 16-7 16-16v-40c0-9-7-16-16-16H192c-9 0-16 7-16 16v40c0 9 7 16 16 16zm-40 160h416c9 0 16-7 16-16v-40c0-9-7-16-16-16H152c-9 0-16 7-16 16v40c0 9 7 16 16 16z`,
      menuClosePath: `M427 360l100-100c12-12 12-32 0-45l-22-22a31 31 0 0 0-45 0L360 293 260 193a31 31 0 0 0-45 0l-22 22a31 31 0 0 0 0 45l100 100-100 100a31 31 0 0 0 0 45l22 22c13 12 33 12 45 0l100-100 100 100c12 12 32 12 45 0l22-22c12-13 12-33 0-45L427 360z`
    }),
    computed: {
      ...mapGetters(["isMenuOpen"]),

      menuTogglePath() {
        const {
          isMenuOpen,
          isMenuToggleHovered,
          menuOpenPath,
          menuHoverPath,
          menuClosePath
        } = this;

        if (isMenuOpen) {
          return menuClosePath;
        } else {
          return isMenuToggleHovered ? menuHoverPath : menuOpenPath;
        }
      },
      menuLinks() {
        return pipe(
          pathOr([], ["options", "routes"]),
          filter(pathOr(false, ["meta", "isInMenu"]))
        )(this.$router);
      }
    },
    methods: {
      ...mapActions(["toggleMenu"]),

      onMenuToggleEnter(event) {
        this.isMenuToggleHovered = true;
      },
      onMenuToggleLeave(event) {
        this.isMenuToggleHovered = false;
      }
    }
  };
</script>

<style lang="scss">
  #menu {
    position: fixed;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    z-index: $zindex-menu;

    @extend .d-flex,
      .flex-column,
      .flex-nowrap,
      .flex-md-row,
      .flex-md-wrap,
      .justify-content-center,
      .align-content-center;

    @extend .bg-primary;

    @include transition($transition-move);
    transform: translateY(-100%);

    &.open {
      transform: translateY(0);

      $rotation: 5deg;

      $transition: transform 500ms ease-in-out 150ms;

      & .menu-link:nth-child(odd) {
        @include transition($transition);
        transform: rotate(-$rotation);
      }

      & .menu-link:nth-child(even) {
        @include transition($transition);
        transform: rotate($rotation);
      }
    }

    &-toggle {
      max-width: 5em;
    }

    & .menu-link {
      @extend .display-2,
        .font-weight-bold,
        .text-white,
        .user-select-none,
        .text-center;

      transition: none;

      $translation: 100vw;
      $rotation: random(360) * 1deg;

      @include media-breakpoint-up(md) {
        flex: 0 0 50vw;
        &:nth-child(3n) {
          flex: 0 0 100vw;
        }
      }

      @include media-breakpoint-down(sm) {
        margin-bottom: 3 * $spacer;
      }

      &:nth-child(odd) {
        transform: translateX(-$translation) rotate(-$rotation);
      }

      &:nth-child(even) {
        transform: translateX($translation) rotate($rotation);
      }

      &.router-link-exact-active .menu-link-letter {
        position: relative;

        &::before {
          content: "";
          position: absolute;
          bottom: 0;
          @extend .bg-white, .d-block, .w-100;
          height: 0.1rem;
        }
      }

      &:not(.disabled):not(.router-link-exact-active) {
        &:hover {
          .menu-link-letter:nth-child(odd) {
            transform: translateY(-$spacer);
          }
          .menu-link-letter:nth-child(even) {
            transform: translateY($spacer);
          }
        }
      }

      &-letter {
        @extend .d-inline-block, .text-reset;

        @include transition($transition-move);
      }

      &.disabled {
        opacity: $btn-disabled-opacity;
      }
    }
  }

  #toolbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: $zindex-toolbar;
  }
</style>