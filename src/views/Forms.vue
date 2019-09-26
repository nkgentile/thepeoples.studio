<template>
  <main>
    <form-preview :path="forms[0].path" />
  </main>
</template>

<script>
  import { mapState } from "vuex";

  import FormPreview from "@/components/FormPreview";

  export default {
    components: {
      FormPreview
    },
    computed: {
      ...mapState(["forms", "form"])
    }
  };
</script>