<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<script>
  import {
    AmbientLight,
    BufferGeometry,
    Color,
    DirectionalLight,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    LineDashedMaterial,
    HemisphereLight,
    OrthographicCamera,
    Scene,
    Vector3,
    WebGLRenderer
  } from "three";
  import { WEBGL } from "three/examples/jsm/WebGL.js";
  import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer";
  import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

  const contextType = WEBGL.isWebGL2Available() ? "webgl2" : "webgl";

  export default {
    props: {
      path: {
        type: String,
        default: "/obj/004.obj"
      },
      speed: {
        type: Number,
        default: 0.01
      },
      color: {
        type: Number,
        default: 0xb4ddc0
      }
    },
    data: () => ({
      scene: new Scene(),
      camera: null,
      renderer: null,
      object: null,
      controls: null,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      light: null
    }),
    methods: {
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
      }
    },
    mounted() {
      const { $refs, scene, viewport, color } = this;

      const { canvas } = $refs;
      const { width, height } = viewport;

      const context = canvas.getContext(contextType, { alpha: true });
      const renderer = (this.renderer = new WebGLRenderer({
        canvas,
        context
      }));
      renderer.setSize(width, height);

      const camera = (this.camera = new OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        1,
        1000
      ));
      const light = (this.light = new DirectionalLight(color, 0.5));
      light.position.set(0, 10, 0);
      scene.add(light);

      const hemisphere = new HemisphereLight(color, 0x1d145e, 0.5);
      scene.add(hemisphere);

      camera.position = new Vector3(0, 1, 500);
      camera.lookAt(scene.position);

      const controls = (this.controls = new OrbitControls(camera, canvas));
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.maxPolarAngle = controls.minPolarAngle = Math.PI / 2;

      const loader = new OBJLoader();

      loader.load(
        this.path,
        object => {
          this.object = object;
          scene.add(object);
          this.animate();
        },
        null,
        error => {
          console.error(error);
        }
      );
    }
  };
</script>