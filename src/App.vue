<template>
  <div class="flex w-screen h-screen text-gray-700">
    <div
      class="flex flex-col flex-shrink-0 w-64 border-r border-gray-300 bg-gray-100"
    >
      <div class="h-0 overflow-auto flex-grow">
        <div class="mt-4">
          <a
            class="flex items-center h-8 text-sm pl-8 pr-3"
            href="#"
            v-for="note in notes"
            :key="note.id"
            @click="loadNote(note)"
            ><span class="ml-2 leading-none">{{
              new Date(note.created).toLocaleString()
            }}</span></a
          >
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-grow">
      <div class="flex flex-col flex-grow overflow-auto">
        <editor-content autofocus :editor="editor"></editor-content>
      </div>
      <div
        class="h-16 bg-gray-100 border-t border-gray-300 flex align-center justify-end p-2"
      >
        <button
          class="bg-transparent border-2 border-gray-600 p-2 rounded-md text-gray-600"
          @click="saveNote"
        >
          Save Note
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

@Options({
  components: { EditorContent },
})
export default class App extends Vue {
  database: IDBDatabase | null = null;

  notes: any[] = [];

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

  async created() {
    this.database = (await this.getDatabase()) as IDBDatabase;

    this.notes = ((await this.getNotes()) as any[]).sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  }

  async getDatabase() {
    return new Promise((resolve, reject) => {
      const db = window.indexedDB.open("offline_notes");

      db.onerror = () => {
        reject("Error opening database");
      };

      db.onsuccess = (e: any) => {
        resolve(e.target.result);
      };

      db.onupgradeneeded = (e: any) => {
        e.target.result.deleteObjectStore("notes");
        e.target.result.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        });
      };
    });
  }

  async saveNote() {
    return new Promise((resolve, reject) => {
      let transaction = this.database?.transaction("notes", "readwrite");

      if (!transaction) {
        reject("Error creating the transaction");
        return;
      }

      transaction.oncomplete = (e: any) => {
        resolve(e.target.result);
      };

      const note = {
        content: this.editor?.getHTML(),
        created: new Date().getTime(),
      };

      this.notes.unshift(note);
      transaction
        .objectStore("notes")
        .add(note, Math.round(Math.random() * 1000000));
    });
  }

  async getNotes() {
    return new Promise((resolve, reject) => {
      this.database!.transaction("notes", "readonly")
        .objectStore("notes")
        .getAll().onsuccess = (e: any) => resolve(e.target.result);
    });
  }

  loadNote(note: any) {
    this.editor?.commands.setContent(note.content);
  }
}
</script>
