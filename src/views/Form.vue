<template>
  <main class="bg-primary container-fluid vh-100">
    <section class="row">
      <template v-for="[id, { title, thumbnail }] in forms.entries()">
        <article class="col form-card-container" :key="id">
          <div
            class="form-card"
            :class="{ active: id === form }"
            @click="setForm({ id })"
          >
            <img
              :srcset="require(`@/assets/${thumbnail}`).srcSet"
              :src="require(`@/assets/${thumbnail}`).src"
              class="card-img-top"
            />
            <main class="form-card-overlay">
              <h3 class="card-title">{{ title }}</h3>
            </main>
          </div>
        </article>
      </template>
    </section>
    <section ref="container" class="row">
      <canvas ref="canvas" />
    </section>
  </main>
</template>

<script>
  import { mapState, mapMutations } from "vuex";

  import {
    AmbientLight,
    BufferGeometry,
    Color,
    DirectionalLight,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    LineDashedMaterial,
    MeshPhysicalMaterial,
    HemisphereLight,
    OrthographicCamera,
    Scene,
    Vector3,
    WebGLRenderer,
    WireframeGeometry,
    BoxBufferGeometry,
    PointLight,
    LineSegments
  } from "three";
  import { WEBGL } from "three/examples/jsm/WebGL.js";
  import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer";
  import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

  import ResizeObserver from "resize-observer-polyfill";

  const contextType = WEBGL.isWebGL2Available() ? "webgl2" : "webgl";

  const loader = new OBJLoader();

  export default {
    data: () => ({
      scene: new Scene(),
      camera: null,
      renderer: null,
      object: null,
      controls: null,
      viewport: {
        width: window.innerWidth,
        height: 300
      },
      observer: null,
      material: new MeshPhysicalMaterial({
        map: null,
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0,
        premultipliedAlpha: true
      }),
      loader: null
    }),
    computed: {
      ...mapState(["form", "forms", "color"])
    },
    methods: {
      ...mapMutations(["setForm"]),
      animate() {
        const {
          scene,
          camera,
          controls,
          renderer,
          object,
          animate,
          speed
        } = this;
        requestAnimationFrame(animate);
        camera.rotation.y = controls.getAzimuthalAngle();
        controls.update();
        renderer.render(scene, camera);
      },
      onResize(entries, observer) {
        const { camera, renderer } = this;

        for (const entry of entries) {
          const { width, height } = entry.contentRect;

          camera.left = width / -2;
          camera.right = width / 2;
          camera.top = height / 2;
          camera.bottom = height / -2;
          camera.updateProjectionMatrix();

          renderer.setSize(width, height);

          // console.log("Element:", entry.target);
          console.log(`Element's size: ${width}px x ${height}px`);
          // console.log(`Element's paddings: ${top}px ; ${left}px`);
        }
      }
    },
    watch: {
      form: {
        handler(id) {
          const { material, scene, forms } = this;

          if (this.loader) {
            this.loader.visible = true;
          }

          if (this.object) {
            scene.remove(this.object);
          }

          const { model } = forms.get(id);

          loader.load(
            model,
            object => {
              object.material = material;
              scene.add(object);

              this.object = object;
              this.loader.visible = false;
            },
            null,
            error => {
              console.error(error);
            }
          );
        },
        immediate: true
      }
    },
    created() {
      const { form, forms, scene, viewport } = this;

      const { width, height } = viewport;

      const camera = (this.camera = new OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        1,
        1000
      ));
      camera.position = new Vector3(0, 1, 500);
      camera.lookAt(scene.position);

      const light = new HemisphereLight(0xffffff, 1);
      scene.add(light);

      const geometry = new BoxBufferGeometry(300, 300, 300);
      const wireframe = new WireframeGeometry(geometry);
      const material = new LineBasicMaterial({ color: 0xffffff });
      const line = (this.loader = new LineSegments(wireframe, material));
      scene.add(line);
    },
    mounted() {
      const { $refs, viewport, camera, onResize } = this;

      const controls = (this.controls = new OrbitControls(camera, canvas));
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.maxPolarAngle = controls.minPolarAngle = Math.PI / 2;

      const { container, canvas } = $refs;
      const { width, height } = viewport;

      const context = canvas.getContext(contextType, { alpha: true });
      const renderer = (this.renderer = new WebGLRenderer({
        canvas,
        context,
        antialias: true
      }));
      renderer.setSize(width, height);

      const observer = (this.observer = new ResizeObserver(onResize));
      observer.observe(container);

      this.animate();
    }
  };
</script>

<style lang="scss">
  .form-card {
    @extend .card,
      .text-decoration-none,
      .border-0,
      .position-relative,
      .text-center,
      .w-75,
      .m-auto,
      .bg-primary;

    cursor: pointer;

    &-container {
      @extend .col-md-4, .my-5;

      & .form-card {
        @include transition($transition-move);
      }
    }

    &-overlay {
      @extend .card-img-overlay,
        .text-white,
        .d-flex,
        .flex-column,
        .justify-content-center,
        .bg-primary-semiopaque;

      @include transition($transition-fade);
      opacity: 0;
    }

    &:hover,
    &.active {
      transform: rotate(0deg) !important;

      & .form-card-overlay {
        opacity: 1;
      }
    }
  }
</style>