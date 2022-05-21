<template>
  <div class="flex flex-col flex-grow overflow-auto">
    <editor-content autofocus :editor="editor"></editor-content>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

@Options({
  components: { EditorContent },
})
export default class App extends Vue {
  editor: Editor | null = null;

  mounted() {
    this.editor = new Editor({
      content: "",
      extensions: [StarterKit],
      editorProps: {
        attributes: {
          class: "prose my-6 mx-auto focus:outline-none",
        },
      },
    });
  }

  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}
</script>
